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
    id: null,
    currentState: PROCESS_COUNT_DOWN, // 当前进度
    currentIndex: 1, // 当前题目序号
    beginHostMsgList: [], // 开场串词
    questions: [], // 题目
    resultHostMsgList: [], // 结束串词
    hostMsgInterval: 3000, // 串词展示时间
    firstQuestionInterval: 30000, // 第一题开始前等待时间
    questionShowTime: 15000, // 题目展示时间
    answerShowTime: 10000, // 答案展示时间
    validTime: 0, // 有效时间
    offlineMode: false, // 是否开启离线模式
    heartBeatInterval: 1000, // 心跳时间
    answerSummary: null, // 比赛结果汇总
    result: {}, // 比赛结果
    watchingMode: false, // 是否为观战模式
    isTaskStart: false // 是否立即退出
  },
  $store: null,
  /**
   * 初始化
   * @param {*} data
   * @param {*} $store
   */
  init (data = {}, $store, initialState = PROCESS_COUNT_DOWN) {
    const {ri: gameInfo = {}} = data
    const {i: id, qs: questions = [], rs: beginHostMsgList = [], cs: resultHostMsgList = [], si: hostMsgInterval = 3000, tbf: firstQuestionInterval = 30000, tqs: questionShowTime = 15000, tas: answerShowTime = 10000} = gameInfo
    this.update({
      id,
      currentState: initialState,
      currentIndex: 1,
      validTime: 0,
      offlineMode: false,
      heartBeatInterval: 1000,
      questions,
      beginHostMsgList,
      resultHostMsgList,
      hostMsgInterval: +hostMsgInterval > 0 ? +hostMsgInterval : 3000,
      firstQuestionInterval,
      questionShowTime: +questionShowTime > 0 ? +questionShowTime : 15000,
      answerShowTime: +answerShowTime > 0 ? +answerShowTime : 10000
    })
    this.$store = $store
    // 从本地同步进度信息
    const cachedProcess = utils.storage.get('millionaire-process')
    if (cachedProcess && cachedProcess.id === id) {
      this.update({...cachedProcess,
        ...{
          questions,
          beginHostMsgList,
          resultHostMsgList
        }})
    } else {
      this.stop()
      utils.storage.remove('millionaire-process')
    }
    countDownProcess.init(this.data, $store)
    answerProcess.init(this.data, $store)
    questionProcess.init(this.data, $store)
    questionMsgProcess.init(this.data, $store)
    resultMsgProcess.init(this.data, $store)
    resultProcess.init(this.data, $store)
    this.cacheProcessInfo()
    // 若离线模式已经开启，则直接开始运行
    if (this.data.offlineMode) {
      this.run()
    }
  },
  /**
   * 更新
   * @param {*} data
   */
  update (data = {}) {
    this.data = {...this.data, ...data}
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
    this.stop()
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
  },
  next () {
    this.stop()
    switch (this.data.currentState) {
      case PROCESS_COUNT_DOWN: {
        countDownProcess.next()
        break
      }
      case PROCESS_ANSWER: {
        answerProcess.next()
        break
      }
      case PROCESS_QUESTION: {
        questionProcess.next()
        break
      }
      case PROCESS_QUESTION_HOSTMSG: {
        questionMsgProcess.next()
        break
      }
      case PROCESS_RESULT: {
        resultProcess.next()
        break
      }
      case PROCESS_RESULT_HOSTMSG: {
        resultMsgProcess.next()
        break
      }
    }
  },
  /**
   * 停止
   */
  stop () {
    countDownProcess.stop()
    answerProcess.stop()
    questionProcess.stop()
    questionMsgProcess.stop()
    resultMsgProcess.stop()
    resultProcess.stop()
  },
  /**
   * 缓存进度信息
   */
  cacheProcessInfo () {
    utils.storage.set('millionaire-process', {...this.data, watchingMode: this.$store.getters.watchingMode})
  }
}

export default gameProcess
