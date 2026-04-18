import HtmlWebpackPlugin from "html-webpack-plugin"
import { VueLoaderPlugin } from 'vue-loader';
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default {
    // 入口配置
    entry: {
        main: './src/index.js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src') // __dirname是commonjs的模块化规范
        }
    },
    output: {
        filename: '[name].[contenthash].js',
        clean: true, // 清空旧的打包内容，原来是插件实现，新版本的webpack将这部分能力内置
        environment: {
            arrowFunction: false,
            const: false,
        }
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                type: 'asset/source', // 使用webpack内置的
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.[jt]s$/,
                use: ['babel-loader', './emojo-loader.js']
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new VueLoaderPlugin(), // vue解析插件
    ],
}