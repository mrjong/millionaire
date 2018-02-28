<template>
  <div class="await-container">
    <div class="await-container__top">
      <div class="await-container__top__like"></div>
      <div class="await-container__top__instructions"></div>
    </div>
    <img src="../assets/images/await-title.png" class="await-container__title">
    <next-time nextTime="" :money="userInfo.bonusAmount" :currencyType="userInfo.currencyType"></next-time>
    <base-info :baseInfo="userInfo"></base-info>
    <div class="await-container__btn">
        <base-btn :baseStyle="baseStyle1"></base-btn>
        <base-btn :baseStyle="baseStyle2"></base-btn>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BaseBtn from '../components/BaseBtn.vue'
import NextTime from '../components/NextTime.vue'
import BaseInfo from '../components/BaseInfo.vue'
import * as type from '../store/type'
export default {
  name: 'Await',
  data () {
    return {
      baseStyle1: {
        text: 'Invite Friends',
        bgColor: '#f19f20'
      },
      baseStyle2: {
        text: 'Leaderboards',
        bgColor: '#4c0aee'
      },
      nextTime: '2.18 16:30',
      money: '10000',
      baseInfo: {
        head: 'http://images.apusapps.com/src/icon-apus-user-system.png',
        name: 'zhangpanpan',
        balance: '5267.8',
        rank: '1258'
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.$store.dispatch(type.HOME_UPDATE)
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
    background: url("../assets/images/await-bg.jpg") no-repeat center;
    background-size: cover;
    &__top{
      width: 100%;
      display: flex;
      padding: 25px 25px 0;
      justify-content: space-between;
      &__like, &__instructions{
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
      }
      &__like{
        /*content: '\dafd';*/
      }
      &__instructions{
        /*content: '\dafd';*/
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
</style>
