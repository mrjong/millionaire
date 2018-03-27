<template>
  <div class="await">
    <div class="await__top">
      <a class="await__top__like icon-dianzan iconfont"
         ref="toFbBrowser"
         @click="btnStatistic('like_page')"></a>
      <div>
        <router-link to="/rule">
          <div class="await__top__instructions icon-youxishuoming iconfont"
               @click="btnStatistic('help_page')"></div>
        </router-link>
      </div>
    </div>
    <div class="await__title">
      <img src="../assets/images/logo.png">
    </div>
    <next-time :nextTime="targetDate" :money="userInfo.bonusAmount" :currencyType="userInfo.currencyType"></next-time>
    <base-info :baseInfo="userInfo"></base-info>
    <router-link to="/set-question">
      <div class="await__set" @click="btnStatistic('issue_page')">
        <span class="await__set__icon icon-yonghuchuti_qianzise iconfont"></span>
        <p class="await__set__text">Set Questions Myself</p>
      </div>
    </router-link>
    <div class="await__btn">
      <router-link to="/rank">
        <base-btn :baseStyle="baseStyle2"  @click="btnStatistic('rank_page')"></base-btn>
      </router-link>
      <base-btn :baseStyle="baseStyle1" @inviteFriends="inviteFriends"></base-btn>
    </div>
    <div class="await__bottom">
      <img src="../assets/images/apus-logo.png" class="await__bottom__apus">
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BaseBtn from '../components/BaseBtn.vue'
import NextTime from '../components/NextTime.vue'
import BaseInfo from '../components/BaseInfo.vue'
import * as type from '../store/type'
import utils from '../assets/js/utils'
export default {
  name: 'Await',
  data () {
    return {
      baseStyle1: {
        text: 'Share with friends',
        bgColor: '#dc427a'
      },
      baseStyle2: {
        text: 'Leaderboard',
        bgColor: '#4c08f3'
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      startTime: 'startTime',
      status: 'status'
    }),
    targetDate () {
      if (this.startTime === -1) {
        return ['', 'Coming Soon']
      } else if (this.startTime === 0) {
        return ['', 'Living']
      } else {
        let nowDate = new Date(this.startTime)
        let month = nowDate.getMonth() + 1
        let day = nowDate.getDate()
        let hour = nowDate.getHours()
        let minute = nowDate.getMinutes()
        if (month <= 9) {
          month = '0' + month
        }
        if (day <= 9) {
          day = '0' + day
        }
        if (minute <= 9) {
          minute = '0' + minute
        }
        return [month + '/' + day, hour + ':' + minute]
      }
    }
  },
  mounted () {
    this.$store.dispatch(type.HOME_UPDATE)
    this.$nextTick(() => {
      const bodys = document.getElementsByTagName('body')[0]
      const bodyHeight = bodys.clientHeight
      bodys.style.height = bodyHeight + 'px'
    })
    this.toFb()
    utils.statistic('wait_page', 0)
  },
  methods: {
    inviteFriends () {
      utils.share()
      utils.statistic('millionaire', 3, {}, 'wait_page')
    },
    toFb () {
      let toFbBrowser = this.$refs.toFbBrowser
      const isFbApp = window.njordGame && window.njordGame.isPackageInstalled('com.facebook.katana')
      if (isFbApp) {
        toFbBrowser.setAttribute('href', 'fb://page/1532330666785144')
      } else {
        toFbBrowser.setAttribute('href', 'https://m.facebook.com/APUS-Browser-1532330666785144')
      }
    },
    btnStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    }
  },
  components: {
    BaseBtn,
    NextTime,
    BaseInfo
  }
}
</script>
<style scoped lang="less" type="text/less">
  .await{
    width: 100%;
    height: 100%;
    background: url("../assets/images/await-bg.jpg") no-repeat top left;
    background-size: cover;
    &__top{
      display: flex;
      padding: 25px 25px 0;
      justify-content: space-between;
      &__like, &__instructions{
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        font-size: 24px;
        text-align: center;
        align-self: center;
        line-height: 54px;
      }
      &__like{
        display: block;
      }
      &__instructions{
        font-size: 28px;
      }
      &__logo{
        width: 168px;
        align-self: center;
        img{
          width: 100%;
        }
      }
    }
    &__title{
      width: 400px;
      margin: 0 auto;
      img{
        width: 100%;
      }
    }
    &__btn{
      display: flex;
      padding:0 25px;
      justify-content: space-between;
    }
    &__set{
      width: 656px;
      height: 90px;
      background-color: #faa717 ;
      font:32px 'Roboto Regular';
      border-radius: 46px;
      color: #fff;
      margin:0 auto 30px ;
      text-align: center;
      &__text{
        display: inline-block;
        line-height: 90px;
        font: 300 .32rem/.93rem Roboto;
      }
      &__icon{
        display: inline-block;
        width: 50px;
        height: 90px;
        line-height: 90px;
        font-size: 32px;
      }
    }
    &__bottom{
      width: 100%;
      position: absolute;
      bottom: 10px;
      &__apus{
        width: 134px;
        margin: 0 auto;
        font-family: 'Roboto', Arial, serif;
        font-weight: 400;
      }
    }
  }
</style>
