import HtmlWebpackPlugin from "html-webpack-plugin"
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default {
    // 入口配置
    entry: {
        main: './src/index.js',
        main2: './src/index2.js'
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
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/main.html',
            filename: 'hhhh入口.html'
        }), // html注入插件
    ],
}