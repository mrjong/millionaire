<template>
  <div class="login-container bg-reset" v-webp.bg="`url('await-bg.jpg')`" @click="showCountryList = false">
    <header>
      <p class="title">{{$t('login.title')}}</p>
      <p class="back iconfont icon-fanhui" @click="back"> </p>
    </header>
    <section class="login">
      <section class="country inputItem" @click.stop="showCountryList = !showCountryList">
        <span class="iconfont icon-guojia"></span>
        <label>{{phoneNationCode.country}} +{{phoneNationCode.code}}</label>
        <span class="iconfont icon-LIVINGyoujiantou" style="float:right;transform: rotateZ(90deg);"></span>
      </section>
      <section class="phone inputItem">
        <!-- 手机号 -->
        <span class="iconfont icon-shouji"></span>
        <input type="number" :placeholder="$t('login.tel_tip')" v-model="phoneNumber">
      </section>
      <section class="code inputItem">
        <!-- 验证码 -->
        <span class="iconfont icon-yanzhengma"></span>
        <input type="text" :placeholder="$t('login.code_tip')" v-model="code" @keyup.enter="login">
        <button class="send" :class="{'send-disable': disableGetCode}" :disabled="disableGetCode" @click="sendCode">
          <span v-if="!disableGetCode">{{$t('login.send_btn')}}</span>
          <span v-else>{{restResetTime}}s</span>
        </button>
      </section>
      <!-- 错误信息 -->
      <p class="errorMsg">{{errorMsg}}</p>
      <button class="btn-login" @click="login">{{$t('login.login_btn')}}</button>
      <p class="policy">{{$t('login.notice')}}</p>
      <img src="../assets/images/apus-logo-white.png" :class="['login-container__footer', {hide: isInputting}]">
      <policy-link class="bottom" :class="{hide: isInputting}"></policy-link>
    </section>
    <country-list v-model="showCountryList"></country-list>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import loading from '../components/Loading.vue'
import CountryList from '../components/CountryList.vue'
import PolicyLink from '../components/PolicyLink'
import { register, signInByPhone } from '../assets/js/api'
let timer = null
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      showCountryList: false,
      disableGetCode: false, // 是否禁用获取验证码
      resetIntervalTime: 60, // 验证码获取重置间隔时间
      restResetTime: 0, // 剩余重置时间
      errorMsg: '  ',
      username: '',
      phoneNumber: '',
      code: '',
      isAgree: true
    }
  },
  computed: {
    ...mapGetters(['status', 'phoneNationCode', 'isInputting', 'isShowTaskEnd'])
  },
  mounted () {
    utils.statistic('login_page', 0)
  },
  methods: {
    back () {
      this.$router.replace('/')
    },
    /**
     * 登录验证
     */
    loginValidate () {
      if (!this.phoneNumber) {
        this.error(this.$t('login.login_pop.text1'))
        return false
      } else if (!this.code) {
        this.error(this.$t('login.login_pop.text2'))
        return false
      }
      return true
    },
    /**
     * 登录
     */
    login () {
      if (!this.isAgree) {
        return false
      }
      if (this.loginValidate()) {
        this.loading = true
        signInByPhone(this.code).then(({data}) => {
          const code = +data.error_code
          switch (code) {
            case 0: {
              utils.statistic('send_code', 1, {result_code_s: '1'}, 'sign_up')
              // 若为等待状态，返回首页
              this.$router.go(-1)
              // 调用登陆成功回调
              window.loginSuccess()
              break
            }
            case 20002: {
              utils.statistic('send_code', 1, {result_code_s: '0'}, 'sign_up')
              this.error(this.$t('login.login_pop.text2'))
              break
            }
            default: {
              utils.statistic('send_code', 1, {result_code_s: '0'}, 'sign_up')
              this.error(this.$t('login.login_pop.text3'))
              console.log('手机验证码验证失败:', data.error_msg)
            }
          }
          this.loading = false
        }, (err) => {
          utils.statistic('send_code', 1, {result_code_s: '0'}, 'sign_up')
          this.error(this.$t('login.login_pop.text3'))
          console.log('手机验证码验证出错', err)
        })
      }
    },
    /**
     * 初始化
     */
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
    /**
     * 发送验证码验证
     */
    sendCodeValidate () {
      if (!this.phoneNumber) {
        this.error(this.$t('login.login_pop.text1'))
        return false
      }
      return true
    },
    /**
     * 发送验证码
     */
    sendCode () {
      utils.statistic('send_code', 1, {}, 'sign_up')
      const {phoneNationCode} = this
      if (this.sendCodeValidate()) {
        this.disableGetCode = true
        // 60s 后重试
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
        // 若输入的手机号码包含国家码，则只取手机号码
        if (this.phoneNumber.slice(phoneNationCode.length) === phoneNationCode) {
          this.phoneNumber = this.phoneNumber.slice(phoneNationCode.length)
        }
        register(this.phoneNumber, phoneNationCode.code || '91').then(({data}) => {
          const code = +data.error_code
          switch (code) {
            case 0: {
              break
            }
            case 40022: {
              this.error(this.$t('login.login_pop.text4'))
              break
            }
            default: {
              this.error(this.$t('login.login_pop.text5'))
              console.log('发送验证码失败：', data.error_msg)
            }
          }
        }, err => {
          this.error(this.$t('login.login_pop.text5'))
          console.log('发送验证码出错：', err)
        })
      }
    },
    error (msg) {
      this.errorMsg = msg
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.errorMsg = ''
      }, 3000)
    },
    selectCountryCode (countryItem) {
      this.$store.commit(type._UPDATE, {
        phoneNationCode: {
          code: countryItem[1],
          country: countryItem[2]
        }
      })
    }
  },
  components: {
    loading,
    CountryList,
    PolicyLink
  }
}
</script>
<style scoped lang="less" type="text/less">
  .login-container {
    width: 100%;
    height: 100%;
    padding: 3.7% 3.7% 0;
    display: flex;
    flex-direction: column;

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
        position: absolute;
        left: 0;
      }

      .title {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        text-align: center;
        font: 400 36px/51.5px 'Roboto', Arial, serif;
        color: #fff;
      }
    }

    .login {
      margin-top: 20%;
      font: 400 28px 'Roboto', Arial, serif;
      color:#fff;
      flex: 1;
      position: relative;

      input {
        background-color: rgba(0, 0, 0, 0);
        outline: none;
        border: none;
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
        padding: 24px 0;
        font-size: 24px;
        color: #ee2d7a;
        text-align: right;
        position: absolute;
        right: 0;
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
        margin-top: 72px;
      }
      .policy {
        margin-top: 35px;
        color:#fff;
        font: 300 24px 'Roboto', Arial, serif;
        color:#efab33;
        text-align: center;
      }
    }

    &__footer {
      width: 135px;
      position: absolute;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .hide {
    visibility: hidden;
  }
  .bottom {
    width: 100%;
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
