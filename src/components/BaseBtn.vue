<template>
  <div class="base-btn"
       :style="{backgroundColor: baseStyle.bgColor}"
       @click="inviteFriends">
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
  },
  methods: {
    inviteFriends () {
      // 分享好友
      this.$emit('inviteFriends')
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
    text-align: center;
    font: 300 28px/93px 'Roboto';
  }
</style>
