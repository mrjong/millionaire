<template>
  <div class="base-info">
    <div class="base-info__user">
        <div class="base-info__user__head"
             :style="{backgroundImage:'url('+ baseInfo.avatar +')'}"></div>
        <p class="base-info__user__name">{{baseInfo.userName}}</p>
      </div>
    <div class="base-info__other">
      <router-link to="/balance" class="balance-router" >
        <div class="base-info__other__balance" @click="routerStatistic('take_cash_page')">
          <p class="base-info__other__balance__text">Balance</p>
          <p class="base-info__other__balance__num num">{{baseInfo.currencyType }}{{baseInfo.balance}}</p>
        </div>
      </router-link>
      <div class="base-info__other__line"></div>
      <router-link to="/rank" class="balance-rank">
        <div class="base-info__other__rank"  @click="routerStatistic('rank_page')">
          <p class="base-info__other__rank__text">Weekly Rank</p>
          <p class="base-info__other__rank__num num">{{baseInfo.rank !== -1? baseInfo.rank: '-'}}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
export default {
  name: 'BaseInfo',
  props: {
    baseInfo: Object
  },
  data () {
    return {}
  },
  methods: {
    routerStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .base-info{
    width: 670px;
    background-color: #ffffff;
    border-radius: 24px;
    margin:100px auto 25px;
    padding: 0.5px;
    padding-bottom: 80px;
    &__user{
      text-align: center;
      transform: translate(0, -70px);
      &__head{
        width:160px;
        height:160px;
        border-radius: 50%;
        background: no-repeat center;
        background-size: cover;
        margin: 0 auto;
      }
      &__name{
        color: #241262;
        font: 36px 'Roboto-Medium';
        width: 60%;
        text-align: center;
        margin: 0.28px auto;
      }
    }
    &__other{
      display: flex;
      margin-top: 20px;
      justify-content: center;
      .balance-router, .balance-rank{
        width: 50%;
        display: block;
      }
      &__line{
        align-self: center;
        width: 2px;
        height: 76px;
        opacity: 0.5;
        background-color: #e0ddea;
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
     margin:80px auto 25px;
     padding-bottom: 80px;
      &__other{
        margin-top: 20px;
        &__line{
          border:5px solid #e0ddea;
          opacity: 0.5;
          transform: scaleX(0.4);
        }
      }
    }
  }
</style>
