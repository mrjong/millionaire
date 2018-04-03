<template>
  <div id="app">
    <router-view/>
    <balance-mark style="text-align:center;" v-show="showDialog" :data-info="dialogInfo" @okEvent='closeDialog'></balance-mark>
    <login-tip v-if="showLogin" @loginTipClose="showLogin = false" desp="Congrats! You won! If you want to cash out your balance, please login now. Otherwise, your balance will be reset to zero after 24 hours."></login-tip>
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
import {_AWAIT} from './assets/js/status'
import LoginTip from './components/LoginTip'
import BalanceMark from './components/BalanceMark'
import { NETWORK_UNAVAILABLE } from './assets/js/listener-type'
export default {
  name: 'App',
  data () {
    return {
      loading: false,
      showLogin: false
    }
  },
  computed: {
    ...mapGetters({
      isOnline: 'isOnline',
      status: 'status',
      watchingMode: 'watchingMode',
      questionStatus: 'question_status',
      showDialog: 'showDialog',
      dialogInfo: 'dialogInfo'
    })
  },
  created () {
    this.init()
    if (this.isOnline || utils.clientId) {
      this.loading = true
      this.$store.dispatch(type._INIT).then(() => {
        setTimeout(() => {
          this.loading = false
        }, 500)
        this.$statisticEntry()
      }, (err) => {
        this.$router.replace({path: '/login'})
        this.loading = false
        console.log(err)
      })
    }
  },
  methods: {
    init () {
      im.addListener(NETWORK_UNAVAILABLE, () => {
        this.$store.dispatch(type._OPEN_DIALOG, {
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
    }
  },
  components: {
    loading,
    LoginTip,
    BalanceMark
  },
  watch: {
    status: function (status, oldStatus) {
      if (status !== 1) {
        this.$router.replace({path: '/main'})
        utils.setGameState(true)
      } else {
        this.$router.replace({path: '/'})
        utils.setGameState(false)
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
      } else {
        utils.playSound('bg')
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
    },
    '$route' (route) {
      // 路由变化切换状态
      if (route.path !== '/main') {
        this.$store.commit(type._UPDATE, {
          status: _AWAIT
        })
      }
    }
  }
}
</script>

<style>
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
</style>
