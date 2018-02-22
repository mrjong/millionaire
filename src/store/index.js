import Vue from 'vue'
import Vuex from 'vuex'
import example from './modules/example'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    example
  },
  strict: debug // 开启严格模式，在mutations外修改state的数据会报错
})
