<template>
  <div>
    chatRoom
    <ul class="message-list">
      <li v-for="(col) in chatRoomState. msgList" :key='col["sendTime"]'>
        {{col['content']['content']}}
      </li>
    </ul>
    <input type="text" v-model.trim="myMessage">
    <p class="send-btn" @click="senMessage">send</p>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'ChatRoom',
  data () {
    return {
      chatRoomId: 'room10',
      myMessage: ''
    }
  },
  computed: {
    ...mapGetters({
      chatRoomState: 'chatRoomState'
    })
  },
  mounted () {
    this.createCahtRoom()
  },
  methods: {
    createCahtRoom () {
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
    senMessage () {
      this.$store.dispatch('sendMessage', {
        msg: this.myMessage,
        roomId: this.chatRoomId
      })
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
</style>
