<template>
  <!-- 答错后邀请提示 -->
  <section class="fail-tip-wrapper">
    <modal :value="!isClose">
      <section class="fail-tip">
        <img class="icon" src="../../static/images/tip-fail.png">
        <span class="iconfont icon-cuowu close" @click="close"></span>
        <p>Unwilling To Lose Bonuses?</p>
        <section class="fail-note" >
          <p>Invite friends to join and play, earn cash  now!</p>
        </section>
        <button @click="invite" class="btn-invite">Invite & Earn Cash</button>
      </section>
    </modal>
    <revive-card :reviveObj="{isShare: showInviteTip, code: code}" v-if="showInviteTip" @shareClose="showInviteTip = false"></revive-card>
  </section>
</template>
<script>
import Modal from './Modal.vue'
import utils from '../assets/js/utils'
export default {
  name: 'fail-tip',
  data () {
    return {
      showInviteTip: false,
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
    width: 547px;
    height: 646px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;
    padding: 0 40px;
    text-align: center;
    font: 500 32px 'Roboto', Arial, serif;
    color: #220f60;

    .icon {
      width: 121px;
      display: inline-block;
      margin-top: 12.8%;
      margin-bottom: 10%;
    }

    .fail {
      font-size: 40px;
      margin-top: 42px;
      line-height: 1.5;
    }

    .fail-note {
      font: 300 30px/1.3 'Roboto', Arial, serif;
      margin-top: 48px;
    }

    .btn-invite {
      width: 407px;
      height: 75px;
      border-radius: 46px;
      border: none;
      background: #f0af3d;
      color: #fff;
      font-weight: 400;
      margin-top: 61px;
      outline: none;
    }

    .close {
      color: #513a83;
      position: absolute;
      right: 27px;
      top: 27px;
      font-size: 24px;
    }
  }
</style>
