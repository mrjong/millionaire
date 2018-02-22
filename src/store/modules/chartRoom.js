/* eslint-disable no-redeclare */
'use strict'
import http from '../../assets/js/http'
import Vue from 'vue'
import * as type from '../type'
const state = {
  list: {
    chartList: []
  }
}
const getters = {
  chartRoomState: state => state
}
const mutations = {
  [type.EXAMPLE] (state, {key, val}) {
    Vue.set(state.list, key, val)
  }

}
const actions = {
  fetch ({commit}) {
    http.get('example')
      .then(({data}) => {
        commit(type.EXAMPLE, data.key, data.val)
      })
  }

}
export default {
  state,
  getters,
  mutations,
  actions
}
