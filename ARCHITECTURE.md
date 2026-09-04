# ARCHITECTURE.md

这份文件是系统的顶层地图。它应该保持简短，只提供最关键的结构信息，并把更深的内容指向其他文档。

> 已按 BOOTSTRAP 第 2 步填写（2026-09-03）。产品 = harness-tool CLI；本项目同时是 harness-template 的 dogfood。

## 系统形态

- 产品：harness-tool（CLI：给新项目一键带上 harness 工程层）
- 主用户流程：`npx harness-tool init [dir]` → 模板快照合并（只新增不覆盖）→ 可选 git 初始化 → 打印 BOOTSTRAP 待办
- 运行面：cli
- 产品行为真相来源：`docs/product-specs/`（暂无独立 spec，先以本文件 + active plan 为准）

## 领域地图

| 领域 | 负责什么 | 主要入口 | 对应规格 |
|------|---------|---------|---------|
| 命令面（cli） | 参数解析、帮助、子命令分派、退出码 | `src/cli.ts` | 见本文件 + plan |
| 模板分发（init） | 从 `template/` 快照合并进目标目录；只新增、冲突列出 | `src/init.ts` | 见本文件 |
| 引导（guide） | git 初始化与收尾提示（BOOTSTRAP 待办） | `src/init.ts` / CLI 输出 | 见 BOOTSTRAP |
| 模板源维护（template） | `template/` = harness-template 快照，发版前同步 | `template/` + 手动 sync | 后置 TEMPLATE_LIFECYCLE |

## 分层模型

本仓库是 Node CLI，默认链替换为：

`types/纯逻辑(init) -> 命令面(cli) -> 进程边界(node/git)`

- 模板分层规则的"方向"要求仍适用：`cli` 依赖 `init` 的纯逻辑；纯逻辑不 import CLI；git/文件系统副作用集中在 init 层内部，便于测试注入。

## 硬性依赖规则

- 低层不能依赖高层：`init.ts` 不依赖 `cli.ts`。
- 文件系统与 git 副作用必须可测（接受注入目标目录；git 执行可被替换/跳过）。
- 共享 util 保持通用，不堆领域逻辑。
- 新依赖要在 plan 或 design doc 里说明理由（v1 目标零运行时依赖）。

## 横切接口

| 关注点 | 允许的边界 | 备注 |
|-------|-----------|------|
| 日志与 tracing | CLI 输出（stdout/stderr） | CLI 进度走 stderr，机器可读信息走 stdout；不允许散落 console 乱打 |
| 外部进程 | git 子进程（`git init/add/commit`） | 封装在 init 内，可跳过（`--no-git` 语义/失败降级为提示） |
| 外部 API | 无（v1 零运行时依赖，模板快照本地携带） | 引入网络拉取属于 v1.1+ 决策 |
| 错误处理 | 非零退出 + stderr 说明 | 冲突不是错误（列出即可）；目标目录不可写/模板缺失才是错误 |

## 当前热点

- `template/` 快照与上游 harness-template 的漂移（靠发版前手动 sync + 版本化收敛）
- 合并语义：未来目标目录已是 harness 项目时（重复 init），应给出"已存在 harness 层"的明确提示（v1.1 候选）

## 变更检查

当你修改了会影响架构的代码：

1. 如果领域地图或允许边界变了，就更新这份文件。
2. 如果背后的设计理由变了，就更新 `docs/design-docs/` 里的相关文档。
3. 如果规则应该机械执行，就补一个可执行检查。
