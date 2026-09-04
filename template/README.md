# harness-template

**agent-first 工程化仓库模板** —— 一套可复制的"开工即规范"基线：AGENTS 路由 + 治理文档族 + 前端工程规范 + AI 生态接入，让你的每个项目从一开始就具备 AI 可开工、可验证、可长期演化的工程环境。

> 理念出处：[OpenAI《Harness Engineering》](https://openai.com/index/harness-engineering/) 与 [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering)（在其高级仓库模板之上，按前端工程实践扩展）。

---

## ✨ 它能给你什么

| 组 | 能力 | 对应文件 |
|----|------|---------|
| 🧭 **Agent 工作流** | 开工流程、路由地图、完成定义、收尾纪律 | `AGENTS.md`（唯一 canonical 入口） |
| 🗺 **架构真相** | 领域地图、分层模型、依赖硬规则、横切接口 | `ARCHITECTURE.md` |
| 📋 **计划与质量** | 计划生命周期、技术债、质量评分、可靠性、安全 | `docs/PLANS.md` · `docs/QUALITY_SCORE.md` · `docs/RELIABILITY.md` · `docs/SECURITY.md` |
| 🧠 **长期记忆** | 记忆分层、历史索引、收尾卫生、token 经济学 | `docs/MEMORY.md` |
| 🎨 **前端工程规范** | 栈契约（React+Vite+TS+Less Modules）、命名/文件拆分、**FSD 模块分层**、可访问性、UI 验证闭环 | `docs/FRONTEND.md` · `docs/CODE_STANDARDS.md` · `docs/MODULE_STRUCTURE.md` |
| 🧪 **验证与协作** | 测试策略、CI 门禁蓝图、Code Review 与反馈升级回路 | `docs/TESTING.md` · `docs/CI_CD.md` · `docs/REVIEW.md` |
| 🤖 **AI 生态接入** | AGENTS↔CLAUDE/`.cursor` 薄视图约定、技能源目录与入库标准 | `docs/AGENT_TOOLING.md` · `skills/` |
| 🚀 **落地流程** | 开新项目的必填文档 / 必装机械配置 / 必跑验证清单 | `docs/BOOTSTRAP.md` |

## 🚀 快速开始

```bash
# 方式一：CLI 一键（推荐）—— 把本模板的工程层装进新项目
npx harness-tool init my-app

# 方式二：GitHub Template
# 本仓库已标记为 Template → New repository → Choose a template → harness-template

# 方式三：手动复制
# 复制本仓库文件 → 按 index.md 复制顺序 → 按 docs/BOOTSTRAP.md 落地
```

装好后，最小三步开工：

1. **交给 AI**：把 `harness-tool init` 输出的那段话发给你的编码 agent（DSH / Claude Code / Cursor / Codex）；
2. **AI 照文档落地**：填 `ARCHITECTURE` / `PRODUCT_SENSE` → 装配机械配置 → 建首份 active plan；
3. **验证闭环**：`harness-tool doctor`（或本地 `typecheck && lint && test && build`）确认就绪。

## 📁 仓库布局

```text
harness-template/
├── AGENTS.md            # Agent 入口：开工流程 + 路由地图（短、只做路由）
├── ARCHITECTURE.md      # 系统顶层地图：领域地图 / 分层 / 依赖规则
├── index.md             # 模板复制顺序说明
├── README.md            # 本文件
├── docs/                # 治理与规范文档族（渐进披露，详见 AGENTS 路由地图）
│   ├── PLANS / QUALITY_SCORE / RELIABILITY / SECURITY / MEMORY …
│   ├── FRONTEND / CODE_STANDARDS / MODULE_STRUCTURE / TESTING / CI_CD / REVIEW
│   ├── BOOTSTRAP.md     # 开新项目的落地清单
│   ├── design-docs/     # 设计决策（accepted / proposed / deprecated）
│   ├── product-specs/   # 用户可见行为规格
│   ├── exec-plans/      # active / completed / tech-debt
│   ├── references/      # 面向模型的外部参考（FSD 指南、工具薄视图样例…）
│   └── generated/       # 生成物
└── skills/              # 技能源目录（入库标准；实战验证后逐批收录）
```

## ⚙️ 设计原则

- **仓库是唯一事实来源** —— agent 在仓库里找不到的事实，视为运行上不存在；
- **短入口、深链接、渐进披露** —— AGENTS 保持短，细节按需下钻，不膨胀成超长说明书；
- **机械约束优先于口头约定** —— 能交给 lint / 脚本 / CI 执行的，不靠聊天重复解释；
- **验证证据高于自信** —— 改动必须跑过验证，证据挂进 plan / 文档才算完成；
- **只收被真实项目验证过的件** —— 技能 / 规则 / 流程由"使用中的痛点"驱动增长，不做收藏夹式集成。

## 🗺 文档地图（何时读什么）

| 场景 | 先读 |
|------|------|
| 我是新 agent / 新开发者 | `AGENTS.md` → `ARCHITECTURE.md` → 当前 active plan |
| 要改 UI / 写代码 | `docs/FRONTEND.md` · `docs/CODE_STANDARDS.md` · `docs/MODULE_STRUCTURE.md` |
| 要做影响行为的改动 | `docs/product-specs/` + 对应 active plan |
| 想理解"为什么这么设计" | `docs/design-docs/index.md` · `docs/design-docs/core-beliefs.md` |
| 想看项目健康度 | `docs/QUALITY_SCORE.md` |
| 要开一个新项目 | 本仓库（Template 或 `harness-tool`）→ `docs/BOOTSTRAP.md` |
| 想了解历史背景 | `docs/MEMORY.md`（记忆分层与历史索引约定） |

## 🤝 配套工具

[`harness-tool`](https://github.com/auki-zy/harness-tool)（npm：`harness-tool`）—— 把本模板一键带进新项目的 CLI：`init`（模板快照合并不覆盖 + AI 交接提示）与 `doctor`（就绪自检）。

---

> 模板仓库只放**规则与治理骨架**；依赖、配置等机械内容在 bootstrap 时落入具体项目。默认工程基线偏前端（React + Vite + TS + Less Modules），非默认栈在 `ARCHITECTURE.md` / `docs/FRONTEND.md` 声明覆盖即可。
