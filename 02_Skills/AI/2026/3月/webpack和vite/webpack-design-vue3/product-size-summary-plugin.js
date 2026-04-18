import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default class productionSizeSummaryPlugin {
    constructor() {
        this.name = 'productionSizeSummaryPlugins'
    }
    apply(compiler) {
        console.log('--------------- compiler ddddddddddddddddd-----------------------')
        // compiler.hooks.emit时机不对，会导致产物被删除；应该用afterEmit，保证产物构建完之后执行
        compiler.hooks.afterEmit.tapAsync(this.name, (compilation, callback) => {
            const stats = [];
            for(let key in compilation.assets) {
                stats.push({
                    name: key,
                    size: compilation.assets[key].size()
                })
            }
            const outDir = path.resolve(__dirname, "dist");
            const content = JSON.stringify(stats, null, 2)
            console.log('content',content, outDir,path.join(outDir, 'size-summary.md'))
            fs.mkdirSync(outDir, {recursive: true})
            fs.writeFileSync(path.join(outDir, 'size-summary.md'),content)
            callback()
        })
    }
}