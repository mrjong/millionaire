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
      status: 'status'
    })
  },
  created () {
    this.$store.dispatch(type.GET_COMPERE_MESSAGE_ACTION)
    this.$store.dispatch(type.QUESTION_INIT)
    this.$store.dispatch(type._UPDATE_AMOUNT)
    this.$store.dispatch(type._RECEIVE_RESULT)
    this.loading = true
    if (this.isOnline) {
      this.$store.dispatch(type._INIT).then(() => {
        setTimeout(() => {
          this.loading = false
          if (this.status === 1) {
            this.$router.push({path: '/await'})
          } else {
            this.$router.push({path: '/main'})
          }
        }, 500)
      }, (err) => {
        this.$router.push({path: '/login'})
        this.loading = false
        console.log(err)
      })
    } else {
      this.loading = false
      this.$router.push({path: '/login'})
    }
  },
  methods: {},
  components: {
    loading
  },
  watch: {
    status: function (status) {
      if (status === 1) {
        this.$router.push({path: '/await'})
      } else {
        this.$router.push({path: '/main'})
      }
    }
  }
}
</script>

<style>
  @import "./assets/css/iconfont/iconfont.css";
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
