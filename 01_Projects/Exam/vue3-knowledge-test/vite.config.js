
import vue from '@vitejs/plugin-vue' // 引入vue插件

export default {
    resolve: {
        alias: {
            '@': '/src',
        }
    },
    plugins: [vue()],
}
