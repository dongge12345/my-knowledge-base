const assert = require('node:assert/strict')
const { createMemoryHistory, createRouter } = require('./todo')

try {
  const history = createMemoryHistory()
  const transitions = []

  history.listen((to, from) => {
    transitions.push({ to, from })
  })

  const router = createRouter({
    history,
    routes: [
      { path: '/', name: 'home', component: 'HomePage' },
      { path: '/about', name: 'about', component: 'AboutPage' },
      { path: '/users/:id', name: 'user-detail', component: 'UserDetailPage' }
    ]
  })

  assert.equal(router.currentRoute.value.name, 'home', '初始路径 / 应该匹配到 home')

  router.push('/users/42')

  assert.equal(router.currentRoute.value.name, 'user-detail', '动态路由应该匹配到 user-detail')
  assert.deepEqual(router.currentRoute.value.params, { id: '42' }, 'params 应该正确解析出来')
  assert.deepEqual(
    transitions,
    [{ to: '/users/42', from: '/' }],
    'history.listen 应该能收到一次跳转通知'
  )

  assert.throws(
    () => router.push('/not-found'),
    /Cannot resolve route/,
    '未知路由应该抛错'
  )

  console.log('router 练习通过：你已经打通了 matcher、params 解析和 push 更新。')
} catch (error) {
  console.error('router 练习未通过，请先补完 exercises/router/todo.js 里的 TODO。')
  throw error
}
