/**
 * @description: 地图相关外部文件
 * @author: zr
 */
function getAMap() {
    var isLoaded = false
    return new Promise(function(resolve, reject) {
        if (isLoaded) {
            resolve(window.AMap)
            return
        }
        window.$$$maptcinit = function() {
            window.AMap.plugin(['AMap.Geocoder', 'AMap.ToolBar', 'AMap.Geolocation'], () => {
                resolve(window.AMap)
            })
            isLoaded = true
        }
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://webapi.amap.com/maps?v=1.4.3&key=e9e0b82f975fdee0aa10d46fb93cc55b&callback=$$$maptcinit'
        script.onerror = reject
        document.head.appendChild(script)
    })
}

export default getAMap
