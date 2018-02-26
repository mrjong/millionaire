/* eslint-disable no-redeclare */
'use strict'
// import http from '../../assets/js/http'
// import Vue from 'vue'
import * as type from '../type'
import chatRoomIm from '../../assets/js/chatRoomIm'
import testData from '../../assets/js/testData'
const state = {
  msgList: []
}
const getters = {
  chatRoomState: state => state
}
const mutations = {
  [type.CHAT_LIST_FETCH] (state, lists) {
    const list = lists || state.msgList
    const len = list.length
    const staticLen = 14 // 固定展示几条
    if (+len > staticLen) {
      state.msgList = list.splice(len - staticLen, len)
    } else {
      state.msgList = list
    }
  },
  [type.CHAT_LIST_ADD] (state, msgObj) {
    msgObj && state.msgList.push(msgObj)
  },
  [type.CHAT_LIST] (state, receivedMsgList) {
    state.msgList.push(receivedMsgList)
    console.log(receivedMsgList)
  }
}
const actions = {
  fetch ({commit}) {
    // http.get('')
    //   .then(({data}) => {
    //     console.log(data)
    //   })
    let timer // 模拟数据请求
    timer && clearInterval(timer)
    timer = setTimeout(() => {
      commit(type.CHAT_LIST_FETCH, testData.chatMesList)
    }, 500)
  },
  sendMsg ({commit}, {msgObj, cb}) {
    commit(type.CHAT_LIST_ADD, msgObj)
    commit(type.CHAT_LIST_FETCH)
    cb()
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
