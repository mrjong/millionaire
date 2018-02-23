<template>
  <div>
    BroadcastCountDown
    <chat-room></chat-room>
  </div>
</template>

<script>
import ChatRoom from './ChatRoom'
export default {
  name: 'BroadcastCountDown',
  data () {
    return {
    }
  },
  components: {
    ChatRoom
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
