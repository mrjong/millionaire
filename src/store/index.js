import Vue from 'vue'
import Vuex from 'vuex'
import example from './modules/example'
import chatRoom from './modules/chatRoom'
import * as type from './type'
import {isOnline} from '../assets/js/utils'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {
    isOnline, // 是否登录
    startTime: Infinity, // 开始时间
    /**
      * await代表距离开始时间大于10分钟;
      * ready代表距离开始时间小于等于10分钟;
      * playing代表已经开始
    */
    status: 'await' // 当前状态：默认await
  },
  getters: {
    isOnline: (state) => state.isOnline,
    startTime: (state) => state.startTime,
    status: (state) => state.status
  },
  mutations: {
    /**
     * 更新登录状态
     * @param {any} state
     * @param {any} loginstate
     */
    [type._UPDATE_LOGINSTATE] (state, loginstate) {
      state.isOnline = !!loginstate
    },
    /**
     * 同步开始时间
     * @param {any} state
     * @param {any} startTime
     */
    [type._UPDATE_STARTTIME] (state, startTime) {
      state.startTime = startTime
    },
    /**
     * 更新当前状态
     * @param {any} state
     * @param {any} status
     */
    [type._UPDATE_STATUS] (state, status) {
      state.status = status
    }
  },
  actions: {
    /**
     * 初始化
     * @param {any} {commit}
     */
    [type._INIT] ({commit}) {
    // TODO: 初始化状态
    }
  },
  modules: {
    example,
    chatRoom
  },
  strict: debug // 开启严格模式，在mutations外修改state的数据会报错
})
