import { PROCESS_RESULT_HOSTMSG } from '../status'
import { MESSAGE_HOST } from '../listener-type'
import im from '../im'
import utils from '../utils'
import resultProcess from './result'

/**
 * 游戏进度-结束串词
 */
const resultMsgProcess = {
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
      currentState: PROCESS_RESULT_HOSTMSG
    })
    const {validTime, resultHostMsgList = [], hostMsgInterval = 4000} = this.data
    if (validTime <= 0) {
      this.update({
        validTime: hostMsgInterval ** resultHostMsgList.length
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
    resultProcess.run({
      validTime: 0
    })
  }
}

export default resultMsgProcess
