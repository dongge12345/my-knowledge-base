# Vue2 项目式学习记录

## 当前学习方式
- 学习载体：`vue2 + webpack` 教学项目
- 学习目标：不是只记 API，而是建立“代码如何运行”的完整链路理解
- 学习方法：基于当前项目，按“入口 -> 数据 -> 模板 -> 组件 -> 路由 -> 状态管理 -> 工程化”逐步展开
- 当前原则：先通过对话把链路讲透，再在阶段性时点归档成文档

## Vue2 学习主线

### 第一阶段：先看懂项目是怎么跑起来的
- 入口文件如何启动 Vue 应用
- `new Vue(...)` 做了什么
- `render` 是怎么把 `App.vue` 渲染出来的
- 路由是怎么接入应用的
- 为什么访问不同 URL 会渲染不同页面

### 第二阶段：看懂 Vue2 组件内部是怎么工作的
- `data / methods / computed / watch` 各自挂到哪里
- 模板里的数据为什么能直接访问
- 事件触发后，组件数据如何更新
- 数据更新后，为什么页面会重新渲染

### 第三阶段：系统建立 Vue2 响应式认知
- `Object.defineProperty` 响应式核心
- `Watcher / Dep / observe / defineReactive`
- 对象属性更新链路
- 数组变异方法更新链路
- `$set` 的必要性

### 第四阶段：看懂 Vue2 的 DOM 更新机制
- 虚拟 DOM 是什么
- patch 的整体过程
- `sameVnode` 的作用
- 子节点 diff 的双端指针逻辑
- `key` 为什么重要

### 第五阶段：组件间通信和数据传递方式
- 父传子：`props`
- 子传父：`$emit`
- 跨层传递：`provide / inject`
- 非父子通信：事件总线思路与局限
- 逻辑复用：`mixin`

### 第六阶段：路由
- `vue-router` 是如何注册到 Vue 中的
- `router-view` 如何渲染当前页面
- `hash` 和 `history` 的区别
- 路由懒加载和 webpack 的关系
- 页面跳转、刷新、守卫的运行链路

### 第七阶段：状态管理
- 为什么需要 Vuex
- `state / getters / mutations / actions` 分工
- 一次 `dispatch -> action -> commit -> mutation -> 视图更新` 的完整链路
- Vuex 和组件局部状态的边界

### 第八阶段：工程化和项目落地
- webpack 在 Vue2 项目里负责什么
- 按需加载、分包、动态 import
- 开发环境与生产环境差异
- 这套工程化配置如何迁移到真实项目

## 当前已完成
- Vue2 diff 算法主流程已梳理
- Vue2 响应式对象/数组/$set 主链路已梳理
- 已有响应式专题记录与最小可运行代码
- 已完成 Vue2 入口到页面渲染的基础链路梳理
- 已完成 Vue2 组件实例、`data` 代理、渲染 watcher、模板到 render 的基础认知梳理

## 当前阶段总结

### 1. 应用启动主线
- 入口文件是 [main.js](D:/data/paipaiHighLevel/02_Skills/AI/2026/3月/vue2+webpack/src/main.js)
- `new Vue({ router, render: h => h(App) })` 的本质是创建根实例，并指定根组件是 `App.vue`
- `.$mount('#app')` 是把根实例挂到页面宿主容器 `#app`
- `App.vue` 在当前项目里承担“应用壳”的角色，而不是自己决定具体页面内容

### 2. 路由主线
- `Vue.use(Router)` 是安装路由插件，让 Vue 具备路由能力
- `new Vue({ router })` 是把当前应用使用的那套路由实例接入根实例
- `$router` 是路由管理器，用来做跳转等操作
- `$route` 是当前路由状态，不是路由配置表
- `<router-view />` 是当前路由页面组件的渲染出口
- 页面切换链路是：
  - 用户动作
  - 触发组件方法
  - 调用 `this.$router.push(...)`
  - 当前路由状态变化
  - `router-view` 重新渲染匹配到的页面组件

### 3. `history` 模式认知
- `history` 模式下，浏览器会把真实路径发给服务器
- 所以前端路由刷新时，服务端必须回退到 `index.html`
- `historyApiFallback: true` 只负责开发环境
- `preview-history.js` 只负责本地预览生产包
- 核心原则是：谁提供页面，谁负责做 history 回退

### 4. 组件实例主线
- Vue2 会把组件选项对象整理到组件实例上
- `methods` 会挂到实例上
- `computed` 会定义到实例上
- `data` 返回的数据会先挂到内部数据对象，再代理到实例上
- 所以模板和方法最终面对的都是“组件实例上的属性和方法”
- 组件实例建立的过程，本质上是：把一个组件 options 对象，初始化成一个具备数据、方法、计算属性、watch、响应式能力和渲染能力的实例。

### 5. `data` 为什么是函数
- 组件中的 `data` 必须写成函数，是为了保证每个组件实例拿到独立的数据副本
- 如果直接写对象，多个组件实例会共享同一个对象引用，导致状态串联
- 根实例通常只创建一次，所以它写对象风险没有组件定义那么大

### 6. `data` 代理认知
- `this.count` 本质上是对内部数据对象的一层实例代理
- Vue2 这样做是为了让组件访问数据更自然
- 模板里的 `count`、方法里的 `this.count`、计算属性里的 `this.count`，最终都围绕组件实例展开

### 7. 页面更新主线
- 组件首次渲染时，会创建渲染 watcher
- 渲染 watcher 执行 render 时，会读取模板依赖的数据
- 读取响应式数据时触发 getter，完成依赖收集
- 数据修改时触发 setter，setter 通知 watcher 更新
- watcher 重新执行 render，Vue 再通过 patch 更新真实 DOM

### 8. 模板、render、watcher 的关系
- 模板不会直接在浏览器里运行，而是会被编译成 render 函数
- 渲染 watcher 真正执行的是 render
- render 执行时读取到哪些响应式数据，当前组件就依赖哪些数据
- 所以模板和响应式系统能连起来，本质上是因为“模板最终会变成会读取数据的 render”

补充一条非常关键的链路：

```text
组件 render
-> 读取 computed / getters
-> 最终读取到 state.user
-> state.user 的 getter 把当前 render watcher 收集到 dep 中

后来：
state.user 变化
-> setter 执行 dep.notify()
-> dep 遍历并通知之前收集到的 watcher
-> render watcher 的 update 被调用
-> 组件进入重新渲染流程
```

这条链路说明了一件事：

- 从 render watcher 的角度看，最终真正把它收集起来的，仍然是 `state.user`、`data.xxx`、`props.xxx` 这类响应式源属性
- `computed` 和 `getters` 更像是“读取链路上的派生层”，不是最终响应式源头

### 9. 组件运行三阶段总纲
- `create 阶段：搭系统`
- `render 阶段：收依赖`
- `update 阶段：重新执行并 patch`

这三句话是当前阶段理解 Vue2 组件运行机制的总纲：
- `create` 阶段负责把组件 options 初始化成可工作的实例，完成 `props / methods / data / computed / watch` 等基础能力准备
- `render` 阶段负责执行渲染逻辑，在读取响应式数据的过程中完成依赖收集
- `update` 阶段负责在数据变化后重新执行渲染，并通过 patch 做局部 DOM 更新

生命周期的一个实用总结：

- `beforeCreate / created` 解决“实例什么时候可用”
- `beforeMount / mounted` 解决“首次 DOM 什么时候可用”
- `beforeUpdate / updated` 解决“更新前后的 DOM 处于什么状态”
- `beforeDestroy / destroyed` 解决“组件什么时候进入清理和结束”

关于 `created` 和 `mounted` 的使用边界，也可以先记一句：

- 不依赖 DOM 的逻辑优先放 `created`
- 依赖 DOM 的逻辑优先放 `mounted`

### 10. 组件通信主线
- `props` 负责父传子
- `$emit` 负责子传父动作
- 子组件如果要编辑父传值，通常先拷一份到本地 `data`
- `provide / inject` 适合传递跨层上下文，不适合替代所有 `props`
- `provide / inject` 既可以传值，也可以传方法或整套服务对象

### 11. Vuex 初步定位
- Vuex 不是“更高级的 props”，而是集中式状态管理
- `state` 存数据
- `getters` 负责派生结果
- `mutations` 负责正式修改状态
- `actions` 负责异步和业务流程，再去提交 `mutation`
- Vuex 的状态更新最终仍然依赖 Vue 的响应式系统通知组件更新

## 接下来的教学方式
- 每次只讲一个明确主题
- 每次都基于当前项目真实代码
- 每次都包含“代码位置 + 执行顺序 + 数据如何流动 + 为什么这样设计”
- 每个主题结束后，再沉淀到专题文档和总体进度中

## 2026-03-27 Webpack 工程化补充

### 1. Webpack 构建总链路
- `npm run build`
- `webpack-cli` 读取 `build/webpack.prod.js`
- `webpack.prod.js` 通过 `merge` 合并 `webpack.common.js`
- 从 `entry` 指向的 `src/main.js` 开始建立依赖图
- 遇到不同资源类型，按 `module.rules` 命中对应处理规则
- 由 `plugins` 扩展构建流程
- 由 `optimization` 处理压缩、分包、runtime 拆分
- 最终输出到 `dist`

### 2. 责任分层
- `common` 管“项目能不能构建”
- `dev` 管“本地好不好开发”
- `prod` 管“上线产物好不好”

### 3. 判断新需求该加什么
- 文件内容如何转换：优先想 `loader` 或 webpack 内置资源模块
- 构建流程需要额外做事：优先想 `plugin`
- 开发专属能力：优先放 `webpack.dev.js`
- 生产专属优化：优先放 `webpack.prod.js`
- 开发和生产都需要的基础能力：放 `webpack.common.js`

### 4. 资源模块认知
- `asset/source`：把文件原文作为字符串导出
- `asset/resource`：输出独立文件，并导出文件 URL
- `asset/inline`：导出 base64 Data URL
- `asset`：自动在内联和独立文件之间选择

### 5. 当前项目的 Markdown 实验
- `.md` 文件支持不是通过额外 loader 完成，而是通过 webpack5 内置的 `asset/source`
- 这说明新增资源类型时，不要先入为主地安装 loader，要先判断 webpack 内置能力是否足够

### 6. 已确认的高频结论
- `style-loader` 属于 loader，因为它处理的是“CSS 模块最终如何转换成可运行模块内容”
- `MiniCssExtractPlugin.loader` 负责把 CSS 模块接入抽离路线，`MiniCssExtractPlugin` 负责最终输出独立 CSS 文件
- `HtmlWebpackPlugin` 不只是生成 HTML，还会自动把打包产物注入到页面中
- `runtimeChunk` 拆出来的是 webpack 自己的运行时代码，不是业务代码
