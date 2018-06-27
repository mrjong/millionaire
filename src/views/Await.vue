<template>
  <div class="await">
    <div class="await__top">
      <a class="await__top__like icon-dianzan iconfont"
         ref="toFbBrowser"
         @click="likeToFb('like_page')">
      </a>
      <div>
        <router-link to="/rule">
          <div class="await__top__instructions icon-youxishuoming iconfont"
               @click="btnStatistic('help_page')"></div>
        </router-link>
      </div>
    </div>
    <div class="await__title">
      <img src="../assets/images/await-logo.png">
    </div>
    <next-time :nextTime="targetDate" :money="userInfo.bonusAmount" :currencyType="userInfo.currencyType"></next-time>
    <div class="await__reminder" @click="Reminder('set_reminder')">Set Reminder</div>
    <base-info :baseInfo="userInfo"></base-info>
    <div class="await__btn">
      <div class="invitation-code">
        <div class="extra-lives">
          <div style="position: relative;">
            <span class="extra-lives__icon"></span>
            <living class="invite-living" v-if="inviteLiving"></living>
          </div>
          <span class="extra-lives__text">EXTRA LIVES: {{lives}}</span>
        </div>
        <div class="get-more-text" @click="toExtraLiveRules">Get More
          <span class="get-more-text__icon iconfont icon-LIVINGyoujiantou"></span>
        </div>
      </div>
      <div class="get-lives">
        <div class="invitation-code__btn" @click="inputInvitation">Apply Referral Code</div>
      </div>
      <div class="share-success" ref="shareSuccessCard" v-if="isSucceed">
        <p class="share-success__text">SUCCESS</p>
        <div class="share-success__base">
          <img src="../assets/images/heart-light.png" class="heart">
        </div>
        <p class="share-success__num">+1</p>
      </div>
    </div>
    <div class="invite" @click="toInvite">Invite & Earn Cash</div>
    <div class="notice">
      <router-link to="/rank">
        <notices></notices>
      </router-link>
    </div>
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
    <router-link to="/rule">
      <how-play-card></how-play-card>
    </router-link>
    <div class="await__set" @click="getSetQuestion">
      <span class="await__set__icon icon-yonghuchuti_qianzise iconfont"></span>
      <p class="await__set__text">Set Questions Myself</p>
    </div>
    <div class="apus-logo">
    <img src="../assets/images/apus-logo-white.png" class="icon">
    </div>
    <p class="bottom-text">
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'>User Agreement</a> &
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'>Privacy Policy</a>
    </p>
    <reminder-bomb @ReminderClose="ReminderClose" @ReminderOk="ReminderOk"
     :isReminderPop="isReminderPop"></reminder-bomb>
    <policy-bomb v-if="!isAgreePolicy && isWeb === 'h5'"></policy-bomb>
    <!-- <video-button></video-button> -->
    <balance-mark v-if="showDialog"
                  :data-info="dialogInfo"
                  :isInvitation = isInputInvitation
                  @okEvent='okEvent'
                  @cancelEvent = 'cancelEvent'>
    </balance-mark>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import BaseBtn from '../components/BaseBtn.vue'
import NextTime from '../components/NextTime.vue'
import BaseInfo from '../components/BaseInfo.vue'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import BalanceMark from '../components/BalanceMark'
import * as api from '../assets/js/api'
import Living from '../components/Living'
import HowPlayCard from '../components/HowPlayCard'
import Notices from '../components/Notices'
import ReminderBomb from '../components/ReminderBomb'
import PolicyBomb from '../components/PolicyBomb'
// import VideoButton from '../components/VideoButton'
export default {
  name: 'Await',
  data () {
    return {
      isInvitation: false,
      isInputInvitation: false,
      isWeb: utils.pageType,
      dialogInfo: {
        htmlTitle: '',
        htmlText: '',
        shouldSub: false,
        markType: false,
        okBtnText: 'OK'
      },
      showDialog: false,
      isSucceed: false,
      logout: false,
      inviteLiving: false,
      isReminderPop: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      startTime: 'startTime',
      status: 'status',
      lives: 'lives',
      code: 'code',
      isAgreePolicy: 'isAgreePolicy'
    }),
    targetDate () {
      if (this.startTime === -1) {
        return ['', 'Coming Soon']
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
    this.$store.dispatch(type.HOME_UPDATE)
    const isFirst = utils.storage.get('millionaire-isFirstShare')
    if (isFirst) {
      this.isSucceed = true
      setTimeout(() => {
        this.isSucceed = false
        utils('millionaire-isFirstShare', false)
      }, 3000)
    }
    // this.reportCheckCode()
    utils.statistic('wait_page', 0)
    console.log(this.$t('title'))
  },
  methods: {
    // 按钮打点
    btnStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    },
    // facebook 点赞
    likeToFb (val) {
      this.btnStatistic(val)
      utils.toFbBrowser()
    },
    // 调起输入邀请码弹框
    inputInvitation () {
      this.btnStatistic('apply_referral_code')
      if (utils.isOnline) {
        this.isInputInvitation = true
        this.BobmParamesConfig(
          'APPLY REFERRAL CODE',
          'Enter a friend\'s Referral Code to get an extra life.',
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
          console.log('fghhjklllkjuuhfdsss', b.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))
          this.isInputInvitation = false
          this.BobmParamesConfig('', 'You can not enter your own Referral Code.', false, true)
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
              this.BobmParamesConfig('', 'Invalid referral code, please check it now.', false, true)
            } else if (data.code === 30100) {
              this.BobmParamesConfig('', 'You\'ve already applied a referral code. You may only do this once.', false, true)
            } else if (data.code === 30101) {
              this.BobmParamesConfig('', 'This referral code expired.', false, true)
            } else if (data.code === 30102) {
              this.BobmParamesConfig('', 'Sorry, you missed the last chance of using this referral code. You can share or invite friends to get more!', false, true)
            } else if (data.code === 30103) {
              this.BobmParamesConfig('', 'This referral code has already been applied.', false, true)
            } else if (data.code === 30104) {
              this.BobmParamesConfig('', 'This referral code has already been applied.', false, true)
            } else {
              this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
            }
          }
        }).catch(() => {
          this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
        })
        this.isInputInvitation = false
      } else {
        this.showDialog = false
      }
      if (this.logout) {
        this.login('/set-question')
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
        this.BobmParamesConfig('',
          'Please login to set questions and you can get questions and hints in advance, and chances to win extra prize!', false, true)
      }
    },
    // 调起弹框参数配置
    BobmParamesConfig (title, text, markType, isShow) {
      this.dialogInfo.htmlTitle = title
      this.dialogInfo.htmlText = text
      this.dialogInfo.markType = markType
      this.showDialog = isShow
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
      if (utils.isOnline) {
        this.btnStatistic('earn_money_button')
        this.$router.push({path: '/invite'})
      } else {
        this.login('/invite')
      }
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
    // 开启游戏定时提醒
    Reminder (val) {
      this.btnStatistic(val)
      this.isReminderPop = true
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
        this.BobmParamesConfig('', 'Please enter right phone number', false, true)
        return false
      } else {
        // 请求接口
        api.Reminder(reminderObj).then(({data}) => {
          this.isReminderPop = false
          console.log('定时提醒' + data)
          if (data.result !== 1) {
            utils.statistic('wait_page', 1, {to_destination_s: 'set_reminder', set_info_s: 'fail'}, 'wait_page')
            if (data.code === 60001) {
              this.BobmParamesConfig('', 'Your phone number already set  reminder. ', false, true)
            } else {
              this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
            }
          } else {
            utils.statistic('wait_page', 1, {to_destination_s: 'set_reminder', set_info_s: 'success'}, 'wait_page')
            this.BobmParamesConfig('', 'Congrats. You already set your reminder.', false, true)
          }
        }).catch()
      }
    }
  },
  components: {
    BaseBtn,
    NextTime,
    BaseInfo,
    BalanceMark,
    Living,
    HowPlayCard,
    Notices,
    ReminderBomb,
    PolicyBomb
  },
  watch: {
    lives: function (val, oldVal) {
      console.log('新code= ' + val + '旧code= ' + oldVal)
      if (val > oldVal) {
        this.inviteLiving = true
        setTimeout(() => {
          this.inviteLiving = false
        }, 3000)
      }
    },
    status: function (status, oldStatus) {
      if (status === 2) {
        if ((this.userInfo.icode && utils.isOnline) || !this.userInfo.icode) {
          this.$router.push({path: '/main'})
        }
      } else {
        this.$router.replace({path: '/'})
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .await{
    width: 100%;
    background-image: url("../assets/images/await-bg.png"), -webkit-linear-gradient(top,#0e0842,#1b208c);
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    padding-bottom: 30px;
    position: relative;
    &__top{
      display: flex;
      padding: 25px 25px 0;
      justify-content: space-between;
      &__like, &__instructions{
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        font-size: 24px;
        text-align: center;
        align-self: center;
        line-height: 54px;
      }
      &__like{
        display: block;
      }
      &__instructions{
        font-size: 28px;
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
      width: 300px;
      height: 171px;
      margin: 0 auto;
      img{
        width: 100%;
      }
    }
    &__reminder {
      width: 253px;
      height: 67px;
      color: #fff;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
      font-size: 32px;
      line-height: 67px;
      text-align: center;
      margin: 40px auto;
      border-radius: 46px;
    }
    &__btn{
      display: flex;
      margin:0 25px 25px;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 24px;
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
            width: 40px;
            height: 36px;
            color: #f4387c;
            font-size: 40px;
            align-self: center;
            background: url("../assets/images/lives-icon.png") no-repeat center;
            background-size: cover;
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
      width: 670px;
      height: 100px;
      background: url('../assets/images/invite-btn.png') no-repeat center;
      background-size: cover;
      border-radius: 24px;
      margin: 0 auto;
      text-align: center;
      color: #fff;
      font: 600 40px 'Roboto', Arial, serif;
      line-height: 95px;
    }
    .notice{
      width: 100%;
      background: url("../assets/images/notice-bg.png") no-repeat center;
      background-size: contain;
    }
    .footer-bg{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 0;
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
  }
  .bottom-text{
      margin: 25px 0;
      font: 200 24px 'Roboto', Arial, serif;
      color: #fff;
      text-align: center;
      a{
        color:#fff;
      }
    }
  @media screen and (max-width: 321px) {
    .await {
      &__reminder {
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.7);
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
