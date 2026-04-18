import './side-effect.js'

export const usedValue = 'this export is used and should stay'
export const unusedValue = 'this export is unused and should be removed'

export function unusedFunction() {
  return 'unused function should be removed too'
}
