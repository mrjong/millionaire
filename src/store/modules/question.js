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
  watchingMode: false, // 是否观战模式
  isAnswered: false, // 是否作答
  isCorrect: false, // 作答是否正确
  correctAnswer: '', // 正确答案
  userAnswer: '', // 用户答案
  result: {}, // 结果汇总
  time: 10, // 作答时间, 默认10秒
  restTime: 10 // 剩余时间
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
  /**
   * 获取题目
   * @param {any} {commit, dispatch}
   */
  [type.QUESTION_GET] ({commit, dispatch}) {
    im.addListener(MESSAGE_QUESTION, (message) => {
      const content = (message.content && message.content.content) || ''
      if (content) {
        const question = JSON.parse(content)
        const {ji: id = '', js: index = 1, jc: contents = '', jo: options = []} = question
        commit(type.QUESTION_UPDATE, {
          id, index, contents, options
        })
        dispatch(type.QUESTION_START)
      }
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
    const timer = utils.Timer(1000, Date.now() + time * 1000)
    timer.addCompleteListener(({offset}) => {
      commit(type.QUESTION_UPDATE, {
        restTime: Math.round(offset / 1000)
      })
    })
    // 计时结束
    timer.addEndListener(() => {
      commit(type.QUESTION_UPDATE, {
        restTime: 0
      })
      if (!getters.isAnswered) {
        commit(type.QUESTION_UPDATE, {
          watchingMode: true
        })
      }
    })
    // 答题开始
    timer.start()
    commit(type.QUESTION_UPDATE, {
      status: status.QUESTION_ANSWERING
    })
  },
  /**
   *  提交答案
   * @param {any} {getters}
   */
  [type.QUESTION_SUBMIT] ({getters}) {
    const {id, userAnswer, index} = getters
    submitAnswer(id, userAnswer, index).then(({data}) => {
      if (+data.result !== 1 || +data.code !== 0) {
        console.log('答案提交失败:', id, data.msg)
      }
    }, (err) => {
      console.log('答案提交错误:', err)
    })
  },
  /**
   * 接收题目答案
   * @param {any} {commit, getters}
   * @param {any} answer
   */
  [type.QUESTION_RECEIVE_ANSWER] ({commit, getters}, answer) {
    im.addListener(MESSAGE_ANSWER, (message) => {
      const answerStr = (message.content && message.content.answer) || ''
      const resultStr = (message.content && message.content.summary) || ''
      if (answerStr && resultStr) {
        const answer = JSON.parse(answerStr)
        const result = JSON.parse(resultStr)
        const {i: id, a: correctAnswer} = answer
        // 判断答案是否正确
        const watchingMode = getters.watchingMode ? true : !(correctAnswer === getters.userAnswer)
        commit(type.QUESTION_UPDATE, {
          id, correctAnswer, result, watchingMode
        })
        commit(type.QUESTION_UPDATE, {
          status: status.QUESTION_END
        })
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
