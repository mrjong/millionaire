<template>
  <div>
    chatRoom
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'ChatRoom',
  data () {
    return {
      chatRoomId: 'room10'
    }
  },
  computed: {
    ...mapGetters({
      chatRoomState: 'chatRoomState'
    })
  },
  mounted () {
    this.$store.dispatch('getUserInfo', (userInfo) => {
      if (userInfo.token) {
        this.$store.dispatch('initChatRoom', {
          appKey: 'p5tvi9dsphpf4',
          token: userInfo.token,
          protobuf: null,
          chatRoomId: this.chatRoomId
        })
      }
    })
  },
  methods: {
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
