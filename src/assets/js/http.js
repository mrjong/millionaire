import axios from 'axios'
const env = 'test'
const host = {
  local: 'https://mock.apuscn.com/mock/30/millionaire',
  test: 'http://dev-millionaire-api.apuscn.com',
  prod: ''
}
export default axios.create({
  baseURL: host[env],
  withCredentials: true
})
