<template>
  <div class="guide" v-if="FirstGuide && !isClose">
    <span class="guide__close iconfont icon-cuowu" @click="isClose = true"></span>
    <p class="important ">Referral Code Available Now!</p>
    <p class="guide__text"><span class="dot"></span>Keep playing when answer incorrectly</p>
    <p class="guide__text"><span class="dot"></span>Get more chances to WIN</p>
    <p class="guide__text"><span class="dot"></span>Win cash to be the next MILLIONAIRE!</p>
    <div class="guide__img">
      <img src="../assets/images/light.png" class="light">
      <img src="../assets/images/lives-icon.png" class="lives">
    </div>
    <div class="guide__btn" @click="toShareDetail">
      <p class="guide__btn__icon">+1</p>
      Get Extra Life Now</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as type from '../store/type'
export default {
  name: 'ReviveGuide',
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
    if (!localStorage.getItem('NoFirstGuide') && this.$route.path === '/') {
      if (utils.isShowGuide && utils.isQueryAgree) {
        this.FirstGuide = true
        localStorage.setItem('NoFirsstGuide', 'false')
      }
    } else {
      this.FirstGuide = false
    }
  },
  methods: {
    toShareDetail () {
      utils.statistic('wait_page', 1, {to_destination_s: 'referral_code_guide'}, 'wait_page')
      if (utils.isOnline) {
        this.$router.push({path: '/share-detail'})
      } else {
        utils.login(() => {
          this.$store.commit(type._UPDATE, {isOnline: true})
          utils.isOnline = true
          utils.statistic('reviveguide_page', 1, {'result_code_s': '1'}, 'await_page')
          this.$store.dispatch(type._INIT)
          this.$router.push({path: '/share-detail'})
        })
      }
    }
  },
  watch: {
    status: function (status) {
      if (status !== 1) {
        this.FirstGuide = false
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .guide {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 111;
    padding: 80px 40px 10px;
    background-color: rgba(0, 0, 0, 0.9);
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
        position: absolute;
        top: 24px;
        right: 24px;;
        width: 50px;
        height: 50px;
        font-size: 22px;
        line-height: 50px;
      }
      &__text{
        font-size: 28px;
        line-height: 45px;
        margin-bottom: 10px;
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
  @media screen and (max-width: 321px){
    .guide {
      padding: 100px 40px 0;
      &__text{
        font-size: 30px;
        margin-bottom: 10px;
      }
      &__btn{
        font-size: 30px;
        width: 600px;
        margin: 30px auto 0;
      }
      .important{
        font-size: 56px;
        margin: 0 0 35px;
      }
    }
  }
</style>
