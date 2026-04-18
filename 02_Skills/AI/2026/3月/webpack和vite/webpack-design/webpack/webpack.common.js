import HtmlWebpackPlugin from "html-webpack-plugin"
import path from 'path'
import { fileURLToPath } from 'url'
import { VueLoaderPlugin } from 'vue-loader';

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
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
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/main.html',
            filename: 'hhhh入口.html', // 如果我硬要用自己定义的名字
        }), // html注入插件
        new VueLoaderPlugin()
    ],

}