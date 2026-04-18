<script setup>
import { computed } from 'vue';
import { useThreeLearningScene } from './composables/useThreeLearningScene';

const { setCanvasHost, isSceneReady, sceneState, resetCamera, toggleCubeColor } =
  useThreeLearningScene();

const conceptCards = [
  {
    title: 'Scene',
    description: '3D 世界的根节点，所有物体最后都要放进 scene 里。',
  },
  {
    title: 'Camera',
    description: '决定你从哪里看场景，PerspectiveCamera 最接近人眼透视。',
  },
  {
    title: 'Renderer',
    description: '真正把 Three.js 场景绘制到浏览器 canvas 上。',
  },
  {
    title: 'Mesh',
    description: '几何体 + 材质 = 可见物体，是 3D 页面里真正“看到”的东西。',
  },
  {
    title: 'Raycaster',
    description: '3D 点击和拾取的核心工具，用射线判断鼠标点到了哪个物体。',
  },
];

const apiList = [
  'new THREE.Scene()',
  'new THREE.PerspectiveCamera(...)',
  'new THREE.WebGLRenderer(...)',
  'new THREE.Mesh(...)',
  'new OrbitControls(...)',
  'raycaster.intersectObjects(...)',
  'renderer.setAnimationLoop(...)',
];

const quickStatus = computed(() => [
  `场景状态：${isSceneReady ? '已初始化' : '初始化中'}`,
  `自动旋转：${sceneState.autoRotate ? '开启' : '关闭'}`,
  `网格辅助线：${sceneState.showGrid ? '显示' : '隐藏'}`,
  `当前立方体颜色：${sceneState.cubeColorLabel}`,
]);
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <header class="hero-card">
        <p class="eyebrow">两天面试准备版</p>
        <h1>极简 Three.js 学习项目</h1>
        <p class="hero-copy">
          这个版本只保留你两天内最该吃透的东西：场景、相机、渲染器、一个模型、基础光照、动画循环、射线拾取和最少量的 Vue
          联动。
        </p>
      </header>

      <section class="section-card">
        <h2>你先记住这 5 个概念</h2>
        <ul class="concept-list">
          <li v-for="card in conceptCards" :key="card.title">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </li>
        </ul>
      </section>

      <section class="section-card">
        <h2>这个项目只演示 4 件事</h2>
        <ul class="plain-list">
          <li>初始化一个最小可运行的 Three.js 场景</li>
          <li>创建一个带层级关系的 3D 物体组</li>
          <li>让物体在动画循环里运动</li>
          <li>用 Raycaster 实现点击选中和颜色切换</li>
        </ul>
      </section>

      <section class="section-card">
        <h2>先混个眼熟的 API</h2>
        <ul class="plain-list compact">
          <li v-for="item in apiList" :key="item">
            <code>{{ item }}</code>
          </li>
        </ul>
      </section>

      <section class="section-card">
        <div class="panel-header">
          <h2>现在动手玩</h2>
          <p>不要先背 API，先玩出“场景在动、物体能点、颜色会变”的直觉。</p>
        </div>

        <div class="toggle-grid">
          <label class="toggle-row">
            <span>自动旋转</span>
            <input v-model="sceneState.autoRotate" type="checkbox" />
          </label>
          <label class="toggle-row">
            <span>网格辅助线</span>
            <input v-model="sceneState.showGrid" type="checkbox" />
          </label>
        </div>

        <div class="button-row">
          <button type="button" :disabled="!isSceneReady" @click="resetCamera">
            重置相机
          </button>
          <button type="button" :disabled="!isSceneReady" @click="toggleCubeColor">
            切换立方体颜色
          </button>
        </div>

        <p class="selected-summary">{{ sceneState.lastAction }}</p>
      </section>

      <section class="section-card">
        <h2>你面试时先能说什么</h2>
        <ul class="plain-list compact">
          <li>Three.js 是对 WebGL 的上层封装，让前端更容易搭 3D 页面。</li>
          <li>3D 页面最基础的链路是 scene、camera、renderer。</li>
          <li>交互不是 DOM 点击，而是用 Raycaster 做射线拾取。</li>
          <li>动画不是魔法，本质上是每一帧更新物体属性再重新渲染。</li>
        </ul>
      </section>
    </aside>

    <main class="viewport-area">
      <section class="viewport-shell">
        <div class="viewport-toolbar">
          <span>拖拽旋转</span>
          <span>滚轮缩放</span>
          <span>点击立方体切换颜色</span>
        </div>
        <div :ref="setCanvasHost" class="viewport-canvas"></div>
        <div class="viewport-status">
          <strong>最近一次交互</strong>
          <p>{{ sceneState.lastAction }}</p>
        </div>
      </section>

      <section class="section-card">
        <h2>当前运行状态</h2>
        <ul class="plain-list compact">
          <li v-for="item in quickStatus" :key="item">{{ item }}</li>
        </ul>
        <p class="status-note">{{ sceneState.lastAction }}</p>
      </section>
    </main>
  </div>
</template>
