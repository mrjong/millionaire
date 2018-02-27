<template>
  <div class="respondence-container">
    <viewing class="respondence-container__viewing"  v-if="watchingMode"></viewing>
    <div class="respondence-container__countdown">
      <svg id="circleProcess" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="41%" stroke="#ececef" stroke-width="4"></circle>
        <circle id="circle" cx="50%" cy="50%" r="41%" stroke=" #ffcc03" stroke-width="4.5"></circle>
        <text x="50%" y="-32%" class="text" fill="#241262" stroke-width="4">{{restTime}}</text>
      </svg>
    </div>
    <p class="respondence-container__question">
      1.provident quae recusandae similique velit veniam voluptatibus voluptatum? Porro, quod.
    </p>
    <div class="respondence-container__answer">
      <!--<answer v-for="(val, idx) in options" :key=idx :content="val" @click="answer(val)"></answer>-->
      <answer content="val"
              @answer="answer('val')"
              :is-click="isClick">
      </answer>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Answer from '../components/Answer.vue'
import Viewing from '../components/Viewing.vue'
import * as type from '../store/type'
export default {
  name: 'Respondence',
  data () {
    return {
      rangeValue: 10,
      isClick: false,
      options: ['dfa', 'dsfafasdf', 'twetg']
    }
  },
  mounted () {
    this.$store.dispatch(type.QUESTION_GET)
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
      result: '',
      time: 'time',
      restTime: 'restTime'
    })
  },
  methods: {
    ...mapActions({}),
    answer (e) {
      if (this.isClick) {
        return false
      }
      if (this.question_status === 5) {
        if (this.watchingMode) {
          // 可以点击
          console.log('dd')
          this.isClick = true
          this.$store.dispatch(type.QUESTION_SUBMIT, e)
          this.$store.commit(type.QUESTION_UPDATE, {
            watchingMode: true
          })
        }
      } else {
        // 不可以点击
        return false
      }
    }
  },
  watch: {
    question_status: function () {
      let circle = document.getElementById('circle')
      if (this.question_status === 5) {
        circle.setAttribute('transition', `transition: stroke-dashoffset ${this.restTime} linear;`)
        setTimeout(() => {
          circle.style.strokeDashoffset = 0
        }, 500)
      } else {
        this.isClick = false
        circle.removeAttribute('transition')
        setTimeout(() => {
          circle.style.strokeDashoffset = 314
        }, 500)
      }
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
    box-sizing: border-box;
    margin: 25px;
    background-color: #fff;
    border-radius: 28px;
    padding: 50px 23px;
    position: relative;
    &__viewing{
      position: absolute;
      top: 30px;
      right: 30px;
    }
    &__countdown{
      width: 113px;
      height: 113px;
      margin:0 auto;
    }
    &__question{
      font-size: 28px;
      color: #241262;
      margin: 43px auto 50px;

    }
  }
  #circleProcess {
    position: relative;
    width: 100%;
    height:100%;
    fill: none;
    transform:rotate(-90deg);
    background-color: transparent;
  }
  #circle{
    stroke-dasharray: 314px;
    stroke-dashoffset: 314px;
    transition: stroke-dashoffset 10s linear;
  }
  .text{
    transform:rotate(90deg);
    font-size: 56px;
    color: #241262;
    font-weight: 600;
    text-anchor: middle;
  }
</style>
