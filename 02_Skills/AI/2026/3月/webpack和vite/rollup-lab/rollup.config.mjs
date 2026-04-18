import { defineConfig } from 'rollup'

export default defineConfig({
  input: {
    '01-static': 'src/entries/01-static.js',
    '02-dynamic': 'src/entries/02-dynamic.js',
    '03-page-a': 'src/entries/03-page-a.js',
    '04-page-b': 'src/entries/04-page-b.js',
    '05-tree-shaking': 'src/entries/05-tree-shaking.js'
  },
  treeshake: true,
  output: {
    dir: 'dist',
    format: 'esm',
    // sourcemap: true,
    entryFileNames: 'entries/[name]-[hash].js',
    chunkFileNames: 'chunks/[name]-[hash].js',
    manualChunks(id) {
      const normalizedId = id.replaceAll('\\', '/')
      if (normalizedId.includes('/src/vendor/')) {
        return 'vendor-simulated'
      }
      return undefined
    }
  }
})
