<template>
  <div class="login-tip">
    <balance-mark v-if="showLogin" style="text-align:center;" :data-info="dialogInfo" @okEvent='login'></balance-mark>
    <loading v-if="loading"></loading>
  </div>
</template>
<script>
import BalanceMark from './BalanceMark'
import utils from '../assets/js/utils'
import * as type from '../store/type'
import { api } from '../assets/js/api'
import loading from '../components/Loading.vue'
export default {
  name: 'login-tip',
  data () {
    return {
      showLogin: true,
      loading: false,
      dialogInfo: {
        htmlTitle: 'Important hint',
        htmlText: this.desp,
        shouldSub: false,
        markType: 0,
        okBtnText: 'Log in now',
        hintImg: 'http://static.subcdn.com/201803281952051c52ffc800.png'
      }
    }
  },
  props: {
    desp: {
      type: String,
      default: ''
    }
  },
  methods: {
    login () {
      utils.login(() => {
        // 更新登陆状态
        this.$store.commit(type._UPDATE, {isOnline: true})
        utils.isOnline = true
        this.sync()
        utils.statistic('login_page', 1, {'result_code_s': '1'}, 'login_page')
      })
    },
    // 同步用户信息
    sync () {
      this.loading = true
      api.syncInfo().then(({data}) => {
        console.log('同步返回数据：', data)
        this.loading = false
        if (+data.result === 1 && +data.code === 0) {
          this.loading = true
          // 同步成功后重新初始化
          this.$store.dispatch(type._INIT).then(() => {
            this.loading = false
            this.$emit('syncInfoSuccess')
          }, (err) => {
            this.loading = false
            console.log('同步成功，初始化出错:', err)
          })
        } else {
          console.log('同步失败')
        }
      }, (err) => {
        console.log('同步出错：', err)
        this.loading = false
      })
    },
    error (errMsg, callback) {
    }
  },
  components: {
    BalanceMark,
    loading
  }
}
</script>
<style lang="less" scoped>
</style>
