/* global BUILD_ENV */
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
  check: 'http://account.apusapps.com'
}

const imAppKey = {
  local: 'p5tvi9dsphpf4',
  dev: 'pvxdm17jp3vvr',
  test: 'pvxdm17jp3vvr',
  check: 'uwd1c0sxupww1',
  prod: 'uwd1c0sxupww1'
}
export const appKey = imAppKey[env]
export default axios.create({
  baseURL: host[env],
  withCredentials: env !== 'local',
  timeout: 10000
})
