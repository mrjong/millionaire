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
    border-radius: 28px;
    /*box-shadow: 0 0 0 2px #cac6d8;*/
    border:2px solid #cac6d8;
    padding:16px;
    display: flex;
    align-items: center;
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
