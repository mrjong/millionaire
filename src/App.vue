<template>
  <div id="app">
    <keep-alive include="Main,DoubleRewardCard">
      <router-view/>
    </keep-alive>
    <balance-mark style="text-align:center;" v-show="showDialog" :data-info="dialogInfo" @okEvent='closeDialog'></balance-mark>
    <login-tip v-show="showLogin" @loginTipClose="showLogin = false" @loginTipOpen="showLogin = true" desp="Congrats! You won! If you want to cash out your balance, please login now. Otherwise, your balance will be reset to zero after 24 hours."></login-tip>
    <revive-guide v-if="initialState === 1"></revive-guide>
    <loading v-if="loading"></loading>
    <WonTipModal v-model="isShowTipModal" @close="isShowTipModal = false" @share="share"></WonTipModal>
    <revive-card :reviveObj="reviveObj" @callbackFailed="callbackFailed" @shareClose="shareClose"></revive-card>
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
import WonTipModal from './components/WonTipModal'
import ReviveCard from './components/ReviveCard'

export default {
  name: 'App',
  data () {
    return {
      loading: false,
      showLogin: false,
      showGameDialog: true,
      windowInnerHeight: 0,
      timeOffset: 0,
      reviveObj: {
        title: this.$t('receiveCard.invite_pop.text1'),
        hint: this.$t('receiveCard.invite_pop.text2'),
        isShare: false,
        type: 'reward'
      },
      markInfo: {
        showMark: false,
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: ''
      },
      isShowTipModal: false
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
      userInfo: 'userInfo',
      initialState: 'initialState'
    })
  },
  beforeCreate () {
    if (window.performance && window.performance.navigation && window.performance.navigation.type && window.performance.navigation.type === 2) {
      window.location.reload()
    }
  },
  created () {
    this.loading = true
    this.$store.commit(type.HOME_UPDATE, {
      icode: utils.getQuery('icode') || utils.icode
    })
    api.queryAgreePolicy().then(({data}) => {
      this.loading = false
      const {isEU = false} = data.data || {}
      if (data.result === 1) {
        if (isEU) {
          this.$router.replace('/blank')
        } else {
          if (data.data.agree) {
            this.$store.commit(type._UPDATE, {
              isAgreePolicy: true
            })
          } else {
            this.$store.commit(type._UPDATE, {
              isAgreePolicy: false
            })
          }
        }
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
        this.$store.commit(type._UPDATE, {
          isAgreePolicy: false
        })
      }
    })
    this.init()
    this.getPhoneNationCode()
  },
  mounted () {
    // 利用resize事件判断是否调起软键盘
    this.windowInnerHeight = window.innerHeight
    window.addEventListener('resize', () => {
      if (Date.now() - this.timeOffset < 500) {
        this.timeOffset = Date.now()
        return false
      }
      if (window.innerHeight - this.windowInnerHeight >= 150) {
        this.$store.commit(type._UPDATE, {
          isInputting: false
        })
      } else if (this.windowInnerHeight - window.innerHeight >= 150) {
        this.$store.commit(type._UPDATE, {
          isInputting: true
        })
      }
      this.windowInnerHeight = window.innerHeight
      this.timeOffset = Date.now()
    })
  },
  methods: {
    init () {
      this.$store.dispatch(type._INIT_LISTENER)
    },
    /**
     * 关闭弹窗
     */
    closeDialog () {
      if (this.dialogInfo.okEvent) {
        this.dialogInfo.okEvent()
      }
      this.$store.commit(type._CLOSE_DIALOG)
    },
    /**
     * 获取手机号国家码
     */
    getPhoneNationCode () {
      let phoneNationCodes = utils.storage.get('millionaire-phoneNationCode')
      // 从本地获取
      if (phoneNationCodes) {
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
              utils.storage.set('millionaire-phoneNationCode', {
                phoneNationCode,
                phoneNationCodeList
              })
            }
          }
        })
      }
    },
    // 上报验证好友邀请码
    reportCheckCode () {
      if (this.userInfo.icode) {
        if (utils.isOnline) {
          console.log('已登录' + this.userInfo.icode)
          api.checkInviteCode(this.userInfo.icode).then(({data}) => {
            if (data.result !== 1) {
              return false
            } else {
              utils.clearShareParams()
            }
          }).catch(() => {
            return false
          })
        } else {
          utils.login(() => {
            console.log('刚登录' + this.userInfo.icode)
            this.$store.dispatch(type._INIT).then(() => {
              api.checkInviteCode(this.userInfo.icode).then(({data}) => {
                if (data.result !== 1) {
                  return false
                } else {
                  utils.clearShareParams()
                }
              }).catch(() => {
                return false
              })
            })
            if (this.status === 2) {
              this.$router.replace({path: '/main'})
            } else {
              this.$router.replace({path: '/'})
            }
          })
        }
      }
    },
    callbackFailed () {
      this.markInfo.htmlText = 'Fail to submit, please try again later.'
      this.markInfo.showMark = true
    },
    shareClose () {
      this.reviveObj.isShare = false
    },
    share (data) {
      this.$router.push('/invite')
      // this.reviveObj.isShare = data.isShare
      // this.reviveObj.code = this.code
    }
  },
  components: {
    loading,
    LoginTip,
    BalanceMark,
    ReviveGuide,
    WonTipModal,
    ReviveCard
  },
  watch: {
    status: function (status, oldStatus) {
      window.gameState = status
      if (status !== 1 && oldStatus === 1) {
        if ((this.userInfo.icode && utils.isOnline) || !this.userInfo.icode) {
          this.$router.push({path: '/main'})
        }
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
      } else {
        utils.playSound('bg')
      }
      // 是否展示you won
      if (+status === 4 && !this.watchingMode) {
        api.ifSelfWon()
          .then(({data}) => {
            if (+data.result === 1) {
              let dataObj = data.data
              const isWon = dataObj.result_code
              this.showLogin = isWon && !this.isOnline
              // 展示you won的同时弹出分享弹框
              this.isShowTipModal = isWon && this.isOnline
              this.$store.dispatch(type.HOME_UPDATE, {
                myselfBonusAmount: dataObj.show_bonus
              })
              this.$store.commit(type.QUESTION_UPDATE, {
                isWon
              })
            }
          })
      }
    },
    '$route' (route) {
      if (route.path === '/main' && this.status === 1) {
        this.$router.replace({path: '/'})
      }
    },
    initialState: function (newInitialState, oldInitialState) {
      if (oldInitialState === -1 && newInitialState !== -1) {
        this.reportCheckCode()
      }
    }
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
  src: local('Roboto Condensed'), local('RobotoCondensed-Regular'), url(//static.apusapps.com/201803201601364bf0e78d16.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Condensed'), local('RobotoCondensed-Regular'), url(//static.apusapps.com/201803201601401014a81eaa.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}

  /* latin-ext */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Condensed Bold'), local('RobotoCondensed-Bold'), url(//static.apusapps.com/2018032016013762a8c1210f.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Condensed Bold'), local('RobotoCondensed-Bold'), url(//static.apusapps.com/201803201601353e1f01c5c2.woff2) format('woff2');
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
