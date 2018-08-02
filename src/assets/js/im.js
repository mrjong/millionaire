/* global */
import IM from 'im'
import * as type from './listener-type'
import {pollMsg, getIMServerAddress, getBounsId} from './api'
import utils from './utils'
import {vm} from '../../main'
import throttle from 'lodash.throttle'
import { _INIT, _UPDATE } from '../../store/type'
import gameProcess from './game-process'
import { PROCESS_RESULT_HOSTMSG, PROCESS_QUESTION_HOSTMSG, PROCESS_QUESTION, PROCESS_ANSWER, PROCESS_RESULT } from './status'

const im = {
  serverAddress: null,
  pullMsgId: '', // 消息ID
  pullMsgTimer: null, // 拉取消息定时器
  pullMsgInterval: 1000, // 拉取消息间隔
  pullMsgErrorCount: 0, // 拉取消息错误次数
  maxpullMsgErrorCount: 2, // 拉取消息最大错误次数
  isHandledMsg: true, // 消息是否被处理
  chatRoomId: '', // 聊天室ID
  token: '', // 用户token
  userId: '', // 用户ID
  listeners: {}, // 监听器,
  messageTypes: [ // 消息类型列表
    {
      messageName: 'QuestionMessage',
      propertys: ['content'],
      objectName: 'APUS:QuestionMsg'
    },
    {
      messageName: 'AnswerMessage',
      propertys: ['answer', 'summary'],
      objectName: 'APUS:AnswerMsg'
    },
    {
      messageName: 'PeopleMessage',
      propertys: ['count', 'extra'],
      objectName: 'APUS:PeopleMsg'
    },
    {
      messageName: 'SummaryMessage',
      propertys: ['summary'],
      objectName: 'APUS:SummaryMsg'
    },
    {
      messageName: 'HostMessage',
      propertys: ['content', 'user'],
      objectName: 'APUS:HostMsg'
    },
    {
      messageName: 'GameEndMessage',
      propertys: ['end'],
      objectName: 'APUS:GameEndMsg'
    },
    {
      messageName: 'KeepLiveMessage',
      propertys: ['content'],
      objectName: 'APUS:KeepLiveMSg'
    },
    {
      messageName: 'ResurrectionMessage',
      propertys: ['cardNumber', 'leftRecCount'],
      objectName: 'APUS:RMsg'
    }
  ],

  isSupportOnlineEvent: false, // 是否支持在线离线事件

  /**
   * 初始化
   */
  init () {
    // 初始化监听器
    for (let prop in type) {
      this.listeners[type[prop]] = null
    }

    // 获取IM服务器地址
    getIMServerAddress().then(({data}) => {
      if (+data.result === 1 && +data.code === 0) {
        im.serverAddress = data.data || ''
        im.emitListener(type.GET_SERVER_ADDRESS_SUCCESS)
      } else {
        console.error(`获取IM服务器地址失败: ${data.message || ''}`)
      }
    }, err => {
      console.log(`获取IM服务地址出错:`, err)
    })
  },

  /**
   * 连接服务器
   * @param {any} token
   */
  connect (token) {
    const {serverAddress} = im
    if (!serverAddress) {
      console.log('连接失败: IM服务器地址为空')
      im.addListener(type.GET_SERVER_ADDRESS_SUCCESS, () => {
        im.connect(token)
        im.removeLister(type.GET_SERVER_ADDRESS_SUCCESS)
      })
      return false
    }
    // im.disconnect() // 先断开链接
    this.token = token
    IM.connect({
      token,
      serverAddress,
      debug: true,
      onconnect (err, {userId}) {
        if (!err) {
          console.log('连接成功' + userId, token)
          im.userId = userId
          im.emitListener(type.CONNECT_SUCCESS, userId)
        } else {
          console.log('连接失败：', err)
        }
      },
      ondisconnect () {
        console.log('IM断开连接')
      },
      onmessage: (message) => {
        // 判断消息类型
        console.log(message)
        switch (message.type) {
          case 0:
            this.emitListener(type.MESSAGE_NORMAL, message)
            break
          case 1:
            this.emitListener(type.MESSAGE_AMOUNT, message)
            break
          case 2:
            this.emitListener(type.MESSAGE_EXTRA_LIFE, message)
            break
          case type.MESSAGE_ANSWER:
            // 暂时使用轮询方案代替接收
            break
          case type.MESSAGE_HOST:
            // 暂时使用轮询方案代替接收
            break
          case type.MESSAGE_QUESTION:
            // 暂时使用轮询方案代替接收
            break
          case type.MESSAGE_RESULT:
            // 暂时使用轮询方案代替接收
            break
          case type.MESSAGE_END:
            // 暂时使用轮询方案代替接收
            break
          default:
            console.log('未知类型消息:', message)
        }
      }
    })
  },
  /**
   * 断开连接
   */
  disconnect () {
    try {
      IM.disconnect()
    } catch (err) {
      console.log('disconnect 失败：', err)
    }
  },
  /**
   * 重新连接
   */
  reconnect () {
  },

  /**
   * 加入聊天室
   * @param {any} chatRoomId 聊天室ID
   * @param {any} count 拉取历史消息条数
   */
  joinChatRoom (chatRoomId, count = 0) {
    this.chatRoomId = chatRoomId
    IM.joinChatRoom({
      id: chatRoomId,
      onsuccess (msg) {
        console.log('加入聊天室成功', msg)
        im.emitListener(type.CHATROOM_JOIN_SUCCESS)
      },
      onerror (error) {
        console.log('加入聊天室失败', error)
        im.emitListener(type.CHATROOM_JOIN_FAIL, error)
      },
      onsendmessage (err, msg) {
        if (!err) {
          console.log('发送消息成功', msg)
        } else {
          console.log('发送消息失败', err)
        }
      }
    })
  },

  /**
   * 开始轮询消息
   */
  startPullMsg (interval = 2000) {
    clearInterval(im.pullMsgTimer)
    im.pullMsgTimer = setInterval(im.pullMsg, interval)
  },

  /**
   * 拉取消息
   */
  pullMsg () {
    pollMsg().then(({data}) => {
      if (+data.result === 1 && +data.code === 0) {
        im.isHandledMsg && im.pollMsgHandler(data.data)
      } else {
        console.log('拉去消息失败', data)
      }
    }).catch((error) => {
      console.log(`拉取消息出错:`, error, new Date())
      if (error.code === 'ECONNABORTED') { // 拉取超时
        im.emitListener(type.NETWORK_UNAVAILABLE)
        im.timeoutStatistic()
      }
      // 判断是否进入观战模式
      const cachedGameProcessData = utils.storage.get('millionaire-process') || {}
      const {offlineMode, currentState} = cachedGameProcessData
      if (!offlineMode && currentState !== PROCESS_RESULT_HOSTMSG && currentState !== PROCESS_RESULT) { // 未开启观战模式且状态不是结果页和结束串词
        im.pullMsgErrorCount++
        if (im.pullMsgErrorCount >= im.maxpullMsgErrorCount) { // 异常次数超过上限
          const {validTime = 0} = cachedGameProcessData
          gameProcess.update({
            ...cachedGameProcessData,
            offlineMode: true
          })
          gameProcess.cacheProcessInfo()
          if (validTime > 0) { // 若当前进度剩余时间大于0 直接开始运行 否则运行下一进度
            gameProcess.run()
          } else {
            gameProcess.next()
          }
          im.stopPullMsg()
          im.pullMsgErrorCount = 0
        }
      }
    })
  },
  /**
   * 超时统计
   */
  timeoutStatistic: throttle(() => {
    utils.statistic('TIMEOUT', 0, {
      style_s: utils.clientId,
      text_s: vm.$store.getters.userInfo.userId
    }, vm.$store.getters.userInfo.userName)
  }, 5000),
  /**
   * 停止轮询消息
   */
  stopPullMsg () {
    clearInterval(im.pullMsgTimer)
    im.pullMsgId = ''
    im.isHandledMsg = true
  },

  /**
   * 轮询消息处理
   */
  pollMsgHandler (data = {}) {
    im.isHandledMsg = false
    const {i: msgId, t: msgType, d: msg, l: validTime = 0} = data
    const cachedGameProcessData = utils.storage.get('millionaire-process') || {}
    if (cachedGameProcessData.offlineMode) {
      im.pullMsgId = ''
      im.isHandledMsg = true
      return
    }
    gameProcess.update({...cachedGameProcessData, validTime})
    if (msgId !== im.pullMsgId) { // 若是新消息，处理消息并触发监听器
      const currentIndex = msg || 1
      switch (msgType) {
        case 1: { // 串词消息
          const {si: intervalTime} = msg || {}
          utils.isOnline && getBounsId().then(({data}) => {
            if (data.result === 1 && data.code === 0 && data.data.success) {
              vm.$store.commit(_UPDATE, {
                hasBounsBox: true,
                bounsBoxId: data.data.boxId
              })
            }
          })
          gameProcess.update({
            currentState: PROCESS_RESULT_HOSTMSG,
            hostMsgInterval: intervalTime
          })
          gameProcess.run()
          break
        }
        case 7: { // 题目串词消息
          gameProcess.update({
            currentState: PROCESS_QUESTION_HOSTMSG,
            currentIndex
          })
          gameProcess.run()
          break
        }
        case 2: { // 题目消息
          gameProcess.update({
            currentState: PROCESS_QUESTION,
            currentIndex
          })
          gameProcess.run()
          break
        }
        case 3: { // 答案汇总消息
          const currentIndex = msg.js || 1
          gameProcess.update({
            currentState: PROCESS_ANSWER,
            answerSummary: msg.as || {},
            currentIndex
          })
          gameProcess.run()
          break
        }
        case 4: { // 比赛结果消息
          gameProcess.update({
            currentState: PROCESS_RESULT,
            result: msg
          })
          gameProcess.run()
          break
        }
        case 5: { // 比赛结束消息 重新初始化直接退出
          im.emitListener(type.MESSAGE_END)
          im.stopPullMsg()
          return
        }
        case 6: { // 非比赛消息 重新初始化直接退出
          im.stopPullMsg()
          vm.$store.dispatch(_INIT)
          return
        }
      }
    }
    if (validTime >= 30000) { // 根据消息剩余有效时间判断轮询间隔时间
      im.startPullMsg(10000)
    } else if (validTime >= 10000) {
      im.startPullMsg(5000)
    } else if (validTime >= 5000) {
      im.startPullMsg(3000)
    } else {
      im.startPullMsg()
    }
    im.pullMsgId = msgId
    im.isHandledMsg = true
  },

  /**
   * 发送消息
   * @param {any} content 消息内容
   * @param {any} avatar 用户头像
   * @param {any} name 用户名
   */
  sendMessage (content, avatar, name) {
    const msg = { content, user: {avatar, name} }
    IM.sendChatRoomMsg(msg)
  },

  sendAliveMessage () {
    // TODO: 发送保活消息
  },

  /**
   * 添加监听器
   * @param {any} listenerType 监听器类型
   * @param {any} listener 监听器
   */
  addListener (listenerType, listener) {
    this.listeners[listenerType] = listener
  },

  /**
   * 触发监听器
   * @param {any} listenerType 监听器类型
   * @param {any} args 参数
   */
  emitListener (listenerType, ...args) {
    const listener = this.listeners[listenerType]
    listener && listener(...args)
  },
  /**
   * 删除监听器
   * @param {any} listenerType
   */
  removeLister (listenerType) {
    if (listenerType) {
      const listener = this.listeners[listenerType]
      if (listener) {
        this.listeners[listenerType] = null
      }
    } else {
      const listeners = this.listeners
      for (let prop in listeners) {
        listeners[prop] = null
      }
    }
  }
}

export default im
