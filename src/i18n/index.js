import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './lang/en'
import hi from './lang/in'

Vue.use(VueI18n)
// 国际化多语言
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en,
    hi
  }
})

export default i18n
