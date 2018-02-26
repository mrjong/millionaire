<template>
  <div class="respondence-container">
    <winners-result></winners-result>
  </div>
</template>

<script>
import winnersResult from './WinnersResult'
export default {
  name: 'Respondence',
  data () {
    return {
    }
  },
  components: {
    winnersResult
  }
}
</script>
<style scoped lang="less" type="text/less">
.respondence-container {
  width: 100%;
}
</style>
