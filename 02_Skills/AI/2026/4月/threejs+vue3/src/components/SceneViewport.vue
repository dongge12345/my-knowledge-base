<script setup>
defineProps({
  setContainerElement: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <section class="viewport-shell">
    <div class="viewport-toolbar">
      <span>拖拽旋转场景</span>
      <span>滚轮缩放</span>
      <span>点击设备查看信息</span>
    </div>
    <div :ref="setContainerElement" class="viewport-canvas"></div>
  </section>
</template>
