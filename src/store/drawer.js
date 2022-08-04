// 用于控制侧栏切换及动画
export default class Drawer {

  index = Number.MAX_SAFE_INTEGER

  openTo(index) {
    this.index = index
  }

  close() {
    this.index = Number.MAX_SAFE_INTEGER
  }

  isOpened() {
    return this.index < Number.MAX_SAFE_INTEGER
  }

  isClosed() {
    return this.index === Number.MAX_SAFE_INTEGER
  }

  isClosing(from, to) {
    return from < to && to === Number.MAX_SAFE_INTEGER
  }

  isOpening(from, to) {
    return from > to && from === Number.MAX_SAFE_INTEGER
  }
}