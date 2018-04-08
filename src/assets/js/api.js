import axios from './http'
import utils from './utils'
import md5 from 'md5'

export const api = {
  init: '/cmp/ix/', // 初始化
  submitAnswer: '/cmp/ans/', // 提交答案
  weekRank: '/cmp/wboard/', // 周排行榜
  totalRank: '/cmp/tboard/', // 总排行榜
  syncStartTime: '/cmp/rst/', // 同步开始时间
  getServerTime: '/cmp/st/', // 获取服务器时间
  submitTime: '/cmp/ps/', // 提交请求时间
  balanceApplication: '/cmp/apply', // 提现申请
  isWon: '/cmp/k/', // 用户是否获得奖金
  setQuestion: '/cmp/submit_question/', // 用户出题
  isSetQuestion: '/cmp/submit_flag/', // 是否出过题
  syncInfo: '/cmp/sc/', // 同步用户信息
  log: '/cmp/l/', // 日志
  pollMsg: '/cmp/q/' // 轮询消息
}

export const init = function (isRefreshToken) {
  const params = {
    app_id: utils.app_id,
    client_id: utils.clientId
  }
  // 是否刷新token
  if (isRefreshToken) {
    params.r = true
  }
  return axios.get(api.init, {
    params
  })
}

export const getRankInfo = function (type) {
  // 排行榜类型 week为周榜 total为总榜
  const url = type === 'week' ? api.weekRank : api.totalRank
  return axios.get(url, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// id为题目ID answer为答案内容
export const submitAnswer = function (id, answer, index) {
  return axios.get(api.submitAnswer, {
    params: {
      i: id,
      a: md5(answer),
      s: index,
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// 同步开始时间
export const syncTime = function () {
  return axios.get(api.syncStartTime)
}

// 获取服务器时间
export const getServerTime = function () {
  return axios.get(api.getServerTime)
}

// 提交请求时间
export const submitTime = function () {
  getServerTime().then(({data}) => {
    if (+data.result === 1 && +data.code === 0) {
      axios.post(api.submitTime, {
        st: +data.data || 0,
        cid: utils.clientId,
        ua: window.navigator.userAgent
      })
    } else {
      console.log('获取服务器时间失败')
    }
  }).catch((err) => {
    console.log('获取服务器时间错误', err)
  })
}

export const balanceApplication = (valOption) => {
  const baseOption = {
    appId: utils.app_id,
    clientId: utils.clientId
  }
  const fetchObj = Object.assign({}, baseOption, valOption)
  return axios.post(`${api.balanceApplication}`, fetchObj)
}
export const ifSelfWon = () => {
  return axios.get(`${api.isWon}?app_id=${utils.app_id}&client_id=${utils.clientId}`)
}

// 用户出题
export const setQuestions = (questionInfo) => {
  return axios.post(`${api.setQuestion}`, {
    ...questionInfo,
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 是否出过题
export const isSetQuestion = function () {
  return axios.get(`${api.isSetQuestion}?app_id=${utils.app_id}&client_id=${utils.clientId}`)
}

// 同步用户信息
export const syncInfo = function () {
  return axios.get(api.syncInfo, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// 轮询消息
export const pollMsg = function () {
  return axios.get(api.pollMsg, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    },
    timeout: 3000
  })
}

// 日志
export const log = function (content) {
  return axios.post(api.log, {
    content: JSON.stringify(content)
  }).then(() => {}).catch((err) => {
    console.log('日志上报出错：', err)
  })
}
