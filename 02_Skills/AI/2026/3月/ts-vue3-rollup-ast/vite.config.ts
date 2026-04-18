import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    // 启用 Vue 单文件组件（.vue）支持。
    vue()
  ],
  server: {
    // 与之前保持同一个端口，减少切换成本。
    port: 5173
  },
  build: {
    // 打开 sourcemap，方便调试生产构建产物。
    sourcemap: true,
    // `vite build` 底层使用 Rollup，这里是 Rollup 的扩展入口。
    rollupOptions: {
      output: {
        // 示例：把 node_modules 依赖拆到 vendor 分包。
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          return undefined;
        }
      }
    }
  }
});
