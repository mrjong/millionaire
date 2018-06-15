import utils from '../utils.js'
import im from '../im'
import { _UPDATE, HOME_UPDATE, QUESTION_UPDATE, _INIT } from '../../../store/type.js'
import currency from '../currency.js'
import awaitState from './state-await.js'
import countDownState from './state-countDown.js'
import playingState from './state-playing.js'
import endState from './state-end.js'
import { CONNECT_SUCCESS, INVALID_TOKEN } from '../listener-type.js'
import gameProcess from '../game-process'
import { PROCESS_QUESTION } from '../status.js'

const gameState = {
  data: {},
  $store: null,
  awaitState, // 等待状态
  countDownState, // 倒计时状态
  playingState, // 进行状态
  endState, // 结束状态
  /**
   * 初始化
   */
  init (data, $store) {
    this.data = data
    this.$store = $store
    this.awaitState.init(data, $store)
    this.countDownState.init(data, $store)
    this.playingState.init(data, $store)
    this.endState.init(data, $store)
    this.update()
  },
  /**
   * 更新信息
   */
  update () {
    const {data: info} = this
    const {u: userInfo = {}, ri: gameInfo = {}} = info
    const {i: raceId} = gameInfo
    const isOnline = 'm' in userInfo ? !userInfo.m : false // 是否登陆
    utils.isOnline = isOnline
    utils.raceId = raceId // 更新比赛ID
    this.storage_info()
    this.update_home()
    this.update_global()
    this.update_question()
  },
  /**
   * 更新比赛全局信息
   */
  update_global () {
    const {data: info} = this
    const {ri: gameInfo = {}, cn: lives = 0, cd: code, m: chatRoomInfo = {}} = info
    const {si: hostIntervalTime = 3000, t: gameType} = gameInfo
    const startTime = +info.sr || -1
    const startTimeOffset = +info.ls || 0
    this.$store.commit(_UPDATE, {
      hostIntervalTime,
      lives,
      code,
      gameType,
      isOnline: utils.isOnline,
      startTime,
      startTimeOffset,
      onlineAmount: chatRoomInfo.is || '',
      chatRoomId: chatRoomInfo.rn || '',
      imToken: chatRoomInfo.it || ''
    })
  },
  /**
   * 更新首页信息
   */
  update_home () {
    const {u: userInfo = {}, ua: accountInfo = {}, ri: gameInfo = {}} = this.data
    const {rb: bonusAmount = 0, cr: currencyType = 'INR'} = gameInfo
    this.$store.commit(HOME_UPDATE, {
      userId: userInfo.ud || '',
      supaId: userInfo.us || '',
      avatar: userInfo.up || '',
      userName: userInfo.un || '',
      balance: +accountInfo.ub || 0,
      balanceShow: accountInfo.sub || '',
      clientBalance: +accountInfo.cb || 0,
      clientBalanceShow: accountInfo.scb || '',
      income: +accountInfo.ui || 0,
      incomeShow: accountInfo.sui || '',
      rank: +accountInfo.ur || 0,
      bonusAmount,
      currencyType: currency[currencyType] ? currency[currencyType].symbol : '$'
    })

    // 如果有未登录态奖金未同步，则同步账户信息
    if (this.$store.getters.userInfo.clientBalance > 0 && utils.isOnline) {
      utils.syncAccountInfo()
    }
  },
  /**
   * 更新问题信息
   */
  update_question () {
    let watchingMode = false
    const {ri: gameInfo = {}, v: initialWatchingMode, lc: maxRecoveryCount} = this.data
    const {lr: isCanRecoveryLastQuestion, qc: questionCount = 0, i: id} = gameInfo
    const {offlineMode = false, watchingMode: cachedWatchingMode = true, id: cachedRaceId} = utils.storage.get('millionaire-process') || {}
    if (offlineMode && cachedRaceId === id) { // 若离线模式开启，则忽略传入的观战模式
      watchingMode = !!cachedWatchingMode
    } else {
      watchingMode = typeof initialWatchingMode === 'boolean' ? initialWatchingMode : true
    }
    this.$store.commit(QUESTION_UPDATE, {
      watchingMode,
      isCanRecoveryLastQuestion: typeof isCanRecoveryLastQuestion === 'boolean' ? isCanRecoveryLastQuestion : false,
      maxRecoveryCount: +maxRecoveryCount || 0,
      count: +questionCount
    })
  },
  /**
   * 运行状态
   */
  run () {
    this.update()
    const {s: isPlaying, r: isInRoom} = this.data
    if (isPlaying) {
      gameProcess.init(this.data, this.$store, PROCESS_QUESTION)
      this.playingState.run()
    } else {
      // 是否进入倒计时
      if (isInRoom) {
        gameProcess.init(this.data, this.$store)
        this.countDownState.run()
      } else {
        this.awaitState.run()
      }
    }

    // 如果聊天室开启，进入聊天室
    if (isInRoom) {
      this.joinChatRoom()
    }

    // 设置初始化状态
    this.$store.commit(_UPDATE, {
      initialState: this.$store.getters.status
    })
  },
  /**
   * 存储比赛信息
   */
  storage_info () {
    const {ri: gameInfo = {}} = this.data
    const {rs: beginHostMsgList, cs: resultHostMsgList, qs: questions} = gameInfo
    utils.storage.set('millionaire-qs', questions) // 缓存题目信息
    utils.storage.set('millionaire-rs', beginHostMsgList) // 缓存题目信息
    utils.storage.set('millionaire-cs', resultHostMsgList) // 缓存结束串词
  },
  /**
   * 加入聊天室
   */
  joinChatRoom () {
    const {offlineMode = false} = utils.storage.get('millionaire-process') || {}
    !offlineMode && im.startPullMsg()
    im.addListener(CONNECT_SUCCESS, (imUserId) => {
      this.$store.commit(HOME_UPDATE, {
        imUserId
      })
      im.joinChatRoom(this.$store.getters.chatRoomId)
    })
    // 若token过期，且没有刷新过token 重新初始化刷新token
    if (!this.$store.getters.isRefreshedToken) {
      im.addListener(INVALID_TOKEN, () => {
        this.$store.dispatch(_INIT, true)
        im.removeLister(INVALID_TOKEN)
      })
    }
    im.connect(this.$store.getters.imToken)
  }
}

export default gameState
