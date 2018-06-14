import { PROCESS_RESULT_HOSTMSG } from '../status'
import { MESSAGE_HOST } from '../listener-type'
import im from '../im'
import utils from '../utils'

/**
 * 游戏进度-结束串词
 */
const resultMsgProcess = {
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
      currentState: PROCESS_RESULT_HOSTMSG,
      offlineMode: false
    })
    const {validTime, resultHostMsgList = [], hostMsgInterval = 4000} = this.data
    if (validTime <= 0) {
      this.update({
        validTime: hostMsgInterval * resultHostMsgList.length
      })
    }
    im.emitListener(MESSAGE_HOST, {
      content: {
        content: JSON.stringify(resultHostMsgList)
      }
    }, hostMsgInterval)
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
      utils.storage.set('millionaire-process', this.data, Date.now() + 180000)
      cb && cb()
    })
    this.timer.addEndListener(() => {
      this.update({
        validTime: 0
      })
      utils.storage.set('millionaire-process', this.data, Date.now() + 180000)
    })
    this.timer.start()
  },
  /**
   * 进入下一进度
   */
  next () {
  },
  /**
   * 停止
   */
  stop () {
    this.timer && this.timer.stop()
  }
}

export default resultMsgProcess
