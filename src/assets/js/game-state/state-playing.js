/**
 * 游戏进行状态
 */
import { _UPDATE, _OPEN_DIALOG, _RESET_HOSTMSGLIST } from '../../../store/type.js'
import { _PLAYING } from '../status'
import i18n from '../../../i18n/index.js'

const playingState = {
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
    // 如果已经被淘汰，打开弹窗提示
    console.log('kdjkdjfklsdjfaaaaaaaa' + this.$store.getters.watchingMode)
    if (this.$store.getters.watchingMode) {
      this.$store.dispatch(_OPEN_DIALOG, {
        htmlTitle: i18n.t('tip.lateJoin.title'),
        htmlText: i18n.t('tip.lateJoin.desp'),
        shouldSub: false,
        markType: 0,
        okBtnText: i18n.t('tip.lateJoin.btn')
      })
    }
  },
  /**
   * 运行状态
   */
  run () {
    this.update()
    this.$store.commit(_RESET_HOSTMSGLIST)
    this.$store.commit(_UPDATE, {
      status: _PLAYING
    })
  }
}

export default playingState
