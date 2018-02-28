<template>
  <div class="chat-msg-wrap" id="msgContainer">
    <ul class="msg-container">
      <transition-group name='fade'>
        <li
          class="msg-container__item"
          v-for="(col, idx) in chatRoomState.msgList"
          :key="idx"
          >
          <img class="msg-container__item__portrait" :src="col.img" alt="">
          <span class="msg-container__item__nickname">{{col.nickname}}</span>
          <span class="msg-container__item__text">{{col.msg}}</span>
        </li>
      </transition-group>
    </ul>
    <div class="msg-send-container" :class="{'msg-send-container-showinput': showInput}">
       <p class="msg-send-container__wrap" :class="{'msg-send-container__show': showInput, 'msg-send-container__hide': !showInput}">
        <input
          class="msg-send-container__wrap__input"
          id="sendmessage"
          type="text"
          @blur="() => {showInput = false}"
          v-model.trim="myMessage">
        <span class="msg-send-container__wrap__btn" @click="sendMessage">Send</span>
      </p>
      <label @click="() => {showInput = true}" class="msg-send-container__icon iconfont icon-pinglun" for="sendmessage" :class="{'msg-send-container__hide': showInput, 'msg-send-container__show': !showInput}"></label>
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
      myMessage: '',
      showInput: false,
      pageHeight: null
    }
  },
  computed: {
    ...mapGetters({
      chatRoomState: 'chatRoomState',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.$store.dispatch(type.CHAT_GET_USER_ID, (userId) => {
      const userInfos = Object.assign({}, this.userInfo)
      userInfos.userId = userId
      this.$store.dispatch(type.HOME_UPDATE, userInfos)
    })
    this.$store.dispatch(type.CHAT_LIST_FETCH)
    this.$nextTick(() => {
      const bodys = document.getElementsByTagName('body')[0]
      const bodyHeight = bodys.clientHeight
      bodys.style.height = bodyHeight + 'px'
    })
  },
  methods: {
    sendMessage () {
      if (this.myMessage) {
        this.showInput = false
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
              this.myMessage = ''
            })
          }
        })
      }
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
  width: 60px;
  position: fixed;
  bottom: 33px;
  right: 30px;
  display: flex;
  justify-content: flex-end;
  &__icon {
    // display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .2);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__hide {
    opacity: 0;
  }
  &__show {
    opacity: 1;
  }
  &__wrap {
    width: 100%;
    height: 110px;
    display: flex;
    padding: 14px;
    background: #f6f6f6;
    justify-content: center;
    align-items: center;
    &__input {
      width: 594px;
      height: 84px;
      border: 1px solid #dcdcdc;
      outline: none;
      font-size: 20px;
      color: #241262;
      font-family: 'Roboto-Regular';
      padding: 0 23px;
    }
    &__btn {
      font-size: 22px;
      font-family: 'Roboto-Regular';
      color: #FFB227;
      flex: 1;
      text-align: center;
    }
  }
}
.msg-send-container-showinput {
  width: 100%;
  right: 0px;
  bottom: 0px;
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
