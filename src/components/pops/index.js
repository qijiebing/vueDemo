/**
 * author by guanhan
 * created at 2018-06-06
 */
import pop from './index.vue'
let locale = window.locale
// 初始化各个类型的pops参数
const initParams = {
    loading: {
        type: 'loading',
        show: true,
        txt: locale === 'en' ? 'loading' : locale === 'th' ? 'โหลด' : '加载中...',
        isOpen: false
    },
    alert: {
        type: 'alert',
        show: true,
        txt: locale === 'en' ? 'Please wait' : locale === 'th' ? 'รอเดี๋ยวนะ' : '亲，请稍等片刻~',
        blank: false,
        okBtn: locale === 'en' ? 'confirm' : locale === 'th' ? 'ยืนยัน' : '确认',
        cancelBtn: locale === 'en' ? 'cancle' : locale === 'th' ? 'ยกเลิก' : '取消',
        okFn: () => {},
        isOpen: false
    },
    confirm: {
        type: 'confirm',
        title: '温馨提示',
        show: true,
        txt: '亲，请稍等片刻~',
        okBtn: locale === 'en' ? 'confirm' : locale === 'th' ? 'ยืนยัน' : '确认',
        cancelBtn: locale === 'en' ? 'cancle' : locale === 'th' ? 'ยกเลิก' : '取消',
        blank: false,
        okFn: () => {},
        cancelFn: () => {},
        isOpen: false
    },
    toast: {
        type: 'toast',
        show: true,
        txt: locale === 'en' ? 'Please wait' : locale === 'th' ? 'รอเดี๋ยวนะ' : '亲，请稍等片刻~',
        duration: 2000,
        style: 'width:30vh',
        complete: () => {},
        isOpen: false
    },
    desc: {
        type: 'desc',
        title: '',
        show: true,
        txt: '',
        modal: true,
        okBtn: 'ok',
        okFn: () => {},
        cancelFn: () => {}
    },
    close: {
        type: 'close'
    }
}

// 注册组件及原型方法
const pops = {
    install: function(Vue) {
        let Layer = Vue.extend(pop)
        let layer = new Layer()
        document.body.appendChild(layer.$mount().$el)

        Vue.prototype.$loading = option => {
            // layer.params = crossParams(option, 'loading')
            layer.params = { ...initParams.loading, ...option }
        }
        Vue.prototype.$hloading = () => {
            layer.params.show = false
        }

        Vue.prototype.$alert = option => {
            if (typeof option === 'string') {
                option = { txt: option }
            }

            layer.params = { ...initParams.alert, ...option }
        }

        Vue.prototype.$confirm = option => {
            // layer.params = crossParams(option, 'confirm')
            layer.params = { ...initParams.confirm, ...option }
        }
        Vue.prototype.$toast = option => {
            // layer.params = crossParams(option, 'toast')
            layer.params = { ...initParams.toast, ...option }
        }
        Vue.prototype.$desc = option => {
            // layer.params = crossParams(option, 'desc')
            layer.params = { ...initParams.desc, ...option }
        }
        Vue.prototype.$closePop = option => {
            // layer.params = crossParams(option, 'desc')
            layer.params = { ...initParams.close, ...option }
        }
    }
}

export default pops
