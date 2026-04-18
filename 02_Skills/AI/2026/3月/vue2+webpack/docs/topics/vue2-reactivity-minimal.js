// Minimal runnable Vue2-style reactivity demo.
// Scope:
// 1. object property reactivity
// 2. array mutating methods reactivity
// 3. $set for object/array
// 4. watcher collection + notification
// Not included:
// 1. scheduler / nextTick
// 2. computed lazy watcher
// 3. full Vue Observer class shape

class Watcher {
  constructor(cb, getter) {
    this.cb = cb;
    this.getter = getter;
    this.value = this.get();
  }

  get() {

    Dep.target = this;
    const value = this.getter();
    Dep.target = null;
    console.log('watch get', value)
    return value;
  }

  update() {
    const oldValue = this.value;
    const newValue = this.get();
    this.value = newValue;

    if (this.cb) {
      this.cb(newValue, oldValue);
    }
  }
}

class Dep {
  constructor() {
    this.subs = new Set();
  }

  depend() {
    if (Dep.target) {
      this.subs.add(Dep.target);
    }
  }

  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

Dep.target = null;

const arrayProto = Array.prototype;
const reactiveArrayProto = Object.create(arrayProto);
const patchMethods = ["push", "unshift", "pop", "shift", "reverse", "sort", "splice"];

patchMethods.forEach(methodName => {
  const original = arrayProto[methodName];

  reactiveArrayProto[methodName] = function (...args) {
    const result = original.apply(this, args);
    let inserted = [];

    switch (methodName) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    inserted.forEach(item => observe(item));

    if (this.__ob__) {
      this.__ob__.dep.notify();
    }

    return result;
  };
});

function def(obj, key, value) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true
  });
}

function createReactiveArray(arr) {
  arr.__proto__ = reactiveArrayProto;
  return arr;
}

function dependArray(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i];
    if (item && item.__ob__) {
      item.__ob__.dep.depend();
    }
    if (Array.isArray(item)) {
      dependArray(item);
    }
  }
}

function observe(val) {
  if (!val || typeof val !== "object") {
    return null;
  }

  if (val.__ob__) {
    return val.__ob__;
  }

  const ob = { dep: new Dep() };
  def(val, "__ob__", ob);

  if (Array.isArray(val)) {
    createReactiveArray(val);
    val.forEach(item => observe(item));
    return ob;
  }

  Object.keys(val).forEach(key => {
    createReactive(val, key, val[key]);
  });

  return ob;
}

function createReactive(obj, key, val) {
  const dep = new Dep();
  let childOb = observe(val);

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend();

        // If the value is an observed object/array, also collect
        // the watcher on the "whole value" level. This is required
        // for array mutating methods and object/array structure updates.
        if (childOb) {
          childOb.dep.depend();
        }

        if (Array.isArray(val)) {
          dependArray(val);
        }
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }

      val = newVal;
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

function $set(obj, key, val) {
  if (Array.isArray(obj)) {
    obj.splice(key, 1, val);
    return val;
  }

  if (!obj || typeof obj !== "object") {
    return val;
  }

  if (key in obj) {
    obj[key] = val;
    return val;
  }

  createReactive(obj, key, val);

  if (obj.__ob__) {
    obj.__ob__.dep.notify();
  }

  return val;
}

function demo() {
  const state = {
    user: {
      name: "A",
    },
    list: [
      { count: 1 }
    ]
  };

  observe(state);

  const logs = [];

  new Watcher(
    (next, prev) => {
      logs.push(`render: ${prev} -> ${next}`);
    },
    () => JSON.stringify({
      name: state.user.name,
      age: state.user.age,
      listLength: state.list.length,
      firstCount: state.list[0] && state.list[0].count,
      secondCount: state.list[1] && state.list[1].count
    })
  );

  state.user.name = "B";
  $set(state.user, "age", 18);
  state.user.age = '200'
  // state.list.push({ count: 2 });
  // state.list[0].count = 10;
  // state.list[1].count = 20;

  console.log("demo logs:");
  logs.forEach(item => console.log(item));
  // console.log("final state:", JSON.stringify(state));
}

if (require.main === module) {
  demo();
}

module.exports = {
  Watcher,
  Dep,
  observe,
  createReactive,
  createReactiveArray,
  $set,
  demo
};
