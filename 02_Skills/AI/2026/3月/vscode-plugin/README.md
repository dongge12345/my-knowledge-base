# Lowcode Material Assistant

面向低代码平台建设物料接入能力的 VS Code 高开辅助插件脚手架。

## 目标

- 降低存量项目接入、配置和复用成本
- 通过 Babel AST 自动抽取组件 `props / methods / slots`
- 自动生成组件 Schema 和接入说明文档
- 基于 Formily 实现 JSON Schema 可视化配置
- 支持资源读取、物料安装、配置闭环和代码提示

## 当前能力

- 命令面板支持抽取组件元信息、生成 Schema/文档、刷新物料资源、安装物料
- 通过 Babel AST 对常见 `props / methods / slots` 结构进行首版抽取
- 生成 `.lowcode-assistant` 目录下的 `schema`、`docs`、`resource-index.json`
- 提供 Webview 面板骨架，用于承载 Formily 可视化配置页面
- 提供基于资源索引的基础代码提示入口

## 目录结构

```text
src/
  commands/      VS Code 命令入口
  panels/        Webview 面板
  providers/     代码提示与编辑器能力
  services/      AST、Schema、资源与物料服务
  types/         类型定义
  utils/         文件与消息工具
webview-ui/      Formily 配置子应用
examples/        示例配置
```

## 快速开始

```bash
npm install
npm run build
```

然后在 VS Code 中按 `F5` 启动扩展开发宿主。

## 推荐工作流

1. 打开组件源码文件，执行 `Lowcode Assistant: 抽取组件元信息`
2. 执行 `Lowcode Assistant: 生成 Schema 与文档`
3. 执行 `Lowcode Assistant: 打开可视化配置面板`
4. 执行 `Lowcode Assistant: 刷新物料资源`

## 配置文件

参考 `examples/lowcode-assistant.config.json`。

## 后续建议

- 补充对 React/Vue 组件声明风格的更完整 AST 适配
- 将 Webview 子应用与真实 Formily Designer 能力联动
- 接入企业私有物料源、鉴权与安装协议
- 增加测试、打包发布与 CI
