<template>
  <div class="blank">
    <div class="content">
      <p class="back iconfont icon-fanhui" @click="close"></p>
      <img src="../assets/images/cry-supa.png" class="img">
      <p class="title">Sorry!</p>
      <p class="hint">Currently, we don't provide any game service in EU, and it is only available in India.</p>
    </div>
  </div>
</template>
<script>
import utils from '../assets/js/utils'
import * as type from '../store/type'
export default {
  name: 'blank',
  data () {
    return {
    }
  },
  mounted () {
    this.$store.commit(type._UPDATE, {
      isAgreePolicy: true
    })
  },
  methods: {
    close () {
      utils.statistic('blank_page', 1)
      this.$router.go(-1)
      utils.closeWebview()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .blank{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
      padding: 0 25px;
      align-self: center;
      color:#fff;
      text-align: center;
      .back{
        position: fixed;
        top: 25px;
        left: 25px;
        width:54px;
        height: 54px;
        font-size: 28px;
        line-height: 54px;
        text-align: center;
        border-radius: 50%;
        background-color: rgba(255,255,255, 0.3)
      }
      .img{
        width: 250px;
        margin: 0 auto;
      }
      .title{
        font: 400 36px 'Roboto', Arial, serif;
        margin-top: 40px;
      }
      .hint{
        font: 400 26px 'Roboto', Arial, serif;
        margin-top: 26px;
        line-height: 36px;
        letter-spacing: 1px;
        color:rgba(255,255,255,0.6)
      }
    }
  }
</style>
