'use strict'

import * as type from '../type'

const state = {
  userId: '', // IM用户ID
  avatar: '', // 用户头像
  userName: '', // 用户名
  balance: 0, // 用户余额
  rank: 0, // 用户排名
  currencyType: '$', // 货币类型
  bonusAmount: 0 // 奖金数量
}

const getters = {
  userInfo: (state) => state
}

const mutations = {
  /**
   * 更新用户信息
   * @param {any} state
   * @param {any} userInfo
   */
  [type.HOME_UPDATE] (state, userInfo) {
    state = Object.assign(state, userInfo)
  }
}

const actions = {
  /**
   * 更新用户信息
   * @param {any} {commit}
   * @param {any} userInfo
   */
  [type.HOME_UPDATE] ({commit}, userInfo) {
    commit(type.HOME_UPDATE, userInfo)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
