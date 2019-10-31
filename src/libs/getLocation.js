import { fetch } from './fetch'

const M_PI = 3.14159265358979324
const a = 6378245.0
const ee = 0.00669342162296594323

// 每次页面刷新只获取一次，其他直接返回
let locationInfo = null
let locationErr = false
let queue = []

// APP定位
let getTCAppLocation = () => {
    return new Promise((resolve, reject) => {
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
                            result.locationInfo.googleLon ||
                            result.locationInfo.lon
                    }

                    resolve(back)
                }
            })
        } catch (e) {
            console.warn('同程APP定位' + e.message)
            reject(e.message)
        }
    })
}

// 微信定位
let getWxLocation = () => {
    return new Promise((resolve, reject) => {
        window.wx.getLocation({
            type: 'gcj02',
            success(response) {
                resolve(response)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

// 浏览器定位
let getInternetLocation = () => {
    return new Promise((resolve, reject) => {
        var body = document.body
        var iframe = document.createElement('iframe')

        window._h5LocationCallback = function(err, position) {
            if (!err) {
                var result = wgs2gcj({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
                resolve(result)
            } else {
                reject(err)
            }
            body.removeChild(iframe)
        }

        iframe.style.display = 'none'
        // 一定要在
        iframe.setAttribute(
            'src',
            'javascript:(function(){ window.navigator.geolocation.getCurrentPosition(function(position){parent && parent._h5LocationCallback && parent._h5LocationCallback(null,position);}, function(err){parent && parent._h5LocationCallback && parent._h5LocationCallback(err);}, {enableHighAccuracy: true, maximumAge: 30000, timeout: 12000});})()'
        )
        body.appendChild(iframe)
    })
}

// 纬度转换
let wgs2gcjLat = (x, y) => {
    var ret1 =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x))

    ret1 +=
        ((20.0 * Math.sin(6.0 * x * M_PI) + 20.0 * Math.sin(2.0 * x * M_PI)) *
            2.0) /
        3.0
    ret1 +=
        ((20.0 * Math.sin(y * M_PI) + 40.0 * Math.sin((y / 3.0) * M_PI)) *
            2.0) /
        3.0
    ret1 +=
        ((160.0 * Math.sin((y / 12.0) * M_PI) +
            320 * Math.sin((y * M_PI) / 30.0)) *
            2.0) /
        3.0
    return ret1
}

// 经度转换
let wgs2gcjLng = (x, y) => {
    var ret2 =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x))
    ret2 +=
        ((20.0 * Math.sin(6.0 * x * M_PI) + 20.0 * Math.sin(2.0 * x * M_PI)) *
            2.0) /
        3.0
    ret2 +=
        ((20.0 * Math.sin(x * M_PI) + 40.0 * Math.sin((x / 3.0) * M_PI)) *
            2.0) /
        3.0
    ret2 +=
        ((150.0 * Math.sin((x / 12.0) * M_PI) +
            300.0 * Math.sin((x / 30.0) * M_PI)) *
            2.0) /
        3.0
    return ret2
}

// 超出中国
let outOfChina = (lat, lon) => {
    if (lon < 72.004 || lon > 137.8347) {
        return true
    }
    if (lat < 0.8293 || lat > 55.8271) {
        return true
    }
    return false
}

// wgs坐标转gcj
let wgs2gcj = poi => {
    if (outOfChina(poi.lat, poi.lng)) {
        return {
            latitude: poi.lat,
            longitude: poi.lng
        }
    }
    var poi2 = {}
    var dLat = wgs2gcjLat(poi.lng - 105.0, poi.lat - 35.0)
    var dLon = wgs2gcjLng(poi.lng - 105.0, poi.lat - 35.0)
    var radLat = (poi.lat / 180.0) * M_PI
    var magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * M_PI)
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * M_PI)
    poi2.latitude = poi.lat + dLat
    poi2.longitude = poi.lng + dLon
    return poi2
}

let getRealLocation = (function() {
    if (window.env === 'wx') {
        // return process.env.NODE_ENV === 'development' ? getWxLocation : getInternetLocation
        return getWxLocation
    } else if (window.env === 'app') {
        return getTCAppLocation
    } else {
        return getInternetLocation
    }
})()

let getCityByLocation = ({ latitude, longitude }) => {
    return fetch({
        url: 'address/mobile/regeoaddress',
        method: 'get',
        data: {
            longitude,
            latitude
        }
    })
}

// 获取定位并返回定位信息
let getLocation = () => {
    console.log('in location')
    return new Promise((resolve, reject) => {
        if (locationInfo && !locationErr) {
            return resolve(locationInfo)
        }

        if (locationErr) {
            return reject(locationInfo)
        }

        if (!queue.length) {
            queue.push([resolve, reject])
            getRealLocation()
                .then(response => {
                    getCityByLocation(response).then(
                        res => {
                            if (res.data.code === '200') {
                                var _info = {
                                    ...res.data.data,
                                    latitude: response.latitude,
                                    longitude: response.longitude
                                }
                                locationInfo = _info
                                queue.forEach(item => item[0](_info))
                            } else {
                                locationErr = true
                                queue.forEach(item => item[1](res))
                            }
                            queue.length = 0
                        },
                        e => {
                            locationErr = true
                            queue.forEach(item => item[1](e))
                            queue.length = 0
                        }
                    )
                })
                .catch(e => {
                    locationErr = true
                    console.log(e)
                    queue.length = 0
                })
        } else {
            queue.push([resolve, reject])
        }
    })
}

export { getCityByLocation, getLocation }
