import Vue from 'vue'
import VueI18n from 'vue-i18n'

// default lang
import zhCn from './lang/zh-CN'
import enUs from './lang/en-US'

Vue.use(VueI18n)

export const defaultLang = 'zh-CN'

const messages = {
  'zh-CN': {
    ...zhCn
  },
  'en-US': {
    ...enUs
  }
}

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: 'zh-CN',
  messages
})

function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(lang = defaultLang) {
  return new Promise(resolve => {
    if (i18n.locale !== lang) {
      return resolve(setI18nLanguage(lang))
    }
    return resolve(lang)
  })
}

export function i18nRender(key) {
  return i18n.t(`${key}`)
}

export default i18n
