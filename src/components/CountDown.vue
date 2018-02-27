<template>
  <div class="count-down-container">
    <div class="count-down-container__module">
      <p class="count-down-container__module__text">The game is about to begin...</p>
      <p class="count-down-container__module__time">{{readyTime}}</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// import publicFn from '../assets/js/publicFn'
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
      readyTime: 'readyTime'
    })
  },
  mounted () {
  },
  components: {}
}
</script>
<style scoped lang="less" type="text/less">
  .count-down-container{
    width: 100%;
    /*height:100%;*/
    &__module{
      padding-top: 270px;
      color: #ffffff;
      text-align: center;
      font-family:RobotoCondensed-Regular;
      &__text{
        font-size: 28px;
      }
      &__time{
        margin-top: 31px;
        font-size: 156px;
      }
    }
  }
</style>
