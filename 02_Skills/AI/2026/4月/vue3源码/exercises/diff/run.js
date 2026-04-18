const assert = require('node:assert/strict')
const { diffKeyedChildren, getSequence } = require('./todo')

try {
  const sequence = getSequence([3, 2, 0])
  assert.deepEqual(sequence, [1], 'getSequence([3, 2, 0]) 应该返回 [1]')

  const oldChildren = [
    { key: 'a' },
    { key: 'b' },
    { key: 'c' },
    { key: 'd' }
  ]

  const newChildren = [
    { key: 'a' },
    { key: 'c' },
    { key: 'b' },
    { key: 'e' },
    { key: 'd' }
  ]

  const operations = diffKeyedChildren(oldChildren, newChildren)

  assert.deepEqual(
    operations,
    [
      { type: 'move', key: 'c', to: 1 },
      { type: 'insert', key: 'e', to: 3 }
    ],
    'diff 结果不符合预期，请检查 key 映射、newIndexToOldIndexMap 和 LIS 逻辑'
  )

  console.log('diff 练习通过：你已经打通了 patchKeyedChildren 的核心路径。')
} catch (error) {
  console.error('diff 练习未通过，请先补完 exercises/diff/todo.js 里的 TODO。')
  throw error
}
