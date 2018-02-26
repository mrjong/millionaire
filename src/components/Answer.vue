<template>
  <div class="answer-container">
    <div class="answer-container__state finish-right"></div>
    <div class="answer-container__base">
      <span class="answer-container__base__text">bububu</span>
      <div class="answer-container__base__right">
        <span class="answer-container__base__right__num">7890</span>
        <span class="answer-container__base__right__icon"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Respondence',
  data () {
    return {
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .answer-container{
    width: 624px;
    height: 93px;
    margin: 25px auto;
    background-color: #e9e8f1;
    border-radius: 46px;
    padding:0 23px;
    position: relative;
    &__state{
      width: 30%;
      height:100%;
      border-radius: 46px;
      position: absolute;
      top:0;
      left:0;
    }
    .hover{
      background-color: #ffc103;
    }
    .finish-right{
      background-color: #14d2cb;
    }
    .finish-wrong{
      background-color: #fb4c4c;
    }
    &__base{
      display:flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      font-size: 28px;
      color: #241262;
      position: relative;
      &__text{
        align-self: center;
      }
      &__right{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        &__num{
          font-style:italic;
        }
        &__icon{
          display: inline-block;
          width: 26px;
          height: 26px;
          background-color: aquamarine;
          vertical-align: bottom;
          margin-left: 16px;
        }
      }
    }
  }
</style>
