import Vue from 'vue'
import Router from 'vue-router'
import { getRefid, setCookie } from '@/libs/util'
import path from './path'
import store from '../store/index'

Vue.use(Router)

const route = new Router({
    // mode: 'history',
    base: '/tms/', // process.env.BASE_URL,
    routes: path
})

route.beforeEach((to, from, next) => {
    // console.log(to)
    // 设置title
    let toTitle = to.meta.title || ''
    let reg = /\#{[^}].*?\}/g
    let dynamicParam = toTitle ? toTitle.match(reg) : null
    // 自动设置title,根据mate中设置的动态参数设置，
    // TODO 记得添加默认title
    if (to.name === 'city') {
        console.log(to.query.currentType)
        if (to.query.currentType === 'start') {
            toTitle = 'From:Origin'
        } else {
            toTitle = 'To:Destination'
        }
    }
    if (dynamicParam) {
        let hasWrong = false
        for (let item of dynamicParam) {
            let a = item.replace(/#|\{|\}/g, '')
            let titleParam = to.query[a]
            // 如果参数中没有获取到数据，设标替换
            if (!titleParam) {
                hasWrong = true
            }
            toTitle = toTitle.replace(item, to.query[a])
        }
        if (to.name === 'list') {
            let IsReturnDate = !!to.query.returnDate
            let backTitle = to.query.endCity + '-' + to.query.startCity
            toTitle = IsReturnDate ? store.state.isDpt ? 'Depart:' + toTitle : 'Return:' + backTitle : toTitle
        }
        if (to.name === 'book') {
            let day = to.query.departDate.substr(5).replace('-', '月')
            toTitle = day + '日 ' + toTitle
        }
        toTitle = hasWrong ? to.meta.defaultTitle : toTitle
    }
    document.title = toTitle

    // 设置refid，获取refid的可能性，防止有交叉的拼写不一致
    let refid = to.query.refid || to.query.refId || to.query.RefId || to.query.Refid || getRefid() || '713686805'
    window.refId = refid
    // 设置refid
    document.cookie = `17uCNRefId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=17u.cn` // 设置前先清空
    setCookie('17uCNRefId', refid, '/', '17u.cn')
    setCookie('CNSEInfo', `RefId=${refid}&tcbdkeyid=&SEFrom=&SEKeyWords=&RefUrl=`, '/', '17u.cn')
    next()
})
route.afterEach(() => {
    window.scrollTo(0, 0)
})
export default route
