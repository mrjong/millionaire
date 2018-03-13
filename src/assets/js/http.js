import axios from 'axios'
const env = 'local'
const host = {
  local: 'https://mock.apuscn.com/mock/30/millionaire',
  dev: 'http://dev-millionaire-api.apuscn.com',
  test: 'http://test-millionaire-api.apuscn.com',
  prod: ''
}
export default axios.create({
  baseURL: host[env],
  // withCredentials: true
})
