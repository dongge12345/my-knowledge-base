import Vue from "vue";
import { Button, Card, Tag, Divider, Alert, Menu, MenuItem, Progress } from "element-ui";

// 只注册本项目实际使用的组件，避免 UI 库全量引入
Vue.use(Button);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Divider);
Vue.use(Alert);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Progress);
