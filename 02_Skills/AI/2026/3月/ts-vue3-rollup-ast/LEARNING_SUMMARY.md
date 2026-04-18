# TS + Vue3 + Rollup/Vite 学习总结（今日）

## 1. 项目演进路线

1. 先搭了一个 `TS + Vue3 + Rollup` 最小实验场。  
2. 处理中间报错（`tslib` 缺失、`.vue` 虚拟模块解析、样式处理、插件顺序）。  
3. 切换为日常更推荐的模式：  
   - 开发：`Vite dev`  
   - 构建：`Vite build`（底层仍是 Rollup）  
4. 保留 `rollup.config.js` 作为“纯 Rollup 对照学习文件”。

---

## 2. Vite 开发态核心认知

1. `npm run dev` 时不是先产出 `bundle.js`。  
2. Vite 从 `index.html` 开始解析模块图，按需转译并返回模块。  
3. `@vite/client` 建立 WebSocket，用于 HMR 通知。  
4. 改源码文件时：增量编译 -> 通知浏览器 -> 浏览器仅重新请求受影响模块。  
5. HMR 只针对“文件改动”，不是路由切换。

---

## 3. 路由切换 vs HMR

1. 当前路由是手写 `hash` 路由（`#/` / `#/about`）。  
2. `hashchange` 是浏览器事件 + 应用代码监听，与 Vite HMR 无关。  
3. 之所以切路由看不到请求：当前视图是静态导入，模块通常已在首屏加载。  
4. 若改成动态导入（懒加载），首次切换到目标路由时才会发请求。

---

## 4. Rollup 在 Vite 中的位置

1. `vite dev`：主要是按需服务与转译，不走完整打包流程。  
2. `vite build`：底层使用 Rollup。  
3. `vite.config.ts` 的 `build.rollupOptions` 是学习 Rollup 的入口。  
4. `manualChunks` = 手动分包策略（manual + chunks）。

---

## 5. `manualChunks` 实验结论

1. 配置后：`node_modules` 可被拆到 `vendor-*.js`。  
2. 注释后：`vendor-*.js` 消失，但依赖不是没了，而是合并进其他 chunk（常见是 `index-*.js`）。  
3. 价值：第三方依赖与业务代码分离，有利于缓存与更新控制。  

---

## 6. TS 在本项目中的职责

1. TS 主要负责“类型约束 + 提示 + 早发现问题”。  
2. 最终部署产物由 Vite/Rollup 构建输出，不是由 TS 直接输出。  
3. 类型错误默认不一定阻断 `vite build`（取决于你是否把类型检查串进构建流程）。

---

## 7. 为什么 `.vue` 里类型错误最初没报

1. 原脚本是 `tsc --noEmit`。  
2. `tsc` 对 `.vue` SFC 内的 TS 检查不完整。  
3. 改为 `vue-tsc --noEmit` 后，`HomeView.vue` 的类型错误被正确识别。  

---

## 8. 当前脚本与学习用法

1. `npm run dev`：Vite 开发模式（快速迭代）。  
2. `npm run build`：Vite 生产构建（可观察 Rollup 行为）。  
3. `npm run preview`：预览构建产物。  
4. `npm run typecheck`：`vue-tsc --noEmit`，检查 TS 与 Vue SFC 类型。  
5. `npm run build:rollup`：纯 Rollup 构建（对照学习）。

---

## 9. `tsconfig.json` 关键结论

1. `strict: true`：开启严格类型检查。  
2. `moduleResolution: "Bundler"`：解析行为贴近打包器（Vite/Rollup）。  
3. `noEmit: true`：只做类型检查，不输出构建文件。  
4. `types: ["node", "vite/client"]`：补齐 Node 与 Vite 客户端类型。  
5. `include` 覆盖 `.ts` 和 `.vue`，并通过 `vue-tsc` 实现 SFC 类型检查。

---

## 10. 已踩过并解决的问题（可回顾）

1. `@rollup/plugin-typescript` 依赖 `tslib`。  
2. 插件顺序不当会导致 `.vue` 虚拟模块被误解析。  
3. 样式处理链路需要明确（Vue 插件与 PostCSS 分工）。  
4. 文件编码不一致会导致中文乱码（已统一修复）。

---

## 11. 下一步建议（可选）

1. 把 `build` 改为：`vue-tsc --noEmit && vite build`，把类型检查变成构建门禁。  
2. 做一组 `manualChunks` 对照实验（开/关）并记录产物差异。  
3. 把当前 hash 路由改成“静态导入 vs 动态导入”对比实验，加深“是否发请求”的理解。
