import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** 各编码 agent 在项目内的技能目录（canonical 源在 skills/ 或外部，此处安装为副本） */
export const AGENT_SKILL_DIRS = {
  claude: (root: string): string => path.join(root, '.claude', 'skills'),
  cursor: (root: string): string => path.join(root, '.cursor', 'skills'),
} as const;

export type AgentId = keyof typeof AGENT_SKILL_DIRS;

export interface InstallSkillOptions {
  /** 技能目录（内含 SKILL.md）的本地路径 */
  source: string;
  /** 目标项目根目录 */
  dir: string;
  /** 要装到哪些 agent（claude / cursor） */
  agents: AgentId[];
}

export interface SkillInstallResult {
  agent: AgentId;
  skillName: string;
  target: string;
  installed: boolean; // false = 已存在，跳过
}

/** 校验技能目录并解析技能名：SKILL.md frontmatter 的 name 优先，否则用目录名 */
export function resolveSkillName(source: string): string {
  const skillMd = path.join(source, 'SKILL.md');
  if (!existsSync(skillMd)) {
    throw new Error(`不是技能目录（缺 SKILL.md）：${source}`);
  }
  const head = readFileSync(skillMd, 'utf8').split('\n').slice(0, 40).join('\n');
  const m = head.match(/^name:\s*"?([^"\s]+)"?\s*$/m);
  return (m?.[1] || path.basename(path.resolve(source))).trim();
}

/** 把技能复制（install）到目标项目各 agent 的技能目录；已存在则跳过不覆盖 */
export function installSkill(opts: InstallSkillOptions): SkillInstallResult[] {
  const root = path.resolve(opts.dir);
  if (!existsSync(root)) {
    throw new Error(`目标项目目录不存在：${root}`);
  }
  const source = path.resolve(opts.source);
  const skillName = resolveSkillName(source);

  return opts.agents.map((agent) => {
    const agentDir = AGENT_SKILL_DIRS[agent](root);
    mkdirSync(agentDir, { recursive: true });
    const target = path.join(agentDir, skillName);
    if (existsSync(target)) {
      return { agent, skillName, target, installed: false };
    }
    cpSync(source, target, { recursive: true });
    return { agent, skillName, target, installed: true };
  });
}
