<template>
  <div class="chat-msg-wrap" id="msgContainer">
    <ul class="msg-container">
      <transition-group name='fade'>
        <li
          class="msg-container__item"
          :class="{'fade-out-top': +idx === 0, 'fade-out-bot': +idx === 1}"
          v-for="(col, idx) in chatRoomState.msgList"
          :key="idx"
          >
          <img class="msg-container__item__portrait" :src="col.img" alt="">
          <span class="msg-container__item__nickname">{{col.nickname}}</span>
          <span class="msg-container__item__text">{{col.msg}}</span>
        </li>
      </transition-group>
    </ul>
    <div class="msg-send-container">
      <input type="text" id="sendmessage" v-model.trim="myMessage">
      <label class="msg-send-container__icon" for="sendmessage"></label>
      <span class="msg-seng-container__btn" @click="sendMessage">SEND</span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
export default {
  name: 'ChatRoom',
  data () {
    return {
      msgLen: 10,
      chatRoomId: 'room10',
      myMessage: ''
    }
  },
  computed: {
    ...mapGetters({
      chatRoomState: 'chatRoomState',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.$store.dispatch(type.CHAT_LIST_FETCH)
  },
  methods: {
    sendMessage () {
      this.$store.dispatch(type.CHAT_SEND_MSG, {
        msgObj: {
          img: this.userInfo.avatar,
          msg: this.myMessage,
          nickname: this.userInfo.userName
        },
        cb: () => {
          this.$nextTick(() => {
            const msgContainer = document.getElementById('msgContainer')
            msgContainer.scroll(0, 10000)
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.chat-msg-wrap {
  width: 100%;
  height: 100%;
  flex:1;
  margin-bottom: 35px;
  overflow-y: scroll;
  position: relative;
}
.msg-send-container {
  position: fixed;
  bottom: 33px;
  right: 30px;
  // input {
  //   display: none;
  //   width: 0px;
  //   height: 0px;
  //   z-index: -100000;
  // }
  // &__icon {
  //   display: inline-block;
  //   width: 50px;
  //   height: 50px;
  //   background: rgba(255, 255, 255, .5);
  //   border-radius: 50%;
  // }
}
.msg-container {
  width: 100%;
  height: auto;
  &__item {
    max-width: 100%;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, .2);
    border-radius: 30px;
    padding: 8px 7px;
    margin: 6px 26px;
    box-sizing: border-box;
    img {
      display: inline-block;
    }
    span {
      font-size: 26px;
      font-family: "Roboto Medium";
      text-shadow: #666 1px 1px 1px;
    }
    &__portrait {
      width: 51px;
      height: 50px;
      border-radius: 50%;
    }
    &__nickname {
      color: #ffb227;
      padding: 0 14px;
    }
    &__text {
      color: #fff;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.fade-out-top {
  opacity: .15
}
.fade-out-bot {
  opacity: .4
}
.fade-enter-active, .fade-enter-active {
  transition: all .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
