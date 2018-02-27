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
    &__module{
      padding: 270px 0 346px;
      color: #ffffff;
      text-align: center;
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
