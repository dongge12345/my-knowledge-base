# 两天面试准备版：Three.js / WebGL 最小学习路径

这份指南只服务一个目标：

两天内，让你对 `Three.js`、基础 `WebGL`、3D 前端常见概念建立“能解释、能举例、能回答面试”的理解。

## 1. 先接受一个现实

两天内不可能把 Three.js 学成项目主程，但完全可以做到：

- 知道 Three.js 在前端里的定位
- 看懂一个最小可运行的 3D 页面
- 说清场景、相机、渲染器、材质、光照、动画循环、射线拾取
- 对 `WebGL` 有正确的基础理解
- 能讲出几个常见性能点

## 2. 你现在只需要看懂这个极简项目

最关键的文件只有两个：

- `src/App.vue`
- `src/composables/useThreeLearningScene.js`

你先不要被工程结构吓到，重点只看：

- 场景怎么初始化
- 物体怎么创建
- 鼠标怎么点中立方体
- 动画为什么会动

## 3. Three.js 先记住这条主链路

`Scene -> Camera -> Renderer -> Mesh -> Light -> Animation Loop -> Raycaster`

翻译成前端人的话：

- `Scene`：3D 世界根节点
- `Camera`：你从哪里看这个世界
- `Renderer`：把 3D 画到 canvas 上
- `Mesh`：真正能看到的 3D 物体
- `Light`：没有光就看不出体积感
- `Animation Loop`：每一帧更新和渲染
- `Raycaster`：3D 点击和拾取的核心

## 4. WebGL 和 Three.js 是什么关系

你先这样理解就够了：

- `WebGL` 更接近浏览器调用 GPU 的底层能力
- `Three.js` 是上层封装，帮你把 3D 场景开发里常用的内容抽象出来

所以面试里可以说：

Three.js 是建立在 WebGL 之上的上层库，它降低了前端做 3D 场景的门槛，让开发者更多从场景、相机、网格、光照和交互这些概念出发，而不用一开始就直接写底层缓冲区和着色器。

## 5. 今天先记住的 API

- `new THREE.Scene()`
- `new THREE.PerspectiveCamera(...)`
- `new THREE.WebGLRenderer(...)`
- `new THREE.Mesh(...)`
- `new THREE.BoxGeometry(...)`
- `new THREE.MeshStandardMaterial(...)`
- `new THREE.AmbientLight(...)`
- `new THREE.DirectionalLight(...)`
- `new OrbitControls(...)`
- `new THREE.Raycaster()`
- `renderer.setAnimationLoop(...)`

## 6. 面试会怎么问你

最常见的问法通常不是直接问 API，而是：

- Three.js 和 WebGL 的关系是什么
- 一个最基础的 Three.js 页面由哪些部分组成
- 3D 物体点击交互是怎么实现的
- 动画为什么能动
- 为什么 3D 页面容易卡

## 7. 你现在先能答出来就够了

### Three.js 是什么

Three.js 是一个基于 WebGL 的 3D 图形库，它把场景、相机、渲染器、几何体、材质、光照、交互这些常见能力封装起来，让前端工程师可以更高效地构建 Web3D 页面。

### 一个最小可运行的 3D 页面需要什么

至少需要：

- `Scene`
- `Camera`
- `Renderer`
- 一个可见物体 `Mesh`
- 一盏灯
- 一个渲染循环

### 3D 点击怎么做

通过 `Raycaster`。

核心流程是：

1. 拿到鼠标在 canvas 上的位置
2. 转成标准化坐标
3. 从相机朝鼠标方向发射一条射线
4. 判断射线与哪些模型相交

### 动画为什么会动

因为在渲染循环里，每一帧都在更新物体的旋转、位置或缩放，然后重新调用 `renderer.render(scene, camera)`。

### 为什么 3D 页面容易卡

因为它比普通页面多了实时渲染成本。常见问题包括：

- 模型面数太高
- 纹理太大
- `draw call` 太多
- 每帧计算太多
- 没有正确释放资源

## 8. 两天学习顺序

### 第一天

- 运行极简项目
- 看懂 `Scene / Camera / Renderer`
- 看懂立方体和材质
- 看懂 `Raycaster`
- 看懂动画循环

### 第二天

- 补 `WebGL` 基础概念
- 补 `draw call`
- 补 `geometry / material / mesh` 关系
- 补 `OrbitControls`
- 练面试表达

## 9. 你现在最值得做的 4 个练习

1. 把立方体改成绿色
2. 把球体改大一点
3. 把自动旋转默认关掉
4. 把点击空白区域时的提示文案改掉

做完这 4 个练习，你对：

- 几何体
- 材质
- 动画
- 交互
- Vue 和 Three.js 联动

就已经会有第一层真实感觉。
