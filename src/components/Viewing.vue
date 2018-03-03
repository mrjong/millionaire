<template>
  <div class="view-container">
    <div class="view-container__icon">
      <img src="../assets/images/watchingMode.png" >
    </div>
    <div class="view-container__text">Viewing</div>
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
    padding:0 16px;
    display: flex;
    &__icon{
      width: 30px;
      align-self: center;
      img{
        width: 100%;
      }
    }
    &__text{
      font-size: 20px;
      color: #241262;
      margin-left: 12px;
      align-self: center;
    }
  }
</style>
