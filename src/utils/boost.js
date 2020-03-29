/* eslint-disable no-extend-native */
Array.prototype.pushWithoutDuplicate = function () {
  // 获取参数列表
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // this指代的是数组
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}
