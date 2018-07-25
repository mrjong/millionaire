/**
 * 计时器
 * @class Timer
 */
export class Timer {
  /**
   * 定时器
   * @memberof Timer
   */
  timer = null
  /**
   * Creates an instance of Timer.
   * @param {any} interval 间隔时间
   * @param {any} offset 结束时间差
   * @param {any} completeCallback 每次完成时的回调
   * @param {any} endCallback 计时结束后的回调
   * @memberof Timer
   */
  constructor (interval = 1000, offset = 0, completeCallback, endCallback) {
    this.interval = interval
    this.offset = offset
    this.completeCallback = completeCallback
    this.endCallback = endCallback
  }

  /**
   * 开始
   * @memberof Timer
   */
  start () {
    const {interval} = this
    // 如果剩余时间小于间隔
    const offset = this.offset
    if (offset < interval) {
      setTimeout(() => {
        this.endCallback && this.endCallback()
      }, offset)
      return
    }
    this.timer = setInterval(() => {
      if (this.offset > 0) {
        const {offset} = this
        const date = new Date(offset)
        this.completeCallback && this.completeCallback({
          year: date.getUTCFullYear() - 1970,
          month: date.getUTCMonth(),
          date: date.getUTCDate() - 1,
          hours: date.getUTCHours(),
          minuates: date.getUTCMinutes(),
          seconds: Math.round(offset / 1000) % 60,
          offset
        })
        // 如果剩余时间小于间隔
        if (offset <= interval) {
          this.stop()
          setTimeout(() => {
            this.endCallback && this.endCallback()
          }, offset)
        } else {
          this.offset -= interval
        }
      } else {
        this.stop()
        this.endCallback && this.endCallback()
      }
    }, interval)
  }

  /**
   * 停止
   * @memberof Timer
   */
  stop () {
    clearInterval(this.timer)
  }

  /**
   * 同步结束时间
   * @param {any} endTime
   * @memberof Timer
   */
  sync (endTime) {
    this.endTime = Date.now() + endTime
  }

  /**
   * 添加每次完成时的监听器
   * @param {any} callback
   * @memberof Timer
   */
  addCompleteListener (callback) {
    this.completeCallback = callback
  }

  /**
   * 添加计时结束后的监听器
   * @param {any} callback
   * @memberof Timer
   */
  addEndListener (callback) {
    this.endCallback = callback
  }
}
