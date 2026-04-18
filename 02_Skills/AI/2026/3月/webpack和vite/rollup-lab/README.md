# Rollup 实验场

这个实验项目把 5 类最常见的生产构建现象拆开了，方便你逐个观察和对照。

## 运行方式

1. `npm install`
2. `npm run build`
3. 查看 `dist/` 目录

`npm run build` 会先清空 `dist/`，避免旧的 hash 文件残留，影响你观察当前构建结果。

## 重点观察什么

1. `01-static`
只有静态导入。通常会比较接近“一个入口对应一个入口产物”，除非你额外配置了手动拆包。

2. `02-dynamic`
包含 `import()`，所以 Rollup 会额外产出一个懒加载 chunk。

3. `03-page-a` 和 `04-page-b`
两个入口同时依赖 `src/shared/shared-util.js`，因此 Rollup 会把它抽成共享 chunk。

4. `src/vendor/*`
`manualChunks` 会把这里的模块手动放进 `vendor-simulated-*` 产物里。

5. `05-tree-shaking`
入口只使用了 `src/tree-shaking/library.js` 里的 `usedValue`。未使用的导出应该被删掉，但顶层副作用代码仍然会保留。

## Hash 观察实验

先构建一次，再只修改一个文件并重新构建。

- 修改 `src/shared/shared-util.js`：共享 chunk 的 hash 应该变化，引用它的部分入口文件 hash 也可能跟着变。
- 修改 `src/entries/01-static.js`：大概率只有这个入口文件的 hash 变化。
- 修改 `src/vendor/fake-vendor.js`：`vendor-simulated-*` 这个 chunk 的 hash 应该变化。
