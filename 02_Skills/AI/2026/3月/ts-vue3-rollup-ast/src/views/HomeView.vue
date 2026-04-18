<template>
  <section class="panel">
    <h2>Pinia 基础案例</h2>
    <p class="note">
      这一页和“说明”页共用同一个 store。你在这里改的状态，切到另一页还能看到。
    </p>

    <h3>1) 共享状态（state）</h3>
    <p>当前用户：{{ currentUser }}</p>
    <p>共享计数：{{ sharedCount }}</p>
    <p>主题：{{ theme }}</p>

    <h3>2) 派生值（getter / computed）</h3>
    <p>{{ summary }}</p>

    <h3>3) 统一修改入口（actions）</h3>
    <div class="row">
      <input v-model.trim="draftName" placeholder="输入新的用户名" />
      <button @click="rename(draftName)">改名</button>
      <button @click="increment">+1</button>
      <button @click="decrement">-1</button>
      <button @click="toggleTheme">切换主题</button>
    </div>

    <h3>4) 对比 composable</h3>
    <p class="note">
      composable 更偏“逻辑复用”，Pinia 更偏“共享状态统一管理”。
    </p>
    <CounterPanel :count="sharedCount" @inc="increment" @dec="decrement" />
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import CounterPanel from "../components/CounterPanel.vue";
import { useDemoStore } from "../stores/useDemoStore";

const draftName = ref("");

// 组件中直接拿 store，就是 Pinia 最基础的使用方式。
const demoStore = useDemoStore();

// storeToRefs 用于把 state/getter 解构成响应式引用，避免直接解构丢失响应性。
const { currentUser, sharedCount, theme, summary } = storeToRefs(demoStore);
const { increment, decrement, rename, toggleTheme } = demoStore;
</script>

<style scoped>
.panel h2,
.panel h3 {
  margin: 12px 0;
}

.note {
  color: #4b5563;
}

.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
}

button {
  border: none;
  background: #111827;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}
</style>
