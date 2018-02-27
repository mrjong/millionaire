<template>
  <div class="view-container">
    <i class="view-container__icon"></i>
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
    width: 144px;
    height: 38px;
    border-radius: 26px;
    border:1px solid #cac6d8;
    display: flex;
    justify-content: center;
    &__icon{
      width: 28px;
      height: 16px;
      background-color: yellow;
      align-self: center;
      margin-right: 16px;
    }
    &__text{
      font-size: 20px;
      text-align: center;
      color: #241262;
      align-self: center;
    }
  }
</style>
