<template>
  <div class="hint">
    <div class="hint__time">
      <p class="hint__time__text">
        Next Game
        <span class="hint__time__text__day"> {{nextTime[0]}}</span>
      </p>
      <p class="hint__time__hour">
        {{nextTime[1]}}
      </p>
    </div>
    <div class="hint__line"></div>
    <div class="hint__money">
      <p class="hint__money__text">Next Bonus</p>
      <p class="hint__money__number">
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
      type: Array
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
    display: flex;
    justify-content: center;
    &__time, &__money{
      width: 50%;
      display: block;
      text-align: center;
      &__text{
        font-family: 'Roboto-Light';
        font-size: 28px;
        &__day{
          color: #ffb227;
        }
      }
      &__hour,&__number{
        margin-top: 25px;
        color: #ffb227;
        font-size: 56px;
        font-family: 'Roboto-BoldCondensed';
      }
      &__hour{
        color: #fff;
      }
    }
    &__line{
      opacity: 0.3;
      width: 2px;
      height: 76px;
      background-color: #fff;
      align-self: center;
    }
  }
  @media screen and (max-width: 321px){
  }
</style>
