export const shouldInvalidate = false
export const boundaryMessage = `当前边界选择：${shouldInvalidate ? '继续向上冒泡' : '在当前边界本地处理'}，时间：${new Date().toLocaleTimeString()}`

export function renderBoundaryInto(selector) {
  const root = document.querySelector(selector)
  root.innerHTML = `
    <p>${boundaryMessage}</p>
    <p>把 shouldInvalidate 改成 true，就会强制这次更新继续向上冒泡。</p>
  `
}

if (import.meta.hot) {
  import.meta.hot.accept((nextModule) => {
    if (nextModule.shouldInvalidate) {
      import.meta.hot.invalidate('当前边界决定不处理这次更新')
      return
    }

    nextModule.renderBoundaryInto('#invalidate-card')
  })
}
