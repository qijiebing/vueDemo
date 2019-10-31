import { comMutations } from '../common'
import { getLocation } from '@/channelModules/index'
import { getCityInfoByLocation } from '@/libs/location'
import api from '@/config/api'
import { isEmpty, setSession, getSession } from '@/libs/util'

const state = {
    // ---- 全局配置 ----
    locale: window.env || 'zh',
    openId: '',
    unionId: '',
    memberId: '',
    isLogin: false,
    // 出发城市信息
    startCity: {},
    // 到达城市信息
    endCity: {},
    // 出发日期
    depDate: '',
    returnDate: '',
    chooseDate: '',
    // 日历价格缓存
    calendarList: [],
    // 是否是往返票
    isReturn: false,
    // 是出发，否 则到达
    isDpt: true,
    // 首页到列表页面的传参
    query: {},
    // 座位数量
    seatAmount: 0, // 选座最多六个
    seatAmountB: 0, // 选座最多六个
    scheduleDetailId: 0,
    ticketMsg: {
        departInfo: {},
        returnInfo: {}
    }, // 选座票信息
    seatSelected: [],
    seatSelectedB: [],
    localCityInfo: {},
    selectedPassengerx: [],
    home: 'home',
    travel: 'Travel Assistant',
    my: 'Mine',
    DownList: [],
    couponList: [],
    checkedCoupon: '' // 已选的优惠券index
}
const getters = {}
const mutations = {
    ...comMutations,
    // SET_OPENID(state, data) {
    //     state.openId = data
    // }
    // 设置城市信息
    SET_LOCALINFO(state, data) {
        console.log(data)
        state.localCityInfo = data
    },
    SET_LOCALE(state, data) {
        state.locale = data
    }
}
const actions = {
    // 异步获取城市信息
    async getLocationCity({ commit, state }) {
        if (!state.wxAuthed) {
            commit('SET_LOCALINFO', {})
            window.$tcevt('城市选择页', state.productType, `定位失败`, `定位失败`)
            return
        }
        const getlos = await getLocation()
        getlos(res => {
            console.log(res)
            getCityInfoByLocation(res).then(cityInfo => {
                if (cityInfo.body) {
                    let infos = {
                        scenicId: 0,
                        scenicName: '',
                        cityType: 1, // 1：城市，2：景点，3：机场，4：站点
                        cityName: cityInfo.body.cityName.replace('市', ''),
                        cityId: cityInfo.body.busCityId,
                        isPos: true,
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                    commit('SET_LOCALINFO', infos)
                    window.$tcevt('城市选择页', state.productType, `定位成功`, `成功${cityInfo.body.cityName}`)
                } else {
                    window.$tcevt('城市选择页', state.productType, `定位失败`, `定位失败`)
                }
            })
        })
    },
    // 获取班次详情
    // 2.5和book页面都会有，放到这边
    getLineInfo({ commit }, params) {
        // 先获取sessionStorage中的数据，如果有的话就不走
        // 数据存储使用shardingkey防止有的未走中转，导致获取历史的session数据，这样key具有唯一性
        // let sessionInfo = getSession('lineInfo-' + this.$route.query.shardingKey)
        // TODO 开发的时候方便看数据，先注释掉
        let lineInfo = getSession('scheduleInfo-' + params.scheduleCalId + params.segmentType)
        if (lineInfo) {
            commit('SET_LINEINFO', lineInfo)
            return
        }
        window.app.$loading({ txt: '正在获取班次详情...' })
        window.app
            .fetch({
                url: api.getScheduleDetail,
                method: 'POST',
                data: {
                    ...params
                }
            })
            .then(res => {
                window.app.$hloading()
                if (res.errCode === 'EC_ALL_00000' && !isEmpty(res.body)) {
                    setSession('scheduleInfo-' + params.scheduleCalId + params.segmentType, res.body)
                    commit('SET_LINEINFO', res.body)
                } else {
                    window.app.$toast({
                        txt: '班次信息已过期，请重新选择班次'
                    })
                    setTimeout(() => {
                        window.app.$router.go(-1)
                    }, 2100)
                }
            })
            .catch(e => {
                window.app.$hloading()
            })
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}
