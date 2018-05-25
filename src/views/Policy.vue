<template>
  <div class="policy">
    <p class="header iconfont icon-close_big" @click="close"></p>
    <div class="content">
      <img src="../assets/images/await-logo.png" class="logo">
      <p class="title">About 'Go! Millionaire'</p>
      <p class="paragraph1">Go! Millionaire is developed and serviced by APUS.In order to provide better game experience and protect your personal data, please read the following agreements carefully:</p>
      <div class="service">
        <p class="service__title">Go! Millionaire Service Agreement</p>
        <div class="service__text" v-html="termsOfServiceContent"></div>
      </div>
      <div class="privacy">
        <p class="privacy__title">Go! Millionaire Privacy Agreement</p>
        <div class="privacy__text" v-html="policyContent"></div>
      </div>
      <div class="agree">
        <p class="check-btn iconfont"
        :class="{'icon-juxing' :isAgree, 'icon-gouxuankuang': !isAgree}" @click="agreePolicy"></p>
        <p class="text" @click="agreePolicy">I agree all the above agreements</p>
      </div>
      <div class="btn" :class="{'noenter' : !isAgree}" @click="startNow">Enter</div>
    </div>
  </div>
</template>

<script>
import * as api from '../assets/js/api'
import * as type from '../store/type'
import utils from '../assets/js/utils'
export default {
  name: 'Policy',
  data () {
    return {
      isAgree: false,
      policyContent: '',
      termsOfServiceContent: ''
    }
  },
  mounted () {
    utils.statistic('agreement_page', 0)
    api.getPolicyContent('privacy.html').then(({data}) => {
      this.policyContent = data
    })
    api.getPolicyContent('termsOfService.html').then(({data}) => {
      this.termsOfServiceContent = data
    })
  },
  methods: {
    close () {
      utils.statistic('policy_back', 1)
      this.$router.go(-1)
      utils.closeWebiew()
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
            utils.isAgreePolicy = true
            utils.statistic('agree_btn', 1, {result_code_s: '1'}, 'agreement_page')
            this.$store.dispatch(type._INIT)
            this.$router.replace('/')
          } else {
            utils.statistic('agree_btn', 1, {result_code_s: '0'}, 'agreement_page')
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
    width: 50px;
    height: 50px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    position: fixed;
    top: 24px;
    right: 25px;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
  }
  .content{
    padding:0 40px;
    .logo{
      width:250px;
      margin: 0 auto;
      padding-top:40px;
    }
    .title {
      color: #fff;
      font: 400 36px/56px 'Roboto', Arial, serif;
      text-align: center;
      margin:20px auto;
    }
    .paragraph1 {
      color: rgba(255,255,255, 0.8);
      font: 200 24px 'Roboto', Arial, serif;
      line-height:36px;
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
        height: 250px;
        overflow-y:scroll;
        background-color: rgba(255, 255, 255, 0.3);
        color:#fff;
        font: 200 24px 'Roboto', Arial, serif;
        line-height:36px;
        padding: 20px;
      }
      &__text::-webkit-scrollbar {/*滚动条整体样式*/
          width: 4px;
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
      margin: 32px 0 20px 15px;
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
      margin-bottom: 40px;
    }
    .noenter{
        background-color: #d7d7d7;
        box-shadow: 0 0 0 0 #d7d7d7;
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
