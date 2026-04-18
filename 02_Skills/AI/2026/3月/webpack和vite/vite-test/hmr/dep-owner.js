import { depMessage } from './dep-source.js'

function renderDepCard(message) {
  const root = document.querySelector('#dep-card')
  root.innerHTML = `
    <p>${message}</p>
    <p>真正的 HMR 边界是 dep-owner.js，而不是 dep-source.js。</p>
  `
}

export function mountDepSection() {
  renderDepCard(depMessage)
}

mountDepSection()

if (import.meta.hot) {
  import.meta.hot.accept('./dep-source.js', (nextModule) => {
    renderDepCard(nextModule.depMessage)
  })
}
