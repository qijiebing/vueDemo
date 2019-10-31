import { getCookie } from '../../libs/util.js'
// let redirect = sessionStorage.getItem('redirect')
export default function(fn, autoLogin) {
    const userInfo = {}
    let cookies = getCookie('WxUser')
    // let mid
    if (cookies) {
        cookies.split('&').forEach(item => {
            let key = item.split('=')
            if (key[0] === 'openid') {
                userInfo.openid = key[1]
            }
            if (key[0] === 'unionid') {
                userInfo.unionid = key[1]
            }
        })
    }

    if (userInfo.openid) {
        return userInfo
    } else {
        if (window.env === 'wx' || autoLogin) {
            // sessionStorage.setItem('redirect', 'redirected')
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3827070276e49e30&redirect_uri=https%3a%2f%2fwx.17u.cn%2fwxinfo%2fWxMember%2fRedirectBind%3furl%3d' + encodeURIComponent(encodeURIComponent(location.href)) + '%26hasCode%3dfalse%26setMember%3dtrue&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
        }
    }
}
