// 告诉 TypeScript：导入 .vue 文件时，把它当成 Vue 组件类型处理。
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
