<template>
  <div class="loading">
    <img src="../assets/images/loading.png" class="loading__img">
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .loading{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1111;
    display: flex;
    justify-content: center;
    &__img{
      width: 80px;
      align-self: center;
      animation:rotating 1s linear infinite
    }
  }
  @keyframes rotating{
    from{transform:rotate(0)}
    to{transform:rotate(360deg)}
  }
</style>
