<template>
  <div class="base-btn"
       :style="{backgroundColor: baseStyle.bgColor}">
    {{baseStyle.text}}
  </div>
</template>

<script>
export default {
  name: 'BaseBtn',
  props: {
    baseStyle: Object
  },
  data () {
    return {
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .base-btn{
    color: #ffffff;
    opacity: 0.95;
    border-radius: 46px;
    width: 313px;
    height:93px;
    line-height: 93px;
    text-align: center;
    font: 28px Roboto-Light;
  }
</style>
