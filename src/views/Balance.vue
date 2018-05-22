<template>
  <div class="balance-wrap">
    <div class="balance-wrap__title">
      <p class="balance-wrap__title__back iconfont icon-fanhui" @click="goBack"></p>
      <p class="balance-wrap__title__nickname">{{userInfo.userName}}</p>
      <router-link to="/balance-record" @click="history" v-if="isOnline">
        <p class="balance-wrap__title__history">History</p>
      </router-link>
    </div>
    <div class="balance-wrap__contain">
      <div class="balance-wrap__contain__wrap">
         <img :src="userInfo.avatar" alt="" class="balance-wrap__contain__wrap__img">
        <p class="balance-wrap__contain__wrap__mytitle">Your Balance</p>
        <div class="balance-wrap__contain__wrap__mybalance">
          <p class="balance-wrap__contain__wrap__symbol">
            {{userInfo.currencyType}}{{isOnline ? userInfo.balanceShow : userInfo.clientBalanceShow}}
          </p>
        </div>
        <p class="balance-wrap__contain__wrap__totaltitle">Total Revenus</p>
        <p class="balance-wrap__contain__wrap__totalbalance">{{userInfo.currencyType}}{{userInfo.incomeShow}}</p>
      </div>
      <p class="balance-hint">(You can cash out with the minimum balance of ₹150)</p>
    </div>
    <div class="balance-wrap__operate">
      <p class="balance-wrap__operate__wrap__input">
        <input type="text" class="balance-wrap__operate__input" placeholder="Name" maxlength="100" v-model="name">
      </p>
      <p class="balance-wrap__operate__wrap__input">
        <input type="text" class="balance-wrap__operate__input" placeholder="Permanent Account Number" v-model="pan">
      </p>
      <p class="balance-wrap__operate__wrap__input">
        <input type="text" class="balance-wrap__operate__input" placeholder="Paytm Account" v-model="myPay">
      </p>
      <p class="balance-wrap__operate__btn" @click="cashOut">Cash Out</p>
      <p class="balance-wrap__operate__tip">The payouts will be made in 7 days after Approved</p>
    </div>
    <balance-mark v-if="markInfo.showMark" :data-info="markInfo" @okEvent='okEvent' @cancelEvent = 'cancelEvent'></balance-mark>
    <login-tip v-if="showLogin" @loginTipClose="showLogin = false" desp="You can't cash out without logging in. If you don't login within 24 hours, your balance will be reset to zero after that."></login-tip>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BalanceMark from '../components/BalanceMark'
import Loading from '../components/Loading'
import * as api from '../assets/js/api'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import LoginTip from '../components/LoginTip'
export default {
  name: 'Balance',
  data () {
    return {
      // showLogin: true,
      showLogin: !this.$store.getters.isOnline && (+this.$store.getters.userInfo.clientBalance > 0),
      myPay: '',
      name: '',
      pan: '',
      markInfo: {
        showMark: false,
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: ''
      },
      withdraw: 150, // 可提现金额(按元展示，按分比较)
      showLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      isOnline: 'isOnline'
    })
  },
  mounted () {
    utils.statistic('take_cash_page', 0)
  },
  methods: {
    cashOut () {
      if (!utils.isOnline && +this.userInfo.clientBalance > 0) {
        this.showLogin = true
      } else if (+this.userInfo.balance < (+this.withdraw) * 100) {
        this.changeMarkInfo(true, false, 0, `Sorry you need a minimum balance of ${this.userInfo.currencyType} ${this.withdraw} to cash out. Win more games to get it!`)
      } else {
        // const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.com)+$/
        const phone = /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/
        const panRule = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/
        const nameRule = /^([A-Za-z]+\s?)*[A-Za-z]{1,100}$/
        // const nameRule = /^[a-zA-Z]+\s[a-zA-Z]+{1,100}$/
        const isNamePass = nameRule.test(this.name)
        const isPass = panRule.test(this.pan)
        const passRule = phone.test(this.myPay)
        if (!isNamePass) {
          this.changeMarkInfo(true, false, 0, `Please enter the right name`)
          return false
        }
        if (!isPass) {
          this.changeMarkInfo(true, false, 0, `Please enter a right PAN ID`)
          return false
        }
        if (!passRule) {
          this.changeMarkInfo(true, false, 0, `Please enter a valid Paytm account!`)
          return false
        } else {
          this.changeMarkInfo(true, true, 1, `Your Paytm account is <p><b>${this.myPay}</b></p>Do you want to cash out now?`)
        }
      }
    },
    okEvent (info) {
      this.markInfo.showMark = false
      let takeCash = ''
      console.log('mypay' + this.myPay)
      console.log('name' + this.name)
      console.log('pan' + this.pan)
      if (info) {
        // 提交表单
        this.showLoading = true
        api.balanceApplication({
          amount: +this.userInfo.balance,
          email: '',
          accountId: this.myPay,
          name: this.name,
          pan: this.pan
        })
          .then(({data}) => {
            console.log('提现申请后台返回结果如下')
            console.log(data)
            this.showLoading = false
            if (+data.result === 1) { // 请求成功 code必为0
              if (+data.code === 0) {
                this.changeMarkInfo(true, false, 0, `Success! You’ll receive your balance after reviewing.`)
                this.$store.dispatch(type._INIT)
                takeCash = 'success'
              }
            } else { // 请求失败，判断code
              switch (+data.code) {
                case 3106: {
                  this.changeMarkInfo(true, false, 0, `Records about your account doesn't exist.`)
                  takeCash = 'bad_account'
                  break
                }
                case 3116: {
                  this.changeMarkInfo(true, false, 0, `Your account balance is not enough.`)
                  takeCash = 'no_enough_money'
                  break
                }
                case 3107: {
                  this.changeMarkInfo(true, false, 0, `客户端ID单日提现超过提现次数`)
                  takeCash = 'beyond_client_max_count_day'
                  break
                }
                case 3112: {
                  this.changeMarkInfo(true, false, 0, `单用户ID达到当天可提现次数上限`)
                  takeCash = 'beyond_user_max_count_day'
                  break
                }
                case 3113: {
                  this.changeMarkInfo(true, false, 0, `单用户ID达到当周可提现金额上限`)
                  takeCash = 'beyond_user_max_limit_week'
                  break
                }
                case 3114: {
                  this.changeMarkInfo(true, false, 0, `每日总提现金额上限`)
                  takeCash = 'beyond_max_limit_day'
                  break
                }
                default: {
                  this.changeMarkInfo(true, false, 1, `Loading error, please check your internet now.`, 'Retry')
                  takeCash = 'network_error'
                }
              }
            }
            utils.statistic('', 4, {
              result_code_s: takeCash
            })
          }, (error) => {
            this.changeMarkInfo(true, false, 1, `Loading error, please check your internet now.`, 'Retry')
            takeCash = 'network_error'
            console.log('提现失败:', error)
            utils.statistic('', 4, {
              result_code_s: takeCash
            })
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
    },
    history () {
      utils.statistic('take_cash_page', 1, {to_destination_s: 'withdrawal_history'}, 'take_cash_page')
    }
  },
  components: {
    BalanceMark,
    Loading,
    LoginTip
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
  display: flex;
  flex-direction: column;
  position: relative;
  &__title {
    width: 100%;
    height: 54px;
    margin: 24px 0 60px 0;
    box-sizing: border-box;
    font: 500 28px 'Roboto', Arial, serif;
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
      font-size: 36px;
      font-family: 'Roboto', Arial, serif;
    }
    &__history{
      color:#fff;
      font-size: 28px;
    }
  }
  &__contain {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 384px;
    .balance-hint{
        color: #fff;
        font-family: 'Roboto', Arial, serif;
        font-size: 24px;
        margin: 15px auto 0;
        text-align: center;
      }
    &__wrap {
      width: 100%;
      min-height: 384px;
      background: #fff;
      border-radius: 24px;
      padding: 44px;
      box-sizing: border-box;
      position: relative;
      color: #241262;
      &__img {
        position: absolute;
        width: 103px;
        border-radius: 50%;
        top: -51px;
        right: 55px;
      }
      &__symbol {
        font-family: 'Roboto Condensed', Arial, serif;
        font-weight: 700;
      }
      &__mytitle, &__totaltitle {
        font-size: 28px;
        font-family: 'Roboto', Arial, serif;
        font-weight: 300;
      }
      &__mybalance, &__totalbalance {
        font: 700 52px 'Roboto Condensed', Arial, serif;
        margin: 20px 0 40px 0;
      }
      &__totalbalance {
        margin: 20px 0 0px 0;
      }
      &__mybalance{
        display: flex;
        justify-content: space-between;
      }
      &__tip {
        width: 300px;
        height: 55px;
        font-size:28px;
        font-family:  'Roboto', Arial, serif;
        line-height: 55px;
        text-align: center;
        color: #241262;
        border-radius: 26px;
        box-shadow: 0 0 0 1px  rgba(36, 18, 98, 0.7);
        span {
          font-size:22px;
          color: #241262;
        }
      }
    }
  }
  &__operate {
    width: 100%;
    height: 314px;
    display: block;
    flex: 1;
    &__wrap__input {
      width: 100%;
      height: 94px;
      background: #fff;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 18px;
    }
    &__input {
      display:inline-block;
      width: 100%;
      background: #fff;
      border: none;
      outline: none;
      color: #241262;
      font: 300 36px 'Roboto', Arial, serif;
      padding: 0 35px;
      text-align: center;
    }
    &__input:focus {
      box-shadow: none;
      -webkit-tap-highlight-color:rgba(0,0,0,0);
      -webkit-user-modify:read-write-plaintext-only;
      outline:0;
    }
    &__input::-webkit-input-placeholder{
      width: 100%;
      text-align: center;
    }
    &__input:-ms-input-placeholder{
      color: #9F9EA1;
      text-align: center;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
      text-align: center;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
      text-align: center;
    }
    &__tip {
      color: #fff;
      font: 300 24px/30px 'Roboto', Arial, serif;
      text-align: center;
      margin: 27px auto 35px;
    }
    &__btn {
      width: 100%;
      height: 94px;
      border-radius: 46px;
      color: #fff;
      background: rgba(250,167,23, 0.95);
      text-align: center;
      font: 300 36px/94px 'Roboto', Arial, serif;
    }
  }
}
</style>
