# TS + Vue 3 + Vite + Rollup Lab

这个项目用于学习：开发阶段使用 Vite，构建阶段理解 Rollup。

## Scripts
- `npm run dev`：Vite 开发服务器（快）
- `npm run build`：Vite 生产构建（底层走 Rollup）
- `npm run preview`：本地预览生产包
- `npm run typecheck`：TypeScript 类型检查
- `npm run build:rollup`：直接使用当前 `rollup.config.js` 构建（对照学习）

## 核心学习文件
- `src/main.ts`：Vue 应用入口
- `src/App.vue`：最小手写路由（hash）
- `src/views/HomeView.vue`：父组件状态
- `src/components/CounterPanel.vue`：子组件 props + emits
- `vite.config.ts`：Vite 配置 + `build.rollupOptions`
- `rollup.config.js`：纯 Rollup 插件链对照
- `tsconfig.json`：TS 编译与类型规则

## 关键认知
- Vite `dev` 不做整包打包，按需转换，启动和热更新更快。
- Vite `build` 会调用 Rollup，所以 `build.rollupOptions` 就是 Rollup 学习入口。
- 这个项目同时保留 `rollup.config.js`，便于你对比两种模式。