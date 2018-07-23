<template>
  <div class="policy bg-reset" ref=policyContainer @scroll="scrollEnter" v-webp.bg="`url('balance-bg.jpg')`">
    <p class="header iconfont icon-close_big" @click="close"></p>
    <div class="content" ref="policyContent">
      <img v-webp="'await-logo.png'" class="logo">
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
      <div class="btn" :class="{'noenter' : !isAgree}" ref="enter"  @click="startNow">Enter</div>
      <div class="bottom-icon" @click="toBottom" v-if="isToBottom">
        <span class="living-icon iconfont icon-LIVINGyoujiantou left"></span>
        <span class="living-icon iconfont icon-LIVINGyoujiantou right"></span>
      </div>
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
      termsOfServiceContent: '',
      isToBottom: false
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
    this.$nextTick(() => {
      this.scrollEnter()
    })
  },
  methods: {
    close () {
      utils.statistic('policy_back', 1)
      this.$router.go(-1)
      utils.closeWebview()
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
            this.$store.commit(type._UPDATE, {
              isAgreePolicy: true
            })
            utils.statistic('agree_btn', 1, {result_code_s: '1'}, 'agreement_page')
            this.$store.dispatch(type._INIT)
            this.$router.replace('/')
          } else {
            utils.statistic('agree_btn', 1, {result_code_s: '0'}, 'agreement_page')
          }
        })
      }
    },
    scrollEnter () {
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      let policyScrolTop = this.$refs.policyContainer.scrollTop
      let policyContentHeight = this.$refs.policyContent.offsetHeight
      let enterTop = policyContentHeight - policyScrolTop
      console.log('enterTop' + enterTop)
      console.log('windowHeight' + windowHeight)
      if (windowHeight < enterTop) {
        this.isToBottom = true
      } else {
        this.isToBottom = false
      }
    },
    toBottom () {
      let containerHeight = document.documentElement.clientHeight || document.body.clientHeight
      let contentHeight = this.$refs.policyContent.offsetHeight
      let count = 0
      const timer = setInterval(() => {
        count += 15
        this.$refs.policyContainer.scrollTo(0, count)
        if (count >= contentHeight - containerHeight) {
          this.isToBottom = false
          clearInterval(timer)
        }
      }, 10)
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.policy {
  width: 100%;
  height: 100%;
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
    box-sizing: border-box;
    padding:0 40px 40px;
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
    }
    .noenter{
        background-color: #d7d7d7;
        box-shadow: 0 0 0 0 #d7d7d7;
      }
    }
  }
  .bottom-icon{
    position: fixed;
    bottom: 106px;
    right: 26px;
    width: 90px;
    height: 90px;
    background-color: #faa717;
    box-shadow: 0 1px 10px 1px #faa717;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotateZ(90deg);
    .living-icon{
      color: #ffb227;
      font-size: 36px;
      align-self: center;
      color:#fff;
    }
    .left{
      opacity: 1;
      letter-spacing: -15px;
      animation: left 1s ease infinite;
    }
    .right{
      opacity: 0.5;
      animation: right 1s ease infinite;
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
  @keyframes right {
    0%{
      opacity: 0.5;
    }
    50%{
      opacity: 1;
    }
    100%{
       opacity: 0.5;
    }
  }
   @keyframes left {
    0%{
      opacity: 1;
    }
    50%{
      opacity: 0.5;
    }
    100%{
       opacity:1;
    }
  }
</style>
