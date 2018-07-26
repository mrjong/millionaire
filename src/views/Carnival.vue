<template>
  <div class="carnival" v-webp.bg="`url('${$i18n.locale === 'hi'? 'carnival-hi-bg-2.jpg' :'carnival-bg.jpg'}')`">
    <div class="top">
      <p class="header" @click="goBack">
        <span class="iconfont icon-fanhui"></span>
      </p>
    </div>
    <div class="carnival__content" v-webp.bg="`url('carnival-text-bg.png')`">
      <!-- <img v-webp="'carnival-text-bg.png'" class="carnival-text-bg.png"> -->
      <p class="text" v-for="i in $t('carnival.text')" :key="i" v-html="i"></p>
    </div>
    <p class="data">{{$t('carnival.date')}}</p>
    <div class="btn">
        <p class="btn__invite" @click="share" v-webp.bg="`url('carnival-btn.png')`">
          <span class="btn__invite__text">{{$t('carnival.btn')}}</span>
        </p>
      </div>
    <revive-card :shareConent="shareConent" :reviveObj="reviveObj" @shareClose="shareClose"></revive-card>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
import ReviveCard from '../components/ReviveCard'
import BalanceMark from '../components/BalanceMark'
export default {
  name: 'ShareDetail',
  data () {
    return {
      code: '',
      reviveObj: {
        code: '',
        isShare: false,
        title: this.$t('carnival.share_tip_title'),
        hint: this.$t('carnival.share_tip_hint')
      },
      dialogInfo: {
        htmlTitle: '',
        htmlText: '',
        okBtnText: this.$t('await.referral_code_pop.ok')
      },
      shareConent: {
        title: this.$t('carnival.share_title'),
        desp: this.$t('carnival.share_desp')
      },
      showDialog: false
    }
  },
  mounted () {
    utils.statistic('quiz_carnival_page', 0)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    share () {
      utils.statistic('referral_code_invite', 1)
      this.reviveObj.isShare = true
      this.reviveObj.type = 'carnival'
    },
    // 弹框ok
    okEvent (a, b) {
      this.showDialog = false
    },
    shareClose () {
      this.reviveObj.isShare = false
    }
  },
  components: {
    ReviveCard,
    BalanceMark
  }
}
</script>
<style lang="less" type="text/less">
.carnival {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: url("../assets/images/set-question-bg.jpg") no-repeat top;
  background-size: cover;
  color: #241262;
  .top{
    display: flex;
    margin: 24px 0;
    width: 100%;
    height: 54px;
    align-items: center;
    .header {
      width: 54px;
      height: 54px;
      background: rgba(157,52,189,0.5);
      border-radius: 50%;
      align-self: flex-start;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 38px;
      span {
        font-size: 28px;
        transform: translate(-2px, 0px);
      }
    }
  }
  &__content{
    width: 613px;
    height: 460px;
    position: relative;
    padding: 50px 25px 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin: 475px auto 25px;
    .carnival-text-bg{
      position: absolute;
      top: 0;
      left: 0;
      width: 613px;
      min-height: 200px;
      margin: 30px auto 20px;
    }
    .text{
      font-family: "Roboto";
      font-size: 28px;
      text-align: left;
      margin-bottom: 20px;
      color: #fff;
      line-height: 30px;
      position: relative;
      padding-left: 25px;
      line-height: 30px;
      .circle{
        position: absolute;
        top: 8px;
        left: 0;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #ffd100;
      }
      .light{
        color: #ffd100;
      }
    }
    .code{
      font-size: 32px;
      font-family: "Roboto";
      font-weight: 300;
      text-align: center;
      margin-top: 100px;
      span{
        font-weight: 500;
        font-size: 48px;
        color:#e03c79
      }
    }
  }
  .data{
    font: 600 32px 'Roboto', Arial, serif;
    color: #fff;
    text-align: center;
  }
  .btn{
    &__invite{
      width: 543px;
      height: 94px;
      line-height: 94px;
      display: flex;
      justify-content: center;
      color: #fff;
      border-radius: 46px;
      font-size: 32px;
      font-family: "Roboto-Regular";
      margin: 40px auto;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
}

</style>
