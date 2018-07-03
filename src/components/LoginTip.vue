<template>
  <div class="login-tip">
    <balance-mark style="text-align:center;" :data-info="dialogInfo" @okEvent='enter'>
      <section class="timer-con" @click="close">
        <span class="iconfont icon-cuowu" style="font-size:14px;color:#504181;"></span>
      </section>
    </balance-mark>
    <loading v-if="loading"></loading>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import BalanceMark from './BalanceMark'
import utils from '../assets/js/utils'
import loading from '../components/Loading.vue'
export default {
  name: 'login-tip', // 登陆提示
  data () {
    return {
      loading: false,
      dialogInfo: {
        htmlTitle: 'Attention!!',
        htmlText: this.desp,
        shouldSub: false,
        markType: 0,
        okBtnText: 'Log in',
        hintImg: '//static.apusapps.com/201803281952051c52ffc800.png'
      }
    }
  },
  computed: {
    ...mapGetters(['isOnline'])
  },
  props: {
    desp: {
      type: String,
      default: ''
    }
  },
  methods: {
    enter () {
      if (this.isOnline) {
        this.sync()
      } else {
        this.login()
      }
    },
    login () {
      utils.login(() => {
        this.$emit('loginTipOpen')
        this.sync()
        utils.statistic('login_page', 1, {'result_code_s': '1'}, 'login_page')
      }, false)
      this.$emit('loginTipClose')
    },
    close () {
      this.$emit('loginTipClose')
    },
    // 同步用户信息
    sync () {
      this.loading = true
      utils.syncAccountInfo().then(() => {
        this.loading = false
        this.close()
      }, (errorCode) => {
        switch (errorCode) {
          case 3134: {
            this.error('Sorry', 'Oops, don\'t cry babe Your balance already reset to zero since you didn\'t cashout within the first 24 hours after you won. Please login after you win immediately for the next time.', 'OK', this.close)
            break
          }
          case 3135: {
            this.error(null, 'You\'ve logged in this account on other device. Please check and try another one.', 'OK', this.close)
            break
          }
          default: {
            this.error(null, 'You have disconnected. Please check your internet connection and try again.', 'Try again', this.sync)
          }
        }
        this.loading = false
      })
    },
    error (title = 'Attention!!', errMsg, btnText, callback) {
      this.dialogInfo.htmlTitle = title
      this.dialogInfo.htmlText = errMsg
      this.dialogInfo.okBtnText = btnText
      this.enter = callback
    }
  },
  components: {
    BalanceMark,
    loading
  }
}
</script>
<style lang="less" scoped>
  .login-tip {
    .timer-con {
      width: 45px;
      height: 45px;
      position: absolute;
      right: 20px;
      top: 20px;
      line-height: 45px;
      text-align: center;
    }
  }
</style>
