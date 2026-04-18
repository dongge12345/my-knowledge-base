# Vue3 短期学习计划（2 个晚上 / 约 6 小时）

## 目标

这份计划的目标不是“系统学完 Vue3”，而是用 2 个晚上先建立一套能上手工作的最小能力：

1. 看懂并编写 Vue3 日常组件
2. 理解 Vue3 相比 Vue2 最重要的新特性
3. 能使用最常见的 Vue3 API
4. 知道 `vue-router`、`pinia` 是什么、解决什么问题
5. 为后续继续学习官方库打下最小可用基础

---

## 学习原则

1. 以“能上手写代码”为优先，不深挖所有底层原理
2. 只重点讲和 Vue2 差异明显的部分
3. 每一小节都尽量贴着当前项目理解
4. 学完后能说清楚“这个 API 什么时候用”

---

## 总体安排

### 第 1 晚（约 3 小时）

主题：Vue3 组件开发核心

#### 1. Vue3 新特性总览（30 分钟）

目标：

1. 知道 Vue3 相比 Vue2 最大变化是什么
2. 区分“需要会用”和“先知道即可”的内容

重点：

1. Composition API
2. `<script setup>`
3. composables
4. 生命周期变化
5. `v-model` 变化
6. Fragment / Teleport / Suspense
7. Proxy 响应式（只讲差异，不深挖）

输出：

1. 能口头说出 Vue3 相比 Vue2 的 5 个新点

#### 2. `<script setup>` 与组件日常写法（60 分钟）

目标：

1. 会看 Vue3 组件
2. 会写最常见的组件结构

重点：

1. `<template> + <script setup> + <style scoped>`
2. 为什么 Vue3 常用 `<script setup>`
3. 模板如何直接使用 script 中的变量和函数
4. `ref` / `computed` / `onMounted` 的日常写法

输出：

1. 看懂当前项目里的 `HomeView.vue`
2. 看懂 `composables` 是如何被组件消费的

#### 3. `defineProps` / `defineEmits` / 父子通信（60 分钟）

目标：

1. 掌握 Vue3 组件开发最关键的 API
2. 能看懂和编写父子组件通信

重点：

1. `defineProps`
2. `defineEmits`
3. 父传子
4. 子传父
5. 和 Vue2 `props / $emit` 的对比

输出：

1. 能解释 `CounterPanel.vue` 这种组件为什么这么写
2. 能自己写一个最小父子通信组件

#### 4. `computed` / `watch` / 生命周期的使用边界（30 分钟）

目标：

1. 能区分这几个 API 的职责

重点：

1. `computed`：派生值
2. `watch`：响应变化做副作用
3. `onMounted` / `onUnmounted`

输出：

1. 能回答“什么时候用 computed，什么时候用 watch”

---

### 第 2 晚（约 3 小时）

主题：Vue3 代码组织 + 官方配套库入门

#### 1. composables 与逻辑复用（45 分钟）

目标：

1. 明白为什么 Vue3 推荐 composables
2. 知道它和 Vue2 mixins 的差别

重点：

1. 逻辑按功能聚合
2. 避免 mixin 命名冲突
3. 更好的 TypeScript 支持
4. 更利于 tree shaking 的代码组织方式

输出：

1. 能看懂 `useUserProfile.ts`
2. 能看懂 `useTodoList.ts`
3. 能说清 composable 解决了什么问题

#### 2. `provide / inject` 与组件通信补充（30 分钟）

目标：

1. 知道跨层传值的基础方案

重点：

1. 什么时候用 props/emits
2. 什么时候用 provide/inject
3. 什么时候应该上 Pinia

输出：

1. 对组件通信方式形成分层认知

#### 3. `vue-router` 入门（60 分钟）

目标：

1. 明白为什么实际项目要用官方路由而不是手写路由
2. 理解最常用配置项

重点：

1. `createRouter`
2. `createWebHistory`
3. 路由表
4. 路由组件
5. 跳转方式
6. 懒加载路由
7. `history` 部署回退概念

输出：

1. 知道如何把当前项目的手写 history 路由换成 `vue-router`

#### 4. `Pinia` 入门（45 分钟）

目标：

1. 知道 Pinia 是什么
2. 知道它和组件内状态的边界

重点：

1. `defineStore`
2. `state`
3. `getters`
4. `actions`
5. 组件中如何使用 store

输出：

1. 能口头解释“为什么有了 composables 还需要 Pinia”

---

## 这 6 小时结束后，你应该达到的状态

1. 能看懂典型 Vue3 组件
2. 能写基础的 `<script setup>` 组件
3. 会使用 `defineProps`、`defineEmits`、`computed`、`watch`、生命周期
4. 能理解 composables 的意义
5. 知道 `vue-router` 和 `pinia` 的角色与基本用法
6. 对 Vue3 + Vite 的工作流有全局认知

---

## 暂时不在这 6 小时内深入的内容

1. 响应式底层完整实现
2. Suspense 深入机制
3. Teleport 的复杂场景
4. Pinia 持久化与插件体系
5. Vue Router 守卫细节
6. SSR / SSG

这些不是不重要，而是先不阻碍你上手工作。

---

## 学习顺序建议

1. 先完成第 1 晚内容
2. 第 2 晚再进入 `vue-router` 和 `pinia`
3. 不要反过来先学 Pinia

原因：

1. 不会组件和通信，学 Pinia 会很空
2. 不会 `<script setup>`，学 Vue3 官方库也会别扭

---

## 当前项目里的对应学习材料

1. `src/views/HomeView.vue`
2. `src/components/CounterPanel.vue`
3. `src/composables/useUserProfile.ts`
4. `src/composables/useTodoList.ts`
5. `src/composables/useApiGuard.ts`
6. `src/App.vue`
7. `vite.config.ts`

---

## 下一步

从第 1 晚第 1 节开始：

1. Vue3 相比 Vue2 的新特性总览
2. 然后进入 `<script setup>` 的组件日常写法

