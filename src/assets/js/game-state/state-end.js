/**
 * 游戏结束状态
 */
/* global RongIMClient */
import { _UPDATE, _INIT } from '../../../store/type.js'
import { _END } from '../status'
import utils from '../utils.js'
import gameProcess from '../game-process/index.js'

const awaitState = {
  data: {},
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
    // 清楚本地存储的比赛信息
    gameProcess.stop()
    utils.storage.remove('millionaire-process')
  },
  /**
   * 运行状态
   */
  run () {
    this.update()
    this.$store.commit(_UPDATE, {
      status: _END
    })
    this.$store.dispatch(_INIT)
    RongIMClient.getInstance().disconnect()
  }
}

export default awaitState
