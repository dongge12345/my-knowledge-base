import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 路由级懒加载：访问到该路由时才加载对应页面代码
const HomeView = () => import(/* webpackChunkName: "view-home" */ "@/views/Home.vue");
const HeavyView = () => import(/* webpackChunkName: "view-heavy" */ "@/views/Heavy.vue");
const VuexDemoView = () => import(/* webpackChunkName: "view-vuex" */ "@/views/VuexDemo.vue");
const PropsMutationDemoView = () => import(/* webpackChunkName: "view-props" */ "@/views/PropsMutationDemo.vue");
const VModelDemoView = () => import(/* webpackChunkName: "view-vmodel" */ "@/views/VModelDemo.vue");
const MarkdownDemoView = () => import(/* webpackChunkName: "view-markdown" */ "@/views/MarkdownDemo.vue");

export default new Router({
  // history 模式：URL 更干净，但需要服务端把前端路由回退到 index.html
  mode: "history",
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: HomeView },
    { path: "/heavy", component: HeavyView },
    { path: "/vuex", component: VuexDemoView },
    { path: "/props-mutation", component: PropsMutationDemoView },
    { path: "/v-model", component: VModelDemoView },
    { path: "/markdown", component: MarkdownDemoView }
  ]
});
