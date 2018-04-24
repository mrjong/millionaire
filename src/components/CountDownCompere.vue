<template>
  <!-- 串词 -->
  <div class="compere-container">
    <p class="compere-container__text">
       {{compereMsg}}
    </p>
    <div class="compere-container__supa">
       <img src="../assets/images/countdown-light.png" class="bg-light">
       <div class="countdown-supa"></div>
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
      compereMsg: `Welcome to “Go! Millionaire”, this is a live quiz game where you can answer 12 questions to win cash at 10 PM Everyday!`,
      supaStyle: `background-position: 0% 0%;`
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
        this.supaStyle = 'background-position: 0%' + (this.supaOrder * 24.95) + '%'
        this.supaOrder++
      }, 800)
    },
    // 2. 轮播消息
    rollingMsg () {
      const list = this.hostMsgList
      if (list && list.length) {
        let count = 0
        const interval = this.hostIntervalTime
        let timer = setInterval(() => {
          if (++count < list.length) {
            this.compereMsg = list[count]
          } else {
            clearInterval(timer)
          }
        }, interval)
        this.compereMsg = list[count]
      }
    }
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
  padding: 50px 29px 0px 44px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    width: 100%;
    height: 200px;
    color: #fff;
    font: 500 40px/48px 'Roboto', Arial, serif;;
    margin: 0 10px 20px 0;
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  &__supa {
    width: 500px;
    position: relative;
    .bg-light{
      width: 100%;
    }
    .countdown-supa {
      width: 232px;
      height: 324px;
      background: url(../assets/images/countdown-supa1.png) no-repeat;
      background-size: cover;
      margin: 0 auto;
    }
    .supa-desk {
      width: 100%;
    }
  }
}
</style>
