import path from "node:path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import vue from "rollup-plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

// `rollup -w` 时会注入该环境变量，用于区分开发/生产构建。
const isWatch = process.env.ROLLUP_WATCH === "true";

export default {
  // 打包入口：从 main.ts 开始递归解析依赖图
  input: "src/main.ts",
  output: {
    // 输出单文件，方便小白先聚焦链路
    file: "dist/bundle.js",
    // 浏览器原生模块格式
    format: "es",
    // 打开 sourcemap，便于调试定位源码
    sourcemap: true
  },
  plugins: [
    // 给 Vue 运行时代码替换编译期常量
    replace({
      preventAssignment: true,
      values: {
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        "process.env.NODE_ENV": JSON.stringify(isWatch ? "development" : "production")
      }
    }),
    // 解析第三方依赖和扩展名
    resolve({
      extensions: [".mjs", ".js", ".json", ".ts", ".vue"]
    }),
    // 先处理 .vue，避免后续插件把 SFC 虚拟模块当普通 JS 误解析
    vue({
      target: "browser",
      // 交给 postcss 统一处理样式注入（包括 <style scoped>）
      css: false,
      preprocessStyles: true,
      template: {
        compilerOptions: {
          // 输出可直接进入后续 JS 转译链
          isTS: false
        }
      }
    }),
    // 处理普通 css 和 .vue 的样式虚拟模块
    postcss({
      include: [/\.css$/, /\.vue\?vue&type=style/],
      inject: true
    }),
    // 把 TS / 新语法快速转为浏览器可执行 JS
    esbuild({
      target: "es2019",
      include: /./,
      exclude: /node_modules/,
      sourceMap: true,
      tsconfig: "tsconfig.json"
    }),
    // 保留 TS 类型检查能力（即使 noEmit 也可报错提示）
    typescript({
      tsconfig: path.resolve("./tsconfig.json")
    }),
    // 仅转换 node_modules 里的 commonjs，避免误处理 Vue 虚拟模块
    commonjs({
      include: /node_modules/
    }),
    // 开发期本地静态服务
    isWatch &&
      serve({
        open: true,
        contentBase: ["."],
        port: 5173
      }),
    // 监听 dist 与 html 自动刷新页面
    isWatch &&
      livereload({
        watch: ["dist", "index.html"]
      })
  ]
};
