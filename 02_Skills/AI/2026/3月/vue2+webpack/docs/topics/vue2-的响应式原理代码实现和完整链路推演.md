# Vue2 的响应式原理代码实现和完整链路推演（属性、数组、对象）

## 核心结论

这版实现已经到了“能串起完整响应式链路”的阶段。现在最重要的不是继续补代码，而是把对象响应式和数组响应式这两条链路彻底理顺。

先回答这个关键点：

```js
if (val && val.__ob__) {
  val.__ob__.dep.depend()
}
```

它的作用不是“再做一层对象属性响应式”，而是：

**让当前 watcher 订阅这个“对象/数组本身”的变化。**

原因是：
- `dep.depend()` 订阅的是当前属性 `key` 本身
- `val.__ob__.dep.depend()` 订阅的是这个属性值所指向的“整个对象/整个数组”

这在数组里尤其关键。因为数组的 `push/splice` 不是走某个属性的 `set`，而是走改写后的数组方法，所以通知时发的是：

```js
this.__ob__.dep.notify()
```

如果 getter 里不提前订阅 `val.__ob__.dep`，那数组 `push()` 时就没人能收到通知。

所以可以这样理解：
- `dep`：属性级依赖
- `__ob__.dep`：对象/数组整体级依赖

## 对象响应式完整流程

这里先说最典型的一条：模板里用了 `user.name`，之后执行 `user.name = 'B'`。

### 1. 组件初始化
- `data()` 返回对象
- `observe(data)` 开始递归观测
- `user` 是对象，给它挂 `user.__ob__.dep`
- 遍历 `user` 的每个 key，执行 `createReactive(user, 'name', 'A')`

### 2. 创建渲染 watcher
- 渲染 watcher 执行 `getter`
- 读取 `vm.user.name`

### 3. 读取 `vm.user` 时发生什么
- 命中外层属性 `user` 的 getter
- `user` 这个属性自己的 `dep.depend()` 执行
- 因为 `user` 的值是对象，且有 `user.__ob__`
- 所以还会执行 `user.__ob__.dep.depend()`

这一步的意义是：
- watcher 订阅了 `user` 这个属性
- 也订阅了 `user` 这个对象整体

### 4. 继续读取 `user.name`
- 命中 `name` 的 getter
- `name` 自己的 `dep.depend()` 执行
- `name` 是基本类型，没有 `__ob__`，这里结束

### 5. 后续修改

```js
user.name = 'B'
```

- 进入 `name` 的 setter
- 新值不是旧值，更新闭包里的 `val`
- 调用 `dep.notify()`

### 6. 派发更新
- 所有订阅 `name` 的 watcher 执行 `update()`
- `update()` 里重新 `get()`
- 重新跑渲染，页面更新

这是“对象已有属性修改”的标准链路。

## 对象新增属性完整流程

比如：

```js
$set(user, 'age', 18)
```

为什么不能直接：

```js
user.age = 18
```

因为 Vue2 基于 `Object.defineProperty`，只能劫持“初始化时已有的属性”。新加的 `age` 没有 getter/setter，所以必须走 `$set`。

完整流程：

### 1. 调用 `$set(user, 'age', 18)`
### 2. `observe(18)`，基本类型直接返回
### 3. 发现 `age` 不在原对象上
### 4. 调用 `createReactive(user, 'age', 18)`，给新属性补上 getter/setter
### 5. 手动执行：

```js
user.__ob__.dep.notify()
```

这里为什么要通知 `user.__ob__.dep`，而不是 `age` 自己的 `dep`？

因为：
- `age` 是刚创建的
- 之前没有 watcher 订阅过 `age.dep`
- 但渲染 watcher 很可能订阅过 `user.__ob__.dep`

所以新增属性后，靠对象整体级依赖通知，让渲染 watcher 重新跑一次，下一轮渲染时就会读取到 `age`，从而建立后续依赖。

这是 Vue2 `$set` 的核心逻辑。

## 数组响应式完整流程

这里说最关键的一条：模板里用了 `list`，之后执行 `list.push({ a: 1 })`

### 1. 组件初始化
- `data()` 返回数组 `list`
- `observe(list)` 执行
- 给 `list` 挂上：

```js
list.__ob__ = { dep: new Dep() }
```

- 调用 `createReactiveArray(list)`，把原型改成增强版原型
- 递归 `observe(list` 里的已有元素)

### 2. 创建渲染 watcher
- 渲染时读取 `vm.list`

### 3. 读取 `list` 的 getter
- `list` 这个属性自己的 `dep.depend()` 执行
- 因为 `list` 的值是数组，并且有 `list.__ob__`
- 所以执行：

```js
list.__ob__.dep.depend()
```

这一步非常关键。它表示：

**当前 watcher 订阅了“整个数组”的变化。**

因为以后数组的变化不是走属性 setter，而是走数组改写方法。

### 4. 执行：

```js
list.push({ a: 1 })
```

### 5. 命中改写过的 `push`
- 先执行原生 `push`
- 收集新增元素 `args`
- 对新增元素 `observe(item)`
- 最后执行：

```js
this.__ob__.dep.notify()
```

### 6. 派发更新
- 所有订阅过 `list.__ob__.dep` 的 watcher 执行 `update()`
- 渲染 watcher 重新执行 `getter`
- 模板重新渲染，页面显示新元素

这就是数组为什么必须订阅 `__ob__.dep` 的根本原因。

## 数组 `splice` 的完整流程

比如：

```js
list.splice(1, 1, { b: 2 }, { c: 3 })
```

流程和 `push` 一样，只是新增元素来源不同：

### 1. 命中增强版 `splice`
### 2. 先执行原生 `splice`
### 3. 取新增项：

```js
args.slice(2)
```

### 4. 对新增项逐个 `observe`
### 5. 调用：

```js
this.__ob__.dep.notify()
```

### 6. watcher 重新渲染

## 当前实现里最核心的统一认知

可以把整个系统拆成 3 类依赖：

### 1. 属性级依赖
- 由 `createReactive` 里的 `dep` 管
- 适用于 `obj.key = newVal`

### 2. 对象整体级依赖
- 由 `obj.__ob__.dep` 管
- 适用于 `$set(obj, newKey, val)` 这类“结构变化”

### 3. 数组整体级依赖
- 由 `arr.__ob__.dep` 管
- 适用于 `push/splice/pop/...`

所以可以记一句：

**对象已有属性修改，靠属性自己的 dep；对象/数组结构变化，靠 `__ob__.dep`。**

## 标准流转图

对象已有属性：

```text
初始化 observe
-> defineProperty
-> 渲染 watcher 读取属性
-> 属性 getter 收集 dep
-> 属性 setter 触发 dep.notify()
-> watcher.update()
-> 重新渲染
```

数组变异方法：

```text
初始化 observe
-> 挂 __ob__.dep
-> 替换数组原型
-> 渲染 watcher 读取数组属性
-> getter 中收集 属性dep + 数组__ob__.dep
-> 调用 push/splice
-> observe 新元素
-> __ob__.dep.notify()
-> watcher.update()
-> 重新渲染
```

## 认知校准

下面这句话需要修正：

> 每次新增了响应式，无论是对象属性、数组元素、或者整个数组整个对象，都是需要执行一次消息派发来进行依赖收集

更准确的说法是：

**不是“为了依赖收集而派发”，而是先在读取时依赖收集，后在变更时消息派发。**

也就是：
- 读的时候：`depend()`
- 改的时候：`notify()`

新增属性时之所以要手动 `notify()`，不是为了“收集依赖”，而是为了让旧 watcher 重新执行一遍；在这次重新执行过程中，才会对新属性完成依赖收集。

这个顺序不能反。

## 补充理解

### 1. `watcher.get()` 不是 `Object.defineProperty` 里的 `get`

这两个 `get` 不是同一类东西：
- `watcher.get()` 是 `Watcher` 类上的普通方法
- `Object.defineProperty` 里的 `get` 是属性访问器

两者的职责不同：
- `watcher.get()`：负责开启一次依赖收集流程，并执行传入的 `getter`
- 属性访问器 `get`：在读取响应式属性时触发，把当前 `Dep.target` 收集进对应的 `dep`

可以把完整链路记成：

```text
watcher.get()
-> 执行用户传入的 getter
-> getter 内部读取响应式属性
-> 触发 defineProperty 的 get
-> dep.depend()
```

所以：
- `console.log(watcher)` 不会触发 `watcher.get()`
- `console.log(watcher.value)` 也只是读取上一次缓存结果，不会自动重新求值
- 真正会重新求值的是：
  - 手动调用 `watcher.get()`
  - 或者数据更新后走 `dep.notify() -> watcher.update() -> watcher.get()`

## 你的当前手写实现

```js
// watcher 渲染回调、getter、update、
class Watcher {
  constructor(ob,getter) {
    this.ob = ob;
    this.getter = getter //这里不确定
    this.value = this.get()
  }
  get() { // 获取时会触发依赖收集的
    Dep.target = this;
    const val = this.getter();
    Dep.target = null;
    return val //这里不确定
  }

  update() {
    // 问题6：需要获取新旧值进行渲染
    const oriVal = this.value;
    this.value = this.get();
    if(this.ob) {
      this.ob(this.value, oriVal)
    }
  }
}

// dep
class Dep{
  // 问题7:这里用set存更好，可以避免重复问题
  constructor(){
    this.subs = new Set();
  }

  depend() {
    if(Dep.target) {
      this.subs.add(Dep.target)
    }
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}


// vue2响应式数组的改造 - 这里是否其实是对data定义的数组数据进行了封装

// 重新实现
// 1：通过Array.prototype获取数组原型方法
const arrayProto = Array.prototype;
// 2.通过arrayProto创建vue响应式数组 - Object.create的使用我其实并不了解
const reactiveArrayProto = Object.create(arrayProto);
// 3.确定需要改造的方法
const patchMethodsName = [
  'push',
  'unshift',
  'pop',
  'shift',
  'reverse',
  'sort',
  'splice'
]
// 4.遍历需要改造的方法名，进行逐个改造，替换新实例出来的vue数组原型对象
patchMethodsName.forEach((methodName) => {
  reactiveArrayProto[methodName] = function(...args) {
    const reactiveList = [];
    // 5.执行原数组的逻辑，且返回值用它
    const res = arrayProto[methodName].apply(this,args)
    // 6.对元素执行响应式
    switch(methodName) {
      case 'push':
      case 'unshift':
        reactiveList.push(...args)
        break
      case 'splice':
        reactiveList.push(...args.slice(2))
        break
    }
    // 7.对元素执行响应式处理之观察
    reactiveList.forEach(item => {
      observe(item)
    })
    // 8.派发一次更新，对元素执行响应式处理之依赖收集
    if(this.__ob__) {
      this.__ob__.dep.notify()
    }
    // 9.返回原数组的返回
    return res
  }
})

function createReactiveArray(arr) {
  arr.__proto__ = reactiveArrayProto
  return arr
}

// Vue.$set
function $set(obj, k, val) {
  observe(val)
  if(Array.isArray(obj)) {
    obj.splice(k, 1, val)
  }else if(obj instanceof Object) {
    if(k in obj) {
      obj[k] = val
      return
    }
    createReactive(obj, k, val)
    obj.__ob__ && obj.__ob__.dep.notify();
  }
}

// observe
function observe(val) {
  if(!val || typeof val !== 'object') {
    return
  }
  if(val.__ob__) {
    return
  }
  val.__ob__ = {
    dep: new Dep()
  }
  if(Array.isArray(val)) {
    createReactiveArray(val)
    val.forEach(i=>observe(i))
    return
  }
  if(val instanceof Object){
    Object.keys(val).forEach(k=>{
      createReactive(val, k, val[k])
    })
    return
  }
}

// 响应式核心
function createReactive(obj, key, val) {
  const dep = new Dep();

  observe(val);

  Object.defineProperty(obj, key, {
    get() {
      if(Dep.target) {
        dep.depend();
        if (val && val.__ob__) {
          val.__ob__.dep.depend()
        }
      }
      return val
    },
    set(newVal) {
      if(newVal === val) { return }
      val = newVal;
      observe(val)
      dep.notify()
    }
  })
}
```

## 最小可运行版

项目里额外放了一份可以直接用 `node` 运行的最小实现：
- [vue2-reactivity-minimal.js](D:/data/paipaiHighLevel/02_Skills/AI/2026/3月/vue2+webpack/docs/topics/vue2-reactivity-minimal.js)

这个版本补齐了几件你当前手写版还缺的闭环：
- `observe` 返回 `childOb`，便于 getter 收集对象/数组整体依赖
- 给 `__ob__` 做了不可枚举定义，避免污染普通遍历
- 数组变异方法会同时 `observe` 新元素并 `notify`
- getter 里补了 `childOb.dep.depend()` 和数组递归依赖收集
- `$set` 对对象新增属性后会主动派发一次对象级更新
