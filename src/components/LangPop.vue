<template>
  <div class="mark" v-if="isShowLang">
    <div class="wrap">
      <p class="hint-icon">
        <img src="../assets/images/lang-icon.png" class="hint-icon__img">
      </p>
      <p class="title">Select Language</p>
      <p class="title">भाषा चुनिए</p>
      <div class="is-reminder">
        <p class="checkbox" @click="selectLang('en')">
          <span class="radio" :class="{'selected': isEN}" ></span>
          <span>English</span>
        </p>
        <p class="checkbox"  @click="selectLang('hi')">
          <span  class="radio" :class="{'selected': !isEN}"></span>
          <span>हिन्दी</span>
        </p>
      </div>
      <p class="btn">
        <span class="btn__ok" @click="okEvent">OK(ठीक)</span>
      </p>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'LangPop',
  props: {
    isShowLang: {
      type: Boolean
    }
  },
  data () {
    return {
      isEN: true,
      isHi: false
    }
  },
  computed: {
    ...mapGetters(['status', 'phoneNationCode'])
  },
  methods: {
    okEvent () {
      this.$emit('changeLang', this.isEN)
    },
    selectLang (val) {
      if (val === 'en') {
        this.isEN = true
      } else {
        this.isEN = false
      }
    }
  },
  components: {}
}
</script>
<style scoped lang="less" type="text/less">
  .mark{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left: 0;
    background: rgba(0, 0,0, 0.8);
    z-index: 11;
  }
  .wrap {
    width: 602px;
    background: #fff;
    border-radius: 16px;
    padding: 40px 45px;
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .cancel{
      width: 50px;
      height: 50px;
      border: 3px solid #f7f6f7;
      position: absolute;
      top: 20px;
      right: 20px;
      color:#241262;
      line-height: 45px;
      text-align: center;
      border-radius: 50%;
    }
    .hint-icon{
      width: 80px;
      margin:0 auto 26px;
      &__img{
        width: 100%;
      }
    }
    .is-reminder {
      display: flex;
      justify-content: space-evenly;
      input{
        opacity: 0;
      }
      label{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        font-weight: 100;
      }
      .radio {
        display: inline-block;
        width: 25px;
        height: 25px;
        background: url('../assets/images/no-checked-icon.png') no-repeat center;
        background-size: cover;
        vertical-align: baseline;
      }
      .selected{
        background: url('../assets/images/checked-icon.png') no-repeat center;
        background-size: cover;
      }
      .checkbox{
        height: 30px;
        text-align: center;
        font-size: .15px;
        color: #241262;
        line-height: 38px;
        align-self: center;
      }
      p{
        height: 30px;
        margin-left: 20px;
        font: 26px 'Roboto', Arial, serif;
        line-height: 30px;
        color: #241262;
      }
    }
    .title {
      width: 100%;
      font: 400 32px/30px 'Roboto', Arial, serif;
      color: #220f60;
      min-height: 40px;
      margin: 10px auto;
      text-align: center;
    }
    .phone, .national-code{
      position: relative;
      margin: 20px 0;
    }
    .phone-icon, .code-icon{
      position: absolute;
      top: 50%;
      left: 30px;
      transform: translate(0,-50%);
      color: #241262;
      font-size: 42px;
    }
    .drop-down{
      position: absolute;
      top: 50%;
      right: 30px;
      transform: translate(0,-50%) rotateZ(90deg);
      color: #241262;
      font-size: 32px;
    }
    .invitation{
      width: 100%;
      height: 77px;
      line-height: 77px;
      border-radius: 46px;
      background-color:#f4f3f7 ;
      border: 0;
      padding-left: 30px;
      color:#241262 ;
      font-size: 28px;
      text-align: center;
    }
    input::-webkit-input-placeholder{
      width: 100%;
      color: #241262;
      opacity: 0.6;
      text-align: center;
      font-size: 28px;
    }
    .btn {
      width: 100%;
      height: 77px;
      display: flex;
      justify-content: space-around;
      margin-top: 25px;
      span {
        display: inline-block;
        width: 240px;
        height: 100%;
        border-radius: 38px;
        color: #fff;
        font: 300 28px 'Roboto', Arial, serif;
        text-align: center;
        line-height: 77px;
      }
      &__ok {
        background: rgba(250, 167, 23, 0.95);
      }
    }
  }
</style>
