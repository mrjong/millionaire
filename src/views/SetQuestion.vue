<template>
  <div class="set-question bg-reset" ref="setQestion" v-webp.bg="`url('set-question-bg.jpg')`">
    <div class="set-question__wrap" v-if="isPop">
      <div class="back"  @click="back">
        <p class="back__icon icon-fanhui iconfont"></p>
      </div>
      <p class="set-question__wrap__title">{{$t('setQuestion.title')}}</p>
      <a class="set-question__wrap__join" @click="join" ref="toFbGroup" v-if="isSetQuestion">
        <span class="set-question__wrap__join__icon iconfont icon-facebook"></span>
        {{$t('setQuestion.share_btn')}}
      </a>
      <div class="form">
        <div class="frame">
          <input type="text" class="form__name base" maxlength="100" :placeholder="$t('setQuestion.name')" v-model="questionInfo.author">
          <check-str-length :originalLength=100 :currentLength=questionInfo.author.length class="check-str-length-name"></check-str-length>
        </div>
        <div class="frame">
          <input type="text" class="form__name base" maxlength="20" :placeholder="$t('setQuestion.tel')" v-model="questionInfo.tel">
          <check-str-length :originalLength=20 :currentLength=questionInfo.tel.length class="check-str-length-name"></check-str-length>
        </div>
        <div class="form__question">
          <p class="form__question__hint" v-show="isShowHint">
            <span class="form__question__hint__icon icon-yonghuchuti_qianzise iconfont"></span>
            {{$t('setQuestion.question')}}
          </p>
          <textarea class="" maxlength="200" v-on:focus="focusText" v-on:blur=" blurText" v-model="questionInfo.title"></textarea>
          <check-str-length :originalLength=200 :currentLength=questionInfo.title.length class="check-str-length-title"></check-str-length>
        </div>
        <div class="frame">
          <input type="text" id="answerA"  class="base answer-text" :placeholder="$t('setQuestion.option_a')" maxlength="150" v-model="questionInfo.option1">
          <check-str-length :originalLength=100 :currentLength=questionInfo.option1.length class="check-str-length-option"></check-str-length>
        </div>
        <div class="frame">
          <input type="text" id="answerB"  class="base answer-text" :placeholder="$t('setQuestion.option_b')" maxlength="150" v-model="questionInfo.option2">
          <check-str-length :originalLength=100 :currentLength=questionInfo.option2.length class="check-str-length-option"></check-str-length>
        </div>
        <div class="frame">
          <input type="text" id="answerC"  class="base answer-text" :placeholder="$t('setQuestion.option_c')" maxlength="150" v-model="questionInfo.option3">
          <check-str-length :originalLength=100 :currentLength=questionInfo.option3.length class="check-str-length-option"></check-str-length>
        </div>
        <div class="form__correct">
          <div class="form__correct__title">
            <p class="form__correct__title__icon iconfont icon-juxing"></p>
            <p class="form__correct__title__text">{{$t('setQuestion.correct_text')}}</p>
          </div>
          <div class="form__correct__options">
            <p class="option" v-for="(val, index) in options"  :key="index">
              <span>{{val}}</span>
              <label :for="'option' + val"  class=" base-option iconfont green" :class="{'icon-duigou': val==questionInfo.correct}"></label>
              <input type="radio" :id="'option' + val" :value="val" v-model="questionInfo.correct" ref="correctAnswer" name="option">
            </p>
          </div>
        </div>
        <div class="form__submit" @click="submit">{{$t('setQuestion.submit_btn')}}</div>
        </div>
    </div>
    <div class="set-question__mark" v-else>
      <div class="bomb bg-reset bg-x-center" v-webp.bg="`url('bomb-bg.jpg')`">
        <img v-webp="'logo.png'" class="bomb__logo">
        <div class="bomb__content">
        <p class="bomb__content__title1">{{$t('setQuestion.question_rule.title1')}}</p>
          <p class="bomb__content__title2">{{$t('setQuestion.question_rule.title2')}}</p>
          <p class="bomb__content__clause" v-for="(item, index) in instruction" :key="index">{{item}}</p>
          <p class="bomb__content__note">{{$t('setQuestion.question_rule.notice_title')}}</p>
          <p class="bomb__content__text" v-for="(value) in note" :key="value">{{value}}</p>
        </div>
        <div class="bomb__btn" @click="isShowBomb">
          <p class="bomb__btn__text">{{$t('setQuestion.question_rule.agree_btn')}}</p>
        </div>
      </div>
    </div>
    <balance-mark :height="clientHeight" v-if="showDialog" :data-info="dialogInfo" @okEvent='sure'></balance-mark>
    <loading v-if="isLoading" :height="clientHeight"></loading>
  </div>
</template>

<script>
import * as api from '../assets/js/api'
import BalanceMark from '../components/BalanceMark'
import checkStrLength from '../components/CheckStrLength'
import loading from '../components/Loading'
import utils from '../assets/js/utils'
export default {
  name: 'Rule',
  data () {
    return {
      instruction: this.$t('setQuestion.question_rule.instruction'),
      note: this.$t('setQuestion.question_rule.notice'),
      isPop: false,
      isShowHint: true,
      options: ['A', 'B', 'C'],
      questionInfo: {
        'author': '',
        'title': '',
        'option1': '',
        'option2': '',
        'option3': '',
        'correct': '',
        'tel': ''
      },
      showDialog: false,
      dialogInfo: {
        htmlTitle: this.$t('setQuestion.question_pop.submit_faild_title'),
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: this.$t('setQuestion.question_pop.ok'),
        hintImg: '//static.apusapps.com/201803261933287074f92538.png'
      },
      isSetQuestion: false,
      isLoading: false,
      clientHeight: 0
    }
  },
  mounted () {
    this.isPop = utils.storage.get('millionaire-isPop')
    if (this.$route.query.close) {
      this.isPop = this.$route.query.close
      utils.statistic('issue_page', 0, {'flag_s': !this.isPop}, 'issue_success_page')
    } else {
      utils.statistic('issue_page', 0, {'flag_s': !this.isPop}, 'wait_page')
    }
    this.submitFlag()
  },
  methods: {
    getClientHeight () {
      this.$nextTick(() => {
        this.clientHeight = this.$refs.setQestion.offsetHeight
      })
    },
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
    submitFlag () {
      api.isSetQuestion().then(({data}) => {
        if (data.data) {
          this.isSetQuestion = true
        }
        this.getClientHeight()
      })
    },
    submit () {
      /* eslint-disable no-useless-escape */
      this.isLoading = true
      const phoneRule = /^[\+\-0-9]{1,20}$/
      if (this.questionInfo.author === '') {
        this.baseConfig('no_phone', this.$t('setQuestion.question_pop.no_name'))
        return false
      } else if (this.questionInfo.tel === '') {
        this.baseConfig('no_phone', this.$t('setQuestion.question_pop.no_tel'))
        return false
      } else if (!phoneRule.test(this.questionInfo.tel)) {
        this.baseConfig('no_phone', this.$t('setQuestion.question_pop.wrong_tel'))
        return false
      } else if (this.questionInfo.title === '') {
        this.baseConfig('no_question', this.$t('setQuestion.question_pop.no_question'))
        return false
      } else if (this.questionInfo.option1 === '' || this.questionInfo.option2 === '' || this.questionInfo.option3 === '' || this.questionInfo.correct === '') {
        this.baseConfig('no_answer', this.$t('setQuestion.question_pop.no_answer'))
        return false
      }
      api.setQuestions(this.questionInfo).then(({data}) => {
        this.isLoading = false
        if (data.result === 1) {
          this.setQuestionBtnStatics('submit', 'success')
          this.$router.replace('/set-question-result')
        } else {
          this.baseConfig('', this.$t('setQuestion.question_pop.submit_faild'))
          return false
        }
      }).catch(() => {
        this.baseConfig('other_anomaly')
        return false
      })
    },
    sure () {
      this.showDialog = false
    },
    isShowBomb () {
      this.isPop = true
      utils.storage.set('millionaire-isPop', true)
    },
    join () {
      this.setQuestionBtnStatics('join_group')
      utils.toFbBrowser()
    },
    back () {
      this.setQuestionBtnStatics('back')
      this.$router.replace('/')
    },
    setQuestionBtnStatics (destination, result) {
      let staticsObj = {}
      if (result) {
        staticsObj = {'flag_s': !this.isPop, 'to_destination_s': destination, 'result_code_s': `${result}`}
      } else {
        staticsObj = {'flag_s': !this.isPop, 'to_destination_s': destination}
      }
      utils.statistic('submit', 1, staticsObj, 'issue_page')
    },
    baseConfig (staticsType, hintType) {
      this.isLoading = false
      staticsType && this.setQuestionBtnStatics('submit', staticsType)
      if (hintType) {
        this.dialogInfo.htmlText = hintType
      }
      this.showDialog = true
    }
  },
  components: {
    BalanceMark,
    checkStrLength,
    loading
  }
}
</script>
<style scoped lang="less" type="text/less">
.set-question{
  width: 100%;
  min-height: 100%;
  color: #fff;
  background-color: #fff;
  &__wrap{
    height: 100%;
    position: relative;
    padding: 24px 30px 0;
    .back{
      width: 54px;
      height: 54px;
      background-color: rgb(36, 18, 98);
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
        color: #fff;
        margin-left: -2px;
      }
    }
    &__title{
      height: 54px;
      line-height: 56px;
      padding-top: 5px;
      font: 36px "Roboto-Medium";
      color: #241262;
      text-align: center;
    }
    &__join{
      display: block;
      max-width: 100%;
      width: 654px;
      height: 91px;
      line-height: 91px;
      text-align: center;
      margin: 0 auto;
      background-color: #dc427a;
      border-radius: 46px;
      box-shadow: 2px 2px 5px 2px rgba(220, 66, 122, 0.3);
      font-size: 36px;
      margin-top: 35px;
      position: relative;
      color: #fff;
      &__icon{
        font-size: 34px;
        position: absolute;
        top: 50%;
        left: 80px;
        transform: translate(0, -50%);
      }
    }
    .form{
      padding: 24px 0;
      .frame{
        input.answer-text {
          padding-right: 70px;
        }
        .form__name{
          padding-right: 70px;
        }
        .check-str-length-name{
          position: absolute;
          top: .3rem;
          right: .4rem;
        }
        input.answer-text::-webkit-input-placeholder{
          text-align: left;
        }
      }
      &__question {
        max-width: 100%;
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
          font-size: 36px;
          &__icon{
            display: inline-block;
            height: 54px;
            line-height: 54px;
            color: #241262;
            font-size: 36px;
          }
        }
        textarea {
          width:100% ;
          height: 100%;
          border: 0;
          padding:15px 40px 40px 30px;
          background-color: transparent;
        }
        textarea:focus {
          outline: 0;
        }
        .check-str-length-title{
          position: absolute;
          right: 20px;
          bottom: 30px;
        }
      }
      .frame{
        position: relative;
        .check-str-length-option{
          position: absolute;
          top: 30px;
          right: 40px;
        }
      }
      &__correct{
        max-width: 100% !important;
        width: 656px;
        height: 192px;
        background-color: #f4f3f7;
        border-radius: 26px;
        &__title {
          display: flex;
          padding:24px 0 0;
          justify-content: center;
          &__icon{
            text-align: center;
            font:100 32px "Roboto";
            color: #241262;
            line-height: 34px;
            border-radius: 5px;
            align-self: center;
            margin-right: 20px;
          }
          &__text{
            color: #241262;
            line-height: 54px;
            font: 36px "Roboto";
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
              width: 40px;
              height: 38px;
              text-align: center;
              font-size: 15px;
              color: #241262;
              line-height: 38px;
              box-shadow: 0 0 0 2px #241262;
              border-radius: 5px;
              align-self: center;
            }
          }
        }
      }
      &__submit{
        max-width: 100%;
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
    position: absolute;
    .bomb{
      max-width: 90%;
      width: 620px;
      min-height: 1000px ;
      align-self: center;
      border-radius: 26px;
      position: relative;
      padding: 0 35px 80px 50px;
      &__logo{
        max-width: 52%;
        width: 323px;
        position: absolute;
        top: -70px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &__content{
        margin-top: 85px;
        &__title1{
          margin: 0 auto 10px;
          text-align: center;
          font: 38px "Roboto Regular";
          line-height: 38px;
        }
        &__title2{
          margin: 0 auto 35px;
          text-align: center;
          font: 32px "Roboto Regular";
          line-height: 38px;
        }
        &__clause{
          line-height: 80px;
          font: 100 .24rem Roboto;
          font-style: italic;
          font-weight: lighter;
          margin-bottom: 10px;
        }
        &__note{
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0 10px;
        }
        &__text{
          font: 100 20px "Roboto" ;
          font-style: italic;
          opacity: 0.8;
        }
      }
      &__btn{
        display: flex;
        max-width: 90%;
        width: 502px;
        height: 76px;
        background-color: #faa717;
        border-radius: 46px;
        box-shadow: 2px 3px 10px 2px rgba(250, 167, 23, 0.4);
        margin: 36px auto 0;
        justify-content: center;
        &__text{
         align-self: center;
          font: 28px "Roboto-Regular";
        }
      }
    }
  }
  .base {
    max-width: 100% !important;
    width:656px ;
    height: 93px;
    border-radius: 46px;
    background-color:#f4f3f7 ;
    border: 0;
    margin-bottom: 18px;
    padding-left: 30px;
    color:#241262 ;
    font-size: 28px;
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
