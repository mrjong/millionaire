/* global BUILD_ENV VERSION */
// BUILD_ENV webpack define
import axios from 'axios'
import i18n from '../../i18n'
export const env = BUILD_ENV || 'prod'
export const host = {
  local: 'https://mock.apuscn.com/mock/30/millionaire',
  dev: '//dev-millionaire-api.apuscn.com',
  test: '//test-millionaire-api.apuscn.com',
  check: '//check-millionaire-api.apusapps.com',
  prod: '//millionaire-api.apusapps.com'
}

// 账号系统域名
export const accountHost = {
  local: '//test-accounts.apuscn.com',
  dev: '//test-accounts.apuscn.com',
  test: '//test-account.apuscn.com',
  check: '//account.apusapps.com',
  prod: '//account.apusapps.com'
}

// 调查问卷访问链接
export const reportHost = {
  local: 'https://goo.gl/forms/Raj3BeNmBjvuI5Ng2',
  dev: 'https://goo.gl/forms/Raj3BeNmBjvuI5Ng2',
  test: 'https://goo.gl/forms/Raj3BeNmBjvuI5Ng2',
  check: 'https://goo.gl/forms/cJWcOjqyVW2Pu2GA2',
  prod: 'https://goo.gl/forms/cJWcOjqyVW2Pu2GA2'
}

// 静态资源图片访问域名
export const imageHost = {
  local: '//thumbor.apusapps.com/imageView/millionaire/images/',
  dev: '//thumbor.apusapps.com/imageView/millionaire/images/',
  test: '//thumbor.apusapps.com/imageView/millionaire/images/',
  check: '//thumbor.apusapps.com/imageView/millionaire/images/',
  prod: '//thumbor.apusapps.com/imageView/millionaire/images/'
}[env]

// im 连接AppKey
const imAppKey = {
  local: 'p5tvi9dsphpf4',
  dev: 'pvxdm17jp3vvr',
  test: 'pvxdm17jp3vvr',
  check: 'uwd1c0sxupww1',
  prod: 'uwd1c0sxupww1'
}
export const appKey = imAppKey[env]

const http = axios.create({
  baseURL: host[env],
  withCredentials: env !== 'local',
  timeout: 8000,
  params: {
    version: VERSION
  },
  data: {
    version: VERSION
  }
})

http.interceptors.request.use((config) => {
  const {params = {}, data = {}} = config
  config.params = {...params, timestamp: Date.now(), lang: i18n.locale}
  config.data = {...data, timestamp: Date.now(), lang: i18n.locale}
  if (config.baseURL === accountHost[env]) {
    // 如果是账号域名,请求数据类型转换为formData
    config.transformRequest = [function (data) {
      const formData = new FormData()
      for (let prop in data) {
        formData.append(prop, data[prop])
      }
      return formData
    }]
  }
  return config
})

http.defaults.retry = 2 // 重试次数
http.defaults.retryDelay = 500 // 重试延时

http.interceptors.response.use(undefined, (err) => {
  const config = err.config
  console.log('config', config)
  // 判断是否配置了重试
  if (!config || !config.retry) return Promise.reject(err)
  if (/\/cmp\/q/.test(config.url)) { // 如果是轮询接口，直接返回
    return Promise.reject(err)
  }
  // 如果游戏状态为初始状态 取消重试
  if (window.gameState === 1 || !window.gameState) {
    return Promise.reject(err)
  }

  // 设置重置次数，默认为0
  config.__retryCount = config.__retryCount || 0

  // 判断是否超过了重试次数
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err)
  }

  // 重试次数自增
  config.__retryCount += 1

  // 延时处理
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })
  // 重新发起axios请求
  return backoff.then(() => {
    return http({
      ...config,
      data: JSON.parse(config.data || JSON.stringify({}))
    })
  })
})

export default http
