'use strict'

import * as type from '../type'
import * as status from '../../assets/js/status'
import utils from '../../assets/js/utils'
import im from '../../assets/js/im'
import { MESSAGE_QUESTION, MESSAGE_ANSWER } from '../../assets/js/listener-type'
import { submitAnswer } from '../../assets/js/api'

const state = {
  status: status.QUESTION_AWAIT, // 状态
  id: '', // ID
  contents: '', // 内容
  options: [], // 选项
  optionsMd5Map: {},
  index: 1, // 序号
  watchingMode: false, // 是否观战模式
  isAnswered: false, // 是否作答
  isCorrect: true, // 作答是否正确
  correctAnswer: '', // 正确答案
  userAnswer: '', // 用户答案
  result: {}, // 结果汇总
  time: 10, // 作答时间, 默认10秒
  restTime: 0, // 剩余时间
  isWon: false, // 是否展示you wonThe resurrection of card
  maxRecoveryCount: 0, // 最大复活次数
  count: 12, // 问题数量
  isCanRecoveryLastQuestion: false // 最后一题是否可以复活
}

const getters = {
  question_status: (state) => state.status,
  id: (state) => state.id,
  contents: (state) => state.contents,
  options: (state) => state.options,
  optionsMd5Map: (state) => state.optionsMd5Map,
  index: (state) => state.index,
  watchingMode: (state) => state.watchingMode,
  isAnswered: (state) => state.isAnswered,
  isCorrect: (state) => state.isCorrect,
  correctAnswer: (state) => state.correctAnswer,
  userAnswer: (state) => state.userAnswer,
  question_result: (state) => state.result,
  time: (state) => state.time,
  restTime: (state) => state.restTime,
  isWon: (state) => state.isWon,
  maxRecoveryCount: (state) => state.maxRecoveryCount,
  questionCount: (state) => state.count,
  isCanRecoveryLastQuestion: (state) => state.isCanRecoveryLastQuestion
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
  [type.QUESTION_GET] ({commit, dispatch, rootGetters, getters}) {
    im.addListener(MESSAGE_QUESTION, (message) => {
      const content = (message.content && message.content.content) || ''
      if (content) {
        const question = JSON.parse(content)
        const {ji: id = '', js: index = 1, jc: contents = '', jo: options = [], restTime} = question
        utils.statistic('QUESTION', 0, {
          flag_s: `${index}`,
          text_s: `${rootGetters.isOnline ? 1 : 0}`,
          style_s: `${getters.watchingMode ? 1 : 0}`,
          type_s: utils.pageType
        })
        commit(type.QUESTION_UPDATE, {
          id, index, contents, options, optionsMd5Map: utils.generateMd5Map(options), restTime, isAnswered: false, userAnswer: ''
        })
        dispatch(type.QUESTION_SYNC_LOCAL_ANSWER)
        dispatch(type.QUESTION_START)
      }
    })
  },

  /**
   * 开始答题
   * @param {any} {commit, getters}
   */
  [type.QUESTION_START] ({commit, getters, rootGetters, dispatch}) {
    const timer = utils.Timer(1000, getters.restTime * 1000)
    timer.addCompleteListener(() => {
      if (getters.restTime > 0) {
        commit(type.QUESTION_UPDATE, {
          restTime: getters.restTime - 1
        })
      }
    })
    timer.addEndListener(() => {
      commit(type.QUESTION_UPDATE, {
        restTime: 0
      })
    })
    timer.start()
    // 答题开始
    commit(type.QUESTION_UPDATE, {
      status: status.QUESTION_ANSWERING
    })
    // 切换主状态至游戏开始
    commit(type._UPDATE, {
      status: status._PLAYING
    })

    utils.playSound('go')
  },
  /**
   *  提交答案
   * @param {any} {getters}
   */
  [type.QUESTION_SUBMIT] ({commit, getters}) {
    const {id, userAnswer, index} = getters
    return new Promise((resolve, reject) => {
      /* eslint-disable prefer-promise-reject-errors */
      submitAnswer(id, userAnswer, index).then(({data}) => {
        if (+data.result === 1) {
          switch (+data.code) {
            case 0: {
              break
            }
          }
          resolve()
        } else {
          const index = +data.data
          switch (+data.code) {
            case 1005: {
              reject('Time is out, you can view only.')
              break
            }
            case 1006:
            case 1007: {
              reject(`Oops，you have already failed on the ${utils.formatIndex(index)} question.`)
              break
            }
            default: {
              reject('Sorry, you fail to submit. The internet is unstable, you can view only.')
            }
          }
          commit(type.QUESTION_UPDATE, {
            watchingMode: true
          })
          console.log('答案提交失败:', id, data.msg)
        }
      }, (err) => {
        reject('Sorry, you fail to submit. The internet is unstable, you can view only.')
        commit(type.QUESTION_UPDATE, {
          watchingMode: true
        })
        console.log('答案提交错误:', err)
      }).catch((err) => {
        console.log('代码逻辑出错：' + err)
      })
    })
  },
  /**
   * 接收题目答案
   * @param {any} {commit, getters}
   * @param {any} answer
   */
  [type.QUESTION_RECEIVE_ANSWER] ({commit, getters, rootGetters, dispatch}, answer) {
    im.addListener(MESSAGE_ANSWER, (message) => {
      const answerStr = (message.content && message.content.answer) || ''
      const resultStr = (message.content && message.content.summary) || ''
      const questionStr = (message.content && message.content.question) || ''

      // 如果有题目信息，更新题目信息
      if (questionStr) {
        const question = JSON.parse(questionStr)
        commit(type.QUESTION_UPDATE, {
          ...question, optionsMd5Map: utils.generateMd5Map(question.options)
        })
        dispatch(type.QUESTION_SYNC_LOCAL_ANSWER)
      }

      const md5Map = getters.optionsMd5Map

      if (answerStr && resultStr) {
        const answer = JSON.parse(answerStr)
        const result = JSON.parse(resultStr)
        const {i: id, a: correctAnswer} = answer

        // 判断答案是否正确
        let isCorrect = md5Map[correctAnswer] === getters.userAnswer

        utils.statistic('ANSWER', 0, {
          flag_s: `${getters.index}`,
          text_s: `${getters.watchingMode ? 1 : 0}`,
          style_s: `${isCorrect ? 1 : 0}`,
          type_s: utils.pageType
        })

        commit(type.QUESTION_UPDATE, {
          id, correctAnswer: md5Map[correctAnswer], result: utils.parseMd5(result, md5Map), isCorrect, restTime: 0
        })
        commit(type.QUESTION_UPDATE, {
          status: status.QUESTION_END
        })
      }
    })
  },
  /**
   * 同步本地答案信息
   * @param {any} {commit, getters}
   */
  [type.QUESTION_SYNC_LOCAL_ANSWER] ({commit, getters}) {
    // 从本地获取用户作答情况
    const userAnswerInfo = utils.storage.get('millionaire-user-answer')
    if (userAnswerInfo) {
      const {id, index, isAnswered, userAnswer} = userAnswerInfo
      // 若本地存储的答案信息与当前题目一致，则同步答案信息
      if (id === getters.id && index === getters.index) {
        commit(type.QUESTION_UPDATE, {
          id,
          index,
          isAnswered,
          userAnswer
        })
      }
    }
  },
  [type.QUESTION_YOU_WON] ({commit}, question) {
    commit(type.QUESTION_UPDATE, question)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
