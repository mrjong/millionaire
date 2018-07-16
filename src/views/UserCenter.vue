<template>
  <div class="user">
    <loading v-if="loading"></loading>
    <div class="header">
      <p class="title">{{$t('userCenter.title')}}</p>
      <p class="back iconfont icon-fanhui" @click="back"> </p>
      <p class="edit" >
        <span @click="edit" v-if="!isEditable">{{$t('userCenter.edit')}}</span>
        <span @click="save" v-else>{{$t('userCenter.save')}}</span>
      </p>
    </div>
    <div class="user__head">
      <label for="uploadPic">
        <img :src="userInfo.avatar" id="img">
        <input type="file" id="uploadPic" name="pic" @change="uploadPic" hidden>
      </label>
    </div>
    <div class="user__wrap">
      <p class="name">
        <span class="name__icon iconfont icon-nicheng"></span>
        <span class="name__tip">{{$t('userCenter.name')}}</span>
        <input type="text" v-if="isEditable" class="name__nick" v-model="nickname" ref="nickInput" id="nickInput">
        <span class="name__text" v-else>{{userInfo.userName}}</span>
      </p>
      <p class="paytm">
        <span class="paytm__icon iconfont icon-shouji"></span>
        <span class="paytm__tip">{{$t('userCenter.tel')}}</span>
        <span class="paytm__text">{{phone}}</span>
      </p>
      <p class="code">
        <span class="code__icon iconfont icon-yaoqingma"></span>
        <span class="code__tip">{{$t('userCenter.code')}}</span>
        <span class="code__text">{{code}}</span>
      </p>
      <p class="cash-history" @click="jump('balance-record')">
        <span class="cash-history__icon iconfont icon-cashhistory"></span>
        <span class="cash-history__tip">{{$t('userCenter.cash_history')}}</span>
        <span class="cash-history__text iconfont icon-LIVINGyoujiantou"></span>
      </p>
      <p class="contact" @click="jump('contact')">
        <span class="contact__icon iconfont icon-lianxiwomen"></span>
        <span class="contact__tip">{{$t('userCenter.contact')}}</span>
        <span class="contact__text iconfont icon-LIVINGyoujiantou"></span>
      </p>
    </div>
    <div class="logout-btn" @click="logOut">{{$t('userCenter.logout_btn')}}</div>
    <policy-link></policy-link>
    <balance-mark v-if="showDialog"
                  :data-info="dialogInfo"
                  @okEvent='okEvent'
                  @cancelEvent='cancelEvent'>
    </balance-mark>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '../assets/js/utils'
import * as type from '../store/type'
import BalanceMark from '../components/BalanceMark'
import PolicyLink from '../components/PolicyLink'
import Loading from '../components/Loading'
import * as api from '../assets/js/api'
export default {
  name: 'Contact',
  data () {
    return {
      nickname: '',
      isEditable: false,
      loading: false,
      showDialog: false,
      isLogout: false,
      dialogInfo: {
        htmlText: '',
        markType: false,
        okBtnText: this.$t('tip.lateJoin.btn')
      },
      phone: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      code: 'code'
    })
  },
  mounted () {
    utils.getPersonInfo(data => {
      this.phone = data.mobile
    })
    utils.statistic('user_profile_page', 0, {}, 'wait_page')
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    edit () {
      this.isEditable = true
      this.nickname = this.userInfo.userName
      setTimeout(() => {
        this.$refs.nickInput.focus()
      }, 200)
    },
    save () {
      if (this.nickname.length !== 0) {
        api.updateNickname(this.nickname).then(({ data }) => {
          if (+data.error_code === 0) {
            api.updateAvatarCache().then(res => {})
            this.isEditable = false
            this.$store.dispatch(type._OPEN_DIALOG, {
              htmlText: this.$t('userCenter.edit_pop.save_success'),
              markType: 0,
              okBtnText: this.$t('userCenter.edit_pop.ok'),
              lastTime: 3000,
              hintImg: './static/images/tip-success.png'
            })

            this.$store.commit(type.HOME_UPDATE, {
              userName: this.nickname
            })
          } else {
            this.isEditable = false
            this.$store.dispatch(type._OPEN_DIALOG, {
              htmlText: this.$t('userCenter.edit_pop.save_faild'),
              markType: 0,
              okBtnText: this.$t('userCenter.edit_pop.ok'),
              lastTime: 3000
            })
          }
        })
      }
    },
    uploadPic () {
      let preview = document.querySelector('#img')
      let file = document.querySelector('#uploadPic').files[0]
      let img = new Image()
      let reader = new FileReader()
      reader.readAsDataURL(file)

      img.onload = (e) => {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        // 图片原始尺寸
        let scale = (e.target.width / e.target.height)
        canvas.width = 100
        canvas.height = 100 / scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob.size / (1024 * 1024) > 4) { // 图片大于4M限制上传
            this.$store.dispatch(type._OPEN_DIALOG, {
              htmlText: this.$t('userCenter.edit_pop.picture_large'),
              shouldSub: false,
              markType: 0,
              okBtnText: this.$t('userCenter.edit_pop.ok'),
              lastTime: 3000
            })
          } else {
            this.loading = true
            let newFile = new File([blob], file.name, { type: file.type })
            // 执行上传操作
            api.uploadAvatar(newFile).then(({ data }) => {
              console.log(data)
              if (+data.error_code !== 0) {
                this.loading = false
                this.$store.dispatch(type._OPEN_DIALOG, {
                  htmlText: this.$t('userCenter.edit_pop.upload_faild'),
                  shouldSub: false,
                  markType: 0,
                  okBtnText: this.$t('userCenter.edit_pop.ok'),
                  lastTime: 3000
                })
              } else {
                api.updateAvatarCache().then(res => {})
                this.loading = false
                this.$store.dispatch(type._OPEN_DIALOG, {
                  htmlText: this.$t('userCenter.edit_pop.upload_success'),
                  shouldSub: false,
                  markType: 0,
                  okBtnText: this.$t('userCenter.edit_pop.ok'),
                  hintImg: './static/images/tip-success.png',
                  lastTime: 3000
                })
              }
            })
          }
        })
      }

      reader.onload = (e) => {
        if (!/^image\/[jpeg|png|gif]/.test(file.type)) {
          this.$store.dispatch(type._OPEN_DIALOG, {
            htmlText: this.$t('userCenter.edit_pop.picture_format_error'),
            shouldSub: false,
            markType: 0,
            okBtnText: this.$t('userCenter.edit_pop.ok'),
            lastTime: 3000
          })
        } else {
          img.src = reader.result
          preview.src = reader.result
        }
      }
    },
    jump (val) {
      if (val === 'balance-record') {
        utils.statistic('cash_history', 1, {}, 'user_profile_page')
        this.$router.push({ path: '/balance-record', query: { type: 'cash' } })
      } else if (val === 'contact') {
        utils.statistic('contact_us', 1, {}, 'user_profile_page')
        this.$router.push({ path: '/contact' })
      }
    },
    logOut () {
      // 退出登录
      this.isLogout = true
      this.showDialog = true
      this.dialogInfo.markType = true
      this.dialogInfo.htmlText = this.$t('userCenter.logout_pop.text1')
    },
    okEvent () {
      this.showDialog = false
      if (this.isLogout) {
        utils.logout(
          () => {
            utils.statistic(
              'log_out',
              1,
              { result_code_s: '1' },
              'user_profile_page'
            )
            api.queryAgreePolicy().then(({ data }) => {
              const { isEU = false } = data.data || {}
              if (data.result === 1) {
                if (isEU) {
                  this.$router.replace('/blank')
                } else {
                  if (data.data.agree) {
                    this.$store.commit(type._UPDATE, {
                      isAgreePolicy: true
                    })
                  } else {
                    this.$store.commit(type._UPDATE, {
                      isAgreePolicy: false
                    })
                  }
                }
              } else {
                this.$store.commit(type._UPDATE, {
                  isAgreePolicy: false
                })
              }
              this.$store.dispatch(type._INIT)
              this.$router.replace('/')
            })
          }, () => {
            // 登出失败
            utils.statistic('log_out', 1, { result_code_s: '0' }, 'user_profile_page')
            this.isLogout = false
            this.dialogInfo.htmlText = this.$t('userCenter.logout_pop.text2')
            this.showDialog = true
          })
      }
    },
    cancelEvent () {
      this.showDialog = false
    }
  },
  components: {
    BalanceMark,
    PolicyLink,
    Loading
  }
}
</script>
<style scoped lang="less" type="text/less">
.user {
  width: 100%;
  min-height: 100%;
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
      font: 400 36px/51.5px "Roboto", Arial, serif;
      color: #fff;
    }
    .edit {
      position: absolute;
      line-height: 51.5px;
      right: 0;
      color: #fff;
      font-size: 28px;
    }
  }
  &__head {
    width: 133px;
    height: 133px;
    margin: 80px auto 40px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  &__wrap {
    .name__nick {
      background: none;
      outline: none;
      border: none;
      overflow: hidden;
      width: 250px;
      text-align: right;
    }
    .name,
    .paytm,
    .code,
    .cash-history,
    .contact {
      display: flex;
      justify-content: space-between;
      max-width: 100%;
      width: 657px;
      height: 93px;
      text-align: center;
      color: #fff;
      font: 32px "Roboto", Arial, serif;
      line-height: 93px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      margin-top: 26px;
      position: relative;
      &__icon {
        height: 100%;
        font-size: 36px;
        display: block;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 5px;
        transform: translate(0, -50%);
      }
      &__tip {
        margin-left: 66px;
        opacity: 0.3;
        font: 32px "Roboto", Arial, serif;
        line-height: 93px;
      }
      &__text {
        font: 32px "Roboto", Arial, serif;
        line-height: 93px;
      }
      .mail {
        background: url("../assets/images/icon-small-gmail.png") no-repeat
          center;
        background-size: cover;
      }
      .fb {
        background: url("../assets/images/icon-small-fb.png") no-repeat center;
        background-size: cover;
      }
      .twitter {
        background: url("../assets/images/icon-small-twitter.png") no-repeat
          center;
        background-size: cover;
      }
      .ins {
        background: url("../assets/images/icon-small-ins.png") no-repeat center;
        background-size: cover;
      }
    }
  }
  .logout-btn {
    max-width: 100%;
    width: 657px;
    height: 93px;
    border-radius: 46px;
    text-align: center;
    color: #fff;
    font: 32px "Roboto", Arial, serif;
    line-height: 93px;
    background-color: rgba(255, 255, 255, 0.5);
    margin-top: 100px;
  }
}
</style>
