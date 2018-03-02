<template>
  <div class="rank flex-box">
    <header class="flex-box flex-justify-center flex-align-center">
      <button class="back iconfont icon-fanhui" @click="back">
      </button>
      <section class="tab-week" :class="{selected: mode === 'week'}" @click="mode='week'">This week</section>
      <section class="tab-total" :class="{selected: mode === 'total'}" @click="mode='total'">The total list</section>
    </header>
    <div class="topThree flex-box">
      <section class="second">
        <img class="avatar" src="http://images.apusapps.com/src/icon-apus-user-system.png" alt="">
        <img class="decorate" src="../assets/images/rank-second.png" alt="">
        <p class="name">zhangpanpan</p>
        <p class="money">$155.36</p>
      </section>
      <section class="first">
        <img class="avatar" src="http://images.apusapps.com/src/icon-apus-user-system.png" alt="">
        <img class="decorate" src="../assets/images/rank-first.png" alt="">
        <p class="name">zhangpanpan</p>
        <p class="money">$155.36</p>
      </section>
      <section class="three">
        <img class="avatar" src="http://images.apusapps.com/src/icon-apus-user-system.png" alt="">
        <img class="decorate" src="../assets/images/rank-third.png" alt="">
        <p class="name">zhangpanpan</p>
        <p class="money">$155.36</p>
      </section>
    </div>
    <section class="triangle"></section>
    <div class="rank-items">
      <rank-item v-for="(val, key) in 10" :key="key">
      </rank-item>
    </div>
    <rank-item class="self" :isSelf="true" :isInList="false"></rank-item>
  </div>
</template>

<script>
import rankItem from '../components/RankItem'
export default {
  name: 'RankList',
  data () {
    return {
      mode: 'week'
    }
  },
  components: {
    'rank-item': rankItem
  },
  methods: {
    back () {
      this.$router.go(-1)
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
          width: 78.54%;
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
          color: #fff;
        }
        .money {
          font: bold 24px/2.1 "Myriad Pro Regular";
          color: #ffb227;
        }
      }
      .first {
        width: 217px;
        .name,.money {
          font-size: 28px;
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

    .self {
      position: fixed;
      bottom: 0;
    }
  }
</style>
