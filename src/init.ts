import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export interface InitOptions {
  /** 目标目录（将合并进 harness 工程层） */
  dir: string;
  /** 合并后是否执行 `git init`（默认否；不做 commit，首次提交由用户决定） */
  git?: boolean;
}

export interface InitResult {
  created: string[];
  conflicts: string[];
}

/** 递归列出目录下所有文件（返回相对路径，'/' 分隔，排序稳定） */
function listFilesRecursive(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string, prefix: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs, rel);
      } else if (entry.isFile()) {
        out.push(rel);
      }
    }
  };
  walk(root, '');
  return out.sort();
}

/** 内置模板快照目录（开发态与打包态均为 <包根>/template） */
export function resolveTemplateDir(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'template');
}

/**
 * 将模板快照合并进目标目录：只新增、不覆盖；已存在的文件记入 conflicts。
 */
export function initProject(opts: InitOptions): InitResult {
  const target = path.resolve(opts.dir);
  mkdirSync(target, { recursive: true });

  const tpl = resolveTemplateDir();
  if (!existsSync(tpl)) {
    throw new Error(`模板快照不存在：${tpl}（请先同步 template/）`);
  }

  const created: string[] = [];
  const conflicts: string[] = [];
  for (const rel of listFilesRecursive(tpl)) {
    const dest = path.join(target, rel);
    if (existsSync(dest)) {
      conflicts.push(rel);
    } else {
      mkdirSync(path.dirname(dest), { recursive: true });
      copyFileSync(path.join(tpl, rel), dest);
      created.push(rel);
    }
  }

  if (opts.git) {
    runGitInit(target);
  }
  return { created, conflicts };
}

/** 在目标目录执行 `git init -b main`（失败抛错，由上层提示） */
export function runGitInit(dir: string): void {
  const res = spawnSync('git', ['init', '-b', 'main'], { cwd: dir, encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(`git init 失败：${(res.stderr ?? res.stdout ?? '').trim()}`);
  }
}
