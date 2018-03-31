'use strict'

import * as type from '../type'
import * as status from '../../assets/js/status'
import utils from '../../assets/js/utils'
import im from '../../assets/js/im'
import { MESSAGE_QUESTION, MESSAGE_ANSWER } from '../../assets/js/listener-type'
import { submitAnswer, log } from '../../assets/js/api'

const state = {
  status: status.QUESTION_AWAIT, // 状态
  id: '', // ID
  contents: '', // 内容
  options: [], // 选项
  optionsMd5Map: {},
  index: 0, // 序号
  watchingMode: false, // 是否观战模式
  isAnswered: false, // 是否作答
  isCorrect: false, // 作答是否正确
  correctAnswer: '', // 正确答案
  userAnswer: '', // 用户答案
  result: {}, // 结果汇总
  time: 10, // 作答时间, 默认10秒
  restTime: 0, // 剩余时间
  isWon: false // 是否展示you won
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
  isWon: (state) => state.isWon
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
        const {ji: id = '', js: index = 1, jc: contents = '', jo: options = []} = question
        utils.statistic('QUESTION', 6, {
          flag_s: `${id}`,
          text_s: `${index}`,
          action_s: `${rootGetters.userInfo.userName}`,
          type_s: `${getters.watchingMode ? 1 : 0}`
        })
        log({
          name: 'question',
          id,
          index,
          userName: rootGetters.userInfo.userName,
          watchingMode: getters.watchingMode
        })
        options.sort(() => {
          return Math.random() > 0.5 ? 1 : -1
        })
        commit(type.QUESTION_UPDATE, {
          id, index, contents, options, optionsMd5Map: utils.generateMd5Map(options)
        })
        dispatch(type.QUESTION_START)
      }
    })
  },

  /**
   * 开始答题
   * @param {any} {commit, getters}
   */
  [type.QUESTION_START] ({commit, getters, rootGetters}) {
    const {time} = getters
    commit(type.QUESTION_UPDATE, {
      restTime: time
    })
    const timer = utils.Timer(1000, time * 1000)
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
      if (!getters.isAnswered) {
        commit(type.QUESTION_UPDATE, {
          watchingMode: true
        })
        utils.statistic('NOT_ANSWER', 6, {
          action_s: rootGetters.userInfo.userName,
          text_s: getters.index
        })
      }
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
        if (+data.result === 0) {
          if (+data.code === 1005) {
            reject('Time is out, you can view only.')
          } else {
            reject('Sorry, you fail to submit. The internet is unstable, you can view only.')
          }
          commit(type.QUESTION_UPDATE, {
            watchingMode: true
          })
          console.log('答案提交失败:', id, data.msg)
        } else {
          resolve()
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
      const md5Map = getters.optionsMd5Map
      const answerStr = (message.content && message.content.answer) || ''
      const resultStr = (message.content && message.content.summary) || ''
      if (answerStr && resultStr) {
        const answer = JSON.parse(answerStr)
        const result = JSON.parse(resultStr)
        const {i: id, a: correctAnswer} = answer

        // 判断答案是否正确
        const isCorrect = md5Map[correctAnswer] === getters.userAnswer

        utils.statistic('ANSWER', 6, {
          flag_s: `${id}`,
          action_s: `${rootGetters.userInfo.userName}`,
          type_s: `${isCorrect ? 1 : 0}`
        })

        // 根据答案是否正确播放提示音
        if (isCorrect && !getters.watchingMode) {
          utils.playSound('succeed')
        } else if (!isCorrect && !getters.watchingMode) {
          utils.playSound('failed')
          dispatch(type._OPEN_DIALOG, {
            htmlTitle: 'You\'ve been eliminated. ',
            htmlText: 'You can no longer play for the cash prize. But you can watch and chat.',
            shouldSub: false,
            markType: 0,
            okBtnText: 'Continue'
          })
        }

        // 若没有答题，弹窗提示
        if (!getters.watchingMode && !getters.isAnswered) {
          dispatch(type._OPEN_DIALOG, {
            htmlTitle: 'You\'ve been eliminated. ',
            htmlText: 'You can no longer play for the cash prize. But you can watch and chat.',
            shouldSub: false,
            markType: 0,
            okBtnText: 'Continue'
          })
        }
        // 更新观战模式
        const watchingMode = getters.watchingMode ? true : !isCorrect
        commit(type.QUESTION_UPDATE, {
          id, correctAnswer: md5Map[correctAnswer], result: utils.parseMd5(result, md5Map), watchingMode, restTime: 0
        })
        commit(type.QUESTION_UPDATE, {
          status: status.QUESTION_END
        })
        // 服务端上报日志
        log({
          name: 'answer',
          id,
          isCorrect,
          userName: rootGetters.userInfo.userName
        })
      }
    })
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
