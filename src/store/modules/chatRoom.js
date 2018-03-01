/* eslint-disable no-redeclare */
'use strict'
import * as type from '../type'
import * as listenerType from '../../assets/js/listener-type.js'
import im from '../../assets/js/im'
const state = {
  msgList: [],
  compereMsg: ''
}
const getters = {
  chatRoomState: state => state,
  msgList: (state) => state.msgList,
  compereMsg: (state) => state.compereMsg
}
const mutations = {
  [type.CHAT_LIST_FETCH] (state, item) {
    const listItem = item || {}
    state.msgList.push(listItem)
    const len = state.msgList.length
    const staticLen = 14 // 固定展示几条
    if (+len > staticLen) {
      state.msgList = state.msgList.splice(len - staticLen, len)
    }
  },
  [type.GET_COMPERE_MESSAGE] (state, compereMsg) {
    state.compereMsg = compereMsg.content.content
  }
}
const actions = {
  [type.CHAT_LIST_FETCH_ACTION] ({commit}) {
    const handler = (message) => {
      const obj = {
        img: '',
        nickname: '',
        msg: message.content.content,
        msgId: message.messageId
      }
      commit(type.CHAT_LIST_FETCH, obj)
    }
    im.addListener(listenerType.MESSAGE_NORMAL, handler)
    im.addListener(listenerType.MESSAGE_SEND_SUCCESS, handler)
  },
  [type.CHAT_SEND_MSG_ACTION] ({commit}, {msgObj}) {
    im.sendMessage(msgObj.msg, msgObj.img, msgObj.nickname)
  },
  [type.GET_COMPERE_MESSAGE_ACTION] ({commit}) {
    im.addListener(listenerType.MESSAGE_HOST, (message) => {
      commit(type.GET_COMPERE_MESSAGE, message)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
