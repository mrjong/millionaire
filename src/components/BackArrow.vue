<template>
    <div class="back-arrow-icon iconfont icon-fanhui" @click="$router.go(-1)"></div>
</template>

<script>
export default {
  name: 'BackArrow'
}
</script>

<style lang="less" scoped>
.back-arrow-icon {
    width: 50px;
    height: 50px;
    background: rgba(255,255,255,.3);
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    font-size: 26px;
}
</style>
