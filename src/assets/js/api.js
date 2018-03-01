import axios from './http'
import utils from './utils'

export const api = {
  init: '/cmp/ix/', // 初始化
  submitAnswer: '/cmp/ans/', // 提交答案
  rank: '', // 排行榜
  syncStartTime: '/cmp/sct/', // 同步开始时间
  balanceApplication: '/balanceApplication'
}

export const init = function () {
  return axios.get(api.init, {
    params: {
      app_id: utils.app_id
    }
  })
}

// id为题目ID answer为答案内容
export const submitAnswer = function (id, answer) {
  return axios.post(api.submitAnswer, {
    subjectId: id,
    answer
  })
}

export const syncTime = function () {
  return axios.get(api.syncStartTime)
}

export const balanceApplication = (valOption) => {
  const baseOption = {
    app_id: utils.app_id,
    newClientId: utils.clientId
  }
  const fetchObj = Object.assign({}, baseOption, valOption)
  return axios.post(api.balanceApplication, fetchObj)
}
