<template>
  <div>
    <div class="team-battle-result" v-if="teamIsValid && teamIsWin">
      <div class="has-winner-result">
        <p class="has-winner-result__title">
          {{$t('winnersResult.team_win_title')}}
        </p>
        <div class="has-winner-result-wrap">
          <div class="has-winner-result-top">
            <div class="has-winner-result-top-item"
              :class="{'left': +idx === 0, 'middle': +idx === 1}"
              v-for="(col, idx) in teamRewardList"
              :key="col.userId"
              v-if="+idx < 3">
              <div class="captain bg-cover" v-if="col.isLearder === 1" v-webp.bg="`url('crown-icon.png?w=37&h=53')`"></div>
              <div class="has-winner-result-top-item__avatar-wrap">
                <img :src="col.avatar" alt="" class="has-winner-result-top-item__icon">
                <div class="rate">x{{col.multiple}}</div>
              </div>
              <p class="has-winner-result-top-item__nickname">{{col.name}}</p>
              <p class="has-winner-result-top-item__bonus">{{currencyType}}{{col.amount}}</p>
            </div>
          </div>
          <div class="has-winner-result-top">
            <div
            class="has-winner-result-top-item"
            :class="{'left': +idx === 3, 'middle': +idx === 4}"
            v-for="(col, idx) in teamRewardList"
            :key="col.userId"
            v-if="+idx >= 3 && +idx < 6">
              <div class="captain bg-cover" v-if="col.isLearder === 1" v-webp.bg="`url('crown-icon.png?w=37&h=53')`"></div>
              <div class="has-winner-result-top-item__avatar-wrap">
                <img :src="col.avatar" alt="" class="has-winner-result-top-item__icon">
                <div class="rate">x{{col.multiple}}</div>
              </div>
              <p class="has-winner-result-top-item__nickname">{{col.name}}</p>
              <p class="has-winner-result-top-item__bonus">{{currencyType}}{{col.amount}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ordinary-result" v-else>
      <div class='no-winner-result' v-if='!respondence.winners.length'>
        <div class="no-winner-result__title">
          <img src="../assets/images/no-winners.png" alt="" >
          <p class="no-winner-result__title__text">{{$t('winnersResult.no_winner')}}</p>
        </div>
        <p class= 'no-winner-result__bonus'>{{currencyType}}{{respondence.bonusAmount}}</p>
        <p class='no-winner-result__tip'>{{$t('winnersResult.result_tip')}}</p>
      </div>
      <div class="has-winner-result" v-else>
        <p class="has-winner-result__title" v-if="!isWon">
          <span class="has-winner-result__title__count">{{respondence.winnerAmount}}</span>{{$t('winnersResult.title1')}}
        </p>
        <p class="has-winner-result__title" v-else>
          {{$t('winnersResult.title2')}}
          <b>{{$t('winnersResult.hint',{winnerAmount: respondence.winnerAmount})}}</b>
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
    <!-- <balance-mark v-if="markInfo.showMark" :data-info="markInfo" @okEvent='okEvent' @cancelEvent = 'cancelEvent'></balance-mark> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BalanceMark from './BalanceMark'
import * as api from '../assets/js/api.js'

export default {
  name: 'NoWinnersResult',
  data () {
    return {
      teamRewardList: []
    }
  },
  components: {
    BalanceMark
  },
  computed: {
    ...mapGetters({
      respondence: 'result',
      currencyType: 'currencyType',
      watchingMode: 'watchingMode',
      userInfo: 'userInfo',
      code: 'code',
      isWon: 'isWon',
      teamIsValid: 'teamIsValid',
      teamIsWin: 'teamIsWin'
    })
  },
  mounted () {
    api.queryTeamReward().then(({data}) => {
      if (data.result === 1 && data.code === 0) {
        const result = data.data
        if (result.success && result.records) {
          let list = result.records.map((item) => {
            const obj = {}
            obj.userId = item.uid
            obj.multiple = item.multiple
            obj.amount = item.amount
            obj.isLearder = item.isLearder
            obj.name = item.um
            obj.avatar = item.up
            return obj
          })
          this.teamRewardList = list
        }
      } else {
        console.log('获取团队奖励失败原因' + data.msg, '获取团队奖励失败错误码' + data.code)
      }
    })
  }
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
      position: relative;
      img{
        width: 100%;
      }
      &__text {
        width: 100%;
        height: 100px;
        font: 60px 'Roboto Condensed', Arial, serif;
        line-height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
      }
    }
    &__bonus {
      margin-bottom: 32px;
      font: 700 114px 'Roboto Condensed', Arial, serif;
      color:#fbc222;
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
  // overflow: hidden;
  .left {
    margin-top: 30px;
  }
  .middle {
    margin: 55px 0 0 40px;
  }
}
.has-winner-result-top-item {
  position: relative;
  width: auto;
  max-width: 160px;
  height: 203px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto';
  font-weight: 500;
  .captain {
    position: absolute;
    top: -18px;
    right: 24px;
    width: 32px;
    height: 30px;
    transform: scale(1.4);
    z-index: 20;
  }
  &__avatar-wrap {
    position: relative;
    width: 130px;
    height: 130px;
    overflow: hidden;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
    }
    .rate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 33px;
      background-color: #ffb227;
      color: #fff;
      z-index: 10;
      font-size: 28px;
      text-align: center;
    }
  }
  &__icon {
    width: 130px;
    height: 130px;
    border-radius: 100%;
  }
  &__nickname {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
