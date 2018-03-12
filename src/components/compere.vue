<template>
  <div class="compere-container">
    <p class="compere-container__text">
         <!-- Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really lly smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really -->
       {{compereMsg}}
    </p>
    <div class="compere-container__supa">
      <img :src="supa" alt="" class="supa">
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
      supa: require('../assets/images/supa1.png')
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
        if (this.supaOrder > 3) {
          this.supaOrder = 1
        }
        this.supa = require('../assets/images/supa' + this.supaOrder + '.png')
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
      console.log(val)
      this.swiperMsg()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.compere-container {
  min-height: 500px;
  box-sizing: border-box;
  padding: 200px 29px 0px 44px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    width: 100%;
    font-size: 40px;
    // color: #241262;
    color: #fff;
    font-family: 'Roboto-Light';
    margin: 0 10px 32px 0;
    text-indent: 44px;
    line-height: 36px;
  }
  &__supa {
    width: 211px;
    height: 355px;
    position: relative;
    .supa {
      width: 100%;
    }
    .supa-desk {
      width: 100%;
      position: absolute;
      top: 199px;
      left: -3px;
    }
  }
}
</style>
