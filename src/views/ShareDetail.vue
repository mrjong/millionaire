<template>
  <div class="share-detail">
    <div class="top">
      <p class="header" @click="goBack">
        <span class="iconfont icon-fanhui"></span>
      </p>
      <p class="title">{{$t('shareDetail.title')}}</p>
    </div>
    <div class="share-detail-content">
      <img src="../assets/images/share-live.png" class="share-lives">
      <p class="text">{{$t('shareDetail.describe1')}}</p>
      <p class="text">{{$t('shareDetail.describe2')}}</p>
      <p class="code">{{$t('shareDetail.text')}}<span>{{code}}</span></p>
      <div class="btn">
        <p class="btn__invite" @click="share">
          <span class="btn__invite__icon"></span>
          <span class="btn__invite__text">{{$t('shareDetail.share_btn')}}</span>
        </p>
      </div>
    </div>
    <revive-card :reviveObj="reviveObj" @callbackFailed="callbackFailed" @shareClose="shareClose"></revive-card>
    <balance-mark v-if="showDialog" :data-info="dialogInfo" @okEvent='okEvent'>
    </balance-mark>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
import ReviveCard from '../components/ReviveCard'
import BalanceMark from '../components/BalanceMark'
import * as api from '../assets/js/api'
export default {
  name: 'ShareDetail',
  data () {
    return {
      code: '',
      reviveObj: {
        code: '',
        isShare: false
      },
      dialogInfo: {
        htmlTitle: '',
        htmlText: '',
        okBtnText: this.$t('await.referral_code_pop.ok')
      },
      showDialog: false
    }
  },
  mounted () {
    utils.statistic('referral_code_page', 0)
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    } else {
      this.getCode()
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    share () {
      utils.statistic('referral_code_invite', 1)
      this.reviveObj.code = this.code
      this.reviveObj.isShare = true
    },
    getCode () {
      api.generateCode().then(({data}) => {
        if (data.result === 1) {
          this.code = data.data
        }
      })
    },
    // 弹框ok
    okEvent (a, b) {
      this.showDialog = false
    },
    callbackFailed () {
      this.dialogInfo.htmlText = this.$t('await.remider_pop.case3')
      this.showDialog = true
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
<style scoped lang="less" type="text/less">
.share-detail {
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
      background: #241262;
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
    .title{
      width: 100%;
      text-align: center;
      font-size: 36px;
      color: #241262;
      font-family: "Roboto";
    }
  }
  .share-detail-content{
    padding: 0 50px 0;
    .share-lives{
      width: 260px;
      min-height: 200px;
      margin: 30px auto 20px;
    }
    .text{
      font-family: "Roboto";
      font-size: 36px;
      text-align: left;
      margin-bottom: 20px;
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
  .btn{
    width: 100%;
    padding: 0 30px;
    &__share, &__invite{
      width: 100%;
      height: 94px;
      line-height: 94px;
      display: flex;
      justify-content: center;
      color: #fff;
      border-radius: 46px;
      font-size: 32px;
      font-family: "Roboto-Regular";
      &__icon{
        font-size: 32px;
        margin-right: 30px;
        align-self: center;
      }
    }
    &__share{
      background-color: #e03c79;
    }
    &__invite{
      background-color: #fda800;
      margin: .4rem 0 .25rem;
      &__icon{
        width: 40px;
        height:43px;
        background: url("../assets/images/invite-icon.png") no-repeat center;
        background-size: cover;
      }
    }
  }
}

</style>
