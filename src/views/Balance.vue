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
         <img :src="userInfo.avatar" class="balance-wrap__contain__wrap__img">
        <p class="balance-wrap__contain__wrap__mytitle">Your Balance</p>
        <div class="balance-wrap__contain__wrap__mybalance">
          <p class="balance-wrap__contain__wrap__symbol">
            {{userInfo.currencyType}}{{isOnline ? userInfo.balanceShow : userInfo.clientBalanceShow}}
          </p>
        </div>
        <p class="balance-wrap__contain__wrap__totaltitle">Total Revenus</p>
        <p class="balance-wrap__contain__wrap__totalbalance">{{userInfo.currencyType}}{{userInfo.incomeShow}}</p>
      </div>
      <p class="balance-hint">(You can cash out with the minimum balance of ₹150,The payouts will be made in 7 days after Approved)</p>
    </div>
    <div class="balance-wrap__operate">
      <p class="balance-wrap__operate__btn" @click="cashOut">Cash Out</p>
    </div>
    <p class="bottom-text">
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'>User Agreement</a> &
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'>Privacy Policy</a>
    </p>
    <login-tip v-if="showLogin" @loginTipClose="showLogin = false" desp="You can't cash out without logging in. If you don't login within 24 hours, your balance will be reset to zero after that."></login-tip>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Loading from '../components/Loading'
import utils from '../assets/js/utils'
import LoginTip from '../components/LoginTip'
export default {
  name: 'Balance',
  data () {
    return {
      // showLogin: true,
      showLogin: !this.$store.getters.isOnline && (+this.$store.getters.userInfo.clientBalance > 0),
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
      } else {
        this.$router.push({path: '/balance-detail'})
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    history () {
      utils.statistic('take_cash_page', 1, {to_destination_s: 'withdrawal_history'}, 'take_cash_page')
    }
  },
  components: {
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
      margin: 30px auto 0;
      text-align: center;
      font-weight: 300;
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
    display: block;
    margin-bottom: 50px;
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
