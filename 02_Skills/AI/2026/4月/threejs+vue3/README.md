# Three.js Vue3 Learning Lab

一个偏教学用途的 `Vue3 + Vite + Three.js` 小项目，用来帮助有前端经验、但刚开始补 3D 专项的人建立清晰的 Three.js 概念。

## 这个项目适合你什么阶段

- 你已经做过普通前端页面开发
- 你知道组件、状态、工程化这些常规前端概念
- 你现在需要快速补上 `Three.js / WebGL / Web3D` 的核心印象

## 项目包含的知识点

- Three.js 场景树
- 相机与渲染器
- 光照与材质
- 轨道控制器 `OrbitControls`
- 射线拾取 `Raycaster`
- 动画循环
- `InstancedMesh` 性能优化示例
- Vue 面板状态与 Three.js 场景联动
- 场景销毁与资源释放

## 运行方式

```bash
npm install
npm run dev
```

构建产物：

```bash
npm run build
```

## 推荐学习顺序

1. 先看 [src/composables/useThreeLearningScene.js](src/composables/useThreeLearningScene.js)
2. 再看 [src/three/createLearningFactory.js](src/three/createLearningFactory.js)
3. 最后回到 [src/App.vue](src/App.vue) 看 Vue 是如何和 Three.js 协作的

## 你应该重点理解的 5 个问题

1. Three.js 场景为什么是树状结构
2. 为什么要有动画循环，哪些更新应该放在循环里
3. 鼠标点击 3D 模型为什么要用射线拾取
4. 为什么 Vue 不直接“渲染 3D”，而是负责 UI 状态和生命周期
5. 为什么大量重复物体适合用 `InstancedMesh`

## 文档

- [docs/threejs-core-concepts.md](docs/threejs-core-concepts.md)
