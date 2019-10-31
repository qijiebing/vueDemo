// import { isEmpty, getJsonp } from '../libs/util'
import jsonp from 'jsonp'
import store from '../store/index'
export default function() {
    return new Promise(resolve => {
        let url = location.href.split('#')[0]
        jsonp(`//www.ly.com/huochepiao/resource/WXJsApi/GetWXApiConfig?url=${url}`, {}, function(err, data) {
            if (err) {
                console.warn(err)
                resolve()
            }
            try {
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
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ]
                })
                window.wx.ready(() => {
                    store.commit('SET_WXAUTH', true)
                    console.log('微信授权成功')
                })
                resolve()
            } catch (e) {
                console.log(e)
                resolve()
            }
        })
    })
}
