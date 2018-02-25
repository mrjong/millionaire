<template>
  <div class="await-container">
    <div class="await-container__top-btn"></div>
    <img src="../assets/images/await-title.png" class="await-container__title">
    <next-time :nextTime="nextTime" :money="money"></next-time>
    <base-info :baseInfo="baseInfo"></base-info>
    <div class="await-container__btn">
        <base-btn :baseStyle="baseStyle1"></base-btn>
        <base-btn :baseStyle="baseStyle2"></base-btn>
    </div>
  </div>
</template>

<script>
import BaseBtn from '../components/BaseBtn.vue'
import NextTime from '../components/NextTime.vue'
import BaseInfo from '../components/BaseInfo.vue'
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
    &__title{
      padding-top: 120px;
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
