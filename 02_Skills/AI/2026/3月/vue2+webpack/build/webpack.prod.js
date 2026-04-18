const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const commonConfig = require("./webpack.common");

// 通过 npm run build:analyze 注入体积分析插件
const isAnalyze = process.env.ANALYZE === "true";

// 生产环境只保留发布相关优化能力
module.exports = merge(commonConfig, {
  mode: "production",
  // 保留 source-map 便于线上问题排查（体积会略增）
  devtool: "source-map",
  module: {
    rules: [
      {
        // 生产环境抽离 CSS 到独立文件，利于缓存和并行加载
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        // less -> css 后抽离
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "less-loader"]
      }
    ]
  },
  optimization: {
    // 开启压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 并行压缩 JS，提高构建速度
        parallel: true,
        extractComments: false
      }),
      // 压缩 CSS
      new CssMinimizerPlugin()
    ],
    // 单独拆出 webpack 运行时代码，提升长期缓存稳定性
    runtimeChunk: "single",
    splitChunks: {
      // 同步与异步模块都参与分包
      chunks: "all",
      minSize: 20 * 1024,
      maxInitialRequests: 10,
      maxAsyncRequests: 20,
      cacheGroups: {
        vue: {
          // Vue 核心生态单独分包
          test: /[\\/]node_modules[\\/](vue|vue-router)[\\/]/,
          name: "chunk-vue",
          priority: 40,
          enforce: true
        },
        elementUi: {
          // Element UI 单独分包
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          name: "chunk-element-ui",
          priority: 30,
          enforce: true
        },
        chartLib: {
          // ECharts 等重图表库单独分包，避免污染首屏包
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          name: "chunk-echarts",
          priority: 20,
          reuseExistingChunk: true
        },
        vendors: {
          // 其余第三方依赖归入 vendors
          test: /[\\/]node_modules[\\/]/,
          name: "chunk-vendors",
          priority: 10,
          reuseExistingChunk: true
        },
        common: {
          // 业务公共模块（被至少 2 处复用）抽公共包
          name: "chunk-common",
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    // 每次构建前清空 dist
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // CSS 也使用 contenthash，匹配长期缓存策略
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].chunk.css"
    }),
    // 可选：产物体积可视化分析
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : [])
  ]
});
