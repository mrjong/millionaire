'use strict'

import * as type from '../type'

const state = {
  imUserId: '', // IM用户ID,
  userId: '', // 用户ID
  supaId: '',
  avatar: '', // 用户头像
  userName: '', // 用户名
  balance: 0, // 用户余额
  balanceShow: '', // 用户余额-展示
  clientBalance: 0, // 用户clientId下的余额，
  clientBalanceShow: '', // 用户clientId下的余额-展示
  rank: 0, // 用户排名
  currencyType: '₹', // 货币类型
  bonusAmount: 0, // 奖金数量
  income: 0, // 总收益,
  incomeShow: '0', // 总收益展示,
  icode: '', // 好友验证码
  myselfBonusAmount: 0 // 本场比赛自己赢得的奖金数
}

const getters = {
  userInfo: (state) => state,
  currencyType: (state) => state.currencyType
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

export default {
  state,
  getters,
  mutations
}
