function debounce(
  func: Function,
  wait: number = 200,
  immediate: boolean = false
): any {
  let timeout: any
  return function () {
    // @ts-ignore
    const context = this
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
    if (immediate && !timeout) func.apply(context, args)
  }
}

export default debounce
