# 简历与学习全局思维导图

> 说明：这份图基于当前项目里的已知信息整理。  
> 其中“简历现状”部分只整理出目前能确认的技术方向与项目实践，等你后续补充真实简历内容后，我们可以再继续细化。

```mermaid
mindmap
  root((前端求职与学习全局图))
    简历现状
      已明确方向
        Vue3
        Vite
        TypeScript
        Rollup
        工程化理解
      已有项目载体
        最小实验场
        TS纯函数练习
        Vue3 Composition API 示例
        Vite开发态与构建态实验
      当前可写进简历的能力
        能搭建 Vue3 + Vite 项目
        理解 ESM 与 HMR 基本机制
        理解 Vite dev 与 Rollup build 的分工
        能写基础 TS 类型与工具类型
        能实现简单手写路由
      目前简历短板
        缺少完整业务项目描述
        缺少标准状态管理项目经验
        缺少 vue-router 正式使用经验
        缺少部署与生产环境配置经验
        缺少性能优化与组件封装案例
    已学内容
      Vue3
        Composition API
        composables
        setup 组织方式
        Vue2 vs Vue3 差异
      Vite
        index.html 作为开发入口
        基于 ESM 的按需加载
        WebSocket + HMR
        vite build 底层走 Rollup
        build.rollupOptions
      Rollup
        input output
        plugin 基本职责
        manualChunks
        vendor 拆包
      TypeScript
        interface
        联合类型
        Omit Pick Partial Record
        unknown + 类型守卫
        不可变更新
        vue-tsc
        tsconfig 基本项
      路由
        hash 路由原理
        history 路由原理
        本地开发支持 history
        生产环境需要回退到 index.html
      工程认知
        Tree Shaking 基础理解
        ESM 静态分析
        TS 不直接负责打包输出
    当前能做的事
      写基础 Vue3 页面
      拆 composables
      写基础 TS 业务函数
      看懂 Vite 开发态资源请求
      理解 HMR 不是整页刷新
      做简单构建配置实验
    待学重点
      Vue3 核心
        props emits
        watch watchEffect
        生命周期
        slots
        provide inject
      Vue Router
        createRouter
        history 模式正式配置
        路由守卫
        动态路由
        懒加载路由
      Pinia
        store 定义
        state getters actions
        store 拆分
      Vite 工程化
        alias
        env
        proxy
        静态资源处理
        常见插件
      组件能力
        组件通信
        表单组件
        通用组件封装
        组件复用边界
      项目能力
        权限
        列表表单详情页
        接口联调
        错误处理
        页面级状态管理
      上线部署
        history 回退配置
        Nginx
        静态资源缓存
        sourcemap 使用
    学习阶段判断
      Vue3
        基础已入门
        业务开发未完全打通
      Vite
        原理已入门
        工程配置还需系统补齐
      TS
        基础语法已过关
        业务建模仍需练习
      求职准备
        适合继续堆项目
        暂不适合只靠理论投递
    下一阶段行动
      先补 vue-router
      再补 Pinia
      做一个中小型完整项目
      给项目写项目描述
      最后回填简历
```

## 一句话看全局

你现在已经完成了：
- `Vue3 + Vite + TS` 的基础认知搭建
- 开发态、构建态、HMR、ESM 的底层理解
- Composition API 与 TS 纯函数练习

你现在还缺的是：
- 标准业务开发链路
- 官方路由与状态管理
- 能写进简历的完整项目描述

## 简历视角拆解

### 现在能写的

- 搭建并维护 `Vue3 + Vite + TypeScript` 实验项目
- 理解并实践 `Vite dev`、`vite build`、`Rollup` 分工
- 理解 `ESM`、`Tree Shaking`、`HMR` 的基本机制
- 使用 `Composition API` 与 `composables` 组织页面逻辑
- 使用 `TypeScript` 完成基础业务建模与类型守卫练习

### 现在还不建议写得太重的

- 大型后台管理系统经验
- 复杂状态管理经验
- 生产部署与上线优化经验
- 成熟组件库封装经验

## 推荐学习顺序

1. `vue-router`
2. `Pinia`
3. 做一个完整 CRUD 项目
4. 补 Vite 工程化配置
5. 补部署与构建优化
6. 回写简历项目描述

## 下一份可交付目标

下一阶段最值得做的，不是继续零散记概念，而是完成一个真正能写进简历的项目，至少包含：

- 登录或权限
- 路由
- Pinia
- 列表/表单/详情
- 接口请求
- 状态管理
- 构建与部署说明

