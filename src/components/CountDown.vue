<template>
  <div class="count-down-container">
    <div class="count-down-container__module" v-if="startTime > 10 || startTime === 0 ">
      <p class="count-down-container__module__text">Starting in {{countDown}}</p>
      <count-down-compere></count-down-compere>
    </div>
    <div class="count-down-container__animation" v-show = 'startTime <= 10 && startTime !== 0'>
      <img class="count-down-container__animation__down" src="../assets/images/left.png"/>
      <img v-for="i in 10" :key="i" class="count-down-container__animation__number"
           ref="animationNumber"
           :src="`./static/images/${i}.png`" v-show="startTime === i"/>
      <img class="count-down-container__animation__top" src="../assets/images/right.png"/>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import { _UPDATE } from '../store/type'
import CountDownCompere from '../components/CountDownCompere'
export default {
  name: 'CountDown',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      startTime: 'startTimeOffset'
    }),
    countDown: function () {
      const timeSecond = this.startTime
      let s = timeSecond % 60
      let m = parseInt(timeSecond / 60 % 60)
      if (m <= 9) {
        m = '0' + m
      }
      if (s <= 9) {
        s = '0' + s
      }
      return m + ':' + s
    }
  },
  mounted () {
    this.playingAudio(this.startTime)
    utils.statistic('countdown_page', 0)
  },
  methods: {
    playingAudio (time) {
      if (time <= 10 && time !== 1 && time !== 0) {
        utils.playSound('countDown10-before')
      } else if (time <= 10 && time === 1 && time !== 0) {
        utils.playSound('countDown10-after')
      }
    }
  },
  components: {
    CountDownCompere
  },
  watch: {
    startTime: function (startTime) {
      this.playingAudio(startTime)
      if (startTime <= 10) {
        this.$store.commit(_UPDATE, {
          disableNetworkTip: true
        })
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .count-down-container{
    width: 100%;
    &__module{
      &__text{
        width: 280px;
        padding: 10px 0;
        color: #ffffff;
        text-align: center;
        background: rgba(250,167,23, 0.95);
        border-radius: 26px;
        margin: 27px auto 0;
        font: 300 32px 'Roboto', Arial, serif;
        box-shadow: 0px 1px 10px 0.5px #faa729;
      }
      &__time{
        font: 400 156px 'Roboto Condensed', Arial, serif;
      }
    }
    &__animation{
      width: 100%;
      position: relative;
      padding: 400px 0 300px;
      &__number{
        width: 350px;
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        animation: zoom 1s infinite;
      }
      &__down, &__top{
        width: 250px;
        position: absolute;
      }
      &__down{
        left: 0;
        bottom: 10%;
        animation: downFlash 700ms ease-in 300ms infinite ;
      }
      &__top{
        right: 0;
        top: 10%;
        animation: topFlash 700ms ease-in 300ms infinite;
      }
    }
  }
  @keyframes zoom {
    from{
      width: 150px;
    }
    to{
      width: 350px;
    }
  }
  @keyframes downFlash {
    from{
      left: 0;
      bottom: 0;
      opacity: 1;
    }
    to{
      left: 100%;
      bottom: 70%;
      opacity: 0;
    }
  }
  @keyframes topFlash {
    from{
      right: 0;
      top: 0;
      opacity: 1;
    }
    to{
      right: 100%;
      top: 70%;
      opacity: 0;
    }
  }
</style>