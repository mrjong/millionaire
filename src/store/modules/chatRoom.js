/* eslint-disable no-redeclare */
'use strict'
import http from '../../assets/js/http'
// import Vue from 'vue'
import * as type from '../type'
import chatRoomIm from '../../assets/js/chatRoomIm'
const state = {
  msgList: []
}
const getters = {
  chatRoomState: state => state
}
const mutations = {
  [type.CHAT_LIST] (state, receivedMsgList) {
    // state.msgList = []
    state.msgList.push(receivedMsgList)
    console.log(receivedMsgList)
  }
}
const actions = {
  fetch ({commit}) {
    http.get('')
      .then(({data}) => {
        console.log(data)
      })
  },
  getUserInfo ({commit}, cb) {
    chatRoomIm.getUserInfo((userInfo) => {
      cb && cb(userInfo)
    })
  },
  initChatRoom ({commit}, {appKey, token, protobuf, chatRoomId, receivedMsgCb}) {
    chatRoomIm.initChatRoom(appKey, token, protobuf, chatRoomId, (receivedMsgList) => {
      commit(type.CHAT_LIST, receivedMsgList)
    })
  },
  sendMessage ({commit}, {msg, roomId}) {
    chatRoomIm.sendMessage(msg, roomId, (sendMsg) => {
      commit(type.CHAT_LIST, sendMsg)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
