<template>
  <div class="answer-container" @click="answer">
    <div class="answer-container__state"
         :class="{'finish-right': questionStatus === 7 && isRight, 'finish-wrong': questionStatus === 7 && !isRight, 'hover': questionStatus === 5 && isClick && myChick}"
         :style="{width: percent + '%'}">
    </div>
    <div class="answer-container__base" ref="baseContainer" :class="{'font-white': isAllWhite}">
      <span class="answer-container__base__text answerText"  ref="answerText"
            :class="{'font-white':(isAnswerWhite && questionStatus === 7) || myChick}">{{content}}</span>
      <div class="answer-container__base__right" v-if="questionStatus === 7" ref="resultNum">
        <p class="answer-container__base__right__num" ref="answerNum"
           :class="{'font-white': isResultWhite}">{{result}}</p>
        <p class="answer-container__base__right__icon iconfont icon-duihao resultIcon"
           :class="{'icon-cuowu': !isRight, 'font-white': isAllWhite}"></p>
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
    }
  },
  data () {
    return {
      isAnswerWhite: false,
      isAllWhite: false,
      isResultWhite: false
    }
  },
  computed: {
    ...mapGetters({
      questionStatus: 'question_status',
      contents: 'contents',
      correctAnswer: 'correctAnswer'
    }),
    textWidth: function () {
      return this.getFontWidth
    }
  },
  mounted () {
    if (this.questionStatus === 7) {
      this.changeFontColor(this.textWidth)
      this.setFontSize()
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
      let resultWidth = this.$refs.resultNum.offsetWidth
      let answerText = this.$refs.answerText
      let resultNum = this.$refs.resultNum
      let fontWidth = 28
      for (let i = fontWidth; i >= 10; i--) {
        fontWidth = this.getFontWidth(this.content, `${i}px Roboto-Light`)
        if (fontWidth / 2 + resultWidth - baseWidth / 2 >= 70) {
          answerText.style.fontSize = i / 100 + 'rem'
          resultNum.style.fontSize = i / 100 + 'rem'
        } else {
          this.$emit('setAllFontSize', i / 100 + 'rem', (i - 10) / 100 + 'rem')
          return false
        }
      }
    },
    changeFontColor () {
      const baseWidth = this.$refs.baseContainer.offsetWidth
      let resultWidth = this.$refs.resultNum.offsetWidth
      let answerNum = this.$refs.answerNum.offsetWidth
      console.log(answerNum)
      let cc = (this.percent / 100 - 0.95) * baseWidth
      if (cc >= 0) {
        // 全部变白
        this.isAllWhite = true
      }
      let dd = (this.percent / 100) * baseWidth - ((baseWidth + resultWidth) / 2)
      if (dd >= -5) {
        // 答案变白
        this.isAnswerWhite = true
      }
      let ee = (baseWidth - resultWidth + answerNum) - (this.percent / 100) * baseWidth
      if (ee > 0) {
        // 答案和数据变白
        console.log('ee' + ee)
        this.isResultWhite = true
      }
    }
  },
  watch: {
    questionStatus: (questionStatus) => {
      if (questionStatus === 7) {
        this.changeFontColor(this.textWidth)
        this.setFontSize()
      }
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
      width: 0;
      height:100%;
      border-radius: 46px;
      position: absolute;
      top:0;
      left:0;
      transition: width 300ms linear;
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
      height: 100%;
      justify-content: center;
      color: #241262;
      position: relative;
      &__text{
        align-self: center;
        font-size: 28px;
        font-family: Roboto-Light;
      }
      &__right{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        display: flex;
        font-size: 28px;
        &__num{
          font-style:italic;
          align-self: center;
        }
        &__icon{
          font-size: 18px;
          margin-left: 16px;
          color: #241262;
          align-self: center;
        }
      }
    }
  }
</style>
