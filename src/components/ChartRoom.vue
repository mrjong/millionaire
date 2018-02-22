<template>
  <div>
    chartRoom
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'ChartRoom',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      chartRoomState: 'chartRoomState'
    })
  },
  mounted () {
    console.log(this.chartRoomState)
  },
  methods: {
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
