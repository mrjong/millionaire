<template>
  <div>
    example
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Example',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      exampleState: 'exampleState'
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
