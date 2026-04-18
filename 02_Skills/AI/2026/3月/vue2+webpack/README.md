# Vue2 + Webpack 性能优化教学项目

一个可直接运行的教学项目，聚焦你在实际项目最常用的 webpack 优化手段：
- 分包策略（`splitChunks` + `runtimeChunk`）
- 组件库按需加载（`element-ui@2.13.2` + `babel-plugin-component`）
- 路由级懒加载（`import()`）
- 重模块动态加载（ECharts 示例）
- 工程化配置拆分（`common/dev/prod`）

## 1. 运行项目

```bash
npm install
npm run dev
```

默认地址：`http://localhost:8080`

## 2. 打包与分析

```bash
npm run build
npm run build:analyze
```

`build:analyze` 会打开 bundle 分析页面，直观看各 chunk 的体积和依赖来源。

## 3. 目录结构

```text
build/
  webpack.common.js   # 基础配置：入口/输出/别名/js&vue 规则
  webpack.dev.js      # 开发配置：devServer/sourceMap/style-loader
  webpack.prod.js     # 生产配置：压缩/抽离 css/splitChunks
src/
  main.js
  App.vue
  plugins/element.js  # Element UI 按需注册
  router/index.js     # 路由懒加载
  views/
    Home.vue
    Heavy.vue         # 动态 import('echarts') 示例
```

## 4. 重点学习点（建议顺序）

1. 先看 `build/webpack.prod.js`
- `runtimeChunk: 'single'`：把运行时代码拆出来，提升长期缓存命中。
- `splitChunks.cacheGroups`：手动拆出 `vue`、`element-ui`、`echarts`、`vendors`。

2. 看 `src/router/index.js`
- 路由组件改为 `() => import(...)`，实现页面级按需加载。

3. 看 `src/views/Heavy.vue`
- 在用户交互时 `import('echarts')`，把重依赖延后到真正需要时下载。

4. 看 `babel.config.js` + `src/plugins/element.js`
- 只引入实际使用的 Element 组件和样式，避免全量打包。

## 5. 可继续练习

- 给 `splitChunks.cacheGroups` 新增业务分组（例如 `chart`, `editor`, `admin`）。
- 对比以下两种构建结果：
  1) 全量引入 Element UI
  2) 当前按需引入
- 把 `Heavy.vue` 拆成多个异步组件，观察 chunk 变化。
