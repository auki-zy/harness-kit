# 竞品/同名项目调研笔记（2026-09-03）

> 调研对象：npm registry 上与"harness 初始化/脚手架"同名的包；目的：避免撞名混淆、找出可借鉴能力、明确本项目定位差异。
> 结论先行：两个近名项目理念接近但**都不做"工程化治理文档模板分发"**，本项目差异化空间明确。

## 同名/近名包一览

| npm 包 | 版本/时间 | 作者 | 是什么 | 相关度 |
|--------|----------|------|--------|--------|
| `harness-init` | 1.2.7 / 2026-05 | eugene.eee.iskra | AI 代理 harness 初始化器：生成 `CLAUDE.md` + `.claude/settings.json` + `.claude/profiles/`（default/plan/acceptEdits/bypassPermissions）+ `global-commands/*.md`（init/doctor/context-init）。绑定 Claude Code | 🟡 同类但窄（只做 Claude 权限档） |
| `harness-cli` | 0.1.0 / 2026-03 | CHENXCHEN | 多项目/多目标 AI 工作流编排 CLI：goal→task 拆分、状态持久化到文件系统（git-aware）、交互式 dashboard、agent 辅助建 goal；理念源自 Anthropic《Effective harnesses for long-running agents》 | 🟢 理念同类（编排层） |
| `create-harness` | 0.1.1 / 2020 | philcockfield | UI 组件测试 harness（uiharness），已废弃并引导到 `create-ui` | ⚪ 无关 |
| `harness` | 0.0.6 / 2012 | rsdoiel | 老式 JS 测试组织器（harness-js） | ⚪ 无关 |

## 可借鉴能力

1. **权限档位分层**（来自 npm `harness-init` 的 profiles）：`default / plan / acceptEdits / bypassPermissions`——把"审批强度按任务类型切档"做成可切换档位。模式通用，可映射到本项目的 `SECURITY.md`/权限策略示例（不绑定 Claude）。
2. **`doctor` 自检命令**（同包）：装完 harness 后自检——必填文档是否填、五件套 scripts 是否齐、验证是否跑过。→ **已实现（2026-09-03）**：`harness-kit doctor [dir]`（关键文件 critical / 占位符·机械配置·active plan·git 警告）。
3. **目标/状态持久化 + "别把复杂工作塞进一次上下文窗口"**（来自 `harness-cli`）：与模板 `MEMORY.md`/exec-plans 理念同源；其 goal→task→文件系统存储可作为本项目将来与"长期任务编排"融合的参考（v2+ 方向）。

## 定位差异（README 与对外文案据此写）

- **本项目**：工程化治理模板的**分发器**——把 AGENTS/docs 治理、工程规范（FSD/测试/CI/Review）、技能源目录、BOOTSTRAP 流程带进新项目；工具中立、面向"agent-first 工程化仓库"。
- **不做**：不绑定单一工具（非 Claude-only）、不做任务编排 runtime、不代填产品内容。
- **不撞**：npm 裸名 `harness-init` 已占用 → 发布名定 **`harness-kit`**（通用、不带用户名；见下命名备忘）。

## 命名备忘

- 占用：`harness-init`、`harness`、`create-harness`、`harness-cli`、`create-harness-app`、`harness-starter`、`harnesskit`、`harness-create`（均不可用）
- 决策（2026-09-03）：通用发布名定 **`harness-kit`**（npx 用法 `npx harness-kit init my-app`）；不带用户名。
  - 备选：`create-harness-project`（npm create 生态）、`init-harness`（命令即动词）
  - 提醒：FREE 名有被抢注风险，选中后尽早发 0.x 占位。
