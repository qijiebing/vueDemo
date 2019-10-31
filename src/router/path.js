import en from '../locales/en.json'
import th from '../locales/th.json'
import env from '../config/env'
let envs = env
console.log(envs)
// console.log(en['始发'])
function i18n(name) {
    if (window.locale === 'en') {
        return en[name]
    } else if (window.locale === 'th') {
        return th[name]
    }
}
export default [
    {
        path: '/(index)?',
        name: 'home',
        meta: {
            // 动态参数标题，根据url参数改变标题
            // title: '#{name}-#{endName}'
            title: i18n('首页')
        },
        component: () => import('@/views/home/Home'),
        children: [
            {
                // 城市选择页面
                path: 'city',
                name: 'city',
                meta: {
                    title: i18n('城市选择')
                },
                component: () => import('@/views/home/children/city/index.vue')
            },
            {
                // 日期选择页面
                path: 'calendar',
                name: 'calendar',
                meta: {
                    title: i18n('日期选择')
                },
                component: () => import('@/components/calendar/index.vue')
            },
            {
                // 文字详情
                path: 'detail',
                name: 'detail',
                meta: {
                    title: i18n('详情')
                },
                component: () => import('@/views/home/children/detail/detail.vue')
            },
            {
                // language
                path: 'language',
                name: 'language',
                meta: {
                    title: i18n('切换语言')
                },
                component: () => import('@/views/home/children/language/language.vue')
            }
        ]
    },
    {
        path: '/list',
        name: 'list',
        beforeEnter: (to, from, next) => {
            // console.log('★★★beforeEnter★★★')
            // console.log(to)
            // console.log(from)
            next()
        },
        meta: {
            title: '#{startCity}-#{endCity}',
            defaultTitle: i18n('班次列表')
        },
        component: () => import('@/views/list/index'),
        children: [
            {
                path: 'listCalendar',
                name: 'listCalendar',
                meta: {
                    title: i18n('日期选择')
                },
                component: () => import('@/components/calendar/index.vue')
            },
            {
                path: 'chairs',
                name: 'chairs',
                meta: {
                    title: i18n('选择座位')
                },
                component: () => import('@/views/list/children/selectChair.vue')
            }
        ]
    },
    {
        path: '/selectChair',
        name: 'selectChair',
        meta: {
            title: i18n('选择座位')
        },
        component: () => import('@/views/selectChair/index')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: i18n('登录')
        },
        component: () => import('@/views/login/login'),
        children: [
            {
                path: 'register',
                name: 'register',
                meta: {
                    title: i18n('用户注册')
                },
                component: () => import('@/views/login/children/register/register.vue')
            },
            {
                path: 'fillmsg',
                name: 'fillmsg',
                meta: {
                    title: i18n('完善信息')
                },
                component: () => import('@/views/login/children/fillmsg/fillmsg.vue')
            }
        ]
    },
    {
        path: '/book',
        name: 'book',
        meta: {
            title: i18n('填写订单')
        },
        component: () => import('@/views/book/book'),
        children: [
            {
                path: 'addPsger',
                name: 'addPsger',
                meta: {
                    title: i18n('添加乘客')
                },
                component: () => import('@/views/book/children/addPsger/addPsger.vue')
            },
            {
                path: 'couponListt',
                name: 'couponListt',
                meta: {
                    title: i18n('卡券')
                },
                component: () => import('@/views/coupon/index')
            }
        ]
    },
    {
        path: '/payment',
        name: 'payment',
        meta: {
            title: i18n('支付')
        },
        component: () => import('@/views/payment/payment'),
        children: [
            {
                path: 'ticketPolicy',
                name: 'ticketPolicy',
                meta: {
                    title: i18n('Ticketing policy')
                },
                component: () => import('@/views/payment/children/ticketPolicy/ticketPolicy.vue')
            },
            {
                path: 'addCard',
                name: 'addCard',
                meta: {
                    title: i18n('添加信用卡')
                },
                component: () => import('@/views/payment/children/addCard/addCard.vue')
            }
        ]
    },
    {
        path: '/payResult',
        name: 'payResult',
        meta: {
            title: i18n('支付')
        },
        component: () => import('@/views/payment/payResult')
    },
    {
        path: '/orderdetail',
        name: 'orderdetail',
        meta: {
            title: i18n('订单详情')
        },
        component: () => import('@/views/orderdetail/orderdetail')
    },
    {
        path: '/orderlist',
        name: 'orderlist',
        meta: {
            title: i18n('订单列表')
        },
        component: () => import('@/views/orderlist/orderlist')
    },
    {
        path: '/couponList',
        name: 'couponList',
        meta: {
            title: i18n('卡券')
        },
        component: () => import('@/views/coupon/index')
    },
    {
        path: '/getCoupon',
        name: 'getCoupon',
        meta: {
            title: i18n('领取卡券')
        },
        component: () => import('@/views/getCoupon/getCoupon')
    }
]
