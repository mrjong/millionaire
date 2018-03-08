<template>
  <div class="rule">
    <div class="rule__wrap">
      <p class="header" @click="goback">
         <span class="iconfont icon-fanhui"></span>
      </p>
      <p class="title">How to play</p>
      <div class="rule-item" v-for="col in ruleList" :key="col.id">
        <img :src="col.img" alt="" class="rule-item__img">
        <div class="rule-item__title">
          <span class="rule-item__title__index">{{col.id}}</span>
          {{col.title}}
        </div>
        <p class="rule-item__text">
          {{col.describe}}
        </p>
      </div>
      <div class="share">
        <img src="../assets/images/facebook-icon.png" alt="" class="share__icon">
        <p class="share__describe">Wanna get more tips to win? Like us on Facebook!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rule',
  data () {
    return {
      ruleList: [
        {
          id: 1,
          img: require(`../assets/images/rule1.png`),
          title: `Join our live Quiz Game on time`,
          describe: `Please don't be late or you'll miss the cash prize. A push notification will be sent to remind you.`
        },
        {
          id: 2,
          img: require(`../assets/images/rule2.png`),
          title: `Answer each question in 10s`,
          describe: `There're 12 questions. Choose the answer in 10 seconds for each.`
        },
        {
          id: 3,
          img: require(`../assets/images/rule3.png`),
          title: `Answer them all right to WIN Cash`,
          describe: `People who get them all right will split the cash prize.`
        },
        {
          id: 4,
          img: require(`../assets/images/rule4.png`),
          title: `One who answer wrong will be out`,
          describe: `If you choose the wrong answer, or time is out, you'll be eliminated.`
        },
        {
          id: 5,
          img: require(`../assets/images/rule5.png`),
          title: `No winners? Get next prize bigger`,
          describe: `The prize rolls over to the next day if no one get all questions right.`
        },
        {
          id: 6,
          img: require(`../assets/images/rule6.png`),
          title: `Cash Out with Paytm`,
          describe: `You can cash out to your Paytm account if you win.`
        },
        {
          id: 7,
          img: require(`../assets/images/rule7.png`),
          title: `Invite friends to win real cash together`,
          describe: ``
        }
      ]
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
.rule {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  &__wrap {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.header {
  width: 54px;
  height: 54px;
  background: #241262;
  border-radius: 50%;
  text-align: center;
  line-height: 54px;
  font-size: 28px;
  margin: 24px 0 38px 25px;
  align-self: flex-start;
}
.title {
  width: 281px;
  height: 56px;
  background: url('../assets/images/rule-title-bg.png') no-repeat left top;
  background-size: contain;
  color: #241262;
  font-family: 'Roboto-Bold';
  font-size: 36px;
  text-align: center;
  line-height: 56px;
}
.rule-item {
  width: 100%;
  padding: 0 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  &__img {
    width: 277px;
  }
  &__title {
    font-family: 'Roboto-Medium';
    font-size: 28px;
    margin: 44px 0 28px 0;
    color: #241262;
    &__index {
      display: inline-block;
      width: 35px;
      height: 35px;
      font-family: 'Roboto-Light';
      font-size: 21px;
      background: url('../assets/images/index-bg.png') no-repeat top left;
      background-size: contain;
      text-align: center;
      line-height: 35px;
      margin-right: 13px;
      color: #241262;
    }
  }
  &__text {
    font-family: 'Roboto-Light';
    line-height: 32px;
    font-size: 28px;
    color: #241262;
  }
}
.share {
  width: 100%;
  padding: 0 156px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  &__icon {
    width: 135px;
  }
  &__describe {
    color: #241262;
    font-family: 'Roboto-Medium';
    font-size: 32px;
    line-height: 35px;
    margin-bottom: 140px;
  }
}
</style>
