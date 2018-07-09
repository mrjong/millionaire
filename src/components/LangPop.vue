<template>
  <div id="lang-dialog" class="mark" v-if="isShowLang" style="z-index: 222;">
    <div class="wrap">
      <p class="hint-icon">
        <img src="../assets/images/lang-icon.png" class="hint-icon__img">
      </p>
      <p class="title">Choose Language</p>
      <p class="title">भाषा चुने</p>
      <div class="is-reminder">
        <div class="checkbox" @click="selectedLang = 'en'">
          <p class="radio" :class="{'selected': selectedLang === 'en'}" ></p>
          <p>English</p>
        </div>
        <div class="checkbox"  @click="selectedLang = 'hi'">
          <p class="radio" :class="{'selected': selectedLang === 'hi'}"></p>
          <p>हिन्दी</p>
        </div>
      </div>
      <p class="btn">
        <span class="btn__ok" @click="okEvent">OK(ठीक)</span>
      </p>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
export default {
  name: 'LangPop',
  props: {
    isShowLang: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedLang: this.$i18n.locale
    }
  },
  computed: {
    ...mapGetters(['lang'])
  },
  methods: {
    okEvent () {
      utils.statistic('Language_button', 1, {result_code_s: this.selectedLang})
      this.$emit('changeLang', this.selectedLang)
    }
  },
  watch: {
    lang (val) {
      this.selectedLang = val
    }
  }
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
      justify-content: space-around;
      margin: 20px auto;
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
        width: 26px;
        height: 26px;
        background: url('../assets/images/no-checked-icon.png') no-repeat center;
        background-size: contain;
      }
      .selected{
        background: url('../assets/images/checked-icon.png') no-repeat center;
        background-size: contain;
      }
      .checkbox{
        text-align: center;
        font-size: .15px;
        color: #241262;
        align-self: center;
        display: flex;
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
