# Webpack Markdown Demo

这份文件用于演示：

1. `.md` 文件如何被 webpack 识别
2. 为什么这次不需要额外安装 loader
3. `asset/source` 会把文件内容当作字符串导入

## 这条链路会发生什么

- 页面组件里写 `import markdownText from "@/content/webpack-learning-note.md"`
- webpack 命中 `.md` 规则
- `type: "asset/source"` 让文件原文作为字符串导出
- 组件拿到字符串后，展示到页面里

## 这个实验想让你记住什么

- 新资源需求先判断：模块转换、构建流程扩展，还是 webpack 内置能力就够
- 不是所有资源类型都必须加 loader
- webpack5 的资源模块能力值得优先考虑
