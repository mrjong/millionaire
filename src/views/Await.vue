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
          <span class="extra-lives__text">Extra Lives:</span>
          <span class="extra-lives__num">0</span>
        </div>
        <div class="invitation-code__btn" @click="inputInvitation">Invitation code</div>
      </div>
      <div class="get-lives" @click="getLives" v-if="!isSucceed">
        <div class="get-lives__text">Get More</div>
      </div>
      <div class="share-success" v-else>
        <div class="share-success__text">Share success</div>
        <div class="share-success__base">
          <div class="share-success__base__icon">
            <img src="../assets/images/lives-icon.png" />
          </div>
          <span class="share-success__base__num">+1</span>
        </div>
      </div>
    </div>
    <router-link to="/set-question">
      <div class="await__set" @click="btnStatistic('issue_page')">
        <span class="await__set__icon icon-yonghuchuti_qianzise iconfont"></span>
        <p class="await__set__text">Set Questions Myself</p>
      </div>
    </router-link>
    <div class="await__bottom">
      <img src="../assets/images/apus-logo.png" class="await__bottom__apus">
    </div>
    <div class="invitation-mark" v-if="isInvitation">
      <div class="invitation-bomb">
        <span class="invitation-bomb__close iconfont icon-cuowu" @click="isInvitation = false"></span>
        <p class="invitation-bomb__info">
          Your invitation code：
          <span>{{invitationCode}}</span>
        </p>
        <p class="invitation-bomb__hint">Reward a Resurrection Card once a day</p>
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
export default {
  name: 'Await',
  data () {
    return {
      isInvitation: false,
      isInputInvitation: false,
      dialogInfo: {
        htmlTitle: 'Invitation code',
        htmlText: 'Fill in the friend\'s invitation code and you and he will both add an extra lives',
        shouldSub: false,
        markType: true,
        okBtnText: 'OK'
      },
      showDialog: false,
      isSucceed: false,
      invitationCode: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      startTime: 'startTime',
      status: 'status'
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
    utils.statistic('wait_page', 0)
  },
  methods: {
    inviteFriends () {
      utils.share()
      utils.statistic('millionaire', 3, {}, 'wait_page')
    },
    btnStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    },
    likeToFb (val) {
      this.btnStatistic(val)
      utils.toFbBrowser()
    },
    getLives () {
      api.generateCode().then(({data}) => {
        this.invitationCode = data.data
        console.log(data)
      })
      this.isInvitation = true
    },
    inputInvitation () {
      // 调起输入邀请码弹框
      this.isInputInvitation = true
      this.showDialog = true
    },
    okEvent (a, b) {
      this.showDialog = false
      let codeInfo = {
        code: b
      }
      api.VerificationCode(codeInfo).then(({data}) => {
        console.log(data)
      })
    },
    cancelEvent () {
      this.showDialog = false
    },
    shareInvitationCode (value) {
      // 分享
      utils.share(this.callbackFn, value)
    },
    // 分享后的回调
    callbackFn (isSucceed, packageName) {
      this.isInvitation = false
      if (isSucceed) {
        // 成功回调
        this.isSucceed = true
        setTimeout(() => {
          this.isSucceed = false
        }, 1000)
      } else {
        // 失败回调
        this.isSucceed = false
      }
    }
  },
  components: {
    BaseBtn,
    NextTime,
    BaseInfo,
    BalanceMark
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
        padding: 25px 30px;
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
            margin: 0 24px 0 12px;
          }
          &__num{
            font-size:40px ;
          }
        }
        &__btn{
          width: 100%;
          height: 62px;
          line-height: 62px;
          color: #fff;
          font-size: 24px;
          text-align: center;
          background-color: #f4387c;
          border-radius: 46px;
        }
      }
      .get-lives{
        background: url("../assets/images/revive-card-before.png") no-repeat center;
        background-size: cover;
        color: #fff;
        font-size: 28px;
      }
      .share-success{
        background: url("../assets/images/revive-card-after.png") no-repeat center;
        background-size: cover;
        color: #fff;
        font-size: 28px;
        &__base{
          display: flex;
          justify-content: center;
          margin-top: 12px;
          &__icon{
            display: block;
            width: 86px;
            img{
              width: 100%;
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
    &__bottom{
      width: 100%;
      position: absolute;
      bottom: 10px;
      &__apus{
        width: 134px;
        margin: 0 auto;
        font-family: 'Roboto', Arial, serif;
        font-weight: 400;
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
        height: 320px;
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
          margin-bottom: 16px;
        }
        &__hint{
          font-weight: 300;
          margin-bottom: 54px;
          font-size: 28px;
        }
        &__channel{
          display: flex;
          margin: 0 148px;
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
</style>
