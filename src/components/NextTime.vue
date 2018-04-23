<template>
  <div class="hint">
    <div class="hint__time">
      <p class="hint__time__text">
        Next Game
        <span class="hint__time__text__day"> {{nextTime[0]}}</span>
      </p>
      <!-- <div class="game-living"  @click="toGamePage" v-if = 'isPlaying'>
        <span class="living-text">LIVING</span>
        <div class="game-playing">
          <span class="living-icon iconfont icon-LIVINGyoujiantou left"></span>
          <span class="living-icon iconfont icon-LIVINGyoujiantou right"></span>
        </div>
      </div> -->
      <p class="hint__time__hour">
        {{nextTime[1]}}
      </p>
    </div>
    <div class="hint__line"></div>
    <div class="hint__money">
      <p class="hint__money__text">Next Bonus</p>
      <p class="hint__money__number">
        {{currencyType}}{{money}}
      </p>
    </div>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
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
      // isPlaying: false
    }
  },
  computed: {
    // ...mapGetters({
    //   status: 'status',
    //   watchingMode: 'watchingMode',
    //   questionStatus: 'question_status',
    //   startTime: 'startTime'
    // })
  },
  mounted () {
    // if (this.status === 1) {
    //   this.isPlaying = false
    // } else {
    //   this.isPlaying = true
    // }
  },
  methods: {
    // toGamePage () {
    //   this.$router.push({path: '/main'})
    // }
  },
  watch: {
    // status: function (status) {
    //   if (status === 1) {
    //     this.isPlaying = false
    //   } else {
    //     this.isPlaying = true
    //   }
    // }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .hint{
    color: #ffffff;
    font-size: 28px;
    opacity: 0.95;
    margin-top: 46.6px;
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
        margin-top: 25px;
        color: #ffb227;
        font: 700 56px 'Roboto Condensed', Arial, serif;
      }
      &__hour{
        color: #fff;
      }
      .game-living{
        width: 200px;
        height: 55px;
        border-radius: 46px;
        box-shadow:0 0 0 2px #ffb227;
        color:#ffb227;
        line-height: 50px;
        margin: 30px auto 0;
        position: relative;
        .living-text{
          font-size: 28px;
          margin-left: 10px;
        }
        .game-playing{
          position: absolute;
          top: 0;
          right: 30px;
        }
        .living-icon{
          letter-spacing: -20px;
          color: #ffb227;
          font-size: 26px;
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
  }
  @keyframes playing {
    0%{
      right:25px;
    }
    50%{
      right: 30px;
    }
    100%{
      right: 25px;
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
