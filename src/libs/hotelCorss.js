export default function() {
    return new Promise((resolve, reject) => {
        let count = 0

        if (window.OrderCross) {
            resolve(window.OrderCross)
            return false
        }

        let getJs = () => {
            if (count > 30) return false

            if (typeof window.OrderCross === 'undefined') {
                setTimeout(() => {
                    getJs()
                    count++
                }, 300)
            } else {
                resolve(window.OrderCross)
            }
        }

        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = '//wx.17u.cn/hcpzt/hx/comp/ylhotelTraindetail'
        script.onerror = reject
        document.head.appendChild(script)

        setTimeout(() => {
            getJs()
        }, 200)
    })
}
