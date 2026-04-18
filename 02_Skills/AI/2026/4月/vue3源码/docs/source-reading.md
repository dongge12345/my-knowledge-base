# 真实源码阅读导航

以下路径按 2026-04-12 查过官方仓库结构后整理，目标不是全看，而是只看考试高频实现。

## 1. 响应式原理

官方仓库：

- Vue Core: https://github.com/vuejs/core

先看这几个文件：

- `packages/reactivity/src/effect.ts`
- `packages/reactivity/src/baseHandlers.ts`
- `packages/reactivity/src/reactive.ts`
- `packages/reactivity/src/dep.ts`

你重点只看这几个词：

- `activeEffect`
- `track`
- `trigger`
- `ReactiveEffect`
- `mutableHandlers`
- `createReactiveObject`

建议阅读顺序：

1. 先看 `reactive.ts`，搞清楚 `reactive()` 最终是怎么创建 `Proxy` 的。
2. 再看 `baseHandlers.ts`，重点盯住 `get` 和 `set`。
3. 最后看 `effect.ts` 和 `dep.ts`，搞清楚依赖收集和触发更新。

考试最常问：

- 为什么 `Proxy` 的 `get` 能做依赖收集？
- 为什么 `set` 能触发视图更新？
- `WeakMap -> Map -> Set` 这层结构是干什么的？

## 2. diff 算法

官方仓库：

- Vue Core: https://github.com/vuejs/core

先看这个文件：

- `packages/runtime-core/src/renderer.ts`

只搜这几个函数名：

- `patchKeyedChildren`
- `getSequence`

你重点只看这几段逻辑：

1. 从头开始同步
2. 从尾开始同步
3. 中间乱序节点的 `key -> index` 映射
4. `newIndexToOldIndexMap`
5. 最长递增子序列 `getSequence`

考试最常问：

- Vue3 diff 为什么比 Vue2 更快？
- 为什么要用 `key`？
- 最长递增子序列在这里到底是干什么的？

你只要记住一句话：

`patchKeyedChildren` 的目标不是“找到所有变化”，而是“用更少的 DOM 移动完成更新”。

## 3. vue-router

官方仓库：

- Vue Router: https://github.com/vuejs/router

先看这几个文件：

- `packages/router/src/router.ts`
- `packages/router/src/matcher/index.ts`
- `packages/router/src/history/html5.ts`

你重点只看这几个词：

- `createRouter`
- `createRouterMatcher`
- `resolve`
- `push`
- `listen`

建议阅读顺序：

1. 先看 `router.ts` 里的 `createRouter`
2. 再看 `matcher/index.ts`，理解路径怎么匹配
3. 最后看 `history/html5.ts`，理解路由变化怎么和浏览器 history 关联

考试最常问：

- 路由表是怎么组织起来的？
- `/users/:id` 这种动态路由怎么匹配？
- `router.push()` 后内部发生了什么？

## 最短学习法

每一块都固定走这 3 步，不要发散：

1. 先用本文件定位源码。
2. 再看对应 `exercises/*/todo.js`。
3. 最后跑 `run.js` 检验自己是不是真的理解了。
