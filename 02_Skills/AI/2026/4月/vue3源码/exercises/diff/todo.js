function isSameVNodeType(n1, n2) {
  return n1.key === n2.key
}

function diffKeyedChildren(oldChildren, newChildren) {
  const operations = []

  let i = 0
  let e1 = oldChildren.length - 1
  let e2 = newChildren.length - 1

  while (i <= e1 && i <= e2 && isSameVNodeType(oldChildren[i], newChildren[i])) {
    i++
  }

  while (i <= e1 && i <= e2 && isSameVNodeType(oldChildren[e1], newChildren[e2])) {
    e1--
    e2--
  }

  if (i > e1) {
    for (let index = i; index <= e2; index++) {
      operations.push({
        type: 'insert',
        key: newChildren[index].key,
        to: index
      })
    }

    return operations
  }

  if (i > e2) {
    for (let index = i; index <= e1; index++) {
      operations.push({
        type: 'remove',
        key: oldChildren[index].key
      })
    }

    return operations
  }

  const s1 = i
  const s2 = i
  const toBePatched = e2 - s2 + 1
  const keyToNewIndexMap = new Map()

  // TODO 1:
  // 遍历 newChildren 的中间区间 [s2, e2]
  // 建立 key -> newIndex 的映射

  const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
  let moved = false
  let maxNewIndexSoFar = 0

  for (let oldIndex = s1; oldIndex <= e1; oldIndex++) {
    const oldVNode = oldChildren[oldIndex]
    const newIndex = keyToNewIndexMap.get(oldVNode.key)

    if (newIndex === undefined) {
      operations.push({
        type: 'remove',
        key: oldVNode.key
      })
      continue
    }

    // TODO 2:
    // newIndexToOldIndexMap[newIndex - s2] = oldIndex + 1
    // 这里加 1 是因为 0 代表“这是个新节点，还没在旧节点里找到”

    if (newIndex >= maxNewIndexSoFar) {
      maxNewIndexSoFar = newIndex
    } else {
      moved = true
    }
  }

  const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
  let sequenceIndex = increasingNewIndexSequence.length - 1

  for (let index = toBePatched - 1; index >= 0; index--) {
    const newIndex = s2 + index
    const newVNode = newChildren[newIndex]

    if (newIndexToOldIndexMap[index] === 0) {
      operations.push({
        type: 'insert',
        key: newVNode.key,
        to: newIndex
      })
      continue
    }

    if (moved) {
      // TODO 3:
      // 如果当前 index 不在 LIS 中，就说明这个节点需要移动
      // 否则说明它已经处于“相对递增”的稳定位置，可以不动
      const shouldStay =
        sequenceIndex >= 0 && increasingNewIndexSequence[sequenceIndex] === index

      if (shouldStay) {
        sequenceIndex--
      } else {
        operations.push({
          type: 'move',
          key: newVNode.key,
          to: newIndex
        })
      }
    }
  }

  return operations.reverse()
}

function getSequence(arr) {
  // TODO 4:
  // 实现最长递增子序列，忽略值为 0 的位置
  // 返回的是“索引数组”，不是值数组
  //
  // 示例：
  // [3, 2, 0] -> [1]
  // 因为值为 2 的那个位置可以作为稳定序列保留下来
  return []
}

module.exports = {
  diffKeyedChildren,
  getSequence
}
