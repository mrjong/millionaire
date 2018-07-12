<template>
  <div class="policy-bomb">
    <span class="iconfont icon-cuowu close" @click="reportPolicy"></span>
    <div class="content">
      <span class="iconfont icon-laba horn"></span>
      {{$t('policyBomb.describe1')}}
      <span class="policy-link" @click="reportPolicy('service')"> {{$t('policyBomb.agreement')}} </span> {{$t('policyBomb.describe2')}}
      <span class="policy-link" @click="reportPolicy('privacy')"> {{$t('policyBomb.agreement')}} </span> {{$t('policyBomb.describe3')}}
    </div>
  </div>
</template>

<script>
import * as api from '../assets/js/api'
import * as type from '../store/type'
import utils from '../assets/js/utils'
export default {
  name: 'PolicyBomb',
  props: {
  },
  data () {
    return {
    }
  },
  methods: {
    reportPolicy (val) {
      api.submitAgreePolicy().then(({data}) => {
        if (data.result === 1 && data.code === 0) {
          this.$store.commit(type._UPDATE, {
            isAgreePolicy: true
          })
          utils.statistic('agreement_notice', 1, {result_code_s: '1'})
          this.$store.dispatch(type._INIT).then(() => {
            if (val === 'service') {
              window.location.href = 'http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'
            } else if (val === 'privacy') {
              window.location.href = 'http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'
            }
          })
        } else {
          this.$store.commit(type._UPDATE, {
            isAgreePolicy: false
          })
          utils.statistic('agreement_notice', 1, {result_code_s: '0'})
        }
      })
    }
  },
  computed: {
  }
}
</script>
<style scoped lang="less" type="text/less">
  .policy-bomb{
    width: 100%;
    height: 160px;
    position: fixed;
    top:0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1110;
    display: flex;
    align-items: center;
    .close{
      position: absolute;
      top: 25px;
      right: 25px;
      transform: translate(0,-50%);
      font-size: 25px;
    }
    .content{
      padding: 0 50px 0 70px;
      color:#fff;
      font:200 24px 'Roboto', Arial, serif;
      position: relative;
      .horn{
        position: absolute;
        top: 5px;
        left: 25px;
        font-size: 28px;
      }
      .policy-link{
        color:#f5b53d;
      }
    }
  }
</style>
