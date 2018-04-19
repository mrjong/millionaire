<template>
  <div class="invitation-mark"  v-if="reviveObj.isShare">
    <div class="invitation-bomb">
      <span class="invitation-bomb__close iconfont icon-cuowu" @click="reviveObj.isShare =false"></span>
      <p class="invitation-bomb__info">
        {{reviveObj.title}}
        <span v-if="reviveObj.shareType">{{reviveObj.code}}</span>
      </p>
      <p class="invitation-bomb__hint">{{reviveObj.hint}}</p>
      <div class="invitation-bomb__channel">
        <div class="facebook" @click="fbAndMess('com.facebook.katana')"></div>
        <div class="message" @click="fbAndMess('com.facebook.orca')"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviveCard',
  props: {
    reviveObj: {
      type: Object
    }
  },
  data () {
    return {
      isClose: false
    }
  },
  computed: {},
  mounted () {},
  methods: {
    fbAndMess (val) {
      console.log('包名=' + val)
      this.$emit('fbAndMess', val)
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .invitation-mark {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 111;
      padding: 0 25px;
      background-color: rgba(68, 68, 68, 0.8);
      .invitation-bomb {
        max-width: 93% !important;
        width: 670px;
        height: 350px;
        background-color: #fff;
        border-radius: 26px;
        position: absolute;
        bottom: 25px;
        padding: 50px 0 40px;
        color: #241262;
        text-align: center;
        font-family: "Roboto";
        &__close{
          position:absolute;
          top: 24px;
          right: 24px;
          color: #241262;
          font-size: 20px;
        }
        &__info{
          font-size: 32px;
          margin-bottom: 20px;
          .share-detail-entry{
            font-size: 32px;
            color: #241262;
          }
        }
        &__hint{
          font-weight: 300;
          margin-bottom: 54px;
          font-size: 28px;
          padding: 0 30px;
        }
        &__channel{
          display: flex;
          margin: 0 148px 10px;
          justify-content: space-between;
          .facebook, .message{
            width: 96px;
            height: 96px;
            background: url("../assets/images/facebook.png") no-repeat center;
            background-size: cover;
          }
          .message{
            background: url("../assets/images/messenger.png") no-repeat center;
            background-size: cover;
          }
        }
      }
    }
</style>
