<template>
  <div class="balance-detail">
    <div class="balance-detail__title">
      <p class="balance-detail__title__back iconfont icon-fanhui" @click="goBack"></p>
      <p class="balance-detail__title__nickname">{{$t('balanceDetail.title')}}</p>
    </div>
    <div class="balance-detail__info">
      <p class="balance-detail__info__title">{{$t('balanceDetail.withdraw_cash_text')}}</p>
      <p class="balance-detail__info__money">{{userInfo.currencyType}}{{userInfo.balanceShow}}</p>
    </div>
    <div class="balance-detail__operate">
      <p class="balance-detail__operate__wrap__input">
        <input type="text" class="balance-detail__operate__input" :placeholder="$t('balanceDetail.name')" maxlength="100" v-model="name">
      </p>
      <p class="balance-detail__operate__wrap__input">
        <input type="text" class="balance-detail__operate__input" :placeholder="$t('balanceDetail.p_number')" v-model="pan">
      </p>
      <p class="balance-detail__operate__wrap__input">
        <input type="number" class="balance-detail__operate__input" :placeholder="$t('balanceDetail.paytm')" v-model="myPay">
      </p>
      <p class="balance-detail__operate__wrap__hint">{{$t('balanceDetail.noitce')}}</p>
    </div>
    <div>
      <p :class="['balance-detail__operate__btn', {hide: isInputting}]" @click="cashOut">{{$t('balanceDetail.cash_out_btn')}}</p>
    </div>
    <policy-link :class="{hide: isInputting}"></policy-link>
    <balance-mark v-if="markInfo.showMark" :data-info="markInfo" @okEvent='okEvent' @cancelEvent = 'cancelEvent'></balance-mark>
    <loading v-if="showLoading"></loading>
    <ShareTipModal v-model="isShowShareTipModal" @close="isShowShareTipModal = false" @share="share"></ShareTipModal>
    <revive-card :reviveObj="reviveObj" @callbackFailed="callbackFailed" @shareClose="shareClose"></revive-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BalanceMark from '../components/BalanceMark'
import Loading from '../components/Loading'
import * as api from '../assets/js/api'
import * as type from '../store/type'
import utils from '../assets/js/utils'
import PolicyLink from '../components/PolicyLink'
import ShareTipModal from '../components/ShareTipModal'
import ReviveCard from '../components/ReviveCard'

export default {
  name: 'BalanceDetail',
  data () {
    return {
      reviveObj: {
        title: this.$t('receiveCard.invite_pop.text1'),
        hint: this.$t('receiveCard.invite_pop.text2'),
        isShare: false,
        type: 'balance'
      },
      isShowShareTipModal: false,
      myPay: '',
      name: '',
      pan: '',
      markInfo: {
        showMark: false,
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: this.$t('balanceDetail.balance_pop.ok')
      },
      withdraw: 150, // 可提现金额(按元展示，按分比较)
      showLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      isOnline: 'isOnline',
      isInputting: 'isInputting',
      code: 'code'
    })
  },
  mounted () {
    utils.statistic('cash__info__page', 0)
  },
  methods: {
    cashOut () {
      console.log()
      if (+this.userInfo.balance < (+this.withdraw) * 100) {
        this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.no_money', {currencyType: this.userInfo.currencyType, withdraw: this.withdraw}))
      } else {
        // const phone = /^(\+91[-\s]?)?[0]?(91)?[789]\d{10}$/
        const phone = /^[789]\d{9}$/
        const panRule = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/
        const nameRule = /^([A-Za-z]+\s?)*[A-Za-z]{1,64}$/
        const isNamePass = nameRule.test(this.name)
        const isPass = panRule.test(this.pan)
        const passRule = phone.test(this.myPay)
        if (!isNamePass) {
          this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.no_name'))
          return false
        }
        if (!isPass) {
          this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.no_p_number'))
          return false
        }
        if (!passRule) {
          this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.no_ptm'))
          return false
        } else {
          this.changeMarkInfo(true, true, 1, this.$t('balanceDetail.balance_pop.text', {myPay: this.myPay}))
        }
      }
    },
    okEvent (info) {
      this.markInfo.showMark = false
      let takeCash = ''
      if (info) {
        // 提交表单
        this.showLoading = true
        api.balanceApplication({
          amount: +this.userInfo.balance,
          email: '',
          accountId: this.myPay,
          name: this.name,
          pan: this.pan
        })
          .then(({data}) => {
            console.log('提现申请后台返回结果如下')
            console.log(data)
            this.showLoading = false
            if (+data.result === 1) { // 请求成功 code必为0
              if (+data.code === 0) {
                // this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.submit_success'))
                this.$store.dispatch(type._INIT)
                takeCash = 'success'
                this.isShowShareTipModal = true
              }
            } else { // 请求失败，判断code
              switch (+data.code) {
                case 3106: {
                  this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.submit_faild1'))
                  takeCash = 'bad_account'
                  break
                }
                case 3116: {
                  this.changeMarkInfo(true, false, 0, this.$t('balanceDetail.balance_pop.submit_faild2'))
                  takeCash = 'no_enough_money'
                  break
                }
                default: {
                  this.changeMarkInfo(true, false, 1, this.$t('balanceDetail.balance_pop.submit_faild3'), 'Retry')
                  takeCash = 'network_error'
                }
              }
            }
            utils.statistic('', 1, {
              result_code_s: takeCash
            })
          }, (error) => {
            this.changeMarkInfo(true, false, 1, this.$t('balanceDetail.balance_pop.submit_faild3'), 'Retry')
            takeCash = 'network_error'
            console.log('提现失败:', error)
            utils.statistic('', 1, {
              result_code_s: takeCash
            })
          })
      }
    },
    cancelEvent () {
      this.markInfo.showMark = false
    },
    goBack () {
      this.$router.go(-1)
    },
    changeMarkInfo (showMark, shouldSub, markType, htmlText, okBtnText) {
      const okBtnInnerText = okBtnText || this.$t('balanceDetail.balance_pop.ok')
      this.markInfo = {
        showMark: showMark,
        shouldSub: shouldSub,
        markType: markType, // 是否有cancel按钮
        htmlText: htmlText,
        okBtnText: okBtnInnerText
      }
    },
    callbackFailed () {
      this.markInfo.htmlText = 'Fail to submit, please try again later.'
      this.markInfo.showMark = true
    },
    shareClose () {
      this.reviveObj.isShare = false
    },
    share (data) {
      this.$router.push('invite')
      // this.reviveObj.isShare = data.isShare
      // this.reviveObj.code = this.code
    }
  },
  components: {
    BalanceMark,
    Loading,
    PolicyLink,
    ShareTipModal,
    ReviveCard
  }
}
</script>
<style scoped lang="less" type="text/less">
.balance-detail {
  width: 100%;
  height: 100%;
  background: url('../assets/images/balance-bg.jpg') no-repeat top left;
  background-size: cover;
  padding: 0 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  &__title {
    width: 100%;
    height: 54px;
    margin: 24px 0 60px 0;
    box-sizing: border-box;
    font: 500 28px 'Roboto', Arial, serif;
    color: #fff;
    display: flex;
    align-items: center;
    &__back {
      display: inline-block;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .2);
      font-size: 24px;
      text-align: center;
      line-height: 54px;
    }
    &__nickname {
      text-align: center;
      flex: 1;
      padding-right: 54px;
      font-size: 36px;
      font-family: 'Roboto', Arial, serif;
    }
  }
  &__info{
    color:#fff;
    &__title{
      font: 400 28px 'Roboto', Arial, serif;
    }
    &__money{
      font: 800 56px 'Roboto', Arial, serif;
      margin: 30px 0 40px;
    }
  }
  &__operate {
    width: 100%;
    height: 314px;
    display: block;
    flex: 1;
    &__wrap{
      &__hint{
        color:#fda800;
        font: 200 24px 'Roboto', Arial, serif;
      }
    }
    &__wrap__input {
      width: 100%;
      height: 94px;
      background: #fff;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 18px;
    }
    &__input {
      display:inline-block;
      width: 100%;
      background: #fff;
      border: none;
      outline: none;
      color: #241262;
      font: 300 36px 'Roboto', Arial, serif;
      padding: 0 35px;
      text-align: center;
    }
    &__input:focus {
      box-shadow: none;
      -webkit-tap-highlight-color:rgba(0,0,0,0);
      -webkit-user-modify:read-write-plaintext-only;
      outline:0;
    }
    &__input::-webkit-input-placeholder{
      width: 100%;
      text-align: center;
    }
    &__input:-ms-input-placeholder{
      color: #9F9EA1;
      text-align: center;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
      text-align: center;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
      text-align: center;
    }
    &__tip {
      color: #fff;
      font: 200 24px/30px 'Roboto', Arial, serif;
      text-align: center;
      margin: 27px auto 35px;
    }
    &__btn {
      width: 100%;
      height: 94px;
      border-radius: 46px;
      color: #fff;
      background: rgba(250,167,23, 0.95);
      text-align: center;
      font: 300 36px/94px 'Roboto', Arial, serif;
      margin-bottom: 50px;
    }
  }
}
</style>
