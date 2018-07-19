<template>
  <div class="bouns" v-if="!isClose || hasBounsBox">
    <span class="bouns__close iconfont icon-cuowu" @click="close"></span>
    <p class="important ">{{bounsData[bounsType].title}}</p>
    <p class="bouns__text">{{bounsData[bounsType].desp}}</p>
    <div class="bouns__img">
      <img src="../assets/images/light.png" class="bg-light" v-if="bounsType === 2">
      <img src="../assets/images/countdown-light.png" class="bg-light" v-else>
      <img :src="'../assets/images/bouns-' + bounsType + '.png'" class="lives">
    </div>
    <div class="bouns__btn" @click="toShareDetail">{{bounsData[bounsType].btnText}}</div>
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
      bounsData: [
        {
          title: 'opps !',
          desp: ' The treasure chest is empty! ',
          btnText: 'Invite & earn'
        },
        {
          title: 'Congrats !',
          desp: '',
          btnText: 'Get cash'
        },
        {
          title: 'Congrats !',
          desp: ' Get an extra life !',
          btnText: 'Get extra life'
        },
        {
          title: 'Wow ! ',
          desp: 'You received a treasure chest!',
          btnText: 'Open Now'
        }
      ],
      bounsType: 3
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
    utils.statistic('referral_code_guide', 0)
  },
  methods: {
    close () {
      this.isClose = true
      this.$store.commit(type._UPDATE, {
        hasBounsBox: false
      })
    },
    toShareDetail () {
      this.isClose = true
      if (this.bounsType === 3) {
        this.$store.commit(type._UPDATE, {
          hasBounsBox: false
        })
        api.getBounsBox(this.bounsBoxId).then(({data}) => {
          // 处理宝箱类型
          if (data.result === 1 && data.code === 0 && data.success) {
            data.boxType = this.bounsData
            if (data.boxType === 1) {
              this.bounsData.desp = 'Get reward ' + this.userInfo.currencyType + data.money + '!'
            }
          } else {
            // 开箱失败
          }
        }).catch()
      } else if (this.bounsType === 2) {
        this.$router.replace({path: '/share-detail'})
      } else {
        this.$router.replace({path: '/invite'})
      }
      utils.statistic('get_life_button', 1, {to_destination_s: 'task_page'}, 'wait_page')
    }
  },
  watch: {
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
      font-size: 53px;
      font-weight: bold;
      margin: 150px 0 40px;
      text-align: center;
      line-height: 70px;
    }
    &__text{
      color: #ffdd00;
      font-size: 42px;
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
        animation: light 2s linear infinite
      }
      .lives{
        width:200px;
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
      font-size: 32px;
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
          width:150px;
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
