import axios from './http'
import utils from './utils'
// import md5 from 'md5'

export const api = {
  init: '/cmp/ix/', // 初始化
  submitAnswer: '/cmp/ans/', // 提交答案
  weekRank: '/cmp/wboard/', // 周排行榜
  totalRank: '/cmp/tboard/', // 总排行榜
  syncStartTime: '/cmp/sct/', // 同步开始时间
  balanceApplication: 'cmp/apply' // 提现申请
}

export const init = function () {
  return axios.get(api.init, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

export const getRankInfo = function (type) {
  // 排行榜类型 week为周榜 total为总榜
  const url = type === 'week' ? api.weekRank : api.totalRank
  return axios.get(url, {
    params: {
      app_id: utils.app_id
    }
  })
}

// id为题目ID answer为答案内容
export const submitAnswer = function (id, answer, index) {
  return axios.get(api.submitAnswer, {
    params: {
      i: id,
      a: answer,
      s: index
    }
  })
}

export const syncTime = function () {
  return axios.get(api.syncStartTime)
}

export const balanceApplication = (valOption) => {
  const baseOption = {
    appId: utils.app_id,
    clientId: utils.clientId
  }
  const fetchObj = Object.assign({}, baseOption, valOption)
  return axios.post(`${api.balanceApplication}`, fetchObj)
}
