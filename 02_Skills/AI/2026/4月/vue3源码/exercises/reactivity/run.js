const assert = require('node:assert/strict')
const { effect, reactive } = require('./todo')

try {
  const state = reactive({
    count: 0,
    nested: {
      value: 10
    }
  })

  let countSnapshot = -1
  effect(() => {
    countSnapshot = state.count
  })

  assert.equal(countSnapshot, 0, 'effect 首次执行后，countSnapshot 应该是 0')

  state.count = 1
  assert.equal(countSnapshot, 1, '修改 state.count 后，effect 应该重新执行')

  let nestedSnapshot = -1
  effect(() => {
    nestedSnapshot = state.nested.value
  })

  assert.equal(nestedSnapshot, 10, '嵌套对象第一次读取应该能拿到 10')

  state.nested.value = 20
  assert.equal(nestedSnapshot, 20, '嵌套对象更新后也应该触发 effect')

  console.log('reactivity 练习通过：你已经打通了 get 收集依赖、set 触发更新 这条主线。')
} catch (error) {
  console.error('reactivity 练习未通过，请先补完 exercises/reactivity/todo.js 里的 TODO。')
  throw error
}
