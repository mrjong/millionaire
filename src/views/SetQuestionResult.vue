<template>
  <div class="set-question bg-reset" v-webp.bg="`url('set-question-bg.jpg')`">
    <div class="set-question__wrap">
      <div class="back" @click='back'>
        <p class="back__icon icon-fanhui iconfont"></p>
      </div>
      <p class="set-question__wrap__title">{{$t('setQuestionResult.title')}}</p>
      <div class="result-box">
        <img v-webp="'questions-res.png'" alt="">
        <p class="result-title">{{$t('setQuestionResult.text1')}}</p>
        <p class="result-content">{{$t('setQuestionResult.text2')}}</p>
      </div>
      <div class="base">
        <a class="join-btn" @click='joinGroup' ref="toFbGroup">
          <span class="join-btn__icon iconfont icon-facebook"></span>
          {{$t('setQuestionResult.share_btn')}}
        </a>
        <div class="require-box">
          <div class="require-box__title">
            <span class="require-box__title__icon iconfont icon-liwu"></span>
            {{$t('setQuestionResult.text3')}}
          </div>
          <div class="require-box__content">
            {{$t('setQuestionResult.text4')}}<br/>
            {{$t('setQuestionResult.text5')}}<br>
            {{$t('setQuestionResult.text6')}}
          </div>
        </div>
      </div>
      <div class="submit-box">
        <div class="prue-btn" @click='submitOther'>
          {{$t('setQuestionResult.submit_btn')}}
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
      utils.toFbBrowser()
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
      z-index: 111;
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
    font:600 48px 'Roboto';
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 30px;
  }
  p.result-content{
    padding: 0 20px;
    font:300 28px 'Roboto';
    line-height: 1.31;
    color: rgba(36, 18, 98, 0.8);
  }
}
.base{
    max-width: 100%;
    width:656px ;
    border-radius: 46px;
    background-color:#f4f3f7 ;
    border: 0;
    padding: 30px;
    color:#241262 ;
    font-size: 36px;
    margin-bottom: 65px;
    margin-top: 40px;
  }
  .join-btn{
    display: block;
    background: #dd4b80;
    color: #fff;
    text-align: center;
    font: 32px 'Roboto Regular';
    height: 92px;
    line-height: 92px;
    border-radius: 80px;
    box-shadow: 0px 6px 10px rgba(221, 75, 128, 0.54);
    margin-bottom: 30px;
    position: relative;
    &__icon{
      position: absolute;
      top: 50%;
      left: 80px;
      transform: translate(0, -50%);
      font-size: 34px;
    }
  }
  .require-box{
    color: #241262;
    text-align:center;
    &__title{
      font-size: 32px;
      margin-bottom: 20px;
      &__icon{
        font-size: 30px;
        color:#241262;;
      }
    }
    &__content{
      font-size: 27px;
      line-height: 1.41;
    }
  }
  .submit-box{
    text-align: center;
    padding-bottom: 65px;
    .prue-btn{
      display: inline-block;
      height: 92px;
      font: 28px Roboto Regular;
      line-height: 85px;
      width: 342px;
      color: #241262;
      border-radius: 46px;
      border: 4px solid rgba(36, 18, 98, 0.4);
    }
  }
</style>
