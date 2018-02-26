/* eslint-disable no-redeclare */
'use strict'
import http from '../../assets/js/http'
import Vue from 'vue'
import * as type from '../type'
import chatRoomIm from '../../assets/js/chatRoomIm'
const state = {
  list: {
    chatList: []
  }
}
const getters = {
  chatRoomState: state => state
}
const mutations = {
  [type.EXAMPLE] (state, {key, val}) {
    Vue.set(state.list, key, val)
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
  initChatRoom ({commit}, {appKey, token, protobuf, chatRoomId}) {
    chatRoomIm.initChatRoom(appKey, token, protobuf, chatRoomId)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
