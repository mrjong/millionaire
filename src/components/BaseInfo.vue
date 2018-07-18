<template>
  <div class="base-info">
    <div class="base-info__user">
        <!-- <div class="base-info__user__head" :style="{backgroundImage:'url('+ baseInfo.avatar +')'}" @click="login">
          <p class="login-text" v-if="!isOnline">{{$t('await.login_text')}}</p>
        </div> -->
        <!-- <p class="base-info__user__name" @click="login">{{baseInfo.userName}}</p> -->
    </div>
    <div class="base-info__other">
      <router-link to="/balance" class="balance-router" >
        <div class="base-info__other__balance" @click="routerStatistic('take_cash_page')">
          <p class="base-info__other__balance__text">{{$t('await.userinfo_blance_text')}}</p>
          <p class="base-info__other__balance__num num"
             ref="balanceNum"
             :style="{fontSize: baseInfo.balanceShow.length > 9 ? '0.45rem' : '0.55rem'}">{{baseInfo.currencyType }}{{ isOnline ? baseInfo.balanceShow : baseInfo.clientBalanceShow}}</p>
        </div>
      </router-link>
      <div class="base-info__other__line"></div>
      <router-link to="/rank" class="balance-rank">
        <div class="base-info__other__rank"  @click="routerStatistic('rank_page')">
          <p class="base-info__other__rank__text">{{$t('await.userinfo_rank_text')}}</p>
          <p class="base-info__other__rank__num num" :style="{fontSize: baseInfo.balanceShow.length > 9 ? '0.45rem' : '0.55rem'}">{{baseInfo.rank !== -1? baseInfo.rank: '-'}}</p>
        </div>
      </router-link>
    </div>
    <div class="base-info__btn">
      <div class="invitation-code">
        <div class="extra-lives">
          <div style="position: relative;">
            <span class="extra-lives__icon"></span>
            <living class="invite-living" v-if="inviteLiving"></living>
          </div>
          <span class="extra-lives__text">{{$t('await.extra_lives_text')}} {{lives}}</span>
        </div>
      </div>
      <div class="get-lives">
        <div class="invitation-code__btn" @click="toExtraLiveRules">{{$t('await.get_more_text')}}</div>
      </div>
      <div class="share-success" ref="shareSuccessCard" v-if="isSucceed">
        <p class="share-success__text">SUCCESS</p>
        <div class="share-success__base">
          <img src="../assets/images/heart-light.png" class="heart">
        </div>
        <p class="share-success__num">+1</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import { _INIT } from '../store/type'
import Living from './Living'

export default {
  name: 'BaseInfo',
  props: {
    baseInfo: Object
  },
  data () {
    return {
      inviteLiving: false,
      isSucceed: false
    }
  },
  components: {
    Living
  },
  computed: {
    ...mapGetters(['isOnline', 'code', 'lives'])
  },
  watch: {
    // 复活卡心心抖动效果
    lives: function (val, oldVal) {
      if (val > oldVal) {
        this.inviteLiving = true
        setTimeout(() => {
          this.inviteLiving = false
        }, 3000)
      }
    }
  },
  methods: {
    routerStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    },
    login (path) {
      utils.login(() => {
        this.logout = false
        utils.statistic('wait_page', 1, {'result_code_s': '1'}, 'wait_page')
        this.$store.dispatch(_INIT)
        if (path) {
          this.$router.push({path: path, query: {'code': this.code}})
        }
      })
    },
    // 按钮打点
    btnStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    },
    toExtraLiveRules () {
      this.btnStatistic('referral_code_page')
      if (utils.isOnline) {
        this.$router.push({path: '/share-detail', query: {'code': this.code}})
      } else {
        this.login('/share-detail')
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .base-info{
    max-width: 93% !important;
    width: 670px;
    background-color: #ffffff;
    border-radius: 24px;
    margin:0 auto 25px;
    padding: 62px 0 46px;
    position: relative;
    &__user{
      // text-align: center;
      // margin-bottom: 40px;
      &__head{
        width:150px;
        height:150px;
        border-radius: 50%;
        background: no-repeat center;
        background-size: cover;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        .login-text{
          width: 100%;
          height: 40%;
          padding-top: 10px;
          position: absolute;
          bottom: 0;
          color: #ffffff;
          text-align: center;
          font: 34px 'Roboto Condensed', Arial, sans-serif;
        }
      }
      &__name{
        color: #241262;
        font: 500 36px 'Roboto', sans-serif;
        width: 60%;
        text-align: center;
        margin: 20px auto;
      }
    }
    &__other{
      display: flex;
      justify-content: center;
      padding-bottom: 60px;
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
          font-family: 'Roboto';
          font-weight: 300;
        }
        .num{
          font-size: 56px;
          margin-top: 36px;
          color: #241262;
          text-align: center;
          font: 700 56px 'Roboto Condensed', Arial, sans-serif;
          line-height: 1;
        }
      }
    }
    .apus-logo{
      width: 100%;
      position: absolute;
      bottom: 20px;
      img{
        width: 120px;
        margin: 0 auto;
        font-family: 'Roboto', Arial, serif;
        font-weight: 400;
      }
    }

    &__btn{
      border-top: 1px solid #DFDDE9;
      position: relative;
      max-width: 93%;
      width: 6.7rem;
      display: flex;
      margin:0 25px;
      padding-top: 60px;
      justify-content: space-between;
      background-color: #fff;
      align-self: center;
 
      .invitation-code, .get-lives{
        display: flex;
        align-items: center;
        max-width: 48%;
        width: 322px;
        background-color:#fff;
        font-family: "Roboto";
        .extra-lives{
          width: 100%;
          display: flex;
          justify-content: center;
          color: #241262;
          height: 36px;
          span{
            display: block;
            height: 37px;
            line-height: 37px;
          }
          .invite-living{
            position: absolute;
            top: -3px;
            left: -3px;
            width: 50px;
          }
          &__icon{
            width: 44px;
            height: 36px;
            color: #f4387c;
            font-size: 40px;
            align-self: center;
            background: url("../assets/images/lives-icon.png") no-repeat center;
            background-size: contain;
          }
          &__text{
            font-size: 28px;
            margin: 0 0 0 12px;
            color: #241262;
          }
        }
         .get-more-text{
            font-size: 28px;
            margin: 0 0 0 33px;
            color: #f4387c;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            &__icon{
              color: #f4387c;
              font-size: 20px;
            }
         }
        &__btn{
          width: 186px;
          height: 68px;
          line-height: 68px;
          color: #fff;
          font-size: 26px;
          text-align: center;
          background-color: #f4387c;
          border-radius: 46px;
          margin: 0 auto;
          box-shadow: 4px 8px 8px 0px rgba(228, 78, 129, 0.4);
        }
      }
      .share-success{
        width: 400px;
        height: 400px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 24px;
        background-color:rgba(15, 26, 114, 0.8);
        padding: 25px;
        font-weight: 'Roboto';
        &__text{
          color:#fa74a5;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          transform: translateY(40px)
        }
        .heart{
          width: 85%;
          margin: 0 auto;
        }
        &__num{
          color: #fff;
          font-size:48px;
          text-align: center;
          font-weight: bold;
          transform: translateY(-40px)
        }
      }
      .get-lives{
        color: #fff;
        font-size: 28px;
        transition:opacity 300ms linear 2s;
        .revive-rule{
          font-weight: 300;
          margin-top: 20px;
          font-size: 22px;
          color: #fff;
        }
        &__text{
          margin-bottom: 20px;
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
