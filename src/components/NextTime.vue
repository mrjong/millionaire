<template>
  <div class="hint">
    <p class="hint__text">The next start time</p>
    <div class="hint__info">
      <span class="hint__info__time">
        {{nextTime}}
      </span>
      <i class="hint__info__line"></i>
      <span class="hint__info__money">
        {{currencyType}}{{money}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NextTime',
  props: {
    nextTime: {
      type: String
    },
    money: {
      type: Number
    },
    currencyType: {
      type: String
    }
  },
  data () {
    return {}
  }
}
</script>
<style scoped lang="less" type="text/less">
  .hint{
    color: #ffffff;
    font-size: 28px;
    opacity: 0.95;
    margin-top: 46.6px;
    &__text{
      width:310px;
      height: 43px;
      background-color: rgba(255, 255, 255, 0.2);
      text-align: center;
      border-radius: 46px;
      margin: 0 auto;
      font:28px Roboto-Light;
      line-height: 43px;
    }
    &__info{
      text-align: center;
      margin-top:15px;
      &__line{
        display: inline-block;
        margin: 0 16.6px 0 16px;
        width: 2px;
        height: 28px;
        border: 2px solid #ffffff;
      }
      &__time, &__money{
        letter-spacing: 1px;
        font: 28px Roboto-Light;
      }
    }
  }
</style>
