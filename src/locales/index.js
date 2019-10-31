import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getParams } from '../libs/util'
Vue.use(VueI18n)
//  默认预约选择
let DEFAULT_LANG = 'en'
const LOCALE_KEY = 'localeLanguage'
let locale = getParams('locale') || ''
if (locale.indexOf('/') >= 0) {
    window.locale = locale.replace(/\/$/, '')
} else {
    window.locale = locale
}

DEFAULT_LANG = locale

const locales = {
    zh: require('./zh.json'),
    en: require('./en.json'),
    th: require('./th.json')
}

const i18n = new VueI18n({
    locale: DEFAULT_LANG,
    messages: locales
})

export const setup = lang => {
    if (lang === undefined) {
        lang = window.localStorage.getItem(LOCALE_KEY)
        if (locales[lang] === undefined) {
            lang = DEFAULT_LANG
        }
    }
    window.localStorage.setItem(LOCALE_KEY, lang)

    Object.keys(locales).forEach(lang => {
        document.body.classList.remove(`lang-${lang}`)
    })
    document.body.classList.add(`lang-${lang}`)
    document.body.setAttribute('lang', lang)

    Vue.config.lang = lang
    i18n.locale = lang
}

setup()
export default i18n
