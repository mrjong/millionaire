<template>
  <div class="share-detail">
    <div class="top">
      <p class="header" @click="goBack">
        <span class="iconfont icon-fanhui"></span>
      </p>
      <p class="title">Extra Lives</p>
    </div>
    <div class="share-detail-content">
      <img src="../assets/images/share-live.png" class="share-lives">
      <p class="text">
        You can use EXTRA LIVES when you answer incorrectly after logging in.It will be applied automatically once per game on any question.
      </p>
      <p class="text">
        You can get it through INVITING a new user. Every time he/she signs up with your Referral Code and play our game, both of you get one.
      </p>
      <p class="text">
        SHARE for this game can also help you get one per day.
      </p>
      <p class="code">
        My Referral Code:
        <span>{{code}}</span>
      </p>
      <div class="btn">
        <p class="btn__share" @click="share('share')">
          <span class="btn__share__icon iconfont icon-share"></span>
          <span class="btn__share__text">Share</span>
        </p>
        <p class="btn__invite" @click="share('invite')">
          <span class="btn__invite__icon"></span>
          <span class="btn__invite__text">Invite</span>
        </p>
      </div>
    </div>
    <revive-card :reviveObj="reviveObj" @fbAndMess ="fbAndMess"></revive-card>
    <balance-mark v-if="showDialog" :data-info="dialogInfo" @okEvent='okEvent'>
    </balance-mark>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
import ReviveCard from '../components/ReviveCard'
import BalanceMark from '../components/BalanceMark'
import * as api from '../assets/js/api'
import * as type from '../store/type'
export default {
  name: 'ShareDetail',
  data () {
    return {
      code: '',
      reviveObj: {
        title: '',
        hint: '',
        code: '',
        shareType: '',
        isShare: false
      },
      dialogInfo: {
        htmlTitle: '',
        htmlText: '',
        okBtnText: 'OK'
      },
      showDialog: false
    }
  },
  mounted () {
    utils.statistic('referral_code_page', 0)
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    } else {
      this.getCode()
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    share (type) {
      // 判断分享类型
      const statisticName = type === 'share' ? 'referral_code_share' : 'referral_code_invite'
      utils.statistic(statisticName, 1)
      if (type === 'share') {
        // 调起分享弹框
        this.reviveObj.title = 'Extra Life can be gained by SHARING'
        this.reviveObj.hint = 'The first SHARE of this game will help you get one extra life per day.'
        this.reviveObj.code = ''
      } else if (type === 'invite') {
        // 调起邀请弹框
        this.reviveObj.title = 'My Referral Code:'
        this.reviveObj.hint = 'Inviting friends to get it now!'
        this.reviveObj.code = this.code
      }
      this.reviveObj.shareType = type
      this.reviveObj.isShare = true
    },
    fbAndMess (val) {
      console.log('sharedetail = ' + val)
      const packageName = val === 'com.facebook.katana' ? 'facebook' : 'message'
      if (this.reviveObj.shareType === 'invite') {
        utils.share(
          this.callbackFn,
          val,
          'I’m playing ‘Go! Millionaire’, use my referral code and we’ll get extra life!',
          encodeURIComponent(`http://static.subcdn.com/share-success-test.html?code=${this.code}&type=invite&packageName=${packageName}`))
      } else if (this.reviveObj.shareType === 'share') {
        utils.share(
          this.callbackFn,
          val,
          'I’m playing ‘Go! Millionaire’, sharing can help get extra life! Join us!',
          encodeURIComponent(`http://static.subcdn.com/share-success-test.html?code=${this.code}&type=share&packageName=${packageName}`))
      }
    },
    // 分享后的回调
    callbackFn (isSucceed, packageName) {
      this.reviveObj.isShare = false
      const sharepackageName = packageName === 'com.facebook.katana' ? 'facebook' : 'message'
      utils.statistic('millionaire', 3, {
        to_destination_s: sharepackageName,
        result_code_s: isSucceed ? '1' : '0'
      }, 'share-detail_page')
      if (isSucceed) {
        if (localStorage.getItem('firstTime') === '' || (new Date().getTime() - localStorage.getItem('firstTime')) > 86400000 || localStorage.getItem('isFirstShare') === '') {
          localStorage.setItem('isFirstShare', 'true')
        } else {
          localStorage.setItem('isFirstShare', 'false')
        }
        localStorage.setItem('firstTime', new Date().getTime())
        api.DailyShare().then(({data}) => {
          console.log('分享成功请求api结果' + data.result)
          utils.statistic('wait_page', 1, {
            to_destination_s: 'get_extra_life',
            loggin_state_s: utils.isOnline ? '1' : '0',
            result_info_s: data.result === 1 ? 'success' : 'fail'
          }, 'share-detail_page')
          if (data.result === 1) {
            this.$store.dispatch(type._INIT)
          } else {
            // 提交失败
            this.dialogInfo.htmlText = 'Fail to submit, please try again later.'
            this.showDialog = true
          }
        }).catch(() => {
          this.BobmParamesConfig('', 'Fail to submit, please try again later.', false, true)
          utils.statistic('share-detail_page', 1, {
            to_destination_s: 'get_extra_life',
            loggin_state_s: utils.isOnline ? '1' : '0',
            result_info_s: 'fail'
          }, 'wait_page')
        })
        this.$router.replace({path: '/'})
      } else {
        // 失败回调
        this.dialogInfo.htmlText = 'Fail to submit, please try again later.'
        this.showDialog = false
      }
    },
    getCode () {
      api.generateCode().then(({data}) => {
        if (data.result === 1) {
          this.code = data.data
        } else {
          this.dialogInfo.htmlText = 'Fail to submit, please try again later.'
          this.showDialog = true
        }
      }).catch(() => {
        this.dialogInfo.htmlText = 'Fail to submit, please try again later.'
        this.showDialog = true
      })
    },
    // 弹框ok
    okEvent (a, b) {
      this.showDialog = false
    }
  },
  components: {
    ReviveCard,
    BalanceMark
  }
}
</script>
<style scoped lang="less" type="text/less">
.share-detail {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: url("../assets/images/set-question-bg.jpg") no-repeat top;
  background-size: cover;
  color: #241262;
  .top{
    display: flex;
    margin: 24px 0;
    width: 100%;
    height: 54px;
    align-items: center;
    .header {
      width: 54px;
      height: 54px;
      background: #241262;
      border-radius: 50%;
      align-self: flex-start;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 38px;
      span {
        font-size: 28px;
        transform: translate(-2px, 0px);
      }
    }
    .title{
      width: 100%;
      text-align: center;
      font-size: 36px;
      color: #241262;
      font-family: "Roboto";
    }
  }
  .share-detail-content{
    padding: 0 50px 0;
    .share-lives{
      width: 260px;
      min-height: 200px;
      margin: 30px auto 20px;
    }
    .text{
      font-family: "Roboto";
      font-size: 36px;
      text-align: left;
      margin-bottom: 20px;
    }
    .code{
      font-size: 32px;
      font-family: "Roboto";
      font-weight: 300;
      text-align: center;
      margin-top: 100px;
      span{
        font-weight: 500;
        font-size: 48px;
        color:#e03c79
      }
    }
  }
  .btn{
    width: 100%;
    padding: 0 30px;
    &__share, &__invite{
      width: 100%;
      height: 94px;
      line-height: 94px;
      display: flex;
      justify-content: center;
      color: #fff;
      border-radius: 46px;
      font-size: 32px;
      font-family: "Roboto-Regular";
      &__icon{
        font-size: 32px;
        margin-right: 30px;
        align-self: center;
      }
    }
    &__share{
      background-color: #e03c79;
      margin:40px 0 25px;
    }
    &__invite{
      background-color: #fda800;
      &__icon{
        width: 40px;
        height:43px;
        background: url("../assets/images/invite-icon.png") no-repeat center;
        background-size: cover;
      }
    }
  }
}

</style>
