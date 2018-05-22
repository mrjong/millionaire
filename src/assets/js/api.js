import axios, { accountHost, env, reportHost} from './http'
import utils from './utils'
import md5 from 'md5'

export const api = {
  init: '/cmp/ix/', // 初始化
  submitAnswer: '/cmp/ans/', // 提交答案
  weekRank: '/cmp/wboard/', // 周排行榜
  totalRank: '/cmp/tboard/', // 总排行榜
  syncStartTime: '/cmp/rst/', // 同步开始时间
  balanceApplication: '/cmp/apply', // 提现申请
  isWon: '/cmp/k/', // 用户是否获得奖金
  setQuestion: '/cmp/submit_question/', // 用户出题
  isSetQuestion: '/cmp/submit_flag/', // 是否出过题
  syncInfo: '/cmp/sc/', // 同步用户信息
  log: '/cmp/l/', // 日志
  pollMsg: '/cmp/q/', // 轮询消息
  generateCode: '/cmp/gc', // 生成邀请码,
  VerificationCode: '/cmp/vc', // 相关码验证,
  DailyShare: '/cmp/ds', // 每日分享
  sharePage: '/cmp/res', // 分享中间页
  addExtraLife: '/cmp/lc', // 首次登陆增加额外生命
  register: '/v2/user/register', // 手机号注册
  signInByPhone: '/v2/user/verifycode', // 手机号登陆
  getPhoneNationCode: '/v2/user/nationcode', // 获取手机号国家码
  useRecoveryCard: '/cmp/rev/', // 使用复活卡
  getWinnerList: '/cmp/bi/', // 获取winner列表,
  makeShortUrl: '/cmp/sl/', // 生成短链服务
  balanceRecord: '/cmp/bl', // 提现记录
  reminder: '/cmp/sub_remind/', // 订阅提醒
  logout: '/v2/user/logout/', // 退出登陆
  getPersonInfo: '/v2/user/getinfo' // 获取个人信息
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
    timeout: 5000
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

// 生成邀请码
export const generateCode = function () {
  return axios.post(api.generateCode, {
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 相关码验证
export const VerificationCode = function (code) {
  return axios.post(api.VerificationCode, {
    code: code,
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 每日分享
export const DailyShare = function () {
  return axios.post(api.DailyShare, {
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 首次登陆增加额外生命
export const addExtraLife = function () {
  return axios.post(api.addExtraLife, {
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 手机号注册获取验证码
export const register = function (phoneNumber, phoneNationcode = '91') {
  return axios.post(api.register, {
    app_id: utils.app_id,
    nationcode: phoneNationcode,
    mobile: phoneNumber,
    account_type: 8,
    cr: utils.generateRandomStr(16)
  }, {
    baseURL: accountHost[env]
  })
}

// 手机号登陆
export const signInByPhone = function (code) {
  return axios.post(api.signInByPhone, {
    code,
    app_id: utils.app_id,
    account_type: 8
  }, {
    baseURL: accountHost[env]
  })
}

// 获取手机号国家码
export const getPhoneNationCode = function () {
  return axios.post(`${accountHost[env]}${api.getPhoneNationCode}`)
}

// 使用复活卡
export const useRecoveryCard = function (id, index, type = 1) {
  return axios.get(api.useRecoveryCard, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId,
      i: id,
      s: index,
      t: type
    }
  })
}

// 获取 winner 列表
export const getWinnerList = function () {
  return axios.get(api.getWinnerList)
}

// 生成短链服务
export const makeShortUrl = function (url) {
  return axios.get(api.makeShortUrl, {
    withCredentials: false,
    timeout: 1500,
    params: {
      s: 'millionaire',
      l: url
    }
  })
}
// 提现记录
export const balanceRecord = function (pageNo) {
  return axios.post(api.balanceRecord, {
    pageNo: pageNo,
    pageSize: 10,
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 订阅提醒
export const Reminder = function (reminderOjb) {
  return axios.post(api.reminder, {
    ...reminderOjb,
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 获取调查问卷URL
export const getReportUrl = function () {
  return reportHost[env]
}

// 获取个人资料
export const getPersonInfo = function () {
  return axios.post(api.getPersonInfo, {
    app_id: utils.app_id
  }, {
    baseURL: accountHost[env]
  })
}

// 退出登陆
export const logout = function () {
  return axios.post(api.logout, {
    app_id: utils.app_id
  }, {
    baseURL: accountHost[env]
  })
}
