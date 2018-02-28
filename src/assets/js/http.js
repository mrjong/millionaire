import axios from 'axios'
const env = 'test'
const host = {
  local: '',
  test: 'https://mock.apuscn.com/mock/30/millionaire',
  prod: ''
}
export default axios.create({
  baseURL: host[env]
})
