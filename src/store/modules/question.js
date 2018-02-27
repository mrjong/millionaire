'use strict'

import * as type from '../type'
import * as status from '../../assets/js/status'
import utils from '../../assets/js/utils'
import im from '../../assets/js/im'
import { MESSAGE_QUESTION, MESSAGE_ANSWER } from '../../assets/js/listener-type'
import { submitAnswer } from '../../assets/js/api'

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
  restTime: 10000 // 剩余时间
}

const getters = {
  question_status: (state) => state.status,
  id: (state) => state.id,
  contents: (state) => state.contents,
  options: (state) => state.options,
  index: (state) => state.index,
  watchingMode: (state) => state.watchingMode,
  isAnswered: (state) => state.isAnswered,
  isCorrect: (state) => state.isCorrect,
  correctAnswer: (state) => state.correctAnswer,
  userAnswer: (state) => state.userAnswer,
  question_result: (state) => state.result,
  time: (state) => state.time,
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
   * 初始化
   * @param {any} {dispatch}
   */
  [type.QUESTION_INIT] ({dispatch}) {
    dispatch(type.QUESTION_GET)
    dispatch(type.QUESTION_RECEIVE_ANSWER)
  },
  [type.QUESTION_GET] ({commit}) {
    im.addListener(MESSAGE_QUESTION, (message) => {
      // TODO: 消息内容填充至store
      commit(type.QUESTION_UPDATE, {
        status: status.QUESTION_ANSWERING
      })
    })
  },

  /**
   * 开始答题
   * @param {any} {commit, getters}
   */
  [type.QUESTION_START] ({commit, getters}) {
    const {time} = getters
    commit(type.QUESTION_UPDATE, {
      restTime: time
    })
    const timer = utils.Timer(1000, Date.now() + time)
    timer.addCompleteListener(({offset}) => {
      commit(type.QUESTION_UPDATE, {
        restTime: offset
      })
    })
    timer.addEndListener(() => {
      if (!getters.isAnswered) {
        commit(type.QUESTION_UPDATE, {
          watchingMode: true
        })
      }
      commit(type.QUESTION_UPDATE, {
        status: status.QUESTION_RECIEIVING_ANSWERING
      })
    })
    timer.start()
  },
  /**
   *  提交答案
   * @param {any} {getters}
   */
  [type.QUESTION_SUBMIT] ({getters}) {
    // TODO: 提交答案
    const {id, userAnswer} = getters
    submitAnswer(id, userAnswer).then(({data}) => {
      if (+data.result !== 1 || +data.code !== 0) {
        console.log('答案提交失败:', id, data.msg)
      }
    }, (err) => {
      console.log('答案提交错误:', err)
    })
  },
  [type.QUESTION_RECEIVE_ANSWER] ({commit, getters}, answer) {
    im.addListener(MESSAGE_ANSWER, (message) => {
      // TODO: 将答案填充至store， 判断答案是否正确，是否切换至观战模式
      commit(type.QUESTION_UPDATE, status.QUESTION_END)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
