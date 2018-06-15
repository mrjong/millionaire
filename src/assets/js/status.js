/**
 * 当前游戏状态
 */
export const _AWAIT = 1 // 距离开始时间大于准备时间;await
export const _READY = 2 // 距离开始时间小于等于准备时间;countdown
export const _PLAYING = 3 // 已经开始;main respondence
export const _END = 4 // 结束 正在显示结果; main result

/**
 * 当前问题状态
 */
export const QUESTION_ANSWERING = 5 // 正在作答
export const QUESTION_RECIEIVING_ANSWERING = 6 // 正在接收结果
export const QUESTION_END = 7 // 答题结束正在公布答案
export const QUESTION_AWAIT = 8 // 等待中 主持人正在说话

/**
 * 当前游戏进度状态
 */
export const PROCESS_COUNT_DOWN = 'PROCESS_COUNT_DOWN'
export const PROCESS_RESULT_HOSTMSG = 'PROCESS_RESULT_HOSTMSG'
export const PROCESS_QUESTION_HOSTMSG = 'PROCESS_QUESTION_HOSTMSG'
export const PROCESS_QUESTION = 'PROCESS_QUESTION'
export const PROCESS_ANSWER = 'PROCESS_ANSWER'
export const PROCESS_RESULT = 'PROCESS_RESULT'
