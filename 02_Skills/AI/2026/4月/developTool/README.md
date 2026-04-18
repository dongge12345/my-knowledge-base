# DevTools Interview Lab

一个专门练这两类面试题的前端练习项目：

- 遇到内存泄漏，如何借助 Chrome DevTools 排查
- 遇到首屏加载慢，如何借助 Chrome DevTools 排查

项目分成两部分：

- 学习区：认识 `Network`、`Performance`、`Memory`、`Lighthouse`、`Coverage` 和常见指标
- 实战区：复现“首屏慢”和“内存泄漏”，再切换到优化版观察差异

## 快速开始

```bash
npm start
```

默认地址：`http://localhost:3000`

## 页面入口

- 首页：`/`
- 工具与指标速查：`/learn/devtools.html`
- 首屏慢场景：`/scenarios/slow-first-screen.html?mode=bad`
- 首屏慢优化版：`/scenarios/slow-first-screen.html?mode=good`
- 内存泄漏场景：`/scenarios/memory-leak.html?mode=bad`
- 内存泄漏修复版：`/scenarios/memory-leak.html?mode=good`

## 练习顺序

1. 先看“工具与指标速查”
2. 练“首屏加载慢”
3. 练“内存泄漏”
4. 把下面两段面试回答模板说顺

## 指标速记

- `FP`：第一次像素绘制
- `FCP`：第一次有真实内容绘制
- `FMP`：历史指标，了解“主要内容首次出现”的概念即可
- `LCP`：最大内容元素出现时间，首屏体验重点
- `TBT`：FCP 到可交互前，被长任务阻塞的总时间
- `TTI`：页面真正稳定可交互的时间

## 面试回答模板

### 遇到首屏加载慢，如何用开发者工具排查？

1. 先开 `Network`，勾 `Disable cache`，必要时切慢网，确认是不是资源体积大、请求数量多、关键资源阻塞或者缓存问题。
2. 再开 `Performance` 录制一次刷新过程，重点看 `Screenshots`、`FCP`、`LCP` 和主线程 `Main`，判断是网络慢还是 JS 长任务慢。
3. 如果发现 JS 执行重，就继续看 `Bottom-up` 和 `Call tree` 找最耗时函数。
4. 如果怀疑首屏加载了太多无用代码，再开 `Coverage` 看 CSS / JS 实际使用率，考虑代码拆分和懒加载。
5. 最后用 `Lighthouse` 做体检，再回到根因工具验证。

### 遇到内存泄漏，如何用开发者工具排查？

1. 打开 `Memory`，优先用 `Heap Snapshot` 和 `Allocation instrumentation on timeline`。
2. 先做一次基线快照，再重复执行可疑操作，比如反复进入离开页面、打开关闭弹窗、挂载卸载组件。
3. 如果内存持续上涨且不回落，就对比多次快照，看哪些 `Array`、`Closure`、`EventListener`、`Detached DOM` 一直被保留。
4. 找到引用链后，回代码里检查监听器、定时器、全局缓存和闭包引用是否没有清理。
5. 修复后重新录制，验证对象是否能够回收。

## 建议练法

### 首屏慢

1. 打开问题版
2. 先用 `Network` 看资源
3. 再用 `Performance` 录制刷新
4. 看 `FCP`、`LCP`、`Main`、`Screenshots`
5. 切到优化版，对比前后差异

### 内存泄漏

1. 打开问题版
2. 在 `Memory` 做一次基线快照
3. 反复点击挂载和卸载，或者跑自动循环
4. 再做两次快照，看对象是否只增不减
5. 切到修复版重复操作，确认内存能回收
