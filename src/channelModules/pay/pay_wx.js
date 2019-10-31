import Vue from 'vue'
import api from '@/config/api'

let pay = paybody => {
    let onBridgeReady = () => {
        return new Promise(resolve => {
            // let WeixinJSBridge = window.WeixinJSBridge
            console.log(JSON.stringify(window.wx))
            // alert(
            //     JSON.stringify({
            //         appId: paybody.AppId, // 公众号名称，由商户传入
            //         timeStamp: paybody.TimeStamp, // 时间戳，自1970年以来的秒数
            //         nonceStr: paybody.NonceStr, // 随机串
            //         package: paybody.Package,
            //         signType: paybody.mergeOrder ? 'HMAC-SHA256' : 'MD5',
            //         paySign: paybody.Sign // 微信签名
            //     })
            // )
            window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    appId: paybody.AppId, // 公众号名称，由商户传入
                    timeStamp: paybody.TimeStamp, // 时间戳，自1970年以来的秒数
                    nonceStr: paybody.NonceStr, // 随机串
                    package: paybody.Package,
                    signType: paybody.mergeOrder ? 'HMAC-SHA256' : 'MD5',
                    paySign: paybody.Sign // 微信签名
                },
                res => {
                    console.log('wx pay res')
                    console.log(res)
                    resolve(res)
                }
            )
        })
    }

    if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
    } else {
        return onBridgeReady()
    }
}

let getPayInfo = params => {
    return new Promise((resolve, reject) => {
        Vue.prototype
            .fetch({
                url: api.getWXPayInfo,
                method: 'POST',
                data: params
            })
            .then(result => {
                if (result.success && result.body) {
                    if (result.body.TenAppPay) {
                        pay(result.body.TenAppPay).then(back => {
                            resolve(back)
                        })
                    } else if (result.body.WinXinPay) {
                        result.body.WinXinPay.mergeOrder = true
                        pay(result.body.WinXinPay).then(back => {
                            resolve(back)
                        })
                    } else {
                        reject()
                    }
                } else {
                    reject()
                }
            })
            .catch(e => {
                console.warn('支付接口挂了')
                console.warn(e)
                reject()
            })
    })
}

export default getPayInfo
