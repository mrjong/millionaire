<template>
  <div id="app">
    <keep-alive include="Main">
      <router-view/>
    </keep-alive>
    <balance-mark style="text-align:center;" v-show="showDialog" :data-info="dialogInfo" @okEvent='closeDialog'></balance-mark>
    <login-tip v-if="showLogin" @loginTipClose="showLogin = false" desp="Congrats! You won! If you want to cash out your balance, please login now. Otherwise, your balance will be reset to zero after 24 hours."></login-tip>
    <!-- <div class="dialog-game" v-if="showGameDialog">
      <div class="con">
        <img src="http://static.subcdn.com/201804042026229f4a3491a2.png" alt="">
        <div class="contents">
          <span class="iconfont icon-cuowu" style="font-size:0.28rem;color:#fff;margin-left:91.22%;margin-top:3.8%;display: inline-block;" @click="showGameDialog = false"></span>
          <button class="btn-fb" @click="toFb"></button>
        </div>
      </div>
    </div> -->
    <revive-guide v-if="initialState === 1"></revive-guide>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import './assets/css/public.css'
import * as type from './store/type'
import loading from './components/Loading.vue'
import utils from './assets/js/utils'
import im from './assets/js/im'
import * as api from './assets/js/api'
import LoginTip from './components/LoginTip'
import BalanceMark from './components/BalanceMark'
import ReviveGuide from './components/ReviveGuide.vue'
import { NETWORK_UNAVAILABLE } from './assets/js/listener-type'
export default {
  name: 'App',
  data () {
    return {
      loading: false,
      showLogin: false,
      showGameDialog: true
    }
  },
  computed: {
    ...mapGetters({
      isOnline: 'isOnline',
      status: 'status',
      watchingMode: 'watchingMode',
      questionStatus: 'question_status',
      showDialog: 'showDialog',
      dialogInfo: 'dialogInfo',
      initialState: 'initialState'
    })
  },
  created () {
    api.queryAgreePolicy().then(({data}) => {
      if (data.result === 1 && data.data.agree) {
        if (this.isOnline || utils.clientId) {
          this.loading = true
          this.$store.dispatch(type._INIT).then(() => {
            this.loading = false
            this.$statisticEntry() // 入口打点
          }, (err) => {
            this.loading = false
            console.log(err)
          })
        }
      } else {
        this.$router.replace({path: '/policy'})
      }
    })
    this.init()
    this.getPhoneNationCode()
  },
  methods: {
    init () {
      im.addListener(NETWORK_UNAVAILABLE, () => {
        !utils.disableNetworkTip && this.$store.dispatch(type._OPEN_DIALOG, {
          htmlTitle: 'Please check your internet connection.',
          htmlText: 'Otherwise your phone may hang or delay during the game if your internet is unstable.',
          shouldSub: false,
          markType: 0,
          okBtnText: 'OK'
        })
        utils.statistic('NETWORK_UNAVAILABLE', 6)
      })
      this.$store.dispatch(type.GET_COMPERE_MESSAGE_ACTION)
      this.$store.dispatch(type.QUESTION_INIT)
      this.$store.dispatch(type._UPDATE_AMOUNT)
      this.$store.dispatch(type._RECEIVE_RESULT)
      this.$store.dispatch(type._END)
    },
    /**
     * 关闭弹窗
     */
    closeDialog () {
      this.$store.commit(type._UPDATE, {
        showDialog: false,
        dialogInfo: {
          htmlTitle: '',
          htmlText: '',
          shouldSub: false,
          markType: 0,
          okBtnText: 'OK',
          hintImg: 'http://static.subcdn.com/201803261933287074f92538.png'
        }
      })
    },
    /**
     * 获取手机号国家码
     */
    getPhoneNationCode () {
      const phoneNationCodeStr = localStorage.getItem('millionaire-phoneNationCode')
      let phoneNationCodes = null
      // 从本地获取
      if (phoneNationCodeStr) {
        phoneNationCodes = JSON.parse(phoneNationCodeStr)
        const {phoneNationCode, phoneNationCodeList} = phoneNationCodes
        this.$store.commit(type._UPDATE, {
          phoneNationCodeList,
          phoneNationCode
        })
      } else {
        api.getPhoneNationCode().then(({data}) => {
          const code = +data.error_code
          switch (code) {
            case 0: {
              const phoneNationCode = (data.data && data.data.default) || {code: '91', country: 'India'}
              const phoneNationCodeList = (data.data && data.data.codes) || []
              this.$store.commit(type._UPDATE, {
                phoneNationCodeList,
                phoneNationCode
              })
              localStorage.setItem('millionaire-phoneNationCode', JSON.stringify({
                phoneNationCode,
                phoneNationCodeList
              }))
            }
          }
        })
      }
    }
  },
  components: {
    loading,
    LoginTip,
    BalanceMark,
    ReviveGuide
  },
  watch: {
    status: function (status, oldStatus) {
      if (status !== 1 && oldStatus === 1) {
        this.$router.push({path: '/main'})
      } else if (status === 1) {
        this.$router.replace({path: '/'})
        im.stopPullMsg()
        utils.stopSound()
      }

      if (status === 3) {
        utils.statistic('playing_page', 0)
        if (oldStatus === 2) {
          utils.statistic('introduction_stage', 0)
        }
      }
      // 比赛开始时，播放背景音乐
      if (status !== 3 || this.$route.path !== '/main') {
        utils.stopSound('bg')
        // 启用网络状况提示
        this.$store.commit(type._UPDATE, {
          disableNetworkTip: false
        })
      } else {
        utils.playSound('bg')
        // 禁止网络状况提示
        this.$store.commit(type._UPDATE, {
          disableNetworkTip: true
        })
      }
      // 是否展示you won
      if (+status === 4 && !this.watchingMode) {
        api.ifSelfWon()
          .then(({data}) => {
            if (+data.result === 1) {
              const isWon = !!data.data
              this.showLogin = isWon && !this.isOnline
              this.$store.dispatch(type.QUESTION_YOU_WON, {
                isWon
              })
            }
          })
      }
    }
    // '$route' (route) {
    //   // 路由变化切换状态
    //   if (route.path !== '/main') {
    //     this.$store.commit(type._UPDATE, {
    //       status: _AWAIT
    //     })
    //   }
    // }
  }
}
</script>

<style lang="less" type="text/less">
  @import "assets/css/iconfont/iconfont.css";
  html,body,#app{
    width:100%;
    height:100%;
    background: url('./assets/images/main-bg.jpg') no-repeat top left;
    background-size: cover;
  }

/* latin-ext */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Condensed'), local('RobotoCondensed-Regular'), url(http://static.subcdn.com/201803201601364bf0e78d16.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Condensed'), local('RobotoCondensed-Regular'), url(http://static.subcdn.com/201803201601401014a81eaa.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}

  /* latin-ext */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Condensed Bold'), local('RobotoCondensed-Bold'), url(http://static.subcdn.com/2018032016013762a8c1210f.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Condensed Bold'), local('RobotoCondensed-Bold'), url(http://static.subcdn.com/201803201601353e1f01c5c2.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}

.dialog-game {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 0;
  top: 0;

  .con {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      margin: 0 auto;
    }

    .contents {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;

      button {
        width: 320px;
        height: 85px;
        border: none;
        margin-left: 22.8%;
        margin-top: 102.91%;
        border-radius: 1rem;
        background: rgba(0,0,0,0);
        padding: 0;
        outline: none;
      }
    }
  }
}
</style>
