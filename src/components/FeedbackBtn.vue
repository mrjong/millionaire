<template>
  <div class="feedback">
    <div class="feedback__icon iconfont icon-wenjuan" @click="feedback"></div>
  </div>
</template>

<script>
export default {
  name: 'Feedback',
  data () {
    return {}
  },
  methods: {
    feedback () {
      window.location.href = ''
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .feedback{
    width: 93px;
    height: 93px;
    position: fixed;
    right: 25px;
    bottom: 106px;
    border-radius: 50%;
    box-shadow: 0 5px 20px 5px rgba(250,167,23,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(250,167,23,0.95);
    &__icon{
      align-self: center;
      font-size: 50px;
    }
  }
</style>
