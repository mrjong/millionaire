<template>
  <!-- 串词 -->
  <div class="compere-container">
    <p class="compere-container__text">
       {{compereMsg}}
    </p>
    <div class="compere-container__notice" v-if="gameType === 3">
      <img src="../assets/images/small-awiat-title.png">
    </div>
    <div class="compere-container__supa" v-else>
       <p class="supa" :style="supaStyle"></p>
       <img src="../assets/images/supa-desk.png" alt="" class="supa-desk">
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
    ...mapGetters(['hostIntervalTime', 'hostMsgList', 'gameType'])
  },
  mounted () {
    console.log('game' + this.gameType)
    this.gameType !== 3 && this.changeSupa()
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
  padding: 100px 29px 0px 44px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    width: 100%;
    height: 200px;
    color: #fed331;
    font: 500 40px/48px 'Roboto', Arial, serif;;
    margin: 0 10px 20px 0;
    position: relative;
    overflow: hidden;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  &__notice{
    width: 100%;
    img{
      width: 100%;
    }
  }
  &__supa {
    width: 211px;
    height: 355px;
    position: relative;
    .supa {
      width: 186px;
      height: 256px;
      background: url(../assets/images/supaes.png) no-repeat;
      background-size: cover;
    }
    .supa-desk {
      width: 100%;
      position: absolute;
      top: 175px;
      left: -16px;
    }
  }
}
</style>
