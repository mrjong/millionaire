import Vue from 'vue'
import Vuex from 'vuex'
import chatRoom from './modules/chatRoom'
import question from './modules/question'
import * as type from './type'
import utils from '../assets/js/utils'
import * as status from '../assets/js/status'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {
    isOnline: utils.isOnline, // 是否登录
    startTime: Infinity, // 开始时间 时间差
    readyTime: 600000, // 准备时间 默认10分钟
    status: status._AWAIT, // 当前状态
    onlineAmount: 0, // 在线人数
    result: null // 游戏结果
  },
  getters: {
    isOnline: (state) => state.isOnline,
    startTime: (state) => state.startTime,
    status: (state) => state.status,
    result: (state) => state.result
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
    },
    /**
     * 更新游戏结果
     * @param {any} state
     * @param {any} result
     */
    [type._UPDATE_RESULT] (state, result) {
      state.result = result
    },
    /**
     * 更新在线人数
     * @param {any} state
     * @param {any} amount
     */
    [type._UPDATE_AMOUNT] (state, amount) {
      state.onlineAmount = amount
    }
  },
  actions: {
    /**
     * 初始化
     * @param {any} {commit}
     */
    [type._INIT] ({commit}) {
    // TODO: 初始化状态
    },
    [type._UPDATE_AMOUNT] ({commit}) {
      // TODO: 更新在线人数
    },
    [type._RECEIVE_RESULT] ({commit}) {
      // TODO: 更新游戏结果
    }
  },
  modules: {
    chatRoom,
    question
  },
  strict: debug // 开启严格模式，在mutations外修改state的数据会报错
})
