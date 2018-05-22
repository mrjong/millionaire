<template>
  <div class="balance-detail">
    <div class="balance-detail__title">
      <p class="balance-detail__title__back iconfont icon-fanhui" @click="goBack"></p>
      <p class="balance-detail__title__nickname">Cash Out</p>
    </div>
    <div class="balance-detail__info">
      <p class="balance-detail__info__title">Withdraw Cash</p>
      <p class="balance-detail__info__money">{{userInfo.currencyType}}{{userInfo.balanceShow}}</p>
    </div>
    <div class="balance-detail__operate">
      <p class="balance-detail__operate__wrap__input">
        <input type="text" class="balance-detail__operate__input" placeholder="Name" maxlength="100" v-model="name">
      </p>
      <p class="balance-detail__operate__wrap__input">
        <input type="text" class="balance-detail__operate__input" placeholder="Permanent Account Number" v-model="pan">
      </p>
      <p class="balance-detail__operate__wrap__input">
        <input type="text" class="balance-detail__operate__input" placeholder="Paytm Account" v-model="myPay">
      </p>
      <p class="balance-detail__operate__wrap__hint">Notice: The info above will be submitted to paytm for cash out. Currently, only India rupee are available to be withdrawn in our game.</p>
    </div>
    <div>
      <p class="balance-detail__operate__btn" @click="cashOut">Cash Out</p>
    </div>
    <p class="bottom-text">
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'>User Agreement</a> &
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'>Privacy Policy</a>
    </p>
    <balance-mark v-if="markInfo.showMark" :data-info="markInfo" @okEvent='okEvent' @cancelEvent = 'cancelEvent'></balance-mark>
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
export default {
  name: 'BalanceDetail',
  data () {
    return {
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
    utils.statistic('take_cash_detail_page', 0)
  },
  methods: {
    cashOut () {
      if (+this.userInfo.balance < (+this.withdraw) * 100) {
        this.changeMarkInfo(true, false, 0, `Sorry you need a minimum balance of ${this.userInfo.currencyType} ${this.withdraw} to cash out. Win more games to get it!`)
      } else {
        const phone = /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/
        const panRule = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/
        const nameRule = /^([A-Za-z]+\s?)*[A-Za-z]{1,64}$/
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
    }
  },
  components: {
    BalanceMark,
    Loading
  }
}
</script>
<style scoped lang="less" type="text/less">
.balance-detail {
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
  }
  &__info{
    color:#fff;
    &__title{
      font: 400 28px 'Roboto', Arial, serif;
    }
    &__money{
      font: 800 56px 'Roboto', Arial, serif;
      margin: 30px 0 40px;
    }
  }
  &__operate {
    width: 100%;
    height: 314px;
    display: block;
    flex: 1;
    &__wrap{
      &__hint{
        color:#fda800;
        font: 200 24px 'Roboto', Arial, serif;
      }
    }
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
      font: 200 24px/30px 'Roboto', Arial, serif;
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
      margin-bottom: 50px;
    }
  }
}
.bottom-text{
  margin-bottom: 25px;
  font: 200 24px 'Roboto', Arial, serif;
  color: #fff;
  text-align: center;
  a{
    color:#fff;
  }
}
</style>
