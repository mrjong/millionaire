/* eslint-disable no-redeclare */
'use strict'
import * as type from '../type'
import * as listenerType from '../../assets/js/listener-type.js'
import * as status from '../../assets/js/status'
import im from '../../assets/js/im'
const state = {
  msgList: [],
  compereMsg: ''
}
const getters = {
  // chatRoomState: state => state, 【hack】已移到组件内 暂时删除
  msgList: (state) => state.msgList,
  compereMsg: (state) => state.compereMsg
}
const mutations = {
  // 设置获取到的消息列表 【hack】已移到组件内完成
  // [type.CHAT_LIST_FETCH] (state, item) {
  //   const listItem = item || {}
  //   state.msgList.push(listItem)
  //   const len = state.msgList.length
  //   const staticLen = 14 // 固定展示几条
  //   if (+len > staticLen) {
  //     state.msgList.shift()
  //   }
  // },
  // 更新消息列表 【hack】已移到组件内完成
  // [type.CHAT_UPDATE] (state, obj) {
  //   state = Object.assign(state, obj)
  // }
}
const actions = {
  // 获取消息列表 【hack】已移到组件内完成
  // [type.CHAT_LIST_FETCH_ACTION] ({commit}) {
  //   const handler = (message) => {
  //     const obj = {
  //       img: message.content.user.avatar,
  //       nickname: message.content.user.name,
  //       msg: message.content.content,
  //       msgId: message.messageId
  //     }
  //     commit(type.CHAT_LIST_FETCH, obj)
  //   }
  //   im.addListener(listenerType.MESSAGE_NORMAL, handler)
  //   im.addListener(listenerType.MESSAGE_SEND_SUCCESS, handler)
  // },
  // 发送消息 【hack】已移到组件内完成
  // [type.CHAT_SEND_MSG_ACTION] ({commit}, {msgObj}) {
  //   im.sendMessage(msgObj.msg, msgObj.img, msgObj.nickname)
  // },
  [type.GET_COMPERE_MESSAGE_ACTION] ({commit}) {
    im.addListener(listenerType.MESSAGE_HOST, (message, intervalTime) => {
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
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
