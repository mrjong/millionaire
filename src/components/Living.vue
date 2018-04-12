<template>
  <div class="share-success__base__icon">
    <img src="../assets/images/lives-icon.png" />
    <img src="../assets/images/lives-icon.png"  class="top"/>
  </div>
</template>

<script>
export default {
  name: 'Living',
  data () {
    return {}
  }
}
</script>
<style scoped lang="less" type="text/less">
  .share-success__base__icon{
    display: block;
    width: 86px;
    position: relative;
    img{
      width: 100%;
    }
    .top{
      position: absolute;
      top:0;
      transform-origin: center;
      animation: lives 1.5s ease-in-out infinite;
    }
  }
  @keyframes lives {
    0%{
      transform: scale(1);
    }
    15%{
      transform: scale(1.2);
    }
    25%{
      transform: scale(1);
      opacity: 1;
    }
    90%{
      transform: scale(2);
      opacity: 0;
    }
  }
</style>
