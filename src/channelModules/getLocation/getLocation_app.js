// import { getCityInfoByLocation } from '@/libs/location'
export default fn => {
    try {
        window._tc_bridge_map.app_location({
            param: {
                showType: '2',
                cacheType: '2',
                locationAlert: false
            },
            callback: data => {
                let result = JSON.parse(data.CBData)
                let back = {
                    latitude:
                        result.locationInfo.googleLat ||
                        result.locationInfo.lat,
                    longitude:
                        result.locationInfo.googleLon || result.locationInfo.lon
                }
                // getCityInfoByLocation(back).then(res => {
                //     console.log(res)
                // })
                fn && fn(back)
            }
        })
    } catch (e) {
        console.warn('同程APP定位' + e.message)
    }
}
