# Claude code学习笔记

## 1.视频学习

### 1.1 四种权限模式
- `default`：询问授权，`Shift+Tab` 可切换到。
- `acceptEdits`：默认放行编辑，`Shift+Tab` 可切换到，`claude --permission-mode acceptEdits`
- `plan`：只分析不执行，`Shift+Tab` 可切换到，`claude --permission-mode plan`
- `bypassPermissions`：放开权限，`claude --dangerously-skip-permissions`

### 1.2 命令和配置
- `claude`：进入交互模式。
- `claude "query"`：带任务进入会话。
- `claude -c`：继续最近会话。
- `claude -r "<session-id>"`：恢复指定会话。
- `claude -p "query"`：单次执行。
- `claude doctor`：检查环境。
- `claude update`：更新版本。
- `/model`：切换模型。
- `/config`：查看/修改配置。
- `/permissions`：查看/修改权限。
- `/memory`：查看/编辑记忆。
- `/add-dir <path>`：增加工作目录。
- `/clear`：清空当前对话。
- `/compact [instructions]`：压缩上下文。
- `CLAUDE.md`：项目规则和长期上下文。
- `~/.claude/settings.json`：全局配置。
- `.claude/settings.json`：项目共享配置。

### 1.3 基础工作流
- `读项目`：先让 Claude 看目录、入口、相关文件。
- `说需求`：给目标、上下文、约束、验收。
- `先计划`：先分析再改。
- `做验证`：改完跑检查、看风险、要总结。

### 1.4 全局记忆
- `~/.claude/CLAUDE.md`：个人全局记忆。
- `./CLAUDE.md`：项目记忆。
- `@path`：导入额外说明文件。
- `/memory`：查看当前记忆来源。

### 1.5 避坑和进阶
- `/clear`：清对话，不是清屏。
- `Ctrl+L`：清屏，不清上下文。
- `/compact`：上下文过长时压缩。
- `permissions.deny`：屏蔽敏感文件。
- `claude doctor` / `/doctor`：优先排查环境问题。
- `bypassPermissions`：高风险，不做默认模式。

### 1.6 案例：
    1.大项目改造
    2.会议中编程
    3.playwright
    4.多任务并发
    5.快速理解和改造开源项目
### 1.7 使用技巧
    1.ai幻觉 - 重启
    2.版本控制
        原子化提交
        分支
        打标
    3.规划先行
    4.需求文档决定成功率 - 落档
        功能：功能描述、故事和使用场景
        技术：技术架构、数据模型、接口设计、性能指标
        实施细节：开发步骤、测试策略、部署方案
    5.项目规则记忆 .claude/CLAUDE.md
        项目开发规范：代码规范、注释规范、命名规范、版本控制规范、个人偏好、语言规范
        比如语言规范要求：文档使用中文、注释使用中文、md使用中文
    6.免授权模式
        claude --dangerously-skip-permissions
    7.多用clear即时清空上下文
        时机：完成一次独立任务、发现ai开始混淆
    8.智能的审查工作流
        三层:功能验证、AI自审、人工评审
    9.合理设定AI参与度，知道ai能力范围，避免ai能力不足
        AI擅长：
            样板代码生成
            CRUD操作
            常见设计模式
            测试用例
            文档生成
            代码重构
        人工擅长：
            复杂业务逻辑
            UI细节
            特定性能优化
            架构设计
            外部系统集成
    10.良好架构和命名重要性
        清晰代码结构和命名规范能显著提高AI的理解和代码生成效率


## day1_4:
### 命令行：
    1.claude doctor:诊断当前claude是否能正常使用
    2.claude -r:获取工作区历史会话列表且支持上下键切换
        claude -r <session-id>:恢复指定会话
        claude -r "xxx":指令搜索关键词，得到对应的会话列表，支持上下键切换
    3.claude -c:继续最近会话
    4.claude "xxx":创建一个新会话并发起内容为xxx的提问
    5.claude -p "xxx":单次执行xxx指令并输出结果后退出
### 指令：
    1./model:切换模型,只是当前会话有效

### 执行机制：
    1..claude/settings.json(项目级配置)：中配置deny不读取某个文件时的执行机制：
        步骤1：发起提问想访问xxx.md
        步骤2：claude检查settings.json中是否有deny配置，命中就不让往下走
        步骤3：没有命中，就获取claude内置能力，有Read\Write\Bash\Grep等
        步骤4：window系统执行读取任务
### 权限操作：
    Read
    Write
    Bash：执行shell命令
    Grep：内容搜索
    Glob：文件查找
    具体控制：
        Read("xxx.md")：读取xxx.md文件内容
        Bash(rm -rf *)：删除所有文件
### 权限控制和安全边界：
#### 范围大小
    1.项目级配置：.claude/settings.json
    2.全局配置：~/.claude/settings.json
    3.本地配置：.claude/settings.local.json
#### 权限临时调整
CLI 参数: 临时权限调整
    1. --dangerously-skip-permissions: 临时禁用权限检查
#### 实践：
    1.发现配置了deny: ["Read"]后还是可以读到文件，因为Glob和Bash可以读取文件内容
#### 配置范例
```
{
  "permissions": {
    "defaultMode": "default", // 默认模式,允许所有操作，还可以配置为plan\acceptEdits\bypassPermissions
    "allowedTools": [
      "Read",
      "Write",
      "Bash",
      "Grep",
      "Glob"
    ], // 允许的操作
    "deny": [
      "Read('magic.md')", // 不允许读取magic.md文件
      "Bash(rm -rf *)", // 不允许删除所有文件
      "Bash(sudo *)", // 不允许执行sudo命令
      "Bash(curl * | bash)", // 不允许执行curl命令
    ],
    "rules": [{
      "type": "deny",
      "path": "**/.env*" // 不允许读取所有环境变量文件
    }]
  }
}
```

## day5:
### 定位：
    1.Day 5 = Claude Code 扩展实践
    2.本次是扩展学习，不改前面的主学习计划
    3.day5_figma 相关实验目前还没正式完成，先作为后续重点
    4.路线：Day 5扩展结束 -> Figma/Next.js重点实验 -> 回归原学习计划主线
### 会话与输入控制：
    1./clear: 清空会话历史，开始新任务时用
    2.Esc: 中断当前回复
    3.Shift+Enter: 输入多行上下文，散记里记成了 /+enter
    4.@文件: 引用文件
    5.#: 添加记忆
    6./ide: 结合 IDE 当前文件和代码发起提问
    7.适时截图: UI 或可视化任务里补充上下文
    8./edit: 待核验，先不当成必学命令
### CLAUDE.md 与记忆：
    1./init: 初始化一个 CLAUDE.md
    2.CLAUDE.md: 可以有项目级，也可以有目录级
    3.CLAUDE.md 修改: 可以直接用提示词让 AI 帮忙改
    4.# 和记忆: 用于补长期上下文，不是普通 prompt
### commands 与权限放权：
    1..claude/commands/xxx.md: 自定义命令模板
    2./xxx 提示词: 调用对应 command 去执行内部指令
    3.commands 作用: 把固定流程沉淀成可复用入口
    4.permissions.allow: 对特定命令放权，比如 git status、git add、git commit、git diff
    5.自动提交代码: 本质上还是 command + settings 配合，而不是只靠一句 prompt
    6.实践: do-frontend-work-direct 对写入 frontend-changes*.md 确实有点效果
    7.实践: 明明放权了还是会询问，说明 command 和 settings 需要一起看
    8.经验: commands 能简化流程，但权限是否继续追问，最终还要落实到 settings.json
### skills 与 MCP：
    1.skill: 本地可复用的提示词/流程封装
    2.skill 结构: 元数据层、指令层、资源层
    3.MCP: 让 Claude Code 访问外部数据库、服务和系统
    4.skill 和 MCP 的区别: skill 解决“怎么做”，MCP 解决“能连到什么外部能力”
    5.claude mcp add <name>: 添加 MCP
    6./mcp: 查看当前 MCP 服务列表
    7.后续想法: 可以做一个流程图可视化图表的 skill 或工具
### 并行代理与并行开发：
    1.长任务先 plan: 先出实施方案，再执行
    2.子代理: 并行创建多个代理方案，用于探索不同实现路径，再对比选择
    3.git worktree add ...: 创建隔离工作区并行开发
    4.实践: 一个 worktree 调整 UI，一个 worktree 优化逻辑
    5.实践: 最后 merge 并解决冲突
    6.关键词: 并行探索、环境隔离、方案对比
### Day 5 实战记录与后续重点：
    1.已尝试: 让 AI 针对容易出问题的文件或模块做测试和排查
    2.已尝试: 重构多轮对话能力的任务设计
    3.已尝试: 子代理 + 计划 + 测试内置化的协作方式
    4.已尝试: worktree 并行 UI / 功能开发
    5.暂缓: install-github-app，涉及认证和风险，先跳过
    6.后续重点: day5_figma 的 Figma / Next.js / Playwright 组合实验
    7.说明: day5_figma 目前只是后续重点，不算当前已完成实验
    8.后续路线: 完成 Figma/Next.js 重点实验后，继续前面的学习计划
