import { describe, it, expect } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { installSkill, resolveSkillName } from './skills.js';

function makeTmp(): string {
  return mkdtempSync(path.join(tmpdir(), 'hk-skills-'));
}

function makeSkill(dir: string, name: string): string {
  const p = path.join(dir, name);
  mkdirSync(p, { recursive: true });
  writeFileSync(path.join(p, 'SKILL.md'), `---\nname: ${name}\ndescription: 测试技能\n---\n# ${name}\n`, 'utf8');
  return p;
}

describe('skills install', () => {
  it('解析 frontmatter 的 name', () => {
    const tmp = makeTmp();
    try {
      const skill = makeSkill(tmp, 'my-folder');
      expect(resolveSkillName(skill)).toBe('my-folder');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('把技能安装到 claude/cursor，已存在则跳过不覆盖', () => {
    const tmp = makeTmp();
    try {
      const skill = makeSkill(tmp, 'code-review');
      const proj = path.join(tmp, 'proj');
      mkdirSync(proj, { recursive: true });

      const r1 = installSkill({ source: skill, dir: proj, agents: ['claude', 'cursor'] });
      expect(r1).toHaveLength(2);
      expect(r1.every((r) => r.installed)).toBe(true);
      for (const r of r1) expect(existsSync(path.join(r.target, 'SKILL.md'))).toBe(true);

      writeFileSync(path.join(skill, 'SKILL.md'), 'changed\n', 'utf8'); // 改源不影响已装副本
      const r2 = installSkill({ source: skill, dir: proj, agents: ['claude'] });
      expect(r2[0].installed).toBe(false);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('非技能目录（缺 SKILL.md）抛错', () => {
    const tmp = makeTmp();
    try {
      const bad = path.join(tmp, 'not-a-skill');
      mkdirSync(bad, { recursive: true });
      expect(() => installSkill({ source: bad, dir: tmp, agents: ['claude'] })).toThrow(/SKILL.md/);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
