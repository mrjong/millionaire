<template>
  <div id="app">
    <router-view/>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import './assets/css/public.css'
import * as type from './store/type'
import loading from './components/loading.vue'
import utils from './assets/js/utils'
import * as api from './assets/js/api'
import {_AWAIT} from './assets/js/status'
import im from './assets/js/im'
export default {
  name: 'App',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      isOnline: 'isOnline',
      status: 'status',
      watchingMode: 'watchingMode',
      questionStatus: 'question_status'
    })
  },
  created () {
    this.init()
    if (this.isOnline) {
      this.loading = true
      this.$store.dispatch(type._INIT).then(() => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      }, (err) => {
        this.$router.push({path: '/login'})
        this.loading = false
        console.log(err)
      })
    }
  },
  methods: {
    init () {
      this.$store.dispatch(type.GET_COMPERE_MESSAGE_ACTION)
      this.$store.dispatch(type.QUESTION_INIT)
      this.$store.dispatch(type._UPDATE_AMOUNT)
      this.$store.dispatch(type._RECEIVE_RESULT)
    }
  },
  components: {
    loading
  },
  watch: {
    status: function (status) {
      if (status !== 1) {
        this.$router.replace({path: '/main'})
        utils.setGameState(true)
      } else {
        this.$router.replace({path: '/'})
        utils.setGameState(false)
        utils.statistic('millionaire', 0, {style_s: 'waiting'})
        this.$router.push({path: '/'})
      }
      if (status === 2) {
        utils.statistic('millionaire', 0, {style_s: 'countdown'})
      } else if (status === 3) {
        utils.statistic('millionaire', 0, {style_s: 'playing'})
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
          .then((data) => {
            if (+data.result === 1) {
              // this.isWon = data.data
              console.log('是否显示you won 后台返回数据如下')
              console.log(data)
              this.$store.dispatch(type.QUESTION_YOU_WON, {
                isWon: data.data
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
        im.removeLister()
      } else {
        this.init()
      }
    }
  }
}
</script>

<style>
  @import "assets/css/iconfont.css";
  html,body,#app{
    width:100%;
    height:100%;
    background: url('./assets/images/main-bg.jpg') no-repeat top left;
    background-size: cover;
  }
   @font-face {
  font-family: 'RobotoCondensed-Bold';
  src: url('./assets/font/RobotoCondensed-Bold.ttf')
  }
  @font-face {
    font-family: 'RobotoCondensed-Regular';
    src: url('./assets/font/RobotoCondensed-Regular.ttf')
  }
  @font-face {
    font-family: 'Roboto-Light';
    src: url('./assets/font/Roboto-Light.ttf')
  }
  @font-face {
    font-family: 'Roboto-Medium';
    src: url('./assets/font/Roboto-Medium.ttf')
  }
  @font-face {
    font-family: 'Roboto-BoldCondensed';
    src: url('./assets/font/RobotoCondensed-Bold.ttf');
  }
</style>
