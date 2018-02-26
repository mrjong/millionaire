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

  app_id: clientParams ? clientParams.appId : '',
  clientId: clientParams ? (clientParams.newClientId || clientParams.clientId) : '',
  timezone: clientParams ? clientParams.localZone : -new Date().getTimezoneOffset(),
  isOnline: clientParams ? clientParams.isOnline : false,

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
    const interval = this.interval
    this.timer = setInterval(() => {
      const {endTime, completeCallback, endCallback} = this
      const offset = endTime - Date.now()
      if (endTime <= 0 || offset > 0) {
        const date = new Date(offset >= 0 ? offset : 0)
        completeCallback && completeCallback({
          year: date.getUTCFullYear() - 1970,
          month: date.getUTCMonth() + 1,
          date: date.getUTCDate(),
          hours: date.getUTCHours(),
          minuates: date.getUTCMinutes(),
          seconds: Math.round(offset / 1000) % 60
        })
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
