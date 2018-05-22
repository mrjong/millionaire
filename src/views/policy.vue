<template>
  <div class="policy">
    <p class="header iconfont icon-cuowu" @click="close"></p>
    <div class="content">
      <img src="../assets/images/await-logo.png" class="logo">
      <p class="title">Go! Millionaire Agreement</p>
      <p class="paragraph1">Go! Millionaire is developed and serviced by APUS. We provide the following content and service:</p>
      <ul class="policy-list">
        <li v-for="(val, idx) in ruleList" :key="idx">{{val}}</li>
      </ul>
      <p class="paragraph2">In order to have provide better game experience and protect your personal information, please read the following agreement carefully and thank you for your support:</p>
      <div class="service">
        <p class="service__title">Go! Millionaire Service Agreement</p>
        <iframe class="service__text" src="http://static.subcdn.com/201805211500242f0dfc8e96.html"></iframe>
      </div>
      <div class="privacy">
        <p class="privacy__title">Go! Millionaire Privacy Agreement</p>
        <div class="privacy__text" v-html="policyContent"></div>
        <!-- <iframe class="privacy__text" src="http://static.subcdn.com/20180321220447b3b994f975.html"></iframe> -->
      </div>
      <div class="agree">
        <p class="check-btn iconfont"
        :class="{'icon-juxing' :isAgree, 'icon-gouxuankuang': !isAgree}" @click="agreePolicy"></p>
        <p class="text">I have read and agree to the above agreement</p>
      </div>
      <div class="btn" @click="startNow">Enter</div>
      <img src="../assets/images/apus-logo-white.png" class="apus-logo">
    </div>
  </div>
</template>

<script>
import * as api from '../assets/js/api'
import * as type from '../store/type'
export default {
  name: 'Policy',
  data () {
    return {
      isAgree: false,
      ruleList: [
        'Win 100,000 rupees per day',
        'Answer 12 questions to get bonus',
        'Invite friends to get extra lives',
        'Multiplayer Live Chat',
        'Prizes more than Rs. 150 can be withdrawn'
      ],
      policyContent: ''
    }
  },
  mounted () {
    api.getPolicyContent('http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html').then((data) => {
      this.policyContent = data.request.responseText
    })
  },
  methods: {
    close () {
      window.open('')
    },
    agreePolicy () {
      if (this.isAgree) {
        this.isAgree = false
      } else {
        this.isAgree = true
      }
    },
    startNow () {
      // 协议上报接口
      if (!this.isAgree) {
        return false
      } else {
        api.submitAgreePolicy().then(({data}) => {
          if (data.result === 1) {
            this.$store.dispatch(type._INIT)
            this.$router.replace('/')
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.policy {
  width: 100%;
  height: 100%;
  background: url('../assets/images/balance-bg.jpg') no-repeat top left;
  background-size: cover;
  overflow-y: scroll;
  .header {
    width: 54px;
    height: 54px;
    background: #241262;
    border-radius: 50%;
    position: fixed;
    top: 24px;
    right: 25px;
    font-size: 28px;
    text-align: center;
    line-height: 54px;
  }
  .content{
    padding:0 90px;
    .logo{
      width:300px;
      margin: 0 auto;
      padding-top:50px;
    }
    .title {
      color: #fff;
      font: 400 36px/56px 'Roboto', Arial, serif;
      text-align: center;
      margin:30px auto;
    }
    .paragraph1, .paragraph2 {
      color: rgba(255,255,255, 0.8);
      font: 200 24px 'Roboto', Arial, serif;
      line-height:36px;
    }
    .policy-list{
      color:#fff;
      list-style: disc;
      margin: 20px 0 20px 25px ;
      li {
        font:24px 'Roboto', Arial, serif;
        line-height: 36px;
      }
    }
    .privacy, .service{
      &__title{
      color:#fff;
      font: 400 24px 'Roboto', Arial, serif;
      line-height:36px;
      margin:25px 0;
      }
      &__text{
        width: 100%;
        height: 212px;
        overflow-y:scroll;
        background-color: rgba(255, 255, 255, 0.3);
        color:#fff;
        font: 200 24px 'Roboto', Arial, serif;
        line-height:36px;
        padding: 20px;
      }
      &__text::-webkit-scrollbar {/*滚动条整体样式*/
          width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
        }
      &__text::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
          border-radius: 5px;
          background: #fff;
      }
      &__text::-webkit-scrollbar-track {/*滚动条里面轨道*/
          background: rgba(255, 255, 255, 0.3);
      }
    }
    .agree {
      display: flex;
      align-items: center;
      margin: 42px 0;
      color:#fff;
      .check-btn{
        font-size: 30px;
        margin-right: 20px;
        align-self: center;
      }
      .text{
        font:200 24px 'Roboto', Arial, serif;
        align-self: center;
      }
    }
    .btn{
      max-width: 100%;
      width: 657px;
      height: 93px;
      background-color: #fda800;
      border-radius: 46px;
      text-align: center;
      color:#fff;
      font:32px 'Roboto', Arial, serif;
      line-height: 93px;
      box-shadow: 0 1px 15px 1px #fda9008f;
    }
    .apus-logo{
      width: 133px;
      margin: 44px auto;
    }
  }
}

.rule-item {
  width: 100%;
  padding: 0 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  &__wrap {
    width: 277px;
    &__img {
      width: 100%;
    }
  }
  &__title {
    font: 500 28px 'Roboto', Arial, serif;
    margin: 44px 0 28px 0;
    color: #241262;
    &__index {
      display: inline-block;
      width: 35px;
      height: 35px;
      font: 300 21px 'Roboto', Arial, serif;
      background: url('../assets/images/index-bg.png') no-repeat top left;
      background-size: contain;
      text-align: center;
      line-height: 35px;
      margin-right: 13px;
      color: #241262;
    }
  }
  &__text {
    font: 300 28px/32px 'Roboto', Arial, serif;
    color: #241262;
    text-align: center;
  }
}

</style>
