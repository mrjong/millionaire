<template>
  <div class="respondence-container">
    <viewing class="respondence-container__viewing"  v-if="watchingMode"></viewing>
    <div class="respondence-container__countdown">
      <svg id="circleProcess" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="44%" stroke="#acabb0" stroke-width="4" style="stroke-opacity: 0.1"></circle>
        <circle id="circle" cx="50%" cy="50%" r="44%" stroke=" #ffcc03" stroke-width="4"
                ref="circle" :style="countdownStyle">
        </circle>
        <text x="50%" y="55%" class="text" fill="#241262" stroke-width="4">{{restTime1}}</text>
      </svg>
    </div>
    <p class="respondence-container__question">
      {{index}}.{{contents}}
    </p>
    <div class="respondence-container__answer" ref="answerContainer">
      <answer v-for="(val, idx) in totalResult"
              :key=idx
              :content="idx"
              :result="+ (val && val.answerNum) || 0"
              :percent= "+(val && val.percent) || 0"
              :isRight="val && val.isRight"
              @answer="answer(idx)"
              :is-click="isClick"
              :myChick="userAnswer === idx"
              @setAllFontSize="setAllFontSize">
      </answer>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Answer from '../components/Answer.vue'
import Viewing from '../components/Viewing.vue'
import * as type from '../store/type'
import utils from '../assets/js/utils'
export default {
  name: 'Respondence',
  data () {
    return {
      rangeValue: 10,
      isClick: false,
      fontSize: 28,
      countdownStyle: 'color: #fff;'
    }
  },
  computed: {
    ...mapGetters({
      question_status: 'question_status',
      watchingMode: 'watchingMode',
      contents: 'contents',
      index: 'index',
      isAnswered: 'isAnswered',
      isCorrect: 'isCorrect',
      correctAnswer: 'correctAnswer',
      userAnswer: 'userAnswer',
      time: 'time',
      restTime: 'restTime',
      options: 'options',
      questionResult: 'question_result'
    }),
    totalResult: function () {
      let result = {}
      let totalNum = 0
      if (this.questionResult) {
        for (let i in this.questionResult) {
          totalNum += this.questionResult[i]
        }
      }
      Array.prototype.slice.call(this.options).forEach((val) => {
        result[val] = {
          answerNum: (this.questionResult && this.questionResult[val]),
          percent: this.questionResult && this.computePercent(this.questionResult[val], totalNum),
          isRight: this.correctAnswer && this.correctAnswer === val
        }
      })
      return result
    },
    restTime1: function () {
      return Math.round(this.restTime / 1000)
    }
  },
  mounted () {
    this.$store.dispatch(type.QUESTION_INIT)
    this.$store.dispatch(type.QUESTION_GET)
    this.countDown(this.question_status)
  },
  methods: {
    ...mapActions({}),
    answer (e) {
      if (this.watchingMode || this.isClick) {
        return false
      }
      if (this.question_status === 5) {
        if (!this.watchingMode) {
          // 可以点击
          this.isClick = true
          this.$store.commit(type.QUESTION_UPDATE, {userAnswer: e})
          this.$store.dispatch(type.QUESTION_SUBMIT)
        }
      } else {
        // 不可以点击
        return false
      }
    },
    computePercent (val, totalNum) {
      let percent = (val / totalNum) * 100
      if (percent < 10 && percent > 0) {
        return 10 + percent
      }
      return percent
    },
    countDown (status) {
      let circle = this.$refs.circle
      if (status === 5) {
        this.countdownStyle = `transition:stroke-dashoffset ${this.restTime}ms linear;`
        setTimeout(() => {
          circle.style.strokeDashoffset = 0
        }, 100)
      } else if (status === 7) {
        this.isClick = false
        this.countdownStyle = ''
        circle.style.strokeDashoffset = 314
        setTimeout(() => {
          circle.removeAttribute('stroke-dashoffset')
        }, 500)
        this.percent = utils.computePercent(this.questionResult)
      }
    },
    setAllFontSize (textSize) {
      if (this.fontSize >= textSize) {
        this.fontSize = textSize
      }
      this.$refs.answerContainer.style.fontSize = this.fontSize + 'rem'
      let iconAll = Array.prototype.slice.call(document.querySelectorAll('.resultIcon'))
      iconAll.forEach((val) => {
        val.style.fontSize = this.fontSize - 0.1 + 'rem'
      })
    }
  },
  watch: {
    question_status: function (status) {
      this.countDown(status)
    }
  },
  components: {
    Answer,
    Viewing
  }
}
</script>
<style scoped lang="less" type="text/less">
  .respondence-container{
    margin: 25px;
    background-color: #fff;
    border-radius: 24px;
    padding: 35px 23px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &__viewing{
      position: absolute;
      top: 30px;
      right: 30px;
    }
    &__countdown{
      width: 113px;
      height: 113px;
      align-self: center;
      margin: 0 auto;
    }
    &__question{
      width: 100%;
      color: #241262;
      margin: 40px auto;
      padding: 0 16px;
      line-height: 40px;
      font: 28px Roboto-Light;
      text-align: left;
    }
    &__answer{
      font-size: 28px;
    }
  }
  #circleProcess {
    width: 100%;
    height: 100%;
    fill: none;
    background-color: transparent;
  }
  #circle{
    stroke-dasharray: 314px;
    stroke-dashoffset: 314px;
  }
  .text{
    font-weight: 600;
    text-anchor: middle;
    dominant-baseline: middle;
    font: 56px Roboto-BoldCondensed;
  }
</style>
