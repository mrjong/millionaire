<template>
  <div class="bouns" v-if="!isClose && hasBounsBox" style="z-index: 9999">
    <span class="bouns__close iconfont icon-cuowu" @click="close"></span>
    <p class="important ">{{bounsData[bounsType].title}}</p>
    <p class="bouns__text" v-if="bounsType !== 1">{{bounsData[bounsType].desp}}</p>
    <p class="bouns__text" v-else>{{$t('bounsTip[1].desp', {currencyType: this.userInfo.currencyType, money: this.money})}}</p>
    <div class="bouns__img" v-if="bounsType !== 4">
      <img src="../assets/images/light.png" class="bg-light" v-if="bounsType === 2">
      <img src="../assets/images/countdown-light.png" class="bg-light" v-else-if="bounsType === 1 || bounsType === 3">
      <img :src="`./static/images/bouns-${bounsType}.png`" class="lives">
    </div>
    <div class="bouns__btn" @click="toShareDetail" v-if="bounsType !== 4">{{bounsData[bounsType].btnText}}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as type from '../store/type'
import * as api from '../assets/js/api'
export default {
  name: 'BounsTip',
  props: {
  },
  data () {
    return {
      isClose: false,
      FirstGuide: false,
      isAnswered: false,
      bounsData: this.$t('bounsTip'),
      bounsType: 3,
      money: 0
    }
  },
  computed: {
    ...mapGetters({
      status: 'status',
      questionStatus: 'question_status',
      isUserGame: 'isUserGame',
      hasBounsBox: 'hasBounsBox',
      bounsBoxId: 'bounsBoxId',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    utils.statistic('treasure_box_page', 0)
  },
  methods: {
    close () {
      this.isClose = true
      this.$store.commit(type._UPDATE, {
        hasBounsBox: false
      })
    },
    toShareDetail () {
      if (this.bounsType === 3) {
        api.getBounsBox(this.bounsBoxId).then(({data}) => {
          if (data.result === 1 && data.code === 0 && data.data.success) {
            this.bounsType = data.data.boxType
            if (data.data.boxType === 1 && data.data.money) {
              this.money = data.data.money
            }
          } else {
            // 开箱失败
            this.bounsType = 4
          }
        }).catch(
          this.bounsType = 4
        )
        return false
      } else if (this.bounsType === 2) {
        this.isClose = true
        this.$store.commit(type._UPDATE, {
          hasBounsBox: false
        })
        this.$router.replace({path: '/share-detail'})
      } else {
        this.isClose = true
        this.$store.commit(type._UPDATE, {
          hasBounsBox: false
        })
        this.$router.replace({path: '/invite'})
      }
      const btn = this.bounsType === 3 ? 'open_button' : (this.bounsType === 0 ? 'earn_money_button' : (this.bounsType === 1 ? 'earn_money_button' : 'get_life_button'))
      utils.statistic(btn, 1)
    }
  },
  watch: {
    bounsType (type) {
      if (type === 0) {
        utils.statistic('treasure_empty_page', 0)
      } else if (type === 1) {
        utils.statistic('treasure_cash_page', 0)
      } else if (type === 2) {
        utils.statistic('treasure_life_page', 0)
      }
    },
    status (status) {
      if (status === 1) {
        this.$store.commit(type._UPDATE, {
          hasBounsBox: false
        })
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .bouns {
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 111;
    background-color: rgba(0, 0, 0, 0.9);
    overflow: auto;
    &__close{
      position: absolute;
      top: 24px;
      right: 24px;;
      width: 50px;
      height: 50px;
      background-color:  rgba(255, 255, 255, 0.7);
      font-size: 26px;
      border-radius: 50%;
      line-height: 50px;
      text-align: center;
      color:#443575;
      font-weight: bold;
    }
    .important{
      color: #ffdd00;
      font: 53px 'Roboto', Arial, serif;
      font-weight: bold;
      margin: 150px 0 40px;
      text-align: center;
      line-height: 70px;
    }
    &__text{
      color: #ffdd00;
      font: 42px 'Roboto', Arial, serif;
      line-height: 45px;
      margin-bottom: 20px;
      text-align: center;
    }
    &__img{
      width: 80%;
      width: 500px;
      height: 500px;
      position: relative;
      margin: 50px auto;
      display: flex;
      align-items: center;
      .bg-light{
        width: 500px;
        height: 500px;
        position: absolute;
        margin: 0 auto 0;
        transform-origin: center center;
        animation: light 1s linear infinite
      }
      .lives{
        width:300px;
        position: relative;
        z-index: 11;
        background-size: cover;
        margin: 45px auto 0;
      }
    }
    &__btn{
      position: absolute;
      bottom: 150px;
      left: 50%;
      transform: translate(-50%, 0);
      color: #fff;
      font: 32px 'Roboto', Arial, serif;
      max-width:100%;
      width: 483px;
      height: 94px;
      background-color: #faa729;
      text-align: center;
      line-height: 94px;
      border-radius: 46px;
      margin: 50px auto 0;
      display: flex;
      justify-content: center;
    }
  }
  @media screen and (max-width: 321px){
    .bouns {
      &__close{
        font-size: 22px;
      }
      &__text{
        font-size: 40px;
        line-height: 45px;
        margin-bottom: 10px;
      }
      &__img{
        .light{
          max-width: 60%;
          width:500px;
          min-height: 300px;
          margin: 0 auto;
        }
        .lives{
          width:250px;
        }
      }
      &__btn{
        bottom: 100px;
      }
      .important{
        font-size: 56px;
        margin: 100px 0 35px;
        line-height: 70px;
      }
    }
  }
  @keyframes light {
  0%{
    opacity: 1;
  }
  50%{
    opacity: 0.6;
  }
  100%{
    opacity:1;
  }
}
</style>
