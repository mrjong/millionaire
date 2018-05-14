<template>
  <div class="record">
    <div class="record__top" ref="recordTop">
      <div class="back"  @click="back">
        <p class="back__icon icon-fanhui iconfont"></p>
      </div>
      <p class="record__top__title">Withdrawal History</p>
    </div>
    <div class="record__wrap" ref="recordWrap" :style="{height:recordWrapHeight + 'px'}">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <div class="record__wrap__list" ref="recordList" v-if="balanceRecordList != '' &&!loading">
        <div class="record__wrap__list__item" v-for="(val, idx) in balanceRecordList" :key="idx">
          <div class="item-info1">
            <span class="title big">Cash out</span>
            <span class="money big" :class="{success: val.state === 'Success'}">{{userInfo.currencyType}}{{val.amountFmt}}</span>
          </div>
          <div class="item-info2">
            <span class="time small">{{val.createTime}}</span>
            <span class="status small">{{val.state}}</span>
          </div>
          <p class="hint" v-if="val.state === 'Failed'">
            Sorry,your apply for cash out was failed. Please check and submit again.
          </p>
        </div>
      </div>
      <div class="no-list"  :style="{height:recordWrapHeight + 'px'}" v-else-if="balanceRecordList && !loading">
        <img src="../assets/images/no-history.png" class="no-list__img">
        <p>No Withdrawal History</p>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as api from '../assets/js/api'
import loading from '../components/Loading'
export default {
  name: 'BalanceRecord',
  data () {
    return {
      pageNo: 1,
      balanceRecordList: [],
      isPost: 0,
      hasmore: true,
      statusText: [],
      start: '',
      move: '',
      end: '',
      recordWrapHeight: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    utils.statistic('withdrawal_history', 0, 'take_cash_page')
    this.computedHeight()
  },
  methods: {
    computedHeight () {
      const windowHeight = document.documentElement.clientHeight
      let recordTopHeight = this.$refs.recordTop.offsetHeight
      this.recordWrapHeight = windowHeight - recordTopHeight
      this.getBalanceRecord(1)
      this.touch()
    },
    back () {
      this.$router.go(-1)
    },
    getBalanceRecord (pageNo) {
      if (this.hasmore === false) {
        return false
      }
      this.loading = true
      api.balanceRecord(pageNo).then(({data}) => {
        this.loading = false
        console.log('提现记录' + data)
        if (data.result === 0) {
          this.hasmore = data.data.hasmore
          data.data.recordData.forEach((val, idx) => {
            this.statusText.push((val.state === 0 ? 'Withdrawing' : (val.state === 1 ? 'Approved' : (val.state === 2 ? 'Failed' : 'success'))))
            val.state = (val.state === 0 ? 'Withdrawing' : (val.state === 1 ? 'Approved' : (val.state === 2 ? 'Failed' : 'Success')))
            this.balanceRecordList.push(val)
          })
          this.pageNo += 1
        } else {
          // 请求失败
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    touch () {
      let yStart = 0
      let yEnd = 0
      let xStart = 0
      let xEnd = 0
      document.addEventListener('touchstart', this.start = (e) => {
        e.stopPropagation()
        let touches = e.touches[0]
        yStart = touches.clientY
        xStart = touches.clientX
      })
      document.addEventListener('touchmove', this.move = (e) => {
        e.stopPropagation()
        let touches = e.touches[0]
        yEnd = touches.clientY
        xEnd = touches.clientX
      })
      document.addEventListener('touchend', this.end = (e) => {
        let recordListHeight = this.$refs.recordList.offsetHeight
        let recordListScrollTop = this.$refs.recordList.scrollTop
        if ((Math.abs(xEnd - xStart) < Math.abs(yEnd - yStart)) && (yEnd - yStart) < 0) {
          console.log(yEnd - yStart)
          if ((this.recordWrapHeight > recordListHeight || (recordListScrollTop + this.recordWrapHeight > recordListHeight))) {
            this.getBalanceRecord(this.pageNo)
          }
        } else {
          return false
        }
      })
    }
  },
  beforeDestroy () {
    if (this.start) {
      document.removeEventListener('touchstart', this.start)
      this.start = ''
    }
    if (this.move) {
      document.removeEventListener('touchmove', this.move)
      this.move = ''
    }
    if (this.end) {
      document.removeEventListener('touchend', this.end)
      this.end = ''
    }
  },
  components: {
    loading
  }
}
</script>
<style scoped lang="less" type="text/less">
.record{
  width: 100%;
  min-height: 100%;
  background: url("../assets/images/set-question-bg.jpg") no-repeat top left;
  background-size: cover;
  color: #fff;
  background-color: #fff;
  &__top{
    width: 100%;
    position: relative;
    padding: 24px 30px 0;
    .back{
      width: 54px;
      height: 54px;
      background-color: rgb(36, 18, 98);
      border-radius: 50%;
      position: fixed;
      top: 24px;
      left: 30px;
      display: flex;
      justify-content: center;
      z-index: 111;
      &__icon{
        font-size: 28px;
        align-self: center;
        color: #fff;
        margin-left: -2px;
      }
    }
    &__title{
      height: 54px;
      line-height: 56px;
      padding-top: 5px;
      font: 500 36px 'Roboto Condensed',Arial,serif;
      color: #241262;
      text-align: center;
    }
  }
  &__wrap{
    height: 100%;
    position: relative;
    padding: 24px 30px 0;
    overflow-y: auto;
    &__list{
      margin-top: 26px;
      &__item{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-bottom: 0.5px solid rgba(36, 18, 98, 0.3);
        padding: 20px 0;
        .item-info1, .item-info2{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color:#241262;
          .big{
            font-size: 32px;
            font-family: "Roboto",Arial,serif;
          }
          .small{
            font-size: 24px;
            font-weight: 300;
            font-family: "Roboto",Arial,serif;
          }
        }
        .hint{
          font-size: 20px;
          color: #ee2d7a;
          margin-top: 20px;
          font-weight: 300;
          font-family: "Roboto",Arial,serif;
        }
        .success {
          color:#faab22;
        }
        .item-info1{
          margin-bottom: 20px;
        }
      }
    }
    .no-list{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &__img{
        width: 185px;
        align-self: center;
        margin-top: -100px;
      }
      p{
        color: #241262;
        font-size: 28px;
        font: 28px "Roboto",Arial,serif;
        margin-top: 40px;
      }
    }
  }
}
</style>
