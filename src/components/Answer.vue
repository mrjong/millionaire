<template>
  <div class="answer-container" @click="answer">
    <div class="answer-container__state"
         :class="{'finish-right': questionStatus === 7 && isRight, 'finish-wrong': questionStatus === 7 && !isRight, 'hover': questionStatus === 5 && isClick && myChick}"
         id="progress"
         :style="{width: percent + '%'}">
    </div>
    <div class="answer-container__base" ref="baseContainer" :class="{'font-white': isAllWhite}">
      <span class="answer-container__base__text"  ref="answerText"
            :class="{'font-white':(isAnswerWhite && questionStatus === 7) || myChick}">{{content}}</span>
      <div class="answer-container__base__right" v-if="questionStatus === 7" ref="resultNum">
        <p class="answer-container__base__right__num">{{result}}</p>
        <p class="answer-container__base__right__icon iconfont icon-duihao"
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
      isAllWhite: false
    }
  },
  computed: {
    ...mapGetters({
      questionStatus: 'question_status',
      contents: 'contents',
      correctAnswer: 'correctAnswer'
    }),
    textWidth: function () {
      return this.$refs.answerText.getBoundingClientRect().width
    }
  },
  mounted () {
    if (this.questionStatus === 7) {
      this.computeWidth(this.textWidth)
    }
  },
  methods: {
    answer () {
      this.$emit('answer')
    },
    computeWidth (ele) {
      const baseWidth = this.$refs.baseContainer.offsetWidth
      let resultWidth = this.$refs.resultNum.offsetWidth
      let bb = ((ele / 2) + resultWidth) - (baseWidth / 2)
      if (bb >= 0) {
        // 缩小字体
        console.log('bb' + bb)
      }
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
    }
  },
  watch: {
    questionStatus: (questionStatus) => {
      if (questionStatus === 7) {
        this.computeWidth(this.textWidth)
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
        display: flex;
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
