// import { fetch } from './fetch'

const isString = obj => Object.prototype.toString.call(obj) === '[object String]'

const isPainObject = o => o && Object.prototype.toString.call(o) === '[object Object]' && 'isPrototypeOf' in o

const isEmpty = obj => {
    if (obj == null) return true
    if (Array.isArray(obj) || isString(obj)) return obj.length === 0
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false
    }
    return true
}

const isNumber = num => {
    return parseFloat(num).toString() !== 'NaN'
}

const isMobile = text => {
    let reg = /^(1[3-9])\d{9}$/
    return reg.test(text)
}

const isIDCard = idCard => {
    let num = idCard.toLowerCase().match(/\w/g)

    if (idCard.match(/^\d{17}[\dx]$/i)) {
        let sum = 0
        let times = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

        for (let i = 0; i < 17; i++) {
            sum += parseInt(num[i], 10) * times[i]
        }

        if ('10x98765432'.charAt(sum % 11) !== num[17]) {
            return false
        }

        return !!idCard.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/, '$1-$2-$3')
    }

    return false
}
const isEmail = email => {
    let reg = /^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i
    return reg.test(email)
}

const addZero = num => {
    num = num.toString()
    return num[1] ? num : '0' + num
}

const newDate = val => (isString(val) ? new Date(val.replace(/-/g, '/')) : new Date(val))

const addDate = (add = 1, date = new Date(), format = 'yyyy-MM-dd') => {
    let copyDate, newDay

    if (isString(date) || isNumber(date)) {
        copyDate = newDate(date)
    } else {
        copyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    newDay = new Date(copyDate.setDate(copyDate.getDate() + add))

    return {
        date: newDay,
        day: formatDate(newDay, format)
    }
}

const formatDate = (date = new Date(), format = 'yyyy-MM-dd') => {
    if (isString(date) || isNumber(date)) {
        date = newDate(date)
    }

    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
    }
    let w = [['日', '一', '二', '三', '四', '五', '六'], ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']]
    let now = new Date()
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    let diff = (start - today) / 86400000
    let text

    switch (diff) {
        case 0:
            text = '今天'
            break
        // case 1:
        //     text = '明天'
        //     break
        // case 2:
        //     text = '后天'
        //     break
        default:
            text = ''
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    if (/(w+)/.test(format)) {
        if (text) {
            format = format.replace(RegExp.$1, text)
        } else {
            format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()])
        }
    }

    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }

    return format
}

const getStore = name => {
    let val = window.localStorage.getItem(name)

    try {
        return JSON.parse(val)
    } catch (e) {
        return val || null
    }
}

const setStore = (name, content) => {
    if (!isString(content)) {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

const getSession = name => {
    let val = window.sessionStorage.getItem(name)

    try {
        return JSON.parse(val)
    } catch (e) {
        return val || null
    }
}

const setSession = (name, content) => {
    if (!isString(content)) {
        content = JSON.stringify(content)
    }
    window.sessionStorage.setItem(name, content)
}

const getCookie = key => (new RegExp('[; ]' + key + '=([^;]*);?').test('; ' + document.cookie) ? decodeURIComponent(RegExp.$1) : '')

const setCookie = (key, value, path, domain, expiration, undecodes) => {
    let str = key + '=' + (undecodes ? value : encodeURIComponent(value))
    if (expiration) {
        let type = typeof expiration
        // 数字，单位 分钟
        if (type === 'number') {
            expiration = new Date().getTime() + expiration * 60 * 1000
        } else if (type === 'string') {
            expiration = new Date(
                expiration
                    .replace(/-/g, '/')
                    .replace(/T/, ' ')
                    .replace(/\.\d*$/, '')
            )
        }
        str += '; expires=' + new Date(expiration).toGMTString()
    }
    if (path) {
        str += '; path=' + path
    }
    if (domain) {
        str += '; domain=' + domain
    }

    document.cookie = str
}

/**
 * 格式化身份证号码
 * @param num
 */
const formatIDCard = num => {
    let result = ''
    num = (num || '').toString()
    result = num.length <= 6 ? num : num.length > 6 && num.length <= 14 ? num.substr(0, 6) + ' ' + num.substr(6) : num.substr(0, 6) + ' ' + num.substr(6, 8) + ' ' + num.substr(14)
    return result
}

const getQueryString = paramKey => {
    let url = window.location.href.split('?')[1] || ''
    let params = {}

    url = url.replace(/#.*$/, '').split('&')

    for (let i = 0; i < url.length; i++) {
        let num = url[i].indexOf('=')
        if (num > 0) {
            let key = decodeURIComponent(url[i].substring(0, num))
            let val = url[i].substr(num + 1) || ''
            try {
                val = decodeURIComponent(val)
            } catch (ex) {}
            params[key] = val
        }
    }
    return params[paramKey]
}

const getRefid = () => {
    let refid = getQueryString('refid') || getQueryString('refId') || getQueryString('RefId') || getQueryString('Refid')
    return refid || getCookie('17uCNRefId') || '713686805'
}

const deepCopy = obj => {
    let result = Array.isArray(obj) ? [] : {}

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key])
            } else {
                result[key] = obj[key]
            }
        }
    }
    return result
}

const formatParams = data => {
    let arr = []

    for (let name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
    }

    return '?' + arr.join('&')
}

const getJsonp = params => {
    params.data = params.data || {}
    params.time = params.time || '5000'

    let callbackName = 'jsonp' + new Date().getTime()
    let body = document.body
    let script = document.createElement('script')
    let pdata

    params.data['callback'] = callbackName
    pdata = formatParams(params.data)

    window[callbackName] = function(json) {
        body.removeChild(script)
        clearTimeout(script.timer)
        window[callbackName] = null
        params.success && params.success(json)
    }

    script.src = params.url + pdata
    body.appendChild(script)

    script.timer = setTimeout(function() {
        body.removeChild(script)
        window[callbackName] = null
        params.error &&
            params.error({
                message: '超时'
            })
    }, params.time)
}

/**
* 浮点乘法
* @param arg1 [Number]被乘数
* @param arg2 [Int]乘数，必须为整数
*/
const accMulti = (arg1, arg2) => {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.error && console.error('accMulti method has at least two Number parameters: arg1: ' + arg1 + '; arg2: ' + arg2)
    }

    let total = 0
    for (let i = 0; i < arg2; i++) {
        total = accAdd(total, arg1)
    }

    return total
}

// 浮点数加法
const accAdd = (arg1, arg2) => {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.error && console.error('accAdd method has at least two Number parameters: arg1: ' + arg1 + '; arg2: ' + arg2)
    }

    return accAddSub(arg1, arg2, true)
}

/**
*浮点数减法，被减数、减数的顺序不能颠倒
* @param {Number} arg1 被减数arg1-arg2
* @param {Number} arg2 减数arg1-arg2
*/
const accSub = (arg1, arg2) => {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.error && console.error('accSub method has at least two Number parameters: arg1: ' + arg1 + '; arg2: ' + arg2)
    }

    return accAddSub(arg1, arg2, false)
}

/**
* 浮点数加减法函数，用于得到精确的加减法结果。数字顺序：arg1 - arg2 || arg1 + arg2
* @param {Number} arg1
* @param {Number} arg2
* @param {Boolean} isAdd 是否为加法
* @return {Number} 计算结果
*/
const accAddSub = (arg1, arg2, isAdd) => {
    let twoMinusNum = false // 两个负数
    let subArg1LessThanArg2 = false // 减法的场景下，被减数小于减数

    if (arg1 < 0 && arg2 < 0) { // 两个负数
        if (isAdd) { // 两个负数相加，转成整数，结果中加上-号
            twoMinusNum = true
            arg1 = Math.abs(arg1)
            arg2 = Math.abs(arg2)
        } else { // 两个负数相减，(-2)-(-3)  ==> -2+3 ==> 3-2，两个负数相减，转成正数相减
            return accAddSub(Math.abs(arg2), arg1)
        }
    }

    if (arg1 >= 0 && arg2 < 0) {
        let tmp = arg1
        arg1 = arg2
        arg2 = tmp
    }

    if (arg1 < 0 && arg2 >= 0) { // 一个负数
        if (isAdd) { // -1 加 2 转成减法 2 减 1
            return accAddSub(arg2, Math.abs(arg1))
        } else { // -1 减 2 转成加法 -1 加 -2
            return accAddSub(arg1, parseFloat('-' + arg2), true)
        }
    }

    arg1 = arg1
        ? (isNaN(parseFloat(arg1)) ? 0 : arg1)
        : 0
    arg2 = arg2
        ? (isNaN(parseFloat(arg2)) ? 0 : arg2)
        : 0

    let r1, r2, n

    // 小数位长度
    r1 = (arg1.toString().split('.')[1] || '').length
    r2 = (arg2.toString().split('.')[1] || '').length

    // 整数加减，则直接相加减，并退出
    if (r1 === 0 && r2 === 0) {
        return isAdd
            ? (twoMinusNum ? ('-') + (arg1 + arg2) : (arg1 + arg2))
            : (arg1 - arg2)
    }

    n = Math.max(r1, r2) // 小数位长度最大值

    // 小数转换为整数
    arg1 = Number(arg1.toString().replace('.', '')) // 5.431 => 5431
    arg2 = Number(arg2.toString().replace('.', '')) // 4.12 => 412

    if (r1 > r2) {
        arg2 = arg2 * Math.pow(10, r1 - r2) // 412 * 10^1 = 4120
    } else if (r2 > r1) {
        arg1 = arg1 * Math.pow(10, r2 - r1)
    }

    let res
    if (isAdd) { // 加法
        res = Array.from((arg1 + arg2).toString())// 将数值转为字符串再转为数组 ['9','5','5','1']
    } else { // 减法
        if (arg1 < arg2) { // 被减数小于减数
            subArg1LessThanArg2 = true
            let tmp = arg1
            arg1 = arg2
            arg2 = tmp
        }
        res = Array.from((arg1 - arg2).toString())// 将数值转为字符串再转为数组 ['1','3','1','1']
    }

    if (res.length < n) {
        for (let i = 0; i < n - res.length; i++) { // ['1'].splice(-2, 0, '.') 为 ['.', '1']有问题，应该等于['.','0',1]
            res.unshift('0')
        }
    }
    res.splice(-1 * n, 0, '.') // 数组中插入"." => ['9','.','5','5','1'] || ['1','.','3','1','1']

    let retVal = parseFloat(res.join('')) // 9.551 || 1.311

    return (twoMinusNum || subArg1LessThanArg2) ? ('-') + retVal : retVal
}

/**
 *  获取参数信息
 *  @param {string} name 参数名称
 *  @return {string} 参数值
 */
const getParams = (name, str) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = str ? str.match(reg) : window.location.search.substr(1).match(reg)

    if (r != null) return decodeURIComponent(r[2])
    return null
}

export { deepCopy, isEmpty, isMobile, isIDCard, isEmail, addZero, newDate, addDate, formatDate, getStore, setStore, getSession, setSession, getCookie, setCookie, formatIDCard, getQueryString, isPainObject, getRefid, getJsonp, formatParams, accMulti, accSub, accAdd, getParams }
