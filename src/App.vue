<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import './assets/css/public.css'
import * as type from './store/type'
export default {
  name: 'App',
  data () {
    return {
      loginStatus: true
    }
  },
  computed: {
    ...mapGetters({
      isOnline: 'isOnline',
      status: 'status'
    })
  },
  mounted () {
    this.$store.dispatch(type._UPDATE_AMOUNT)
    this.$store.dispatch(type._RECEIVE_RESULT)
    if (this.isOnline) {
      this.$store.dispatch(type._INIT).then(() => {
        if (this.status === 1) {
          this.$router.push({path: '/await'})
        } else {
          this.$router.push({path: '/main'})
        }
      })
    } else {
      this.$router.push({path: '/login'})
    }
  },
  methods: {},
  components: {},
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
  }
</style>
