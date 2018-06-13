import { PROCESS_COUNT_DOWN, PROCESS_ANSWER, PROCESS_QUESTION, PROCESS_QUESTION_HOSTMSG, PROCESS_RESULT, PROCESS_RESULT_HOSTMSG } from '../status'
import countDownProcess from './count-down'
import answerProcess from './answer.js'
import questionMsgProcess from './question-hostMsg.js'
import questionProcess from './question.js'
import resultMsgProcess from './result-hostMsg.js'
import resultProcess from './result.js'
import utils from '../utils'

/**
 * 游戏进度
 */
const gameProcess = {
  data: {
    currentState: PROCESS_COUNT_DOWN, // 当前进度
    currentIndex: 1, // 当前题目序号
    beginHostMsgList: [], // 开场串词
    questions: [], // 题目
    resultHostMsgList: [], // 结束串词
    hostMsgInterval: 4000, // 串词展示时间
    firstQuestionInterval: 30000, // 第一题开始前等待时间
    questionShowTime: 13000, // 题目展示时间
    answerShowTime: 10000, // 答案展示时间
    validTime: 0, // 有效时间
    offlineMode: false, // 是否开启离线模式
    heartBeatInterval: 1000
  },
  $store: null,
  /**
   * 初始化
   * @param {*} data
   * @param {*} $store
   */
  init (data = {}, $store, initialState = PROCESS_COUNT_DOWN) {
    const {ri: gameInfo = {}} = data
    const {qs: questions = [], rs: beginHostMsgList = [], cs: resultHostMsgList = [], si: hostMsgInterval = 4000, tbf: firstQuestionInterval = 30000, tqs: questionShowTime = 13000, tas: answerShowTime = 10000} = gameInfo
    this.update({
      currentState: initialState,
      questions,
      beginHostMsgList,
      resultHostMsgList,
      hostMsgInterval,
      firstQuestionInterval,
      questionShowTime,
      answerShowTime
    })
    this.$store = $store
    // 从本地同步进度信息
    const cachedProcess = utils.storage.get('millionaire-process') || {}
    this.update(cachedProcess)
    countDownProcess.init(this.data, $store)
    answerProcess.init(this.data, $store)
    questionProcess.init(this.data, $store)
    questionMsgProcess.init(this.data, $store)
    resultMsgProcess.init(this.data, $store)
    resultProcess.init(this.data, $store)
    // 若离线模式已经开启，则直接开始运行
    if (this.data.offlineMode) {
      this.run()
    }
  },
  /**
   * 更新
   * @param {*} data
   */
  update (data) {
    this.data = Object.assign(this.data, data)
    countDownProcess.update(this.data)
    answerProcess.update(this.data)
    questionProcess.update(this.data)
    questionMsgProcess.update(this.data)
    resultMsgProcess.update(this.data)
    resultProcess.update(this.data)
  },
  /**
   * 运行进度
   */
  run () {
    switch (this.data.currentState) {
      case PROCESS_COUNT_DOWN: {
        countDownProcess.run()
        break
      }
      case PROCESS_ANSWER: {
        answerProcess.run()
        break
      }
      case PROCESS_QUESTION: {
        questionProcess.run()
        break
      }
      case PROCESS_QUESTION_HOSTMSG: {
        questionMsgProcess.run()
        break
      }
      case PROCESS_RESULT: {
        resultProcess.run()
        break
      }
      case PROCESS_RESULT_HOSTMSG: {
        resultMsgProcess.run()
        break
      }
    }
  }
}

export default gameProcess
