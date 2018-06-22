import {PROCESS_QUESTION_HOSTMSG} from '../status'
import utils from '../utils'
import im from '../im'
import { MESSAGE_HOST } from '../listener-type'
import answerProcess from './answer'
/**
 * 游戏进度-题目串词
 */
const questionMsgProcess = {
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
      currentState: PROCESS_QUESTION_HOSTMSG
    })
    const {validTime, questions = [], currentIndex = 1} = this.data
    const currentQuestion = questions[currentIndex - 1] || {}
    const {si: intervalTime = 5000, jd: hostMsgList = []} = currentQuestion
    if (validTime <= 0) {
      this.update({
        validTime: intervalTime * hostMsgList.length
      })
    }
    im.emitListener(MESSAGE_HOST, {
      content: {
        content: JSON.stringify(hostMsgList)
      }
    }, intervalTime)
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
      const validTime = this.data.validTime - interval
      this.update({
        validTime: validTime > 0 ? validTime : 0
      })
      this.cacheProcessInfo()
      cb && cb()
    })
    this.timer.addEndListener(() => {
      this.update({
        validTime: 0
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
    answerProcess.run({
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

export default questionMsgProcess
