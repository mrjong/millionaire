<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import './assets/css/public.css'
export default {
  name: 'App',
  data () {
    return {
      loginStatus: true
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.$http.get('')
        .then((data) => {
          // this.loginStatus = data.
          this.loginStatus ? this.$router.push('/home') : this.$router.push('/login')
        })
    }
  }
}
</script>

<style>
</style>
