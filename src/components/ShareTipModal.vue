<template>
  <!-- 提现成功分享弹框-->
  <section class="fail-tip-wrapper">
    <modal :value="!isClose">
      <div class="fail-tip-inner">
        <section class="fail-tip bg-reset" v-webp.bg="`url('share-modal-bg.png')`">
            <div class="fail-tip-text">
            <p class="fail-tip-title">{{$t('tip.balanceShareModal.title')}}</p>
            <p class="fail-tip-desc">{{$t('tip.balanceShareModal.desc')}}</p>
            </div>
            <button @click="share" class="btn-share bg-reset" v-webp.bg="`url('share-tip-btn.png')`">{{$t('tip.balanceShareModal.btn')}}</button>
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
import {mapGetters} from 'vuex'

export default {
  name: 'balance-share-modal',
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
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  methods: {
    share () {
      var link = window.location.protocol + ''
      var referrerId = '334004'
      var icode = ''
      var iversion = ''
      setTimeout(function () {
        window.location.href = 'market://details?id=com.millionaire.aries&referrer=id%3D' + referrerId + '%26icode%3D' + icode + '%26iversion%3D' + iversion
      }, 500)
      window.location.href = 'xapplink://com.millionaire.aries/millionaire?url=' + encodeURIComponent(link)
      // utils.statistic('referral_code_invite', 1)
      // this.close()
      // this.$emit('share', {
      //   isShare: true
      // })
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
    padding: 67px 0 53px;
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
      font-size: 30px;
      color: #fef163;
      line-height: 40px;
      margin: 0 30px;
    }
    .btn-share {
      background: none;
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
