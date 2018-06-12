import { PROCESS_COUNT_DOWN } from '../status.js'

/**
 * 游戏进度-开场串词
 */
const countDownProcess = {
  data: {
    currentState: PROCESS_COUNT_DOWN, // 当前进度
    currentIndex: 1, // 当前题目序号
    beginHostMsgList: [], // 开场串词
    questions: [], // 题目
    resultHostMsgList: [], // 结束串词
    valideTime: 0, // 有效时间
    offlineMode: false // 是否开启离线模式
  },
  $store: null,
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
  }
}

export default countDownProcess
