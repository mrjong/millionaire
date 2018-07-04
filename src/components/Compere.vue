<template>
  <!-- 串词 -->
  <div class="compere-container">
    <p class="compere-container__text">
       {{compereMsg}}
    </p>
    <div class="compere-container__notice">
      <img src="../assets/images/small-awiat-title-hi.png" v-if="lang === 'hi'">
      <img src="../assets/images/small-awiat-title-en.png" v-else>
    </div>
    <!-- <div class="compere-container__supa">
       <p class="supa" :style="supaStyle"></p>
       <img src="../assets/images/supa-desk.png" alt="" class="supa-desk">
    </div> -->
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import i18n from '../i18n'
export default {
  name: 'Compere',
  data () {
    return {
      supaTimer: null,
      msgTimer: null,
      supaOrder: 1,
      compereMsg: `Welcome to 'Go! Millionaire' game! Answer questions and get them all right to win up to  ₹1,000,000 every day!`,
      supaStyle: `background-position: 0% 0%;`,
      lang: i18n.locale
    }
  },
  computed: {
    ...mapGetters(['hostIntervalTime', 'hostMsgList', 'gameType'])
  },
  mounted () {
    this.gameType !== 3 && this.changeSupa()
    this.rollingMsg()
    console.log('sdfasdfsdfsdfsdf' + i18n.locale)
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
      clearInterval(this.msgTimer)
      const list = this.hostMsgList
      if (list && list.length) {
        let count = 0
        const interval = this.hostIntervalTime
        this.msgTimer = setInterval(() => {
          count = (count + 1) % list.length
          this.compereMsg = list[count]
        }, interval)
        this.compereMsg = list[count]
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.msgTimer)
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
  padding: 100px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    width: 100%;
    height: 200px;
    color: #fed331;
    font: 500 40px/48px 'Roboto', Arial, serif;;
    padding: 0 30px 0 44px;
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
