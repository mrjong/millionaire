<template>
  <div class="hint">
    <div class="hint__time">
      <p class="hint__time__text">
        {{$t('await.next_time_text')}}
        <span class="hint__time__text__day"> {{nextTime[0]}}</span>
      </p>
      <div class="game-living"  @click="toGamePage" v-if="isPlaying">
        <p class="living-text">{{$t('await.living')}}</p>
        <div class="game-playing">
          <span class="living-icon iconfont icon-LIVINGyoujiantou left"></span>
          <span class="living-icon iconfont icon-LIVINGyoujiantou right"></span>
        </div>
      </div>
      <p class="hint__time__hour" v-else>
        {{nextTime[1]}}
        <span class="icon-naozhong iconfont icon-naozhong" v-if="nextTime[0] !== ''" @click="reminder"></span>
      </p>
    </div>
    <div class="hint__line"></div>
    <div class="hint__money">
      <p class="hint__money__text">{{$t('await.next_bonus_text')}}</p>
      <p class="hint__money__number">
        {{currencyType}}{{money}}
      </p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'NextTime',
  props: {
    nextTime: {
      type: Array
    },
    money: {
      type: Number
    },
    currencyType: {
      type: String
    }
  },
  data () {
    return {
      isPlaying: false
    }
  },
  computed: {
    ...mapGetters({
      status: 'status',
      watchingMode: 'watchingMode',
      questionStatus: 'question_status',
      startTime: 'startTime'
    })
  },
  mounted () {
    if (this.$route.path === '/' && this.status !== 1) {
      this.isPlaying = true
    } else {
      this.isPlaying = false
    }
  },
  methods: {
    toGamePage () {
      this.$router.push({path: '/main'})
    },
    reminder () {
      this.$emit('reminderEvent')
    }
  },
  watch: {
    status: function (status) {
      if (this.$route.path === '/' && status !== 1) {
        this.isPlaying = true
      } else {
        this.isPlaying = false
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .hint{
    color: #ffffff;
    font-size: 28px;
    opacity: 0.95;
    display: flex;
    justify-content: center;
    &__time, &__money{
      width: 50%;
      display: block;
      text-align: center;
      &__text{
        font: 300 28px 'Roboto', Arial, serif;
        &__day{
          color: #ffb227;
        }
      }
      &__hour,&__number{
        height: 41px;
        margin-top: 25px;
        color: #ffb227;
        font: 700 56px 'Roboto Condensed', Arial, serif;
        line-height: 41px;
      }
      &__hour{
        color: #fff;
        .icon-naozhong {
          position: relative;
          top: -3px;
          font-size: 40px;
          margin-left: 10px;
        }
      }
      .game-living{
        width: 200px;
        height: 55px;
        border-radius: 46px;
        box-shadow:0 0 0 2px #ffb227;
        color:#ffb227;
        margin: 30px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .living-text{
          height: 55px;
          font-size: 28px;
          line-height: 60px;
          align-self: center;
        }
        .living-icon{
          letter-spacing: -20px;
          color: #ffb227;
          font-size: 26px;
          align-self: center;
        }
        .left{
          opacity: 1;
          animation: left 1s ease infinite;
        }
        .right{
          opacity: 0.5;
          animation: right 1s ease infinite;
        }
      }
    }
    &__line{
      opacity: 0.3;
      width: 2px;
      height: 76px;
      background-color: #fff;
      align-self: center;
    }
  }
  @media screen and (max-width: 321px){
    .hint{
      &__line{
        width: 3px;
      }
    }
  }
  @keyframes right {
    0%{
      opacity: 0.5;
    }
    50%{
      opacity: 1;
    }
    100%{
       opacity: 0.5;
    }
  }
   @keyframes left {
    0%{
      opacity: 1;
    }
    50%{
      opacity: 0.5;
    }
    100%{
       opacity:1;
    }
  }
</style>
