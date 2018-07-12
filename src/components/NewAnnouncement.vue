<template>
  <div class="announcement" v-if="isClose && newAnnouncement < 3">
    <span class="iconfont icon-cuowu close" @click="close" ></span>
    <div class="content" v-html="$t('NewAnnouncement')"></div>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
export default {
  name: 'NewAnnouncement',
  data () {
    return {
      isClose: true
    }
  },
  computed: {
    newAnnouncement: function () {
      if (!utils.storage.get('newAnnouncement')) {
        utils.storage.set('newAnnouncement', 0)
      }
      return utils.storage.get('newAnnouncement')
    }
  },
  methods: {
    close () {
      this.isClose = false
      utils.storage.set('newAnnouncement', utils.storage.get('newAnnouncement') + 1)
    }
  }
}
</script>
<style lang="less" type="text/less">
  .announcement{
    width: 100%;
    height: 160px;
    background: url('../assets/images/top-pop-bg.jpg') no-repeat center;
    background-size: cover;
    position: fixed;
    top:0;
    left: 0;
    z-index: 1110;
    display: flex;
    align-items: center;
    .close{
      position: absolute;
      top: 25px;
      right: 25px;
      transform: translate(0,-50%);
      font-size: 25px;
    }
    .content{
      padding: 0 50px 0 70px;
      color:#fff;
      font:200 24px 'Roboto', Arial, serif;
      position: relative;
      line-height: 35px;
      .horn{
        position: absolute;
        top: 5px;
        left: 25px;
        font-size: 28px;
      }
      .highlight {
         font:600 26px 'Roboto', Arial, serif;
      }
    }
  }
</style>
