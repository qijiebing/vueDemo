// import e
import env from '../config/env'
export default {
    // 页面访问统计，在router中触发
    tcvst: function(params) {
        let chanel = {
            wx: '10003',
            app: '10007',
            qq: '10006',
            m: '10004',
            mina: '10003'
        }
        let _vrcode = `${chanel[env]}-2079-0`
        let _tcq = []
        let _timediff = -1

        // let pg = location.href
        // let orgpg = location.pathname.split('/')[1] + '/#' + params.path || ''
        // console.log(orgpg)
        window._tcq = _tcq
        if (typeof window._tcopentime !== 'undefined') {
            _timediff = new Date().getTime() - window._tcopentime
        }
        _tcq.push(['_serialid', `${params.serialid || ''}`]) // 如果是下单页面，需要传入订单号，多个订单号用下划分割 "_"
        _tcq.push(['_vrcode', _vrcode]) // 产品号见下面解释，最后一位默认为0，写成其他的统计不到，此条代码最重要
        _tcq.push(['_refId', window.refId]) // Refid需要传入来源refid，不同平台的读取方法不同，项目自己读取Refid
        _tcq.push(['_userId', '']) // 传入访问者中登录的会员ID，未登录的为0，不同平台的读取方法不同，项目自己读取会员ID
        _tcq.push(['_openTime', _timediff])
        _tcq.push(['_trackPageview', params.openid || '0']) // 虚拟url，项目自己定义,如:/Touch站/首页，只针对微信，在此项原基础上修改为：_tcq.push(['_trackPageview', ' openid||xxx ']),即在pageview所传值的前面加“openid||”（即openid+双竖线）
        _tcq.push(['_resId', '']) // 新增项：资源id（只针对详情页\交通类项目的订单填写页  需要添加该项）----有疑问可联系@支夏萍
        _tcq.push(['_unionid', params.unionid]) // unionid
        _tcq.push(['_flag', false]) // ---页面为单页时才需要增加此条代码，关闭自动数据收集，必须手动调用此方法_tcTraObj._tcTrackPage(pagename,orgpagename)
        _tcq.push(['_openid', params.openid]) // 手动传入openid
        // let
        // console.log(_tcq)
        let pagename = location.href.split('17u.cn/')[1] || ''
        if (typeof window._tcTraObj === 'undefined') {
            setTimeout(() => {
                console.log('setTime')
                window._tcTraObj._tcTrackPage(pagename, '')
            }, 200)
        } else {
            window._tcTraObj._tcTrackPage(pagename, '')
        }
    },
    tcEvent: function(category, action, label, value) {
        try {
            action = action ? window.productNames[action] : 'noaction'
            label = label || 'linebus-click'
            value = value ? `^${value.replace(/(,|，)/g, '^')}^` : ''
            window._tcTraObj._tcTrackEvent(`${env}-${category}`, `汽车票-线路车-${action}`, label, value)
        } catch (e) {}
    }
}
