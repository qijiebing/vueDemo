export default async function(fn, autoLogin) {
    let appInfo = await (() => {
        return new Promise(resolve => {
            // 先判断登录，未登录会弹窗，再去拿用户信息
            window._tc_bridge_user.user_login({
                callback: () => {
                    window._tc_bridge_user.get_device_info({
                        callback: data => {
                            resolve(JSON.parse(data.CBData))
                        }
                    })
                }
            })
        })
    })()

    return {
        memberId: appInfo.memberInfo.memberId,
        appUserInfo: appInfo
    }
}
