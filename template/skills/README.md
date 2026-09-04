# skills/ 技能源目录

> 随模板分发的**通用技能源**（canonical）：每个技能一份 `SKILL.md`，随项目 bootstrap 复制到工具的技能目录使用。
> 与 `AGENT_TOOLING.md` 分工一致：这里是"源"，工具目录（Cursor `.cursor/skills` / Claude Code `.claude/skills` / DSH 等）是"安装视图"。

## 唯一原则

**模板只收"在至少一个真实项目里被验证过"的技能**——入库必须带使用证据与理由；禁止"收藏夹式"集成（收藏 = 维护负担 + 每个新项目的噪音）。

## 目录结构

```text
skills/
├── README.md            # 本文件：清单/标准/安装
└── <skill-name>/
    └── SKILL.md         # frontmatter: name + description；正文 = 该技能的操作步骤
```

`SKILL.md` 骨架（新技能照此写）：

```markdown
---
name: skill-短横线名
description: 一句话说明何时该用（触发条件尽量具体、可判定）
---

# <技能名>

## 适用场景
（触发条件；不适用时明说）

## 步骤
1. …
2. …

## 验证
（最小可验证命令或 checklist——没有验证路径的技能不入库）

## 关联
（相关 docs 规则 / 流程链接，避免与 docs 重复维护）
```

## 入库 checklist（全部满足才允许放进本目录）

- [ ] 通用性：不绑定单一项目或公司流程（绑定类放个人技能目录）
- [ ] 可判定触发：`description` 能让人/agent 判断"什么时候该用"
- [ ] 有验证路径：自带最小验证（命令或 checklist）
- [ ] 体积小、依赖少：SKILL.md + 少量脚本，不拖运行环境
- [ ] 不与 docs 规则重复：操作步骤 → 技能；规则/约束 → docs
- [ ] **使用证据**：在 ≥1 个真实项目跑通过（记录项目与日期）

## 安装 / 发现

- **一键安装**：`harness-tool skills install ./skills/<name> [--agents claude,cursor]`——把技能装到对应工具的技能目录（默认 `.claude/skills`、`.cursor/skills`；已存在跳过，幂等）。详见 [harness-tool](https://github.com/auki-zy/harness-tool) 的 `skills install`。
- 手工方式：bootstrap 时按需复制到目标工具目录（详见 `docs/BOOTSTRAP.md` §技能）；仓库内 `skills/` 始终是源，项目里只放副本/引用。
- 发现路径：本 README 列当前技能清单；agent 开工时由 `AGENTS.md` 路由或工具视图引用。

## 当前技能清单

（v1：暂无内置技能。第一批在"用模板开第一个真实项目"后，按本 checklist 逐批回填。）
