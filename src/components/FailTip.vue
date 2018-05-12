<template>
  <section class="fail-tip-wrapper">
    <modal :value="!isClose">
      <section class="fail-tip">
        <img class="icon" src="../assets/images/icon-answer-fail.png" alt="">
        <span class="iconfont icon-cuowu close" @click="isClose=true"></span>
        <p class="fail">Oops !</p>
        <p>You failed on the {{formatIndex(index)}} question.</p>
        <div class="divorce"></div>
        <section class="fail-note">
          <!-- eslint-disable-next-line -->
          <p>There {{restCount > 1 ? 'are' : 'is'}} only {{restCount}} question{{restCount > 1 ? 's' : ''}} between you and a MILLION.</p>
          <p>Invite a new user to get a extra life</p>
        </section>
        <button @click="invite" class="btn-invite">Invite Now <img src="../assets/images/icon-add-extraLife.png" alt=""></button>
      </section>
    </modal>
    <revive-card :reviveObj="{isShare: showInviteTip, code: code}" v-if="showInviteTip" @shareClose="showInviteTip = false"></revive-card>
  </section>
</template>
<script>
import {mapGetters} from 'vuex'
import Modal from './Modal.vue'
import ReviveCard from './ReviveCard.vue'
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
    }
  },
  computed: {
    ...mapGetters(['questionCount', 'index', 'code']),
    restCount () {
      return this.questionCount - this.index + 1
    }
  },
  methods: {
    formatIndex (index) {
      let result = index
      switch (+index) {
        case 1: {
          result = '1st'
          break
        }
        case 2: {
          result = '2nd'
          break
        }
        case 3: {
          result = '3rd'
          break
        }
        default: {
          result = `${index}th`
        }
      }
      return result
    },
    invite () {
      this.isClose = true
      setTimeout(() => {
        this.showInviteTip = true
      }, 400)
    }
  },
  components: {
    Modal,
    ReviveCard
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
      width: 156px;
      display: inline-block;
      margin-top: 12.8%;
    }

    .fail {
      font-size: 40px;
      margin-top: 42px;
      line-height: 1.5;
    }

    .fail-note {
      font: 300 26px/1.3 'Roboto', Arial, serif;
    }

    .divorce {
      width: 100%;
      height: 0px;
      border: 1px solid #eaf3fb;
      margin: 36px 0;
    }

    .btn-invite {
      width: 407px;
      height: 75px;
      border-radius: 46px;
      border: none;
      background: #f0af3d;
      color: #fff;
      font-weight: 400;
      margin-top: 41px;
      img {
        width: 64px;
        margin-top: 8px;
        display: inline-block;
        vertical-align: middle;
      }
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
