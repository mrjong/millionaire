'use strict'

import * as type from '../type'
import * as status from '../../assets/js/status'

const state = {
  status: status.QUESTION_ANSWERING, // 状态
  id: '', // ID
  contents: '', // 内容
  options: '', // 选项
  index: 0, // 序号
  watchingMode: true, // 是否观战模式
  isAnswered: false, // 是否作答
  isCorrect: false, // 作答是否正确
  correctAnswer: '', // 正确答案
  userAnswer: '', // 用户答案
  result: '', // 结果汇总
  time: 10000, // 作答时间, 默认10秒
  restTime: 10000, // 剩余时间,
  timer: null // 计时器
}

const getters = {
  status: (state) => state.status,
  contents: (state) => state.contents,
  options: (state) => state.options,
  index: (state) => state.index,
  watchingMode: (state) => state.watchingMode,
  isAnswered: (state) => state.isAnswered,
  isCorrect: (state) => state.isCorrect,
  correctAnswer: (state) => state.correctAnswer,
  userAnswer: (state) => state.userAnswer,
  result: (state) => state.result,
  restTime: (state) => state.restTime
}

const mutations = {
  /**
   * 更新问题信息
   * @param {any} state
   * @param {any} question
   */
  [type.QUESTION_UPDATE] (state, question) {
    state = Object.assign(state, question)
  }
}

const actions = {
  /**
   * 获取题目信息
   * @param {any} {commit, rootGetters}
   */
  [type.QUESTION_GET] ({commit, rootGetters}) {
    // 如果已经开始, 直接拉取题目
    if (rootGetters.status === status._PLAYING) {
      // TODO: 后端拉取题目
    }
    // TODO: 添加监听器至IM, 接受题目
  },
  [type.QUESTION_START] ({commit}) {
    // TODO: 开始答题
  },
  [type.QUESTION_SUBMIT] ({commit}) {
    // TODO: 提交答案
  },
  [type.QUESTION_RECEIVE_ANSWER] ({commit}, answer) {
    // TODO: 接收答案
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
