// 微信授权配置
// 非微信渠道方式报错
// import { getCityInfoByLocation } from '@/libs/location'

export default function(fn) {
    if (navigator.geolocation) {
        var options = {
            enableHighAccuracy: true
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                let poi = {
                    latitude: pos.coords.latitude, // 纬度，浮点数，范围为90 ~ -90
                    longitude: pos.coords.longitude
                } // 经度，浮点数，范围为180 ~ -180。
                // getCityInfoByLocation(poi).then(res => {
                //     console.log(res)
                // })
                fn && fn(poi)
            },
            e => {
                console.log('定位失败' + JSON.stringify(e))
            },
            options
        )
    } else {
        console.log('该设备不支持定位')
    }
}
