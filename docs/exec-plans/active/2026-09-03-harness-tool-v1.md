# 计划：harness-tool v1（dogfood 实战 #1）

## 目标

做出 `init` 命令：一条命令把 [harness-template](https://github.com/auki-zy/harness-template) v1 的工程层（AGENTS/docs 治理、工程规范、skills 源目录）合并进新项目目录——**只新增、不覆盖已有文件**，随后打印 BOOTSTRAP 待办。本项目自身即用 harness-template 流程管理（dogfood）。

## 范围

- `init [dir]`：拉取模板文件（v1 采用**打包进 npm 的快照** `template/`，由 sync 脚本从 harness-template 更新）→ 合并（冲突跳过并列出）→ 可选 `git init` + 首次 commit → 打印 BOOTSTRAP 待办清单。
- 机械配置五件套（package.json scripts `dev/build/typecheck/lint/test`、tsconfig strict、ESLint+Prettier、Vitest）装配进本项目（本仓库自身的落地，而非 init 产物）。
- 本仓库按 BOOTSTRAP 填 ARCHITECTURE 形态/PRODUCT_SENSE 摘要。

## 明确不做（v1）

- 不自动安装机械配置到目标项目（留给提示与后续 `--full`）。
- 不做 `--stack vite-react-ts` 的自动脚手架（可手动 `npm create vite` 后 init）。
- 不发布 npm（先本地 `npm link`/`npx .` 验证）。

## v1.1 候选（已调研，登记备选）

- `harness doctor` 自检子命令（必填文档/五件套 scripts/验证路径是否齐）——借鉴 npm `harness-init` 的 doctor 概念。
- 权限档位示例（default/plan/approval 档位语义，工具中立）随模板 references 分发——借鉴其 profiles 分层。
- `--stack` 支持（内部 spawn `npm create vite` 等后合并）。
- 发布名 **`harness-tool`**（2026-09-03 定：通用、不带用户名、registry FREE；尽早发 0.x 占位防抢注）。

## 验证路径

- 本仓库：`typecheck && lint && test`（Vitest）绿；`build` 出可执行产物。
- 行为验证：在空目录跑 `node bin/xxx.js init <tmp>` → 文件树=模板子集、已存在文件未被覆盖、冲突列表正确、提示打印。
- 链接自检：md 相对链接可解析（临时脚本校验，不改模板）。

## 风险与 blocker

- 沙箱内 git 推送用 Authorization 头（wincred 偶发被沙箱限制），仅影响发布动作。
- 模板与 init 产物漂移：靠 `sync:template` 脚本 + 版本化快照收敛（后置 TEMPLATE_LIFECYCLE 思路）。

## 进度日志

- 2026-09-03：从 harness-template v1(71b657d) 初始化（5a2c47f）；建 GitHub 私有远端并推送（原名 harness-init，后统一改名 **auki-zy/harness-tool**）；完成同名项目调研（`docs/references/competitor-notes.md`）；登记 v1.1 候选。
- 2026-09-03（v1 骨架落地）：填 `ARCHITECTURE.md` 系统形态/领域地图/CLI 分层；搭代码骨架——package.json（五件套 scripts）、tsconfig strict、eslint(TS)、vitest + `src/{cli.ts,init.ts}`（init：只新增不覆盖+冲突列表+`--git` 可选+提示清单）+ 3 个测试；`template/` 快照 32 文件已同步；**typecheck/lint/build/test 全绿**；行为验证：init 新建 32 文件、重复 init 0 写入 32 冲突不覆盖、未知命令 exit 1。注：vitest 用 threads 池（沙箱禁止 fork worker）。
- 2026-09-03（v1.1 doctor 落地）：新增 `doctor` 子命令（`src/doctor.ts`：关键文件 critical / 占位符·机械配置·active plan·git 警告），6/6 测试全绿；**本地端到端验证**：消费目录本地安装 harness-tool → `init demo` 写入 32 文件 → `doctor demo` 可开工(exit 0) → `doctor empty` ❌1 关键(exit 1)；确认零运行时依赖（消费端仅装 1 包）。注：沙箱内无法全局 `npm link`（写全局目录被拒），用本地目录安装等价验证；真实 `npx harness-tool` 需发布后体验。
- 2026-09-04：**定版发布名 `harness-tool`**（harness-kit 因与 `harnesskit` 近似被 npm 拒绝；harness-toolkit 被他人占用）→ 目录/GitHub/包名全统一改名并强推（历史整理为 3 笔：5a2c47f → 094eb95 → 00a8ffe）；npm 认证打通（auki-zy granular token，bypass 2FA）；**已发布 0.1.0 占位并上线**。
- 下一步：用 harness-tool 开第一个真实目标项目并回填卡点 → v1.1 余项（--stack、权限档位示例、skills 安装范式按 agent-install 模式）。

## 开放决策

- init 产物是否默认 `git init` 并生成首条 commit（倾向：可选项 `--git`，默认不开）。
- 模板快照同步频率（每次发版前 `sync:template` 手动跑，暂不接 CI）。
