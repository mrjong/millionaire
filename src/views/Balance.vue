<template>
  <div class="balance-wrap">
    <div class="balance-wrap__title">
      <p class="balance-wrap__title__back iconfont icon-fanhui" @click="goBack"></p>
      <p class="balance-wrap__title__nickname">{{userInfo.userName}}</p>
    </div>
    <div class="balance-wrap__contain">
      <div class="balance-wrap__contain__wrap">
         <img :src="userInfo.avatar" alt="" class="balance-wrap__contain__wrap__img">
        <p class="balance-wrap__contain__wrap__mytitle">Your Balance</p>
        <p class="balance-wrap__contain__wrap__mybalance">
          <span class="balance-wrap__contain__wrap__symbol">{{userInfo.currencyType}}{{userInfo.balance}}</span><span class="balance-wrap__contain__wrap__tip">(You can cash out with the minimum balance of {{userInfo.currencyType}}{{withdraw}})</span>
        </p>
        <p class="balance-wrap__contain__wrap__totaltitle">Total Revenus</p>
        <p class="balance-wrap__contain__wrap__totalbalance">{{userInfo.currencyType}}{{userInfo.income}}</p>
      </div>
    </div>
    <div class="balance-wrap__operate">
      <p class="balance-wrap__operate__wrap__input">
        <input type="text" class="balance-wrap__operate__input" placeholder="Paytm Account" v-model="myPay">
      </p>
      <p class="balance-wrap__operate__tip">Please verify that your Paytm account is a valid account, and the payouts will be made in 15 days.</p>
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
import * as type from '../store/type'
import utils from '../assets/js/utils'
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
      withdraw: 150, // 可提现金额
      showLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    utils.statistic('wait_page', 0)
  },
  methods: {
    cashOut () {
      if (+this.userInfo.balance < +this.withdraw) {
        this.changeMarkInfo(true, false, 0, `Sorry you need a minimum balance of ${this.userInfo.currencyType} ${this.withdraw} to cash out. Win more games to get it!`)
      } else {
        // const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.com)+$/
        // const passRule = emailReg.test(this.myPay)
        const phone = /^\d{10}$/
        const passRule = phone.test(this.myPay)
        if (!passRule) {
          this.changeMarkInfo(true, false, 0, `Please enter a valid Paytm account!`)
        } else {
          this.changeMarkInfo(true, true, 1, `Your Paytm account is <p><b>${this.myPay}</b></p>.Do you want to cash out now?`)
        }
      }
    },
    okEvent (info) {
      this.markInfo.showMark = false
      if (info) {
        // 提交表单
        this.showLoading = true
        api.balanceApplication({
          amount: this.userInfo.balance,
          email: '',
          accountId: this.myPay
        })
          .then(({data}) => {
            console.log('提现申请后台返回结果如下')
            console.log(data)
            let takeCash = ''
            this.showLoading = false
            if (+data.result === 1) {
              if (+data.code !== 0) {
                if (+data.code === 3106) { // 账户记录不存在
                  this.changeMarkInfo(true, false, 0, `Records about your account doesn't exist.`)
                  takeCash = 'bad_account'
                } else if (+data.code === 3116) { // 可用金额不足
                  this.changeMarkInfo(true, false, 0, `Your account balance is not enough.`)
                  takeCash = 'no_enough_money'
                } else {
                  this.changeMarkInfo(true, false, 1, `Loading error, please check your internet now.`, 'Retry')
                  takeCash = 'network_error'
                }
              } else {
                this.changeMarkInfo(true, false, 0, `Success! You’ll receive your balance after reviewing.`)
                this.$store.dispatch(type._INIT)
                takeCash = 'success'
              }
              utils.statistic('', 4, {
                result_code_s: takeCash
              })
            } else {
              this.changeMarkInfo(true, false, 1, `Loading error, please check your internet now.`, 'Retry')
              utils.statistic('', 4, {
                result_code_s: 'network_error'
              })
            }
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
        markType: markType, // 是否有cancel按钮
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
      text-align: center;
      flex: 1;
      padding-right: 54px;
    }
  }
  &__contain {
    width: 100%;
    height: 100%;
    flex: 1;
    // margin-bottom: 150px;
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
        // height: 103px;
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
