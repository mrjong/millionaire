<template>
  <div class="view-container">
    <div class="view-container__icon">
      <img src="../assets/images/watchingMode.png" >
    </div>
    <span class="view-container__text">Viewing</span>
  </div>
</template>

<script>
export default {
  name: 'Viewing',
  data () {
    return {}
  }
}
</script>
<style scoped lang="less" type="text/less">
  .view-container{
    height: 50px;
    border-radius: 26px;
    border:1px solid #cac6d8;
    line-height: 45px;
    vertical-align: middle;
    padding:0 12px;
    &__icon{
      width: 30px;
      height: 18px;
      display: inline-block;
      img{
        width: 100%;
      }
    }
    &__text{
      font-size: 20px;
      color: #241262;
      margin-left: 12px;
    }
  }
</style>
