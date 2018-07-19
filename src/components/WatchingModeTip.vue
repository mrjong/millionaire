<template>
  <transition name="watching-tip-fade">
    <section class="watching-tip" v-show="value">
      <p class="out">{{$t('main.anwser_out_text')}}</p>
    </section>
  </transition>
</template>
<style lang="less" scoped>
  .watching-tip {
    width: 213px;
    height: 71px;
    background-color: #ff4846;
    border-radius: 31px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -106.5px;
    animation: vibration 0.7s cubic-bezier(.36, .07, .19, .97) infinite;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    p {
      text-align: center;
      font: 300 28px 'Roboto', Arial, serif;
      color: #fff;
      text-align: center;
      line-height: 71px;
    }

    &-fade-enter-active {
      animation: watching-tip-fade-in .3s;
    }
    &-fade-leave-active {
      animation: watching-tip-fade-out .3s;
    }
  }
  @keyframes vibration {
    10%, 90% {
      transform: translateX(-1px);
    }
    20%, 80% {
      transform: translateX(3px);
    }
    30%, 50%, 70% {
      transform: translateX(-5px);
    }
    40%, 60% {
      transform: translateX(5px);
    }
  }
  @keyframes watching-tip-fade-in {
    0% {
      transform: translate3d(0, -15px, 0);
      opacity: 0
    }
    to {
      transform: translateZ(0);
      opacity: 1
    }
  }
  @keyframes watching-tip-fade-out {
    0% {
      transform: translateZ(0);
      opacity: 1
    }
    to {
      transform: translate3d(0, -15px, 0);
      opacity: 0
    }
  }
</style>
<script>
export default {
  name: 'WatchingModeTip', // 答题错误提示
  data () {
    return {
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
