<template>
  <div class="contact-container">
    <div class="header">
      <p class="title">{{$t('contact.title')}}</p>
      <p class="back iconfont icon-fanhui" @click="back"> </p>
    </div>
    <div class="describe">{{$t('contact.describe')}}</div>
    <div class="contact-way">
      <p class="method" v-for="(val, idx) in contactList" :key="idx" @click="contact(val.className)">
        <span :class="val.className"></span>
        {{val.text}}
      </p>
    </div>
    <p class="bottom-text">
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'>User Agreement</a> &
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'>Privacy Policy</a>
    </p>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import loading from '../components/Loading.vue'
export default {
  name: 'Contact',
  data () {
    return {
      loading: false,
      contactList: [
        {
          className: 'mail',
          text: this.$t('contact.email')
        },
        {
          className: 'fb',
          text: this.$t('contact.fb')
        },
        {
          className: 'twitter',
          text: this.$t('contact.twitter')
        },
        {
          className: 'ins',
          text: this.$t('contact.ins')
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['status', 'phoneNationCode'])
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    contact (val) {
      // 跳转
      utils.statistic(val, 1, {}, 'contact_us')
      switch (val) {
        case 'mail' :
          window.location.href = 'mailto:gomillionaire@apusapps.com'
          break
        case 'fb': {
          setTimeout(() => {
            window.location.href = 'https://www.facebook.com/GoMillionaire-1814960232131059/'
          }, 5)
          window.location.href = 'fb://page/1814960232131059'
          break
        }
        case 'twitter' : {
          setTimeout(() => {
            window.location.href = 'https://twitter.com/GoMillionaireGO'
          }, 5)
          window.location.href = `twitter://follow?screen_name=GoMillionaireGO`
          break
        }
        case 'ins' : {
          setTimeout(() => {
            window.location.href = 'https://www.instagram.com/apusgomillionaire/'
          }, 5)
          window.location.href = 'instagram://user?username=apusgomillionaire'
          console.log('sss')
        }
      }
    }
  },
  mounted () {
    utils.statistic('contact_page', 0, {}, 'user_profile_page')
  },
  components: {
    loading
  }
}
</script>
<style scoped lang="less" type="text/less">
  .contact-container {
    width: 100%;
    height: 100%;
    background: url("../assets/images/await-bg.jpg") no-repeat top left;
    background-size: cover;
    padding: 3.7% 3.7% 0;
    display: flex;
    flex-direction: column;
    .header {
      width: 100%;
      min-height: 51.5px;
      position: relative;
      box-sizing: content-box;
      .back {
        width: 51.5px;
        height: 51.5px;
        border-radius: 51.5px;
        background-color: #3f3567;
        font-size: 24.67px;
        line-height: 51.5px;
        padding: 2px 2px 0 0;
        text-align: center;
        position: absolute;
        left: 0;
      }
      .title {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        text-align: center;
        font: 400 36px/51.5px 'Roboto', Arial, serif;
        color: #fff;
      }
    }
    .describe{
      color:#fff;
      margin: 80px auto 50px;
      font: 400 32px 'Roboto', Arial, serif;
    }
    .contact-way{
      .method{
        max-width: 100%;
        width: 657px;
        height: 93px;
        border-radius: 46px;
        text-align: center;
        color:#fff;
        font:32px 'Roboto', Arial, serif;
        line-height: 93px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        margin-top: 26px;
        position: relative;
        span {
          display: block;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          position: absolute;
          top:50%;
          left: 33px;
          transform: translate(0,-50%);
          background-color:#fff;
        }
        .mail {
          background: url('../assets/images/icon-small-gmail.png') no-repeat center;
          background-size: cover;
        }
        .fb {
          background: url('../assets/images/icon-small-fb.png') no-repeat center;
          background-size: cover;
        }
        .twitter {
          background: url('../assets/images/icon-small-twitter.png') no-repeat center;
          background-size: cover;
        }
        .ins {
          background: url('../assets/images/icon-small-ins.png') no-repeat center;
          background-size: cover;
        }
      }
    }
    .bottom-text{
      width: 100%;
      position: absolute;
      bottom: 30px;
      font: 200 24px 'Roboto', Arial, serif;
      color: #fff;
      text-align: center;
      a{
        color:#fff;
      }
    }
  }
</style>
