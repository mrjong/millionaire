<template>
  <section class="select-language" v-if="(status === 1 || status === 2 || watchingMode) && !isTaskRespondence">
    <div class="icon-lang" @click="isShowDialog = true">{{$i18n.locale.toUpperCase()}}</div>
    <lang-pop :isShowLang= "isShowDialog" @changeLang= "changeLang"></lang-pop>
  </section>
</template>
<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import { _INIT, _UPDATE } from '../store/type'
import LangPop from './LangPop.vue'
export default {
  name: 'Language',
  data () {
    return {
      isShowDialog: false
    }
  },
  computed: {
    ...mapGetters(['status', 'watchingMode', 'isTaskRespondence'])
  },
  methods: {
    changeLang (lang) {
      const oldLang = this.$i18n.locale
      this.$i18n.locale = lang
      if (lang && oldLang !== lang) {
        this.$store.dispatch(_INIT).then(() => {}, () => {
          this.$i18n.locale = oldLang
          this.$store.commit(_UPDATE, {
            lang: oldLang
          })
        })
      }
      this.$store.commit(_UPDATE, {
        lang
      })
      utils.storage.set('millionaire-lang', lang)
      this.isShowDialog = false
    }
  },
  components: {
    LangPop
  }
}
</script>
<style lang="less">
  .select-language {
    .icon-lang {
      width: 52px;
      height: 52px;
      border-radius: 50px;
      border: 1px solid #fff;
      font-size: 24px;
      text-align: center;
      align-self: center;
      line-height: 54px;
      color: #fff;
      font-family: 'Roboto', Arial, serif;
      margin-left: 20px;
    }
  }
</style>
