<template>
  <modal :value="!isClose">
    <section class="fail-tip-act" >
      <img style="width: 100%;" src="//static.apusapps.com/201805301642482c2e4fc771.png" alt="">
      <button @click="redirect"></button>
      <img class="close" @click="isClose = true" src="../assets/images/icon-fail-tip-close.png" alt="">
    </section>
  </modal>
</template>
<script>
import utils from '../assets/js/utils.js'
import Modal from './Modal.vue'
export default {
  name: 'fail-tip-act', // 主题活动错误提示
  data () {
    return {
      isClose: false
    }
  },
  props: {
    value: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    redirect () {
      window.location.href = utils.actUrl
    }
  },
  components: {
    Modal
  },
  watch: {
    value (val) {
      this.isClose = !val
    }
  }
}
</script>
<style lang="less" scoped>
  .fail-tip-act {
    width: 557px;
    height: auto;
    position: relative;
    text-align: center;

    button {
      width: 480px;
      height: 76px;
      background: rgba(0, 0, 0, 0);
      border: none;
      outline: none;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 178px;
      border-radius: 32px;
    }

    .close {
      width: 64px;
      margin: 53px auto 0;
    }
  }
</style>
