<template>
  <div class="count-down-container">
    <div class="count-down-container__module">
      <p class="count-down-container__module__text">The game is about to begin...</p>
      <p class="count-down-container__module__time">{{countDown}}</p>
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
      const timeSecond = Math.round((this.startTime / 1000))
      let s = timeSecond % 60
      let m = parseInt(timeSecond / 60 % 60)
      let h = parseInt(timeSecond / 60 / 60 % 24)
      if (h <= 9) {
        h = '0' + h
      }
      if (m <= 9) {
        m = '0' + m
      }
      if (s <= 9) {
        s = '0' + s
      }
      return h + ':' + m + ':' + s
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
      padding: 270px 0 346px;
      color: #ffffff;
      text-align: center;
      &__text{
        font: 28px Roboto-Light;
      }
      &__time{
        margin-top: 31px;
        font:156px Roboto-Condensed;
      }
    }
  }
</style>
