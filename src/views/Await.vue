<template>
  <div class="await-container">
    <div class="await-container__top">
      <a class="await-container__top__like icon-dianzan iconfont" href="https://m.facebook.com/APUS-Browser-1532330666785144/">
      </a>
      <div>
        <router-link to="/rule">
          <div class="await-container__top__instructions icon-youxishuoming iconfont"></div>
        </router-link>
      </div>
    </div>
    <img src="../assets/images/await-title.png" class="await-container__title">
    <next-time :nextTime="targetDate" :money="userInfo.bonusAmount" :currencyType="userInfo.currencyType"></next-time>
    <base-info :baseInfo="userInfo"></base-info>
    <div class="await-container__btn">
        <base-btn :baseStyle="baseStyle1" @inviteFriends="inviteFriends"></base-btn>
        <router-link to="/rank">
          <base-btn :baseStyle="baseStyle2"></base-btn>
        </router-link>
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
        text: 'Invite Friends',
        bgColor: '#faa717'
      },
      baseStyle2: {
        text: 'Leaderboards',
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
        return 'coming soon'
      } else {
        let nowDate = new Date(new Date().getTime() + this.startTime * 1000)
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
        return month + '.' + day + ' ' + hour + ':' + minute
      }
    }
  },
  mounted () {
    this.$store.dispatch(type.HOME_UPDATE)
  },
  methods: {
    DateFormatter () {
      let nowDate = new Date(new Date().getTime() + this.startTime * 1000)
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
      this.targetDate = month + '.' + day + ' ' + hour + ':' + minute
    },
    inviteFriends () {
      utils.share()
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
  .await-container{
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
      padding-top: 60px;
      width: 400px;
      margin: 0 auto;
    }
    &__btn{
      display: flex;
      padding:0 25px;
      justify-content: space-between;
    }
  }
  @media screen and (max-width: 321px){
    .await-container{
      &__title{
        padding-top: 50px;
      }
    }
  }
</style>
