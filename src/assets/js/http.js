/* global BUILD_ENV VERSION */
// BUILD_ENV webpack define
import axios from 'axios'
export const env = BUILD_ENV || 'prod'
export const host = {
  local: 'https://mock.apuscn.com/mock/30/millionaire',
  dev: 'http://dev-millionaire-api.apuscn.com',
  test: 'http://test-millionaire-api.apuscn.com',
  check: 'http://check-millionaire-api.apusapps.com',
  prod: 'http://millionaire-api.apusapps.com'
}

export const accountHost = {
  local: 'http://test-accounts.apuscn.com',
  dev: 'http://test-accounts.apuscn.com',
  test: 'http://test-account.apuscn.com',
  check: 'http://account.apusapps.com',
  prod: 'http://account.apusapps.com'
}

export const reportHost = {
  local: 'https://goo.gl/forms/Raj3BeNmBjvuI5Ng2',
  dev: 'https://goo.gl/forms/Raj3BeNmBjvuI5Ng2',
  test: 'https://goo.gl/forms/Raj3BeNmBjvuI5Ng2',
  check: 'https://goo.gl/forms/cJWcOjqyVW2Pu2GA2',
  prod: 'https://goo.gl/forms/cJWcOjqyVW2Pu2GA2'
}

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
  config.params = {...params, timestamp: Date.now()}
  config.data = {...data, timestamp: Date.now()}
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
