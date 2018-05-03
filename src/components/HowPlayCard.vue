<template>
  <div class="play-card">
    <p class="title">HOW TO PLAY</p>
    <img src="../assets/images/how-play-card.png" class="rule">
    <div class="content">
      <p class="text text1">Sign up, answer questions at <span class="special">10 PM </span>everyday</p>
      <p class="text text2">Get 12 questions all right, win up to <span class="special">₹1,000,000!</span></p>
      <p class="text text3">Use
        <span class="special">EXTRA LIFE </span>when answering incorrectly. Invite new user to get it!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowPlayCard',
  data () {
    return {}
  },
  computed: {
  },
  mounted () {
  }
}
</script>
<style scoped lang="less" type="text/less">
  .play-card{
    max-width: 93%!important;
    width: 6.7rem;
    background-color: #fff;
    border-radius: 24px;
    padding: 40px 25px;
    margin: 0 auto 25px;
    position: relative;
    color:#241262;
    .title{
      font-size: 36px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 50px;
    }
    .rule{
      max-width: 90%;
      width: 600px;
      margin: 0 auto;
    }
    .content{
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      color:#241262;
      .text{
        width: 55%;
        font-size: 28px;
        line-height: 40px;
        position: relative;
        font-family: 'Roboto';
        .special{
          font-size: 36px;
          color:#ffac22;
          font-weight: bold;

        }
      }
      .text1{
        top:190px;
        left: 270px;
      }
      .text2{
        top:330px;
        left: 50px;
      }
      .text3{
        top:435px;
        left: 275px;
      }
    }
  }
</style>
