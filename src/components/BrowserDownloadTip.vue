<template>
<!-- 浏览器下载提示 -->
<div class="browser-tip" v-if="isShowBrowserTip">
  <span class="iconfont icon-cuowu close" @click="closeBrowserTip"></span>
  <img class="browser-tip__icon" src="../assets/images/browser-tip-icon.png"/>
  <div class="browser-tip__text">
    <p>{{$t('tip.downBrowser.title')}} {{$t('tip.downBrowser.desc')}}</p>
  </div>
  <a class="browser-tip__button ellipsis-1" href="javascript:;" @click="downBrowser">{{$t('tip.downBrowser.btn')}}</a>
</div>
</template>
<script>
import utils from '../assets/js/utils'
export default {
  name: 'BrowserDownloadTip',
  data () {
    return {
      isShowBrowserTip: utils.getDialogTip('browserDownload') && !utils.isInstall('com.millionaire.aries')
    }
  },
  methods: {
    // 跳转去下载浏览器
    downBrowser () {
      utils.statistic('download_button', 1)
      setTimeout(function () {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.millionaire.aries&referrer=id%3D334005'
      }, 500)
      window.location.href = 'xapplink://com.millionaire.aries/millionaire?url=' + encodeURIComponent(window.location.href)
    },
    // 关闭浏览器下载提示
    closeBrowserTip () {
      this.isShowBrowserTip = false
      utils.setDialogTip('browserDownload')
    }
  }
}
</script>
<style lang="less" scoped>
  .browser-tip {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 133px;
    background: url('../assets/images/browser-tip-bg.png') no-repeat;
    background-size: cover;
    color: #fff;
    padding-right: 10px;
    // z-index: 1;
    .close {
      position: absolute;
      top: 10px;
      right: 15px;
      opacity: 0.5;
    }
    img {
      width: 90px;
      height: 83px;
      margin: 0 10px;
    }
    &__text {
      width: 64%;
      line-height: 1.4;
      font: 200 24px 'Roboto,Arial,serif'
    }
    &__button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translate(0,-50%);
      color: #fff;
      width: 150px;
      height: 58px;
      text-align: center;
      background: url('../assets/images/browser-tip-button.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
      font: 24px 'Roboto,Arial,serif';
      line-height: 58px;
    }
  }
</style>
