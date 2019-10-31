import axios from 'axios'
import { isEmpty } from './util'

import en from '../locales/en.json'
import th from '../locales/th.json'
import env from '../config/env'
let envs = env
console.log(envs)
// console.log(en['始发'])
function i18n(name) {
    if (window.locale === 'en') {
        return en[name]
    } else if (window.locale === 'th') {
        return th[name]
    }
}
function getErrorMsg(that, code) {
    let ErrorList = [{
        key: 10003,
        value: i18n('参数不存在')
    }, {
        key: 50004,
        value: i18n('用户登陆错误')
    }, {
        key: 50015,
        value: i18n('获取验证码错误')
    }, {
        key: 50020,
        value: i18n('用户不存在')
    }, {
        key: 50016,
        value: i18n('验证码失效')
    }, {
        key: 60005,
        value: i18n('绑卡失败')
    }, {
        key: 60003,
        value: i18n('支付失败')
    }, {
        key: 10002,
        value: i18n('参数不能为空')
    }, {
        key: 10010,
        value: i18n('重复的证件号')
    }, {
        key: 50011,
        value: i18n('票价错误')
    }, {
        key: 50000,
        value: i18n('系统错误')
    }, {
        key: 10004,
        value: i18n('实收金额不合法')
    }, {
        key: 10010,
        value: i18n('重复的证件号')
    }, {
        key: 10011,
        value: i18n('座位数和乘客数必须相同')
    }, {
        key: 10006,
        value: i18n('乘客数不能大于6')
    }, {
        key: 50003,
        value: i18n('班次错误')
    }, {
        key: 50011,
        value: i18n('票价错误')
    }, {
        key: 60001,
        value: i18n('支付金额不正确')
    }, {
        key: 50013,
        value: i18n('预定票错误')
    }, {
        key: 10003,
        value: i18n('订单不存在')
    }, {
        key: 60004,
        value: i18n('订单状态有更新, 不支持取消该订单')
    }, {
        key: 40006,
        value: i18n('票的状态不是预定票')
    }, {
        key: 50019,
        value: i18n('取消订单失败')
    }, {
        key: 50000,
        value: i18n('系统错误')
    }, {
        key: 60002,
        value: i18n('卡券信息不能为空')
    }, {
        key: 60015,
        value: i18n('手机号码信息不能为空')
    }, {
        key: 60002,
        value: i18n('卡券信息不能为空')
    }, {
        key: 60016,
        value: i18n('卡券投放失败')
    }, {
        key: 60001,
        value: i18n('用户信息不存在')
    }, {
        key: 666,
        value: i18n('填写邮箱')
    }
    ]
    let isIn = false
    for (let value of ErrorList) {
        if (value.key === Number(code)) {
            that.$toast({
                txt: value.value
            })
            isIn = true
            break
        }
    }
    return isIn
}

export const fetch = function(config, redirect) {
    let promise = new Promise((resolve, reject) => {
        let plateParam = ''
        if (typeof (config.data) === 'object') {
            config.data = {
                ...config.data
            }
        }
        if (/get/i.test(config.method) && config.data) {
            config.params = {
                ...config.data
            }
        }
        // 不同车企的编号 放入url
        config.url = (config.url).replace(/\{vcode\}/, window.provider)
        // 不同语言的编号
        plateParam = config.url.indexOf('?') > -1 ? '&locale=' + window.locale : '?locale=' + window.locale
        config.url = config.url + plateParam

        axios(config).then(
            res => {
                // 跳转登录
                if (res.data.code === '50007') {
                    let queryAll = {}
                    if (!isEmpty(redirect)) {
                        let goTo = redirect.name ? { goTo: redirect.name } : { goTo: this.$router.name }
                        let subQuery = !isEmpty(redirect.query) ? redirect.query : {}
                        queryAll = {
                            ...goTo,
                            ...subQuery
                        }
                    } else {
                        let goTo = { goTo: this.$router.name }
                        queryAll = {
                            ...goTo
                        }
                    }
                    this.$hloading()
                    this.$router.push({
                        name: 'login',
                        query: {
                            ...queryAll
                        }
                    })
                    return
                }
                let isIn = getErrorMsg(this, res.data.code)
                // console.log('是否命中：' + isIn)
                if (isIn) return
                resolve(res.data)
            },
            e => {
                console.log(e)
                reject(e)
            }
        )
    })

    promise.catch(e => {
        console.log(e)
    })

    return promise
}

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, 'fetch', { value: fetch })
    }
}
