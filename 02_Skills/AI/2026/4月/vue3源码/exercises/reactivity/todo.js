const targetMap = new WeakMap()
let activeEffect = null

function effect(fn) {
  // TODO 1:
  // 运行副作用前，把当前 fn 记录到 activeEffect
  // 执行完毕后，把 activeEffect 清空
  fn()
}

function track(target, key) {
  // TODO 2:
  // 1. 没有 activeEffect 时直接返回
  // 2. targetMap: WeakMap(target -> depsMap)
  // 3. depsMap: Map(key -> dep)
  // 4. dep: Set(effect)
}

function trigger(target, key) {
  // TODO 3:
  // 找到 targetMap 中 target 对应的 depsMap
  // 再取出 key 对应的 dep，重新执行其中的 effect
}

function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      const result = Reflect.get(obj, key, receiver)

      // TODO 4:
      // 在读取属性时收集依赖

      if (result !== null && typeof result === 'object') {
        return reactive(result)
      }

      return result
    },
    set(obj, key, value, receiver) {
      const oldValue = obj[key]
      const changed = oldValue !== value
      const result = Reflect.set(obj, key, value, receiver)

      // TODO 5:
      // 只有值真的变化时，才触发更新

      return result
    }
  })
}

module.exports = {
  effect,
  reactive,
  track,
  trigger
}
