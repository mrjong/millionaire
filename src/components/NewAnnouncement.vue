<template>
    <div class="announcement  bg-reset bg-center"  v-webp.bg="`url('top-pop-bg.jpg')`" v-if="isClose && newAnnouncement < 3">
      <span class="iconfont icon-cuowu close" @click="close" ></span>
      <span class="iconfont icon-laba horn"></span>
      <div class="content">{{$t('NewAnnouncement')}} <span class="to-carnival" @click="toCarnival">More</span> >></div>
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
      if (!utils.storage.get('millionaire-carnival-newAnnouncement')) {
        utils.storage.set('millionaire-carnival-newAnnouncement', 0)
      }
      return utils.storage.get('millionaire-carnival-newAnnouncement')
    }
  },
  methods: {
    close () {
      this.isClose = false
      utils.storage.set('millionaire-carnival-newAnnouncement', utils.storage.get('millionaire-carnival-newAnnouncement') + 1)
    },
    toCarnival () {
      this.$router.push({path: '/carnival'})
    }
  }
}
</script>
<style lang="less" type="text/less" scoped>
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-100%)
      }
      to {
        opacity: 1;
        transform: translateY(0px)
      }
    }
  .announcement{
    width: 100%;
    height: 160px;
    position: fixed;
    top:0;
    left: 0;
    z-index: 1110;
    display: flex;
    align-items: center;
    animation: fadeIn 3s 1;
    animation-fill-mode: forwards;
    .close{
      position: absolute;
      top: 25px;
      right: 15px;
      transform: translate(0,-50%);
      font-size: 25px;
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .content{
      padding: 0 50px 0 70px;
      color:#fff;
      font:200 24px 'Roboto', Arial, serif;
      position: relative;
      line-height: 35px;
      .highlight {
         font:600 26px 'Roboto', Arial, serif;
         color: #fff;
         text-decoration: underline;
      }
    }
    .horn{
      position: absolute;
      top: 50px;
      left: 25px;
      font-size: 28px;
    }
    .to-carnival{
      font-weight: 600;
      text-decoration: underline
    }
  }
</style>
