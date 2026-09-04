# harness-tool

给新项目一键带上 **harness 工程层**（AGENTS/docs 治理/工程规范/skills 源目录）的命令行工具。

- 本项目是 **dogfood 实战 #1**：由 [`harness-template`](https://github.com/auki-zy/harness-template) v1 初始化，本仓库自身就在用它自己的治理流程（AGENTS/BOOTSTRAP/计划）。
- 发布名定为 **harness-tool**（npm 裸名 `harness-init` 已被他人占用——见 [`docs/references/competitor-notes.md`](docs/references/competitor-notes.md)）。
- 状态：v1 已实现 `init`（合并不覆盖）与 `doctor`（就绪自检），本地端到端验证通过；见当前 active plan。

## 用法

```bash
harness-tool init my-app      # 把模板快照合并进 my-app（只新增不覆盖，冲突列出）
harness-tool init . --git     # 合并 + git init
harness-tool doctor           # 自检当前(harness)目录：关键文件/占位符/机械配置/plan/git
```

## 与同名项目的区别（一句话）

npm 上已有 `harness-init`（Claude Code 权限配置初始化器）与 `harness-cli`（多项目任务编排器）；**本项目的定位是"工程化治理模板分发器"**——把规则/规范/流程文档与机械配置基线带进新项目，不绑定某家工具、不做任务编排。调研与借鉴点见 [`docs/references/competitor-notes.md`](docs/references/competitor-notes.md)。

## Agent 入口（本仓库治理）

- [`AGENTS.md`](AGENTS.md)：开工流程 + 路由地图（canonical 入口）
- [`ARCHITECTURE.md`](ARCHITECTURE.md)：系统形态与分层
- 落地清单：[`docs/BOOTSTRAP.md`](docs/BOOTSTRAP.md)；当前计划：[`docs/exec-plans/active/`](docs/exec-plans/active/)
