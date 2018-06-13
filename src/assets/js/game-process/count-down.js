import utils from '../utils'
import { PROCESS_COUNT_DOWN, _AWAIT, _READY } from '../status'
import { _UPDATE } from '../../../store/type'
import { MESSAGE_HOST } from '../listener-type'
import im from '../im'
import questionProcess from './question'
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
      validTime: this.$store.getters.startTimeOffset * 1000
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
              content: JSON.stringify([`Welcome to 'Go! Millionaire' game! Answer questions and get them all right to win up to  ₹1,000,000 every day!`, `You just need to tap on the answer and keep them right! If answer incorrectly, you can use extra life. Now, get it ready. GO!`])
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
    const {validTime, firstQuestionInterval} = this.data
    const interval = heartBeatInterval || this.data.heartBeatInterval || 1000
    this.timer && this.timer.stop()
    this.timer = utils.Timer(interval, validTime + firstQuestionInterval)
    this.timer.addCompleteListener(() => {
      this.update({
        validTime: this.data.validTime - interval
      })
      utils.storage.set('millionaire-process', this.data, Date.now() + 180000)
      cb && cb()
    })
    this.timer.addEndListener(() => {
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
  }
}

export default countDownProcess
