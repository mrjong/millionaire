import { PROCESS_COUNT_DOWN } from '../status'
import countDownProcess from './count-down'
import answerProcess from './answer.js'
import questionMsgProcess from './question-hostMsg.js'
import questionProcess from './question.js'
import resultMsgProcess from './result-hostMsg.js'
import resultProcess from './result.js'
import utils from '../utils'

/**
 * 游戏进度
 */
const gameProcess = {
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
    // 从本地同步进度信息
    const questions = utils.storage.get('millionaire-qs') || []
    const beginHostMsgList = utils.storage.get('millionaire-rs') || []
    const resultHostMsgList = utils.storage.get('millionaire-cs') || []
    const cachedProcess = utils.storage.get('millionaire-process')
    this.update(cachedProcess)
    this.update({
      questions,
      beginHostMsgList,
      resultHostMsgList
    })
    countDownProcess.init(this.data, $store)
    answerProcess.init(this.data, $store)
    questionProcess.init(this.data, $store)
    questionMsgProcess.init(this.data, $store)
    resultMsgProcess.init(this.data, $store)
    resultProcess.init(this.data, $store)
    // 若离线模式已经开启，则直接开始运行
    if (this.data.offlineMode) {
      this.run()
    }
  },
  /**
   * 更新
   * @param {*} data
   */
  update (data) {
    this.data = Object.assign(this.data, data)
    countDownProcess.update(this.data)
    answerProcess.update(this.data)
    questionProcess.update(this.data)
    questionMsgProcess.update(this.data)
    resultMsgProcess.update(this.data)
    resultProcess.update(this.data)
  },
  /**
   * 运行进度
   */
  run () {
  }
}

export default gameProcess
