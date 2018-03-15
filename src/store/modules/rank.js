'use strict'

import * as type from '../type'
import { getRankInfo } from '../../assets/js/api'

const state = {
  week: {
    cache: false,
    self: {},
    list: []
  },
  total: {
    cache: false,
    self: {},
    list: []
  }
}

const getters = {
  rankInfo: (state) => state
}

const mutations = {
  /**
   * 更新排行榜信息
   * @param {any} state
   * @param {any} rankInfo 更新后的键值对
   */
  [type.RANK_UPDATE] (state, rankInfo) {
    state = Object.assign(state, rankInfo)
  }
}

const actions = {
  /**
   * @param {any} {commit, getters}
   * @param {any} type 排行榜类型 week为周排行榜 total为总榜
   * @returns
   */
  [type.RANK_UPDATE] ({commit, getters}, rankType) {
    const rankInfo = {}
    return new Promise((resolve, reject) => {
      getRankInfo(rankType).then(({data}) => {
        if (+data.result === 1 && +data.code === 0) {
          rankInfo.cache = true
          const {sdata: self = {}, udata: list = []} = data.data || {}
          rankInfo.self = self
          rankInfo.list = list
          commit(type.RANK_UPDATE, {
            [rankType]: rankInfo
          })
          resolve()
        } else {
          console.log('获取排行榜失败:' + data.message)
          reject(data.message)
        }
      }, (err) => {
        console.log('获取排行榜错误:' + err)
        reject(err)
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
