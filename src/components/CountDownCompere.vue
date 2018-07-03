<template>
  <!-- 串词 -->
  <div class="compere-container">
    <p class="compere-container__text">
       {{compereMsg}}
    </p>
    <div class="compere-container__supa">
       <img src="../assets/images/countdown-light.png" class="bg-light">
       <div class="countdown-supa" :style="supaStyle"></div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Compere',
  data () {
    return {
      supaTimer: null,
      supaOrder: 1,
      compereMsg: `Welcome to 'Go! Millionaire' game! Answer questions and get them all right to win up to  ₹1,000,000 every day!`,
      supaStyle: `background-position: 0% 0%;`,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['hostIntervalTime', 'hostMsgList'])
  },
  mounted () {
    this.changeSupa()
    this.rollingMsg()
  },
  methods: {
    // 1. 改变 supa(主持人) 位置
    changeSupa () {
      this.supaTimer && clearInterval(this.supaTimer)
      this.supaTimer = setInterval(() => {
        if (this.supaOrder >= 5) {
          this.supaOrder = 0
        }
        this.supaStyle = 'background-position: 0%' + (this.supaOrder * 25.05) + '%'
        this.supaOrder++
      }, 800)
    },
    // 2. 轮播消息
    rollingMsg () {
      clearInterval(this.timer)
      const list = this.hostMsgList
      if (list && list.length) {
        let count = 0
        const interval = this.hostIntervalTime
        this.timer = setInterval(() => {
          count = (count + 1) % list.length
          this.compereMsg = list[count]
        }, interval)
        this.compereMsg = list[count]
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
    hostMsgList (val) {
      this.rollingMsg()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.compere-container {
  min-height: 500px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    width: 100%;
    height: 200px;
    color: #fff;
    padding: 40px 40px 0;
    font: 500 40px/48px 'Roboto', Arial, serif;
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  &__supa {
    width: 80%;
    position: relative;
    margin: 50px auto;
    .bg-light{
      width: 100%;
      position: absolute;
      margin: -70px auto 0;
      transform-origin: center center;
      animation: light 3s linear infinite
    }
    .countdown-supa {
      position: relative;
      z-index: 11;
      width: 232px;
      height: 324px;
      background: url(../assets/images/countdown-supa.png) no-repeat;
      background-size: cover;
      margin: 45px auto 0;
    }
    .supa-desk {
      width: 100%;
    }
  }
}
@keyframes light {
  0%{
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  50%{
    opacity: 0.3;
    transform: scale(0.8) rotate(60deg);
  }
  100%{
    opacity:1;
    transform: scale(1) rotate(-60deg);
  }
}
</style>
