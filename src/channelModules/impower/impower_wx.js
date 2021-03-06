import jsonp from 'jsonp'
// import wx from 'weixin-js-sdk'
// Vue.use(fetch)

export default function() {
    // var WeixinJSBridge = window.WeixinJSBridge || window.wx
    function impowers() {
        let url = location.href.split('#')[0]
        jsonp(`//www.ly.com/huochepiao/resource/WXJsApi/GetWXApiConfig?url=${url}`, {}, function(err, data) {
            if (err) {
                console.warn(err)
            }
            window.wx.config({
                // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                debug: false,
                // 必填，公众号的唯一标识
                appId: data.Data.AppId,
                // 必填，生成签名的时间戳
                timestamp: data.Data.TimeStamp,
                // 必填，生成签名的随机串
                nonceStr: data.Data.NonceStr,
                // 必填，签名，见附录1
                signature: data.Data.Signature,
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                jsApiList: [
                    'checkJsApi',
                    // 分享渠道
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    // 菜单显示隐藏
                    'hideMenuItems',
                    'showMenuItems',
                    'showAllNonBaseMenuItem',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'openLocation',
                    'getLocation',
                    'scanQRCode',
                    // 支付与卡券
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            })
            window.wx.ready(() => {
                console.log('微信授权成功')
            })
        })
    }

    if (typeof window.WeixinJSBridge === 'undefined' || window.wx) {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', impowers, false)
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', impowers)
            document.attachEvent('onWeixinJSBridgeReady', impowers)
        }
    } else {
        return impowers()
    }
}
