<template>
  <div class="practice">
    <div class="practice__top">
      <div class="practice__top__back" @click="back">
        <p class="practice__top__back__icon icon-fanhui iconfont"></p>
      </div>
      <div class="practice__top__title">
        <p>Practice Game</p>
      </div>
      <div class="practice__top__logo" @click="back">
        <img src="../assets/images/logo.png" alt="millionaire">
      </div>
    </div>
    <div class= "practice__card">
      <div class="head"></div>
      <div class="name">zhangpanpan</div>
      <div class="balance">
        <span class="gold"></span>
        556</div>
    </div>
    <div class="practice__hint">
      <p class="text light" v-if="isSuccess && isEnd">Congrats! You get them all right!</p>
      <p class="text light" v-else-if="!isSuccess && isEnd">You got {index} questions right!</p>
      <p class="text" v-if="isEnd">{{isSucces ? successText : failText}}</p>
    </div>
    <div class="practice__btn">
      <div class="start">
        <span class="iconfont icon-wenjuan"></span>
        Start Now
      </div>
      <div class="share" v-if="isEnd">
        <span class="iconfont icon-share"></span>
        Share
      </div>
      <p class="hint">Practice and real questions of 'Go! Millionaire' are hidden in it,try and get ready for the live game!</p>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import utils from '../assets/js/utils'
// import * as api from '../assets/js/api'
export default {
  name: 'Await',
  data () {
    return {
      failText: ' Play \'Go! Millionaire\' and win cash prize every day!',
      successText: 'Join our next "Go! Millionaire" game and win cash easily!',
      isSuccess: false,
      isEnd: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      startTime: 'startTime',
      status: 'status',
      lives: 'lives',
      code: 'code',
      index: 'index'
    })
  },
  mounted () {
    this.$store.dispatch(type.HOME_UPDATE)
    utils.statistic('practice_page', 0)
  },
  methods: {
    // 按钮打点
    btnStatistic (destination) {
      utils.statistic('wait_page', 1, {to_destination_s: destination}, 'wait_page')
    },
    back () {
      this.$router.go(-1)
    }
  },
  components: {
  }
}
</script>
<style scoped lang="less" type="text/less">
  .practice{
    width: 100%;
    position: relative;
    padding:0 25px;
    &__top{
      box-sizing: content-box;
      height:54px;
      display: flex;
      padding-top: 25px;
      justify-content: space-between;
      position:relative;
      &__back{
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        font-size: 24px;
        text-align: center;
        align-self: center;
        line-height: 54px;
      }
      &__title{
        position:absolute;
        bottom:0;
        left:50%;
        transform:translate(-50%,0);
        p{
          height:54px;
          color:#fff;
          font-size: 36px;
          font-family: "Roboto";
          line-height:54px;
        }
      }
      &__logo{
        width: 168px;
        align-self: center;
        img{
          width: 100%;
        }
      }
    }
    &__card{
      max-width:100%;
      width:670px;
      min-height:382px;
      background-color:#fff;
      margin-top:58px;
      border-radius:26px;
      padding: 40px 0 ;
      text-align:center;
      .head{
        width:160px;
        height: 160px;
        border-radius:50%;
        background:#000;
        margin:0 auto 33px;
      }
      .name{
        color: #241262;
        font-size: 36px;
        font-family: 'Roboto';
        font-weight: bold;
      }
      .balance{
        color:#241262;
        font-size:56px;
        font-family: 'Roboto';
        font-weight: bold;
        margin-top: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        .gold{
          display: inline-block;
          width: 46px;
          height: 46px;
          background: url("../assets/images/gold-coin.png") no-repeat center;
          background-size: cover;
          align-self: center;
          margin-right: 26px;
        }
      }
    }
    &__hint{
      width:100%;
      min-height: 436px;
    }
    &__btn{
      .start, .share{
        min-width: 100%;
        width:670px;
        height: 93px;
        display: flex;
        margin:25px 0;
        justify-content: center;
        align-items: center;
        border-radius: 46px;
        font-family: "Roboto";
        color: #fff;
        font-size: 32px;
        span{
          width: 54px;
          height:54px;
          font-size: 48px;
          align-self: center;
          margin-right: 20px;
        }
      }
      .start{
        background: #efab33;
      }
      .share{
        background: #cd4b79;
      }
      .hint{
        margin: 34px;
        line-height: 30px;
        color:#efab33;
        font-size: 24px;
        text-align: center;
      }
    }
  }
</style>
