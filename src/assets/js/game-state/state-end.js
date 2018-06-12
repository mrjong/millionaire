/**
 * 游戏结束状态
 */
/* global RongIMClient */
import { _UPDATE, _INIT } from '../../../store/type.js'
import { _END } from '../status'

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
    this.$store.commit(_UPDATE, {
      status: _END
    })
    this.$store.dispatch(_INIT)
    RongIMClient.getInstance().disconnect()
  }
}

export default awaitState
