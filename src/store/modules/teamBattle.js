'use strict'

import * as type from '../type'
import { queryTeamStatus } from '../../assets/js/api'

const state = {
  teamId: '', //  团队id
  teamList: [], // 团队列表
  isJoinTeam: false, // 是否已加入团队
  teamIsValid: false, // 团队是否有效
  teamStatus: 3, // 团队状态(默认已结束)
  teamTitle: '', // 团队标题
  teamIsWin: false, // 团队最终是否获胜
  isShowTeamModal: false // 是否显示弹窗
}

const getters = {
  teamId: (state) => state.teamId, // 团队id
  teamList: (state) => state.teamList, // 团队列表
  isJoinTeam: (state) => state.isJoinTeam, // 是否已加入团队
  teamIsValid: (state) => state.teamIsValid, // 团队是否有效
  teamStatus: (state) => state.teamStatus, // 团队状态
  teamTitle: (state) => state.teamTitle, // 团队标题
  teamIsWin: (state) => state.teamIsWin, // 团队最终是否获胜
  isShowTeamModal: (state) => state.isShowTeamModal // 是否显示弹窗
}

const mutations = {
  /**
   * 更新用户信息
   * @param {any} state
   * @param {any} teamInfo
   */
  [type.UPDATE_TEAM_INFO] (state, teamInfo) {
    state = Object.assign(state, teamInfo)
  }
}

const actions = {
  /**
   * 更新团队信息
   * @param {any} {commit, getters, state}
   */
  [type.UPDATE_TEAM_INFO] ({commit, getters}) {
    return new Promise((resolve, reject) => {
      queryTeamStatus().then(({data}) => {
        if (data.result === 1 && data.code === 0) {
          const result = (data && data.data) || {}
          if (result.success) {
            const {teamId, userVoList, status} = result
            let teamTitle = ''
            let teamList = userVoList.map((item, idx) => {
              let obj = {}
              obj.userId = item.ud
              obj.userAvatar = item.up
              obj.anwserStatus = item.uas
              obj.captain = item.tl
              if (item.tl === 1) {
                teamTitle = item.un
              }
              return obj
            })
            let isvalid
            if (teamList.length >= 3) {
              isvalid = true
            } else {
              isvalid = false
            }
            // 团队有一人答对就算通过(加倍)
            let teamIsWin = userVoList.some((item, idx) => {
              return item.uas > 0
            })
            // 更新团队id，更新团队列表，
            commit(type.UPDATE_TEAM_INFO, {
              teamId,
              teamStatus: status,
              isJoinTeam: true,
              teamList,
              teamTitle,
              teamIsWin,
              teamIsValid: isvalid
            })
            resolve(result)
          } else {
            // 没有团队(清空数据)
            commit(type.UPDATE_TEAM_INFO, {
              teamId: '',
              teamStatus: 3,
              isJoinTeam: false,
              teamList: [],
              teamTitle: '',
              teamIsWin: '',
              teamIsValid: false
            })
            resolve(false)
          }
        } else {
          reject(data.msg)
          console.log('查询团队的请求错误码 ' + data.result.code + data.msg)
        }
      }, (err) => {
        reject(err)
        console.log('查询团队的请求错误码' + err)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
