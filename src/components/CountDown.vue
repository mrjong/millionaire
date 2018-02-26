<template>
  <div class="count-down-container">
    <div class="count-down-container__module">
      <p class="count-down-container__module__text">The game is about to begin...</p>
      <p class="count-down-container__module__time">{{timeStamp}}</p>
    </div>
    <!--聊天室-->
    <!--<chat-room></chat-room> -->
  </div>
</template>

<script>
import ChatRoom from './ChatRoom'
import publicFn from '../assets/js/publicFn'
export default {
  name: 'CountDown',
  data () {
    return {
      timeStamp: null,
      intervalTime: 1000
    }
  },
  mounted () {
    setTimeout(() => {
      this.timeStamp = 128550
      publicFn.timeCountDown(this.timeStamp, this.intervalTime, (t) => {
        // console.log(t)
      })
    }, 500)
    // '1519535467489' 11m
    // '1519535338939' 58s
    // '1519535000000' 3s
    // '128550' // 时间差时间戳毫秒
  },
  components: {
    ChatRoom
  }
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
