/* global IS_LOGIN */
// IS_LOGIN webpack define
/* eslint-disable standard/no-callback-literal,camelcase */
import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import md5 from 'md5'
import {makeShortUrl, api, logout, getPersonInfo, queryAgreePolicy, syncInfo, addExtraLife} from './api'
import {host, env, imageHost} from './http'
import {FACEBOOK, MESSAGER, WHATSAPP, TWITTER} from './package-name'
import {vm} from '../../main'
import { _UPDATE, HOME_UPDATE } from '../../store/type'
import currency from './currency'
const njordGame = window.top.njordGame
const ma_js_i = window.top.ma_js_i
const TercelAutoPlayJs = window.top.TercelAutoPlayJs

storage.addPlugin(expirePlugin)

const sounds = {
  'countDown10-before': {
    urls: ['//static.apusapps.com/countDown10-before.mp3', '//static.apusapps.com/20180424112649eb09f8016b.m4a'],
    instance: null,
    loop: false
  },
  'countDown10-after': {
    urls: ['//static.apusapps.com/countDown10-after.mp3'],
    instance: null,
    loop: false
  },
  bg: {
    urls: ['//static.apusapps.com/20180314200629b0edee0942.ogg', '//static.apusapps.com/20180424100731925fbbbfca.m4a'],
    instance: null,
    loop: true
  },
  countDown5: {
    urls: ['//static.apusapps.com/5s-countdown.mp3'],
    instance: null,
    loop: false
  },
  go: {
    urls: ['//static.apusapps.com/20180313173916879991205a.mp3'],
    instance: null,
    loop: false
  },
  failed: {
    urls: ['//static.apusapps.com/2018031317404850dad39593.mp3'],
    instance: null,
    loop: false
  },
  succeed: {
    urls: ['//static.apusapps.com/201803131742354229751a36.mp3'],
    instance: null,
    loop: false
  }
}
// 客户端公共参数
const clientParams = (njordGame && njordGame.getClientParams) ? JSON.parse(njordGame.getClientParams()) : null
// 客户端分享参数
const shareParams = (ma_js_i && ma_js_i.getSharedParam) ? JSON.parse(ma_js_i.getSharedParam()) : null

console.log('客户端分享参数', shareParams)

const utils = {
  /**
   * 登录
   * @param {any} callback
   */
  login (callback, isSyncInfo = true) {
    window.top.loginCallback = function () {
      // 更改在线状态
      utils.isOnline = true
      vm.$store.commit(_UPDATE, {
        isOnline: true
      })
      addExtraLife().then(({data}) => {
        if (+data.result === 1 && +data.code === 0) {
          vm.$store.commit(_UPDATE, {
            lives: +data.data || 0
          })
        }
      })
      callback()
      // 登录是否同意过协议
      queryAgreePolicy().then(({data}) => {
        if (data.result === 1 && +data.code === 0) {
          const {agree, isEU = false} = data.data || {}
          if (isEU) {
            vm.$router.replace({path: '/blank'})
          } else {
            if (!agree) {
              vm.$store.commit(_UPDATE, {
                isAgreePolicy: false
              })
            } else {
              vm.$store.commit(_UPDATE, {
                isAgreePolicy: true
              })
              vm.$router.replace({path: '/'})
            }
          }
        }
      })
    }
    if (njordGame) {
      const loginArgs = JSON.stringify({
        callbackMethod: 'loginSuccess()',
        from_source: 'million_aire'
      })
      njordGame.login && njordGame.login(loginArgs)
    } else {
      vm.$router.push({path: '/login'})
    }
  },
  /**
   * 退出登陆
   */
  logout (callback, errCallback) {
    logout().then(({data}) => {
      if (+data.error_code === 0) {
        callback && callback()
      } else {
        errCallback && errCallback(data.error_msg || '')
        console.log('退出登陆失败', data.error_msg || '')
      }
    }, err => {
      errCallback && errCallback(err)
      console.log('退出登陆出错', err)
    })
    // 客户端退出登陆
    njordGame && njordGame.logout && njordGame.logout()
  },
  /**
   * 获取个人信息
   */
  getPersonInfo (callback, errCallback) {
    getPersonInfo().then(({data}) => {
      if (+data.error_code === 0) {
        callback && callback(data.data || {})
      } else {
        console.log('获取个人信息失败:', data.error_msg || '')
        errCallback && errCallback(data.error_msg || '')
      }
    }, err => {
      console.log('获取个人用户信息出错:', err)
      errCallback && errCallback(err)
    })
  },
  /**
   * 同步账户信息
   */
  syncAccountInfo () {
    /* eslint-disable prefer-promise-reject-errors */
    return new Promise((resolve, reject) => {
      syncInfo().then(({data}) => {
        console.log('同步返回数据：', data)
        if (+data.result === 1 && +data.code === 0) {
          const {ub: balance = 0, sub: balanceShow = '', cb: clientBalance = 0, scb: clientBalanceShow = '', ui: income = 0, sui: incomeShow = '', ur: rank = 0, uc: currencyType} = data.data || {}
          vm.$store.commit(HOME_UPDATE, {
            balance: +balance,
            balanceShow,
            clientBalance: +clientBalance,
            clientBalanceShow,
            income: +income,
            incomeShow,
            rank: +rank,
            currencyType: currency[currencyType] ? currency[currencyType].symbol : '₹'
          })
          resolve()
        } else {
          console.log('同步个人账户失败:', data.msg || '')
          reject(+data.code)
        }
      }, (err) => {
        console.log('同步个人账户信息出错:', err)
        reject(-1)
      })
    })
  },
  /**
  * 获取浏览器公共参数
  * @param {any} name
  * @param {string} [url='']
  * @returns
  */
  getQuery (name, url = '') {
    const queryUrlArr = url.match(/.*\?(\S+)$/)
    const queryUrl = queryUrlArr ? queryUrlArr[1] : window.location.search.slice(1)
    const regx = new RegExp(`(^|&)${name}=(\\S+?)(&|$)`)
    const search = queryUrl.match(regx)
    return (search && decodeURIComponent(search[2])) || null
  },
  storage,
  app_id: clientParams ? clientParams.appId : '100110002',
  clientId: clientParams ? (clientParams.newClientId || clientParams.clientId) : '',
  timezone: clientParams ? clientParams.localZone : -new Date().getTimezoneOffset(),
  isOnline: clientParams ? !!clientParams.isLogin : IS_LOGIN, // 是否在线
  disableNetworkTip: false, // 是否禁用网络状况提示
  pageType: clientParams ? 'app' : 'h5', // 页面类型 app代表客户端 h5代表网页
  raceId: '', // 本场比赛ID
  actUrl: 'http://bit.ly/VoteForYourCity', // 活动URL
  icode: shareParams ? shareParams.icode : null,

  /**
   * 关闭客户端WebView
   */
  closeWebview () {
    njordGame && njordGame.closePage && njordGame.closePage()
  },
  /**
   * 打点
   * @static
   * @memberof Utils
   */
  statistic (name = '', event = 0, params = {}, from = utils.getQuery('referrer') || 'default') {
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
    // 客户端打点
    njordGame && njordGame.logStatistic && njordGame.logStatistic(JSON.stringify(args))
    // h5 打点
    const webParams = {}
    for (let prop in params) {
      webParams[`web_${prop.replace(/_s|l$/g, '')}`] = params[prop]
    }

    let h5EventType = eventType
    // h5 事件类型映射
    switch (eventType) {
      case '67240565': {
        h5EventType = '84043893'
        break
      }
      case '67262581': {
        h5EventType = '84044149'
        break
      }
      case '67241845': {
        h5EventType = '84043381'
        break
      }
    }
    window.ares && window.ares.track(h5EventType, {
      web_name: name,
      web_from_source: from,
      ...webParams
    })
  },
  /**
   * 计时器
   */
  Timer (interval, endTime, completeCallback, endCallback) {
    return new Timer(interval, endTime, completeCallback, endCallback)
  },
  /**
   * 分享
   * @param {any} callback 回调函数
   * @param {any} packageName 分享包名
   * @param {any} content 分享内容
   * @param {any} [link=window.location.href] 分享链接
   */
  share (callback, packageName, content, link = window.location.href, code, title, desp) {
    /* eslint-disable no-useless-escape */
    const shareTitle = title || `I'm playing 'Go! Millionaire', my referral code is ${code}，join us and win up to 1000000 at 10PM every day!`
    const shareDesp = desp || `Open the game link and use my referral code ${code}, let keep winning cash every day!`
    const shareLink = `${window.location.protocol}${host[env]}${api.sharePage}?shareUrl=${encodeURIComponent(link)}&title=${encodeURIComponent(shareTitle)}&desp=${encodeURIComponent(shareDesp)}`
    const handler = function (shareLink, originUrl) {
      window.shareSuccessCallback = callback
      callback(true, packageName)
      switch (packageName) {
        case FACEBOOK: {
          setTimeout(() => {
            const href = `https://www.facebook.com/sharer?u=${encodeURIComponent(originUrl)}`
            window.location.href = href
          }, 5)
          window.location.href = `fb://facewebmodal/f?href=` + encodeURIComponent(`https://www.facebook.com/dialog/share?href=${encodeURIComponent(encodeURIComponent(originUrl))}`)
          break
        }
        case MESSAGER: {
          window.location.href = `fb-messenger://share/?link=${encodeURIComponent(originUrl)}`
          break
        }
        case WHATSAPP: {
          window.location.href = `whatsapp://send?text=${encodeURIComponent(shareLink)}`
          break
        }
        case TWITTER: {
          setTimeout(() => {
            const href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareLink}`
            window.location.href = href
          }, 5)
          window.location.href = `twitter://post?message=${shareTitle}&url=${encodeURIComponent(shareLink)}`
        }
      }
    }
    // 生成短链
    makeShortUrl(encodeURIComponent(shareLink)).then(({data}) => {
      if ((+data.result === 1) && (+data.code === 0) && data.data) {
        const shortUrl = data.data
        handler(shortUrl, shareLink)
      } else {
        handler(shareLink, shareLink)
      }
    }).catch(() => {
      handler(shareLink, shareLink)
    })
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
  /**
   * 格式化题目序号
   * @param {any} index 序号
   * @returns
   */
  formatIndex (index) {
    let result = index
    switch (+index) {
      case 1: {
        result = '1st'
        break
      }
      case 2: {
        result = '2nd'
        break
      }
      case 3: {
        result = '3rd'
        break
      }
      default: {
        result = `${index}th`
      }
    }
    return result
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
      const urls = obj.urls
      if (urls && urls.length) {
        const sound = document.createElement('audio')
        urls.forEach((url) => {
          const source = document.createElement('source')
          source.src = url
          sound.appendChild(source)
        })
        sound.loop = obj.loop
        sound.preload = 'true'
        sound.oncanplay = function () {
          sound.oncanplay = null
        }
        sound.onerror = function () {
          console.log(`${prop} 加载失败`)
        }

        if (prop === 'bg') {
          sound.onplaying = function () {
            vm.$store.commit(_UPDATE, {
              isPlayingMusic: true
            })
          }
          sound.onpause = function () {
            vm.$store.commit(_UPDATE, {
              isPlayingMusic: false
            })
          }
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
    if (!vm.$store.getters.isPlayingMusic) {
      return false
    }
    this.stopSound(name)
    if (name) {
      const urls = sounds[name] && sounds[name].urls
      if (urls.length) {
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
    if (name) {
      const sound = sounds[name].instance
      !sound.paused && sound.pause()
      sound.currentTime = 0
    } else {
      for (let name in sounds) {
        utils.stopSound(name)
      }
    }
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
    if (isFbApp) {
      window.location.href = 'fb://page/1814960232131059'
    } else {
      setTimeout(() => {
        window.location.href = 'https://www.facebook.com/GoMillionaire-1814960232131059/'
      }, 500)
      window.location.href = 'fb://page/1814960232131059'
    }
  },
  /**
   * 生成指定长度的随机串
   * @param {any} len
   */
  generateRandomStr (len) {
    let str = ''
    while (len > 0) {
      str = str + String.fromCharCode(parseInt(Math.random() * 58) + 65)
      len--
    }
    return str
  },
  /**
   * 获取图片URL
   */
  getImageUrl (name) {
    const isSupportWebpFormat = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
    const path = isSupportWebpFormat ? '/imageView/format/webp/source/millionaire/images/' : '/imageView/source/millionaire/images/'
    return `${imageHost}${path}${name}`
  },
  /**
   * 清除分享参数
   */
  clearShareParams () {
    ma_js_i && ma_js_i.clearSharedParam && ma_js_i.clearSharedParam()
  },
  /**
   * 是否安装应用
   * @param {*} packageName 包名
   * @returns
   */
  isInstall (packageName) {
    return njordGame && njordGame.isPackageInstalled && njordGame.isPackageInstalled(packageName)
  }
}

export default utils

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
