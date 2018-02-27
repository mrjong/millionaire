import axios from 'axios'
const env = 'test'
const host = {
  local: '',
  test: '',
  prod: ''
}
export default axios.create({
  baseURL: host[env]
})
