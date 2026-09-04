import { describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { initProject } from './init.js';
import { doctorProject } from './doctor.js';

function makeTmp(): string {
  return mkdtempSync(path.join(tmpdir(), 'harness-kit-doctor-'));
}

describe('doctorProject', () => {
  it('init 后的目录：关键文件齐备、可开工（0 关键缺失）', () => {
    const tmp = makeTmp();
    try {
      initProject({ dir: tmp });
      const res = doctorProject(tmp);
      const key = res.checks.find((c) => c.name === 'harness 关键文件');
      expect(key?.ok).toBe(true);
      expect(res.criticalFails).toBe(0);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('init 后的模板仍带占位符与缺机械配置 → 非关键警告', () => {
    const tmp = makeTmp();
    try {
      initProject({ dir: tmp });
      const res = doctorProject(tmp);
      const placeholder = res.checks.find((c) => c.name === '占位符填写');
      expect(placeholder?.ok).toBe(false);
      expect(placeholder?.critical).toBe(false);
      const mech = res.checks.find((c) => c.name === '机械配置');
      expect(mech?.ok).toBe(false);
      expect(mech?.critical).toBe(false);
      expect(res.criticalFails).toBe(0);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('空目录：关键文件缺失 → 不可开工', () => {
    const tmp = makeTmp();
    try {
      const res = doctorProject(tmp);
      expect(res.criticalFails).toBeGreaterThan(0);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
