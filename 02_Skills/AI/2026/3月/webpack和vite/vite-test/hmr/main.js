import { renderSelfMessageCard } from './self-message.js'
import { mountDepSection } from './dep-owner.js'
import { mountInvalidateShell } from './invalidate-shell.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <section>
    <h2>1. 自接收</h2>
    <div id="self-card"></div>
  </section>
  <section>
    <h2>2. 依赖接收</h2>
    <div id="dep-card"></div>
  </section>
  <section>
    <h2>3. invalidate 继续向上冒泡</h2>
    <div id="invalidate-card"></div>
  </section>
`

renderSelfMessageCard()
mountDepSection()
mountInvalidateShell()
