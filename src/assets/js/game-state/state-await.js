/**
 * 游戏等待状态
 */
import { _UPDATE, _POLL_INIT } from '../../../store/type.js'
import { _AWAIT } from '../status'
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
  },
  /**
   * 运行状态
   */
  run () {
    this.update()
    gameProcess.stop()
    utils.storage.remove('millionaire-process') // 删除缓存的比赛信息
    this.$store.dispatch(_POLL_INIT)
    this.$store.commit(_UPDATE, {
      status: _AWAIT
    })
  }
}

export default awaitState
