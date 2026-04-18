import { createRouter, createWebHistory } from "vue-router";
import { pinia } from "../pinia";
import { useDemoStore } from "../stores/useDemoStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/compare/manual"
    },
    {
      path: "/compare/manual",
      component: () => import("../views/ManualRouterDemo.vue")
    },
    {
      path: "/router-demo/home",
      component: () => import("../views/HomeView.vue")
    },
    {
      path: "/router-demo/about",
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/router-demo/protected",
      component: () => import("../views/ProtectedView.vue"),
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// 最小守卫示例：
// 如果目标路由要求登录，而当前 store 中 isLoggedIn=false，就跳回 about。
router.beforeEach((to) => {
  const demoStore = useDemoStore(pinia);

  if (to.meta.requiresAuth && !demoStore.isLoggedIn) {
    return {
      path: "/router-demo/about",
      query: {
        denied: "1",
        from: to.fullPath
      }
    };
  }

  return true;
});

export default router;
