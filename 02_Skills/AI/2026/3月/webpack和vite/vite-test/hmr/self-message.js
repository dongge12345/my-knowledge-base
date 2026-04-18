const renderVersion = (import.meta.hot?.data.renderVersion || 0) + 1
const message = `自接收模块更新时间：${new Date().toLocaleTimeString()}`

export function renderSelfMessageCard() {
  const root = document.querySelector('#self-card')
  root.innerHTML = `
    <p>${message}</p>
    <p>通过 import.meta.hot.data 保留的渲染版本号：${renderVersion}</p>
  `
}
console.log('self-message entry')

renderSelfMessageCard()

if (import.meta.hot) {
  import.meta.hot.accept((nextModule) => {
    nextModule.renderSelfMessageCard()
  })

  import.meta.hot.dispose((data) => {
    data.renderVersion = renderVersion
  })
}
