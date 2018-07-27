/* global */
import Vue from 'vue'
import Vuex from 'vuex'
import question from './modules/question'
import rank from './modules/rank'
import home from './modules/home'
import * as type from './type'
import utils from '../assets/js/utils'
import gameState from '../assets/js/game-state'
import * as status from '../assets/js/status'
import {init, syncTime} from '../assets/js/api'
import im from '../assets/js/im'
import throttle from 'lodash.throttle'
import {MESSAGE_AMOUNT, MESSAGE_RESULT, MESSAGE_END, MESSAGE_HOST, NETWORK_UNAVAILABLE, MESSAGE_EXTRA_LIFE} from '../assets/js/listener-type'
import i18n from '../i18n'
import gameProcess from '../assets/js/game-process'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
let syncTimer = null
let initTimer = null
export default new Vuex.Store({
  state: {
    isOnline: utils.isOnline, // 是否登录
    startTime: -1, // 开始时间 时间差
    startTimeOffset: 0,
    readyTime: 600000, // 准备时间 默认10分钟
    syncIntervalTime: 10000, // 同步结束时间间隔
    hostIntervalTime: 3000, // 规则轮播间隔
    hostMsgList: i18n.t('stringWords'), // 主持人消息列表
    status: status._AWAIT, // 当前状态
    onlineAmount: 0, // 在线人数
    chatRoomId: '', // 聊天室ID
    imToken: '', // 连接IM token
    /* 游戏结果数据结构:
      {
        isFinish: true, // 比赛是否完成  有可能中途一道题没人答对，比赛直接结束
        bonusAmount: 0, // 总奖金数量
        winners: [] // 获奖者列表  userId 用户ID avatar 用户头像 name 用户名 bonusAmount 奖金数量
      }
     */
    result: {
      isFinish: true,
      bonusAmount: 0,
      winners: [],
      winnerAmount: 0 // 获胜者数量
    }, // 游戏结果
    isRefreshedToken: false, // 是否已经刷新过token,
    showDialog: false,
    dialogInfo: {
      htmlTitle: '',
      htmlText: '',
      shouldSub: false,
      markType: 0,
      okBtnText: i18n.t('await.referral_code_pop.ok'),
      okEvent: null,
      hintImg: utils.getWebpImgUrl('tip-fail.png'),
      lastTime: 3000
    },
    lives: 0,
    code: '',
    gameType: 3,
    phoneNationCodeList: [], // 手机号国家码列表
    phoneNationCode: {code: '91', country: 'India'}, // 当前手机国家码
    isPlayingMusic: false, // 是否在播放音乐
    initialState: -1, // 初始化完成后的状态
    isAgreePolicy: true, // 是否同意过协议
    isRemider: false, // 是否订阅过消息
    lang: i18n.locale, // 本地语言
    isInputting: false, // 是否正在输入文字
    isShowNewbieTask: false,
    isUserGame: false, // 登录用户是否是第一次答题
    isShowTaskEnd: false, // 新手任务是否结束
    isTaskRespondence: false, // 是否显示新手任务组件
    hasBounsBox: false,
    bounsBoxId: ''
  },
  getters: {
    isOnline: (state) => state.isOnline,
    startTime: (state) => state.startTime,
    startTimeOffset: (state) => state.startTimeOffset,
    hostIntervalTime: (state) => state.hostIntervalTime,
    hostMsgList: (state) => state.hostMsgList,
    status: (state) => state.status,
    result: (state) => state.result,
    onlineAmount: (state) => state.onlineAmount,
    chatRoomId: (state) => state.chatRoomId,
    imToken: (state) => state.imToken,
    readyTime: (state) => state.readyTime,
    syncIntervalTime: (state) => state.syncIntervalTime,
    isRefreshedToken: (state) => state.isRefreshedToken,
    showDialog: (state) => state.showDialog,
    dialogInfo: (state) => state.dialogInfo,
    lives: (state) => state.lives,
    code: (state) => state.code,
    gameType: (state) => state.gameType,
    phoneNationCodeList: (state) => state.phoneNationCodeList,
    phoneNationCode: (state) => state.phoneNationCode,
    isPlayingMusic: (state) => state.isPlayingMusic,
    initialState: (state) => state.initialState,
    isAgreePolicy: (state) => state.isAgreePolicy,
    isRemider: (state) => state.isRemider,
    isUserGame: (state) => state.isUserGame,
    lang: (state) => state.lang,
    isInputting: (state) => state.isInputting,
    isShowNewbieTask: (state) => state.isShowNewbieTask,
    isShowTaskEnd: (state) => state.isShowTaskEnd,
    isTaskRespondence: (state) => state.isTaskRespondence,
    hasBounsBox: (status) => status.hasBounsBox, // 是否有宝箱
    bounsBoxId: (status) => status.bounsBoxId // 宝箱id
  },
  mutations: {
    /**
     * 更新信息
     * @param {any} state
     * @param {any} obj
     */
    [type._UPDATE] (state, obj) {
      state = Object.assign(state, obj)
    },
    /**
     * 打开弹窗
     * @param {any} state
     * @param {any} dialogInfo 弹窗信息
     */
    [type._OPEN_DIALOG] (state, dialogInfo) {
      state.dialogInfo = Object.assign(state.dialogInfo, dialogInfo)
      state.showDialog = true
    },
    /**
     * 关闭弹窗
     */
    [type._CLOSE_DIALOG] (state) {
      state.showDialog = false
      state.dialogInfo = {
        htmlTitle: '',
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: i18n.t('await.referral_code_pop.ok'),
        hintImg: utils.getWebpImgUrl('tip-fail.png'),
        lastTime: 3000
      }
    },
    /**
     * 重置串词至默认串词
     */
    [type._RESET_HOSTMSGLIST] (state) {
      state.hostMsgList = i18n.t('stringWords')
    }
  },
  actions: {
    /**
     * 初始化
     * @param {any} {commit, dispatch, state}
     */
    [type._INIT] ({commit, dispatch, getters}, isRefreshToken = false) {
      clearTimeout(initTimer)
      commit(type._UPDATE, {
        isRefreshedToken: isRefreshToken
      })
      return new Promise((resolve, reject) => {
        init(isRefreshToken).then(({data}) => {
          if (+data.result === 1 && +data.code === 0) {
            const info = (data && data.data) || {}
            gameState.init(info, {commit, dispatch, getters})
            gameState.run()
            resolve()
          } else {
            console.log('初始化失败:', data.msg)
            reject(data.msg)
            dispatch(type._POLL_INIT)
          }
        }, (err) => {
          console.log('初始化接口出错', err)
          reject(err)
          dispatch(type._POLL_INIT)
        })
      })
    },
    /**
     * 初始化监听器
     * @param {any} {dispatch}
     */
    [type._INIT_LISTENER] ({dispatch, commit, getters}) {
      // 添加网络状况监听器
      im.addListener(NETWORK_UNAVAILABLE, throttle(() => {
        !utils.disableNetworkTip && dispatch(type._OPEN_DIALOG, {
          htmlTitle: i18n.t('tip.networkNotice.title'),
          htmlText: i18n.t('tip.networkNotice.desp'),
          shouldSub: false,
          markType: 0,
          okBtnText: i18n.t('tip.networkNotice.btn')
        })
        utils.statistic('NETWORK_UNAVAILABLE', 6)
      }, 30000))
      // 添加复活卡消息监听器
      im.addListener(MESSAGE_EXTRA_LIFE, (message) => {
        console.log('复活卡消息', message)
        // 从本地同步复活卡使用信息
        const {id: raceId, reviveCardInfo = {}} = utils.storage.get('millionaire-uncommittedAnswers') || {}
        let records = []
        if (raceId === utils.raceId) {
          records = reviveCardInfo.records || []
        } else {
          utils.storage.remove('millionaire-uncommittedAnswers')
        }
        const {cardNumber: lives = 0, leftRecCount: maxRecoveryCount = 0} = message.content || {}
        // 传入的复活卡数量大于本地数量时，更新复活卡数量
        if (getters.lives < lives) {
          commit(type._UPDATE, {
            lives: lives - records.length || 0
          })
        }
        // 传入的复活次数大于本地复活次数时，更新复活次数
        if (getters.maxRecoveryCount < maxRecoveryCount) {
          commit(type.QUESTION_UPDATE, {
            maxRecoveryCount: maxRecoveryCount - records.length || 0
          })
        }
      })
      dispatch(type.GET_COMPERE_MESSAGE_ACTION)
      dispatch(type.QUESTION_INIT)
      dispatch(type._UPDATE_AMOUNT)
      dispatch(type._RECEIVE_RESULT)
      dispatch(type._END)
    },
    /**
     * 初始化轮询
     * @param {any} {dispatch}
     */
    [type._POLL_INIT] ({dispatch, getters}) {
      initTimer = setTimeout(() => {
        if (getters.status === status._AWAIT && !gameProcess.data.isTaskStart) {
          dispatch(type._INIT)
        }
      }, getters.syncIntervalTime)
    },
    /**
     * 同步开始时间
     *
     * @param {any} {commit}
     */
    [type._SYNC_TIME] ({commit, getters}) {
      // 每隔15秒同步开始时间
      if (!syncTimer) {
        syncTimer = setInterval(() => {
          if (getters.startTimeOffset <= 10) {
            clearInterval(syncTimer)
          } else {
            syncTime().then(({data}) => {
              commit(type._UPDATE, {
                startTimeOffset: +data.data || 0
              })
            }, (err) => {
              console.log('同步时间失败：' + err)
            })
          }
        }, 15000)
      }
    },
    /**
     * 更新在线人数
     * @param {any} {commit}
     */
    [type._UPDATE_AMOUNT] ({commit}) {
      im.addListener(MESSAGE_AMOUNT, (message) => {
        const count = (message.content && message.content.count) || 0
        commit(type._UPDATE, {
          onlineAmount: count
        })
      })
    },
    /**
     * 接收比赛结果
     * @param {any} {commit}
     */
    [type._RECEIVE_RESULT] ({commit, getters, dispatch}) {
      im.addListener(MESSAGE_RESULT, (message) => {
        const resultStr = message.content && message.content.summary
        if (resultStr) {
          const result = JSON.parse(resultStr)
          const {c: isFinish = false, tb: bonusAmount = 0, ws: winners = [], s: winnerAmount = 0} = result
          let winnersMap = winners.map((winner) => {
            const obj = {}
            obj.userId = winner.i
            obj.name = winner.n
            obj.avatar = winner.p
            obj.bonusAmount = winner.b
            return obj
          })
          // 更新结果
          commit(type._UPDATE, {
            result: {isFinish, bonusAmount, winners: winnersMap, winnerAmount}
          })

          // 重置问题状态
          commit(type.QUESTION_UPDATE, {
            status: status.QUESTION_ANSWERING,
            id: '',
            contents: '',
            options: [],
            optionsMd5Map: {},
            index: 0,
            watchingMode: false,
            isAnswered: false,
            isCorrect: false,
            correctAnswer: '',
            userAnswer: '',
            result: {},
            restTime: 0,
            isWon: false
          })

          // 更新状态
          commit(type._UPDATE, {
            status: status._END
          })
          utils.stopSound()
        }
      })
    },
    /**
     * 比赛结束
     * @param {any} {dispatch}
     */
    [type._END] ({dispatch, commit}) {
      im.addListener(MESSAGE_END, (message) => {
        gameState.endState.run()
      })
    },
    /**
     * 接收串词消息
     * @param {*} {commit}
     */
    [type.GET_COMPERE_MESSAGE_ACTION] ({commit}) {
      im.addListener(MESSAGE_HOST, (message, intervalTime) => {
        const msgList = (message.content && message.content.content) || ''
        // 如果传入串词间隔时间，则更新串词间隔时间
        if (intervalTime) {
          commit(type._UPDATE, {
            hostIntervalTime: intervalTime
          })
        }
        if (msgList) {
          const hostMsgList = JSON.parse(msgList) || []
          commit(type._UPDATE, {
            hostMsgList
          })
        }
        commit(type.QUESTION_UPDATE, {
          status: status.QUESTION_AWAIT
        })
        commit(type._UPDATE, {
          status: status._PLAYING
        })
      })
    },
    /**
     * 打开全局弹窗
     * @param {any} {commit, getters, state}
     * @param {any} dialogInfo 弹窗信息
     */
    [type._OPEN_DIALOG] ({commit, getters}, dialogInfo = {}) {
      commit(type._OPEN_DIALOG, dialogInfo)
      getters.dialogInfo.lastTime > 0 && setTimeout(() => {
        commit(type._CLOSE_DIALOG)
      }, getters.dialogInfo.lastTime || 3000)
    }
  },
  modules: {
    question,
    rank,
    home
  },
  strict: debug // 开启严格模式，在mutations外修改state的数据会报错
})
