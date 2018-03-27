<template>
  <div class="check">
    <p class="check__residual">{{residualLength}}</p>
  </div>
</template>

<script>
export default {
  name: 'Answer',
  props: {
    originalLength: {
      type: Number
    },
    currentLength: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  computed: {
    residualLength: function () {
      return this.originalLength - this.currentLength
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .check{
    line-height: 36px;
    font-size: 24px;
    color: rgba(36, 18, 98, 0.6);
  }
</style>
