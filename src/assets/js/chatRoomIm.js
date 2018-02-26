/* global RongIMLib RongIMClient */
import http from './http'
// import publicFun from './publicFn'
console.log()
const getUserInfo = (cb) => {
  // 根据用户名/用户id/用户头像获取 token
  let postData = {
    portraitUri: 'http://static.activities.apuslauncher.com/upload/operation/2017120517462544dbb30016.png'
  }
  let userIdArr = []
  for (let i = 1; i <= 20; i++) {
    userIdArr.push(i)
  }
  // userIdArr = publicFun.mixArray(userIdArr)
  // 暂时写死
  userIdArr = 'supa_rongyu_test_10'
  let localeUser = localStorage.getItem('apus_im_client_user')
  if (localeUser) {
    // 用户token已保存在localStorage
    localeUser = JSON.parse(localeUser)
    this.localeUser = localeUser
    cb()
  } else {
    postData.userId = 'supa_rongyu_test_' + userIdArr[0]
    postData.name = 'supa' + userIdArr[0]
    http.post('//campaign-api.apusapps.com/im', {
      data: postData,
      method: '/user/getToken'
    }).then(({data}) => {
    //   console.log(data)
      if (data.code === 200) {
        postData = Object.assign(postData, {token: data.token})
        // localStorage.setItem('apus_im_client_user', JSON.stringify(postData))
        // this.localeUser = postData
        postData && cb(postData)
      }
    })
  }
}
const initChatRoom = (appKey, token, protobuf, chatRoomId, receivedMsgCb) => {
  console.log('initChatRoom')
  const RongIMClient = RongIMLib.RongIMClient
  var config = {}
  if (protobuf) {
    config.protobuf = protobuf
  }
  // 初始化
  RongIMClient.init(appKey, null, {protobuf: protobuf})
  //   this._instance = RongIMClient.getInstance()
  // 连接状态监听器
  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      console.info(status)
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTED:
          // 链接成功
          console.log('链接成功')
          break
        case RongIMLib.ConnectionStatus.CONNECTING:
          console.log('正在链接')
          break
        case RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log('断开连接')
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
    onReceived: function (message) {
      // console.log('aaaaaaaaaaaaaaaaaaaaa')
      // 判断消息类型
      // showTips("新消息，类型为：" + message.messageType);
      // showResult("新消息",message,start);
      // self.messageList.push(message)
      // this.$nextTick(() => {
      //   const messageWrapper = document.getElementById('messageWrapper')
      //   messageWrapper.scroll(0, 100000)
      // })
      // console.log(message)
      receivedMsgCb(message)
      switch (message.messageType) {
        case RongIMClient.MessageType.TextMessage:
          /*
                        显示消息方法：
                        消息里是 原生emoji
                        RongIMLib.RongIMEmoji.emojiToHTML(message.content.content);
                        */
          break
        case RongIMClient.MessageType.VoiceMessage:
          // 对声音进行预加载
          // message.content.content 格式为 AMR 格式的 base64 码
          break
        case RongIMClient.MessageType.ImageMessage:
          // message.content.content => 图片缩略图 base64。
          // message.content.imageUri => 原图 URL。
          break
        case RongIMClient.MessageType.DiscussionNotificationMessage:
          // message.content.extension => 讨论组中的人员。
          break
        case RongIMClient.MessageType.LocationMessage:
          // message.content.latiude => 纬度。
          // message.content.longitude => 经度。
          // message.content.content => 位置图片 base64。
          break
        case RongIMClient.MessageType.RichContentMessage:
          // message.content.content => 文本消息内容。
          // message.content.imageUri => 图片 base64。
          // message.content.url => 原图 URL。
          break
        case RongIMClient.MessageType.InformationNotificationMessage:
          // do something...
          break
        case RongIMClient.MessageType.ContactNotificationMessage:
          // do something...
          break
        case RongIMClient.MessageType.ProfileNotificationMessage:
          // do something...
          break
        case RongIMClient.MessageType.CommandNotificationMessage:
          // do something...
          break
        case RongIMClient.MessageType.CommandMessage:
          // do something...
          break
        case RongIMClient.MessageType.UnknownMessage:
          // do something...
          break
        default:
                // do something...
      }
    }
  })
  // 开始链接
  RongIMClient.connect(token, {
    onSuccess: function (userId) {
      console.log('链接成功，用户id：' + userId)
      // self.getConversationList()
      RongIMClient.getInstance().joinChatRoom(chatRoomId, 10, {
        onSuccess: function () {
          // 加入聊天室成功。
          console.log(`welcom to chatRoom:${chatRoomId}`)
        },
        onError: (error) => {
          // 加入聊天室失败
          console.log(`加入聊天室失败${error}`)
        }
      })
      RongIMClient.getInstance().getChatRoomInfo(chatRoomId, 10, RongIMLib.GetChatRoomType.REVERSE, {
        onSuccess: function (chatRoom) {
          // chatRoom => 聊天室信息。
          // chatRoom.userInfos => 返回聊天室成员。
          // chatRoom.userTotalNums => 当前聊天室总人数。
          // console.log(chatRoom, chatRoom.userTotalNums)
        },
        onError: function (error) {
          // 获取聊天室信息失败。
          console.log(error)
        }
      })
    },
    onTokenIncorrect: function () {
      console.log('token无效')
    },
    onError: function (errorCode) {
      let info = ''
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时'
          break
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = '未知错误'
          break
        case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
          info = '不可接受的协议版本'
          break
        case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
          info = 'appkey不正确'
          break
        case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
          info = '服务器不可用'
          break
      }
      return info
    }
  })
}
const sendMessage = (msg, roomId, msgCb) => {
  const message = new RongIMLib.TextMessage({
    content: msg || '',
    extra: '附加消息'
  })
  const conversationtype = RongIMLib.ConversationType.CHATROOM
  const ChatRoomId = roomId || ''
  RongIMClient.getInstance().sendMessage(conversationtype, ChatRoomId, message, {
    onSuccess (info) {
      console.log('消息发送成功')
      console.log(info)
      msgCb(info)
    },
    onError (errMsg) {
      console.log('消息发送失败')
      console.log(errMsg)
    }
  })
}

export default {
  getUserInfo,
  initChatRoom,
  sendMessage
}
