<template>
  <div class="view-container">
    <div class="view-container__icon">
      <img src="../assets/images/watchingMode.png" >
    </div>
    <div class="view-container__text">{{$t('main.viewing')}}</div>
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
    border-radius: 24px;
    box-shadow: 0 0 0 2px #cac6d8;
    padding:13px 17px;
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
  @media screen and (max-width: 321px) {
    .view-container{
      box-shadow: 0 0 0 4px #cac6d8;
    }
  }
</style>
