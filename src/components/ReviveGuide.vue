<template>
  <div class="guide" v-if="FirstGuide && !isClose">
    <span class="guide__close iconfont icon-cuowu" @click="isClose = true"></span>
    <p class="guide__text">When you accidentally answer the wrong question.</p>
    <p class="guide__text">When you are eliminated by the game.</p>
    <p class="guide__text">When you have only one step away from the big prize.</p>
    <p class="guide__text important ">Resurrection card goes online</p>
    <p class="guide__text">Wish you success towards the success of the millionaire.</p>
    <img src="../assets/images/guide-supa.png" class="guide__supa">
    <div class="guide__btn" @click="toShareDetail">Get resurrected card</div>
  </div>
</template>

<script>
export default {
  name: 'ReviveCard',
  props: {
  },
  data () {
    return {
      isClose: false,
      FirstGuide: false
    }
  },
  computed: {},
  mounted () {
    if (localStorage.getItem('NoFirstGuide')) {
      this.FirstGuide = false
    } else {
      this.FirstGuide = true
      localStorage.setItem('NoFirstGuide', 'false')
    }
  },
  methods: {
    toShareDetail () {
      this.$router.push({path: '/share-detail'})
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .guide {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 111;
    padding: 120px 40px 0;
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
      font-size: 32px;
      line-height: 45px;
      margin-bottom: 15px;
    }
    &__supa{
      max-width: 80%;
      width: 600px;
      margin: 50px 0 0 16%;
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
      margin: 100px auto 0;
    }
    .important{
      color: #e03c79;
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0 20px;
    }
  }
</style>
