<template>
  <div class="count-down-container">
    <div class="count-down-container__module" v-if="startTime > 10">
      <p class="count-down-container__module__text">The game is about to begin...</p>
      <p class="count-down-container__module__time">{{countDown}}</p>
    </div>
    <div class="count-down-container__animation" v-else>
      <img class="count-down-container__animation__down" src="../assets/images/left.png"/>
      <img class="count-down-container__animation__number" :src="require('../assets/images/' + startTime + '.png')"/>
      <img class="count-down-container__animation__top" src="../assets/images/right.png"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'CountDown',
  data () {
    return {
      timeStamp: null,
      intervalTime: 1000
    }
  },
  computed: {
    ...mapGetters({
      startTime: 'startTime'
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
  },
  components: {}
}
</script>
<style scoped lang="less" type="text/less">
  .count-down-container{
    width: 100%;
    &__module{
      padding: 270px 0;
      color: #ffffff;
      text-align: center;
      &__text{
        font: 28px 'Roboto-Light';
      }
      &__time{
        margin-top: 26px;
        font:156px 'Roboto-Condensed';
      }
    }
    &__animation{
      width: 100%;
      position: relative;
      padding: 400px 0 300px;
      &__number{
        width: 150px;
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
      width: 70px;
    }
    to{
      width: 150px;
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
