<template>
  <div class="video" ref="videoContainer">
    <p class="video__back iconfont icon-fanhui" @click="goBack"></p>
    <div class="logo">
      <img v-webp="'await-logo.png'">
    </div>
    <div class="title">
      <img src="../assets/images/video-title.png">
    </div>
    <div class="description">
      <p class="text left">Do you want to be <span class="light">Street Quiz Master? </span></p>
      <p class="text right">Do you dare to <span class="light">challege 10 sec answer?</span></p>
    </div>
    <div class="btn" @click="join">Join Quiz Master</div>
    <div class="video__content" ref="videoContent">
        <div class="module" v-for="(val, idx) in videoList" :key="idx" @click="playVideo(val.link)">
          <div class="video-img">
            <img :src="val.img">
            <p class="play-btn"></p>
          </div>
          <p class="description">{{val.text}}</p>
        </div>
    </div>
  </div>
</template>
<style scoped lang="less" type="text/less">
.video{
  width: 100%;
  height: 100%;
  background: url("../assets/images/video-bg.jpg") no-repeat top left;
  background-size: cover;
  padding: 25px;
  overflow-y: scroll;
  &__back {
    position: fixed;
    top: 25px;
    left: 25px;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    font-size: 24px;
    text-align: center;
    line-height: 54px;
  }
  .logo {
    width: 300px;
    height: 171px;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }
  .title {
    width: 600px;
    max-width: 90%;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .description {
    width: 90%;
    margin: 0 auto;
    color:#fff;
    font-family: 'Roboto', Arial, serif;
    font-size: 28px;
    .left{
      text-align: left;
      margin-top: 30px;
    }
    .right {
      text-align: right;
      margin: 15px 0 30px;
    }
    .text{
      .light{
        color:#ffd433;
      }
    }
  }
  .btn{
    position: relative;
    width: 670px;
    max-width:100%;
    height: 130px;
    font: 600 36px 'Roboto', Arial, serif;
    line-height: 120px;
    background:url("../assets/images/light-btn-bg.png") no-repeat top left;
    background-size: cover;
    color: #fff;
    text-shadow: 2px 4px 7px rgba(156, 27, 93, 0.54);
    border-radius: 24px;
    text-align: center;
  }
  &__content{
    width: 100%;
    position: relative;
    .module{
      max-width:640px;
      width: 100%;
      height: 420px;
      background: url('../assets/images/video-module-bg.png') no-repeat center;
      background-size: cover;
      margin: 50px auto 0;
      .video-img{
        width: 100%;
        min-height: 350px;
        position: relative;
        img{
          width: 100%;
          opacity: 0.8;
        }
        .play-btn{
          width: 93px;
          height: 93px;
          background: url('../assets/images/play-btn.png') no-repeat center;
          background-size: cover;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
      }
      .description{
        color: #fff;
        margin-top: 17px;
        font:28px 'Roboto', Arial, serif;
      }
    }
  }
}
</style>
<script>
import utils from '../assets/js/utils'
import {throttle} from 'throttle-debounce'
const domEvent = require('../assets/js/dom.js')
export default {
  name: 'Video',
  data () {
    return {
      start: '',
      move: '',
      video: [
        {
          img: 'https://static.apusapps.com/201806141345571001efe508.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1837231499903932/',
          text: 'Quiz Master Pushpanjli'
        },
        {
          img: 'https://static.apusapps.com/201806141345547671c943bc.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1834488896844859/',
          text: 'Quiz Master Nischaya'
        },
        {
          img: 'https://static.apusapps.com/201806141346006cce2a078e.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1832818200345262/',
          text: 'Quiz Master Amrita'
        },
        {
          img: 'https://static.apusapps.com/20180614134553989c9bfc92.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1836665556627193/',
          text: 'Quiz Master Harsh'
        },
        {
          img: 'https://static.apusapps.com/20180614134604af5a17bd64.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1832332103727205/',
          text: 'Quiz Master Diwaker Singh'
        },
        {
          img: 'https://static.apusapps.com/2018061413455900c72e529e.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1835268590100223/',
          text: 'Quiz Master Sumant'
        },
        {
          img: 'https://static.apusapps.com/20180614134603475ca8b66a.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1835836796710069/',
          text: 'Quiz Master Mitali'
        },
        {
          img: 'https://static.apusapps.com/20180614134558393eb3ddd4.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1833945303565885/',
          text: 'Quiz Master Ruchika'
        },
        {
          img: 'https://static.apusapps.com/201806141346019b855b18e0.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1836263523334063/',
          text: 'Quiz Master Amzad'
        },
        {
          img: 'https://static.apusapps.com/201806141346023525aaca4e.jpg',
          link: 'https://www.facebook.com/GoMillionaireGo/videos/1833503200276762/',
          text: 'Quiz Master Manju '
        }
      ],
      videoList: []
    }
  },
  mounted () {
    utils.statistic('vedio_page', 0)
    this.getVideoData(0)
    this.touch()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    join () {
      utils.statistic('quiz_master_button', 1)
      console.log('aaaa')
      utils.toFbBrowser()
    },
    playVideo (link) {
      utils.statistic('vedio_play_button', 1)
      window.location.href = link
    },
    getVideoData (pageNo) {
      this.video.slice(0 + pageNo * 5, pageNo * 5 + 5).forEach((val, idx) => {
        this.videoList.push(val)
      })
    },
    touch () {
      let yStart = 0
      let yEnd = 0
      let xStart = 0
      let xEnd = 0
      domEvent.on(document.body, 'touchstart', this.start = (e) => {
        e.stopPropagation()
        let touches = e.touches[0]
        yStart = touches.clientY
        xStart = touches.clientX
      })
      domEvent.on(document.body, 'touchmove', throttle(100, this.move = (e) => {
        e.stopPropagation()
        let touches = e.touches[0]
        yEnd = touches.clientY
        xEnd = touches.clientX
        let videoContentHeight = this.$refs.videoContent.offsetHeight
        let videoContainerScrollTop = this.$refs.videoContainer.scrollTop || 0
        let videoContainerHeight = this.$refs.videoContainer.offsetHeight
        if ((Math.abs(xEnd - xStart) < Math.abs(yEnd - yStart)) && (yEnd - yStart) < 0) {
          if (videoContainerScrollTop + videoContainerHeight > videoContentHeight) {
            if (this.videoList.length < 10) {
              this.getVideoData(1)
            }
          }
        } else {
          return false
        }
      }))
    }
  },
  beforeDestroy () {
    if (this.start) {
      domEvent.off(document.body, 'touchstart', this.start)
      this.start = ''
    }
    if (this.move) {
      domEvent.off(document.body, 'touchmove', this.move)
      this.move = ''
    }
  }
}
</script>
