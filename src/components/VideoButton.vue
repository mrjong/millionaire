<template>
  <div class="video-button"  @click="toVideo"></div>
</template>

<script>
import utils from '../assets/js/utils'
export default {
  name: 'VideoButton',
  data () {
    return {}
  },
  methods: {
    toVideo () {
      utils.statistic('watch_video_button', 1)
      this.$router.push('/video')
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .video-button{
    width: 112px;
    height: 134px;
    background: url('../assets/images/video-icon.png') no-repeat center;
    background-size: cover;
    position: fixed;
    right: 25px;
    bottom: 200px;
    border-radius: 50%;
  }
</style>
