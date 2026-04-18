<template>
  <div class="page">
    <el-card>
      <div slot="header" class="card-title">Markdown 资源引入演示</div>

      <el-alert
        type="success"
        :closable="false"
        title="目标：让 .md 文件被 webpack 识别，并作为字符串导入到页面中展示。"
      />

      <el-divider />

      <div class="summary">
        <div class="block">
          <div class="block-title">你要记住的判断</div>
          <p>1. 这次需求本质上是“某类文件如何进入依赖图并变成可用模块”。</p>
          <p>2. 它属于模块级处理，优先看 <code>module.rules</code>。</p>
          <p>3. 这次没有额外安装 loader，而是使用 webpack5 内置的 <code>asset/source</code>。</p>
        </div>

        <div class="block">
          <div class="block-title">当前页面里的 import</div>
          <pre><code>import markdownText from "@/content/webpack-learning-note.md";</code></pre>
        </div>
      </div>

      <el-divider />

      <div class="block">
        <div class="block-title">Markdown 原文展示</div>
        <pre class="markdown-preview">{{ markdownText }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script>
import markdownText from "@/content/webpack-learning-note.md";

export default {
  name: "MarkdownDemoView",
  data() {
    return {
      markdownText
    };
  }
};
</script>

<style lang="less" scoped>
.card-title {
  font-weight: 700;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.block {
  padding: 16px;
  border-radius: 12px;
  background: #f7f9fc;
}

.block-title {
  margin-bottom: 12px;
  font-weight: 700;
  color: #243b53;
}

.block p {
  margin: 8px 0;
  color: #486581;
  line-height: 1.7;
}

.block pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.block code {
  padding: 2px 6px;
  border-radius: 6px;
  background: #eef2f7;
}

.markdown-preview {
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  color: #334e68;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
