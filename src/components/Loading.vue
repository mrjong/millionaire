<template>
  <div class="loading" :style="{height: actualHeight}">
    <div  class="loading__img">
      <img src="../assets/images/loading.png">
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    height: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  computed: {
    actualHeight: function () {
      if (this.height) {
        return this.height + 'px'
      } else {
        return '100%'
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .loading{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1111;
    display: flex;
    justify-content: center;
    &__img{
      width: 80px;
      height: 80px;
      align-self: center;
      animation:rotating 1s linear infinite;
      img{
        width: 100%;
      }
    }
  }
  @keyframes rotating{
    from{transform:rotate(0)}
    to{transform:rotate(360deg)}
  }
</style>
