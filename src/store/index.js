import Vue from 'vue'
import Vuex from 'vuex'
import chatRoom from './modules/chatRoom'
import question from './modules/question'
import home from './modules/home'
import * as type from './type'
import utils from '../assets/js/utils'
import * as status from '../assets/js/status'
import {init, syncTime} from '../assets/js/api'
import im from '../assets/js/im'
import {CONNECT_SUCCESS, MESSAGE_AMOUNT, MESSAGE_RESULT} from '../assets/js/listener-type'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {
    isOnline: utils.isOnline, // 是否登录
    startTime: Infinity, // 开始时间 时间差
    readyTime: 600000, // 准备时间 默认10分钟
    syncIntervalTime: 600000, // 同步结束时间间隔
    status: status._AWAIT, // 当前状态
    onlineAmount: 0, // 在线人数
    result: null, // 游戏结果
    chatRoomId: '', // 聊天室ID,
    imToken: '' // 连接IM token
  },
  getters: {
    isOnline: (state) => state.isOnline,
    startTime: (state) => state.startTime,
    status: (state) => state.status,
    result: (state) => state.result,
    onlineAmount: (status) => status.onlineAmount,
    readyTime: (status) => status.readyTime
  },
  mutations: {
    /**
     * 更新信息
     * @param {any} state
     * @param {any} obj
     */
    [type._UPDATE] (state, obj) {
      state = Object.assign(state, obj)
    }
  },
  actions: {
    [type._UPDATE_LOGINSTATE] ({commit}, loginState) {
      // 是否在线
      commit(type._UPDATE_LOGINSTATE, loginState)
    },
    /**
     * 初始化
     * @param {any} {commit, dispatch, state}
     */
    [type._INIT] ({commit, dispatch, state}) {
      init().then(({data}) => {
        console.log(data)
        if (data.result === 1 && +data.code === 0) {
          const info = data.data
          const {s: isPlaying, r: isInRoom, ui: userId, up: avatar, un: userName, ub: balance, income, ur: rank, sr: startTime, rb: bonusAmount, cc: onlineAmount, m: chamInfo, j: question, a: answer} = info
          // 更新首页信息
          commit(type.HOME_UPDATE, {
            userId,
            avatar,
            userName,
            balance: +balance,
            income: +income,
            rank: +rank,
            bonusAmount: +bonusAmount
          })
          commit(type._UPDATE, {
            startTime: +startTime,
            onlineAmount: +onlineAmount,
            chatRoomId: chamInfo.rn,
            imToken: chamInfo.it
          })
          // 如果已经开始
          if (isPlaying) {
            // 更新问题信息
            commit(type.QUESTION_UPDATE, {
              id: question.ji,
              index: +question.js,
              content: question.jc || '',
              options: question.jo || ['', '', ''],
              watchingMode: true
            })
            // 如果有答案直接进入答案页面
            if (answer) {
              commit(type.QUESTION_UPDATE, {
                correctAnswer: answer.ac || '',
                result: answer.as
              })
              commit(type.QUESTION_UPDATE, {
                status: status.QUESTION_END
              })
            }
            // 更新当前状态
            commit(type._UPDATE, {
              status: status._PLAYING
            })
          } else {
            // 是否进入倒计时
            if (isInRoom) {
              const timer = utils.Timer(1000, Date.now() + startTime)
              timer.addCompleteListener(({offset}) => {
                commit(type._UPDATE, {
                  startTime: offset
                })
              })
              timer.addEndListener(() => {
                commit(type._UPDATE, {
                  status: status._PLAYING
                })
              })
              timer.start()
              commit(type._UPDATE, {
                status: status._READY
              })
            } else {
              // 每隔一段时间同步开始时间
              const {readyTime, syncIntervalTime} = state
              const timer = utils.Timer(syncIntervalTime, Date.now() + startTime - readyTime)
              timer.addCompleteListener(() => {
                syncTime().then(({data}) => {
                  if (+data.result === 1 && +data.code === 0) {
                    commit(type._UPDATE, {
                      startTime: data.data
                    })
                  } else {
                    console.log('同步时间出错:', data.msg)
                  }
                }, (err) => {
                  console.log('同步时间失败:', err)
                })
              })
              timer.addEndListener(() => {
                dispatch(type._INIT)
              })
              timer.start()
            }
          }
          // 如果聊天室开启，进入聊天室
          if (isInRoom) {
            im.addListener(CONNECT_SUCCESS, (imUserId) => {
              commit(type.HOME_UPDATE, {
                imUserId
              })
              im.joinChatRoom(state.chatRoomId)
            })
            im.connect(state.imToken)
          }
        } else {
          console.log('初始化失败:', data.msg)
        }
      }, (err) => {
        console.log('初始化接口出错', err)
      })
    },
    [type._UPDATE_AMOUNT] ({commit}) {
      im.addListener(MESSAGE_AMOUNT, (messgae) => {
        commit(type._UPDATE, {
          onlineAmount: messgae && messgae.content && messgae.content.content
        })
      })
    },
    [type._RECEIVE_RESULT] ({commit}) {
      im.addListener(MESSAGE_RESULT, (messgae) => {
        commit(type._UPDATE, {
          result: messgae && messgae.content && messgae.content.content
        })
      })
    }
  },
  modules: {
    chatRoom,
    question,
    home
  },
  strict: debug // 开启严格模式，在mutations外修改state的数据会报错
})
