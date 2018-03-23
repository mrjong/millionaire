<template>
  <div class="set-question">
    <div class="set-question__wrap" v-if="isPop">
      <div class="back"  @click="$router.replace('/')">
        <p class="back__icon icon-fanhui iconfont"></p>
      </div>
      <p class="set-question__wrap__title">Set Questions Myself</p>
      <div class="form">
        <input type="text" class="form__name base" placeholder="YOUR NAME  (optional)" v-model="questionInfo.author">
        <div class="form__question">
          <p class="form__question__hint" v-show="isShowHint">
            <span class="form__question__hint__icon icon-yonghuchuti_qianzise iconfont"></span>
            Tap to set your question now
          </p>
          <textarea class="" maxlength="100" v-on:focus="focusText" v-on:blur=" blurText" v-model="questionInfo.title"></textarea>
        </div>
        <input type="text" id="answerA"  class="base answer-text" placeholder="Option A" maxlength="25" v-model="questionInfo.option1">
        <input type="text" id="answerB"  class="base answer-text" placeholder="Option B" maxlength="25" v-model="questionInfo.option2">
        <input type="text" id="answerC"  class="base answer-text" placeholder="Option C" maxlength="25" v-model="questionInfo.option3">
        <div class="form__correct">
          <div class="form__correct__title">
            <p class="form__correct__title__icon iconfont icon-duigou"></p>
            <p class="form__correct__title__text">Correct answer</p>
          </div>
          <div class="form__correct__options">
            <p class="option" v-for="(val, index) in options"  :key="index">
              <span>{{val}}</span>
              <label :for="'option' + val"  class=" base-option iconfont green" :class="{'icon-duigou': val==questionInfo.correct}"></label>
              <input type="radio" :id="'option' + val" :value="val" v-model="questionInfo.correct" ref="correctAnswer" name="option">
            </p>
          </div>
        </div>
        <div class="form__submit" @click="submit">Submit</div>
        </div>
    </div>
    <div class="set-question__mark" v-else>
      <div class="bomb">
        <img src="../assets/images/logo.png" class="bomb__logo">
        <div class="bomb__content">
          <p class="bomb__content__title">QUIZ MASTER Required!<br>Set it, Question it, Win it!!</p>
          <p class="bomb__content__clause" v-for="(item, index) in instruction" :key="index">{{item}}</p>
          <p class="bomb__content__note">Note:</p>
          <p class="bomb__content__text" v-for="(value) in note" :key="value">{{value}}</p>
        </div>
        <div class="bomb__btn" @click="isPop = true">
          <p class="bomb__btn__text">OK, I agree</p>
        </div>
      </div>
    </div>
    <balance-mark style="text-align:center;" v-if="showDialog" :data-info="dialogInfo" @okEvent='sure'></balance-mark>
  </div>
</template>

<script>
import * as api from '../assets/js/api'
import BalanceMark from '../components/BalanceMark'
export default {
  name: 'Rule',
  data () {
    return {
      instruction: [
        '1. Set questions with proper grammar and spelling, and submit them to be our QUIZ MASTER. ',
        '2. Once your questions are selected, you\'ll get the chances to answer your own question in \'Go! Millionaire\' Game to win.',
        '3. Once your questions are selected, you\'ll get the chances to answer your own question in \'Go! Millionaire\' Game to win.',
        '4. Your name will be featured below your questions, which means to be seen by millions of APUS Users.',
        '5. We\'ll announce each QUIZ MASTER on @APUSBrowser Facebook page everyday..'
      ],
      note: [
        'English questions only.',
        'Submit as more questions as you can to be "Golden QUIZ ',
        'MASTER" every week, awards await you.'
      ],
      isPop: false,
      isShowHint: true,
      options: ['A', 'B', 'C'],
      questionInfo: {
        'author': '',
        'title': '',
        'option1': '',
        'option2': '',
        'option3': '',
        'correct': ''
      },
      showDialog: false,
      dialogInfo: {
        htmlText: 'Please complete the question',
        shouldSub: false,
        markType: 0,
        okBtnText: 'OK'
      }
    }
  },
  mounted () {
    if (this.$route.query.close) {
      this.isPop = this.$route.query.close
    }
  },
  methods: {
    focusText () {
      this.isShowHint = false
    },
    blurText () {
      if (this.questionInfo.title.length) {
        this.isShowHint = false
        return
      }
      this.isShowHint = true
    },
    submit () {
      console.log(this.questionInfo)
      // this.clicked()
      if (this.questionInfo.title === '' || this.questionInfo.option1 === ' ' || this.questionInfo.option2 === ' ' || this.questionInfo.option3 === ' ' || this.questionInfo.correct === ' ') {
        this.showDialog = true
        return
      }
      api.setQuestions(this.questionInfo).then((data) => {
        console.log(data)
      })
      this.$router.replace('/set-question-result')
    },
    sure () {
      this.showDialog = false
    }
  },
  components: {
    BalanceMark
  }
}
</script>
<style scoped lang="less" type="text/less">
.set-question{
  width: 100%;
  height: 100%;
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
      background-color: rgba(36, 18, 98, 0.2);
      border-radius: 50%;
      position: absolute;
      top: 24px;
      left: 30px;
      display: flex;
      justify-content: center;
      &__icon{
        font-size: 32px;
        align-self: center;
        color:#241262 ;
      }
    }
    &__title{
      height: 54px;
      line-height: 54px;
      font: 36px "Roboto-Medium";
      color: #241262;
      text-align: center;
    }
    .form{
      padding: 24px 0;
      input.answer-text {
      }
      input.answer-text::-webkit-input-placeholder{
        text-align: left;
      }
      &__question {
        width:656px ;
        height: 334px;
        background: url("../assets/images/question-area-bg.png") no-repeat top left;
        background-size: cover;
        border-radius: 26px;
        margin-bottom: 20px;
        color:#241262 ;
        font-size: 36px;
        position: relative;
        &__hint{
          pointer-events:none;
          width: 100%;
          height: 54px;
          line-height: 54px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          color: #241262;
          opacity: 0.6;
          text-align: center;
          font-size: 32px;
          &__icon{
            display: inline-block;
            height: 54px;
            line-height: 54px;
            color: #241262;
            font-size: 32px;
          }
        }
        textarea {
          width:100% ;
          height: 100%;
          border: 0;
          padding:10px 0 10px 30px;
          background-color: transparent;
        }
        textarea:focus {
          outline: 0;
        }
      }
      &__correct{
        width: 656px;
        height: 192px;
        background-color: #f4f3f7;
        border-radius: 26px;
        &__title {
          display: flex;
          padding:24px 0 0;
          justify-content: center;
          &__icon{
            width: 34px;
            height: 32px;
            text-align: center;
            font-size: 15px;
            color: #241262;
            line-height: 34px;
            box-shadow: 0 0 0 1px #241262;
            border-radius: 5px;
            align-self: center;
            margin-right: 20px;
          }
          &__text{
            color: #241262;
            line-height: 54px;
            font: 36px "Roboto-Regular";
          }
        }
        &__options{
          display: flex;
          justify-content: center;
          width: 80%;
          margin: 36px auto 0;
          .option{
            flex: 1;
            display: flex;
            justify-content: center;
            span{
              font-size: 36px;
              color: #241262;
              margin-right: 24px;
            }
            input{
              display: none;
            }
            .base-option {
              width: 34px;
              height: 32px;
              text-align: center;
              font-size: 15px;
              color: #241262;
              line-height: 34px;
              box-shadow: 0 0 0 1px #241262;
              border-radius: 5px;
              align-self: center;
            }
          }
        }
      }
      &__submit{
        width: 656px;
        height: 93px;
        line-height: 93px;
        background-color: rgba(250, 167, 23, 0.95);
        text-align: center;
        border-radius: 46px;
        font-size: 36px;
        margin-top: 24px;
      }
    }
  }
  &__mark{
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.8;
    display: flex;
    justify-content: center;
    .bomb{
      width: 620px;
      min-height: 1000px ;
      background: url("../assets/images/bomb-bg.jpg") no-repeat top center;
      background-size: cover;
      align-self: center;
      border-radius: 26px;
      position: relative;
      padding: 0 35px 70px 50px;
      &__logo{
        width: 323px;
        position: absolute;
        top: -70px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &__content{
        margin-top: 85px;
        &__title{
          margin: 0 auto 40px;
          text-align: center;
          font: 38px "Roboto Regular";
          font-weight: bold;
          line-height: 38px;
        }
        &__clause{
          font: 24px "Roboto-Regular";
          font-style: italic;
          font-weight: lighter;
          margin-bottom: 20px;
        }
        &__note{
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        &__text{
          font: 20px "Roboto-Regular" ;
          font-style: italic;
          opacity: 0.8;
        }
      }
      &__btn{
        display: flex;
        width: 502px;
        height: 76px;
        background-color: #faa717;
        border-radius: 46px;
        box-shadow: 2px 5px 20px 3px rgba(250, 167, 23, 0.71);
        margin-top: 36px;
        justify-content: center;
        &__text{
         align-self: center;
          font: 28px "Roboto-Regular";
        }
      }
    }
  }
  .base {
    width:656px ;
    height: 93px;
    border-radius: 46px;
    background-color:#f4f3f7 ;
    border: 0;
    margin-bottom: 20px;
    padding-left: 30px;
    color:#241262 ;
    font-size: 36px;
  }
  input::-webkit-input-placeholder{
    width: 100%;
    color: #241262;
    opacity: 0.6;
    text-align: center;
    font-size: 32px;
  }
  .green{
    color: #8ad53a !important;
    text-shadow: 0 0 5px 1px #8ad53a !important;
  }
}
</style>
