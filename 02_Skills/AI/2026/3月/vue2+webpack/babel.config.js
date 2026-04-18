module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // 按代码使用情况自动注入 polyfill（而不是全量引入）
        useBuiltIns: "usage",
        // 指定 core-js 主版本
        corejs: 3
      }
    ]
  ],
  plugins: [
    [
      // Element UI 按需引入插件：按组件自动引入对应样式
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
