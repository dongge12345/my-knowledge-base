# Vue3 源码高频考点速学

这个目录不是现成仓库，所以我把它整理成了一个只做三件事的学习场：

1. 快速定位真实源码，看最该看的文件。
2. 用最小案例补空实现核心逻辑。
3. 控制范围，只学面试和考试最常问的点。

## 你现在怎么学

先看真实源码，再补空练习。每一块都只走这一条最短路径：

1. 看 [docs/source-reading.md](./docs/source-reading.md)
2. 练 `npm run study:reactivity`
3. 练 `npm run study:diff`
4. 练 `npm run study:router`

## 建议节奏

如果你只有 2 到 3 小时，按这个顺序最划算：

1. `reactivity`
看完源码定位后，补 `effect / track / trigger / reactive`

2. `diff`
先理解“前后双端对比 + 中间乱序 + 最长递增子序列”，再补 `keyToNewIndexMap / newIndexToOldIndexMap / getSequence`

3. `router`
只抓“路由记录收集、动态路由匹配、push 更新”

## 目录结构

```text
docs/
  source-reading.md        # 真实源码阅读导航
exercises/
  reactivity/
    todo.js                # 你补空
    run.js                 # 跑案例
  diff/
    todo.js
    run.js
  router/
    todo.js
    run.js
scripts/
  run-all.js
```

## 使用方式

第一次不用安装依赖，直接运行：

```bash
npm run study:reactivity
npm run study:diff
npm run study:router
```

如果你还没补完 `TODO`，脚本会直接报错，这是正常的。

## 你的学习目标

你要记住的不是“所有源码”，而是这三条主线：

1. 响应式为什么能在 `get` 时收集依赖，在 `set` 时重新执行副作用。
2. diff 为什么先从两端比，再处理中间乱序，最后用 LIS 减少移动次数。
3. vue-router 为什么能把 `/users/42` 匹配到 `/users/:id`，并在 `push` 后更新当前路由。

如果你愿意，我下一步可以继续帮你做两件事中的任意一个：

1. 带你按这三个练习逐个补空。
2. 再补一份“考前背诵版”答案，只保留最常考表述。
