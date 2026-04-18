# Vue2 总体学习进度

## 基本信息
- 项目：`vue2 + webpack 学习项目`
- 最后更新：`2026-03-23`

## 当前进度快照
- 当前模块 1：`Vue2 diff 算法`
- 进度状态：`进行中（已掌握核心流程）`
- 当前模块 2：`Vue2 响应式原理`
- 进度状态：`进行中（已能梳理对象、数组、$set 的完整链路）`
- 当前模块 3：`Vue2 组件运行机制与通信`
- 进度状态：`进行中（已建立入口、路由、组件实例、render、watcher、通信方式、Vuex 基础定位）`

## 已能清晰讲解的内容
- 虚拟 DOM 是对真实 DOM 结构的抽象。
- patch 从新旧 VNode 对比开始，先判断 `sameVnode`。
- 如果不是同一节点则替换；如果是同一节点则更新属性/文本并继续对子节点做 diff。
- 子节点 diff 的核心是双端指针比较。
- Vue2 响应式的主干结构是 `Watcher -> Dep -> observe -> defineProperty`。
- 对象已有属性修改，主要依赖“属性自己的 dep”派发更新。
- 对象新增属性、数组变异方法更新，主要依赖“对象/数组自身的 __ob__.dep”派发更新。
- 数组响应式不是劫持索引，而是重写 `push/unshift/pop/shift/reverse/sort/splice` 这 7 个方法。
- Vue2 应用从 `main.js` 入口启动，根实例通过 `render` 渲染 `App.vue`。
- `App.vue` 是应用壳，`router-view` 是当前路由页面组件的渲染出口。
- `props` 负责父传子，`$emit` 负责子传父动作。
- `provide / inject` 适合跨层上下文传递，既可以传值，也可以传方法或服务对象。
- `mixin` 的本质是组件选项对象的合并。
- Vuex 是集中式状态管理，不是“大号 props”。

## 校准要点
- 实际实现中的 `sameVnode` 比只看 `key + tag` 更严格。
- `oldKeyToIdx` 通常是按需懒创建，不一定一开始就生成。
- 复用过的旧节点需要标记为已消费，避免重复命中。
- Vue2 里“读的时候 depend，改的时候 notify”，依赖收集和消息派发不能混为一件事。
- `dep.depend()` 负责属性级依赖；`val.__ob__.dep.depend()` 负责对象/数组整体级依赖。
- Vue2 组件运行总纲：
  - `create 阶段：搭系统`
  - `render 阶段：收依赖`
  - `update 阶段：重新执行并 patch`
- 从 render watcher 的角度看，最终真正收集它的，仍然是 `state.user`、`data.xxx`、`props.xxx` 这类响应式源属性；`computed` 和 `getters` 是派生读取层

## 当前专题文档
- [Vue2 的响应式原理代码实现和完整链路推演](D:/data/paipaiHighLevel/02_Skills/AI/2026/3月/vue2+webpack/docs/topics/vue2-的响应式原理代码实现和完整链路推演.md)
- [Vue2 项目式学习记录](D:/data/paipaiHighLevel/02_Skills/AI/2026/3月/vue2+webpack/docs/learning/vue2-learning-by-example.md)
- [第 01 课：入口到首屏渲染](D:/data/paipaiHighLevel/02_Skills/AI/2026/3月/vue2+webpack/docs/lessons/01-入口到首屏渲染.md)

## 下一步学习目标
1. 把当前 diff 理解整理成 `updateChildren` 的简版伪代码。
2. 把 Vuex 的 `dispatch -> action -> commit -> mutation -> 页面更新` 链路讲透并结合当前项目演示。
3. 继续梳理 `computed`、`watch`、`nextTick` 在整个响应式系统中的角色差异。
4. 建立 Vue2 组件通信、状态管理、工程化之间的整体边界感。

## 学习日志
- `2026-03-22`：完成 Vue2 diff 主流程的一轮系统理解，已能完整讲清双端指针更新过程。
- `2026-03-22`：完成 Vue2 响应式主干结构的一轮系统梳理，已能讲清对象、数组、`$set`、`__ob__.dep` 的核心作用。
- `2026-03-23`：完成 Vue2 应用启动、路由接入、`history` 回退、组件实例代理、`data` 函数化、模板到 render、渲染 watcher 更新链路的一轮系统梳理。
- `2026-03-23`：完成 Vue2 组件通信主线（`props / emit / provide / inject`）、`mixin` 选项合并定位、Vuex 基础角色划分的一轮系统梳理。
- `2026-03-27`：开始系统梳理 webpack 工程化主线，已建立“构建链路、common/dev/prod 责任分层、loader/plugin/内置资源模块判断框架、asset/source Markdown 实验”的整体认知。

## Webpack 工程化新进度
- 已掌握：webpack 构建总链路（entry -> 依赖图 -> rules -> plugins -> optimization -> output）
- 已掌握：`common / dev / prod` 的责任分层
- 已掌握：文件内容转换优先看 loader 或内置资源模块，构建流程扩展优先看 plugin
- 已掌握：`asset/source` 会把文件原文作为字符串导出
- 已完成：项目内 `.md` 资源导入并展示到前端的真实实验
