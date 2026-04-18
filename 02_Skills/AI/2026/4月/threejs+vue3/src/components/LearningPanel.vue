<script setup>
const props = defineProps({
  sceneState: {
    type: Object,
    required: true,
  },
  isSceneReady: {
    type: Boolean,
    required: true,
  },
  selectedMachine: {
    type: Object,
    default: null,
  },
  selectedMachineSummary: {
    type: String,
    required: true,
  },
});

defineEmits(['reset-camera', 'focus-selected']);
</script>

<template>
  <section class="section-card">
    <div class="panel-header">
      <h2>交互控制</h2>
      <p>边看边玩，比只看文档更快建立印象。</p>
    </div>

    <div class="toggle-grid">
      <label class="toggle-row">
        <span>设备动画</span>
        <input v-model="sceneState.animationEnabled" type="checkbox" />
      </label>
      <label class="toggle-row">
        <span>网格辅助线</span>
        <input v-model="sceneState.showGrid" type="checkbox" />
      </label>
      <label class="toggle-row">
        <span>坐标轴辅助线</span>
        <input v-model="sceneState.showAxes" type="checkbox" />
      </label>
      <label class="toggle-row">
        <span>实例化货箱</span>
        <input v-model="sceneState.showInstancing" type="checkbox" />
      </label>
    </div>

    <label class="slider-row">
      <span>动画速度</span>
      <input
        v-model="sceneState.animationSpeed"
        type="range"
        min="0.2"
        max="3"
        step="0.1"
      />
      <strong>{{ Number(sceneState.animationSpeed).toFixed(1) }}</strong>
    </label>

    <div class="button-row">
      <button type="button" :disabled="!isSceneReady" @click="$emit('reset-camera')">
        重置相机
      </button>
      <button
        type="button"
        :disabled="!isSceneReady || !selectedMachine"
        @click="$emit('focus-selected')"
      >
        聚焦设备
      </button>
    </div>
  </section>

  <section class="section-card">
    <h2>当前选中设备</h2>
    <p class="selected-summary">{{ selectedMachineSummary }}</p>

    <div v-if="selectedMachine" class="selected-machine">
      <div class="info-row">
        <span>名称</span>
        <strong>{{ selectedMachine.name }}</strong>
      </div>
      <div class="info-row">
        <span>类型</span>
        <strong>{{ selectedMachine.type }}</strong>
      </div>
      <div class="info-row">
        <span>状态</span>
        <strong>{{ selectedMachine.status }}</strong>
      </div>
      <div class="info-row">
        <span>温度</span>
        <strong>{{ selectedMachine.temperature }}°C</strong>
      </div>
      <div class="info-row">
        <span>性能讲法</span>
        <strong>hover / click 都通过射线拾取实现</strong>
      </div>
    </div>
  </section>

  <section class="section-card">
    <h2>你要观察什么</h2>
    <ul class="plain-list compact">
      <li>为什么 3D 页面必须有动画循环</li>
      <li>模型被选中时，为什么要沿父节点向上找设备组</li>
      <li>为什么大量重复物体适合用 InstancedMesh</li>
      <li>Vue 只管 UI 状态，Three.js 负责真实渲染对象</li>
    </ul>
  </section>
</template>
