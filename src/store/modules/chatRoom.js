/* eslint-disable no-redeclare */
'use strict'
// import http from '../../assets/js/http'
// import Vue from 'vue'
import * as type from '../type'
// import chatRoomIm from '../../assets/js/chatRoomIm'
// import testData from '../../assets/js/testData'
import * as listenerType from '../../assets/js/listener-type.js'
import im from '../../assets/js/im'
const state = {
  msgList: []
}
const getters = {
  chatRoomState: state => state
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
  [type.CHAT_LIST_FETCH] ({commit}) {
    im.addListener(listenerType.MESSAGE_NORMAL, (message) => {
      const obj = {
        img: '',
        nickname: '',
        msg: message.content.content
      }
      commit(type.CHAT_LIST_FETCH, obj)
    })
  },
  [type.CHAT_SEND_MSG] ({commit}, {msgObj, cb}) {
    im.sendMessage(msgObj.msg, msgObj.img, msgObj.nickname)
    commit(type.CHAT_LIST_FETCH, msgObj)
    cb()
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
