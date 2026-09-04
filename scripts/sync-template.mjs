#!/usr/bin/env node
// sync-template：把 harness-template@main 同步进 template/ 并记录上游 commit sha。
// 供本地 `npm run sync:template` 与 CI（.github/workflows/template-sync-release.yml）使用。
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import https from 'node:https';

const REPO = process.env.HK_UPSTREAM_REPO || 'auki-zy/harness-template';
const BRANCH = 'main';
const TEMPLATE_DIR = path.resolve('template');
const VERSION_FILE = path.join(TEMPLATE_DIR, '.template-version');
const FORCE = process.argv.includes('--force');

function latestSha() {
  return new Promise((resolve, reject) => {
    const token = process.env.GITHUB_TOKEN || process.env.HK_TOKEN || '';
    const headers = { 'User-Agent': 'harness-tool-sync', Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    https
      .get({ hostname: 'api.github.com', path: `/repos/${REPO}/commits/${BRANCH}`, headers }, (res) => {
        let b = '';
        res.on('data', (c) => (b += c));
        res.on('end', () => {
          try {
            const j = JSON.parse(b);
            if (!j.sha) throw new Error(`body: ${b.slice(0, 200)}`);
            resolve(j.sha);
          } catch {
            reject(new Error(`无法解析上游 commit（HTTP ${res.statusCode}）：${b.slice(0, 200)}`));
          }
        });
      })
      .on('error', reject);
  });
}

const log = (msg) => console.log(`[sync-template] ${msg}`);

const current = existsSync(VERSION_FILE) ? readFileSync(VERSION_FILE, 'utf8').trim() : '';
const sha = await latestSha();
log(`上游 ${REPO}@${BRANCH} = ${sha}${current ? `；本地快照 = ${current}` : '（无本地快照）'}`);
if (sha === current && !FORCE) {
  log('无更新，跳过（可用 --force 强制重同步）');
  process.exit(0);
}

const tmp = mkdtempSync(path.join(tmpdir(), 'hk-tpl-'));
try {
  // Windows 沙箱需要显式 openssl 后端；Linux/macOS 只有系统自带后端，不能传该参数
  const cloneArgs =
    process.platform === 'win32'
      ? ['-c', 'http.sslBackend=openssl', 'clone', '--depth=1', '--branch', BRANCH, `https://github.com/${REPO}.git`, tmp]
      : ['clone', '--depth=1', '--branch', BRANCH, `https://github.com/${REPO}.git`, tmp];
  const r = spawnSync('git', cloneArgs, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('git clone 上游失败');
  rmSync(path.join(tmp, '.git'), { recursive: true, force: true });
  rmSync(TEMPLATE_DIR, { recursive: true, force: true });
  mkdirSync(TEMPLATE_DIR, { recursive: true });
  for (const entry of readdirSync(tmp)) {
    cpSync(path.join(tmp, entry), path.join(TEMPLATE_DIR, entry), { recursive: true });
  }
  writeFileSync(VERSION_FILE, `${sha}\n`);
  log(`已同步顶层条目：${readdirSync(TEMPLATE_DIR).join(', ')} -> ${sha}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
