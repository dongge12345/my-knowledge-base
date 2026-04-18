import VueTemp from './5.vue'

interface Customer {
    name: string;
    age?: number;
    gender?: '男' | '女' | '隐藏';
    score?: number
}

export const student:Customer = {
    name: '小青'
}
console.log('strstr', student)
console.log('VueTemp',VueTemp)