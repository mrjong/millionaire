/* global PUBLIC_URL */
import axios, { accountHost, env, reportHost } from './http'
import utils from './utils'

const publicUrl = PUBLIC_URL

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
  getPersonInfo: '/v2/user/getinfo', // 获取个人信息
  clearRecord: '/cmp/wc/', // 标记删除提现记录
  submitAgreePolicy: '/cmp/sub_ag/', // 上报协议
  queryAgreePolicy: '/cmp/ag/', // 查询是否同意协议
  cashRecord: '/cmp/bfr/', // 余额记录
  getAnswerSummary: '/cmp/as/', // 获取答案汇总结果
  inviteWeeklyBoard: '/cmp/iwboard/', // 邀请好友周排行
  inviteTotalBoard: '/cmp/itboard/', // 邀请好友总排行,
  myInviteBoard: '/cmp/myinvite/', // 我的邀请
  inviteLink: '/cmp/ic', // 生成分享facebook好友链接
  checkInviteCode: '/cmp/ifc', // 验证分享好友码
  updateNickname: '/v2/user/updateinfo', // 更新用户信息
  uploadAvatar: '/v2/user/pic', // 上传头像
  updateAvatarCache: '/cmp/ru', // 更新头像缓存
  cancelReminder: '/cmp/cancel_remind/', // 取消订阅
  doubelRewardList: '/cmp/gdb', // 获取双倍奖金
  getBounsId: '/cmp/gb', // 获得宝箱id
  getBounsBox: '/cmp/ub/', // 获得宝箱
  myInviteData: '/cmp/sef/' // 我邀请的好友答题
}

export const init = function (isRefreshToken) {
  const params = {
    app_id: utils.app_id,
    client_id: utils.clientId,
    f: true
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

// 提交答案 uncommittedAnswers 为未提交的答案数组 isLastQuestion 为是否是最后一题
export const submitAnswer = function (uncommittedAnswers = [], isLastQuestion = false, isOnlySubmitReviveCardInfo = false) {
  const {offlineMode = false} = utils.storage.get('millionaire-process') || {}
  // 从本地同步复活卡信息
  const { reviveCardInfo = {} } = utils.storage.get('millionaire-uncommittedAnswers') || {}
  return axios.post(api.submitAnswer, {
    i: utils.raceId,
    as: isOnlySubmitReviveCardInfo ? [] : uncommittedAnswers,
    app_id: utils.app_id,
    client_id: utils.clientId,
    rs: reviveCardInfo.records || [],
    flag: offlineMode
  }, {
    retry: isLastQuestion ? 100 : 3,
    retryDelay: isLastQuestion ? 2000 : 500,
    timeout: 5000
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

// 用户是否赢得奖金
export const ifSelfWon = () => {
  return axios.get(api.isWon, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId,
      race_id: utils.raceId
    }
  })
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
      client_id: utils.clientId,
      race_id: utils.raceId
    },
    timeout: 5000
  })
}

// 日志
export const log = function (content) {
  return axios.post(api.log, {
    content: JSON.stringify(content)
  }).then(() => { }).catch((err) => {
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

// 增加额外生命
export const addExtraLife = function (type = 0) {
  return axios.post(api.addExtraLife, {
    app_id: utils.app_id,
    client_id: utils.clientId,
    tp: type
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
  return axios.post(api.getPhoneNationCode, {
  }, {
    baseURL: accountHost[env]
  })
}

// 使用复活卡
export const useRecoveryCard = function (id, index, type = 1) {
  return axios.get(api.useRecoveryCard, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId,
      race_id: utils.raceId,
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

// 余额记录

export const cashRecord = function (pageNo) {
  return axios.post(api.cashRecord, {
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
// 标记删除提现记录
export const clearRecord = function (clearType) {
  return axios.post(api.clearRecord, {
    clearType: clearType,
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 提交用户同意隐私协议

export const submitAgreePolicy = function () {
  return axios.post(api.submitAgreePolicy, {
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 查询用户是否同意协议

export const queryAgreePolicy = function () {
  return axios.get(api.queryAgreePolicy, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// 获取协议内容
export const getPolicyContent = function (filename) {
  return axios.get(`${publicUrl}/html/${filename}`, {
    baseURL: window.location.origin,
    withCredentials: false
  })
}

// 获取答案汇总
export const getAnswerSummary = function (index) {
  return axios.get(api.getAnswerSummary, {
    params: {
      i: utils.raceId,
      s: index
    },
    timeout: 5000,
    retry: 0
  })
}
// 邀请好友周排行
export const inviteWeeklyBoard = function () {
  return axios.get(api.inviteWeeklyBoard, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// 邀请好友总排行

export const inviteTotalBoard = function () {
  return axios.get(api.inviteTotalBoard, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// 我的邀请排行

export const myInviteBoard = function (offset, limit) {
  return axios.get(api.myInviteBoard, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId,
      offset: offset,
      limit: limit
    }
  })
}

// 生成分享Facebook好友链接

export const inviteLink = function () {
  return axios.post(api.inviteLink, {
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

// 验证邀请好友码

export const checkInviteCode = function (icode) {
  return axios.post(api.checkInviteCode, {
    app_id: utils.app_id,
    client_id: utils.clientId,
    icode: icode
  })
}

// 更新用户昵称

export const updateNickname = function (name) {
  return axios.post(api.updateNickname, {
    app_id: utils.app_id,
    nickname: name
  }, {
    baseURL: accountHost[env]
  })
}

// 上传头像

export const uploadAvatar = function (pic) {
  return axios.post(api.uploadAvatar, {
    app_id: utils.app_id,
    pic_type: 'hpic',
    pic: pic
  }, {
    baseURL: accountHost[env]
  })
}

// 刷新个人信息缓存
export const updateAvatarCache = function () {
  return axios.get(api.updateAvatarCache, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}

// 取消提醒
export const cancelReminder = function () {
  return axios.post(api.cancelReminder, {
    app_id: utils.app_id,
    client_id: utils.clientId
  })
}

export const doubelRewardList = function (offset, limit) {
  return axios.get(api.doubelRewardList, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId,
      offset,
      limit
    }
  })
}

// 获得宝箱id

export const getBounsId = function () {
  return axios.get(api.getBounsId, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}
// 获得宝箱中奖品
export const getBounsBox = function (id) {
  return axios.post(api.getBounsBox, {
    app_id: utils.app_id,
    client_id: utils.clientId,
    boxId: id
  })
}

// 我邀请的好友答题

export const myInviteData = function () {
  return axios.get(api.myInviteData, {
    params: {
      app_id: utils.app_id,
      client_id: utils.clientId
    }
  })
}
