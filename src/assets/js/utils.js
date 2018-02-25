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
   * 数组乱序
   * @param {any} myArr
   * @returns
   */
  mixArray (myArr) {
    let aArr = myArr
    const num = myArr.length
    for (var i = 0; i < num; i++) {
      var iRand = parseInt(num * Math.random())
      var temp = aArr[i]
      aArr[i] = aArr[iRand]
      aArr[iRand] = temp
    }
    return aArr
  }
}
