/* global RongIMLib RongIMClient */
import * as type from './listener-type'
import {appKey} from './http'
import {pollMsg} from './api'

let keepLiveMessageTimer = null

const im = {
  pullMsgId: '', // 消息ID
  pullMsgTimer: null, // 拉取消息定时器
  pullMsgInterval: 1000, // 拉取消息间隔
  pullMsgTimeoutCount: 0, // 拉去消息超时次数
  isHandledMsg: true, // 消息是否被处理
  chatRoomId: '', // 聊天室ID
  token: '', // 用户token
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
      propertys: ['count'],
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
    RongIMClient.init(appKey, null, {
      navi: 'navsg01-glb.ronghub.com'
    })

    // emoji 初始化
    const config = {
      size: 36, // 大小, 默认 24, 建议18 - 58
      url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // Emoji 背景图片
      lang: 'en'
    }
    RongIMLib.RongIMEmoji.init(config)

    // 注册消息类型
    this.messageTypes.forEach((messageType) => {
      const messageName = messageType.messageName // 消息类型。
      const objectName = messageType.objectName // 消息内置名称，请按照此格式命名。
      const mesasgeTag = new RongIMLib.MessageTag(messageName !== 'KeepLiveMessage', messageName !== 'KeepLiveMessage') // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      const propertys = messageType.propertys// 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys)
    })

    // 监听离线在线状态
    window.addEventListener('offline', () => {
      im.isSupportOnlineEvent = true
      console.log('断开连接:')
      clearInterval(keepLiveMessageTimer)
      im.emitListener(type.NETWORK_UNAVAILABLE)
      RongIMClient.getInstance().disconnect && RongIMClient.getInstance().disconnect()
    })

    window.addEventListener('online', () => {
      im.isSupportOnlineEvent = true
      console.log('重新连接:', im.token)
      im.connect(im.token)
    })

    RongIMClient.setConnectionStatusListener({
      onChanged: (status) => {
        im.emitListener(status)
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            console.log('链接成功')
            break
          case RongIMLib.ConnectionStatus.CONNECTING:
            console.log('正在链接')
            break
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            console.log('断开连接')
            clearInterval(keepLiveMessageTimer)
            break
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录')
            break
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            console.log('域名不正确')
            break
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用')
            im.emitListener(type.NETWORK_UNAVAILABLE)
            setTimeout(() => {
              clearInterval(keepLiveMessageTimer)
              RongIMClient.getInstance().disconnect && RongIMClient.getInstance().disconnect()
              im.connect(im.token)
            }, 500)
            break
        }
      }
    })
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: (message) => {
        // console.log(message.messageType, message.content)
        // 判断消息类型
        switch (message.messageType) {
          case RongIMClient.MessageType.TextMessage:
            message.content.content = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content)
            this.emitListener(type.MESSAGE_NORMAL, message)
            // console.warn(message.messageUId, message.sentTime, message.content.content)
            break
          case type.MESSAGE_AMOUNT:
            this.emitListener(type.MESSAGE_AMOUNT, message)
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
   * 连接服务器
   * @param {any} token
   */
  connect (token) {
    this.token = token
    RongIMClient.connect(token, {
      onSuccess: (userId) => {
        console.log('Connect successfully.' + userId, token)
        keepLiveMessageTimer = setInterval(() => {
          im.sendAliveMessage()
        }, 5000)
        im.emitListener(type.CONNECT_SUCCESS, userId)
      },
      onTokenIncorrect: () => {
        console.log('token无效', token)
        im.emitListener(type.INVALID_TOKEN)
      },
      onError: (errorCode) => {
        let info = ''
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时'
            im.emitListener(type.CONNECTED_TIMEOUT, info)
            break
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误'
            this.emitListener(type.CONNECTED_ERROR, info)
            break
          case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
            info = '不可接受的协议版本'
            im.emitListener(type.CONNECTED_ERROR, info)
            break
          case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
            info = 'appkey不正确'
            im.emitListener(type.CONNECTED_ERROR, info)
            break
          case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
            info = '服务器不可用'
            im.emitListener(type.CONNECTED_ERROR, info)
            break
        }
        console.log(info)
        setTimeout(() => {
          im.connect(im.token)
        }, 500)
        im.emitListener(type.NETWORK_UNAVAILABLE)
      }
    })
  },

  /**
   * 重新连接
   */
  reconnect () {
    const callback = {
      onSuccess: (userId) => {
        console.log('Reconnect successfully.' + userId)
        im.emitListener(type.CONNECT_SUCCESS)
      },
      onTokenIncorrect: function () {
        console.log('token无效')
        im.emitListener(type.CONNECTED_ERROR, 'token无效')
        im.emitListener(type.INVALID_TOKEN)
      },
      onError: (errorCode) => {
        console.log(`重新连接出错 错误码：${errorCode}`)
        im.emitListener(type.CONNECTED_ERROR, `重新连接出错 错误码：${errorCode}`)
      }
    }
    const config = {
      auto: true,
      url: 'cdn.ronghub.com/RongIMLib-2.3.0.min.js',
      rate: [500, 1000, 2000, 3000, 5000, 8000, 10000, 20000]
    }
    RongIMClient.reconnect(callback, config)
  },

  /**
   * 加入聊天室
   * @param {any} chatRoomId 聊天室ID
   * @param {any} count 拉取历史消息条数
   */
  joinChatRoom (chatRoomId, count = 0) {
    this.chatRoomId = chatRoomId
    RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
      onSuccess: () => {
        console.log('加入聊天室成功')
        im.emitListener(type.CHATROOM_JOIN_SUCCESS)
      },
      onError: (error) => {
        console.log('加入聊天室失败')
        im.emitListener(type.CHATROOM_JOIN_FAIL, error)
      }
    })
  },

  /**
   * 开始轮询消息
   */
  startPullMsg () {
    clearInterval(im.pullMsgTimer)
    im.pullMsgTimer = setInterval(im.pullMsg, 1000)
  },

  /**
   * 拉取消息
   */
  pullMsg () {
    pollMsg().then(({data}) => {
      im.pullMsgTimeoutCount = 0
      if (+data.result === 1 && +data.code === 0) {
        im.isHandledMsg && im.pollMsgHandler(data.data)
      } else {
        console.log('拉去消息失败', data)
      }
    }).catch((error) => {
      console.log(`拉取消息出错:`, error, new Date())
      if (error.code === 'ECONNABORTED') {
        im.pullMsgTimeoutCount = im.pullMsgTimeoutCount + 1
      }
      // 连续超时两次，提示网络错误
      if (im.pullMsgTimeoutCount >= 2) {
        im.emitListener(type.NETWORK_UNAVAILABLE)
        im.pullMsgTimeoutCount = -im.pullMsgTimeoutCount
      }
    })
    console.log('拉取消息：', new Date())
  },

  /**
   * 停止轮询消息
   */
  stopPullMsg () {
    clearInterval(im.pullMsgTimer)
  },

  /**
   * 轮询消息处理
   */
  pollMsgHandler (data = {}) {
    im.isHandledMsg = false
    const {i: msgId, t: msgType, d: msg = {}, l: validTime} = data
    if (msgId !== im.pullMsgId) { // 若是新消息，处理消息并触发监听器
      switch (msgType) {
        case 1: { // 串词消息
          const {rs: hostMsgList, si: intervalTime} = msg
          im.emitListener(type.MESSAGE_HOST, {
            content: {
              content: JSON.stringify(hostMsgList)
            }
          }, intervalTime)
          break
        }
        case 2: { // 题目消息
          const restTime = parseInt(validTime / 1000)
          im.emitListener(type.MESSAGE_QUESTION, {
            content: {
              content: JSON.stringify({
                ...msg,
                restTime: restTime >= 10 ? 10 : restTime
              })
            }
          })
          break
        }
        case 3: { // 答案汇总消息
          const question = {
            id: msg.ji || '',
            index: msg.js || 1,
            contents: msg.jc || '',
            options: msg.jo || ['', '', '']
          }
          const answer = {
            i: msg.ji || '',
            a: msg.ac || ''
          }
          const summary = msg.as || {}
          im.emitListener(type.MESSAGE_ANSWER, {
            content: {
              answer: JSON.stringify(answer),
              summary: JSON.stringify(summary),
              question: JSON.stringify(question)
            }
          })
          break
        }
        case 4: { // 比赛结果消息
          im.emitListener(type.MESSAGE_RESULT, {
            content: {
              summary: JSON.stringify(msg)
            }
          })
          break
        }
        case 5: { // 比赛结束消息
          im.emitListener(type.MESSAGE_END, msg.t || 0)
          break
        }
      }
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
    content = RongIMLib.RongIMEmoji.emojiToSymbol(content)
    const msg = new RongIMLib.TextMessage({ content: content, user: {avatar, name} })
    const conversationtype = RongIMLib.ConversationType.CHATROOM
    const targetId = this.chatRoomId // 房间号
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: (message) => {
        message.content.content = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content)
        im.emitListener(type.MESSAGE_SEND_SUCCESS, message)
      },
      onError: (errorCode, message) => {
        let info = ''
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时'
            break
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误'
            break
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息'
            break
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中'
            break
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中'
            break
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中'
            break
          default:
            info = '发送消息出错'
            break
        }
        console.log('发送失败:' + info)
        im.emitListener(type.MESSAGE_SEND_FAIL, info)
      }
    }
    )
  },

  sendAliveMessage () {
    const msg = new RongIMClient.RegisterMessage.KeepLiveMessage({content: 'alive'})
    const conversationtype = RongIMLib.ConversationType.PRIVATE
    const targetId = `p-${parseInt(Math.random() * 10000)}`
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: (message) => {
      },
      onError: (errorCode, message) => {
        console.log('保活消息发送失败')
      }
    }
    )
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
