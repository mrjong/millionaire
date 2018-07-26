<template>
  <div class="balance-wrap bg-reset" v-webp.bg="`url('balance-bg.jpg')`">
    <div class="balance-wrap__title">
      <p class="balance-wrap__title__back iconfont icon-fanhui" @click="goBack"></p>
      <p class="balance-wrap__title__nickname ellipsis-1">{{userInfo.userName}}</p>
      <router-link to="/balance-record" @click="history" v-if="isOnline">
        <p class="balance-wrap__title__history">{{$t('balance.history')}}</p>
      </router-link>
    </div>
    <div class="balance-wrap__contain">
      <div class="balance-wrap__contain__wrap">
        <div class="head" @click="login">
          <img :src="userInfo.avatar" class="balance-wrap__contain__wrap__img">
          <p class="login-text" v-if="!isOnline">{{$t('await.login_text')}}</p>
        </div>
        <p class="balance-wrap__contain__wrap__mytitle">{{$t('balance.your_blance')}}</p>
        <div class="balance-wrap__contain__wrap__mybalance">
          <p class="balance-wrap__contain__wrap__symbol">
            {{userInfo.currencyType}}{{isOnline ? userInfo.balanceShow : userInfo.clientBalanceShow}}
          </p>
        </div>
        <p class="balance-wrap__contain__wrap__totaltitle">{{$t('balance.total_revenus')}}</p>
        <p class="balance-wrap__contain__wrap__totalbalance">{{userInfo.currencyType}}{{userInfo.incomeShow}}</p>
      </div>
      <p class="balance-hint">{{$t('balance.hint')}}</p>
    </div>
    <div class="balance-wrap__operate">
      <p class="balance-wrap__operate__btn" @click="cashOut">{{$t('balance.cash_out_btn')}}</p>
    </div>
    <policy-link></policy-link>
    <login-tip v-if="showLogin" @loginTipClose="showLogin = false" desp="You can't cash out without logging in. If you don't login within 24 hours, your balance will be reset to zero after that."></login-tip>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Loading from '../components/Loading'
import utils from '../assets/js/utils'
import LoginTip from '../components/LoginTip'
import PolicyLink from '../components/PolicyLink'
import * as type from '../store/type'
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
      utils.statistic('take_cash_btn', 1, {to_destination_s: 'cash_info_page'})
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
    },
    login () {
      utils.statistic('user_login', 1, {'to_destination_s': utils.isOnline ? 'user_profile_page' : 'sigh_up'})
      if (utils.isOnline) {
        this.$router.push({path: '/user-center'})
      } else {
        utils.login(() => {
          this.$store.dispatch(type._INIT)
        })
      }
    }
  },
  components: {
    Loading,
    LoginTip,
    PolicyLink
  }
}
</script>
<style scoped lang="less" type="text/less">
.balance-wrap {
  width: 100%;
  height: 100%;
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
      .head {
        position: absolute;
        width: 103px;
        height: 103px;
        border-radius: 50%;
        top: -51px;
        right: 55px;
        overflow: hidden;
        img {
          width: 103px;
          height: 103px;
        }
       .login-text{
          width: 100%;
          height: 45%;
          padding-top: 10px;
          position: absolute;
          bottom: 0;
          color: #ffffff;
          text-align: center;
          font: 24px 'Roboto Condensed', Arial, sans-serif;
        }
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
</style>
