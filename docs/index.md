# 个人知识库

<div class="hero-panel">
  <p class="hero-kicker">PARA · GitHub Pages · GitHub Actions</p>
  <h2>把日常记录、项目沉淀与职业资料，整理成一个可在线浏览、自动更新的个人知识库。</h2>
  <p>
    这里既是内容入口，也是流程面板：每次推送都会自动经过检查、测试、目录生成、
    站点构建与正式部署。
  </p>
  <div class="quick-links">
    <a class="quick-link" href="_generated/index.md">进入知识库总览</a>
    <a class="quick-link secondary" href="setup.md">查看部署说明</a>
  </div>
</div>

<div class="workflow-grid">
  <section class="workflow-card">
    <h3>内容入口</h3>
    <p>知识库原始内容继续放在你的 PARA 目录里，站点负责把它们整理成更适合浏览的结构。</p>
  </section>
  <section class="workflow-card">
    <h3>自动化检查</h3>
    <p>CI 会先执行 YAML、Python、Markdown 检查和 pytest，再进行站点 dry-run 构建。</p>
  </section>
  <section class="workflow-card">
    <h3>正式发布</h3>
    <p>只有主分支通过 CI 后，CD 才会重新构建并把最新静态产物发布到 GitHub Pages。</p>
  </section>
</div>

## 当前站点能力

| 能力 | 说明 | 入口 |
| --- | --- | --- |
| 知识库总览 | 自动聚合顶层目录、最近更新与内容概要 | [打开总览](_generated/index.md) |
| 部署说明 | 记录本地到线上站点的完整发布步骤 | [查看说明](setup.md) |
| GitHub 跳转 | 目录页和文件页中可以直接回到 GitHub 原文 | 构建后自动生成 |

## 当前流水线

1. 你在本地更新 Markdown、脚本或站点配置。
2. 推送代码后，`CI` 会自动执行检查、测试和预构建。
3. 如果是 Pull Request，CI 会上传一个站点构建产物供你检查。
4. 如果是 `main` 分支 push 且 CI 成功，`Deploy GitHub Pages` 会正式发布线上站点。
