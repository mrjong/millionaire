/* global */
const njordGame = window.top.njordGame

const TercelAutoPlayJs = window.top.TercelAutoPlayJs

const sounds = {
  'countDown10-before': {
    url: 'http://static.subcdn.com/countDown10-before.mp3',
    instance: null,
    loop: false
  },
  'countDown10-after': {
    url: 'http://static.subcdn.com/countDown10-after.mp3',
    instance: null,
    loop: false
  },
  bg: {
    url: 'http://static.subcdn.com/20180313142418c250602c5b.mp3',
    instance: null,
    loop: true
  },
  countDown5: {
    url: 'http://static.subcdn.com/5s-countdown.mp3',
    instance: null,
    loop: false
  },
  go: {
    url: 'http://static.subcdn.com/20180313173916879991205a.mp3',
    instance: null,
    loop: false
  },
  failed: {
    url: 'http://static.subcdn.com/2018031317404850dad39593.mp3',
    instance: null,
    loop: false
  },
  succeed: {
    url: 'http://static.subcdn.com/201803131742354229751a36.mp3',
    instance: null,
    loop: false
  }
}

// 客户端公共参数
const clientParams = (njordGame && njordGame.getClientParams) ? JSON.parse(njordGame.getClientParams()) : null
const getQuery =
/**
* 获取浏览器公共参数
* @param {any} name
* @param {string} [url='']
* @returns
*/
function (name, url = '') {
  const queryUrlArr = url.match(/.*\?(\S+)$/)
  const queryUrl = queryUrlArr ? queryUrlArr[1] : window.location.search.slice(1)
  const regx = new RegExp(`(^|&)${name}=(\\S+?)(&|$)`)
  const search = queryUrl.match(regx)
  return (search && decodeURIComponent(search[2])) || null
}

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

  app_id: clientParams ? clientParams.appId : (getQuery('appId') || '100010000'),
  clientId: clientParams ? (clientParams.newClientId || clientParams.clientId) : '8a97020c66d888510110666fe2adf037',
  timezone: clientParams ? clientParams.localZone : -new Date().getTimezoneOffset(),
  isOnline: clientParams ? !!clientParams.isLogin : true,

  /**
   * 打点
   * @static
   * @memberof Utils
   */
  statistic (name = '', event = 0, params = {}, from = '') {
    let eventType
    switch (event) {
      case 0: // ALEX_SHOW
        eventType = '67240565'
        break
      case 1: // ALEX_CLICK
        eventType = '67262581'
        break
      case 2: // GAME_ANSWER
        eventType = ''
        break
      case 3: // ALEX_SHARE
        eventType = ''
        break
      case 4: // TAKE_CASH
        eventType = ''
        break
    }
    const args = {
      event_name: name,
      from: from,
      extra: {
        event: eventType,
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
  share () {
    const {origin, pathname} = window.location
    const {app_id: appId} = this
    if (njordGame) {
      window.location.href = 'tercel://moreshare?url=' + `${origin + pathname}?appId=${appId}`
    } else {
      window.location.href = 'http://m.facebook.com/sharer?u=' + `${origin + pathname}?appId=${appId}`
    }
  },
  /**
   * 时间格式化
   * @param {any} time 时间戳
   * @param {any} fixedDate
   * @param {any} countdown
   * @returns
   */
  TimeFormat (time, fixedDate, countdown) {
    let timeObj = {
      month: 0,
      day: 0,
      h: 0,
      m: 0,
      s: 0
    }
    if (fixedDate) {
      let nowDate = new Date(new Date().getTime() + time)
      timeObj.month = nowDate.getMonth() + 1
      timeObj.day = nowDate.getDay()
      timeObj.h = nowDate.getHours()
      timeObj.m = nowDate.getMinutes()
    }
    if (countdown) {
      const timeSecond = parseInt(time / 1000)
      timeObj.s = timeSecond % 60
      timeObj.m = parseInt(timeSecond / 60 % 60)
      timeObj.h = parseInt(timeSecond / 60 / 60 % 24)
    }
    return ''
  },
  computePercent (obj, val) {
    let total = 0
    for (let i in obj) {
      total += obj[i]
    }
    let percent = val / total
    if (percent < 10 && percent > 0) {
      percent = 10
    }
    return percent
  },
  /**
   * 加载音乐
   */
  loadSounds () {
    for (let prop in sounds) {
      const obj = sounds[prop]
      const url = obj.url
      if (url) {
        const sound = new Audio(url)
        sound.oncanplay = () => {
          console.log(`${prop}可以播放`)
        }
        sound.onerror = () => {
          console.log(`${prop}加载失败`)
        }
        sound.loop = obj.loop
        sound.preload = 'true'
        sound.load()
        obj.instance = sound
      }
    }
  },
  /**
   * 播放音乐
   * @param {any} name
   */
  playSound (name) {
    this.stopSound(name)
    if (name) {
      const url = sounds[name] && sounds[name].url
      if (url) {
        const sound = sounds[name].instance
        window.playAudioCallback = () => {
          sound.play()
        }
        if (TercelAutoPlayJs) {
          TercelAutoPlayJs.setAutoPlay && TercelAutoPlayJs.setAutoPlay('playAudio')
        } else {
          sound.play()
        }
      }
    }
  },
  /**
   * 停止音乐
   * @param {any} name
   */
  stopSound (name) {
    const sound = sounds[name].instance
    !sound.paused && sound.pause()
    sound.currentTime = 0
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
    const {interval} = this
    // 如果剩余时间小于间隔
    const offset = this.endTime - Date.now()
    if (offset < interval) {
      setTimeout(() => {
        this.endCallback && this.endCallback()
      }, offset)
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
        this.stop()
        endCallback && endCallback()
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
