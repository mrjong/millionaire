<template>
  <div class="login-container">
    <img src="../assets/images/logo.png" class="login-container__title">
    <div class="login-container__info">
      <p class="login-container__info__hint">Log in to join Go! Millionaire</p>
      <p class="login-container__info__hint">Win real cash up to Rs. 1,000,000 every 20:00</p>
      <p class="login-container__info__fb" @click="Login">Log in</p>
    </div>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import loading from '../components/loading.vue'
export default {
  name: 'Login',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      status: 'status'
    })
  },
  methods: {
    // 登录方法
    Login: function () {
      if (utils.isOnline) {
        this.init()
      } else {
        utils.login(() => {
        // 更新登陆状态
          this.$store.commit(type._UPDATE, {isOnline: true})
          utils.isOnline = true
          this.init()
          utils.statistic('login_page', 1, {'result_code_s': '1'}, 'login_page')
        })
      }
    },
    init () {
      this.loading = true
      this.$store.dispatch(type._INIT).then(() => {
        this.loading = false
        if (this.status === 1) {
          this.$router.push({path: '/'})
        } else {
          this.$router.push({path: '/main'})
        }
      }, () => {
        this.loading = false
      })
    }
  },
  mounted () {
    utils.statistic('login_page', 0)
  },
  components: {
    loading
  }
}
</script>
<style scoped lang="less" type="text/less">
  .login-container{
    width: 100%;
    height: 100%;
    background: url("../assets/images/login-bg.jpg") no-repeat top left;
    background-size: cover;
    position: relative;
    &__title{
      padding-top: 86px;
      width: 592px;
      margin: 0 auto;
    }
    &__info{
      position: absolute;
      bottom: 100px;
      width: 100%;
      text-align: center;
      &__fb{
        font: 300 36px/94px 'Roboto', Arial, serif;
        width: 658px;
        height: 94px;
        color: #ffffff;
        background-color: #faa717;
        opacity: 0.95;
        border-radius: 46px;
        margin: 28px auto 0;
      }
      &__hint{
        font: 400 24px/32px 'Roboto', Arial, serif;
        width: 100%;
        color: #ffe033;
        text-shadow: 4px 4px 4px rgba(39, 20, 166, 0.6);
      }
    }
  }
</style>
