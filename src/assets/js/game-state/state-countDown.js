/**
 * 游戏倒计时状态
 */
import im from '../im.js'
import { MESSAGE_HOST } from '../listener-type'
import { _UPDATE, _SYNC_TIME } from '../../../store/type.js'
import { _READY, _AWAIT } from '../status'
import utils from '../utils.js'

const countDownState = {
  data: {},
  countDownTimer: null,
  $store: null,
  /**
   * 初始化
   * @param {*} data
   * @param {*} $store
   */
  init (data, $store) {
    this.data = data
    this.$store = $store
  },
  /**
   * 更新信息
   */
  update () {
    clearInterval(this.countDownTimer)
    this.countDownTimer = setInterval(() => {
      if (this.$store.getters.startTimeOffset <= 1) {
        clearInterval(this.countDownTimer)
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
   * 运行状态
   */
  run () {
    const beginHostMsgList = utils.storage.get('millionaire-rs')
    this.update()
    // 播放开场串词
    im.emitListener(MESSAGE_HOST, {
      content: {
        content: JSON.stringify(beginHostMsgList || [])
      }
    })
    this.$store.commit(_UPDATE, {
      status: _READY
    })
    // 开始同步时间
    this.$store.dispatch(_SYNC_TIME)
  }
}

export default countDownState
