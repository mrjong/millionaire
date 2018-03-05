<template>
  <div class="hint">
    <p class="hint__text">The next start time</p>
    <div class="hint__info">
      <p class="hint__info__time">
        {{nextTime}}
      </p>
      <p class="hint__info__money">
        {{currencyType}}{{money}}
      </p>
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
      margin-top:15px;
      display: flex;
      justify-content: center;
      &__time, &__money{
        letter-spacing: 1px;
        font: 28px Roboto-Light;
        width: 49%;
      }
      &__time{
        padding-right:16px;
        text-align: right;
        border-right: 2px solid #fff;
      }
      &__money{
        margin-left: 16px;
        text-align: left;
      }
    }
  }
</style>
