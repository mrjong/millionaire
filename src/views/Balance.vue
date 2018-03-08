<template>
  <div class="balance-wrap">
    <div class="balance-wrap__title">
      <p class="balance-wrap__title__back iconfont icon-fanhui" @click="goBack"></p>
      <p class="balance-wrap__title__nickname">{{userInfo.userName}}</p>
    </div>
    <div class="balance-wrap__contain">
      <div class="balance-wrap__contain__wrap">
        <img :src="userInfo.avatar" alt="" class="balance-wrap__contain__wrap__img">
        <p class="balance-wrap__contain__wrap__mytitle">My balance</p>
        <p class="balance-wrap__contain__wrap__mybalance">
          <span class="balance-wrap__contain__wrap__symbol">{{userInfo.currencyType}}{{userInfo.balance}}</span><span class="balance-wrap__contain__wrap__tip">(over 20 yuan can be withdrawn)</span>
        </p>
        <p class="balance-wrap__contain__wrap__totaltitle">Total revenue</p>
        <p class="balance-wrap__contain__wrap__totalbalance">{{userInfo.currencyType}}{{userInfo.income}}</p>
      </div>
    </div>
    <div class="balance-wrap__operate">
      <p class="balance-wrap__operate__wrap__input">
        <input type="text" class="balance-wrap__operate__input" placeholder="PayTM Account" v-model="myPay">
      </p>
      <p class="balance-wrap__operate__tip">Please enter your paytm account,we will be in the review,will be up to 15 working days to make money to you.</p>
      <p class="balance-wrap__operate__btn" @click="cashOut">Cash Out</p>
    </div>
    <balance-mark v-if="markInfo.showMark" :data-info="markInfo" @okEvent='okEvent' @cancelEvent = 'cancelEvent'></balance-mark>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BalanceMark from '../components/BalanceMark'
import Loading from '../components/loading'
import * as api from '../assets/js/api'
// import axios from 'axios'
// import utils from '../assets/js/utils'
export default {
  name: 'Balance',
  data () {
    return {
      myPay: '',
      markInfo: {
        showMark: false,
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: ''
      },
      withdraw: 20,
      showLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  methods: {
    cashOut () {
      // 接口调试
      api.balanceApplication({
        // amount: this.userInfo.balance,
        // email: this.myPay,
        // accountId: this.myPay
        amount: 50,
        email: 'liuweiwei@apuscn.com',
        accountId: 'liuweiwei@apuscn.com'
      })
        .then((data) => {
          console.log('后台返回结果如下')
          console.log(data)
        })
        .catch((err) => {
          console.log('发送错误如下')
          console.log(err)
        })
      // -----------------
      // if (+this.userInfo.balance < +this.withdraw) {
      //   this.changeMarkInfo(true, false, 0, `Withdraw now failed!Your balance is less than ${this.userInfo.currencyType}${this.withdraw},please continue to work hard!`)
      // } else {
      //   const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.com)+$/
      //   const passRule = emailReg.test(this.myPay)
      //   if (!passRule) {
      //     this.changeMarkInfo(true, false, 0, `Please enter the correct PayTM account!`)
      //   } else {
      //     this.changeMarkInfo(true, true, 1, `Your collection account is:<p><b>${this.myPay}</b></p>please confirm the correctness of the account!`)
      //   }
      // }
    },
    okEvent (info) {
      this.markInfo.showMark = false
      if (info) {
        // 提交表单
        this.showLoading = true
        api.balanceApplication({
          amount: this.userInfo.balance,
          email: this.myPay,
          accountId: this.myPay
        })
          .then(({data}) => {
            console.log('后台返回结果如下')
            console.log(data)
            this.showLoading = false
            if (+data.code !== 0) {
              this.changeMarkInfo(true, false, 1, `请求失败，请确保网络畅通后重试。`, '重试')
            } else {
              this.changeMarkInfo(true, false, 0, `提交成功，奖金将在审核通过后到账。`)
            }
          })
          .catch((err) => {
            err && this.changeMarkInfo(true, false, 1, `请求失败，请确保网络畅通后重试。`, '重试')
          })
      }
    },
    cancelEvent () {
      this.markInfo.showMark = false
    },
    goBack () {
      this.$router.go(-1)
    },
    changeMarkInfo (showMark, shouldSub, markType, htmlText, okBtnText) {
      const okBtnInnerText = okBtnText || 'OK'
      this.markInfo = {
        showMark: showMark,
        shouldSub: shouldSub,
        markType: markType,
        htmlText: htmlText,
        okBtnText: okBtnInnerText
      }
    }
  },
  components: {
    BalanceMark,
    Loading
  }
}
</script>
<style scoped lang="less" type="text/less">
.balance-wrap {
  width: 100%;
  height: 100%;
  background: url('../assets/images/balance-bg.jpg') no-repeat top left;
  background-size: cover;
  padding: 0 25px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  &__title {
    width: 100%;
    height: 54px;
    margin: 24px 0 79px 0;
    box-sizing: border-box;
    font-size: 28px;
    font-family: 'Roboto-Medium';
    color: #fff;
    display: flex;
    align-items: center;
    &__back {
      display: inline-block;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .2);
      font-size: 24px;
      text-align: center;
      line-height: 54px;
    }
    &__nickname {
      width: 100%;
      text-align: center;
      flex: 1;
    }
  }
  &__contain {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 384px;
    &__wrap {
      width: 100%;
      min-height: 384px;
      background: #fff;
      border-radius: 24px;
      padding: 64px;
      box-sizing: border-box;
      position: relative;
      color: #241262;
      &__img {
        position: absolute;
        width: 103px;
        height: 103px;
        border-radius: 50%;
        top: -51px;
        right: 55px;
      }
      &__symbol {
        font-family: 'Roboto-BoldCondensed';
      }
      &__mytitle, &__totaltitle {
        font-size: 28px;
        font-family: 'Roboto-Light';
      }
      &__mybalance, &__totalbalance {
        font-size: 52px;
        font-family: 'Roboto-BoldCondensed';
        margin: 20px 0 58px 0;
      }
      &__totalbalance {
        margin: 20px 0 0px 0;
      }
      &__tip {
        font-size: 26px;
        font-family: 'Roboto-Light';
        color: #7B7B7B;
        margin-left: 22px;
      }
    }
  }
  &__operate {
    width: 100%;
    height: 314px;
    margin-bottom: 85px;
    display: block;
    overflow: hidden;
    &__wrap__input {
      width: 100%;
      height: 94px;
      background: #fff;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__input {
      display:inline-block;
      width: 100%;
      background: #fff;
      border: none;
      outline: none;
      color: #241262;
      font-size: 36px;
      font-family: 'Roboto-Light';
      margin-left: 35px;
    }
    &__input:focus {
      box-shadow: none;
      -webkit-tap-highlight-color:rgba(0,0,0,0);
      -webkit-user-modify:read-write-plaintext-only;
      outline:0;
    }
    &__input::-webkit-input-placeholder{
      width: 100%;
    }
    &__input:-ms-input-placeholder{
      color: #9F9EA1;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
    }
    &__tip {
      width: 100%;
      color: #fff;
      font-family: 'Roboto-Light';
      font-size: 24px;
      line-height: 30px;
      margin: 27px 0 39px 0;
    }
    &__btn {
      width: 100%;
      height: 94px;
      border-radius: 46px;
      color: #fff;
      background: rgba(250,167,23, 0.95);
      text-align: center;
      line-height: 94px;
      font-size: 36px;
      font-family: 'Roboto-Light';
    }
  }
}
</style>
