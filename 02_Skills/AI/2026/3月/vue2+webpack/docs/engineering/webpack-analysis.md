# Vue2 + Webpack 项目解析（性能优化教学版）

## 1. 项目目标

这个项目用于演示并实践以下 webpack 优化思路：
- 工程化配置拆分（`common/dev/prod`）
- 分包策略（`splitChunks` + `runtimeChunk`）
- 路由懒加载（`import()`）
- 业务重模块按需加载（ECharts）
- UI 库按需引入（Element UI）

## 2. 构建配置拆分

### 2.1 公共配置
文件：`build/webpack.common.js`

主要职责：
- 定义入口 `src/main.js`
- 定义输出目录与文件命名（含 `contenthash`）
- 配置别名（`@ -> src`）
- 处理 `vue/js/图片/字体` 资源
- 使用 `HtmlWebpackPlugin` 生成并注入 `index.html`

关键点：
- `filename` / `chunkFilename` 使用 `contenthash`，提升浏览器缓存命中率。
- `asset` + `asset/resource` 统一静态资源处理。

### 2.2 开发配置
文件：`build/webpack.dev.js`

主要职责：
- `mode: development`
- 使用 `style-loader` 做样式热更新
- `devServer` 提供本地开发服务器

关键点：
- `port: "auto"`：自动寻找空闲端口，避免 8080 被占用导致启动失败。
- `historyApiFallback: true`：支持前端路由刷新回退。

### 2.3 生产配置
文件：`build/webpack.prod.js`

主要职责：
- `mode: production`
- 压缩 JS/CSS
- 抽离 CSS
- 产物清理
- 分包与缓存策略

关键点：
- `TerserPlugin` + `CssMinimizerPlugin`：压缩体积。
- `MiniCssExtractPlugin`：把 CSS 抽成独立文件，利于缓存和并行加载。
- `runtimeChunk: "single"`：拆出运行时代码，减少业务变更带来的缓存失效。

## 3. 分包策略详解（splitChunks）

文件：`build/webpack.prod.js`

当前配置手动划分了这些包：
- `chunk-vue`：`vue` + `vue-router`
- `chunk-element-ui`：Element UI
- `chunk-echarts`：ECharts
- `chunk-vendors`：其余第三方依赖
- `chunk-common`：多处复用的业务公共模块

这样做的收益：
- 首屏只加载必要代码。
- 大型依赖独立缓存，版本不变时可长期复用。
- 业务代码改动不容易连带影响基础依赖缓存。

## 4. 按需加载实践

### 4.1 路由级懒加载
文件：`src/router/index.js`

使用：
- `const HomeView = () => import("@/views/Home.vue")`
- `const HeavyView = () => import("@/views/Heavy.vue")`

效果：
- 页面按访问时机加载，不在首屏一次性打包全部页面。

### 4.2 业务重模块动态加载
文件：`src/views/Heavy.vue`

使用：
- 在点击事件中执行 `import("echarts")`

效果：
- ECharts 仅在用户真的需要图表时才下载。
- 首屏 JS 明显更轻。

## 5. Element UI 按需引入

相关文件：
- `babel.config.js`
- `src/plugins/element.js`

做法：
- 配置 `babel-plugin-component` 自动按需引入样式。
- 在 `element.js` 中只注册使用到的组件（Button、Card、Tag 等）。

收益：
- 避免全量引入 Element UI，减少打包体积。

## 6. 你可以重点观察的构建结果

执行：

```bash
npm run build
npm run build:analyze
```

重点看：
- `dist/js` 中是否存在 `chunk-vue`、`chunk-element-ui`、`chunk-echarts`、`view-*`
- `analyze` 页面中各 chunk 体积分布是否符合预期

## 7. 建议的学习实验

1. 把 `Heavy.vue` 的 `import("echarts")` 改为顶部静态 `import`，对比打包差异。
2. 临时把 Element UI 改成全量引入，对比体积与请求数。
3. 在 `splitChunks.cacheGroups` 新增业务组（如 `chart/editor/admin`），观察 chunk 变化。
4. 尝试关闭 `runtimeChunk`，对比多次发布后的缓存命中效果。

## 8. 当前项目结论

这个项目已经覆盖了实际业务里最常用的 webpack 性能优化主线：
- 工程化配置拆分
- 第三方依赖拆包
- 页面与模块级按需加载
- 缓存友好的产物命名与运行时拆分

可以作为你后续迁移到真实项目的模板基础。
