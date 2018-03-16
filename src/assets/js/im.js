/* global RongIMLib RongIMClient */
import * as type from './listener-type'
import {appKey} from './http'

const im = {

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
    }
  ],

  /**
   * 初始化
   */
  init () {
    // 初始化监听器
    for (let prop in type) {
      this.listeners[type[prop]] = null
    }
    RongIMClient.init(appKey)

    // 注册消息类型
    this.messageTypes.forEach((messageType) => {
      const messageName = messageType.messageName // 消息类型。
      const objectName = messageType.objectName // 消息内置名称，请按照此格式命名。
      const mesasgeTag = new RongIMLib.MessageTag(true, true) // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      const propertys = messageType.propertys// 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys)
    })

    RongIMClient.setConnectionStatusListener({
      onChanged: (status) => {
        this.emitListener(status)
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            console.log('链接成功')
            break
          case RongIMLib.ConnectionStatus.CONNECTING:
            console.log('正在链接')
            break
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            console.log('断开连接')
            this.reconnect()
            break
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录')
            break
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            console.log('域名不正确')
            break
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用')
            break
        }
      }
    })
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: (message) => {
        console.log(message.messageType, message.content)
        // 判断消息类型
        switch (message.messageType) {
          case RongIMClient.MessageType.TextMessage:
            this.emitListener(type.MESSAGE_NORMAL, message)
            break
          case type.MESSAGE_AMOUNT:
            this.emitListener(type.MESSAGE_AMOUNT, message)
            break
          case type.MESSAGE_ANSWER:
            this.emitListener(type.MESSAGE_ANSWER, message)
            break
          case type.MESSAGE_HOST:
            this.emitListener(type.MESSAGE_HOST, message)
            break
          case type.MESSAGE_QUESTION:
            this.emitListener(type.MESSAGE_QUESTION, message)
            break
          case type.MESSAGE_RESULT:
            this.emitListener(type.MESSAGE_RESULT, message)
            break
          default:
            console.log('未知类型消息:' + message)
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
        console.log('Connect successfully.' + userId)
        this.emitListener(type.CONNECT_SUCCESS, userId)
      },
      onTokenIncorrect: () => {
        console.log('token无效')
        this.emitListener(type.INVALID_TOKEN)
      },
      onError: (errorCode) => {
        let info = ''
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时'
            this.emitListener(type.CONNECTED_TIMEOUT, info)
            this.reconnect()
            break
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误'
            this.emitListener(type.CONNECTED_ERROR, info)
            break
          case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
            info = '不可接受的协议版本'
            this.emitListener(type.CONNECTED_ERROR, info)
            break
          case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
            info = 'appkey不正确'
            this.emitListener(type.CONNECTED_ERROR, info)
            break
          case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
            info = '服务器不可用'
            this.emitListener(type.CONNECTED_ERROR, info)
            break
        }
        console.log(info)
        this.reconnect()
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
        this.emitListener(type.CONNECT_SUCCESS)
      },
      onTokenIncorrect: function () {
        console.log('token无效')
        this.emitListener(type.CONNECTED_ERROR, 'token无效')
      },
      onError: (errorCode) => {
        console.log(`重新连接出错 错误码：${errorCode}`)
        this.emitListener(type.CONNECTED_ERROR, `重新连接出错 错误码：${errorCode}`)
      }
    }
    const config = {
      auto: true,
      url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
      rate: [100, 1000, 2000, 3000, 30000]
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
        this.emitListener(type.CHATROOM_JOIN_SUCCESS)
      },
      onError: (error) => {
        console.log('加入聊天室失败')
        this.emitListener(type.CHATROOM_JOIN_FAIL, error)
      }
    })
  },

  /**
   * 发送消息
   * @param {any} content 消息内容
   * @param {any} avatar 用户头像
   * @param {any} name 用户名
   */
  sendMessage (content, avatar, name) {
    const msg = new RongIMLib.TextMessage({ content: content, user: {avatar, name} })
    const conversationtype = RongIMLib.ConversationType.CHATROOM
    const targetId = this.chatRoomId // 房间号
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: (message) => {
        console.log('Send successfully')
        console.log(message)
        this.emitListener(type.MESSAGE_SEND_SUCCESS, message)
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
        this.emitListener(type.MESSAGE_SEND_FAIL, info)
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
