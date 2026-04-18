import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as esbuild from 'esbuild'
import { parse as parseSFC } from '@vue/compiler-sfc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = __dirname
const app = express()

// 模块图：记录“我依赖谁”和“谁依赖我”，HMR 冒泡时要靠它往上找边界。
const moduleGraph = new Map()
// 编译缓存：记录某个模块上次编译后的 code、依赖和 mtime，避免重复转换。
const transformCache = new Map()
const hmrClients = new Set()
const watchedExtensions = new Set(['.js', '.ts', '.vue', '.css', '.html'])

app.use(express.json())

function normalizeUrlPath(urlPath) {
  const cleanPath = (urlPath || '/').split('?')[0]
  return cleanPath === '/' ? '/index.html' : cleanPath
}

function toFsPath(urlPath) {
  const normalized = normalizeUrlPath(urlPath)
  const relativePath = normalized.startsWith('/') ? normalized.slice(1) : normalized
  const resolvedPath = path.resolve(rootDir, relativePath)

  if (!resolvedPath.startsWith(rootDir)) {
    throw new Error(`Out of root: ${urlPath}`)
  }

  return resolvedPath
}

function toBrowserPath(fsPath) {
  const relativePath = path.relative(rootDir, fsPath).replace(/\\/g, '/')
  return `/${relativePath}`
}

function ensureModuleNode(id) {
  if (!moduleGraph.has(id)) {
    moduleGraph.set(id, {
      id,
      importers: new Set(),
      importedModules: new Set(),
      mtimeMs: 0,
      selfAccepting: false,
      acceptedDeps: new Set(),
      transformType: 'js'
    })
  }

  return moduleGraph.get(id)
}

function syncModuleGraph(id, transformResult) {
  const moduleNode = ensureModuleNode(id)

  // 重新编译后，要先把旧依赖关系拆掉，再写入新依赖关系。
  for (const importedId of moduleNode.importedModules) {
    const importedNode = moduleGraph.get(importedId)
    importedNode?.importers.delete(id)
  }

  moduleNode.importedModules.clear()

  for (const depId of transformResult.deps) {
    const depNode = ensureModuleNode(depId)
    moduleNode.importedModules.add(depId)
    depNode.importers.add(id)
  }

  moduleNode.mtimeMs = transformResult.mtimeMs
  moduleNode.selfAccepting = transformResult.selfAccepting
  moduleNode.acceptedDeps = new Set(transformResult.acceptedDeps)
  moduleNode.transformType = transformResult.type
}

function resolveImport(specifier, importerId) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    const importerDir = path.posix.dirname(importerId)
    const joined = specifier.startsWith('/')
      ? specifier
      : path.posix.join(importerDir, specifier)

    return path.posix.normalize(joined)
  }

  return `/@modules/${specifier}`
}

function extractImports(code, importerId) {
  const deps = new Set()
  const importPattern =
    /(?:import\s+[^'"]*?from\s*|import\s*\(|export\s+[^'"]*?from\s*)["']([^"'`]+)["']/g

  for (const match of code.matchAll(importPattern)) {
    deps.add(resolveImport(match[1], importerId))
  }

  return [...deps]
}

function extractAcceptedDeps(code, importerId) {
  const acceptedDeps = new Set()
  let selfAccepting = false
  const acceptPattern = /import\.meta\.hot\.accept\(([\s\S]*?)\)/g

  for (const match of code.matchAll(acceptPattern)) {
    const callArgs = match[1].trim()

    if (!callArgs || callArgs.startsWith('(') || callArgs.startsWith('async ') || callArgs.startsWith('function')) {
      selfAccepting = true
      continue
    }

    const firstChar = callArgs[0]
    if (firstChar === "'" || firstChar === '"') {
      const singleDep = callArgs.match(/^['"]([^'"]+)['"]/)
      if (singleDep) {
        acceptedDeps.add(resolveImport(singleDep[1], importerId))
      }
      continue
    }

    if (firstChar === '[') {
      const depPattern = /['"]([^'"]+)['"]/g
      for (const depMatch of callArgs.matchAll(depPattern)) {
        acceptedDeps.add(resolveImport(depMatch[1], importerId))
      }
      continue
    }

    selfAccepting = true
  }

  return {
    acceptedDeps: [...acceptedDeps],
    selfAccepting
  }
}

function injectHotContext(code, id) {
  if (!code.includes('import.meta.hot')) {
    return code
  }

  const rewrittenCode = code.replaceAll('import.meta.hot', '__HMR_CONTEXT__')
  return [
    "import { createHotContext as __createHotContext } from '/__hmr_client__.js'",
    `const __HMR_CONTEXT__ = __createHotContext(${JSON.stringify(id)})`,
    rewrittenCode
  ].join('\n')
}

function createCssModuleCode(source, id) {
  const escapedCss = JSON.stringify(source)
  return [
    `const css = ${escapedCss}`,
    `const styleId = ${JSON.stringify(`style:${id}`)}`,
    'let styleTag = document.querySelector(`[data-style-id="${styleId}"]`)',
    'if (!styleTag) {',
    '  styleTag = document.createElement("style")',
    '  styleTag.setAttribute("data-style-id", styleId)',
    '  document.head.appendChild(styleTag)',
    '}',
    'styleTag.textContent = css',
    'export default css'
  ].join('\n')
}

function readFileRecord(urlPath) {
  const fsPath = toFsPath(urlPath)
  const stats = fs.statSync(fsPath)
  const source = fs.readFileSync(fsPath, 'utf-8')

  return {
    fsPath,
    mtimeMs: stats.mtimeMs,
    source
  }
}

function transformVueToModule(source) {
  const { descriptor, errors } = parseSFC(source)
  if (errors.length > 0) {
    return `throw new Error(${JSON.stringify(errors.map((item) => String(item)).join('\n'))})`
  }

  const scriptBlock = descriptor.script || descriptor.scriptSetup
  const scriptContent = scriptBlock?.content?.trim()

  if (!scriptContent) {
    return 'export default {}'
  }

  return esbuild.transformSync(scriptContent, {
    loader: scriptBlock?.lang === 'ts' ? 'ts' : 'js',
    format: 'esm'
  }).code
}

function transformRequest(urlPath) {
  const normalizedId = normalizeUrlPath(urlPath)
  const cached = transformCache.get(normalizedId)
  const { mtimeMs, source } = readFileRecord(normalizedId)

  if (cached && cached.mtimeMs === mtimeMs) {
    return cached
  }

  const ext = path.extname(normalizedId)
  let code = source
  let type = 'js'

  if (ext === '.ts') {
    code = esbuild.transformSync(source, {
      loader: 'ts',
      format: 'esm',
      sourcemap: 'inline'
    }).code
  } else if (ext === '.vue') {
    code = transformVueToModule(source)
  } else if (ext === '.css') {
    code = createCssModuleCode(source, normalizedId)
    type = 'css'
  }

  const deps = extractImports(code, normalizedId)
  const hmrMeta = extractAcceptedDeps(code, normalizedId)
  code = injectHotContext(code, normalizedId)
  const result = {
    id: normalizedId,
    mtimeMs,
    code,
    deps,
    acceptedDeps: hmrMeta.acceptedDeps,
    selfAccepting: hmrMeta.selfAccepting,
    type
  }

  transformCache.set(normalizedId, result)
  syncModuleGraph(normalizedId, result)

  return result
}

function serializeModuleGraph() {
  return [...moduleGraph.values()].map((moduleNode) => ({
    id: moduleNode.id,
    importers: [...moduleNode.importers],
    importedModules: [...moduleNode.importedModules],
    selfAccepting: moduleNode.selfAccepting,
    acceptedDeps: [...moduleNode.acceptedDeps],
    mtimeMs: moduleNode.mtimeMs,
    transformType: moduleNode.transformType
  }))
}

function sendHmrPayload(payload) {
  const body = `data: ${JSON.stringify(payload)}\n\n`

  for (const client of hmrClients) {
    client.write(body)
  }
}

function dedupeUpdates(updates) {
  const seen = new Set()
  return updates.filter((update) => {
    const key = `${update.type}:${update.boundary}:${update.acceptedPath}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function collectHmrUpdates(changedId, invalidatedBoundaries = new Set()) {
  const queue = [changedId]
  const visited = new Set()
  const updates = []
  let needsFullReload = false

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (visited.has(currentId)) {
      continue
    }
    visited.add(currentId)

    const currentNode = moduleGraph.get(currentId)
    if (!currentNode) {
      needsFullReload = true
      continue
    }

    // 当前模块自接收时，这条传播路径就会停在这里。
    if (!invalidatedBoundaries.has(currentId) && currentNode.selfAccepting) {
      updates.push({
        type: 'self-update',
        boundary: currentId,
        acceptedPath: currentId
      })
      continue
    }

    if (currentNode.importers.size === 0) {
      needsFullReload = true
      continue
    }

    for (const importerId of currentNode.importers) {
      const importerNode = moduleGraph.get(importerId)
      if (!importerNode) {
        needsFullReload = true
        continue
      }

      // 父模块显式 accept 了当前依赖时，父模块就是这条路径上的 HMR 边界。
      if (!invalidatedBoundaries.has(importerId) && importerNode.acceptedDeps.has(currentId)) {
        updates.push({
          type: 'dep-update',
          boundary: importerId,
          acceptedPath: currentId
        })
        continue
      }

      queue.push(importerId)
    }
  }

  const uniqueUpdates = dedupeUpdates(updates)
  if (needsFullReload || uniqueUpdates.length === 0) {
    return {
      type: 'full-reload',
      path: changedId
    }
  }

  return {
    type: 'update',
    path: changedId,
    updates: uniqueUpdates
  }
}

function invalidateTransformCache(urlPath) {
  const normalizedId = normalizeUrlPath(urlPath)
  transformCache.delete(normalizedId)
}

function handleFileChange(urlPath) {
  const normalizedId = normalizeUrlPath(urlPath)
  invalidateTransformCache(normalizedId)
  const payload = collectHmrUpdates(normalizedId)
  sendHmrPayload(payload)
}

const hmrClientCode = `
const hotModules = new Map()
const hotDataMap = new Map()
const hmrChannel = new EventSource('/__hmr')

function normalizeAcceptedDeps(deps) {
  if (!deps) return []
  return Array.isArray(deps) ? deps : [deps]
}

function normalizeFromOwner(ownerPath, dep) {
  if (dep.startsWith('/')) return dep
  const baseUrl = new URL(ownerPath, window.location.origin)
  return new URL(dep, baseUrl).pathname
}

function loadFreshModule(path) {
  const url = \`\${path}?t=\${Date.now()}\`
  return import(url)
}

function runDispose(ownerPath) {
  const record = hotModules.get(ownerPath)
  if (!record) return
  for (const disposeHandler of record.disposeHandlers) {
    disposeHandler(record.data)
  }
}

async function applyUpdate(update) {
  if (update.type === 'self-update') {
    runDispose(update.boundary)
    const nextModule = await loadFreshModule(update.acceptedPath)
    const record = hotModules.get(update.boundary)
    if (!record) return
    for (const callback of record.selfAcceptCallbacks) {
      await callback(nextModule)
    }
    return
  }

  const record = hotModules.get(update.boundary)
  if (!record) return

  runDispose(update.boundary)
  const nextModule = await loadFreshModule(update.acceptedPath)
  const callback = record.depAcceptCallbacks.get(update.acceptedPath)
  if (callback) {
    await callback(nextModule)
  }
}

hmrChannel.addEventListener('message', async (event) => {
  const payload = JSON.parse(event.data)

  if (payload.type === 'full-reload') {
    console.warn('[mini-hmr] full reload from', payload.path)
    window.location.reload()
    return
  }

  for (const update of payload.updates) {
    await applyUpdate(update)
  }
})

export function createHotContext(ownerPath) {
  if (!hotDataMap.has(ownerPath)) {
    hotDataMap.set(ownerPath, {})
  }

  const data = hotDataMap.get(ownerPath)
  const existing = hotModules.get(ownerPath)
  const record = existing || {
    data,
    selfAcceptCallbacks: [],
    depAcceptCallbacks: new Map(),
    disposeHandlers: []
  }

  record.data = data
  record.selfAcceptCallbacks = []
  record.depAcceptCallbacks = new Map()
  record.disposeHandlers = []
  hotModules.set(ownerPath, record)

  return {
    data,
    accept(depsOrCallback, callback) {
      if (typeof depsOrCallback === 'function' || depsOrCallback == null) {
        record.selfAcceptCallbacks.push(depsOrCallback || (() => {}))
        return
      }

      for (const dep of normalizeAcceptedDeps(depsOrCallback)) {
        record.depAcceptCallbacks.set(normalizeFromOwner(ownerPath, dep), callback || (() => {}))
      }
    },
    dispose(callbackFn) {
      record.disposeHandlers.push(callbackFn)
    },
    async invalidate(message) {
      console.warn('[mini-hmr] invalidate from', ownerPath, message || '')
      const response = await fetch('/__invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: ownerPath })
      })
      const payload = await response.json()

      if (payload.type === 'full-reload') {
        window.location.reload()
      }
    }
  }
}
`

app.get('/__hmr_client__.js', (_req, res) => {
  res.type('js')
  res.send(hmrClientCode)
})

app.get('/__hmr', (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  res.write('data: {"type":"connected"}\n\n')
  hmrClients.add(res)

  _req.on('close', () => {
    hmrClients.delete(res)
  })
})

app.post('/__invalidate', (req, res) => {
  const invalidatedPath = normalizeUrlPath(req.body?.path || '/index.html')
  const payload = collectHmrUpdates(invalidatedPath, new Set([invalidatedPath]))
  sendHmrPayload(payload)
  res.json(payload)
})

app.get('/__debug/module-graph', (_req, res) => {
  res.json({
    graph: serializeModuleGraph(),
    cache: [...transformCache.values()].map((item) => ({
      id: item.id,
      mtimeMs: item.mtimeMs,
      deps: item.deps
    }))
  })
})

app.get(/.*\.html$/, (req, res) => {
  const fileRecord = readFileRecord(req.path)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(fileRecord.source)
})

app.get('/', (_req, res) => {
  const fileRecord = readFileRecord('/index.html')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(fileRecord.source)
})

app.get(/.*\.(js|ts|vue|css)$/, (req, res) => {
  try {
    const result = transformRequest(req.path)
    res.type('js')
    res.send(result.code)
  } catch (error) {
    res.status(500).type('js').send(`throw new Error(${JSON.stringify(String(error))})`)
  }
})

const watcher = fs.watch(rootDir, { recursive: true }, (_eventType, filename) => {
  if (!filename) {
    return
  }

  const normalizedName = filename.replace(/\\/g, '/')
  if (normalizedName.includes('node_modules')) {
    return
  }

  if (!watchedExtensions.has(path.extname(normalizedName))) {
    return
  }

  const urlPath = toBrowserPath(path.join(rootDir, normalizedName))
  handleFileChange(urlPath)
})

app.listen(3000, () => {
  console.log('mini vite 开发服务器已启动：http://localhost:3000')
  console.log('模块图调试地址：http://localhost:3000/__debug/module-graph')
})

process.on('SIGINT', () => {
  watcher.close()
  process.exit(0)
})
