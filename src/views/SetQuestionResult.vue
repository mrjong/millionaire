<template>
  <div class="set-question">
    <div class="set-question__wrap">
      <div class="back" @click='back'>
        <p class="back__icon icon-fanhui iconfont"></p>
      </div>
      <p class="set-question__wrap__title">Set Questions Myself</p>
      <div class="result-box">
        <img src="../assets/images/questions-res.png" alt="">
        <p class="result-title">Your question has <br>been submitted.</p>
        <p class="result-content">Thank you! Knowledge is power.
We'll reeview all submissions and announce the seleted questions and its QUIZ MASTER on APUS Browser Facebook page every day.</p>
      </div>
      <div class="base">
        <div class="join-btn" @click='joinGroup'>Join Group</div>
        <div class="require-box">
          <div class="require-box__title">You will acquire:</div>
          <div class="require-box__content">
            1. Chance to win extra prize<br/>
2. Get the questions and answers of the coming 'Go! Millionaire' game in advance
          </div>
        </div>
      </div>
      <div class="submit-box">
        <div class="prue-btn" @click='submitOther'>
          Submit another
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetQuestionResult',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    submitOther () {
      this.$router.replace('/set-question')
    },
    joinGroup () {
      location.href = 'https://chat.whatsapp.com/0DyePJd4szvJwTP7qct2ZM'
    },
    back () {
      this.$router.replace('/')
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.set-question{
  width: 100%;
  background: url("../assets/images/set-question-bg.jpg") no-repeat top left;
  background-size: cover;
  color: #fff;
  &__wrap{
    height: 100%;
    position: relative;
    padding: 24px 30px 0;
    .back{
      width: 54px;
      height: 54px;
      background-color: #241262;
      border-radius: 50%;
      position: absolute;
      top: 24px;
      left: 30px;
      display: flex;
      justify-content: center;
      &__icon{
        font-size: 22px;
        align-self: center;
        color:#fff ;
      }
    }
    &__title{
      font: 36px "Roboto-Medium";
      color: #241262;
      text-align: center;
    }
  }
}
.result-box{
  width: 100%;
  text-align: center;
  margin-top: 58px;
  color: #241262;
  img{
    display: inline-block;
    width: 350px;
  }
  p.result-title{

    font-size: 58px;
    font-weight: bold;
    margin-top: 60px;
    margin-bottom: 50px;
  }
  p.result-content{
    padding: 0 20px;
    font-size: 32px;
    line-height: 1.31;
    color: rgba(36, 18, 98, 0.8);
  }
}
.base {
    width:656px ;
    border-radius: 46px;
    background-color:#f4f3f7 ;
    border: 0;
    padding: 50px;
    color:#241262 ;
    font-size: 36px;
    margin-bottom: 100px;
    margin-top: 50px;
  }
  .join-btn{
    background: #dd4b80;
    color: #fff;
    text-align: center;
    padding: 30px 0;
    border-radius: 80px;
    box-shadow: 0px 6px 10px rgba(221, 75, 128, 0.54);
    margin-bottom: 50px;
  }
  .require-box{
    color: #241262;
    text-align:center;
    &__title{
      font-size: 33px;
      margin-bottom: 20px;
    }
    &__content{
      font-size: 27px;
      line-height: 1.41;
    }
  }
  .submit-box{
    text-align: center;
    padding-bottom: 100px;
    .prue-btn{
      display: inline-block;
      padding: 30px 0;
      width: 70%;
      font-size: 35px;
      color: #241262;
      border-radius: 80px;
      border: 5px solid rgba(36, 18, 98, 0.48);
    }
  }
</style>
