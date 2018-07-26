<template>
  <div class="await">
    <div class="await__top">
      <!-- <a class="await__top__like icon-dianzan iconfont"
         ref="toFbBrowser"
         @click="likeToFb('like_page')">
      </a> -->
      <div style="display: flex;">
        <router-link to="/rule">
          <div class="await__top__instructions icon-youxishuoming iconfont"
               @click="btnStatistic('help_page')"></div>
        </router-link>
        <lang class="await__top__lang"></lang>
      </div>
      <!-- <div class="await__top__avatar" @click="loginAvatar"><img :src="userInfo.avatar" alt=""></div> -->
      <div class="await__top__avatar" :style="{backgroundImage:'url('+ userInfo.avatar +')'}" @click="loginAvatar" v-if="isOnline">
        <!-- <p class="login-text" v-if="!isOnline">{{$t('await.login_text')}}</p> -->
      </div>
      <div class="await__top__avatar__text" v-if="!isOnline" @click="loginAvatar">{{$t('await.login_text')}}</div>
    </div>
    <div class="await__title">
      <img src="../assets/images/await-logo.png">
    </div>
    <next-time :nextTime="targetDate" :money="userInfo.bonusAmount" :currencyType="userInfo.currencyType" @reminderEvent="Reminder(isRemider ? 'cancel_reminder':'set_reminder')"></next-time>
    <!-- <div class="await__reminder" @click="Reminder(isRemider ? 'cancel_reminder':'set_reminder')">{{isRemider ? $t('await.cancel_reminder_btn') : $t('await.set_reminder_btn')}}</div> -->

    <div class="await__reminder" @click="inputInvitation">{{$t('await.referral_code_btn')}}</div>

    <base-info :baseInfo="userInfo"></base-info>
    <!-- <div class="await__btn">
      <div class="invitation-code">
        <div class="extra-lives">
          <div style="position: relative;">
            <span class="extra-lives__icon"></span>
            <living class="invite-living" v-if="inviteLiving"></living>
          </div>
          <span class="extra-lives__text">{{$t('await.extra_lives_text')}} {{lives}}</span>
        </div>
        <div class="get-more-text" @click="toExtraLiveRules">{{$t('await.get_more_text')}}
          <span class="get-more-text__icon iconfont icon-LIVINGyoujiantou"></span>
        </div>
      </div>
      <div class="get-lives">
        <div class="invitation-code__btn" @click="inputInvitation">{{$t('await.referral_code_btn')}}</div>
      </div>
      <div class="share-success" ref="shareSuccessCard" v-if="isSucceed">
        <p class="share-success__text">SUCCESS</p>
        <div class="share-success__base">
          <img src="../assets/images/heart-light.png" class="heart">
        </div>
        <p class="share-success__num">+1</p>
      </div>
    </div> -->
    <div class="characters">
      <div class="item"><img src="../assets/images/team-battle.png"><span>{{$t('await.teamBattle')}} <br><em class="scale-text">{{$t('await.come_soon')}}</em></span></div>
      <div class="item" @click="getSetQuestion"><img src="../assets/images/set-question.png"><span>{{$t('await.ses_question_btn')}}</span></div>
    </div>
    <div class="invite" @click="toInvite">
      <img src="../assets/images/invite-btn.png">
      <p>{{$t('await.invite_btn')}}</p>
    </div>
    <!-- <div class="notice">
      <router-link to="/rank" style="width: 100%;">
        <notices></notices>
      </router-link>
    </div> -->
    <!-- <div class="game-area">
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/" @click="btnStatistic('H5game_Box')">
          <img src="../assets/images/game-icon-4.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Doodle%20Connect"  @click="btnStatistic('Doodle_Connect')">
          <img src="../assets/images/game-icon-2.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Casual%20Chess"  @click="btnStatistic('Casual_Chess')">
          <img src="../assets/images/game-icon-3.png">
        </a>
      </div>
    </div>
    <div class="game-area">
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Eggs%20&%20cars"  @click="btnStatistic('Eggs_cars')">
          <img src="../assets/images/game-icon-1.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Reflector" @click="btnStatistic('Reflector')">
          <img src="../assets/images/game-icon-5.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view1.html?Sun%20Beams"  @click="btnStatistic('Sun_Beams')">
          <img src="../assets/images/game-icon-6.png">
        </a>
      </div>
    </div> -->
    <!-- <router-link to="/rule">
      <how-play-card></how-play-card>
    </router-link> -->
    <!-- <div class="await__set" @click="getSetQuestion">
      <span class="await__set__icon icon-yonghuchuti_qianzise iconfont"></span>
      <p class="await__set__text">{{$t('await.ses_question_btn')}}</p>
    </div> -->
    <!-- <div class="apus-logo">
      <img src="../assets/images/apus-logo-white.png" class="icon">
    </div> -->
    <policy-link></policy-link>
    <reminder-bomb @ReminderClose="ReminderClose" @ReminderOk="ReminderOk"
     :isReminderPop="isReminderPop"></reminder-bomb>
    <policy-bomb v-if="!isAgreePolicy && isWeb === 'h5'"></policy-bomb>
    <newbie-task></newbie-task>
    <keep-alive>
      <new-announcement></new-announcement>
    </keep-alive>
    <!-- <video-button></video-button> -->
    <balance-mark v-if="showDialog"
                  :data-info="dialogInfo"
                  :isInvitation = isInputInvitation
                  @okEvent='okEvent'
                  @cancelEvent = 'cancelEvent'>
    </balance-mark>
    <div class="browser-tip" v-if="isShowBrowserTip">
      <span class="iconfont icon-cuowu close" @click="isShowBrowserTip = false"></span>
      <img class="browser-tip__icon" src="../assets/images/browser-tip-icon.png"/>
      <div class="browser-tip__text">
        <p>{{$t('tip.downBrowser.title')}} {{$t('tip.downBrowser.desc')}}</p>
      </div>
      <a class="browser-tip__button ellipsis-1" href="javascript:;" @click="downBrowser">{{$t('tip.downBrowser.btn')}}</a>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import NextTime from '../components/NextTime.vue'
import BaseInfo from '../components/BaseInfo.vue'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import BalanceMark from '../components/BalanceMark'
import * as api from '../assets/js/api'
import HowPlayCard from '../components/HowPlayCard'
import Notices from '../components/Notices'
import ReminderBomb from '../components/ReminderBomb'
import PolicyBomb from '../components/PolicyBomb'
import lang from '../components/Language'
import PolicyLink from '../components/PolicyLink'
import NewbieTask from '../components/NewbieTask'
import NewAnnouncement from '../components/NewAnnouncement'
// import VideoButton from '../components/VideoButton'
export default {
  name: 'Await',
  data () {
    return {
      isShowBrowserTip: !utils.isInstall('com.millionaire.aries'),
      isInvitation: false,
      isInputInvitation: false,
      isWeb: utils.pageType,
      dialogInfo: {
        htmlTitle: '',
        htmlText: '',
        shouldSub: false,
        markType: false,
        okBtnText: this.$t('await.referral_code_pop.ok')
      },
      showDialog: false,
      logout: false,
      isReminderPop: false,
      isChangeReminder: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      startTime: 'startTime',
      status: 'status',
      lives: 'lives',
      code: 'code',
      isAgreePolicy: 'isAgreePolicy',
      isRemider: 'isRemider',
      watchingMode: 'watchingMode',
      isOnline: 'isOnline'
    }),
    targetDate () {
      if (this.startTime === -1) {
        return ['', this.$t('await.come_soon')]
      } else if (this.startTime === 0) {
        return ['', 'Living']
      } else {
        let nowDate = new Date(this.startTime)
        let month = nowDate.getMonth() + 1
        let day = nowDate.getDate()
        let hour = nowDate.getHours()
        let minute = nowDate.getMinutes()
        if (month <= 9) {
          month = '0' + month
        }
        if (day <= 9) {
          day = '0' + day
        }
        if (minute <= 9) {
          minute = '0' + minute
        }
        return [month + '/' + day, hour + ':' + minute]
      }
    }
  },
  mounted () {
    utils.statistic('wait_page', 0)
  },
  methods: {
    downBrowser () {
      utils.statistic('download_button', 1)
      setTimeout(function () {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.millionaire.aries&referrer=id%3D334005'
      }, 500)
      window.location.href = 'xapplink://com.millionaire.aries/millionaire?url=' + encodeURIComponent(window.location.href)
    },
    // 按钮打点
    btnStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    },
    // 调起输入邀请码弹框
    inputInvitation () {
      this.btnStatistic('apply_referral_code')
      if (utils.isOnline) {
        this.isInputInvitation = true
        this.BobmParamesConfig(
          this.$t('await.referral_code_pop.title'),
          this.$t('await.referral_code_pop.description'),
          true, true)
      } else {
        this.login()
      }
    },
    // 弹框ok
    okEvent (a, b) {
      if (this.isInputInvitation) {
        console.log(b.replace(/^\s\s*/, '').replace(/\s\s*$/, '') === this.code)
        if (!b) {
          return false
        } else if (b.replace(/^\s\s*/, '').replace(/\s\s*$/, '') === this.code) {
          this.isInputInvitation = false
          this.BobmParamesConfig('', this.$t('await.referral_code_pop.case1'), false, true)
          return false
        } else {
          this.showDialog = false
        }
        api.VerificationCode(b).then(({data}) => {
          console.log('验证码校验')
          console.log(data)
          utils.statistic('wait_page', 1, {
            to_destination_s: 'input_referral_code',
            loggin_state_s: utils.isOnline ? '1' : '0',
            result_code_s: data.result === 1 ? '1' : '0'
          }, 'wait_page')
          if (data.result === 1) {
            // 从本地同步复活卡使用信息
            const {id: raceId, reviveCardInfo = {}} = utils.storage.get('millionaire-uncommittedAnswers') || {}
            let records = []
            if (raceId === utils.raceId) {
              records = reviveCardInfo.records || []
            } else {
              utils.storage.remove('millionaire-uncommittedAnswers')
            }
            // 更新复活卡数量
            const {cn: lives = 0, lc: maxRecoveryCount = 0} = data.data || {}
            this.$store.commit(type._UPDATE, {
              lives: lives - records.length || 0
            })
            this.$store.commit(type.QUESTION_UPDATE, {
              maxRecoveryCount: maxRecoveryCount - records.length || 0
            })
          } else {
            if (data.code === 404) {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case2'), false, true)
            } else if (data.code === 30100) {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case3'), false, true)
            } else if (data.code === 30101) {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case4'), false, true)
            } else if (data.code === 30102) {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case5'), false, true)
            } else if (data.code === 30103) {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case6'), false, true)
            } else if (data.code === 30104) {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case6'), false, true)
            } else {
              this.BobmParamesConfig('', this.$t('await.referral_code_pop.case7'), false, true)
            }
          }
        }).catch(() => {
          this.BobmParamesConfig('', this.$t('await.referral_code_pop.case7'), false, true)
        })
        this.isInputInvitation = false
      } else {
        this.showDialog = false
      }
      if (this.logout) {
        this.login('/set-question')
      }
      if (this.isRemider && this.isChangeReminder) {
        this.isChangeReminder = false
        api.cancelReminder().then(({data}) => {
          if (data.result === 1) {
            this.$store.commit(type._UPDATE, {
              isRemider: false
            })
            utils.statistic('wait_page', 1, {to_destination_s: 'cancel_reminder', set_info_s: 'success'}, 'wait_page')
            this.BobmParamesConfig('', this.$t('await.remider_pop.cancel_case3'), false, true)
          } else {
            utils.statistic('wait_page', 1, {to_destination_s: 'cancel_reminder', set_info_s: 'fail'}, 'wait_page')
            this.BobmParamesConfig('', this.$t('await.remider_pop.cancel_case2'), false, true)
          }
        })
      }
    },
    // 弹框cancel
    cancelEvent () {
      this.BobmParamesConfig('', '', false, false)
      this.isInputInvitation = false
    },
    // 设置问题
    getSetQuestion () {
      if (utils.isOnline) {
        this.btnStatistic('issue_page')
        this.$router.push({path: '/set-question'})
      } else {
        this.logout = true
        this.BobmParamesConfig('', this.$t('await.set_question_pop'), false, true)
      }
    },
    // 调起弹框参数配置
    BobmParamesConfig (title, text, markType, isShow) {
      this.dialogInfo.htmlTitle = title
      this.dialogInfo.htmlText = text
      this.dialogInfo.markType = markType
      this.showDialog = isShow
      this.dialogInfo.okBtnText = this.$t('await.referral_code_pop.ok')
    },
    // toExtraLiveRules
    toExtraLiveRules () {
      this.btnStatistic('referral_code_page')
      if (utils.isOnline) {
        this.$router.push({path: '/share-detail', query: {'code': this.code}})
      } else {
        this.login('/share-detail')
      }
    },
    toInvite () {
      this.btnStatistic('earn_money_button')
      this.$router.push({path: '/invite'})
    },
    // login
    login (path) {
      utils.login(() => {
        this.logout = false
        utils.statistic('wait_page', 1, {'result_code_s': '1'}, 'wait_page')
        this.$store.dispatch(type._INIT)
        if (path) {
          this.$router.push({path: path, query: {'code': this.code}})
        }
      })
    },
    // 头像登录逻辑
    loginAvatar () {
      console.log(utils.isOnline)
      if (!utils.isOnline) {
        if (utils.pageType === 'h5') {
          utils.statistic('wait_page', 1, {to_destination_s: 'sign_up'}, 'wait_page')
        } else {
          utils.statistic('wait_page', 1, {to_destination_s: 'loggin_page'}, 'wait_page')
        }
        utils.login(() => {
          this.$store.dispatch(type._INIT).then(() => {
          }, (err) => {
            console.log('点击头像登陆失败:', err)
          })
        })
      } else {
        utils.statistic('wait_page', 1, {to_destination_s: 'user_profile'}, 'wait_page')
        this.$router.push({path: '/user-center'})
      }
    },
    // 开启游戏定时提醒
    Reminder (val) {
      this.btnStatistic(val)
      if (this.isRemider) {
        this.isChangeReminder = true
        this.BobmParamesConfig('', this.$t('await.remider_pop.cancel_case1'), true, true)
      } else {
        this.isReminderPop = true
      }
    },
    // 关闭游戏定时提醒弹框
    ReminderClose () {
      this.isReminderPop = false
    },
    ReminderOk (reminderObj) {
      const phoneRule = /^[0-9]{6,15}$/
      if (!phoneRule.test(reminderObj.phone)) {
        // 提示错误，手机号错误
        reminderObj.phone = ''
        this.isReminderPop = false
        this.BobmParamesConfig('', this.$t('await.remider_pop.case1'), false, true)
        return false
      } else {
        // 请求接口订阅
        api.Reminder(reminderObj).then(({data}) => {
          this.isReminderPop = false
          console.log('定时提醒' + data)
          if (data.result !== 1) {
            utils.statistic('wait_page', 1, {to_destination_s: 'set_reminder', set_info_s: 'fail'}, 'wait_page')
            if (data.code === 60001) {
              this.BobmParamesConfig('', this.$t('await.remider_pop.case2'), false, true)
            } else {
              this.BobmParamesConfig('', this.$t('await.remider_pop.case3'), false, true)
            }
          } else {
            this.$store.commit(type._UPDATE, {
              isRemider: true
            })
            utils.statistic('wait_page', 1, {to_destination_s: 'set_reminder', set_info_s: 'success'}, 'wait_page')
            this.BobmParamesConfig('', this.$t('await.remider_pop.case4'), false, true)
          }
        }).catch()
      }
    }
  },
  components: {
    NextTime,
    BaseInfo,
    BalanceMark,
    HowPlayCard,
    Notices,
    ReminderBomb,
    PolicyBomb,
    lang,
    PolicyLink,
    NewbieTask,
    NewAnnouncement
  },
  watch: {
    status: function (status, oldStatus) {
      if (status === 2) {
        if ((this.userInfo.icode && utils.isOnline) || !this.userInfo.icode) {
          this.$router.push({path: '/main'})
        }
      } else {
        this.$router.replace({path: '/'})
      }
    },
    isShowBrowserTip: function (val) {
      if (val) {
        utils.statistic('download_notice', 0)
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .await{
    width: 100%;
    background-image: url("../assets/images/await-bg-1.jpg");
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &__top{
      display: flex;
      padding: 24px 24px 0;
      justify-content: space-between;
      align-items: center;
      margin-bottom: -40px;
      &__instructions{
        width: 52px;
        height: 52px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        font-size: 24px;
        text-align: center;
        align-self: center;
        line-height: 54px;
        color: #fff;
        font-family: 'Roboto', Arial, serif;
      }
      &__instructions{
        font-size: 28px;
      }
      &__lang {
        margin-right: 20px;
        font-size: 26px;
      }
      &__avatar {
        width:67px;
        height:67px;
        border-radius: 50%;
        background: no-repeat center;
        background-size: cover;
        overflow: hidden;
        &__text{
          color: #ffffff;
          text-align: center;
          font: 28px 'Roboto Condensed', Arial, sans-serif;
        }
      }
      &__logo{
        width: 168px;
        align-self: center;
        img{
          width: 100%;
        }
      }
    }
    &__title{
      width: 275px;
      height: 118px;
      margin: 0 auto 35px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    &__reminder {
      max-width: 350px;
      padding: 0 40px;
      height: 67px;
      color: #fff;
      line-height: 67px;
      text-align: center;
      margin: 40px auto 73px;
      border: 2px solid #fff;
      border-radius: 34px;
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 28px;
    }
    &__btn{
      max-width: 93%;
      width: 6.7rem;
      display: flex;
      margin:0 25px 25px;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 24px;
      align-self: center;
      .invitation-code, .get-lives{
        max-width: 48%;
        width: 322px;
        height: 160px;
        border-radius: 26px;
        background-color:#fff;
        padding: 25px 0;
        font-family: "Roboto";
        .extra-lives{
          width: 100%;
          display: flex;
          justify-content: center;
          color: #241262;
          height: 36px;
          margin:10px auto 18px;
          span{
            display: block;
            height: 37px;
            line-height: 37px;
          }
          .invite-living{
            position: absolute;
            top: -3px;
            left: -3px;
            width: 50px;
          }
          &__icon{
            width: 44px;
            height: 36px;
            color: #f4387c;
            font-size: 40px;
            align-self: center;
            background: url("../assets/images/lives-icon.png") no-repeat center;
            background-size: contain;
          }
          &__text{
            font-size: 28px;
            margin: 0 0 0 12px;
            color: #241262;
          }
        }
         .get-more-text{
            font-size: 28px;
            margin: 0 0 0 33px;
            color: #f4387c;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            &__icon{
              color: #f4387c;
              font-size: 20px;
            }
         }
        &__btn{
          width: 260px;
          height: 62px;
          line-height: 62px;
          color: #fff;
          font-size: 20px;
          text-align: center;
          background-color: #f4387c;
          border-radius: 46px;
          margin: 0 auto;
        }
      }
      .share-success{
        width: 400px;
        height: 400px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 24px;
        background-color:rgba(15, 26, 114, 0.8);
        padding: 25px;
        font-weight: 'Roboto';
        &__text{
          color:#fa74a5;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          transform: translateY(40px)
        }
        .heart{
          width: 85%;
          margin: 0 auto;
        }
        &__num{
          color: #fff;
          font-size:48px;
          text-align: center;
          font-weight: bold;
          transform: translateY(-40px)
        }
      }
      .get-lives{
        display: flex;
        color: #fff;
        font-size: 28px;
        transition:opacity 300ms linear 2s;
        padding: 25px 30px;
        align-items: center;
        .revive-rule{
          font-weight: 300;
          margin-top: 20px;
          font-size: 22px;
          color: #fff;
        }
        &__text{
          margin-bottom: 20px;
        }
      }
    }
    &__set{
      max-width: 93% !important;
      width: 656px;
      height: 90px;
      background-color: #faa717 ;
      font:32px 'Roboto Regular';
      border-radius: 46px;
      color: #fff;
      margin:0 auto;
      text-align: center;
      &__text{
        display: inline-block;
        line-height: 90px;
        font: 300 .32rem/.93rem Roboto;
      }
      &__icon{
        display: inline-block;
        width: 50px;
        height: 90px;
        line-height: 90px;
        font-size: 32px;
      }
    }
    .invitation-mark {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 111;
      padding: 0 25px;
      background-color: rgba(68, 68, 68, 0.8);
      .invitation-bomb {
        max-width: 93% !important;
        width: 670px;
        height: 350px;
        background-color: #fff;
        border-radius: 26px;
        position: absolute;
        bottom: 25px;
        padding: 50px 0 40px;
        color: #241262;
        text-align: center;
        font-family: "Roboto";
        &__close{
          position:absolute;
          top: 24px;
          right: 24px;
          color: #241262;
          font-size: 20px;
        }
        &__info{
          font-size: 32px;
          margin-bottom: 20px;
          .share-detail-entry{
            font-size: 32px;
            color: #241262;
          }
        }
        &__hint{
          font-weight: 300;
          margin-bottom: 54px;
          font-size: 28px;
          padding: 0 30px;
        }
        &__channel{
          display: flex;
          margin: 0 148px 10px;
          justify-content: space-between;
          .facebook, .message{
            width: 96px;
            height: 96px;
            background: url("../assets/images/facebook.png") no-repeat center;
            background-size: cover;
          }
          .message{
            background: url("../assets/images/messenger.png") no-repeat center;
            background-size: cover;
          }
        }
      }
    }
    .apus-logo{
      width: 100%;
      padding: 50px 0 0;
      img{
        width: 120px;
        margin: 0 auto;
      }
    }
    .invite {
      position: relative;
      max-width:93%;
      border-radius: 24px;
      margin: 0 auto;
      text-align: center;
      color: #fff;
      font: 600 40px 'Roboto', Arial, serif;
      line-height: 95px;
      img{
        max-width: 100%;
        width: 670px;
        height: 100px;
      }
      p{
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%,0);
        width: 100%;
      }
    }
    .notice{
      width: 100%;
      background: url("../assets/images/notice-bg.png") no-repeat center;
      background-size: contain;
      display: flex;
      justify-content: center;
    }
    .footer-bg{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 0;
    }
    .characters {
      display: flex;
      justify-content: space-between;
      margin: 0 25px 25px;
      .item {
        width: 48.3%;
        height: 160px;
        position: relative;
        span {
          color: #fff;
          position: absolute;
          top: 26px;
          left: 24px;
          font-size: 28px;
          font-family: 'Roboto', Arial, serif;
        }
        .scale-text {
          position: relative;
          display: inline-block;
          margin-top: 12px;
          transform: scale(0.8);
          opacity: .7;
          left: -16px;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .game-area{
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      justify-content: center;
      margin: 25px 0;
      .game-icon{
        flex: 1;
        img{
          width: 117px;
          margin: 0 auto;
        }
      }
    }
    .ins{
      display: flex;
      justify-content: center;
      margin: 20px auto 0;
    }

    .browser-tip {
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 133px;
      background: url('../assets/images/browser-tip-bg.png') no-repeat;
      background-size: cover;
      color: #fff;
      padding-right: 10px;
      z-index: 1;

      .close {
        position: absolute;
        top: 10px;
        right: 15px;
        opacity: 0.5;
      }
      img {
        width: 90px;
        height: 83px;
        margin: 0 10px;
      }
      &__text {
        width: 64%;
        line-height: 1.4;
        font: 200 24px 'Roboto,Arial,serif'
      }
      &__button {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0,-50%);
        color: #fff;
        width: 150px;
        height: 58px;
        text-align: center;
        background: url('../assets/images/browser-tip-button.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
        font: 24px 'Roboto,Arial,serif';
        line-height: 58px;
      }
    }
  }
  @media screen and (max-width: 321px) {
    .await {
      &__reminder {
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.7);
      }
      .browser-tip__text {
        font-size: 12px;
      }
    }
  }
  @keyframes lives {
    0%{
      transform: scale(1);
    }
    15%{
      transform: scale(1.2);
    }
    25%{
      transform: scale(1);
      opacity: 1;
    }
    90%{
      transform: scale(2);
      opacity: 0;
    }
  }
</style>
