<template>
  <div class="main-container">
    <div class="main-container__top">
      <div class="main-container__top__online">
        <span class="main-container__top__online__icon"></span>
        <span class="main-container__top__online__num">123454</span>
      </div>
      <div class="main-container__top__logo">
        <img src="../assets/images/logo.png" alt="millionaire">
      </div>
    </div>
    <count-down></count-down>
    <chat-room></chat-room>
  </div>
</template>

<script>
import ChatRoom from '../components/ChatRoom'
import CountDown from '../components/CountDown.vue'
export default {
  name: 'Main',
  data () {
    return {
      state: 'CountDown'
    }
  },
  mounted () {
    this.setRouter()
  },
  methods: {
    setRouter () {
    }
  },
  components: {
    CountDown,
    ChatRoom
  }
}
</script>
<style scoped lang="less" type="text/less">
  .main-container{
    width: 100%;
    height:100%;
    background: url("../assets/images/main-bg.jpg");
    display: flex;
    flex-direction: column;
    &__top{
      width: 100%;
      display: flex;
      padding: 25px 25px 0;
      justify-content: space-between;
      &__online{
        padding: 18px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        &__icon{
          display: inline-block;
          width: 24px;
          height: 24px;
          content: '\e64a';
          background-color: yellow;
          vertical-align: bottom;
        }
        &__num{
          display: inline-block;
          font-size: 24px;
          color: #fff;
        }
      }
      &__logo{
        width: 168px;
        align-self: center;
        img{
         width: 100%;
        }
      }
    }
  }
</style>
