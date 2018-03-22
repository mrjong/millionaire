<template>
  <div>
    <div class='no-winner-result' v-if='!respondence.winners.length'>
      <img src="../assets/images/no-winners.png" alt="" class="no-winner-result__title">
      <p class= 'no-winner-result__bonus'>{{respondence.bonusAmount}}</p>
      <p class='no-winner-result__tip'>Prize rolls over to next game</p>
    </div>
    <div class="has-winner-result" v-else>
       <p class="has-winner-result__title" v-if="!isWon">
        <span class="has-winner-result__title__count">{{respondence.winnerAmount}}</span>Winners!
      </p>
      <p class="has-winner-result__title" v-else>
        You Won!
        <b>Congrats! {{respondence.winnerAmount}} winners in this game!</b>
      </p>
      <div class="has-winner-result-wrap">
        <div class="has-winner-result-top">
          <div class="has-winner-result-top-item"
            :class="{'left': +idx === 0, 'middle': +idx === 1}"
            v-for="(col, idx) in respondence.winners"
            :key="col.userId"
            v-if="+idx < 3">
            <img :src="col.avatar" alt="" class="has-winner-result-top-item__icon">
            <p class="has-winner-result-top-item__nickname">{{col.name}}</p>
            <p class="has-winner-result-top-item__bonus">{{currencyType}}{{col.bonusAmount}}</p>
          </div>
        </div>
        <div class="has-winner-result-top">
          <div
          class="has-winner-result-top-item"
          :class="{'left': +idx === 3, 'middle': +idx === 4}"
          v-for="(col, idx) in respondence.winners"
          :key="col.userId"
          v-if="+idx >= 3 && +idx < 6">
            <img :src="col.avatar" alt="" class="has-winner-result-top-item__icon">
            <p class="has-winner-result-top-item__nickname">{{col.name}}</p>
            <p class="has-winner-result-top-item__bonus">{{currencyType}}{{col.bonusAmount}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'NoWinnersResult',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      respondence: 'result',
      currencyType: 'currencyType',
      watchingMode: 'watchingMode',
      isWon: 'isWon'
    })
  },
  mounted () {},
  methods: {}
}
</script>
<style scoped lang="less" type="text/less">
.has-winner-result, .no-winner-result {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
.no-winner-result {
    height: 785px;
    &__title {
        width: 560px;
        margin: 56px 0 218px 0px;
    }
    &__bonus {
        margin-bottom: 32px;
        font: 700 114px 'Roboto Condensed', Arial, serif;
    }
    &__tip {
        font: 300 28px 'Roboto';
    }
}
.has-winner-result {
  &__title {
    width: 560px;
    height: 102.58px;
    margin: 56px 0 83px 0px;
    background: url('../assets/images/has-winners-title.png') no-repeat left top;
    background-size: contain;
    display: flex;
    justify-content: center;
    font: 400 50px/94px 'Roboto Condensed', Arial, serif;
    position: relative;
    b {
      display: block;
      font-weight: normal;
      position: absolute;
      width: 100%;
      font-size: 24px;
      top: 100px;
      left: 0px;
      text-align: center;
    }
    &__count {
      margin-right: 17px;
      display: inline-block;
      max-width: 159px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
    }
  }
}
.has-winner-result-wrap {
  width: 100%;
  padding: 0 88px;
}
.has-winner-result-top {
  width: 100%;
  height: 273px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  .left {
    margin-top: 30px;
  }
  .middle {
    margin: 55px 0 0 40px;
  }
}
.has-winner-result-top-item {
  width: auto;
  max-width: 160px;
  height: 203px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto';
  font-weight: 500;
  &__icon {
    width: 130px;
    height: 130px;
    border-radius: 130px;
  }
  &__nickname {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 30px;
    color: #fff;
    margin: 10px 0;
    text-align: center;
  }
  &__bonus {
    font-size: 26px;
    color: #ffb227;
    font-weight: 600;
  }
}
</style>
