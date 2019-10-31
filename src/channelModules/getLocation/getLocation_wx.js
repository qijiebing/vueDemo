// import { getCityInfoByLocation } from '@/libs/location'
export default fn => {
    // if (window.wx) {
    // fn &&
    //     fn({
    //         latitude: 31.26249,
    //         longitude: 120.63212
    //     })
    window.wx && window.wx.ready(() => {
        window.wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function(resp) {
                fn && fn(resp)
            },
            fail: function(e) {
                // def.reject('微信API调用失败')
                console.log('location fail')
            },
            cancel: function(e) {
                // def.reject('微信API调用失败')
                console.log('location cancel')
            }
        })
    })
    // } else {

    // }
}
