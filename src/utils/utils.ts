String.prototype.cutStr = function (pre = 100, trail = 0) {
  if (this.length <= pre + 3 + trail) return this
  let txt = this.substr(0, pre) + '...'
  if (trail) txt += this.substr(-trail)
  return txt
}
