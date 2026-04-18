const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 项目根目录，后续所有相对路径都基于它计算
const rootPath = path.resolve(__dirname, "..");

module.exports = {
  // 统一上下文目录，避免每个路径都手写相对层级
  context: rootPath,
  entry: {
    // 单页应用入口
    app: path.resolve(rootPath, "src/main.js")
  },
  output: {
    // 生产构建输出目录
    path: path.resolve(rootPath, "dist"),
    // 入口包文件名；contenthash 用于长期缓存
    filename: "js/[name].[contenthash:8].js",
    // 异步包文件名；路由懒加载/动态 import 都会落到这里
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    publicPath: "/"
  },
  resolve: {
    // 省略导入扩展名
    extensions: [".js", ".vue", ".json"],
    alias: {
      // 工程化别名，减少 ../../ 目录跳转
      "@": path.resolve(rootPath, "src"),
      // Vue2 运行时 + 模板编译版本（支持 template）
      vue$: "vue/dist/vue.esm.js"
    }
  },
  module: {
    rules: [
      {
        // 让 webpack 识别并编译 .vue 单文件组件
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        // 用 Babel 转译业务 JS，配合 preset-env 做兼容
        test: /\.js$/,
        include: path.resolve(rootPath, "src"),
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        // 图片资源：小图转 base64，大图产出独立文件
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          filename: "assets/images/[name].[contenthash:8][ext]"
        }
      },
      {
        // 字体资源始终产出为独立文件
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[contenthash:8][ext]"
        }
      },
      {
        // Markdown 原文按字符串导入，不额外安装 loader，直接使用 webpack5 内置资源模块
        test: /\.md$/i,
        type: "asset/source"
      }
    ]
  },
  plugins: [
    // 必需插件：驱动 vue-loader 的 SFC 编译流程
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板，自动注入打包产物
      template: path.resolve(rootPath, "public/index.html"),
      inject: "body"
    })
  ]
};
