import mdString from '@/test.md'
import {getTime} from '@/utils/time.js'
import comp from '@/components/comp.js'
import elementUI from 'element-ui'
import gojs from 'gojs'
const fn = (a = 1, b = 2) => {
    console.log('a + b', a, b)
    const c = 3;
    return a + b + c
}
const res = fn(100, 200)
console.log('res', res)
const printMd = () => {
    console.log('mdString', mdString)
    const { getString } = import(/* webpackChunkName: "string" */ '@/utils/string');
    const { getNumber } = import(/* webpackChunkName: "number" */ '@/utils/number');
    console.log('getString', getString, getNumber)
}
printMd()

const time = getTime();
console.log('curtime24', time)


console.log('elementUI', elementUI)

console.log('gojs',gojs)