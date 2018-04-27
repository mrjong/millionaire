<template>
  <div class="notices">
    <img src="../assets/images/notices-title.png" alt="" class="title">
    <!-- 排行榜前三名 -->
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
    <!-- 获胜者列表  -->
    <transition-group class="winner-list" name="winner-list" tag="div">
      <p class="winner ellipsis-1" v-for="(item, index) in list" :key="index">
        {{item.content}} won {{currencyType}}<span style="font-family: 'Roboto Condensed', 'Roboto', Arial, serif;">{{item.award}}</span>
      </p>
    </transition-group>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import { RANK_UPDATE } from '../store/type'
import { getWinnerList } from '../assets/js/api'
let timer = null
export default {
  name: 'Notices',
  data () {
    return {
      mode: 'total',
      listSize: 5,
      winnerList: [],
      list: []
    }
  },
  computed: {
    ...mapGetters(['rankInfo', 'currencyType'])
  },
  created () {
    this.getRank()
    this.getList()
  },
  beforeDestroy () {
    clearInterval(timer)
  },
  methods: {
    getRank () {
      this.$store.dispatch(RANK_UPDATE, this.mode)
    },
    /**
     * 拉取列表
     */
    getList () {
      getWinnerList().then(({data}) => {
        if (+data.result === 1 && +data.code === 0) {
          this.winnerList = data.data || []
          this.swiper()
        } else {
          console.log('获取winner列表失败:', data.msg)
        }
      }, (err) => {
        console.log('获取winner列表出错:', err)
      })
    },
    /**
     * 轮播
     */
    swiper () {
      const {listSize, winnerList} = this
      let pointer = listSize
      this.list = this.winnerList.slice(pointer - listSize, pointer)
      if (winnerList.length > pointer) {
        timer = setInterval(() => {
          pointer++
          if (pointer >= winnerList.length) {
            pointer = 0
          }
          this.list.shift()
          this.$nextTick(() => {
            this.list.push(winnerList[pointer])
          })
        }, 3000)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .notices {
    width: 670px;
    height: 670px;
    margin: 26px;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid #3e407d;
    border-radius: 20px;
    padding-bottom: 30px;
    .title {
      width: 514px;
      margin: 40px auto 53px;
    }
    .topThree {
      width: 533px;
      min-height: 195px;
      margin: 0 auto;
      align-items: flex-end;
      justify-content: space-between;
      section {
        width: 128px;
        text-align: center;
        position: relative;
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 100px;
          display: inline-block;
          margin-bottom: 29px;
        }

        .decorate {
          width: 100%;
          position: absolute;
          top: 73px;
        }
        .name {
          font: 700 20px 'Roboto Condensed', Arial, serif;
          max-width: 180px;
          color: #000;
        }
        .money {
          font: 400 20px/2.1 'Roboto Condensed', Arial, serif;
          color: #ffb227;
        }
      }
      .first {
        width: 153px;
        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 120px;
        }
        .name,.money {
          font-size: 24px;
        }
        .name {
          max-width: 155px;
        }
        .decorate {
          top: 87px;
        }
      }
    }
    .winner-list {
      margin: 30px 51px 0;
      .winner {
        font: 400 24px 'Roboto', Arial, serif;
        color: #b7833a;
      }

      .winner+.winner {
        margin-top: 24px;
      }
    }
  }

  .winner-list-enter-active, .winner-list-leave-active {
    transition: all 1s;
  }
  .winner-list-enter, .winner-list-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
</style>
