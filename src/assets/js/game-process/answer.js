import { PROCESS_ANSWER } from '../status'
import { MESSAGE_ANSWER } from '../listener-type'
import im from '../im'
import utils from '../utils'
import questionProcess from './question'
import resultMsgProcess from './result-hostMsg'

/**
 * 游戏进度-题目答案
 */
const answerProcess = {
  data: {
  },
  $store: null,
  /**
   * 初始化
   * @param {*} data
   * @param {*} $store
   */
  init (data, $store) {
    this.update(data)
    this.$store = $store
  },
  /**
   * 更新
   * @param {*} data
   */
  update (data) {
    this.data = Object.assign(this.data, data)
  },
  /**
   * 运行进度
   */
  run (data = {}) {
    this.update(...data, {
      currentState: PROCESS_ANSWER
    })
    const {validTime, questions = [], currentIndex = 1, answerShowTime = 10000} = this.data
    const currentQuestion = questions[currentIndex - 1] || {}
    const {ji: id = '', js: index = 1, jc: contents = '', jo: options = [], ja: correctAnswer} = currentQuestion
    if (validTime <= 0) {
      this.update({
        validTime: answerShowTime
      })
    }
    const question = {
      id,
      index,
      contents,
      options
    }
    const answer = {
      a: correctAnswer || ''
    }
    const summary = {}
    // TODO: 改为接口拉取结果
    const optionsMd5Map = this.$store.getters.optionsMd5Map
    for (let prop of optionsMd5Map) {
      summary[prop] = 0
    }
    im.emitListener(MESSAGE_ANSWER, {
      content: {
        answer: JSON.stringify(answer),
        summary: JSON.stringify(summary),
        question: JSON.stringify(question)
      }
    })
    this.heartbeat()
  },
  /**
   * 心跳
   */
  heartbeat (cb, heartBeatInterval) {
    const {validTime} = this.data
    const interval = heartBeatInterval || this.data.heartBeatInterval || 1000
    this.timer && this.timer.stop()
    this.timer = utils.Timer(interval, validTime)
    this.timer.addCompleteListener(() => {
      this.update({
        validTime: this.data.validTime - interval
      })
      utils.storage.set('millionaire-process', this.data, Date.now() + 180000)
      cb && cb()
    })
    this.timer.addEndListener(() => {
      this.update({
        validTime: 0
      })
      utils.storage.set('millionaire-process', this.data, Date.now() + 180000)
      // 离线模式开启，直接进入下一进度
      if (this.data.offlineMode) {
        this.next()
      }
    })
    this.timer.start()
  },
  /**
   * 进入下一进度
   */
  next () {
    const {questions = [], currentIndex} = this.data
    if (currentIndex < questions.length) {
      questionProcess.run({
        currentIndex: currentIndex + 1,
        validTime: 0
      })
    } else {
      resultMsgProcess.run({
        validTime: 0
      })
    }
  }
}

export default answerProcess
