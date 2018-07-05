/**
 * 游戏进行状态
 */
import utils from '../utils.js'
import { _UPDATE, _OPEN_DIALOG, QUESTION_UPDATE } from '../../../store/type.js'
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
    const {j: question, a: answer} = this.data
    // 如果已经下发题目
    if (question) {
      // 更新问题信息
      const options = question.jo || ['', '', '']
      const optionsMd5Map = utils.generateMd5Map(options)
      this.$store.commit(QUESTION_UPDATE, {
        id: question.ji || '',
        index: +question.js || 0,
        contents: question.jc || '',
        options,
        optionsMd5Map
      })
      this.$store.commit(QUESTION_UPDATE, {
        status: status.QUESTION_ANSWERING
      })
    }
    // 如果有答案直接进入答案页面
    if (answer) {
      const md5Map = this.$store.getters.optionsMd5Map
      this.$store.commit(QUESTION_UPDATE, {
        correctAnswer: md5Map[answer.ac] || '',
        result: utils.parseMd5(answer.as, md5Map) || {}
      })
      this.$store.commit(QUESTION_UPDATE, {
        status: status.QUESTION_END
      })
    }
    // 如果已经被淘汰，打开弹窗提示
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
    this.$store.commit(_UPDATE, {
      status: _PLAYING
    })
  }
}

export default playingState
