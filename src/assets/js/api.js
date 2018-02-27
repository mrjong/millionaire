import axios from './http'
import utils from './utils'

export const api = {
  init: '/cmp/ix/', // 初始化
  submitAnswer: '/cmp/ans/', // 提交答案
  rank: '', // 排行榜
  syncStartTime: '/cmp/sct/' // 同步开始时间
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
