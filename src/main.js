import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'
import i18n from './locales/index'
import fastClick from 'fastclick'
import env from './config/env'
import fetch from './libs/fetch'
import event from './libs/event'
import pop from './components/pops/index'

Vue.config.productionTip = false
if ('addEventListener' in document && 'ontouchstart' in window) {
    fastClick.prototype.focus = function(targetElement) {
        targetElement.focus()
    }
    document.addEventListener('DOMContentLoaded', function() {
        fastClick.attach(document.body)
    }, false)
}
window.env = env
store.commit('SET_LOCALE', window.locale)
i18n.locale = window.locale
window.$tcevt = event.tcEvent
Vue.use(fetch)
Vue.use(pop)

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
