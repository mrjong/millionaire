<template>
  <div class="respondence-container" ref="respondenceContainer">
    <div class="respondence-container__countdown">
      <svg id="circleProcess" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="44%" stroke="#acabb0" stroke-width="4" style="stroke-opacity: 0.1"></circle>
        <circle id="circle" cx="50%" cy="50%" r="44%" stroke=" #ffcc03" stroke-width="4"
                ref="circle" :style="countdownStyle">
        </circle>
        <text x="50%" y="55%" class="text" fill="#241262" stroke-width="4">{{restTime}}</text>
      </svg>
    </div>
    <p class="respondence-container__question">
      {{index}}. {{contents}}
    </p>
    <div class="respondence-container__answer" ref="answerContainer">
      <answer v-for="(val, idx) in totalResult"
              :key=idx
              :content="idx"
              :orderNumber="val && val.orderNumber"
              :percent= "+(val && val.percent)"
              :isRight="val && val.isRight"
              @answer="answer(val.answerText)"
              :is-click="isClick"
              :myChick="userAnswer === val.answerText">
      </answer>
    </div>
    <!-- 答错或未答提示 -->
    <answer-error-tip v-model="answerErrorTip" :type="answerErrorType"></answer-error-tip>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Answer from '../components/Answer.vue'
import AnswerErrorTip from '../components/AnswerErrorTip.vue'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import awaitState from '../assets/js/game-state/state-end'
export default {
  name: 'TaskRespondence',
  data () {
    return {
      answerErrorTip: false,
      answerErrorType: 'out',
      rangeValue: 10,
      isClick: false,
      fontSize: 28,
      countdownStyle: 'color: #fff;'
    }
  },
  computed: {
    ...mapGetters(['question_status', 'watchingMode', 'contents', 'index', 'isAnswered', 'isCorrect', 'correctAnswer', 'userAnswer', 'time', 'restTime', 'options', 'question_result', 'id', 'maxRecoveryCount', 'isOnline', 'questionCount', 'lives', 'isCanRecoveryLastQuestion', 'isTaskRespondence']),
    totalResult: function () {
      let result = {}
      let optionsNumber = ['A', 'B', 'C']
      Array.prototype.slice.call(this.options).forEach((val, idx) => {
        result[optionsNumber[idx] + '. ' + val] = {
          answerNum: '',
          percent: 100,
          isRight: this.correctAnswer && this.correctAnswer === val,
          answerText: val
        }
      })
      return result
    }
  },
  mounted () {
    this.countDown(this.question_status)
    this.isClick = this.isAnswered
    utils.statistic('game_page', 0)
  },
  methods: {
    ...mapActions({}),
    answer (e) {
      // 上报用户作答情况
      utils.statistic('QUESTION', 1, {
        id_s: `${this.index}`,
        flag_s: `${this.watchingMode ? 1 : 0}`,
        style_s: `${this.isOnline ? 1 : 0}`,
        type_s: utils.pageType
      })
      if (this.isClick) {
        return false
      }
      if (this.question_status === 5) {
        if (!this.watchingMode) {
          // 可以点击
          this.isClick = true
          const userAnswerInfo = {
            userAnswer: e,
            isAnswered: true
          }
          const {id, index} = this
          this.$store.commit(type.QUESTION_UPDATE, userAnswerInfo)
          // 作答情况存储在本地
          utils.storage.set('millionaire-user-answer',
            {
              ...userAnswerInfo,
              id,
              index,
              raceId: utils.raceId
            })
        }
      } else {
        // 不可以点击
        return false
      }
    },
    computePercent (val, totalNum) {
      let percent = (val / totalNum) * 100
      if (percent < 10 && percent > 0) {
        if (percent >= 7) {
          return 5 + percent
        } else {
          return 10
        }
      }
      return percent
    },
    countDown: function (status) {
      let circle = this.$refs.circle
      if (status === 5) {
        this.countdownStyle = `
        transition:stroke-dashoffset ${this.restTime}s linear;
        -webkit-transition:stroke-dashoffset ${this.restTime}s linear;
        -o-transition:stroke-dashoffset ${this.restTime}s linear;
        -moz-transition:stroke-dashoffset ${this.restTime}s linear;
        -ms-transition:stroke-dashoffset ${this.restTime}s linear;
        `
        setTimeout(() => {
          circle.style.strokeDashoffset = 0
        }, 200)
      } else if (status === 7) {
        this.isClick = false
        this.countdownStyle = ''
        circle.style.strokeDashoffset = 3.14 + 'rem'
        this.percent = utils.computePercent(this.question_result)
      }
    },
    /**
     * 重置问题状态
     */
    resetState () {
      this.$store.commit(type.QUESTION_UPDATE, {
        isAnswered: false
      })
      this.answerErrorTip = false
    },
    /**
     * 取消使用复活卡
     */
    cancelUseRecoveryCard () {
      const {watchingMode, isCorrect, isAnswered} = this.$store.getters
      this.$store.commit(type.QUESTION_UPDATE, {
        watchingMode: watchingMode ? true : (!isAnswered || !isCorrect)
      })
      this.resetState()
    }
  },
  watch: {
    question_status: function (status, old) {
      this.countDown(status)
      if (status === 7) {
        const {isCorrect, watchingMode, isAnswered} = this

        // 如果已经观战 直接退出
        if (watchingMode) {
          this.resetState()
          return false
        }

        // 答案正确播放提示音
        if (isCorrect && !watchingMode) {
          utils.playSound('succeed')
          this.resetState()
          return false
        }

        // 没有答题或者答错
        if (!isAnswered || !isCorrect) {
          utils.playSound('failed')
          if (!isCorrect) {
            this.answerErrorType = 'incorrect'
          }

          if (!isAnswered) {
            this.answerErrorType = 'out'
          }
          // 显示错误提示，三秒后消失
          this.answerErrorTip = true
          setTimeout(() => {
            this.answerErrorTip = false
            if (this.isTaskRespondence) {
              awaitState.update()
              this.$store.commit(type._UPDATE, {
                isShowTaskEnd: 2
              })
            }
          }, 3000)
        }
      }
    },
    restTime: function (restTime) {
      if (restTime === 4) {
        // 答题倒计时
        utils.playSound('countDown5')
      }
    },
    isAnswered: function (val) {
      this.isClick = val
    },
    status (val) {
      // 当主状态变为等待状态或者倒计时，重置答题状态
      if (val === 1 || val === 2) {
        this.resetState()
      }
    }
  },
  components: {
    Answer,
    AnswerErrorTip
  }
}
</script>
<style scoped lang="less" type="text/less">
  .respondence-container{
    height: auto;
    min-height: 500px;
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
      font: 300 28px/40px 'Roboto';
      text-align: left;
      min-height: 30px;
    }
    &__answer{
      font-size: 28px;
      min-height:340px;
    }
    .living{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 1111;
      .living-bg{
        width: 500px;
        height: 500px;
        background: url("../assets/images/light.png") no-repeat top;
        background-size: cover;
        align-self: center;
        display: flex;
        justify-content: center;
        margin-top: -100px;
        .living-animation{
          align-self: center;
          width: 180px;
          height: 180px;
        }
      }
      .revive-title{
        width: 80%;
        color: #fff;
        font-size: 48px;
        font-family: "Roboto";
        text-align: center;
        margin: 0 auto 30px;
      }
      .revive-text{
        width: 80%;
        color: #ff70a5;
        font-size: 28px;
        text-align: center;
        margin: 0 auto;
      }
    }

    .tip-extra-life {
      width: 546px;
      height: 697px;
      background-color: #fff;
      border-radius: 24px;
      font: 400 24px 'Roboto', Arial, serif;
      text-align: center;
      position: relative;

      .heart-light {
        width: 316px;
        margin: 57px auto 33px;
      }

      .tip-text {
        margin: 0 auto;
        color: #260964;
        font: 500 36px 'Roboto', Arial, serif;
      }

      .useExtraLife {
        width: 403px;
        margin: 60px auto 0;
        height: 74px;
        border-radius: 41.3px;
        background-color: #f93a82;
        position: relative;

        &_wrapper {
          width: 0;
          height: 100%;
          background-color: #e31869;
          border-radius: 41.3px;
          animation: useExtraLifeWrapper 5s linear;
        }

        p {
          width: 100%;
          color: #fff;
          line-height: 74px;
          position: absolute;
          z-index: 2;
          left: 0;
          top: 0;
        }
      }

      .useExtraLife-not {
        width: 200px;
        height: 100px;
        margin: 0 auto 0;
        color: #7d6ba2;
        line-height: 100px;
      }

      .close {
        color: #513a83;
        position: absolute;
        right: 27px;
        top: 27px;
        font-size: 24px;
      }
    }
  }

  @keyframes useExtraLifeWrapper {
    0% {
      width: 13%;
    }

    100% {
      width: 100%;
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
    font: 700 56px 'Roboto Condensed', Arial, serif;
  }
</style>
