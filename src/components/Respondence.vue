<template>
  <div class="respondence-container" ref="respondenceContainer">
    <viewing class="respondence-container__viewing"  v-if="watchingMode"></viewing>
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
              :result="+ (val && val.answerNum) || 0"
              :percent= "+(val && val.percent) || 0"
              :isRight="val && val.isRight"
              @answer="answer(val.answerText)"
              :is-click="isClick"
              :myChick="userAnswer === val.answerText"
              @setAllFontSize="setAllFontSize">
      </answer>
    </div>
    <div class="living" v-if="isLiving">
      <div class="living-bg">
        <living class="living-animation"></living>
      </div>
      <p class="revive-title">You get revived.</p>
      <p class="revive-text">
        Note: Extra Lives could be used twice per game, except on the last question.
      </p>
    </div>
    <!-- 答错或未答提示 -->
    <answer-error-tip v-model="answerErrorTip" :type="answerErrorType"></answer-error-tip>
    <!-- 使用复活卡提示 -->
    <modal v-model="extraLifeTip">
      <section class="tip-extra-life">
        <img src="../assets/images/heart-light.png" alt="" class="heart-light">
        <p class="tip-text">You have an  Extra Life!</p>
        <div class="useExtraLife" @click="useRecoveryCard">
          <section class="useExtraLife_wrapper" v-if="extraLifeTip"></section>
          <p>Using Extra Life in 5</p>
        </div>
        <p class="useExtraLife-not" @click="extraLifeTip=false">Not now</p>
        <span class="iconfont icon-cuowu close" @click="extraLifeTip=false"></span>
      </section>
    </modal>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Answer from '../components/Answer.vue'
import Modal from '../components/Modal.vue'
import AnswerErrorTip from '../components/AnswerErrorTip.vue'
import Viewing from '../components/Viewing.vue'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import Living from '../components/Living'
import { useRecoveryCard } from '../assets/js/api'
export default {
  name: 'Respondence',
  data () {
    return {
      answerErrorTip: false,
      extraLifeTip: false,
      answerErrorType: 'out',
      rangeValue: 10,
      isClick: false,
      fontSize: 28,
      countdownStyle: 'color: #fff;',
      isLiving: false,
      isUsedRecoveryCard: false // 是否使用过复活卡
      // game_answer: {
      //   current_question_l: 0,
      //   cost_time_l: 0,
      //   question_id_l: 0,
      //   resule_code_s: ''
      // }
    }
  },
  computed: {
    ...mapGetters(['question_status', 'watchingMode', 'contents', 'index', 'isAnswered', 'isCorrect', 'correctAnswer', 'userAnswer', 'time', 'restTime', 'options', 'question_result', 'id', 'maxRecoveryCount', 'isOnline', 'questionCount', 'lives']),
    totalResult: function () {
      let result = {}
      let totalNum = 0
      let optionsNumber = ['A', 'B', 'C']
      if (this.question_result) {
        for (let i in this.question_result) {
          totalNum += Number(this.question_result[i]) || 0
        }
      }
      Array.prototype.slice.call(this.options).forEach((val, idx) => {
        result[optionsNumber[idx] + '. ' + val] = {
          answerNum: (this.question_result && this.question_result[val]),
          percent: this.question_result && this.computePercent(+this.question_result[val], totalNum),
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
      if (this.watchingMode || this.isClick) {
        this.watchingMode && this.$store.dispatch(type._OPEN_DIALOG, {
          htmlTitle: 'You\'ve been eliminated. ',
          htmlText: 'You can no longer play for the cash prize. But you can watch and chat.',
          shouldSub: false,
          markType: 0,
          okBtnText: 'OK'
        })
        return false
      }
      if (this.question_status === 5) {
        if (!this.watchingMode) {
          // 可以点击
          this.isClick = true
          const userAnswerInfo = {userAnswer: e, isAnswered: true}
          const {id, index} = this
          this.$store.commit(type.QUESTION_UPDATE, userAnswerInfo)
          // 作答情况存储在本地
          utils.setLocalStorge(
            {
              ...userAnswerInfo,
              id,
              index
            },
            'user-answer', 180000)
          this.$store.dispatch(type.QUESTION_SUBMIT).then(() => {
            utils.statistic('QUESTION_RESULT', 1, {
              id_s: `${this.index}`,
              result_code_s: '1',
              style_s: `${this.isOnline ? 1 : 0}`,
              type_s: utils.pageType
            })
          }, (err) => {
            this.$emit('error', err)
            utils.statistic('QUESTION_RESULT', 1, {
              id_s: `${this.index}`,
              result_code_s: '0',
              style_s: `${this.isOnline ? 1 : 0}`,
              type_s: utils.pageType
            })
          })
          // this.game_answer.current_question_l = this.index
          // this.game_answer.cost_time_l = this.restTime
          // this.game_answer.question_id_l = this.id
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
    setAllFontSize (textSize) {
      if (this.fontSize >= textSize) {
        this.fontSize = textSize
      }
      this.$refs.answerContainer.style.fontSize = this.fontSize + 'rem'
      let iconAll = Array.prototype.slice.call(document.querySelectorAll('.resultIcon'))
      iconAll.forEach((val) => {
        val.style.fontSize = this.fontSize - 0.1 + 'rem'
      })
    },
    /**
     * 使用复活卡
     */
    useRecoveryCard () {
      this.isUsedRecoveryCard = true
      this.extraLifeTip = false
      const {id, index, isAnswered} = this
      console.log('使用复活卡时题目信息：', id, index, isAnswered)
      let recoveryType = isAnswered ? 1 : 2 // 复活类型 1 答错复活 2 未答复活
      useRecoveryCard(id, index, recoveryType).then(({data}) => {
        if (+data.result === 1 && +data.code === 0) {
          // 更新复活卡数量与复活次数
          const {cardNumber = 0, reviveTimes = 0} = data.data || {}
          this.$store.commit(type.QUESTION_UPDATE, {
            isCorrect: true,
            maxRecoveryCount: reviveTimes
          })
          this.$store.commit(type._UPDATE, {
            lives: cardNumber
          })
          this.isLiving = true
          utils.playSound('succeed')
          setTimeout(() => {
            this.isLiving = false
          }, 3000)
        } else {
          this.cancelUseRecoveryCard()
          console.log('复活卡使用失败:', data.msg)
        }
      }, (err) => {
        this.cancelUseRecoveryCard()
        console.log('复活卡使用出错:', err)
      }).catch((err) => {
        this.cancelUseRecoveryCard()
        console.log('复活卡使用代码逻辑出错:', err)
      })
    },
    /**
     * 重置问题状态
     */
    resetState () {
      this.$store.commit(type.QUESTION_UPDATE, {
        isAnswered: false
      })
      this.isUsedRecoveryCard = false
      this.answerErrorTip = false
      this.extraLifeTip = false
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
    question_status: function (status) {
      this.countDown(status)

      if (status === 7) {
        const {isCorrect, watchingMode, isAnswered, maxRecoveryCount, isOnline, index, questionCount, lives} = this

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
          }, 3000)

          // 若无复活卡或使用次数已经到本场最大使用次数,则弹出错误提示
          if (lives <= 0 || maxRecoveryCount <= 0) {
            setTimeout(() => {
              this.$emit('fail-tip')
            }, 1000)
            this.cancelUseRecoveryCard()
            return false
          }

          // 满足复活卡使用条件 弹出使用复活卡弹窗
          setTimeout(() => {
            if (isOnline && (+index < questionCount) && (lives > 0) && (maxRecoveryCount > 0)) {
              this.extraLifeTip = true
              setTimeout(() => {
                if (!this.extraLifeTip && !this.isUsedRecoveryCard) { // 关闭弹窗
                  this.cancelUseRecoveryCard()
                } else if (this.extraLifeTip && !this.isUsedRecoveryCard) { // 五秒未操作
                  // 关闭提示 使用复活卡
                  this.extraLifeTip = false
                  this.useRecoveryCard()
                }
                this.resetState()
              }, 5000)
            } else {
              this.cancelUseRecoveryCard()
            }
          }, 1500)
        }
      }
    //  if (status === 7 && !this.watchingMode) {
    //    this.game_answer.resule_code_s = this.isClick ? (this.isCorrect ? 'right' : 'wrong') : 'none'
    //    utils.statistic('', 2, this.game_answer)
    //  }
    },
    restTime: function (restTime) {
      if (restTime === 4) {
        // 答题倒计时
        utils.playSound('countDown5')
      }
    },
    isAnswered: function (val) {
      this.isClick = val
    }
  },
  components: {
    Answer,
    Viewing,
    Living,
    Modal,
    AnswerErrorTip
  }
}
</script>
<style scoped lang="less" type="text/less">
  .respondence-container{
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
      min-height: 28px;
    }
    &__answer{
      font-size: 28px;
    }
    .living{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(68, 68, 68, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
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
