# webpack和vite的设计思想和内核
## webpack
### 一、几个核心理解：
    1、webpack5工程化配置细节常见配置和优化手段
    2、微内核设计思想，webpack5的loader和plugin设计思想是怎样实现个性化的打包构建需求的
    3、说说从0-1实现webpack全生态，说说具体思路
### 二、学习过程
webpack的作用：从项目入口开始，分析整个项目资源依赖图后，利用loader去编译、利用webpack核心配置和plugin去做优化和压缩后，整理为浏览器等前端完全认识，可直接引入的资源。

#### 初始化 - 脚手架wepack-cli
webpack两种使用途径：1.cli 2.node api
webpack配置分为了入口、出口以及黑盒，黑盒部分有编译、转化、优化、压缩。
loader主要做编译转换、plugin主要做产物增强的，比如产物优化和压缩
loader本质是函数，plugin本质是类
#### 实操
input ouput 
在module.rules中设置js资源的转换（babel-loader）和md资源的转换（内置）
发现复用模块并不是每个独立一个chunk，而是会被整合进入一个chunk，规则大概为webpack 不是按“每个复用模块一个 chunk”来拆，而是按“这一组模块都被同一批入口共同依赖”来合并成一个公共 chunk。
异步模块被使用时会被抽离为独立的chunk，不设置时chunk名都是数字，需要在前面加/* webpackChunkName: 'xxx' */来自定义名字。当出现多处对同一模块使用魔法注释且给的名字不一致时，会去其一，而不是打包出多个不同名chunk
实验runtimeChunk: 'single'，打包出运行时独立chunk
cacheGroup可以将不同路径的模块单独抽离出来，比如node_modules->vendor.js,node_modules/gojs->gojs.js，此时priority需要配置好，node_modules内部的要高于node_modules，不然就都被打包了vendor.js了
wepback运行在某个端口需要安装配置webpack-dev-server
chunk本质是一层包裹+注册逻辑，将模块注册到webpack模块体系后，webpack自己决定何时执行新模块内容。
#### 了解webpack的微内核设计
配置ts - 初始化ts依赖和babel-ts的依赖后，实现ts文件类型的解析
实现一个loader，将文字的“微笑”转为表情包😊步骤：**
    1.开发函数，接收代码字符串，改写微笑->😊
    2.配置，找到vue组件或者js文件，将loader添加进去 - 看场景，如果只改写vue内的，那就得匹配.vue；如果全局的，那就可以加在js，毕竟js是较后面的一步。

实现一个plugin:
    1.开发一个类，接收整理后得到的compiler对象，调用api去做文件改写或者其他



## vite
### 一、三个核心理解
对vite的理解，什么是bundleless？
vite构建过程了解吗，说说其实现原理？
设计一个打包工具，你怎么设计？

### 二、学习过程
模块化规范 -
    commonjs
    esm（es module）

浏览器支持esm，可以自动写成依赖体系，不再需要我们自己去构建依赖图去打补丁。

产物构建：
    不依赖打包工具，而是编译工具。

开发环境，js可以直出，代码ts、tsx、jsx、vue，样式css和字体资源，这些需要编译
    esbuild -> ts、tsx、jsx
    postcss -> css
    vite针对这些资源编译用vite-plugin-xxx，vite-plugin-vue\react等，通过插件实现
    优化：对已编译内容缓存、增量编译、hmr
生产环境：
    rollup实现
    优化：treeshaking\chunk
### 三、vite的构建过程、实现原理？
构建过程：
    开发构建：
        1.vite命令执行
        2.项目初始化
        3.启动开发服务器
        4.编译
        5.HMR
        6.sourcemap
    生产构建：
        1.vite build
        2.分析入口，创建模块依赖图，treeshaking
        3.编译转换得到输出内容
        4.优化：
            资源优化：压缩
            缓存： 分包、内容加哈希
利用浏览器的esm支持，开发阶段页面按需请求的模块，开发服务器接收请求后编译该模块，避免了全局打包，大幅提高开发效率。
至于hmr的实现方式，我不太清楚vite如何决定重新刷新还是局部更新的，大概可能和webpack的更新模块往回找到accept它就停下，执行热更新差不多？

### 四、设计一个打包工具的思路
快速启动
HMR
开发时优化：模块缓存、hmr
生产打包优化：分包、压缩、treeshaking、chunk
插件拓展能力：支持插件拓展
编译能力：sourcemap、loader

