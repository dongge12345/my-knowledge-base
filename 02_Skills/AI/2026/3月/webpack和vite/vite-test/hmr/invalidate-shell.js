import { renderBoundaryInto } from './invalidate-boundary.js'

function renderShellShell() {
  renderBoundaryInto('#invalidate-card')
}

export function mountInvalidateShell() {
  renderShellShell()
}

mountInvalidateShell()

if (import.meta.hot) {
  import.meta.hot.accept('./invalidate-boundary.js', (nextModule) => {
    nextModule.renderBoundaryInto('#invalidate-card')
  })
}
