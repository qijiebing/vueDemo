import { getCookie } from '../../libs/util.js'

export default function(autoLogin) {
    // window.vm.$showLoading()
    let user = getCookie('cnUser')
    let memberid

    if (user) {
        user.split('&').forEach(item => {
            let key = item.split('=')

            if (key[0] === 'userid') {
                memberid = key[1]
            }
        })
    }

    if (!memberid) {
        if (autoLogin) {
            var url = `//passport.ly.com/m/login.html?returnUrl=${encodeURIComponent(
                location.href
            )}`

            location.href = url
        } else {
            return { memberid: '' }
        }
    } else {
        return { memberid }
    }
}
