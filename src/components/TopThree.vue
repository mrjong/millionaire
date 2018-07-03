<template>
  <div class="top">
    <div class="second" v-if="BoardData[1]">
      <div class="head">
        <img :src="BoardData[1].upic" class="head-img second-head">
        <img class="decorate" src="../assets/images/rank-second.png"/>
      </div>
      <p class="nickname">{{BoardData[1].nick}}</p>
      <p class="number">{{$t('invite.rank_text1', {number: BoardData[1].sc})}}</p>
      <p class="money">{{$t('invite.rank_text2')}}{{userInfo.currencyType}}{{BoardData[1].amountFmt}}</p>
    </div>
    <div class="first" v-if="BoardData[0]">
      <div class="head">
        <img :src="BoardData[0].upic" class="head-img first-head">
        <img class="decorate" src="../assets/images/rank-first.png"/>
      </div>
      <p class="nickname">{{BoardData[0].nick}}</p>
      <p class="number">{{$t('invite.rank_text1', {number: BoardData[0].sc})}}</p>
      <p class="money">{{$t('invite.rank_text2')}}{{userInfo.currencyType}}{{BoardData[0].amountFmt}}</p>
    </div>
    <div class="third" v-if="BoardData[2]">
      <div class="head">
        <img :src="BoardData[2].upic" class="head-img third-head">
        <img class="decorate" src="../assets/images/rank-third.png"/>
      </div>
      <p class="nickname">{{BoardData[2].nick}}</p>
      <p class="number">{{$t('invite.rank_text1', {number: BoardData[2].sc})}}</p>
      <p class="money">{{$t('invite.rank_text2')}}{{userInfo.currencyType}}{{BoardData[2].amountFmt}}</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'TopThree',
  props: {
    BoardData: {
      type: Array
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  }
}
</script>
<style scoped lang="less" type="text/less">
.top{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .second, .first, .third {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .head {
      margin-top: 40px;
      height: 150px;
      .head-img{
        width: 130px;
        height: 130px;
        border-radius: 50%;
        align-self: center;
      }
      .first-head{
        width: 150px;
        height: 150px;
        margin: 0 auto;
      }
      .second-head, .third-head {
        margin: 40px auto 0;
      }
      .decorate{
        position: relative;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%,0);
        width: 170px;
        height: 50px;
      }
    }
    .nickname, .number {
      margin-top: 10px;
      color: #201a98;
      min-height: 30px;
      font: 20px 'Roboto', Arial, serif;
    }
    .nickname {
      margin-top: 50px;
    }
    .money{
      width: 200px;
      height: 40px;
      font: 24px 'Roboto', Arial, serif;
      line-height: 43px;
      margin-top: 20px;
      text-align: center;
      background-color: #ffb03e;
      color:#fff;
      border-radius: 24px;
    }
  }
}
</style>
