<template>
  <div class="team-battle">
    <div class="team-battle-mask"></div>
    <div class="team-battle-modal">
        <span class="iconfont icon-cuowu close-btn" @click="closeModal"></span>
        <div class="team-battle-modal__joined" v-if="isJoinTeam">
          <h3 class="team-battle-modal__title">{{teamTitle}}<img v-webp="'refresh.png'" alt="" class="refresh-icon" @click="refreshMemberList"></h3>
          <div class="team-battle-modal__member">
            <ul class="member-wrap">
              <li class="member-item" v-for="item in teamList" :key="item.userId">
                <div class="captain bg-cover" v-if="item.captain === 1" v-webp.bg="`url('crown-icon.png?w=37&h=33')`"></div>
                <div class="avatar"><img :src="item.userAvatar" alt=""></div>
              </li>
              <div class="placeholder" v-if="teamList.length < 5" @click="share">+</div>
            </ul>
          </div>
          <div class="team-battle-modal__password">
            {{$t('teamBattle.teamCode')}} : <input type="text" :value="teamId" readonly class="team-password"><span class="copy-btn" @click="copyPassword">{{$t('teamBattle.btn.copy')}}</span>
          </div>
          <div class="team-battle-modal__share">
            <p class="share-desc">{{$t('teamBattle.desc')}}</p>
            <button @click="share" class="button share-btn">{{$t('teamBattle.btn.invite')}}</button>
            <button class="button exit-btn" @click="exitTeam">{{$t('teamBattle.btn.exit')}}</button>
          </div>
        </div>
        <div class="team-battle-modal__nojoin" v-else>
          <div class="logo"><img v-webp="'icon-team-battle.png?w=118&h=70'" alt=""></div>
          <h3 class="team-battle-modal__title">{{$t('teamBattle.title')}}<span class="iconfont icon-shuoming" @click="showRules"></span></h3>
          <ul class="team-battle-modal__rule">
            <li>{{$t('teamBattle.note[0]')}}</li>
            <li>{{$t('teamBattle.note[1]')}}</li>
            <li>{{$t('teamBattle.note[2]')}}</li>
            <li>{{$t('teamBattle.note[3]')}}</li>
          </ul>
          <div class="team-battle-modal__button-wrap">
            <div class="item">
              <input type="text" class="button pwd-input" :placeholder="$t('teamBattle.btn.placeholder')" v-model="password" maxlength="6">
            </div>
            <div class="item" v-if="isShowOk"><button class="button ok-btn" @click="joinTeam">{{$t('tip.lateJoin.btn')}}</button></div>
            <div class="item" v-else><button class="button create-btn" @click="createTeam">{{$t('teamBattle.btn.create')}}</button></div>
          </div>
        </div>
    </div>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils.js'
import * as type from '../store/type.js'
import * as api from '../assets/js/api.js'
import Loading from '../components/Loading'
export default {
  name: 'TeamBattle',
  data () {
    return {
      isShowOk: false,
      showLoading: false,
      password: '',
      memberList: []
    }
  },
  computed: {
    ...mapGetters({
      isJoinTeam: 'isJoinTeam',
      status: 'status',
      teamId: 'teamId',
      teamTitle: 'teamTitle',
      teamList: 'teamList',
      isShowTeamModal: 'isShowTeamModal',
      teamIsValid: 'teamIsValid',
      teamStatus: 'teamStatus'
    })
  },
  mounted () {
    // 获取成员列表
    this.$store.dispatch(type.UPDATE_TEAM_INFO)
  },
  methods: {
    refreshMemberList () {
      this.$store.dispatch(type.UPDATE_TEAM_INFO)
    },
    copyPassword () {
      let oInput = document.querySelector('.team-password')
      oInput.select()
      oInput.setSelectionRange(0, oInput.value.length)
      document.execCommand('Copy')
    },
    createTeam () {
      if (!utils.isOnline) {
        this.password = ''
        this.isShowOk = false
        this.$router.push('/login')
      } else {
        this.showLoading = true
        // 创建团队
        api.createTeam().then(({data}) => {
          if (data.result === 1 && data.code === 0) {
            const result = data.data
            if (result.success) {
              const {ud: userId, un: userName, up: userAvatar, tl: captain} = result.user
              this.$store.commit(type.UPDATE_TEAM_INFO, {
                teamId: result.teamId,
                isJoinTeam: true,
                teamList: [{
                  userId,
                  userAvatar,
                  captain
                }],
                teamTitle: userName
              })
              this.showLoading = false
              this.$store.dispatch(type._OPEN_DIALOG, {
                htmlText: this.$t('teamBattle.createSuccess'),
                markType: 0,
                okBtnText: this.$t('userCenter.edit_pop.ok'),
                lastTime: 3000,
                hintImg: utils.getWebpImgUrl('tip-success.png')
              })
              utils.statistic('create_team_button', 1, {'result_code_s': '1'}, 'teamBattle_page')
            } else {
              this.showLoading = false
              this.errorTipModal(result.code)
              utils.statistic('create_team_button', 1, {'result_code_s': '0'}, 'teamBattle_page')
            }
          }
        }, (err) => {
          console.log('接口调用报错' + err)
        })
      }
    },
    joinTeam () {
      if (!utils.isOnline) {
        this.password = ''
        this.isShowOk = false
        this.$router.push('/login')
      } else {
        // 口令校验
        if (/\d{6}/.test(this.password)) {
          // 加入战队
          api.joinTeam(this.password).then(({data}) => {
            if (data.result === 1 && data.code === 0) {
              const result = data.data
              if (result.success) {
                this.$store.dispatch(type._OPEN_DIALOG, {
                  htmlText: this.$t('teamBattle.joinSuccess'),
                  markType: 0,
                  okBtnText: this.$t('userCenter.edit_pop.ok'),
                  lastTime: 3000,
                  hintImg: utils.getWebpImgUrl('tip-success.png')
                })
                // 加入团队成功再次拉取成员列表
                this.$store.dispatch(type.UPDATE_TEAM_INFO)
                utils.statistic('enter_team_code', 1, {'result_code_s': '1'}, 'teamBattle_page')
              } else {
                this.errorTipModal(result.code)
                utils.statistic('enter_team_code', 1, {'result_code_s': '0'}, 'teamBattle_page')
              }
            }
          })
          this.password = ''
          this.isShowOk = false
        } else {
          this.$store.dispatch(type._OPEN_DIALOG, {
            htmlText: this.$t('teamBattle.passwordError'),
            markType: 0,
            okBtnText: this.$t('userCenter.edit_pop.ok'),
            lastTime: 3000,
            hintImg: utils.getWebpImgUrl('tip-fail.png')
          })
          this.password = ''
          this.isShowOk = false
        }
      }
    },
    exitTeam () {
      api.exitTeam(this.teamId).then(({data}) => {
        if (data.result === 1 && data.code === 0) {
          const result = data.data
          if (result.success) {
            // 退出战队成功
            this.$store.commit(type.UPDATE_TEAM_INFO, {
              teamId: '',
              isJoinTeam: false,
              teamList: []
            })
            this.$store.dispatch(type._OPEN_DIALOG, {
              htmlText: this.$t('teamBattle.exitSuccess'),
              markType: 0,
              okBtnText: this.$t('userCenter.edit_pop.ok'),
              lastTime: 3000,
              hintImg: utils.getWebpImgUrl('tip-success.png')
            })
            this.password = ''
            this.isShowOk = false
            utils.statistic('exit_team_button', 1, {'result_code_s': '1'}, 'teamBattle_page')
          } else {
            this.errorTipModal(result.code)
            utils.statistic('exit_team_button', 1, {'result_code_s': '0'}, 'teamBattle_page')
          }
        }
      })
    },
    closeModal () {
      this.$store.commit(type.UPDATE_TEAM_INFO, {
        isShowTeamModal: false
      })
    },
    share () {
      if (this.teamStatus === 2) {
        this.$store.dispatch(type._OPEN_DIALOG, {
          htmlText: this.$t('teamBattle.noinvite'),
          markType: 0,
          okBtnText: this.$t('userCenter.edit_pop.ok'),
          lastTime: 3000,
          hintImg: utils.getWebpImgUrl('tip-fail.png')
        })
      } else {
        this.$emit('showReviveCard', this.teamId)
        utils.statistic('invite_team_button', 1, {'result_code_s': '1'}, 'teamBattle_page')
      }
    },
    showRules () {
      this.$store.dispatch(type._OPEN_DIALOG, {
        htmlTitle: this.$t('invite.rule_bnt'),
        htmlText: `<p style="text-align: left;line-height: 0.4rem;">${this.$t('teamBattle.rule[0]')}</p>
        <p style="text-align: left;line-height: 0.4rem;">${this.$t('teamBattle.rule[1]')}</p>
        <p style="text-align: left;line-height: 0.4rem;">${this.$t('teamBattle.rule[2]')}</p>`,
        okBtnText: this.$t('tip.lateJoin.btn'),
        lastTime: 3000,
        hintImg: ''
      })
    },
    // 报错提示弹框信息
    errorTipModal (errorCode) {
      console.log('接口弹窗错误码' + errorCode)
      let errInfo = ''
      switch (errorCode) {
        case -1000:
          errInfo = this.$t('teamBattle.errInfo_1000')
          break
        case -1001:
          errInfo = this.$t('teamBattle.errInfo_1001')
          break
        case -1002:
          errInfo = this.$t('teamBattle.errInfo_1002')
          break
        case -1004:
          errInfo = this.$t('teamBattle.errInfo_1004')
          break
        case -1005:
          errInfo = this.$t('teamBattle.errInfo_1005')
          break
        case -1006:
          errInfo = this.$t('teamBattle.errInfo_1006')
          break
        case -1007:
          errInfo = this.$t('teamBattle.errInfo_1007')
          break
        case -1008:
          errInfo = this.$t('teamBattle.errInfo_1008')
          break
      }
      this.$store.dispatch(type._OPEN_DIALOG, {
        htmlText: errInfo,
        markType: 0,
        okBtnText: this.$t('userCenter.edit_pop.ok'),
        lastTime: 3000,
        hintImg: utils.getWebpImgUrl('tip-fail.png')
      })
    }
  },
  watch: {
    status (status) {
      if (this.teamId && (status === 3 || status === 4)) {
        this.$store.dispatch(type.UPDATE_TEAM_INFO).then((result) => {
          if (result.off === 1) {
            // 小场次无效团队
            this.$store.commit(type.UPDATE_TEAM_INFO, {
              teamIsValid: false
            })
          } else if (status === 3 && this.teamList.length < 3) {
            this.$store.dispatch(type._OPEN_DIALOG, {
              htmlText: this.$t('teamBattle.peopleError'),
              markType: 0,
              okBtnText: this.$t('userCenter.edit_pop.ok'),
              lastTime: 3000,
              hintImg: utils.getWebpImgUrl('tip-fail.png')
            })
            this.$store.commit(type.UPDATE_TEAM_INFO, {
              teamIsValid: false
            })
          } else if (status === 4 && this.teamList.length < 3) {
            // 弱网用户结果页再次拉取数据，判断该用户是否有效
            this.$store.commit(type.UPDATE_TEAM_INFO, {
              teamIsValid: false
            })
          } else {
            this.$store.commit(type.UPDATE_TEAM_INFO, {
              teamIsValid: true
            })
          }
        })
      }
    },
    $route (to, from) {
      if (to.path !== '/') {
        this.$store.commit(type.UPDATE_TEAM_INFO, {
          isShowTeamModal: false
        })
      }
    },
    isShowTeamModal (isShow) {
      if (isShow) {
        // 获取成员列表
        this.$store.dispatch(type.UPDATE_TEAM_INFO)
      } else {
        this.password = ''
      }
    },
    password (val) {
      val ? this.isShowOk = true : this.isShowOk = false
    }
  },
  components: {
    Loading
  }
}
</script>

<style scoped lang="less" type="text/less">
.team-battle {
  z-index: 10000;
  .team-battle-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, .8);
  }

  .team-battle-modal {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    width: 670px;
    background-color: #fff;
    border-radius: 15px;
    padding: 43px 40px 48px;
    overflow: hidden;
    color: #260964;
    font-family: 'Roboto', Arial, serif;
    .button {
      width: 100%;
      height: 85px;
      line-height: 85px;
      border-radius: 42px;
      color: #fff;
      font-size: 32px;
    }

    &__member {
      margin: 72px 0;
      .member-wrap {
        display: flex;
        justify-content: center;
        .placeholder {
          width: 93px;
          height:93px;
          line-height: 93px;
          text-align: center;
          border-radius: 50%;
          font-size: 58px;
          background-color: #f1eff4;
          color: #C8C1D7;
        }
      }
      .member-item {
        position: relative;
        margin: 0 15px;
        img {
          width: 100%;
          height: 100%;
        }
        .captain {
          position: absolute;
          top: -25px;
          right: -6px;
          width: 37px;
          height: 33px;
        }
        .avatar {
          width: 93px;
          height: 93px;
          border-radius: 50%;
          overflow: hidden;
        }
      }
    }

    &__password {
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      .team-password {
        width: 180px;
        font-size: 40px;
        border: none;
        color: #fda800;
        overflow: hidden;
        vertical-align: middle;
      }
      .copy-btn {
        width: 120px;
        height: 53px;
        line-height: 53px;
        background-color: #f4387c;
        box-shadow: 0px 3px 5px 0px rgba(245, 66, 131, 0.4);
        color: #fff;
        border-radius: 30px;
        font-size: 28px;
        font-weight: normal;
        text-align: center;
        display: inline-block;
      }
    }

    &__share {
      margin-top: 10px;
      .share-btn {
        background-color: #fda800;
        margin-top: 48px;
      }
      .exit-btn {
        background-color: #f0eef3;
        color: #260964;
        opacity: 0.5;
        margin-top: 20px;
      }
      .share-desc {
        font-size: 28px;
        font-weight: 200;
        line-height: 1.5;
        text-align: center;
      }
    }

    button {
      background: none;
      outline: none;
      border: none;
    }
    .close-btn {
      position: absolute;
      right: 26px;
      top: 26px;
      color: #260964;
    }

    &__title {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 40px;
      width: 100%;
      overflow: hidden;
      text-align: center;
      font-size: 32px;
      font-weight: 600;
      .refresh-icon {
        margin-left: 18px;
        width: 30px;
        height: 30px;
      }
      .icon-shuoming {
        color: #260964;
        margin-left: 8px;
        margin-bottom: 3px;
        font-size: 28px;
        font-weight: 400;
      }
    }

    &__rule {
      font-size: 28px;
      font-weight: 200;
      line-height: 1.5;
      margin: 33px 0 28px 3px;
      li::before {
        content: '.';
        font-size: 58px;
        height: 24px;
        line-height: 24px;
        display: inline-block;
        position: relative;
        bottom: 6px;
        right: 3px;
      }
    }

    &__nojoin {
      .logo {
        width: 118px;
        height: 70px;
        margin: 0 auto 28px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .ok-btn {
        background-color: #fda800;
      }
      .create-btn {
        background-color: #f4387c;
      }
      .pwd-input {
        background-color: #fda800;
        margin-bottom: 20px;
        border: none;
        text-align: center;
        &::-webkit-input-placeholder{
          color:#fff;
        }
        &::-moz-placeholder{
          color:#fff;
        }
        &:-moz-placeholder{
          color:#fff;
        }
        &:-ms-input-placeholder{
          color:#fff;
        }
        &:focus {
          background-color: #f1eff4;
          color:#260964;
          &::-webkit-input-placeholder{
            color:#260964;
            opacity: 0.3;
          }
          &::-moz-placeholder{
            color:#260964;
            opacity: 0.3;
          }
          &:-moz-placeholder{
            color:#260964;
            opacity: 0.3;
          }
          &:-ms-input-placeholder{
            color:#260964;
            opacity: 0.3;
          }
        }
      }
    }
  }
}
</style>
