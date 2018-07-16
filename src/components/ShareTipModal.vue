<template>
  <!-- 提现成功分享弹框-->
  <section class="fail-tip-wrapper">
    <modal :value="!isClose">
      <div class="fail-tip-inner">
        <section class="fail-tip">
            <div class="fail-tip-text">
            <p class="fail-tip-title">WIthdrawal Cash Success</p>
            <p class="fail-tip-desc">You just withdrawal cash  ₹20, share and invite friends to join, and get more rewards!</p>
            </div>
            <button @click="share" class="btn-share">Share & Earn Cash</button>
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
    }
  },
  methods: {
    share () {
      // utils.statistic('referral_code_invite', 1)
      this.close()
      this.$emit('share', {
        isShare: true
      })
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
    background-image: url("../assets/images/share-modal-bg.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    width: 550px;
    height: 688px;
    color: #fff;
    text-align: center;
    box-sizing: border-box;
    border-radius: 10px;

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
      margin: 0 30px;
    }
    .btn-share {
      background: none;
      background-image: url("../assets/images/share-tip-btn.png");
      background-repeat: no-repeat;
      background-size: cover;
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
