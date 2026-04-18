<template>
  <section class="card">
    <h2>手写 history 路由版本</h2>
    <p class="note">
      这个演示页保留你之前的核心思路：自己维护 route、自写 navigate、监听 popstate、再用
      <code>&lt;component :is&gt;</code> 切换组件。
    </p>

    <div class="mapping">
      <p><strong>对应关系</strong></p>
      <p>`currentView` -> `router-view`</p>
      <p>`navigate()` -> `router.push()`</p>
      <p>`route ref` -> `useRoute()`</p>
      <p>`popstate` 监听 -> vue-router 内部 history 监听</p>
    </div>

    <div class="bar">
      <span class="label">手写内部路由：</span>
      <button @click="navigate('home')">首页</button>
      <button @click="navigate('about')">说明</button>
      <code>?manual={{ manualRoute }}</code>
    </div>

    <component :is="currentView" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import HomeView from "./HomeView.vue";
import AboutView from "./AboutView.vue";

type ManualRouteKey = "home" | "about";

const manualRoute = ref<ManualRouteKey>(getManualRoute());

function getManualRoute(): ManualRouteKey {
  const params = new URLSearchParams(window.location.search);
  return params.get("manual") === "about" ? "about" : "home";
}

function navigate(to: ManualRouteKey) {
  if (manualRoute.value === to) return;
  const url = new URL(window.location.href);
  url.searchParams.set("manual", to);
  window.history.pushState({}, "", `${url.pathname}${url.search}`);
  manualRoute.value = to;
}

function onPopState() {
  manualRoute.value = getManualRoute();
}

const currentView = computed(() => (manualRoute.value === "about" ? AboutView : HomeView));

onMounted(() => {
  window.addEventListener("popstate", onPopState);
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", onPopState);
});
</script>

<style scoped>
.card {
  padding: 24px;
  border-radius: 18px;
  background: #fff;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.note {
  color: #4b5563;
}

.mapping {
  margin: 16px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
}

.bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.label {
  font-weight: 600;
}

button {
  border: none;
  background: #111827;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

code {
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}
</style>
