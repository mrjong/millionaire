<template>
  <div class="set-question">
    <div class="set-question__wrap"></div>
    <div class="set-question__mark" v-if="isPop">
      <div class="bomb">
        <img src="../assets/images/logo.png" class="bomb__logo">
        <div class="bomb__content">
          <p class="bomb__content__title">QUIZ MASTER Required!<br>Set it, Question it, Win it!!</p>
          <p class="bomb__content__clause" v-for="(item, index) in instruction" :key="index">{{item}}</p>
          <p class="bomb__content__note">Note:</p>
          <p class="bomb__content__text" v-for="(value) in note" :key="value">{{value}}</p>
        </div>
        <div class="bomb__btn" @click="closeBomb">
          <p class="bomb__btn__text">OK, I agree</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rule',
  data () {
    return {
      instruction: [
        '1. Set questions with proper grammar and spelling, and submit them to be our QUIZ MASTER. ',
        '2. Once your questions are selected, you\'ll get the chances to answer your own question in \'Go! Millionaire\' Game to win.',
        '3. Once your questions are selected, you\'ll get the chances to answer your own question in \'Go! Millionaire\' Game to win.',
        '4. Your name will be featured below your questions, which means to be seen by millions of APUS Users.',
        '5. We\'ll announce each QUIZ MASTER on @APUSBrowser Facebook page everyday..'
      ],
      note: [
        'English questions only.',
        'Submit as more questions as you can to be "Golden QUIZ ',
        'MASTER" every week, awards await you.'
      ],
      isPop: true
    }
  },
  mounted() {
    this.isPop = true
  },
  methods: {
    closeBomb () {
      this.isPop = false
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.set-question{
  width: 100%;
  height: 100%;
  background: url("../assets/images/set-question-bg.jpg") no-repeat top left;
  background-size: cover;
  color: #fff;
  &__mark{
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.8;
    display: flex;
    justify-content: center;
    .bomb{
      width: 620px;
      min-height: 1000px ;
      background: url("../assets/images/bomb-bg.jpg") no-repeat top left;
      background-size: cover;
      align-self: center;
      border-radius: 26px;
      position: relative;
      padding: 0 35px 70px 50px;
      &__logo{
        width: 323px;
        position: absolute;
        top: -70px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &__content{
        margin-top: 85px;
        &__title{
          margin: 0 auto 40px;
          text-align: center;
          font: 38px "Roboto Regular";
          font-weight: bold;
          line-height: 38px;
        }
        &__clause{
          font: 24px "Roboto-Regular";
          font-style: italic;
          font-weight: lighter;
          margin-bottom: 20px;
        }
        &__note{
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        &__text{
          font: 20px "Roboto-Regular" ;
          font-style: italic;
          opacity: 0.8;
        }
      }
      &__btn{
        display: flex;
        width: 502px;
        height: 76px;
        background-color: #faa717;
        border-radius: 46px;
        box-shadow: 2px 5px 20px 3px rgba(250, 167, 23, 0.71);
        margin-top: 36px;
        justify-content: center;
        &__text{
         align-self: center;
          font: 28px "Roboto-Regular";
        }
      }
    }
  }
}
</style>
