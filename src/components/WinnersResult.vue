<template>
  <div>
    <div class='no-winner-result' v-if='!hasWinner'>
      <img src="../assets/images/no-winners.png" alt="" class="no-winner-result__title">
      <p class= 'no-winner-result__bonus'>$10000</p>
      <p class='no-winner-result__tip'>The prize rolls over to the next game</p>
    </div>
    <div class="has-winner-result" v-else>
      <p class="has-winner-result__title">
        156 Winners!
      </p>
      <div class="has-winner-result-wrap">
        <div class="has-winner-result-top">
          <div class="has-winner-result-top-item"
            :class="{'left': +idx === 0, 'middle': +idx === 1}"
            v-for="(col, idx) in respondenceList"
            :key="idx"
            v-if="+idx < 3">
            <img :src="col.img" alt="" class="has-winner-result-top-item__icon">
            <p class="has-winner-result-top-item__nickname">{{col.nickname}}</p>
            <p class="has-winner-result-top-item__bonus">${{col.bonus}}</p>
          </div>
        </div>
        <div class="has-winner-result-top">
          <div
          class="has-winner-result-top-item"
          :class="{'left': +idx === 3, 'middle': +idx === 4}"
          v-for="(col, idx) in respondenceList"
          :key="idx"
          v-if="+idx >= 3 && +idx < 6">
            <img :src="col.img" alt="" class="has-winner-result-top-item__icon">
            <p class="has-winner-result-top-item__nickname">{{col.nickname}}</p>
            <p class="has-winner-result-top-item__bonus">${{col.bonus}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import testData from '../assets/js/testData'
export default {
  name: 'NoWinnersResult',
  data () {
    return {
      hasWinner: true,
      respondenceList: []
    }
  },
  computed: {
    ...mapGetters({
      exampleState: 'exampleState'
    })
  },
  mounted () {
    setTimeout(() => {
      this.respondenceList = testData.respondenceResult
    }, 500)
    this.fetch()
  },
  methods: {
    fetch () {
      this.$store.dispatch('fetch')
    }
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
    &__title {
        width: 560px;
        margin: 56px 0 218px 0px;
    }
    &__bonus {
        font-size: 114px;
        margin-bottom: 32px;
        font-family: 'Roboto-Condensed';
    }
    &__tip {
        font-size: 28px;
        font-family: 'Roboto-Light';
    }
}
.has-winner-result {
  &__title {
    width: 560px;
    height: 102.58px;
    margin: 56px 0 83px 0px;
    font-size: 50px;
    line-height: 94px;
    background: url('../assets/images/has-winners-title.png') no-repeat left top;
    background-size: contain;
    text-align: center;
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
  height: 203px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto Medium';
  &__icon {
    width: 130px;
    border-radius: 50%;
  }
  &__nickname {
    font-size: 30px;
    color: #fff;
    margin: 10px 0;
  }
  &__bonus {
    font-size: 26px;
    color: #ffb227;
    font-weight: 600;
  }

}
</style>
