/**
 * 游戏倒计时状态
 */
import im from '../im.js'
import { MESSAGE_HOST } from '../listener-type'
import { _UPDATE, _SYNC_TIME } from '../../../store/type.js'
import { _READY } from '../status'
import utils from '../utils.js'
import countDownProcess from '../game-process/count-down.js'

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
  },
  /**
   * 运行状态
   */
  run () {
    utils.storage.remove('millionaire-uncommittedAnswers') // 删除未提交的答案信息
    const beginHostMsgList = utils.storage.get('millionaire-rs')
    this.update()
    countDownProcess.run()
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
