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
      <img src="../assets/images/logo.png">
    </div>
    <next-time :nextTime="targetDate" :money="userInfo.bonusAmount" :currencyType="userInfo.currencyType"></next-time>
    <base-info :baseInfo="userInfo"></base-info>
    <div class="await__btn">
      <div class="invitation-code">
        <div class="extra-lives">
          <span class="extra-lives__icon"></span>
          <span class="extra-lives__text">Extra Lives: {{lives}}</span>
        </div>
        <div class="invitation-code__btn" @click="inputInvitation">Apply Referral Code</div>
      </div>
      <div class="get-lives" @click="getLives" ref="getLivesCard" v-if="!isSucceed">
        <div class="get-lives__text">Get More</div>
        <router-link to="/share-detail">
          <span class="revive-rule">Extra Lives Rules</span>
        </router-link>
      </div>
      <div class="share-success" ref="shareSuccessCard" v-else>
        <div class="share-success__text">Share success</div>
        <div class="share-success__base">
          <living></living>
          <span class="share-success__base__num">+1</span>
        </div>
      </div>
    </div>
    <div class="await__set" @click="getSetQuestion">
      <span class="await__set__icon icon-yonghuchuti_qianzise iconfont"></span>
      <p class="await__set__text">Set Questions Myself</p>
    </div>
    <div class="invitation-mark" v-if="isInvitation">
      <div class="invitation-bomb">
        <span class="invitation-bomb__close iconfont icon-cuowu" @click="isInvitation = false"></span>
        <p class="invitation-bomb__info">
          {{invitationBombTitle}}
          <span>{{invitationCode}}</span>
          <span class="share-detail-entry iconfont icon-shuoming"
                v-if="!invitationCode"
                @click="shareDetailEntry(invitationCode)"></span>
        </p>
        <p class="invitation-bomb__hint">{{invitationBombHint}}</p>
        <div class="invitation-bomb__channel">
          <div class="facebook" @click="shareInvitationCode('com.facebook.katana')"></div>
          <div class="message" @click="shareInvitationCode('com.facebook.orca')"></div>
        </div>
      </div>
    </div>
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
      invitationCode: '',
      invitationBombHint: 'The first SHARE of this game will help you get one extra life per day.',
      invitationBombTitle: 'Extra Life can be gained by SHARING',
      logout: false
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
    this.$nextTick(() => {
      const bodys = document.getElementsByTagName('body')[0]
      const bodyHeight = bodys.clientHeight
      bodys.style.height = bodyHeight + 'px'
    })
    if (this.$route.query.shareType) {
      let shareType = this.$route.query.shareType
      if (shareType === 'share') {
        this.invitationCode = ''
        localStorage.setItem('isFirstShare', 'true')
        this.invitationBombTitle = 'Extra Life can be gained by SHARING'
        this.invitationBombHint = 'The first SHARE of this game will help you get one extra life per day.'
      } else {
        this.invitationCode = this.code
        this.invitationBombTitle = 'My Referral Code:'
        this.invitationBombHint = 'Inviting friends to get it now!'
      }
      this.isInvitation = true
    }
    utils.statistic('wait_page', 0)
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
    // 获取邀请码分享到社交app
    getLives () {
      if (utils.isOnline) {
        // 判断是否是第一次分享
        if (localStorage.getItem('isFirstShare')) {
          let isFirst = localStorage.getItem('isFirstShare')
          let duration = new Date().getTime() - localStorage.getItem('firstTime')
          console.log('第一次分享localStorage' + duration + '----' + isFirst)
          // 86400000 = 24h
          if (duration > 86400000) {
            this.invitationCode = ''
            localStorage.setItem('isFirstShare', 'true')
            this.invitationBombTitle = 'Extra Life can be gained by SHARING'
            this.invitationBombHint = 'The first SHARE of this game will help you get one extra life per day.'
          } else {
            if (isFirst === 'false') {
              this.invitationCode = this.code
              this.invitationBombTitle = 'My Referral Code:'
              this.invitationBombHint = 'Inviting friends to get it now!'
            }
          }
        } else {
          this.invitationCode = ''
          this.invitationBombTitle = 'Extra Life can be gained by SHARING'
          this.invitationBombHint = 'The first SHARE of this game will help you get one extra life per day.'
        }
        if (this.code) {
          this.isInvitation = true
        } else {
          api.generateCode().then(({data}) => {
            if (data.result === 1) {
              this.invitationCode = data.data
              this.isInvitation = true
            } else {
              this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
            }
          }).catch(() => {
            this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
          })
        }
      } else {
        utils.login(() => {
          this.$store.commit(type._UPDATE, {isOnline: true})
          utils.isOnline = true
          utils.statistic('await_page', 1, {'result_code_s': '1'}, 'login_page')
          this.$store.dispatch(type._INIT)
        })
      }
    },
    // 调起输入邀请码弹框
    inputInvitation () {
      if (utils.isOnline) {
        this.isInputInvitation = true
        this.BobmParamesConfig(
          'APPLY REFERRAL CODE',
          'Enter a friend\'s Referral Code to get an extra life.',
          true, true)
      } else {
        utils.login(() => {
          this.$store.commit(type._UPDATE, {isOnline: true})
          utils.isOnline = true
          utils.statistic('login_page', 1, {'result_code_s': '1'}, 'login_page')
          this.$store.dispatch(type._INIT)
        })
      }
    },
    // 弹框ok
    okEvent (a, b) {
      this.showDialog = false
      if (this.logout) {
        utils.login(() => {
          this.$store.commit(type._UPDATE, {isOnline: true})
          utils.isOnline = true
          this.logout = false
          this.btnStatistic('issue_page')
          this.$router.push({path: '/set-question'})
        })
      }
      if (this.isInputInvitation) {
        if (!b) {
          this.BobmParamesConfig('', 'Invalid referral code, please check it now.', true, true)
          return false
        }
        api.VerificationCode(b).then(({data}) => {
          console.log('验证码校验')
          console.log(data)
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
      }
    },
    // 弹框cancel
    cancelEvent () {
      this.BobmParamesConfig('', '', false, false)
      this.isInputInvitation = false
    },
    // 分享邀请码
    shareInvitationCode (value) {
      // http://static.subcdn.com/share-success-test.html
      if (this.invitationCode) {
        utils.share(
          this.callbackFn,
          value,
          'I’m playing ‘Go! Millionaire’, use my referral code and we’ll get extra life!',
          'http://static.subcdn.com/share-success-test.html?code=' + this.code + '&type=invite')
      } else {
        utils.share(
          this.callbackFn,
          value,
          'I’m playing ‘Go! Millionaire’, sharing can help get extra life! Join us!',
          'http://static.subcdn.com/share-success-test.html?code=' + this.code + '&type=share')
      }
    },
    // 分享后的回调
    callbackFn (isSucceed) {
      console.log('分享的回调' + isSucceed)
      this.isInvitation = false
      if (isSucceed) {
        this.isSucceed = true
        setTimeout(() => {
          this.isSucceed = false
        }, 3000)
        localStorage.setItem('isFirstShare', 'false')
        localStorage.setItem('firstTime', new Date().getTime())
        api.DailyShare().then(({data}) => {
          console.log('分享成功请求api结果')
          console.log(data)
          if (data.result === 1) {
            this.$store.dispatch(type._INIT)
          } else {
            this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
          }
        }).catch(() => {
          this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
        })
      } else {
        // 失败回调
        console.log('分享失败')
        this.isSucceed = false
        this.isInputInvitation = false
        this.BobmParamesConfig('', 'Failed to share, please try again later.', false, true)
      }
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
    // 进入分享详情页
    shareDetailEntry (code) {
      this.$router.push({path: '/share-detail', query: {'code': code}})
    },
    // 调起弹框参数配置
    BobmParamesConfig (title, text, markType, isShow) {
      this.dialogInfo.htmlTitle = title
      this.dialogInfo.htmlText = text
      this.dialogInfo.markType = markType
      this.showDialog = isShow
    }
  },
  components: {
    BaseBtn,
    NextTime,
    BaseInfo,
    BalanceMark,
    Living
  }
}
</script>
<style scoped lang="less" type="text/less">
  .await{
    width: 100%;
    height: 100%;
    background: url("../assets/images/await-bg.jpg") no-repeat top left;
    background-size: cover;
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
      margin: 0 auto;
      img{
        width: 100%;
      }
    }
    &__btn{
      display: flex;
      padding:0 25px 25px;
      justify-content: space-between;
      .invitation-code, .get-lives, .share-success{
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
          margin-bottom:18px;
          span{
            display: block;
            height: 36px;
            line-height: 36px;
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
      .get-lives{
        background: url("../assets/images/revive-card-before.png") no-repeat center;
        background-size: cover;
        color: #fff;
        font-size: 28px;
        transition:opacity 300ms linear 2s;
        padding: 25px 30px;
        .revive-rule{
          display: block;
          font-weight: 300;
          margin-top: 20px;
          font-size: 22px;
          color: #fff;
        }
      }
      .share-success{
        background: url("../assets/images/revive-card-after.png") no-repeat center;
        background-size: cover;
        color: #fff;
        font-size: 28px;
        opacity: 1;
        transition:opacity 500ms linear 2s;
        padding: 25px 30px;
        &__base{
          display: flex;
          justify-content: center;
          margin-top: 12px;
          &__icon{
            display: block;
            width: 86px;
            position: relative;
            img{
              width: 100%;
            }
            .top{
              position: absolute;
              top:0;
              animation: lives 1.5s ease-in-out 0s infinite;
            }
          }
          &__num{
            height: 82px;
            line-height: 82px;
            text-align: right;
            font-size: 54px;
            margin-left: 30px;
          }
        }
      }
    }
    &__set{
      width: 656px;
      height: 90px;
      background-color: #faa717 ;
      font:32px 'Roboto Regular';
      border-radius: 46px;
      color: #fff;
      margin:0 auto 30px ;
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
