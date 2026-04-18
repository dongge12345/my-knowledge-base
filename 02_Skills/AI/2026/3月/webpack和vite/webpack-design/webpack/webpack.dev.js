import common, {__dirname} from './webpack.common.js'
import { merge }  from 'webpack-merge';
export default merge(common, {
    mode: 'development',
    devServer: {
        port: 8099
    }
})