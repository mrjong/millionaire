<template>
  <div class="base-info">
    <div class="base-info__user">
        <div class="base-info__user__head"
             :style="{backgroundImage:'url('+ baseInfo.avatar +')'}"></div>
        <p class="base-info__user__name">{{baseInfo.userName}}</p>
      </div>
    <div class="base-info__other">
      <router-link to="/balance">
        <div class="base-info__other__balance">
          <p class="base-info__other__balance__text">Balance</p>
          <p class="base-info__other__balance__num num">{{baseInfo.currencyType }}{{baseInfo.balance}}</p>
        </div>
      </router-link>
      <p class="base-info__other__line"></p>
      <router-link to="/rank">
        <div class="base-info__other__rank">
          <p class="base-info__other__rank__text">Weekly Rank</p>
          <p class="base-info__other__rank__num num">{{baseInfo.rank}}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: {
    baseInfo: Object
  },
  data () {
    return {}
  }
}
</script>
<style scoped lang="less" type="text/less">
  .base-info{
    width: 670px;
    height: 463px;
    background-color: #ffffff;
    border-radius: 46px;
    margin:113px auto 25px;
    padding: 0.5px;
    &__user{
      margin: -70px auto;
      text-align: center;
      &__head{
        width:160px;
        height:160px;
        border-radius: 50%;
        background: no-repeat center;
        background-size: cover;
        margin: 0 auto;
      }
      &__name{
        margin-top: 30px;
        color: #241262;
        font: 36px Roboto-Medium;
      }
    }
    &__other{
      display: flex;
      margin-top: 156px;
      justify-content: center;
      &__line{
        height: 76px;
        border:1px solid #e0ddea;
        margin: 0 93px;
        align-self: center;
      }
      &__balance, &__rank {
        font-size: 28px;
        color: #241262;
        text-align: center;
        &__text{
          font-family: Roboto-Light;
        }
        .num{
          font-size: 56px;
          margin-top: 26px;
          color: #241262;
          font-family: Roboto-BoldCondensed;
        }
      }
    }
  }
</style>
