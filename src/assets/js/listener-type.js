/* global RongIMLib */

/* 监听器类型 */

// 消息类
export const MESSAGE_NORMAL = 'TextMessage' // 普通文本消息 聊天消息
export const MESSAGE_HOST = 'MESSAGE_HOST' // 主持人消息
export const MESSAGE_AMOUNT = 'MESSAGE_AMOUNT' // 在线人数消息
export const MESSAGE_TIME = 'MESSAGE_TIME' // 同步时间
export const MESSAGE_QUESTION = 'MESSAGE_QUESTION' // 推送题目
export const MESSAGE_ANSWER = 'MESSAGE_ANSWER' // 推送题目答案及汇总
export const MESSAGE_RESULT = 'MESSAGE_RESULT' // 推送游戏结果
export const MESSAGE_SEND_SUCCESS = 'MESSAGE_SEND_SUCCESS' // 消息发送成功
export const MESSAGE_SEND_FAIL = 'MESSAGE_SEND_FAIL' // 消息发送失败

// 连接状态类
export const CONNECTED = RongIMLib.ConnectionStatus.CONNECTED
export const CONNECTED_ERROR = 'CONNECTED_ERROR'
export const CONNECTING = RongIMLib.ConnectionStatus.CONNECTING
export const CONNECTED_TIMEOUT = 'CONNECTED_TIMEOUT'
export const DISCONNECTED = RongIMLib.ConnectionStatus.DISCONNECTED
export const KICKED_OFFLINE_BY_OTHER_CLIENT = RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT // 其他设备登陆
export const DOMAIN_INCORRECT = RongIMLib.ConnectionStatus.DOMAIN_INCORRECT // 域名不正确
export const NETWORK_UNAVAILABLE = RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE // 网络错误

// 聊天室相关
export const CHATROOM_JOIN_SUCCESS = 'CHATROOM_JOIN_SUCCESS' // 加入聊天室成功
export const CHATROOM_JOIN_FAIL = 'CHATROOM_JOIN_FAIL' // 加入聊天室失败
