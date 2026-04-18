<template>
  <section class="about">
    <h2>说明页</h2>
    <p>这是第二个页面，用来观察 Pinia 的“跨页面共享状态”。</p>
    <p>当前共享用户：{{ currentUser }}</p>
    <p>当前共享计数：{{ sharedCount }}</p>
    <p>当前主题：{{ theme }}</p>
    <p>派生摘要：{{ summary }}</p>
    <button @click="increment">在说明页也可以 +1</button>
    <button @click="print">打印当前状态</button>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDemoStore } from "../stores/useDemoStore";

const demoStore = useDemoStore();
const { currentUser, sharedCount, theme, summary } = demoStore; //storeToRefs(demoStore) // storeToRefs(demoStore);
const { increment } = demoStore;
function print() {
  console.log("当前状态:", sharedCount);
  const { currentUser, sharedCount: count, theme, summary } = demoStore; 
  console.log("当前状态:", count);
}
</script>

<style scoped>
.about {
  color: #374151;
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
