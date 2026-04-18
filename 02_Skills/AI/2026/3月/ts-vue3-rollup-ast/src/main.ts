import { createApp } from "vue";
import router from "./router";
import { pinia } from "./pinia";
import App from "./App.vue";

// 应用入口：先创建应用实例，再挂载 Pinia，最后挂到页面根节点。
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
