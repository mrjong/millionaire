/* global IS_LOGIN */
// IS_LOGIN webpack define
import md5 from 'md5'
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
    url: 'http://static.subcdn.com/20180314200629b0edee0942.ogg',
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

console.log(clientParams)
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
  isOnline: clientParams ? !!clientParams.isLogin : IS_LOGIN,

  /**
   * 打点
   * @static
   * @memberof Utils
   */
  statistic (name = '', event = 0, params = {}, from = '') {
    let eventType
    switch (+event) {
      case 0: // ALEX_SHOW
        eventType = '67240565'
        break
      case 1: // ALEX_CLICK
        eventType = '67262581'
        break
      case 2: // GAME_ANSWER
        eventType = '67279733'
        break
      case 3: // ALEX_SHARE
        eventType = '67241845'
        break
      case 4: // TAKE_CASH 使用公共事件XALEX_OPERATION
        eventType = '67244405'
        break
      case 5: // GAME_OVER
        eventType = '67278965'
        break
      case 6: // ALEX_DEBUG
        eventType = '67247477'
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
  share (callback) {
    window.shareSuccessCallback = callback
    window.njordInvite && window.njordInvite.share && window.njordInvite.share(JSON.stringify({
      sharePackage: '',
      shareTitle: 'Quiz in "GO! Millionaire" of APUS Browser.',
      shareContent: 'Win real cash up to Rs. 1,000,000!',
      shareLink: 'https://goo.gl/t6jWBU',
      callbackMethod: 'shareSuccess'
    }))
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
        const sound = document.createElement('audio')
        sound.src = url
        sound.loop = obj.loop
        sound.preload = 'true'
        sound.oncanplay = function () {
          console.log(`${prop} 可以播放`)
          sound.oncanplay = null
        }
        sound.onerror = function () {
          console.log(`${prop} 加载失败`)
        }
        obj.instance = sound
        document.body.appendChild(sound)
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
  },
  /**
   * 设置静音
   */
  setMute (muted = false) {
    for (let prop in sounds) {
      const instance = sounds[prop].instance
      if (instance) {
        instance.muted = muted
      }
    }
  },
  /**
   * 生成md5Map
   * @param {any} arr
   * @returns
   */
  generateMd5Map (arr) {
    const obj = {}
    if (arr.length) {
      arr.forEach((item) => {
        obj[md5(item)] = item
      })
    }
    return obj
  },
  /**
   * 解析md5
   * @param {any} [md5Obj={}] md5 对象
   * @param {any} [md5Map={}] md5 映射
   */
  parseMd5 (md5Obj = {}, md5Map = {}) {
    const obj = {}
    for (let prop in md5Obj) {
      obj[md5Map[prop]] = md5Obj[prop]
    }
    return obj
  },
  /**
   * 设置游戏状态
   */
  setGameState (isPlaying = false) {
    window.ma_js_i && window.ma_js_i.refreshStatus && window.ma_js_i.refreshStatus(isPlaying)
  },
  /**
   * 跳转到浏览器的facebook主页
   */
  toFbBrowser () {
    const isFbApp = window.njordGame && window.njordGame.isPackageInstalled('com.facebook.katana')
    window.location.href = (isFbApp ? 'fb://page/1532330666785144' : 'https://m.facebook.com/APUS-Browser-1532330666785144')
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
        const date = new Date(this.offset)
        this.completeCallback && this.completeCallback({
          year: date.getUTCFullYear() - 1970,
          month: date.getUTCMonth(),
          date: date.getUTCDate() - 1,
          hours: date.getUTCHours(),
          minuates: date.getUTCMinutes(),
          seconds: Math.round(this.offset / 1000) % 60,
          offset: this.offset
        })
        // 如果剩余时间小于间隔
        if (this.offset < interval) {
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
