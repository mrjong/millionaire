import axios from 'axios'
const env = 'prod'
const host = {
  local: 'https://mock.apuscn.com/mock/30/millionaire',
  dev: 'http://dev-millionaire-api.apuscn.com',
  test: 'http://test-millionaire-api.apuscn.com',
  prod: 'http://millionaire-api.apusapps.com'
}
const imAppKey = {
  local: 'p5tvi9dsphpf4',
  dev: 'pvxdm17jp3vvr',
  test: 'pvxdm17jp3vvr',
  prod: 'uwd1c0sxupww1'
}
export const appKey = imAppKey[env]
export default axios.create({
  baseURL: host[env],
  withCredentials: true,
  timeout: 10000
})
