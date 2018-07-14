<template>
  <div class="task" v-if="isShowNewbieTask">
    <span class="task__close iconfont icon-cuowu" @click="close"></span>
    <div class="task__content">
      <div class="bubble">
        <img src="../assets/images/bubble.png" class="bubble__img">
        <p class="bubble__text">Hi,i am the quiz master Supa.welcome to go!millionaire.Now Let us begin a Novice task,and then you'll <span class="important">get an extra life</span> as a gift.</p>
      </div>
      <div class="supa">
        <img src="../assets/images/task-supa.png" class="spua__img">
      </div>
    </div>
    <div class="task__btn" @click="doTask">Start Task Now</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as type from '../store/type'
import countDownState from '../assets/js/game-state/state-countDown.js'
import gameProcess from '../assets/js/game-process'
// import questionMsgProcess from '../assets/js/game-process/question-hostMsg.js'

export default {
  name: 'NewbieTask',
  props: {
  },
  data () {
    return {
      isClose: false,
      FirstGuide: false
    }
  },
  computed: {
    ...mapGetters({
      status: 'status',
      questionStatus: 'question_status',
      isShowNewbieTask: 'isShowNewbieTask'
    })
  },
  mounted () {
  },
  methods: {
    close () {
      this.$store.commit(type._UPDATE, {
        isShowNewbieTask: false,
        isTaskRespondence: false
      })
    },
    doTask () {
      utils.statistic('wait_page', 1, {to_destination_s: 'referral_code_guide'}, 'wait_page')
      this.$store.commit(type._UPDATE, {
        isShowNewbieTask: false,
        isTaskRespondence: true,
        startTimeOffset: 10
      })
      this.$store.commit(type.QUESTION_UPDATE, {
        watchingMode: false
      })
      gameProcess.update({
        offlineMode: true,
        currentIndex: 1,
        isExitQuit: true,
        questions: [{
          ji: '0', js: 1, jc: '1 + 1 =', jo: ['1', '2', '3'], ja: 'c81e728d9d4c2f636f067f89cc14862c', jd: ['1 + 1 = 2'], restTime: 10
        },
        {
          ji: '1', js: 2, jc: '1 + 2 = ', jo: ['2', '3', '4'], ja: 'eccbc87e4b5ce2fe28308fd9f2a7baf3', jd: ['1 + 2 = 3'], restTime: 10
        },
        {
          ji: '2', js: 3, jc: '1 + 3 = ', jo: ['4', '5', '6'], ja: 'a87ff679a2f3e71d9181a67b7542122c', jd: ['1 + 3 = 4'], restTime: 10
        }
        ]
      })
      utils.storage.remove('millionaire-process')
      utils.storage.remove('millionaire-user-answer')
      countDownState.run()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .task {
    width: 100%;
    min-height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 111;
    padding: 80px 40px 50px;
    background-color: rgba(0, 0, 0, 0.9);
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    &__close{
      position: absolute;
      top: 24px;
      right: 24px;;
      width: 50px;
      height: 50px;
      background-color:  rgba(255, 255, 255, 0.7);
      font-size: 26px;
      border-radius: 50%;
      line-height: 50px;
      text-align: center;
      color:#443575;
      font-weight: bold;
    }
    &__content{
      width: 100%;
      display: flex;
      position: relative;
      .bubble{
        width: 50%;
        width: 420px;
        position: relative;
        margin-top: 110px;
        &__img{
          width: 100%;
        }
       &__text {
         width: 80%;
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%,-50%);
         color: #fff;
         font: 26px 'Roboto', Arial, serif;
         line-height: 40px;
         letter-spacing: 1px;
       }
      }
      .supa{
        width:245px;
        img {
          width:100%;
        }
      }
    }
    &__btn{
      color: #fff;
      font-size: 32px;
      max-width:100%;
      width: 650px;
      height: 94px;
      background-color: #faa729;
      text-align: center;
      line-height: 94px;
      border-radius: 46px;
      margin: 50px auto 0;
      display: flex;
      justify-content: center;
      box-shadow: 0 5px 30px 5px rgba(250, 167, 41, 0.3);
      &__icon{
        width: 60px;
        height: 55px;
        background: url('../assets/images/lives-icon.png') no-repeat center;
        background-size: cover;
        align-self: center;
        line-height: 50px;
        text-align: center;
        font-size: 22px;
        margin-right: 15px;
      }
    }
    .important{
      color: #e03c79;
    }
  }
</style>
