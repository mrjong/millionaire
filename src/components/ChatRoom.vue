<template>
<div class="chat-container"
  id="msgContainer"
  :class="{'chat-msg-wrap-haswrap': showInput}">
  <div class="chat-msg-wrap" id='chatmsgwrap'>
      <div class="msg-container" id="scrollContainer" ref="scrollContainer">
         <transition-group
        name='fade'
        tag="div"
        class="msg-container__inner"
        id="msgContainerInner"
        >
        <p class="msg-container__item" v-for="col in msgList" :key="col.msgId">
          <span class="msg-container__item__wrap">
            <img class="msg-container__item__portrait" :src="col.img" alt="">
            <span class="msg-container__item__nickname">{{col.nickname}}</span>
            <span class="msg-container__item__text">{{col.msg}}</span>
          </span>
         </p>
       </transition-group>
      </div>
  </div>
    <div class="msg-send-container" :class="{'msg-send-container-showinput': showInput}">
       <div id="inputwrap" class="msg-send-container__wrap" :class="{'msg-send-container__show': showInput, 'msg-send-container__hide': !showInput}">
        <input
          class="msg-send-container__wrap__input"
          id="sendmessage"
          type="text"
          @focus="focusEvent"
          @blur="blurEvent"
          v-model.trim="myMessage">
        <p class="msg-send-container__wrap__btn" @click="sendMessage">Send</p>
      </div>
      <label class="msg-send-container__icon" for="sendmessage" :class="{'msg-send-container__hide': showInput, 'msg-send-container__show': !showInput}">
        <span class="iconfont icon-pinglun"></span>
      </label>
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
      msgList: 'msgList',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.$store.dispatch(type.CHAT_LIST_FETCH_ACTION)
    this.$nextTick(() => {
      const bodys = document.getElementsByTagName('body')[0]
      const bodyHeight = bodys.clientHeight
      bodys.style.height = bodyHeight + 'px'
      this.setMsgOuterHeight()
    })
  },
  methods: {
    sendMessage () {
      if (this.myMessage) {
        this.showInput = false
        this.$store.dispatch(type.CHAT_SEND_MSG_ACTION, {
          msgObj: {
            img: this.userInfo.avatar,
            msg: this.myMessage,
            nickname: this.userInfo.userName
          }
        })
        this.myMessage = ''
      }
    },
    focusEvent (e) {
      this.showInput = true
      this.reSetMsgBot()
    },
    blurEvent () {
      this.showInput = false
      this.reSetMsgBot()
    },
    reSetMsgBot () {
      const msgcontainer = document.getElementById('msgcontainer')
      const bodys = document.getElementsByTagName('body')[0]
      const innerHeight = window.innerHeight
      const bodyHeight = bodys.clientHeight
      const msgBot = bodyHeight - innerHeight
      msgcontainer && (msgcontainer.style.bottom = `${msgBot / 100}rem`)
    },
    setMsgOuterHeight () {
      setTimeout(() => {
        const chatmsgwrap = document.getElementById('msgContainer')
        const scrollContainer = document.getElementById('chatmsgwrap')
        const _H = chatmsgwrap.offsetHeight
        scrollContainer.style.height = _H + 'px'
      }, 0)
    }
  },
  watch: {
    msgList: function () {
      this.$nextTick(() => {
        const scrollContainer = document.getElementById('scrollContainer')
        scrollContainer.scrollTop = 100000
        this.myMessage = ''
        console.log(scrollContainer)
        // -----------
        // const msgcontainer = document.getElementById('msgContainer')
        // const containerHeight = msgcontainer.offsetHeight
        // scrollContainer.style.height = containerHeight + 'px'
      })
    }
  },
  updated () {
    let msgContainerInner = document.getElementById('msgContainerInner')
    let scrollContainer = this.$refs.scrollContainer.offsetHeight.offsetHeight
    let scrollTop = scrollContainer - msgContainerInner.offsetHeight
    if (scrollTop < 0) {
      msgContainerInner.scrollTop = scrollTop
    }
  }

}
</script>
<style scoped lang="less" type="text/less">
.chat-container {
  width: 100%;
  height: 100%;
  flex:1;
  position: relative;
  overflow: hidden;
  overflow: auto;
  margin-bottom: 35px;
  box-sizing: border-box;
}
.chat-msg-wrap {
  -webkit-mask: url('../assets/images/mask.png') no-repeat top left;
  -webkit-mask-size: 100% 110%;
  mask: url('../assets/images/mask.png') no-repeat top left;
  mask-size: 100% 110%;
  width: 100%;
  height: 100%;
  // overflow: hidden;
  // position: relative;
  // border: 5px solid palevioletred;
  box-sizing: border-box;
}
// .chat-mask {
//   -webkit-mask: url('../assets/images/mask.png') no-repeat top left;
//   -webkit-mask-size: 100% 110%;
//   mask: url('../assets/images/mask.png') no-repeat top left;
//   mask-size: 100% 110%;
// }
.chat-msg-wrap-haswrap {
  margin-bottom: 0;
}
.msg-send-container {
  width: 60px;
  position: fixed;
  bottom: 35px;
  right: 30px;
  display: flex;
  justify-content: flex-end;
  &__icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .2);
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    span {
          font-size: 34px;
          transform: translate(0, 3px);
    }
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
      border: 0;
      outline: none;
      box-shadow: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      font-size: 20px;
      color: #241262;
      font-family: 'Roboto-Regular';
      padding: 0 23px;
    }
    &__input:focus {
      box-shadow: none;
      -webkit-tap-highlight-color:rgba(0,0,0,0);
      -webkit-user-modify:read-write-plaintext-only;
      outline:0;
    }
    &__btn {
      width: 100%;
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
  // width: 100%;
  // height: auto;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  // border: 5px solid greenyellow;
  &__inner {
    width: 100%;
    height: auto;
    // border: 5px solid red;
  }
  &__item {
    max-width: 100%;
    margin: 6px 26px;
    box-sizing: border-box;
    overflow: hidden;
    img {
      display: inline-block;
    }
    span {
      font-size: 26px;
      text-shadow: #666 1px 1px 1px;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__nickname {
      font-family: "Roboto-Medium";
    }
    &__text {
      font-family: 'Roboto-Light';
    }
    &__wrap {
      background: rgba(255, 255, 255, .2);
      border-radius: 30px;
      padding: 0px 20px;
      box-sizing: border-box;
      display: inline-block;
      font-size: 0;
      position: relative;
      line-height: 60px;
      overflow: hidden;
      color: #fff;
    }
    &__portrait {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
    &__nickname {
      color: #ffb227;
      padding: 0 14px;
      margin-left: 51px;
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
.fade-enter-active, .fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translate3d(100px, 30px, 0) scale3d(0, 0, 0);
}
</style>
