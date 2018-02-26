<template>
  <div class="main-container">
    <div class="main-container__top">
      <div class="main-container__top__online">
        <span class="main-container__top__online__icon"></span>
        <span class="main-container__top__online__num"></span>
      </div>
      <div class="main-container__top__logo">
        <img src="../assets/images/logo.png" alt="millionaire">
      </div>
    </div>
    <count-down></count-down>
  </div>
</template>

<script>
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
    CountDown
  }
}
</script>
<style scoped lang="less" type="text/less">
  .main-container{
    width: 100%;
    height:100%;
    background: url("../assets/images/main-bg.jpg");
    &__top{
      width: 100%;

    }
  }
</style>
