import common from './webpack.common.js'
import { merge }  from 'webpack-merge';

export default merge(common, {
    mode: 'production',
    optimization: {
        minimize: true, // 是否压缩
        splitChunks: {
            chunks: 'all',
            // minChunks: 2, // 最少被复用几次才抽离chunk
            // minSize: 10, // 提取为chunk的最少字节数
            cacheGroups: {
                // 
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: 'vendor.js',
                    priority: 10,     // 优先级高于默认组
                    enforce: true
                },
                gojs: {
                    test: /[\\/]node_modules[\\/]gojs[\\/]/,
                    filename: 'gojs.js',
                    priority: 133,     // 优先级高于默认组
                    enforce: true
                }
            }
        },
        runtimeChunk: 'single', // 将所有入口的运行时合并打包成一个独立的chunk，避免生产环境这部分资源重复更新
    },
})