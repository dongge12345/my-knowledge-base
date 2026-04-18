const { spawnSync } = require('node:child_process')
const path = require('node:path')

const targets = [
  'exercises/reactivity/run.js',
  'exercises/diff/run.js',
  'exercises/router/run.js'
]

for (const target of targets) {
  const file = path.join(__dirname, '..', target)
  const result = spawnSync(process.execPath, [file], {
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
