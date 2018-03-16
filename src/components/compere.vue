<template>
  <div class="compere-container">
    <p class="compere-container__text">
          <!-- ar really Your are really smart smart smart smart Your are really smart Your are really smart smart Your are really smart  -->
       {{compereMsg}}
    </p>
    <div class="compere-container__supa">
       <!-- <img :src="supa" alt="" class="supa"> -->
       <p class="supa" :style="supaStyle"></p>
       <img src="../assets/images/supa-desk.png" alt="" class="supa-desk">
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
// import * as type from '../store/type'
export default {
  name: 'Compere',
  data () {
    return {
      supaTimer: null,
      supaOrder: 1,
      compereMsg: '',
      supaStyle: `background-position: 0% 0%;`
    }
  },
  computed: {
    ...mapGetters(['hostIntervalTime', 'hostMsgList'])
  },
  mounted () {
    this.changeSupa()
    this.swiperMsg()
  },
  methods: {
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
    // 轮播消息
    swiperMsg () {
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
      this.swiperMsg()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.compere-container {
  min-height: 500px;
  box-sizing: border-box;
  padding: 150px 29px 0px 44px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    width: 100%;
    height: 200px;
    font-size: 40px;
    color: #fed331;
    font-family: 'Roboto-Midum';
    margin: 0 10px 20px 0;
    line-height: 48px;
    position: relative;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
