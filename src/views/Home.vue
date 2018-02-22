<template>
  <div>
    HomePage
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      state: 'CountDown'
    }
  },
  updated () {
    this.setRouter()
  },
  mounted () {
    this.setRouter()
  },
  methods: {
    setRouter () {
      switch (this.state) {
        case 'CountDown':
          this.$router.push('/home/count-down')
          break
        case 'BroadCasting':
          this.$router.push('/home/broadcasting')
          break
        case 'NotBroadCast':
          this.$router.push('/home/not-begin')
          break
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
