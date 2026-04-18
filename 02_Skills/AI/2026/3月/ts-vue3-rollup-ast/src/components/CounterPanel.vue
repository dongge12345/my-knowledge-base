<template>
  <div class="row">
    <button @click="emit('dec')">-1操作2</button>
    <span class="count">{{ count }}</span>
    <button @click="emit('inc')">+1操作2</button>
  </div>
</template>

<script setup lang="ts">

// 子组件只接收展示所需数据，不直接改父组件状态。
defineProps<{
  count: number;
}>();

// 子组件通过事件把“意图”抛给父组件（inc/dec）。
const emit = defineEmits<{
  (event: "inc"): void;
  (event: "dec"): void;
}>();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("[HMR] CounterPanel updated");
  });
}

</script>

<style scoped>
.row {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

button {
  border: none;
  background: #111827;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.count {
  font-size: 22px;
  font-weight: 600;
}
</style>
