<template>
  <div class="main-container">
    <div class="main-container__top">
      <div class="main-container__top__online">
        <span class="main-container__top__online__icon"></span>
        <span class="main-container__top__online__num">{{onlineAmount}}</span>
      </div>
      <div class="main-container__top__logo">
        <img src="../assets/images/logo.png" alt="millionaire">
      </div>
    </div>
    <count-down v-if="status === 2"></count-down>
    <respondence v-else-if="status === 3"></respondence>
    <winners-result v-else></winners-result>
    <chat-room></chat-room>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChatRoom from '../components/ChatRoom'
import CountDown from '../components/CountDown.vue'
import Respondence from '../components/Respondence'
import winnersResult from '../components/WinnersResult'
export default {
  name: 'Main',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      onlineAmount: 'onlineAmount',
      status: 'status'
    })
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
    ChatRoom,
    Respondence,
    winnersResult
  }
}
</script>
<style scoped lang="less" type="text/less">
  .main-container{
    width: 100%;
    height:100%;
    background: url("../assets/images/main-bg.jpg") no-repeat top left;
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
  .respondence {
    width: 100%;
    height: 785px;
  }
</style>
