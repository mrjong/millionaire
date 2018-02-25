/**
 * 当前游戏状态
 */
export const _AWAIT = 1 // 距离开始时间大于准备时间;
export const _READY = 2 // 距离开始时间小于等于准备时间
export const _PLAYING = 3 // 已经开始
export const _END = 4 // 结束 正在显示结果

/**
 * 当前问题状态
 */
export const QUESTION_ANSWERING = 5 // 正在作答
export const QUESTION_RECIEIVING_ANSWERING = 5 // 正在接收结果
export const QUESTION_END = 6 // 答题结束正在公布答案
export const QUESTION_AWAIT = 7 // 等待中 主持人正在说话
