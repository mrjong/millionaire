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
      list: 'list'
    })
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.$store.dispatch('fetch')
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
