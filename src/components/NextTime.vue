<template>
  <div class="hint">
    <p class="hint__text">The next start time</p>
    <div class="hint__info">
      <p class="hint__info__time">
        {{nextTime}}
      </p>
      <i class="hint__info__line"></i>
      <p class="hint__info__money">
        ${{money}}
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
      line-height: 43px;
      font-size: 28px;
      background-color: #ffffff;
      opacity: 0.2;
      text-align: center;
      border-radius: 46px;
      margin: 0 auto;
    }
    &__info{
      display: flex;
      justify-content: center;
      font-size: 28px;
      margin-top:15px;
      &__line{
        margin: 0 16.6px;
        width: 2px;
        border: 2px solid #ffffff;
      }
      &__time, &__money{
        letter-spacing: 1px;
      }
    }
  }
</style>
