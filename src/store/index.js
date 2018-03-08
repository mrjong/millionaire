import Vue from 'vue'
import Vuex from 'vuex'
import chatRoom from './modules/chatRoom'
import question from './modules/question'
import rank from './modules/rank'
import home from './modules/home'
import * as type from './type'
import utils from '../assets/js/utils'
import * as status from '../assets/js/status'
import {init} from '../assets/js/api'
import im from '../assets/js/im'
import currency from '../assets/js/currency'
import {CONNECT_SUCCESS, MESSAGE_AMOUNT, MESSAGE_RESULT} from '../assets/js/listener-type'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {
    isOnline: utils.isOnline, // 是否登录
    startTime: -1, // 开始时间 时间差
    readyTime: 600000, // 准备时间 默认10分钟
    syncIntervalTime: 600000, // 同步结束时间间隔
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
      ]
    } // 游戏结果
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
    /**
     * 初始化
     * @param {any} {commit, dispatch, state}
     */
    [type._INIT] ({commit, dispatch, state}) {
      return new Promise((resolve, reject) => {
        init().then(({data}) => {
          console.log(data)
          if (data.result === 1 && +data.code === 0) {
            const info = (data && data.data) || {}
            const {s: isPlaying, r: isInRoom, u: userInfo = {}, ua: accountInfo = {}, rb: bonusAmount, m: chatRoomInfo = {}, cr: currencyType = 'USD', j: question = {}, a: answer} = info
            const startTime = +info.sr || 0
            // 更新首页信息
            commit(type.HOME_UPDATE, {
              userId: userInfo.ud || '',
              supaId: userInfo.us || '',
              avatar: userInfo.up || '',
              userName: userInfo.un || '',
              balance: +accountInfo.ub || 0,
              income: +accountInfo.ui || 0,
              rank: +accountInfo.ur || 0,
              bonusAmount: +bonusAmount || 0,
              currencyType: currency[currencyType] ? currency[currencyType].symbol : '$'
            })
            console.log(currencyType, currency[currencyType])
            commit(type._UPDATE, {
              startTime: +startTime,
              onlineAmount: +chatRoomInfo.ic || 0,
              chatRoomId: chatRoomInfo.rn || '',
              imToken: chatRoomInfo.it || ''
            })
            // 如果已经开始
            if (isPlaying) {
              // 更新问题信息
              commit(type.QUESTION_UPDATE, {
                id: question.ji,
                index: +question.js || 0,
                contents: question.jc || '',
                options: question.jo || ['', '', '']
                // watchingMode: false
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
                const timer = utils.Timer(1000, Date.now() + startTime * 1000)
                timer.start()
                timer.addCompleteListener(({offset}) => {
                  commit(type._UPDATE, {
                    startTime: Math.round(offset / 1000)
                  })
                })
                timer.addEndListener(() => {
                  commit(type._UPDATE, {
                    status: status._PLAYING,
                    startTime: 0
                  })
                })
                commit(type._UPDATE, {
                  status: status._READY
                })
              } else {
                // 切换至等待状态
                commit(type._UPDATE, {
                  status: status._AWAIT
                })
                // 如果有下一场信息
                if (startTime > 0) {
                  // 每隔一段时间同步开始时间
                  const {readyTime, syncIntervalTime} = state
                  const timer = utils.Timer(syncIntervalTime, Date.now() + (+startTime * 1000) - readyTime)
                  // timer.addCompleteListener(() => {
                  //   syncTime().then(({data}) => {
                  //     if (+data.result === 1 && +data.code === 0) {
                  //       const startTime = +data.data
                  //       commit(type._UPDATE, {
                  //         startTime
                  //       })
                  //       timer.sync(Date.now() + startTime - readyTime)
                  //     } else {
                  //       console.log('同步时间出错:', data.msg)
                  //     }
                  //   }, (err) => {
                  //     console.log('同步时间失败:', err)
                  //   })
                  // })
                  timer.addEndListener(() => {
                    dispatch(type._INIT)
                  })
                  timer.start()
                }
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
            resolve()
          } else {
            console.log('初始化失败:', data.msg)
            reject(data.msg)
          }
        }, (err) => {
          console.log('初始化接口出错', err)
          reject(err)
        }).catch((err) => {
          console.log('代码逻辑出错:' + err)
        })
      })
    },
    [type._UPDATE_AMOUNT] ({commit}) {
      im.addListener(MESSAGE_AMOUNT, (message) => {
        const count = +(message.content && message.content.count)
        console.log('在线人数:' + count)
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
        console.log('游戏结束：' + resultStr)
        if (resultStr) {
          const result = JSON.parse(resultStr)
          const {c: isFinish = false, td: bonusAmount = 0, ws: winners = []} = result
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
            result: {isFinish, bonusAmount, winners: winnersMap}
          })
          // 更新状态
          commit(type._UPDATE, {
            status: status._END
          })

          // 5秒后 重新初始化
          setTimeout(() => {
            dispatch(type._INIT)
          }, 60000)
        }
      })
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
