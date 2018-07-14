<template>
  <div class="guide" v-if="!isClose">
    <span class="guide__close iconfont icon-cuowu" @click="close"></span>
    <p class="important ">Congratulations!</p>
    <p class="guide__text">The novice task has been completed!</p>
    <p class="guide__text">Answer the three questions and get a Extra Live!</p>
    <div class="guide__img">
      <img src="../assets/images/light.png" class="light">
      <img src="../assets/images/lives-icon.png" class="lives">
    </div>
    <div class="guide__btn get-more" @click="getExtraLift">Get More Extra Life</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as type from '../store/type'
import * as api from '../assets/js/api'
import awaitState from '../assets/js/game-state/state-end.js'
export default {
  name: 'TaskResult',
  props: {
  },
  data () {
    return {
      isClose: false,
      FirstGuide: false
    }
  },
  computed: {
    ...mapGetters({
      status: 'status',
      questionStatus: 'question_status'
    })
  },
  mounted () {
  },
  methods: {
    close () {
      this.isClose = true
      if (utils.isOnline) {
        this.reportLift()
      }
      awaitState.run()
      this.$router.push({path: '/'})
    },
    getExtraLift () {
      this.isClose = true
      utils.statistic('wait_page', 1, {to_destination_s: 'referral_code_guide'}, 'wait_page')
      this.$store.commit(type._UPDATE, {
        isTaskEnd: true
      })
      if (utils.isOnline) {
        this.reportLift()
      } else {
        utils.login(() => {
          this.reportLift()
        })
      }
    },
    reportLift () {
      // 上报得复活卡
      this.isClose = true
      api.doTaskToLife().then(({data}) => {
        awaitState.run()
      })
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .guide {
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1111;
    padding: 80px 40px 50px;
    background-color: rgba(0, 0, 0, 0.9);
    overflow: auto;
    &__close{
      position: absolute;
      top: 24px;
      right: 24px;;
      width: 50px;
      height: 50px;
      background-color:  rgba(255, 255, 255, 0.7);
      font-size: 26px;
      border-radius: 50%;
      line-height: 50px;
      text-align: center;
      color:#443575;
      font-weight: bold;
    }
    &__text{
      color: #fff;
      font-size: 30px;
      line-height: 45px;
      margin-bottom: 20px;
      .dot{
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #e03c79;
        vertical-align: middle;
        margin-right: 15px;
      }
    }
    &__img{
      width: 100%;
      position: relative;
      .light{
        max-width: 70%;
        width: 600px;
        min-height: 400px;
        margin: 30px auto 0;
      }
      .lives{
        width:186px;
        position: absolute;
        top: 50%;
        left:50%;
        transform: translate(-50%,-50%)
      }
    }
    &__btn{
      color: #fff;
      font-size: 32px;
      max-width:100%;
      width: 650px;
      height: 94px;
      background-color: #faa729;
      text-align: center;
      line-height: 94px;
      border-radius: 46px;
      margin: 50px auto 0;
      display: flex;
      justify-content: center;
      &__icon{
        width: 60px;
        height: 55px;
        background: url('../assets/images/lives-icon.png') no-repeat center;
        background-size: cover;
        align-self: center;
        line-height: 50px;
        text-align: center;
        font-size: 22px;
        margin-right: 15px;
      }
    }
    .get-more{
      background-color: #e03c79
    }
    .important{
      color: #e03c79;
      font-size: 60px;
      font-weight: bold;
      margin: 10px 0 40px;
      text-align: center;
      line-height: 70px;
    }
  }
  @media screen and (max-width: 321px){
    .guide {
      padding: 60px 40px 10px;
      &__close{
        font-size: 22px;
      }
      &__text{
        font-size: 28px;
        line-height: 45px;
        margin-bottom: 10px;
      }
      &__img{
        .light{
          max-width: 60%;
          width:500px;
          min-height: 300px;
          margin: 0 auto;
        }
        .lives{
          width:140px;
        }
      }
      &__btn{
        font-size: 30px;
        width: 600px;
        height: 94px;
        line-height: 94px;
        margin: 30px auto 0;
      }
      .important{
        font-size: 56px;
        margin: 0 0 35px;
        line-height: 70px;
      }
    }
  }
</style>
