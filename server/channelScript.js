/**
 * Created by gh on 2019/3/21.
 */

module.exports.getBridge = function(userAgent) {
    let bridgeUrl = ''
    // if (/tctravel/.test(userAgent)) {
    //     bridgeUrl = '<script type="text/javascript" src="https://js.40017.cn/touch/hb/c/bridge.2.4.7.js?v=20180522001"></script>'
    // } else if (/micromessenger/.test(userAgent)) {
    //     bridgeUrl = ''
    // } else if (/sq/.test(userAgent)) {
    //     bridgeUrl = '<script type="text/javascript" src="https://open.mobile.qq.com/sdk/qqapi.js?_bid=152"></script>'
    // } else {
    //     // 默认返回微信
    //     bridgeUrl = ''
    // }

    return bridgeUrl
}
