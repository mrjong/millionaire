<template>
  <div class="answer-container" @click="answer">
    <div class="answer-container__state"
         :class="{'finish-right': questionStatus === 7 && isRight, 'finish-wrong': questionStatus === 7 && !isRight, 'hover': questionStatus === 5 && isClick && myChick}"
         :style="{width: questionStatus === 7 ? percent + '%' : (questionStatus === 5 ? '100%' : '0')}">
    </div>
    <div class="answer-container__base" ref="baseContainer" :class="{'font-white': isAllWhite && questionStatus === 7}">
      <p class="answer-container__base__text answerText" ref="answerText"
         :class="{'font-white':(isAnswerWhite && questionStatus === 7) || (questionStatus === 5 && isClick && myChick)}">
        {{content}}
      </p>
      <div class="answer-container__base__right" v-if="questionStatus === 7" ref="resultNum">
        <p class="answer-container__base__right__num" ref="answerNum"
           :class="{'font-white': isResultWhite || isAllWhite}">{{result >= 0 ? result : ''}}</p>
        <span class="answer-container__base__right__icon iconfont icon-duihao resultIcon"
           ref="resultIcon"
           :class="{'icon-cuowu': !isRight, 'font-white': isAllWhite}"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Answer',
  props: {
    content: {
      type: String
    },
    isClick: {
      type: Boolean
    },
    result: {
      type: Number
    },
    percent: {
      type: Number
    },
    isRight: {
      type: Boolean
    },
    myChick: {
      type: Boolean
    },
    orderNumber: {
      type: String
    }
  },
  data () {
    return {
      isAnswerWhite: false,
      isAllWhite: false,
      isResultWhite: false,
      percent1: ''
    }
  },
  computed: {
    ...mapGetters({
      questionStatus: 'question_status',
      contents: 'contents',
      correctAnswer: 'correctAnswer'
    })
  },
  mounted () {
    if (this.questionStatus === 7) {
      this.$nextTick(() => {
        this.setFontSize()
      })
    }
  },
  methods: {
    answer () {
      this.$emit('answer')
    },
    getFontWidth (str, font) { // 获取字符串width
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      ctx.font = font
      return ctx.measureText(str).width
    },
    setFontSize () { // 设置字符串size
      const baseWidth = this.$refs.baseContainer.offsetWidth
      let resultWidth = this.$refs.resultNum && this.$refs.resultNum.offsetWidth
      let fontWidth = 28
      if (baseWidth - resultWidth <= this.getFontWidth(this.content, `${fontWidth}px Roboto-Light`)) {
        fontWidth = 24
        this.$emit('setAllFontSize', 0.24)
      }
      baseWidth && this.changeFontColor(baseWidth, resultWidth, fontWidth)
    },
    changeFontColor (baseWidth, resultWidth) { // 改变字体颜色
      let answerNum = 0
      if (this.$refs.answerNum) {
        answerNum = this.$refs.answerNum.offsetWidth
      }
      let answerText = this.$refs.answerText.offsetWidth
      let cc = (this.percent / 100 - 0.95) * baseWidth
      if (cc >= 0) {
        // 全部变白
        this.isAllWhite = true
      }
      let dd = (this.percent / 100) * baseWidth - ((baseWidth + answerText) / 2)
      if (dd >= -5) {
        // 答案变白
        this.isAnswerWhite = true
      }
      let ee = (this.percent / 100) * baseWidth - (baseWidth - resultWidth + answerNum)
      if (ee > 0) {
        // 答案和数据变白
        this.isResultWhite = true
      }
    }
  },
  watch: {
    questionStatus: function (questionStatus) {
      if (questionStatus === 7) {
        this.$nextTick(() => {
          this.setFontSize()
        })
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .answer-container{
    max-width: 100% !important;
    width: 624px;
    height: 93px;
    margin: 0 auto 20px ;
    background-color: #e9e8f1;
    border-radius: 46px;
    padding:0 23px;
    position: relative;
    font-family: 'Roboto', Arial, serif;
    font-weight: 300;
    &__state{
      width: 0;
      height:100%;
      border-radius: 46px;
      position: absolute;
      top:0;
      left:0;
      transition: width 100ms linear;
    }
    .hover{
      width: 100%;
      background-color: #ffc103;
    }
    .finish-right{
      background-color: #14d2cb;
    }
    .finish-wrong{
      background-color: #fb4c4c;
    }
    .font-white{
      color: #ffffff;
    }
    &__base{
      display:flex;
      width: 100%;
      height: 93px;
      justify-content: center;
      color: #241262;
      position: relative;
      align-items: center;
      &__text{
        height: 93px;
        line-height: 93px;
        align-self: center;
        text-align: center;
      }
      &__right{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        display: flex;
        align-items: center;
        &__num{
          font-style:italic;
          align-self: center;
        }
        &__icon{
          display: inline-block;
          font-size: 18px;
          margin-left: 16px;
          color: #241262;
          align-self: center;
          vertical-align: middle;
        }
      }
    }
  }
</style>
