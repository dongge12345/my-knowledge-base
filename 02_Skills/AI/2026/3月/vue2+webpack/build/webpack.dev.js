const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

// 开发环境只放开发特有配置，再与 common 合并
module.exports = merge(commonConfig, {
  mode: "development",
  // 开发调试友好，构建速度快
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        // 开发环境样式直接注入到 <style>，支持 HMR
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        // less -> css，并注入页面
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      }
    ]
  },
  devServer: {
    // 自动寻找可用端口，避免 8080 被占用时启动失败
    port: "auto",
    // 开启热更新
    hot: true,
    open: false,
    // 前端路由刷新时回退到 index.html
    historyApiFallback: true,
    static: {
      // 额外静态资源目录（不走 webpack 打包）
      directory: path.resolve(__dirname, "../public")
    }
  }
});
