import fetch from '@/libs/fetch'
function pay(paybody) {
    let onBridgeReady = () => {
        return new Promise((resolve, reject) => {
            var WeixinJSBridge = window.WeixinJSBridge || window.wx
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    appId: paybody.appId, // 公众号名称，由商户传入
                    timeStamp: paybody.timestamp, // 时间戳，自1970年以来的秒数
                    nonceStr: paybody.nonceStr, // 随机串
                    package: paybody.packageObj,
                    // 'signType': 'MD5', // 微信签名方式：
                    signType: paybody.mergeOrder ? 'HMAC-SHA256' : 'MD5',
                    paySign: paybody.sign // 微信签名
                },
                res => {
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                        resolve(res)
                        // 支付成功
                    } else if (
                        res.err_msg === 'get_brand_wcpay_request:cancel'
                    ) {
                        resolve(res)
                        // 支付取消
                    } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                        reject(res)
                        // 支付失败
                    } else {
                        resolve(res)
                        // 其他 未知
                    }
                }
            )
        })
    }

    if (typeof window.WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
            document.addEventListener(
                'WeixinJSBridgeReady',
                onBridgeReady,
                false
            )
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
    } else {
        return onBridgeReady()
    }
}

export default (params, cb) => {
    // alert(1)
    console.log('wxpay')
    let datas = {
        orderNo: params.orderNo,
        openId: params.openId,
        unionId: ''
    }
    // 单独购买保险时多传insuranceAloneBuyFlag
    if (params.insuranceAloneBuyFlag) {
        datas.insuranceAloneBuyFlag = params.insuranceAloneBuyFlag
    }
    fetch({
        method: 'get',
        url: 'orderpay/getwxpayparam',
        data: datas
    }).then(res => {
        pay.call(this, res)
    })
}
