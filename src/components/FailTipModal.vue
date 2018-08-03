<template>
  <!-- 答错后邀请提示 -->
  <section class="fail-tip-wrapper">
    <modal :value="!isClose">
      <div class="fail-tip-inner">
        <section class="fail-tip bg-reset" v-webp.bg="`url('modal-bg.png')`">
            <div class="fail-tip-text">
            <p class="fail-tip-title">{{$t('tip.failTipModal.title')}}</p>
            <p class="fail-tip-desc">{{$t('tip.failTipModal.desc')}}</p>
            </div>
            <button @click="invite" class="btn-invite">{{$t('tip.failTipModal.button')}}</button>
        </section>
        <section class="fail-close-btn" @click="close">
            <img src="../assets/images/icon-fail-tip-close.png">
        </section>
      </div>
    </modal>
  </section>
</template>
<script>
import Modal from './Modal.vue'
import utils from '../assets/js/utils'
export default {
  name: 'fail-tip-modal',
  data () {
    return {
      isClose: true
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 1
    }
  },
  methods: {
    formatIndex: utils.formatIndex,
    invite () {
      this.close()
      this.$router.push('/invite')
    },
    close () {
      this.isClose = true
      this.$emit('close')
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
 .fail-tip {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 77px 0 53px;
    width: 550px;
    height: 660px;
    color: #fff;
    text-align: center;
    box-sizing: border-box;

    &-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &-title {
      font-size: 36px;
      margin-bottom: 38px;
    }

    &-desc {
      font-size: 32px;
      color: #fef163;
      line-height: 50px;
    }
    .btn-invite {
      background: none;
      background-image: url("../assets/images/orange-btn.png");
      background-repeat: no-repeat;
      background-size: contain;
      outline: none;
      border: none;
      width: 480px;
      height: 74.7px;
      margin: 0 auto;
      font-size: 32px;
    }
}

.fail-close-btn {
    width: 64px;
    height: 64px;
    margin: 55px auto 0;
    img {
      width: 100%;
    }
  }
</style>
