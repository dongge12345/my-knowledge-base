function createRouteRecordMatcher(route) {
  const keys = []
  const pattern = route.path.replace(/:([^/]+)/g, (_, key) => {
    keys.push(key)
    return '([^/]+)'
  })

  const regex = new RegExp(`^${pattern}$`)

  return {
    ...route,
    keys,
    regex
  }
}

function createRouterMatcher(routes) {
  const matchers = []

  function addRoute(route) {
    matchers.push(createRouteRecordMatcher(route))
  }

  routes.forEach(addRoute)

  function resolve(path) {
    for (const matcher of matchers) {
      const match = path.match(matcher.regex)

      if (!match) {
        continue
      }

      const params = {}

      // TODO 1:
      // 把 matcher.keys 和正则匹配到的值组装成 params
      // 例如 /users/42 匹配 /users/:id 后，得到 { id: '42' }

      return {
        path,
        name: matcher.name,
        params,
        component: matcher.component
      }
    }

    return null
  }

  return {
    addRoute,
    resolve
  }
}

function createMemoryHistory() {
  let current = '/'
  const listeners = new Set()

  return {
    get location() {
      return current
    },
    listen(listener) {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    push(path) {
      const from = current
      current = path

      for (const listener of listeners) {
        listener(path, from)
      }
    }
  }
}

function createRouter(options) {
  const matcher = createRouterMatcher(options.routes)
  const history = options.history

  const currentRoute = {
    value: matcher.resolve(history.location)
  }

  history.listen((toPath) => {
    currentRoute.value = matcher.resolve(toPath)
  })

  function push(path) {
    // TODO 2:
    // 1. 先确认 path 能被 matcher.resolve(path) 匹配到
    // 2. 匹配不到就抛错
    // 3. 匹配到了就调用 history.push(path)
  }

  return {
    currentRoute,
    push,
    resolve: matcher.resolve
  }
}

module.exports = {
  createMemoryHistory,
  createRouter,
  createRouterMatcher
}
