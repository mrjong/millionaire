<template>
  <div class="await">
    <div class="await__top">
      <a class="await__top__like icon-dianzan iconfont"
         ref="toFbBrowser"
         @click="likeToFb('like_page')"></a>
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
    <div class="notice">
      <router-link to="/rank">
        <notices></notices>
      </router-link>
    </div>
    <div class="game-area">
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/">
          <img src="../assets/images/game-icon-4.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Doodle%20Connect">
          <img src="../assets/images/game-icon-2.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Casual%20Chess">
          <img src="../assets/images/game-icon-3.png">
        </a>
      </div>
    </div>
    <div class="game-area">
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Eggs%20&%20cars">
          <img src="../assets/images/game-icon-1.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view.html?Reflector">
          <img src="../assets/images/game-icon-5.png">
        </a>
      </div>
      <div class="game-icon">
        <a href="http://h5game.subcdn.com/03/game_view1.html?Sun%20Beams">
          <img src="../assets/images/game-icon-6.png">
        </a>
      </div>
    </div>
    <router-link to="/rule">
      <how-play-card></how-play-card>
    </router-link>
    <div class="await__set" @click="getSetQuestion">
      <span class="await__set__icon icon-yonghuchuti_qianzise iconfont"></span>
      <p class="await__set__text">Set Questions Myself</p>
    </div>
    <div class="ins">
      <ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:250px"
     data-ad-client="ca-pub-4255098743133861"
     data-ad-slot="9382446176"></ins>
    </div>
    <div class="apus-logo">
    <img src="../assets/images/apus-logo-white.png" class="icon">
    </div>
    <balance-mark v-if="showDialog"
                  :data-info="dialogInfo"
                  :isInvitation = isInputInvitation
                  @okEvent='okEvent'
                  @cancelEvent = 'cancelEvent'>
    </balance-mark>
    <revive-guide></revive-guide>
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
import ReviveGuide from '../components/ReviveGuide'
import HowPlayCard from '../components/HowPlayCard'
import Notices from '../components/Notices'
export default {
  name: 'Await',
  data () {
    return {
      isInvitation: false,
      isInputInvitation: false,
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
      inviteLiving: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      startTime: 'startTime',
      status: 'status',
      lives: 'lives',
      code: 'code'
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
    if (localStorage.getItem('isFirstShare')) {
      let isFirst = localStorage.getItem('isFirstShare')
      let duration = new Date().getTime() - localStorage.getItem('firstTime')
      if (duration > 86400000 || isFirst === 'true') {
        this.isSucceed = true
        setTimeout(() => {
          this.isSucceed = false
        }, 3000)
        localStorage.setItem('isFirstShare', 'false')
      }
    }
    utils.statistic('wait_page', 0)
    console.log('初始化' + this.status)
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
        if (!b) {
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
            this.$store.dispatch(type._INIT)
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
    // login
    login (path) {
      utils.login(() => {
        this.$store.commit(type._UPDATE, {isOnline: true})
        utils.isOnline = true
        this.logout = false
        utils.statistic('wait_page', 1, {'result_code_s': '1'}, 'wait_page')
        this.$store.dispatch(type._INIT)
        if (path) {
          this.$router.push({path: path, query: {'code': this.code}})
        }
      })
    }
  },
  components: {
    BaseBtn,
    NextTime,
    BaseInfo,
    BalanceMark,
    Living,
    ReviveGuide,
    HowPlayCard,
    Notices
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
      console.log('监听' + this.status)
      if (status === 2) {
        this.$router.replace({path: '/main'})
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
    background: url("../assets/images/await-bg.png") no-repeat top left;
    background-size: cover;
    background-color: #0e0842;
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
      width: 400px;
      height: 171px;
      margin: 0 auto;
      img{
        width: 100%;
      }
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
            color: #241262;
            text-align: center;
            font-size: 32px;
            &__icon{
              color: #241262;
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
        position: absolute;
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
