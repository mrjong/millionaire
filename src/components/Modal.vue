<template>
  <transition name="modal-fade">
    <section class="modal-wrapper" v-show="value">
      <section class="modal_mask"></section>
      <section class="modal_body">
        <slot></slot>
      </section>
    </section>
  </transition>
</template>
<style lang='less'>
  .modal {
    &-wrapper {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      position: fixed;
      overflow: auto;
      margin: 0;
      z-index: 999;
    }
    &_mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, .8);
    }
    &_body {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-fade-enter-active {
      animation: modal-fade-in .3s;
    }
    &-fade-leave-active {
      animation: modal-fade-out .3s;
    }
  }
  @keyframes modal-fade-in {
    0% {
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
    to {
      transform: translateZ(0);
      opacity: 1
    }
  }
  @keyframes modal-fade-out {
    0% {
      transform: translateZ(0);
      opacity: 1
    }
    to {
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
  }
</style>
<script>
export default {
  name: 'modal',
  data () {
    return {
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
  },
  methods: {
    freeze () {
      document.body.style.overflow = 'hidden'
      document.body.addEventListener('touchmove', this.preventDefault)
    },
    restore () {
      document.body.style.overflow = 'visible'
      document.body.removeEventListener('touchmove', this.preventDefault)
    },
    preventDefault (event) {
      event.preventDefault()
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.freeze()
      } else {
        this.restore()
      }
    }
  }
}
</script>
