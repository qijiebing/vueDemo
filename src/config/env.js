import { getParams, getStore, setStore } from '../libs/util'

export default (function() {
    let locale = getParams('locale') || ''
    let provider = getParams('provider') || ''
    let ua = navigator.userAgent.toLowerCase()
    // if (locale.indexOf('en') >= 0) {
    //     window.locale = 'en'
    // } else if (locale.indexOf('th') >= 0) {
    //     window.locale = 'th'
    // } else if (locale.indexOf('zh') >= 0) {
    //     window.locale = 'zh'
    // } else {
    //     window.locale = 'zh'
    // }
    let localeStore = getStore('locale') || ''
    if (localeStore) {
        window.locale = localeStore
    } else {
        if (locale.indexOf('/') >= 0) {
            window.locale = locale.replace(/\/$/, '')
        } else {
            window.locale = locale
        }
        setStore('locale', window.locale)
    }

    if (provider.indexOf('/') >= 0) {
        window.provider = provider.replace(/\/$/, '')
    } else {
        window.provider = provider
    }
    console.log('window.locale:' + window.locale)
    console.log('window.provider:' + window.provider)
    return /tctravel/.test(ua) ? 'app' : /micromessenger/.test(ua) ? 'wx' : /(\bqq\/([\d.]+))|sq/.test(ua) ? 'qq' : 'm'
})()
