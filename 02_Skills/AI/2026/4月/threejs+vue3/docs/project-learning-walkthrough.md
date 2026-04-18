# Three.js Learning Lab 项目导读

这份文档的目标不是把所有 API 一次讲完，而是帮你从前端工程师的视角，把这个项目真正看懂。

你应该先建立一个总认识：

- Vue 负责页面结构、状态面板、组件生命周期
- Three.js 负责 3D 场景、渲染、交互、动画
- 这个项目是一个“教学实验场”，不是业务大项目

---

## 1. 先看项目结构

最值得看的 4 个文件：

- `src/App.vue`
- `src/components/SceneViewport.vue`
- `src/composables/useThreeLearningScene.js`
- `src/three/createLearningFactory.js`

建议阅读顺序：

1. `src/App.vue`
2. `src/composables/useThreeLearningScene.js`
3. `src/three/createLearningFactory.js`
4. `src/components/LearningPanel.vue`

---

## 2. App.vue 在做什么

`src/App.vue` 不负责写 Three.js 细节，它做的是“页面编排”。

你可以把它理解成：

- 左边：教学文本 + 控制面板
- 右边：3D 视口
- 中间：通过一个 composable 把 Vue 和 Three.js 连起来

关键点：

- `useThreeLearningScene()` 是项目的大脑
- `SceneViewport` 只负责提供 Three.js 挂载容器
- `LearningPanel` 只负责操作按钮和状态展示

这其实很符合前端经验里的一个原则：

把“渲染引擎逻辑”从“页面 UI 组件”中拆出来。

---

## 3. 项目的核心在 useThreeLearningScene

这个文件是最值得你吃透的。

它做了 8 件事：

1. 保存 Vue 侧的状态
2. 保存 Three.js 运行时对象
3. 等待真实 DOM 容器挂载
4. 初始化场景
5. 绑定交互事件
6. 启动动画循环
7. 提供给 Vue 的操作方法
8. 在卸载时释放资源

可以把它理解成一个“Three.js 场景控制器”。

---

## 4. 第一步：容器是怎么和 Three.js 连起来的

关键代码在 `setContainerElement`。

它的作用非常简单：

- Vue 把右侧视口的真实 DOM 节点交给 composable
- composable 收到 DOM 后再初始化 Three.js

为什么不能一上来就初始化？

因为 Three.js 的渲染器需要一个真实存在的 DOM 容器来挂载 canvas。

如果容器没准备好，就会出现：

- canvas 没挂上去
- 宽高拿不到
- 相机纵横比错误

所以这是 Vue 集成 Three.js 的第一原则：

先拿到容器，再初始化渲染器。

---

## 5. 第二步：initScene 是 Three.js 初始化主链路

你可以把 `initScene()` 记成一条固定公式：

1. 创建 `Scene`
2. 创建 `Camera`
3. 创建 `Renderer`
4. 创建控制器 `OrbitControls`
5. 创建交互工具 `Raycaster`
6. 创建时钟 `Clock`
7. 添加灯光、辅助线、地面、模型
8. 绑定事件
9. 启动渲染循环

这是绝大多数 Three.js 页面都会出现的套路。

---

## 6. 先理解 Scene

`scene = new THREE.Scene()`

它就是 3D 世界的根节点。

所有你想展示的内容最终都要 `scene.add(...)`。

这里还设置了：

- `background`
- `fog`

说明：

- `background` 是场景背景色
- `fog` 是雾效，让远处物体逐渐和背景融合，更有空间感

你可以把 `Scene` 理解成：

- DOM 世界里的根节点
- 或者一个总舞台

---

## 7. 再理解 Camera

代码里用的是：

`new THREE.PerspectiveCamera(fov, aspect, near, far)`

这 4 个参数要记住：

- `fov`：视野角度
- `aspect`：宽高比
- `near`：近裁剪面
- `far`：远裁剪面

项目里用的是透视相机，因为它更符合人眼视角。

这也是面试高频点：

如果画面看不到模型，不一定是模型没了，也可能是：

- 相机位置不对
- `near/far` 不合理
- `aspect` 失真

---

## 8. Renderer 到底干什么

`renderer = new THREE.WebGLRenderer(...)`

它是浏览器中真正把 3D 内容画到 canvas 的东西。

这个项目里你要特别注意这几个 API：

- `renderer.setPixelRatio(...)`
- `renderer.setSize(width, height)`
- `renderer.outputColorSpace = THREE.SRGBColorSpace`
- `container.appendChild(renderer.domElement)`
- `renderer.render(scene, camera)`
- `renderer.setAnimationLoop(...)`

### 这些 API 分别做什么

`setPixelRatio`

- 控制渲染分辨率
- 不直接等于设备像素比，项目里做了 `Math.min(window.devicePixelRatio, 2)`，避免高分屏过重

`setSize`

- 设置 canvas 渲染尺寸
- 一旦容器尺寸变化，还要重新设置

`outputColorSpace`

- 影响颜色输出是否更符合常见显示器空间
- 你可以先记住：这是渲染结果更自然的一步

`domElement`

- 渲染器内部创建的 canvas 元素
- 必须插入到页面里才能看到画面

---

## 9. OrbitControls 为什么重要

`OrbitControls` 是 Three.js 项目里最常见的控制器之一。

它让你可以：

- 拖拽旋转视角
- 滚轮缩放
- 围绕目标点观察场景

这里你要记住几个点：

- `controls.target` 决定你绕着哪里看
- `controls.enableDamping = true` 让相机运动更顺滑
- 如果开了 damping，就要在每帧调用 `controls.update()`

这也是为什么 `controls.update()` 被放进动画循环。

---

## 10. Light 和 Material 是一对

很多初学者只盯着几何体，其实“看起来像不像东西”，更依赖材质和光照。

项目里主要用了：

- `AmbientLight`
- `DirectionalLight`
- `MeshStandardMaterial`

### AmbientLight

- 环境光
- 负责整体基础亮度

### DirectionalLight

- 方向光
- 类似太阳光，从某个方向照过来

### MeshStandardMaterial

- 标准材质
- 会受到光照影响
- 比基础材质更有体积感

如果你以后看到 `MeshBasicMaterial`，要知道它的区别：

- `MeshBasicMaterial` 不受光照影响
- 常用于纯色调试或特殊 UI 物体

---

## 11. addGround / addHelpers 是什么思路

这两个函数不是复杂功能，但非常适合建立 3D 直觉。

### addGround

- 创建一个平面
- 旋转 `-Math.PI / 2`
- 让它躺平作为地面

这里帮你理解一个关键事实：

Three.js 默认的平面不是天然“铺在地上”的，很多几何体都需要旋转到正确方向。

### addHelpers

- `GridHelper`：网格辅助线
- `AxesHelper`：坐标轴辅助线

它们的价值不是最终上线，而是调试期帮你建立空间感。

---

## 12. createLearningFactory 是“造模型”的地方

这个文件的职责很纯粹：

- 生成场景内容
- 返回可交互对象
- 返回动画控制对象
- 返回实例化对象

它本质上是一个“场景工厂”。

这很像业务前端里把页面模块拆成独立函数或模块。

---

## 13. Group 是场景树的关键

`createMachine()` 里最重要的不是某个 BoxGeometry，而是：

`const group = new THREE.Group()`

为什么？

因为一台设备不是一个物体，而是一组物体：

- 底座
- 立柱
- 机械臂
- 探头
- 屏幕

用 `Group` 的好处：

- 可以整体移动整台设备
- 也可以只动某个子部件
- 点击子部件时还能回溯到整台设备

这就是场景树思维。

---

## 14. Geometry / Material / Mesh 怎么理解

比如：

`new THREE.BoxGeometry(...)`

表示几何形状是一个盒子。

`new THREE.MeshStandardMaterial(...)`

表示表面是一个受光照影响的材质。

`new THREE.Mesh(geometry, material)`

表示把几何体和材质拼起来，形成一个可见物体。

你可以把它记成：

- `Geometry` 决定长什么样
- `Material` 决定看起来像什么
- `Mesh` 决定这个东西真正出现在场景里

---

## 15. userData 是怎么用的

项目里给设备根节点挂了这些信息：

- `machineRoot`
- `machineMeta`
- `arm`
- `head`

这是 Three.js 里很常见的做法。

`userData` 的意义：

- 给场景对象挂业务信息
- 给交互逻辑保存引用

比如这里：

- `machineRoot` 用来识别“这是整台设备的根节点”
- `machineMeta` 用来同步到 Vue 面板
- `arm` 和 `head` 用来做动画

---

## 16. 动画系统现在是怎么做的

这个项目没有上 `AnimationMixer`，而是先用更容易理解的方式：

- 给每台设备保存一个 `tick(elapsed)` 方法
- 在渲染循环里每帧调用它

这很适合教学。

你先建立这个概念：

- 动画并不神秘，本质上是每一帧根据时间更新对象属性

比如：

- 改旋转
- 改位置
- 改缩放

项目里机械臂的摆动和探头的上下浮动，就是这么做的。

---

## 17. 为什么一定要有动画循环

代码里：

`renderer.setAnimationLoop(() => { ... })`

循环里做了三件核心事：

1. 计算时间 `elapsed`
2. 更新控制器 `controls.update()`
3. 更新设备动画并调用 `renderer.render(scene, camera)`

你以后可以把任何 Three.js 项目的心脏都理解成这个循环。

---

## 18. Raycaster 是怎么实现 3D 点击的

这一段是面试高频，也是你一定要理解的。

流程是：

1. 鼠标事件拿到屏幕坐标
2. 转成标准化设备坐标 `[-1, 1]`
3. `raycaster.setFromCamera(pointer, camera)`
4. `raycaster.intersectObjects(machineGroups, true)`
5. 找到命中的物体

为什么 `intersectObjects(..., true)` 第二个参数是 `true`？

因为设备是分层的，点击时可能命中的是某个子部件，需要递归检测子节点。

然后项目又继续做了一步：

- 从命中的子 Mesh 沿 `parent` 一路向上找
- 找到带 `machineRoot` 标记的设备组

这一步非常关键，因为业务上你选中的不是“探头”或“屏幕”，而是整台设备。

---

## 19. 高亮是怎么做的

高亮逻辑在 `setMachineHighlight()`。

本质做法：

- 遍历设备组下的所有 Mesh
- 修改材质的 `emissive`
- 改 `emissiveIntensity`

这是一种非常常见、也很轻量的高亮方案。

你可以先记住：

- `color` 是表面主颜色
- `emissive` 是自发光颜色

改 `emissive` 很适合做 hover 和选中反馈。

---

## 20. watch 在这里扮演什么角色

这个项目里，`watch` 不是在做普通表单联动，而是在做：

Vue 状态 -> Three.js 对象可见性同步

比如：

- `showGrid` 控制 `gridHelper.visible`
- `showAxes` 控制 `axesHelper.visible`
- `showInstancing` 控制 `instancedBoxes.visible`

这其实就是 Vue 和 Three.js 协作的典型模式：

- Vue 保持“声明式状态”
- Three.js 执行“命令式更新”

---

## 21. InstancedMesh 为什么是性能重点

项目里 `createInstancedBoxes()` 用了：

- `THREE.InstancedMesh`
- `THREE.Matrix4`
- `setMatrixAt`

这是你现在必须先建立印象的优化技术。

普通做法如果创建 36 个独立货箱：

- 36 个 Mesh
- 更多 draw call
- 更多 CPU 调度成本

实例化做法：

- 共用同一套 geometry
- 共用同一套 material
- 每个实例只保存自己的变换矩阵

这样对大量重复物体特别高效。

---

## 22. 为什么要有 disposeScene

业务前端里会销毁定时器、事件监听，Three.js 里要做得更多。

因为 3D 场景里还有 GPU 资源。

这里做的事情包括：

- 停止动画循环
- 移除 resize 和 pointer 事件
- 销毁 controls
- 遍历场景释放 geometry 和 material
- 销毁 renderer
- 移除 canvas DOM

这是面试很加分的一点：

很多人会搭场景，但忘了资源回收。

---

## 23. 你现在先记住这些核心 API

### 场景基础

- `new THREE.Scene()`
- `scene.add(object)`
- `scene.traverse(callback)`

### 相机

- `new THREE.PerspectiveCamera(fov, aspect, near, far)`
- `camera.position.copy(...)`
- `camera.updateProjectionMatrix()`

### 渲染器

- `new THREE.WebGLRenderer(options)`
- `renderer.setSize(width, height)`
- `renderer.setPixelRatio(ratio)`
- `renderer.render(scene, camera)`
- `renderer.setAnimationLoop(fn)`

### 几何体 / 材质 / 网格

- `new THREE.BoxGeometry(...)`
- `new THREE.PlaneGeometry(...)`
- `new THREE.CylinderGeometry(...)`
- `new THREE.MeshStandardMaterial(...)`
- `new THREE.Mesh(geometry, material)`

### 分组 / 变换

- `new THREE.Group()`
- `group.add(child)`
- `object.position.set(x, y, z)`
- `object.rotation.x = ...`
- `object.scale.set(...)`

### 光照

- `new THREE.AmbientLight(color, intensity)`
- `new THREE.DirectionalLight(color, intensity)`

### 交互

- `new THREE.Raycaster()`
- `raycaster.setFromCamera(pointer, camera)`
- `raycaster.intersectObjects(objects, recursive)`

### 动画

- `new THREE.Clock()`
- `clock.getElapsedTime()`

### 性能

- `new THREE.InstancedMesh(geometry, material, count)`
- `new THREE.Matrix4()`
- `instancedMesh.setMatrixAt(index, matrix)`

---

## 24. 你接下来怎么学这个项目

建议分 4 轮。

### 第 1 轮：只看结构

目标：

- 明白 Vue 和 Three.js 的分工
- 明白为什么要有 composable

只看：

- `src/App.vue`
- `src/components/SceneViewport.vue`

### 第 2 轮：吃透初始化

目标：

- 明白 `initScene()` 每一步为什么存在

只看：

- `src/composables/useThreeLearningScene.js`

重点盯：

- `Scene`
- `Camera`
- `Renderer`
- `OrbitControls`
- `Raycaster`
- `setAnimationLoop`

### 第 3 轮：吃透场景搭建

目标：

- 明白场景树和设备组装

只看：

- `src/three/createLearningFactory.js`

### 第 4 轮：吃透交互和性能

目标：

- 明白拾取、高亮、聚焦、实例化

重点回看：

- `updatePointer`
- `getIntersectedMachine`
- `setMachineHighlight`
- `focusSelectedMachine`
- `createInstancedBoxes`

---

## 25. 很适合你的练习顺序

你现在不要急着加模型，先做这 5 个练习：

1. 把地面颜色改掉
2. 给设备再加一个新的 Box 部件
3. 把 `showAxes` 默认改成 `true`
4. 把选中高亮颜色改成红色
5. 把实例化货箱数量从 `3 x 12` 改成 `5 x 20`

做完这 5 个练习，你对：

- 场景树
- 材质
- 可见性
- 交互
- 实例化

就会有非常具体的感觉。

---

## 26. 面试里怎么讲这个项目

你可以这样说：

我先做了一个教学型的 Three.js 实验项目，不是为了堆功能，而是为了把 Three.js 的核心链路吃透。项目基于 Vue3 和 Vite，把 Vue 负责页面状态和控制面板，Three.js 负责场景初始化、渲染、交互和动画。里面我重点练了场景树组织、Raycaster 拾取、高亮反馈、动画循环和 InstancedMesh 这几个点，因为它们基本覆盖了 Web3D 项目里最常见的技术主线。
