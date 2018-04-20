/* global RongIMClient */
import Vue from 'vue'
import Vuex from 'vuex'
import chatRoom from './modules/chatRoom'
import question from './modules/question'
import rank from './modules/rank'
import home from './modules/home'
import * as type from './type'
import utils from '../assets/js/utils'
import * as status from '../assets/js/status'
import {init, syncTime} from '../assets/js/api'
import im from '../assets/js/im'
import currency from '../assets/js/currency'
import {CONNECT_SUCCESS, MESSAGE_AMOUNT, MESSAGE_RESULT, MESSAGE_END, INVALID_TOKEN, MESSAGE_HOST} from '../assets/js/listener-type'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
let syncTimer = null
let countDownTimer = null
let initTimer = null
export default new Vuex.Store({
  state: {
    isOnline: utils.isOnline, // 是否登录
    startTime: -1, // 开始时间 时间差
    startTimeOffset: 0,
    readyTime: 600000, // 准备时间 默认10分钟
    syncIntervalTime: 10000, // 同步结束时间间隔
    hostIntervalTime: 3000, // 规则轮播间隔
    hostMsgList: [], // 主持人消息列表
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
      winners: [
        // {
        //   name: 'wei',
        //   bonusAmount: 1000,
        //   avatar: 'http://static.activities.apuslauncher.com/upload/fe/201802261449450cd917f56e.jpg'
        // }
      ],
      winnerAmount: 0 // 获胜者数量
    }, // 游戏结果
    isRefreshedToken: false, // 是否已经刷新过token,
    showDialog: false,
    dialogInfo: {
      htmlTitle: '',
      htmlText: '',
      shouldSub: false,
      markType: 0,
      okBtnText: 'OK',
      hintImg: './static/images/tip-fail.png'
    },
    lives: 0,
    code: '',
    phoneNationCodeList: [], // 手机号国家码列表
    phoneNationCode: '91' // 当前手机国家码
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
    readyTime: (state) => state.readyTime,
    syncIntervalTime: (state) => state.syncIntervalTime,
    isRefreshedToken: (state) => state.isRefreshedToken,
    showDialog: (state) => state.showDialog,
    dialogInfo: (state) => state.dialogInfo,
    lives: (state) => state.lives,
    code: (state) => state.code,
    phoneNationCodeList: (state) => state.phoneNationCodeList,
    phoneNationCode: (state) => state.phoneNationCode
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
      setTimeout(() => {
        state.showDialog = false
      }, 3000)
    }
  },
  actions: {
    /**
     * 初始化
     * @param {any} {commit, dispatch, state}
     */
    [type._INIT] ({commit, dispatch, state, getters}, isRefreshToken = false) {
      clearInterval(initTimer)
      commit(type._UPDATE, {
        isRefreshedToken: isRefreshToken
      })
      return new Promise((resolve, reject) => {
        init(isRefreshToken).then(({data}) => {
          if (+data.result === 1 && +data.code === 0) {
            const info = (data && data.data) || {}
            const {s: isPlaying, r: isInRoom, u: userInfo = {}, ua: accountInfo = {}, rb: bonusAmount = '0', m: chatRoomInfo = {}, cr: currencyType = 'INR', j: question, a: answer, si: hostIntervalTime = 3000, rs: hostMsgList, cn: lives, cd: code, v: watchingMode} = info
            const startTime = +info.sr || 0
            const startTimeOffset = +info.ls || 0
            const isOnline = 'm' in userInfo ? !userInfo.m : false // 是否登陆
            utils.isOnline = isOnline
            // 更新首页信息
            commit(type.HOME_UPDATE, {
              userId: userInfo.us || '',
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
            commit(type._UPDATE, {
              hostIntervalTime,
              lives,
              code,
              isOnline,
              startTime,
              startTimeOffset,
              onlineAmount: +chatRoomInfo.ic || 0,
              chatRoomId: chatRoomInfo.rn || '',
              imToken: chatRoomInfo.it || ''
            })
            commit(type.QUESTION_UPDATE, {
              watchingMode: typeof watchingMode === 'boolean' ? watchingMode : true
            })
            // 如果已经开始
            if (isPlaying) {
              // 如果已经开始串词
              if (hostMsgList && !question) {
                im.emitListener(MESSAGE_HOST, {
                  content: {
                    content: JSON.stringify(hostMsgList)
                  }
                })
                utils.statistic('introduction_stage', 0)
              }
              // 如果已经下发题目 开启观战模式
              if (question) {
                // 更新问题信息
                const options = question.jo || ['', '', '']
                const optionsMd5Map = utils.generateMd5Map(options)
                commit(type.QUESTION_UPDATE, {
                  id: question.ji || '',
                  index: +question.js || 0,
                  contents: question.jc || '',
                  options,
                  optionsMd5Map
                })
                commit(type.QUESTION_UPDATE, {
                  status: status.QUESTION_ANSWERING
                })
              }
              // 如果有答案直接进入答案页面
              if (answer) {
                const md5Map = getters.optionsMd5Map
                commit(type.QUESTION_UPDATE, {
                  correctAnswer: md5Map[answer.ac] || '',
                  result: utils.parseMd5(answer.as, md5Map) || {}
                })
                commit(type.QUESTION_UPDATE, {
                  status: status.QUESTION_END
                })
              }

              if (getters.watchingMode) {
                dispatch(type._OPEN_DIALOG, {
                  htmlTitle: 'You are late.',
                  htmlText: 'The game already started, you can view only. Please come ealier for the next time to play and win.',
                  shouldSub: false,
                  markType: 0,
                  okBtnText: 'OK'
                })
              }

              // 更新当前状态
              commit(type._UPDATE, {
                status: status._PLAYING
              })
            } else {
              // 是否进入倒计时
              if (isInRoom) {
                clearInterval(countDownTimer)
                countDownTimer = setInterval(() => {
                  if (getters.startTimeOffset <= 0) {
                    clearInterval(countDownTimer)
                    commit(type._UPDATE, {
                      startTimeOffset: 0
                    })
                    // 倒计时到了后直接开始展示串词
                    im.emitListener(MESSAGE_HOST, {
                      content: {
                        content: JSON.stringify(hostMsgList)
                      }
                    })
                  } else {
                    commit(type._UPDATE, {
                      startTimeOffset: getters.startTimeOffset - 1
                    })
                  }
                }, 1000)
                commit(type._UPDATE, {
                  status: status._READY
                })
                // 开始同步时间
                dispatch(type._SYNC_TIME)
              } else {
                // 切换至等待状态
                commit(type._UPDATE, {
                  status: status._AWAIT
                })
                dispatch(type._POLL_INIT)
              }
            }
            // 如果聊天室开启，进入聊天室
            if (isInRoom) {
              im.startPullMsg()
              im.addListener(CONNECT_SUCCESS, (imUserId) => {
                commit(type.HOME_UPDATE, {
                  imUserId
                })
                im.joinChatRoom(state.chatRoomId)
              })
              // 若token过期，且没有刷新过token 重新初始化刷新token
              if (!getters.isRefreshedToken) {
                im.addListener(INVALID_TOKEN, () => {
                  dispatch(type._INIT, true)
                  im.removeLister(INVALID_TOKEN)
                })
              }
              im.connect(state.imToken)
            }
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
        }).catch((err) => {
          console.log('代码逻辑出错:' + err)
        })
      })
    },
    /**
     * 初始化轮询
     * @param {any} {dispatch}
     */
    [type._POLL_INIT] ({dispatch, getters}) {
      setTimeout(() => {
        dispatch(type._INIT)
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
        const count = +(message.content && message.content.count)
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
          const {c: isFinish = false, td: bonusAmount = 0, ws: winners = [], s: winnerAmount = 0} = result
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
        }
      })
    },
    /**
     * 比赛结束
     * @param {any} {dispatch}
     */
    [type._END] ({dispatch, commit}) {
      im.addListener(MESSAGE_END, (message) => {
        dispatch(type._INIT)
        // 清空聊天室
        commit(type.CHAT_UPDATE, {
          msgList: [],
          compereMsg: ''
        })
        RongIMClient.getInstance().disconnect()
      })
    },
    /**
     * 打开全局弹窗
     * @param {any} {commit, getters, state}
     * @param {any} dialogInfo 弹窗信息
     */
    [type._OPEN_DIALOG] ({commit, getters, state}, dialogInfo) {
      commit(type._OPEN_DIALOG, dialogInfo)
    }
  },
  modules: {
    chatRoom,
    question,
    rank,
    home
  },
  strict: debug // 开启严格模式，在mutations外修改state的数据会报错
})
