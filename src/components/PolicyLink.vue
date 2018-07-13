<template>
  <div class="bottom-text">
      <a class= "policy" :style="{color: color}" href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'>- {{$t('policyBomb.agreement')}}</a> {{$t('policyBomb.symbol')}}
      <a class= "policy" :style="{color: color}" href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'>{{$t('policyBomb.policy')}} -</a>
  </div>
</template>

<script>
export default {
  name: 'PolicyLink',
  props: {
    color: {
      type: String
    }
  },
  data () {
    return {}
  }
}
</script>
<style scoped lang="less" type="text/less">
.bottom-text{
    margin: 25px 0;
    font: 200 24px 'Roboto', Arial, serif;
    color: #fff;
    text-align: center;
    a{
      color:#fff;
    }
  }
</style>
