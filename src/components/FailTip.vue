<template>
  <section class="fail-tip-wrapper">
    <modal :value="!isClose">
      <section class="fail-tip">
        <img class="icon" src="../assets/images/icon-feedback.png" v-if="index === 1">
        <img class="icon" src="../assets/images/icon-answer-fail.png" v-else>
        <span class="iconfont icon-cuowu close" @click="isClose=true"></span>
        <p v-if="index === 1">Unwilling to be ELIMINATED?</p>
        <p v-else>
          <span class="fail">Oops!</span>
          You failed on the {{formatIndex(index)}} question.
        </p>
        <div class="divorce"></div>
        <section class="fail-note" v-if="index === 1">
          <p>Tell us the reason you failed on this question.Let's make this game better!</p>
        </section>
        <section class="fail-note" v-else>
          <!-- eslint-disable-next-line -->
          <p>There {{restCount > 1 ? 'are' : 'is'}} only {{restCount}} question{{restCount > 1 ? 's' : ''}} between you and a MILLION.</p>
          <p>Invite a new user to get a extra life</p>
        </section>
        <button v-if="index === 1" @click="feedback" class="btn-invite">JOIN NOW</button>
        <button v-else @click="invite" class="btn-invite">Invite Now <img src="../assets/images/icon-add-extraLife.png"></button>
      </section>
    </modal>
    <revive-card :reviveObj="{isShare: showInviteTip, code: code}" v-if="showInviteTip" @shareClose="showInviteTip = false"></revive-card>
  </section>
</template>
<script>
import {mapGetters} from 'vuex'
import Modal from './Modal.vue'
import ReviveCard from './ReviveCard.vue'
import utils from '../assets/js/utils'
import {getReportUrl} from '../assets/js/api'
import * as type from '../store/type'
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
  computed: {
    ...mapGetters(['questionCount', 'code']),
    restCount () {
      return this.questionCount - this.index + 1
    }
  },
  methods: {
    formatIndex: utils.formatIndex,
    invite () {
      this.isClose = true
      // 判断是否登录
      if (utils.isOnline) {
        setTimeout(() => {
          this.showInviteTip = true
        }, 400)
      } else {
        utils.login(() => {
          this.$store.commit(type._UPDATE, {isOnline: true})
          utils.isOnline = true
          utils.statistic('game_page', 1, {'result_code_s': '1'}, 'pame_page')
          this.$store.dispatch(type._INIT).then(() => {
            this.$router.go(-1)
          })
          this.showInviteTip = true
        })
      }
    },
    feedback () {
      window.location.href = getReportUrl()
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
