import { computed, ref } from "vue";
import { defineStore } from "pinia";

// 这个 store 同时演示 Pinia 的三部分：
// state：共享状态
// getter：派生值
// action：统一修改入口
export const useDemoStore = defineStore("demo", () => {
  const sharedCount = ref(1);
  const currentUser = ref("PaiPai");
  const theme = ref<"light" | "dark">("light");
  const isLoggedIn = ref(false);

  const summary = computed(
    () =>
      `${currentUser.value} / count=${sharedCount.value} / theme=${theme.value} / login=${isLoggedIn.value}`
  );

  function increment() {
    sharedCount.value += 1;
  }

  function decrement() {
    sharedCount.value -= 1;
  }

  function rename(name: string) {
    currentUser.value = name.trim() || currentUser.value;
  }

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }

  function login() {
    isLoggedIn.value = true;
  }

  function logout() {
    isLoggedIn.value = false;
  }

  return {
    sharedCount,
    currentUser,
    theme,
    isLoggedIn,
    summary,
    increment,
    decrement,
    rename,
    toggleTheme,
    login,
    logout
  };
});
