<template>
  <div class="login-container">
    <header class="flex-box flex-align-center">
      <button class="back iconfont icon-fanhui" @click="back">
      </button>
      <p class="title">Sign In</p>
    </header>
    <form class="login" name="login">
      <section class="username inputItem">
        <span class="iconfont icon-nicheng"></span>
        <input type="text" placeholder="Enter Your Name">
      </section>
      <section class="phone inputItem">
        <span class="iconfont icon-shouji"></span>
        <input type="text" placeholder="Enter Your Phone Number">
      </section>
      <section class="code inputItem">
        <span class="iconfont icon-yanzhengma"></span>
        <input type="text" placeholder="Enter Verification Code ">
        <button class="send" :class="{'send-disable': disableGetCode}" :disabled="disableGetCode" @click="sendCode">
          <span v-if="!disableGetCode">Send</span>
          <span v-else>{{restResetTime}}s</span>
        </button>
      </section>
      <p class="errorMsg">{{errorMsg}}</p>
      <button class="btn-login">Sign in</button>
    </form>
    <img src="../assets/images/apus-logo-white.png" class="login-container__footer">
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import loading from '../components/Loading.vue'
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      disableGetCode: false, // 是否禁用获取验证码
      resetIntervalTime: 60, // 验证码获取重置间隔时间
      restResetTime: 0, // 剩余重置时间
      errorMsg: 'Please enter a right phone number.'
    }
  },
  computed: {
    ...mapGetters({
      status: 'status'
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    // 登录方法
    Login: function () {
      console.log('login')
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
          this.$router.replace({path: '/'})
        } else {
          this.$router.replace({path: '/main'})
        }
        this.$statisticEntry()
      }, () => {
        this.loading = false
      })
    },
    sendCode () {
      this.disableGetCode = true
      const {resetIntervalTime} = this
      this.restResetTime = resetIntervalTime
      const timer = utils.Timer(1000, resetIntervalTime * 1000)
      timer.addCompleteListener(() => {
        this.restResetTime = this.restResetTime - 1
      })
      timer.addEndListener(() => {
        this.restResetTime = 0
        this.disableGetCode = false
      })
      timer.start()
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
  .login-container {
    width: 100%;
    height: 100%;
    background: url("../assets/images/await-bg.jpg") no-repeat top left;
    background-size: cover;
    position: relative;
    padding: 3.7% 3.7% 0;

    button {
      outline: none;
      border: none;
    }

    header {
      width: 100%;
      min-height: 51.5px;
      position: relative;
      box-sizing: content-box;
      .back {
        width: 51.5px;
        height: 51.5px;
        border-radius: 51.5px;
        background-color: #3f3567;
        font-size: 24.67px;
        line-height: 51.5px;
        padding: 2px 2px 0 0;
        text-align: center;
      }

      .title {
        width: 100%;
        position: absolute;
        left: 0;
        text-align: center;
        font: 400 36px 'Roboto', Arial, serif;
        color: #fff;
      }
    }

    .login {
      margin-top: 37%;
      font: 400 28px 'Roboto', Arial, serif;

      input {
        background-color: rgba(0, 0, 0, 0);
        outline: none;
        border: none;
        color:#fff;
        width: 65%;
      }

      input::-webkit-input-placeholder{
        color:#58528b;
      }

      .inputItem {
        padding: 40px 0 23px;
        border-bottom: 1px solid #585188;
        position: relative;
        font-size: 32px;

        .iconfont {
          vertical-align: middle;
          font-size: 32px;
          margin-right:28px;
        }

        .icon-shouji {
          font-size: 35px;
        }

      }
      .errorMsg {
        padding: 24px;
        font-size: 24px;
        color: #ee2d7a;
        text-align: right;
      }
      .code {
        .send {
          width: 140px;
          height: 53px;
          border: none;
          outline: none;
          border-radius: 27px;
          background-color: #ee2d7a;
          color: #fff;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        .send-disable {
          color: #9288b3;
          background-color: #493981;
        }
      }

      .btn-login {
        width: 100%;
        height: 93px;
        border-radius: 1rem;
        background-color: #f3a207;
        color: #fff;
      }
    }

    &__footer {
      width: 135px;
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
