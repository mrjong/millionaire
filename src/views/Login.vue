<template>
  <div class="login-container">
    <img src="../assets/images/login-title.png" class="login-container__title">
    <div class="login-container__btn">
      <p class="login-container__btn__fb" @click="Login">Log in</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import utils from '../assets/js/utils'
export default {
  name: 'Login',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      status: 'status'
    })
  },
  methods: {
    // 登录方法
    Login: function () {
      utils.login(() => {
        // 返回主页面
        this.$store.commit(type._UPDATE, {
          isOnline: true
        })
        this.$store.dispatch(type._INIT).then(() => {
          if (this.status === 1) {
            this.$router.push({path: '/await'})
          } else {
            this.$router.push({path: '/main'})
          }
        })
      })
      this.$store.commit(type._UPDATE, {
        isOnline: true
      })
      this.$store.dispatch(type._INIT).then(() => {
        if (this.status === 1) {
          this.$router.push({path: '/await'})
        } else {
          this.$router.push({path: '/main'})
        }
      })
    }
  },
  mounted () {}
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
      padding-top: 120px;
      width: 592px;
      margin: 0 auto;
    }
    &__btn{
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translate(-50%);
      text-align: center;
      &__fb,{
        display: block;
        width: 658px;
        height: 94px;
        line-height: 94px;
        text-align: center;
        color: #ffffff;
        font-size: 36px;
        background-color: #f0a01b;
        opacity: 0.95;
        border-radius: 46px;
        margin: 0 auto;
        position: relative;
      }
    }
  }
</style>
