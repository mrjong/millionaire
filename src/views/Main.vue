<template>
  <div>
    <broad-cast-count-down></broad-cast-count-down>
  </div>
</template>

<script>
import BroadCastCountDown from '../components/BroadCastCountDown.vue'
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
    BroadCastCountDown
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
