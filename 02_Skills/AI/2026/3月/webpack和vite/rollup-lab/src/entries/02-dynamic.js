console.log('02-dynamic entry start')

setTimeout(async () => {
  const module = await import('../dynamic/lazy-message.js')
  console.log(module.lazyMessage)
}, 0)
