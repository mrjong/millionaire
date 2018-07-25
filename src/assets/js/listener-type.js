/* global */

/* 监听器类型 */

// 消息类
export const MESSAGE_NORMAL = 'TextMessage' // 普通文本消息 聊天消息
export const MESSAGE_HOST = 'HostMessage' // 主持人消息
export const MESSAGE_AMOUNT = 'PeopleMessage' // 在线人数消息
export const MESSAGE_QUESTION = 'QuestionMessage' // 推送题目
export const MESSAGE_ANSWER = 'AnswerMessage' // 推送题目答案及汇总
export const MESSAGE_RESULT = 'SummaryMessage' // 推送游戏结果
export const MESSAGE_END = 'GameEndMessage' // 游戏结束
export const MESSAGE_SEND_SUCCESS = 'MESSAGE_SEND_SUCCESS' // 消息发送成功
export const MESSAGE_SEND_FAIL = 'MESSAGE_SEND_FAIL' // 消息发送失败
export const MESSAGE_EXTRA_LIFE = 'ResurrectionMessage' // 复活卡相关信息

// 连接状态类
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS'
export const CONNECTED_ERROR = 'CONNECTED_ERROR'
export const INVALID_TOKEN = 'INVALID_TOKEN' // token 无效
export const CONNECTED_TIMEOUT = 'CONNECTED_TIMEOUT'
export const DISCONNECTED = 'DISCONNECTED'
export const KICKED_OFFLINE_BY_OTHER_CLIENT = 'KICKED_OFFLINE_BY_OTHER_CLIENT' // 其他设备登陆
export const DOMAIN_INCORRECT = 'DOMAIN_INCORRECT' // 域名不正确
export const NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE' // 网络错误
export const GET_SERVER_ADDRESS_SUCCESS = 'GET_SERVER_ADDRESS_SUCCESS' // 获取IM服务器地址成功

// 聊天室相关
export const CHATROOM_JOIN_SUCCESS = 'CHATROOM_JOIN_SUCCESS' // 加入聊天室成功
export const CHATROOM_JOIN_FAIL = 'CHATROOM_JOIN_FAIL' // 加入聊天室失败
