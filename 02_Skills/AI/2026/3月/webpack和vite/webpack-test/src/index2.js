import mdString from '@/test.md'
import {getTime} from '@/utils/time.js'
import comp from '@/components/comp.js'
const fn = (a = 1, b = 2) => {
    console.log('a + b', a, b)
    const c = 3;
    return a + b + c
}
const res = fn(100, 200)
console.log('res', res)
const printMd = () => {
    console.log('mdString', mdString)
    const { getString } = import(/* webpackChunkName: "s2tring2" */ '@/utils/string');
    const { getNumber } = import(/* webpackChunkName: "n2umber2" */ '@/utils/number');
    console.log('getString', getString, getNumber)
}
printMd()

const time = getTime();
console.log('curtime2', time)