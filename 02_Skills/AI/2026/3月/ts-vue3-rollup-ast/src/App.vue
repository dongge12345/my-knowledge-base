<template>
  <main class="page">
    <section class="shell">
      <h1>手写路由 vs vue-router</h1>
      <p class="intro">
        这里保留了手写 history 路由版本，同时新增 vue-router 的懒加载和守卫演示。
      </p>

      <div class="topbar">
        <div class="group">
          <span class="label">对照入口</span>
          <router-link to="/compare/manual">手写版</router-link>
          <router-link to="/router-demo/home">vue-router 首页</router-link>
          <router-link to="/router-demo/about">vue-router 说明页</router-link>
          <router-link to="/router-demo/protected">受保护页</router-link>
        </div>

        <div class="group">
          <span class="label">当前 route</span>
          <code>{{ route.fullPath }}</code>
          <button @click="goProtected">router.push 到受保护页</button>
        </div>

        <div class="group">
          <span class="label">守卫状态</span>
          <code>{{ isLoggedIn ? "已登录" : "未登录" }}</code>
          <button v-if="!isLoggedIn" @click="login">模拟登录</button>
          <button v-else @click="logout">退出登录</button>
        </div>
      </div>

      <router-view />
    </section>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useDemoStore } from "./stores/useDemoStore";

const route = useRoute();
const router = useRouter();
const demoStore = useDemoStore();
const { isLoggedIn } = storeToRefs(demoStore);
const { login, logout } = demoStore;

function goProtected() {
  router.push("/router-demo/protected");
}
</script>

<style scoped>
.page {
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  min-height: 100vh;
  display: grid;
  place-items: start center;
  background: linear-gradient(135deg, #f6f7fb, #eef1f7);
  color: #1f2937;
  padding: 32px 16px;
}

.shell {
  width: min(960px, 96vw);
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
}

.intro {
  color: #4b5563;
}

.topbar {
  display: grid;
  gap: 12px;
  margin: 18px 0 24px;
}

.group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.label {
  font-weight: 600;
}

a {
  color: #111827;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  background: #eef2ff;
}

code {
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
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
