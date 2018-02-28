const njordGame = window.top.njordGame

// 客户端公共参数
const clientParams = (njordGame && njordGame.getClientParams) ? JSON.parse(njordGame.getClientParams()) : null

export default {
  /**
   * 登录
   * @param {any} callback
   */
  login (callback) {
    if (njordGame) {
      window.top.loginCallback = callback
      const loginArgs = JSON.stringify({
        callbackMethod: 'loginSuccess()'
      })
      njordGame.login && njordGame.login(loginArgs)
    }
  },

  app_id: clientParams ? clientParams.appId : '100210001',
  clientId: clientParams ? (clientParams.newClientId || clientParams.clientId) : '8a97020c66d888510110666fe2adf037',
  timezone: clientParams ? clientParams.localZone : -new Date().getTimezoneOffset(),
  isOnline: clientParams ? !!clientParams.isLoginin : false,

  /**
   * 打点
   * @static
   * @memberof Utils
   */
  statistic (params = {}) {
    const args = {
      event_name: 'Millionaire',
      from: 'Millionaire',
      extra: {
        event: '67244405',
        ...params
      }
    }
    njordGame && njordGame.logStatistic && njordGame.logStatistic(JSON.stringify(args))
  },
  /**
   * 计时器
   */
  Timer (interval, endTime, completeCallback, endCallback) {
    return new Timer(interval, endTime, completeCallback, endCallback)
  },
  TimeFormat (timeStap) {
    const timeSecond = parseInt(timeStap / 1000)
    let s = parseInt(timeSecond % 60)
    let m = parseInt(timeSecond / 60 % 60)
    let h = parseInt(timeSecond / 60 / 60 % 24)
    if (h <= 9) {
      h = '0' + h
    }
    if (m <= 9) {
      m = '0' + m
    }
    if (s <= 9) {
      s = '0' + s
    }
    return h + ':' + m + ':' + s
  }
}

/**
 * 计时器
 * @class Timer
 */
class Timer {
  /**
   * 定时器
   * @memberof Timer
   */
  timer = null
  /**
   * Creates an instance of Timer.
   * @param {any} interval 间隔时间
   * @param {any} endTime 结束时间
   * @param {any} completeCallback 每次完成时的回调
   * @param {any} endCallback 计时结束后的回调
   * @memberof Timer
   */
  constructor (interval = 1000, endTime = 0, completeCallback, endCallback) {
    this.interval = interval
    this.endTime = endTime
    this.completeCallback = completeCallback
    this.endCallback = endCallback
  }

  /**
   * 开始
   * @memberof Timer
   */
  start () {
    const {interval, endTime} = this
    // 如果剩余时间小于间隔
    if (endTime < interval) {
      setTimeout(() => {
        this.endCallback && this.endCallback()
      }, endTime)
      return
    }
    this.timer = setInterval(() => {
      const {endTime, completeCallback, endCallback} = this
      const offset = endTime - Date.now()
      if (endTime <= 0 || offset > 0) {
        const date = new Date(offset >= 0 ? offset : 0)
        completeCallback && completeCallback({
          year: date.getUTCFullYear() - 1970,
          month: date.getUTCMonth(),
          date: date.getUTCDate() - 1,
          hours: date.getUTCHours(),
          minuates: date.getUTCMinutes(),
          seconds: Math.round(offset / 1000) % 60,
          offset
        })
        // 如果剩余时间小于间隔
        if (offset < interval) {
          this.stop()
          setTimeout(() => {
            endCallback && endCallback()
          }, offset)
        }
      } else {
        endCallback && endCallback()
        this.stop()
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
    this.endTime = endTime
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
