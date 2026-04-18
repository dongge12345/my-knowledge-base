interface Custom {
    type: string;
    gender: '男' | '女',
    description: string
}

export const c:Custom = {
    type: '垄断企业',
    gender: '男',
    description: '高级人才'
}

console.log('c',c)