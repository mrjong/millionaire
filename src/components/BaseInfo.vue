<template>
  <div class="base-info">
    <div class="base-info__user">
        <div class="base-info__user__head"
             :style="{backgroundImage:'url('+ baseInfo.avatar +')'}"></div>
        <p class="base-info__user__name">{{baseInfo.userName}}</p>
      </div>
    <div class="base-info__other">
      <router-link to="/balance" class="balance-router">
        <div class="base-info__other__balance">
          <p class="base-info__other__balance__text">Balance</p>
          <p class="base-info__other__balance__num num">{{baseInfo.currencyType }}{{baseInfo.balance}}</p>
        </div>
      </router-link>
      <div class="base-info__other__line"></div>
      <router-link to="/rank" class="balance-rank">
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
    border-radius: 24px;
    margin:113px auto 25px;
    padding: 0.5px;
    &__user{
      text-align: center;
      margin-top: -70px;
      &__head{
        width:160px;
        height:160px;
        border-radius: 50%;
        background: no-repeat center;
        background-size: cover;
        margin: 0 auto;
      }
      &__name{
        margin-top: 28px;
        color: #241262;
        font: 36px Roboto-Medium;
      }
    }
    &__other{
      display: flex;
      margin-top: 100px;
      justify-content: center;
      .balance-router, .balance-rank{
        width: 50%;
        display: block;
      }
      &__line{
        align-self: center;
        height: 76px;
        border: 1px solid rgba(36, 18, 98, 0.11);
      }
      &__balance, &__rank {
        margin: 0 auto;
        font-size: 28px;
        color: #241262;
        &__text{
          text-align: center;
          font-family: 'Roboto-Light';
        }
        .num{
          font-size: 56px;
          margin-top: 26px;
          color: #241262;
          text-align: center;
          font-family: 'Roboto-BoldCondensed';
        }
      }
    }
  }
  @media screen and (max-width: 321px){
   .base-info{
      &__other{
        &__line{
          border:5px solid #e0ddea;
          transform: scaleX(0.4);
        }
      }
    }
  }
</style>
