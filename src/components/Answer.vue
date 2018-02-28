<template>
  <div class="answer-container" @click="answer">
    <div class="answer-container__state"
         :class="{'finish-right': question_status === 7 && isRight, 'finish-wrong': question_status === 7 && !isRight, 'hover': question_status === 5 && isClick && myChick}"
         id="progress"
         :style="{width: percent + '%'}">
    </div>
    <div class="answer-container__base">
      <span class="answer-container__base__text" :class="{'font-white':(isClick || question_status === 7) && myChick}">{{content}}</span>
      <div class="answer-container__base__right" v-if="question_status === 7">
        <span class="answer-container__base__right__num">{{result}}</span>
        <span class="answer-container__base__right__icon iconfont icon-right"
              :class="{'icon-wrong': !isRight}"></span>
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
    }
  },
  computed: {
    ...mapGetters({
      question_status: 'question_status',
      contents: 'contents',
      correctAnswer: 'correctAnswer'
    })
  },
  mounted () {
    this.changeStatus(this.question_status)
  },
  methods: {
    answer () {
      this.$emit('answer')
    }
  },
  watch: {
    question_status: function (questionStatus) {
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
      height:100%;
      border-radius: 46px;
      position: absolute;
      top:0;
      left:0;
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
        &__num{
          font-style:italic;
        }
        &__icon{
          display: inline-block;
          width: 26px;
          height: 26px;
          background-color: aquamarine;
          vertical-align: bottom;
          margin-left: 16px;
        }
      }
    }
  }
</style>
