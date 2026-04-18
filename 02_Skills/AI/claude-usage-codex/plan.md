# Claude Code 从 0 到 AI 工程化的 14 天学习计划

## Summary

这份计划按默认条件设计：`2 周内建立体系`、`Claude Code 实战优先`、`按天拆解`、`每 1-2 天产出一个小项目或自动化成果`。  
目标不是只会几个命令，而是建立一套完整心智模型：`Claude Code 使用` + `agent 自动化` + `程序员能力升级路径`。

现状判断：AI 编程已经从“补全代码”进入“能读仓库、调工具、跑脚本、接 CI、做多代理分工”的阶段，但还没有进入“完全无人监督、长期稳定交付”的阶段。真正高价值的程序员能力，正在从“自己写完所有代码”转向“定义目标、设计上下文、约束权限、拆分任务、验收结果、把流程自动化”。

## 当前环境基线

已确认当前机器具备以下基础环境：

- `claude --version` -> `2.1.111 (Claude Code)`
- `node --version` -> `v22.19.0`
- `git --version` -> `2.48.1.windows.1`

当前状态说明：

- Claude Code、Node、Git 已安装，可直接开始 Day 1 和 Day 2。
- `claude doctor` 在当前沙箱/权限环境下未完成，建议你后续在本机交互终端手动再跑一次，作为 Day 1 的最终确认项。
- 当前学习目录是独立空目录，适合直接作为 Claude Code 学习实验场。

## 你要掌握的核心对象

你这 2 周要反复使用并最终能独立配置这些对象：

- `claude` / `claude -c` / `claude -r <session-id>` / `claude -p`
- `CLAUDE.md`
- `.claude/settings.json` 与 `.claude/settings.local.json`
- `.claude/skills/<skill-name>/SKILL.md`
- `.claude/agents/<agent-name>.md`
- `.mcp.json` 与 `claude mcp ...`
- hooks
- `/loop` 与 scheduled tasks
- Claude Code SDK / headless mode
- `.github/workflows/claude.yml` 或等价 GitHub Actions 工作流

## 14-Day Plan

- Day 1：完成环境基线。安装 Claude Code、确认 Node/Git/终端可用、跑 `claude doctor`、建立第一个测试目录；学习 Claude Code 是“终端里的 agent”而不是“聊天框插件”；产出《环境准备清单》。
- Day 2：掌握最基础 CLI。练习 `claude`、`claude "task"`、`claude -c`、`claude -r <session-id>`、`claude -p`；明确会话续接、指定恢复、非交互执行三种入口；产出《Claude CLI 速查卡》。
- Day 3：学习高质量任务描述。创建第一个 `CLAUDE.md`，把项目背景、代码规范、测试要求、交付标准写进去；练习“目标 + 约束 + 验收”的提示方式；小练习是让 Claude 在空项目中生成一个简单前端页面。
- Day 4：学习权限与安全边界。理解 permission modes、`allowedTools`/`disallowedTools`、本地与项目级配置；把“能不能让 AI 自动跑”转化为“在哪些边界内自动跑”；产出一份个人默认安全策略。
- Day 5：学习 hooks。实现至少 1 个自动动作，例如修改代码后自动格式检查，或阻止改动敏感文件；理解 deterministic automation 和纯 prompt automation 的区别；小练习是做一个“写完代码自动检查”的微流程。
- Day 6：学习 skills。创建 2 个个人 skill：一个用于“需求转任务分解”，一个用于“代码审查/总结”；理解 skill 适合沉淀流程，而不是替代 `CLAUDE.md`；产出你的第一个 `SKILL.md` 目录结构。
- Day 7：学习 subagents。创建至少 2 个 agent，例如 `frontend-builder` 和 `code-reviewer`；练习把一个任务拆成“主代理负责目标、子代理负责专项”；小练习是让一个 agent 生页面、另一个 agent 做 review。
- Day 8：学习 MCP。接入 1-2 个你真实会用的外部工具，优先选 GitHub、文档、部署平台或数据库之一；理解 Claude Code 从“会写代码”升级为“能调你工具链”的关键就在 MCP；产出一份《我自己的 MCP 组合清单》。
- Day 9：学习 headless mode 与脚本化。用 `claude -p --output-format json` 做一次非交互执行；把一个固定任务包装成脚本，例如“读 issue -> 输出实现计划”；理解从“人工聊天”到“命令式 agent 调用”的过渡。
- Day 10：学习长执行与循环任务。重点掌握 `/loop` 和 scheduled tasks；明确“会话内持续执行”与“跨重启持久运行”是两回事；小练习是让 Claude 每 5-10 分钟轮询一次构建/部署结果并汇报。
- Day 11：学习 GitHub Actions 自动化。接入 Claude Code GitHub Action，体验 `@claude` 驱动 issue/PR 工作流；理解真正的“自动完成一个完整项目”不是单轮 prompt，而是 `CLAUDE.md + skills + agents + MCP + CI` 的组合。
- Day 12：做一个前端小项目冲刺。建议项目为“单页产品官网 / 作品集 / Dashboard 原型”三选一；要求 Claude 从需求、页面、组件、测试到部署建议走完一遍；你负责验收与纠偏，不追求一次全自动成功。
- Day 13：做一次“从需求到发布”的完整演练。把任务拆成：需求澄清、计划、实现、测试、修复、生成 PR 文案、准备发布说明；如果发布条件不具备，至少做到 CI 通过和可部署状态；产出《完整交付流水线图》。
- Day 14：做能力复盘与方法论沉淀。总结你自己的 3 层工作法：`手工协作`、`半自动执行`、`全流程编排`；明确以后每做一个项目时，哪些内容写入 `CLAUDE.md`，哪些做成 skill，哪些交给 agent，哪些放进 CI；产出《我的 AI 编程操作系统 v1》。

## Acceptance Criteria

- 你能准确区分并实际使用 `claude -c`、`claude -r`、`claude -p`。
- 你能独立写出一个有效的 `CLAUDE.md`，让 Claude 在新项目里按你的规范工作。
- 你至少做出 2 个 personal skills、2 个 subagents、1 个 hook、1 个 MCP 接入。
- 你能把一个固定任务改造成脚本化或 CI 化执行，而不只是手动聊天。
- 你能解释“为什么 `/loop` 不是无限持久后台系统”，并知道什么时候换成 scheduled tasks、GitHub Actions 或 SDK。
- 你完成至少 1 个真实小项目，从需求到测试/部署建议走完闭环。
- 你能说清楚程序员能力升级的 5 个重点：任务拆解、上下文设计、权限边界、自动化编排、结果验收。

## Assumptions And Defaults

- 默认你的起点是“会编程、会终端，但没系统学过 Claude Code”。
- 默认学习环境是 Windows，但长期建议优先转向 `WSL + Git + Node` 的稳定组合。
- 默认主线是“先会用 Claude Code，再理解 AI 编程范式升级”，不是先做纯理论研究。
- 默认每 1-2 天必须有一个看得见的产物，避免只看文档不落地。
- 命令基线按 `2026-04-17` 当前官方能力理解：`claude -c` 是继续当前目录最近会话，`claude -r <session-id>`/`--resume` 是恢复指定会话，`claude -p` 是非交互入口。
- “永不停歇的长执行”默认拆成三层：会话内轮询用 `/loop`；需要跨会话持久运行用 scheduled tasks；需要工程级可靠性用 GitHub Actions 或 SDK 编排。
- 推荐先学“个人工作流”，再学“团队共享配置”；顺序是 `CLAUDE.md -> settings -> hooks -> skills -> agents -> MCP -> CI/SDK`。

## Reference Basis

- CLI：<https://code.claude.com/docs/en/cli-usage>
- Settings：<https://code.claude.com/docs/en/settings>
- Hooks：<https://code.claude.com/docs/en/hooks>
- Subagents：<https://code.claude.com/docs/en/sub-agents>
- MCP：<https://code.claude.com/docs/en/mcp>
- Skills：<https://code.claude.com/docs/en/skills>
- Scheduled tasks：<https://code.claude.com/docs/en/scheduled-tasks>
- GitHub Actions：<https://docs.anthropic.com/en/docs/claude-code/github-actions>
- SDK：<https://docs.anthropic.com/en/docs/claude-code/sdk>
