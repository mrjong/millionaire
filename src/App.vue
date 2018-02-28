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
      isOnline: 'isOnline'
    })
  },
  mounted () {
    this.$store.dispatch(type._INIT)
    this.$store.dispatch(type._UPDATE_AMOUNT)
    this.$store.dispatch(type._RECEIVE_RESULT)
    if (this.isOnline) {

    } else {
      this.$router.push({path: '/login'})
    }
  },
  methods: {
    fetch () {
      this.$http.get('')
        .then((data) => {
          // this.loginStatus = data.
          // this.loginStatus ? this.$router.push('/main') : this.$router.push('/login')
        })
    }
  },
  components: {}
}
</script>

<style>
  html,body,#app{
    width:100%;
    height:100%;
  }
</style>
