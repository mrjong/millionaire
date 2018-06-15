import { PROCESS_QUESTION } from '../status'
import utils from '../utils'
import im from '../im'
import { MESSAGE_QUESTION } from '../listener-type'
import questionMsgProcess from './question-hostMsg'

/**
 * 游戏进度-题目
 */
const questionProcess = {
  data: {
  },
  $store: null,
  timer: null,
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
    this.update({
      ...data,
      currentState: PROCESS_QUESTION,
      answerSummary: null
    })
    const {validTime, questions = [], currentIndex = 1, questionShowTime = 13000} = this.data
    const currentQuestion = questions[currentIndex - 1] || {}
    if (validTime <= 0) {
      this.update({
        validTime: questionShowTime
      })
    }
    const restTime = parseInt(this.data.validTime / 1000)
    im.emitListener(MESSAGE_QUESTION, {
      content: {
        content: JSON.stringify({
          ...currentQuestion,
          restTime: restTime >= 10 ? 10 : restTime
        })
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
    this.stop()
    this.timer = utils.Timer(interval, validTime)
    this.timer.addCompleteListener(() => {
      this.update({
        validTime: this.data.validTime - interval
      })
      this.cacheProcessInfo()
      cb && cb()
    })
    this.timer.addEndListener(() => {
      const validTime = this.data.validTime - interval
      this.update({
        validTime: validTime > 0 ? validTime : 0
      })
      this.cacheProcessInfo()
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
    const {currentIndex = 1} = this.data
    questionMsgProcess.run({
      validTime: 0,
      currentIndex
    })
  },
  /**
   * 停止
   */
  stop () {
    this.timer && this.timer.stop()
  },
  /**
   * 缓存进度信息
   */
  cacheProcessInfo () {
    utils.storage.set('millionaire-process', {...this.data, watchingMode: this.$store.getters.watchingMode})
  }
}

export default questionProcess
