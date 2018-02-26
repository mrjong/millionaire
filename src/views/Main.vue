<template>
  <div>
    <count-down></count-down>
  </div>
</template>

<script>
import CountDown from '../components/CountDown.vue'
export default {
  name: 'Main',
  data () {
    return {
      state: 'CountDown'
    }
  },
  mounted () {
    this.setRouter()
  },
  methods: {
    setRouter () {
    }
  },
  components: {
    CountDown
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
