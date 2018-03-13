/* eslint-disable no-redeclare */
'use strict'
import * as type from '../type'
import * as listenerType from '../../assets/js/listener-type.js'
import * as status from '../../assets/js/status'
import im from '../../assets/js/im'
import utils from '../../assets/js/utils'
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
  }
}
const actions = {
  [type.CHAT_LIST_FETCH_ACTION] ({commit}) {
    const handler = (message) => {
      const obj = {
        img: message.content.user.avatar,
        nickname: message.content.user.name,
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
  [type.GET_COMPERE_MESSAGE_ACTION] ({commit, getters}) {
    im.addListener(listenerType.MESSAGE_HOST, (message) => {
      const msgList = (message.content && message.content.content) || ''
      if (msgList) {
        // 开始展示首页规则时播放背景音乐
        if (getters.hostMsgList && !getters.hostMsgList.length) {
          utils.playSound('bg')
        }
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
