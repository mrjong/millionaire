import { PROCESS_RESULT } from '../status'
import { MESSAGE_RESULT } from '../listener-type'
import im from '../im'
import utils from '../utils'
import { _INIT } from '../../../store/type'

/**
 * 游戏进度-游戏结果
 */
const resultProcess = {
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
    this.update(...data, {
      currentState: PROCESS_RESULT
    })
    const {result = {}} = this.data
    im.emitListener(MESSAGE_RESULT, {
      content: {
        summary: JSON.stringify(result)
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
      this.$store.dispatch(_INIT)
    })
    this.timer.start()
  },
  /**
   * 进入下一进度
   */
  next () {
    this.$store.dispatch(_INIT)
  },
  /**
   * 停止
   */
  stop () {
    this.timer && this.timer.stop()
    this.update({
      validTime: 0
    })
  }
}

export default resultProcess
