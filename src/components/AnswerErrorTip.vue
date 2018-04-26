<template>
  <transition name="answer-error-tip-fade">
    <section class="answer-error-tip" v-show="value">
      <p class="out" v-if="type==='out'">Out</p>
      <p v-if="type==='incorrect'"><span class="iconfont icon-cuowu" style="font-size:0.222rem;margin-right:0.08rem;"></span><span style="vertical-align:middle;">Incorrect</span></p>
    </section>
  </transition>
</template>
<style lang="less">
  .answer-error-tip {
    width: 213px;
    height: 71px;
    background-color: #ff4846;
    border-radius: 31px;
    position: absolute;
    top: -30.5px;
    left: 50%;
    margin-left: -106.5px;
    p {
      text-align: center;
      font: 300 28px 'Roboto', Arial, serif;
      color: #fff;
      text-align: center;
      line-height: 71px;
    }

    &-fade-enter-active {
      animation: answer-error-tip-fade-in .3s;
    }
    &-fade-leave-active {
      animation: answer-error-tip-fade-out .3s;
    }
  }

  @keyframes answer-error-tip-fade-in {
    0% {
      transform: translate3d(0, -15px, 0);
      opacity: 0
    }
    to {
      transform: translateZ(0);
      opacity: 1
    }
  }
  @keyframes answer-error-tip-fade-out {
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
  name: 'AnswerErrorTip', // 答题错误提示
  data () {
    return {
    }
  },
  props: {
    type: {
      type: String,
      default: 'out'
    },
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
