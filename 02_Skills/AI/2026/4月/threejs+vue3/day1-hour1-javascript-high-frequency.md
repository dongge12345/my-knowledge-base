# Day 1 - 第 1 小时：JavaScript 高频题

更新时间：2026-04-06

## 学习目标

这一小时只解决一个问题：

面对前端面试中最常见的 JavaScript 基础题，能不能用自己的话在 `30-60 秒` 内讲清楚。

这小时重点掌握 5 个高频点：

- 闭包
- 原型链
- `this` 绑定
- 事件循环
- Promise 与 `async/await`

---

## 1. 闭包

### 一句话理解

闭包就是“函数和它所处词法作用域的组合”，即使外层函数执行完了，内部函数仍然可以访问外层变量。

### 面试回答模板

可以这样答：

闭包本质上是内部函数持有了外部作用域的引用，因此外层函数执行结束后，相关变量也不会立即被释放。它常用于封装私有变量、函数柯里化、回调场景和缓存场景。但如果使用不当，也可能导致内存占用增加。

### 代码示例

```js
function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

### 面试延伸

- 为什么 `count` 没有被销毁
- 闭包常见使用场景有哪些
- 闭包会不会造成内存泄漏

### 你要记住的点

- 闭包不是“记忆函数”，而是“保留作用域访问能力”
- 常用于封装和延迟执行
- 风险不是闭包本身，而是“不再需要时仍被引用”

---

## 2. 原型链

### 一句话理解

JavaScript 通过原型机制实现对象之间的属性继承与共享查找。

### 面试回答模板

可以这样答：

每个对象内部都有一个指向其原型对象的隐式链接。访问对象属性时，如果对象自身没有，就会沿着原型链向上查找，直到 `Object.prototype`。原型链是 JavaScript 继承机制的基础，也能减少方法的重复创建。

### 代码示例

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function () {
  return `Hi, I am ${this.name}`;
};

const p = new Person("Tom");
console.log(p.sayHi());
```

### 面试延伸

- `__proto__`、`prototype`、`constructor` 的区别
- `new` 关键字做了什么
- 为什么方法更适合挂在原型上

### 你要记住的点

- `prototype` 是函数的属性
- 原型对象用于共享方法
- 实例通过原型链找到共享方法

---

## 3. this 绑定

### 一句话理解

`this` 不是定义时决定的，大多数情况下是调用时决定的。

### 面试回答模板

可以这样答：

`this` 的指向和函数调用方式有关。默认绑定下，普通函数在非严格模式中指向全局对象；隐式绑定下指向调用它的对象；显式绑定可通过 `call`、`apply`、`bind` 指定；构造调用时指向新创建的实例；箭头函数没有自己的 `this`，会继承外层作用域的 `this`。

### 代码示例

```js
const obj = {
  name: "Alice",
  say() {
    console.log(this.name);
  },
};

obj.say(); // Alice

const fn = obj.say;
fn(); // 普通调用，this 丢失
```

### 面试延伸

- 箭头函数为什么不能当构造函数
- `bind` 和 `call/apply` 区别
- 事件回调里 `this` 指向谁

### 你要记住的点

- 先看“怎么调用”，再看 `this` 指向
- 箭头函数 `this` 来自外层，不会被重新绑定

---

## 4. 事件循环

### 一句话理解

JavaScript 是单线程的，事件循环负责协调同步任务、微任务和宏任务的执行顺序。

### 面试回答模板

可以这样答：

JavaScript 主线程会先执行同步代码。当前执行栈清空后，会优先处理微任务队列，比如 `Promise.then`、`MutationObserver`，然后再处理一个宏任务，比如 `setTimeout`、`setInterval`、I/O。浏览器会在合适时机进行页面渲染，因此理解事件循环对分析异步执行顺序和页面卡顿很重要。

### 代码示例

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);
```

输出顺序：

```js
1
4
3
2
```

### 面试延伸

- 宏任务和微任务有哪些
- 为什么 `Promise.then` 比 `setTimeout` 先执行
- 事件循环和页面渲染的关系

### 你要记住的点

- 同步代码先执行
- 微任务优先于宏任务
- 长时间同步任务会阻塞渲染和交互

---

## 5. Promise 与 async/await

### 一句话理解

Promise 是异步编程的一种统一方案，`async/await` 是基于 Promise 的更易读写法。

### 面试回答模板

可以这样答：

Promise 用来表示一个异步操作的最终结果，状态包括 `pending`、`fulfilled`、`rejected`。它解决了传统回调嵌套不易维护的问题。`async/await` 本质上是 Promise 的语法糖，它让异步代码写起来更像同步代码，更利于流程控制和错误处理。

### 代码示例

```js
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("ok"), 1000);
  });
}

async function main() {
  const result = await fetchData();
  console.log(result);
}

main();
```

### 面试延伸

- Promise 链式调用如何传值
- `await` 是否会阻塞主线程
- 如何用 `try/catch` 处理异步错误
- `Promise.all` 和 `Promise.allSettled` 区别

### 你要记住的点

- `async` 函数一定返回 Promise
- `await` 等的是 Promise 结果，不是阻塞整个线程
- 并发场景下优先考虑 `Promise.all`

---

## 6. 这一小时高频题清单

你至少要能回答下面这些：

1. 什么是闭包，有什么应用场景
2. 闭包为什么能访问外部变量
3. 什么是原型链
4. `prototype` 和 `__proto__` 有什么区别
5. `new` 一个对象时发生了什么
6. `this` 的指向是怎么确定的
7. 箭头函数和普通函数的 `this` 有什么区别
8. 说一下事件循环
9. 微任务和宏任务有什么区别
10. Promise 是为了解决什么问题
11. `async/await` 和 Promise 的关系是什么
12. `Promise.all` 和 `Promise.race` 有什么区别

---

## 7. 快速自测

### 自测 1

下面代码输出什么，为什么：

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```

标准理解：

- 输出 `3 3 3`
- 因为 `var` 没有块级作用域，3 个回调共享同一个 `i`

如果改成 `let`：

- 输出 `0 1 2`
- 因为 `let` 会为每次循环创建独立块级作用域

### 自测 2

下面代码输出什么：

```js
const obj = {
  name: "test",
  say: () => {
    console.log(this.name);
  },
};

obj.say();
```

标准理解：

- 箭头函数没有自己的 `this`
- 它拿的是外层作用域的 `this`
- 一般不会输出 `obj.name`

---

## 8. 这一小时结束后的输出要求

你现在应该自己写出：

- 5 个知识点的口语化答案
- 6 到 8 道题的简短回答
- 2 段你自己的代码示例

## 9. 下一小时预告

下一小时建议学习：

- 浏览器渲染流程
- 回流与重绘
- 缓存机制
- `HTTP/HTTPS`
- 跨域
- 前端性能优化
