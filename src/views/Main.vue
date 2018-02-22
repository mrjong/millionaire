<template>
  <div>
    MainPage
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Main',
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
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
