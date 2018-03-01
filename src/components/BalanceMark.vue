<template>
  <div class="balance-mark">
    <div class="balance-mark__wrap">
      <p class="balance-mark__wrap__title" id="balanceMarkText"></p>
      <p class="balance-mark__wrap__btn">
        <span class="balance-mark__wrap__btn__ok" @click="okEvent">OK</span>
         <span class="balance-mark__wrap__btn__cancel" v-if="dataInfo.markType" @click="cancelEvent">Cancel</span>
      </p>
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
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    const markText = document.getElementById('balanceMarkText')
    markText.innerHTML = this.dataInfo.htmlText
  },
  methods: {
    okEvent () {
      this.$emit('okEvent', this.dataInfo.shouldSub)
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
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  &__wrap {
    width: 602px;
    height: 402px;
    background: #fff;
    border-radius: 16px;
    padding: 99px 45px 0 45px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__title {
      width: 100%;
      height: 160px;
      font-size: 28px;
      line-height: 30px;
      font-family: 'Roboto-Light';
      color: #000;
    }
    &__btn {
      width: 100%;
      height: 77px;
      display: flex;
      justify-content: space-around;
      span {
        display: inline-block;
        width: 182px;
        height: 100%;
        border-radius: 38px;
        background: rgba(250, 167, 23, 0.95);
        color: #fff;
        font-size: 24px;
        font-family: 'Roboto-Light';
        text-align: center;
        line-height: 77px;
      }
    }
  }
}
</style>
