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
        <p class="btn__share" @click="shareAndInvite('share')">
          <span class="btn__share__icon iconfont icon-share"></span>
          <span class="btn__share__text">Share</span>
        </p>
        <p class="btn__invite" @click="shareAndInvite('invite')">
          <span class="btn__invite__icon"></span>
          <span class="btn__invite__text">Invite</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
export default {
  name: 'ShareDetail',
  data () {
    return {
      code: ''
    }
  },
  mounted () {
    utils.statistic('referral_code_page', 1)
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    shareAndInvite (type) {
      // 点击分享,跳回首页调起社交app
      const statisticName = type === 'share' ? 'referral_code_share' : 'referral_code_invite'
      utils.statistic(statisticName, 2)
      this.$on('shareFromDetailsPage', ({isSucceed, shareType}) => {
        utils.statistic(statisticName, 2, {
          result_code_s: isSucceed ? '1' : '0',
          to_destination_s: shareType
        })
      })
      console.log(type)
      if (type === 'share') {
        // 调首次分享
        this.$router.replace({path: '/', query: {'shareType': 'share'}})
      } else if (type === 'invite') {
        // 多次邀请
        this.$router.replace({path: '/', query: {'shareType': 'invite'}})
      } else {
        this.$router.replace({path: '/'})
      }
    }
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
        font-weight: 400;
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
