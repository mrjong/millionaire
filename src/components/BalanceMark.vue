<template>
  <div class="balance-mark" :style="{height: actualHeight}">
    <div class="balance-mark__wrap">
      <p class="hint-icon" v-if="dataInfo.hintImg">
        <img :src="dataInfo.hintImg" class="hint-icon__img">
      </p>
      <p class="balance-mark__wrap__title" v-if="dataInfo.htmlTitle">{{dataInfo.htmlTitle}}</p>
      <p class="balance-mark__wrap__description" v-if="dataInfo.htmlText" id="balanceMarkText" v-html="dataInfo.htmlText"></p>
      <input type="text"
             placeholder="Referral Code"
             class="balance-mark__wrap__invitation"
             v-if="isInvitation" v-model="invitationCode">
      <p class="balance-mark__wrap__btn">
        <span class="balance-mark__wrap__btn__ok" @click="okEvent">{{dataInfo.okBtnText}}</span>
        <span class="balance-mark__wrap__btn__cancel" v-if="dataInfo.markType" @click="cancelEvent">Cancel</span>
      </p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BalanceMark',
  props: {
    dataInfo: {
      type: Object,
      default: () => {}
    },
    height: {
      type: Number
    },
    isInvitation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      invitationCode: ''
    }
  },
  computed: {
    actualHeight: function () {
      if (this.height) {
        return this.height + 'px'
      } else {
        return '100%'
      }
    }
  },
  mounted () {},
  methods: {
    okEvent () {
      if (this.invitationCode !== '') {
        this.$emit('okEvent', this.dataInfo.shouldSub, this.invitationCode)
      } else {
        this.$emit('okEvent', this.dataInfo.shouldSub)
      }
    },
    cancelEvent () {
      this.$emit('cancelEvent', this.dataInfo.shouldSub)
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .balance-mark {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 22;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    &__wrap {
      width: 602px;
      background: #fff;
      border-radius: 16px;
      padding: 40px 45px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .hint-icon{
        width: 88px;
        min-height: 88px;
        margin:15px auto 26px;
        &__img{
          width: 100%;
        }
      }
      &__title {
        width: 100%;
        font: 32px/30px 'Roboto', Arial, serif;
        color: #000;
        min-height: 40px;
        margin: 10px auto;
      }
      &__description {
        width: 100%;
        font: 300 28px/30px 'Roboto', Arial, serif;
        color: #000;
        min-height: 40px;
      }
      &__invitation{
        width: 100%;
        height: 77px;
        line-height: 77px;
        border-radius: 46px;
        background-color:#f4f3f7 ;
        border: 0;
        padding-left: 30px;
        color:#241262 ;
        font-size: 28px;
        margin-top: 30px;
      }
      input::-webkit-input-placeholder{
        width: 100%;
        color: #241262;
        opacity: 0.6;
        text-align: center;
        font-size: 24px;
      }
      &__btn {
        width: 100%;
        height: 77px;
        display: flex;
        justify-content: space-around;
        margin-top: 25px;
        span {
          display: inline-block;
          width: 240px;
          height: 100%;
          border-radius: 38px;
          color: #fff;
          font: 300 24px 'Roboto', Arial, serif;
          text-align: center;
          line-height: 77px;
        }
        &__ok {
          background: rgba(250, 167, 23, 0.95);
        }
        &__cancel {
          background: #d7d7d7;
        }
      }
    }
  }
</style>
