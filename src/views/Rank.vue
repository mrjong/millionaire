<template>
  <div class="rank flex-box">
    <header class="flex-box flex-justify-center flex-align-center">
      <button class="back iconfont icon-fanhui" @click="back">
      </button>
      <section class="tab-week" :class="{selected: mode === 'week'}" @click="mode='week'">Weekly Rank</section>
      <section class="tab-total" :class="{selected: mode === 'total'}" @click="mode='total'">All Time</section>
    </header>
    <!-- 前三名 -->
    <div class="topThree flex-box" v-if="rankInfo[mode].cache">
      <section class="second">
        <div v-if="rankInfo[mode].list[1]">
          <img class="avatar" :src="rankInfo[mode].list[1].upic" alt="">
          <img class="decorate" src="../assets/images/rank-second.png" alt="">
          <p class="name ellipsis-1">{{rankInfo[mode].list[1].nick}}</p>
          <p class="money">{{currencyType}}{{rankInfo[mode].list[1].amount}}</p>
        </div>
      </section>
      <section class="first" >
        <div v-if="rankInfo[mode].list[0]">
          <img class="avatar" :src="rankInfo[mode].list[0].upic" alt="">
          <img class="decorate" src="../assets/images/rank-first.png" alt="">
          <p class="name ellipsis-1">{{rankInfo[mode].list[0].nick}}</p>
          <p class="money">{{currencyType}}{{rankInfo[mode].list[0].amount}}</p>
        </div>
      </section>
      <section class="third" >
        <div v-if="rankInfo[mode].list[2]">
          <img class="avatar" :src="rankInfo[mode].list[2].upic" alt="">
          <img class="decorate" src="../assets/images/rank-third.png" alt="">
          <p class="name ellipsis-1">{{rankInfo[mode].list[2].nick}}</p>
          <p class="money">{{currencyType}}{{rankInfo[mode].list[2].amount}}</p>
        </div>
      </section>
    </div>
    <section class="triangle" v-if="rankInfo[mode].cache && rankInfo[mode].list.length > 3"></section>
    <div class="rank-items" v-if="rankInfo[mode].cache && rankInfo[mode].list.length > 3">
      <rank-item v-for="(item, index) in rankInfo[mode].list.slice(3)" :key="index" :avatar="item.upic" :amount="item.amount" :rank="item.rank" :name="item.nick">
      </rank-item>
    </div>
    <!-- 自己的排名 -->
    <rank-item class="myrank" v-if="rankInfo[mode].cache" :avatar="rankInfo[mode].self.upic" :amount="rankInfo[mode].self.amount" :rank="rankInfo[mode].self.rank" :name="rankInfo[mode].self.nick" :isSelf="true" :isInList="!!rankInfo[mode].self.inboard"></rank-item>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import rankItem from '../components/RankItem'
import {mapGetters} from 'vuex'
import { RANK_UPDATE } from '../store/type'
import loading from '../components/loading'
import utils from '../assets/js/utils'
export default {
  name: 'RankList',
  data () {
    return {
      mode: 'week', // 当前选中项 week为周榜 total为总榜
      loading: false
    }
  },
  computed: {
    ...mapGetters(['rankInfo', 'currencyType'])
  },
  mounted () {
    utils.statistic('wait_page', 0)
  },
  components: {
    'rank-item': rankItem,
    loading
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    getRank () {
      const {mode} = this
      this.loading = true
      this.$store.dispatch(RANK_UPDATE, mode).then(() => {
        this.loading = false
      }, (err) => {
        // TODO: 提示错误
        this.loading = false
        console.log(err)
      })
    }
  },
  created () {
    this.getRank()
  },
  watch: {
    mode () {
      this.getRank()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .rank {
    width: 100%;
    height: 100%;
    background: url('../assets/images/rank-bg.jpg') top no-repeat;
    background-size: cover;
    flex-direction: column;
    position: relative;

    header {
      height: 51.5px;
      position: relative;
      margin: 3.7% 3.7% 10.8333%;
      .back {
        width: 51.5px;
        height: 51.5px;
        border: none;
        border-radius: 51.5px;
        background-color: #3e3966;
        font-size: 24.67px;
        line-height: 51.5px;
        padding: 0;
        padding-right: 2px;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
        outline: none;
      }

      section {
        font: normal 28px "Roboto Light";
        color: #a6a5b2;
        position: relative;
      }

      .tab-week {
        margin-right: 30px;
      }

      .tab-total {
        margin-left: 30px;
      }

      .selected {
        font: normal 35.64px "Roboto Medium";
        color: #fff;
      }

      .selected:after {
        content: '';
        width: 50%;
        height: 8px;
        border-radius: 8px;
        background-color: #ffb227;
        position: absolute;
        bottom: -21px;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .topThree {
      margin: 0 3.7% 7%;
      align-items: flex-end;
      justify-content: space-between;
      section {
        width: 183px;
        text-align: center;
        position: relative;
        .avatar {
          width: 144px;
          height: 144px;
          border-radius: 144px;
          display: inline-block;
          margin-bottom: 40px;
        }

        .decorate {
          width: 100%;
          position: absolute;
          top: 105px;
        }
        .name {
          font: normal 24px "Roboto-Light";
          max-width: 180px;
          color: #fff;
        }
        .money {
          font: bold 24px/2.1 "Myriad Pro Regular";
          color: #ffb227;
        }
      }
      .first {
        width: 217px;
        .avatar {
          width: 170px;
          height: 170px;
          border-radius: 170px;
        }
        .name,.money {
          font-size: 28px;
        }
        .name {
          max-width: 220px;
        }
        .decorate {
          top: 124px;
        }
      }
    }

    .triangle {
      width: 100%;
      height: 0;
      border-bottom: 29px solid rgba(255, 255, 255, .95);
      border-right: 720px solid transparent;
    }

    .rank-items {
      width: 100%;
      height: 56.4%;
      overflow: auto;
      background-color: rgba(255, 255, 255, .95);
      padding-bottom: 90px;
      flex: 1;
    }

    .myrank {
      position: fixed;
      bottom: 0;
    }
  }
</style>
