<template>
  <section class="protected">
    <h2>受保护页面</h2>
    <p>你能看到这个页面，说明 `beforeEach` 守卫放行了。</p>
    <p>当前登录状态：{{ isLoggedIn ? "已登录" : "未登录" }}</p>
    <p>当前用户：{{ currentUser }}</p>
    <p>共享摘要：{{ summary }}</p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDemoStore } from "../stores/useDemoStore";

const demoStore = useDemoStore();
const { currentUser, isLoggedIn, summary } = storeToRefs(demoStore);
</script>

<style scoped>
.protected {
  color: #374151;
}
</style>
