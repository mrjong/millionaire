<template>
  <div class="rank">
    <div class="rank-item" v-if="BoardData">
      <p class="index">{{BoardData.rank}}</p>
      <div class="head">
        <img :src="BoardData.upic">
      </div>
      <p class="nickname">{{BoardData.nick}}</p>
      <div class="invite-data">
        <p class="number">{{$t('invite.rank_text1', {number: BoardData.pc})}}</p>
        <p class="money">{{$t('invite.rank_text2')}}{{userInfo.currencyType}}{{BoardData.amountFmt}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'InviteRank',
  props: {
    BoardData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  }
}
</script>

<style scoped lang="less" type="text/less">
.rank {
  margin-top: 30px;
  padding:20px 20px 0;
  .rank-item {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(34,15,96,0.2);
    .index {
      align-self: center;
      color:#201a98;
      font: 36px 'Roboto', Arial, serif;
    }
    .head{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 20px;
      img{
        width:100%;
      }
    }
    .nickname {
      flex: 2;
      align-self: center;
      color: #201a98;
      font: 24px 'Roboto', Arial, serif;
    }
    .invite-data{
      display: flex;
      flex-direction: column;
      justify-content: center;
      .number{
        color: #201a98;
        font: 24px 'Roboto', Arial, serif;
        text-align: center;
      }
      .money {
        width: 200px;
        height: 40px;
        font: 24px 'Roboto', Arial, serif;
        line-height: 37px;
        margin: 10px auto 0;
        text-align: center;
        background-color: #ffb03e;
        color:#fff;
        border-radius: 24px;
      }
    }
  }
}
</style>
