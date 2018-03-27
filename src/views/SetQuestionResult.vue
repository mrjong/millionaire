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
import utils from '../assets/js/utils'
export default {
  name: 'SetQuestionResult',
  data () {
    return {
    }
  },
  mounted () {
    utils.statistic('issue_page', 0, {}, 'issue_success_page')
  },
  methods: {
    submitOther () {
      utils.statistic('issue_success_page', 1, {'to_destination_s': 'issue_page'}, 'issue_page')
      this.$router.push({path: '/set-question', query: {'close': true}})
    },
    joinGroup () {
      utils.statistic('issue_success_page', 1, {'to_destination_s': 'join_group'}, 'issue_page')
      location.href = 'https://chat.whatsapp.com/0DyePJd4szvJwTP7qct2ZM'
    },
    back () {
      utils.statistic('issue_success_page', 1, {'to_destination_s': 'back'}, 'issue_page')
      this.$router.replace('/')
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.set-question{
  width: 100%;
  min-height: 100%;
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
      position: fixed;
      top: 24px;
      left: 30px;
      display: flex;
      justify-content: center;
      &__icon{
        font-size: 28px;
        align-self: center;
        color:#fff ;
        margin-left: -2px;
      }
    }
    &__title{
      padding-top: 5px;
      font: 36px "Roboto-Medium";
      color: #241262;
      text-align: center;
    }
  }
}
.result-box{
  width: 100%;
  text-align: center;
  margin-top: 42px;
  color: #241262;
  img{
    display: inline-block;
    width: 250px;
  }
  p.result-title{
    font-size: 48px;
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 30px;
  }
  p.result-content{
    padding: 0 20px;
    font-size: 28px;
    line-height: 1.31;
    color: rgba(36, 18, 98, 0.8);
  }
}
.base {
    width:656px ;
    border-radius: 46px;
    background-color:#f4f3f7 ;
    border: 0;
    padding: 30px;
    color:#241262 ;
    font-size: 36px;
    margin-bottom: 78px;
    margin-top: 40px;
  }
  .join-btn{
    background: #dd4b80;
    color: #fff;
    text-align: center;
    padding: 30px 0;
    border-radius: 80px;
    box-shadow: 0px 6px 10px rgba(221, 75, 128, 0.54);
    margin-bottom: 30px;
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
    padding-bottom: 76px;
    .prue-btn{
      display: inline-block;
      height: 92px;
      line-height: 90px;
      width: 342px;
      font-size: 28px;
      color: #241262;
      border-radius: 46px;
      border: 4px solid rgba(36, 18, 98, 0.4);
    }
  }
</style>
