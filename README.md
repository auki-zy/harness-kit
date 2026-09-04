# harness-template

一套面向 **agent-first 工程化**的高级仓库模板（源自 [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) 高级仓库模板，已按主人工程实践扩展）。

## 用本模板开新项目

1. 复制本仓库文件到新仓库（复制顺序见 [`index.md`](index.md)）。
2. 按落地清单执行：[`docs/BOOTSTRAP.md`](docs/BOOTSTRAP.md)（必填文档 / 必装机械配置 / 必跑验证）。

## Agent 入口

- [`AGENTS.md`](AGENTS.md)：开工流程 + 路由地图（唯一 canonical 入口）
- [`ARCHITECTURE.md`](ARCHITECTURE.md)：领域地图、分层模型、依赖规则
- 治理与规范文档集中在 `docs/`（见 AGENTS 路由地图，渐进披露）
- 技能源：[`skills/README.md`](skills/README.md)（入库标准；实战验证后逐批入库）

## 定位

- 模板仓库只放**规则与治理骨架**；依赖、配置等机械内容在 bootstrap 时落入具体项目（`docs/BOOTSTRAP.md`）。
- 默认工程基线偏前端（React + Vite + TS）；非默认栈在 `ARCHITECTURE.md` / `docs/FRONTEND.md` 声明覆盖。
