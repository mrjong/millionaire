import utils from '../utils'
import { PROCESS_COUNT_DOWN, _AWAIT, _READY } from '../status'
import { _UPDATE } from '../../../store/type'
import { MESSAGE_HOST } from '../listener-type'
import im from '../im'
import questionProcess from './question'
import i18n from '../../../i18n'
/**
 * 游戏进度-开场串词
 */
const countDownProcess = {
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
  run () {
    this.update({
      currentState: PROCESS_COUNT_DOWN,
      validTime: this.$store.getters.startTimeOffset * 1000 + this.data.firstQuestionInterval || 30000
    })
    // 开启心跳
    this.heartbeat(() => {
      if (this.$store.getters.startTimeOffset <= 1) {
        this.$store.commit(_UPDATE, {
          startTimeOffset: 0
        })
        // 倒计时结束后 比赛未开始展示串词
        if (this.$store.getters.status === _AWAIT || this.$store.getters.status === _READY) {
          im.emitListener(MESSAGE_HOST, {
            content: {
              content: JSON.stringify(i18n.t('stringWords'))
            }
          })
        }
      } else {
        this.$store.commit(_UPDATE, {
          startTimeOffset: this.$store.getters.startTimeOffset - 1
        })
      }
    }, 1000)
  },
  /**
   * 心跳
   */
  heartbeat (cb, heartBeatInterval) {
    const {validTime} = this.data
    const interval = heartBeatInterval || this.data.heartBeatInterval || 1000
    this.stop()
    this.timer = utils.Timer(interval, validTime)
    this.timer.addCompleteListener(({offset}) => {
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
    questionProcess.run({
      currentIndex: 1,
      validTime: 0
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

export default countDownProcess
