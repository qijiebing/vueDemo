<template>
    <div class='schedule-box' :class="{'pt216':isReturn && title}">
        <top-calendar :title="title" :isReturn="isReturn" :urlData="queryParams" :isDpt="isDpt"></top-calendar>
        <div class="recommond nodata" v-if='isFilter && filterSchedule.length===0'>
            <p class='nofilter'>{{$t('抱歉,没有符合筛选条件的班次')}}</p>
            <p class='notext'>{{$t('您可以选择')}}<span class="reset" @click="btnResetFilter">{{$t('撤销筛选条件')}}</span></p>
        </div>
        <skeleton-list v-if="isGettingSchedule"></skeleton-list>
        <template v-else>
            <template v-if='hasList'>
                <!-- <div class="banner border-bottom" v-if="title && isReturn">{{title}}</div> -->
                <schedule-item scheduleType='1' :getCurrentDate='getCurrentDate' :list='!isFilter?schedules:filterSchedule' v-if='schedules.length>0' :limit='goToCoupon'></schedule-item>
            </template>
            <p class="recommond nodata" v-if="!hasList && !isFilter">{{queryParams.startCity}}{{queryParams.endCity?"-"+queryParams.endCity:''}}{{$t('暂时无线路')}}</p>
        </template>
        <filter-item
            v-if="isShowFilter"
            :indexSelected='filtered'
            :filterCategory='filterCategory'
            @filterGetSchedule='filterConfirm'
        ></filter-item>
        <p class="bottom hidden" ref='tips'></p>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import topCalendar from './topCalendar'
import scheduleItem from './schedule-item'
import skeletonList from './skeleton'
import filterItem from './filters/filter'
import api from '@/config/api'
import { mapState, mapMutations } from 'vuex'
import { isEmpty, formatDate, newDate, addDate } from '@/libs/util'
import event from '@/libs/event'

export default {
    data() {
        return {
            title: '', // 往返的title提示
            schedules: [],
            iswx: window.env === 'wx',
            // 当前页
            currentPage: 0,
            // 会否还有班次分页
            goOnLoad: true,
            filterCategory: {},
            isShowFilter: true,
            isFilterNoData: false,
            filtered: {
                dptTimeSpan: [],
                departStation: [],
                arriveStation: []
            },
            // 节流状态，减少损耗
            isLoading: false,
            isGettingSchedule: false,
            queryParams: {},
            screenHeight: document.body.clientHeight,
            goToCoupon: false,
            hasList: true,
            today: formatDate(),
            isFilter: false,
            filterSchedule: [],
            getCurrentDate: ''
        }
    },
    computed: {
        ...mapState(['depDate', 'chooseDate', 'returnDate', 'unionId', 'openId', 'memberId', 'isReturn', 'isDpt', 'ticketMsg'])
    },
    components: {
        topCalendar,
        scheduleItem,
        filterItem,
        skeletonList
    },
    created() {
        this.initParams()
    },
    mounted() {
        try {
            event.tcvst({
                unionid: this.unionId,
                openid: this.openId,
                mid: this.memberId
            })
        } catch (e) {
            console.log(e)
        }
    },
    filters: {
        dateFormat(value = addDate().day) {
            return formatDate(value, 'MM月dd日')
        }
    },
    watch: {
        async chooseDate(val) {
            // 重新选择日期 数据清空
            await this.initSchdeuleData()
            this.queryParams.startDay = val || formatDate()
            this.filtered = {
                dptTimeSpan: [],
                departStation: [],
                arriveStation: []
            }
            this.getSchedule()
        }
    },
    beforeRouteEnter(to, from, next) {
        console.log('★★★beforeEnter★★★')
        let isDpt = false
        console.log(from)
        if (Number(to.query.isDpt) === 1) {
            isDpt = true
        } else {
            isDpt = false
        }
        let toTitle = ''
        if (isDpt) {
            toTitle = 'Depart:' + to.query.startCity + '-' + to.query.endCity
            document.title = toTitle
        } else {
            toTitle = 'Return:' + to.query.endCity + '-' + to.query.startCity
            document.title = toTitle
        }
        next(vm => {
            vm.title = toTitle
            if (isDpt) {
                vm.setData({
                    isDpt: isDpt,
                    title: toTitle
                })
            }
        })
    },
    methods: {
        ...mapMutations(['setData']),
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用；不！能！获取组件实例 `this`；因为当守卫执行前，组件实例还没被创建
            console.log('▲beforeRouteEnter')
            // //滚动位置恢复
            // let scrollToPos = () => {
            //     if(from.name == 'book' || from.name == 'ticketpackage'){//滚动位置恢复
            //         document.querySelector('.listWrap').scrollTop = to.meta.scrollTop;
            //     }
            // }
            // 登录接口 autoLogin
            // fetch(api.autoLogin, {}) //后端登录接口，此接口调用过后，其余涉及需要用户信息的接口不用再担心同时调用的问题
            //     .then(result => {
            //         console.log('page list request autlLogin success');
            //         next(vm => {
            //             scrollToPos();
            //         });
            //     })
            //     .catch(e => {
            //         console.error('request api.autoLogin error:', e)
            //         next(vm => {
            //             scrollToPos();
            //         })
            //     })
            // to.meta.fromname = from.name || '';
        },
        initParams() {
            let params = this.$route.query
            let isReturn = !!params.returnDate
            let pdate

            if (!this.chooseDate) {
                // 时间不对转明天 时区有问题 先不搞
                if (params.listDate) {
                    pdate = params.listDate
                    console.log(this.getCurrentDate)
                    if (newDate(pdate).getTime() <= new Date().getTime()) {
                        pdate = formatDate()
                    }
                } else {
                    pdate = formatDate()
                }
                this.setData({
                    depDate: pdate,
                    chooseDate: pdate
                })
            }
            // console.log(isReturn)
            // 出发初始化 去掉到达数据
            if (Number(params.isDpt) === 1) {
                this.setData({
                    [`ticketMsg.returnInfo`]: {}
                })
            }
            this.setData({
                chooseDate: Number(params.isDpt) === 1 ? this.depDate : this.returnDate,
                isReturn: isReturn,
                isDpt: Number(params.isDpt) === 1
            })
            console.log(this.isDpt)
            this.queryParams = {
                endCityId: Number(params.endCityId),
                startCityId: Number(params.startCityId),
                // isDpt: params.isDpt,
                // departDate: params.departDate,
                startDay: pdate || this.chooseDate // params.listDate // isDpt 是否是去程false：返程
            }

            this.getSchedule()
            // this.AjaxgetCurrentDate()
        },
        AjaxgetCurrentDate() {
            this.fetch({
                url: api.getCurrentDate,
                method: 'POST',
                data: {}
            }).then((result) => {
                if ((result.code === '200' || result.success) && !isEmpty(result.data)) {
                    this.getCurrentDate = result.data
                }
            })
        },
        initSchdeuleData() {
            // 清空已数据 筛选，切换日期时操作
            this.filtered = {
                dptTimeSpan: [],
                departStation: [],
                arriveStation: []
            }
            this.isFilter = false
            this.schedules = []
        },
        getSchedule() {
            if (this.isLoading) return false
            // 自动获取下一天时防止骨架屏关闭后再次打开，所以有2个变量
            this.isLoading = true
            this.isGettingSchedule = true
            const params = {
                ...this.queryParams
                // ...this.filtered, // 筛选前端来搞 fuck
                // 分页 不存在的
                // ...{

                //     page: 1,
                //     pageSize: 9999
                // }
            }
            this.fetch({
                url: api.schedulelist,
                method: 'POST',
                data: params
            })
                .then(res => {
                    let body = res.data[0]
                    let isFilter = this.funCheckEmpty()

                    this.isLoading = false
                    if (res.code === '200' && !isEmpty(body)) {
                        this.schedules = body.scheduleList
                        let hasList = this.schedules.length

                        this.hasList = hasList
                        // 骨架屏幕
                        this.isGettingSchedule = false

                        // 有数据，两个都用不到，重置掉
                        if (hasList) {
                            this.isFilterNoData = false
                            this.isShowFilter = true
                        } else {
                        // 没有班次，选了底部筛选则显示底部筛选提示
                            this.isFilterNoData = isFilter
                            this.isShowFilter = isFilter
                        }
                        // 筛选数据
                        this.filterCategory = {
                            arriveStation: body.endStationList,
                            departStation: body.startStationList
                        }
                    } else {
                        this.isLoading = false
                        this.isGettingSchedule = false
                        this.hasList = false
                        this.isFilterNoData = isFilter
                        this.isShowFilter = isFilter
                    }

                    try {
                        window.$tcevt('列表页', 'LB-27', `渠道Refid:[${window.refId}]^出发城市:[${this.queryParams.startCity}]^到达城市:[${this.queryParams.endCity}]^班次信息:[]^出发时间:[${this.chooseDate}]^有无班次：[${this.hasList ? 1 : 2}]`)
                    } catch (e) {}
                })
                .catch(e => {
                    this.isGettingSchedule = false
                    this.hasList = false
                })
        },
        funFormatStation(value) {
            let lessText, allText, isShow
            if (value.length > 1) {
                let first = value.shift()
                let all = `、${value.join('、')}`
                let num = 18 - first.length
                let less

                if (first.length > 18) {
                    lessText = `${first.substr(0, 18)}...`
                    allText = `${first}<span class="list-schedule-dark">${all}</span>`
                    isShow = true
                } else {
                    if (all.length > num) {
                        less = `${all.substr(0, 18 - first.length)}...`
                        isShow = true
                    } else {
                        less = all
                        isShow = false
                    }

                    lessText = `${first}<span class="list-schedule-dark">${less}</span>`
                    allText = `${first}<span class="list-schedule-dark">${all}</span>`
                }
            } else {
                let first = value[0]

                if (first.length > 18) {
                    lessText = `${first.substr(0, 18)}...`
                    isShow = true
                } else {
                    lessText = first
                    isShow = false
                }

                allText = first
            }

            return {
                lessText,
                allText,
                isShow
            }
        },
        funCheckEmpty() {
            let arr = Object.keys(this.filtered)
            let isFilter = false

            for (let son of arr) {
                if (this.filtered[son]) {
                    isFilter = true
                    break
                }
            }

            return isFilter
        },
        btnResetFilter() {
            this.filtered = {
                dptTimeSpan: [],
                departStation: [],
                arriveStation: []
            }
            // this.initSchdeuleData()
            // this.getSchedule()
            this.isFilter = false
        },
        inTimePerion(v) {
            let startTime = Number(v.startTime.split(':')[0])
            let tmpArr = [
                ['x'],
                [0, 6],
                [6, 12],
                [12, 18],
                [18, 24]
            ]
            let result = false
            for (let index = 0, len = tmpArr.length; index < len; index++) {
                if (this.filtered.dptTimeSpan.includes(index) && (tmpArr[index][0] < startTime) && (startTime <= tmpArr[index][1])) {
                    result = true
                    break
                }
            }
            return result
        },
        // 筛选回调
        filterConfirm(filterItem) {
            this.filtered = filterItem
            // console.log(filterItem)
            let filterSchedule = []
            filterSchedule = this.schedules.filter(v => {
                // 三个校验 出发 到达 时间校验
                let aIsTrue = false
                let bIsTrue = false
                let cIsTrue = false
                for (let index in this.filtered) {
                    if (index === 'arriveStation') {
                        aIsTrue = this.filtered[index].includes(v.endStation) || this.filtered[index].length === 0
                    } else if (index === 'departStation') {
                        bIsTrue = this.filtered[index].includes(v.startStation) || this.filtered[index].length === 0
                    } else if (index === 'dptTimeSpan') {
                        cIsTrue = this.inTimePerion(v) || this.filtered[index].length === 0
                    }
                    if (aIsTrue && bIsTrue && cIsTrue) {
                        return true
                    }
                }
            })
            this.filterSchedule = filterSchedule
            this.isFilter = this.funCheckEmpty()
        }
    }
}
</script>
<style lang='less' scoped>
@import '~@/assets/styles/list/index.less';
@import '~@/assets/styles/base.less';
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
.banner{
    padding-left:27px;
    background: #fff;
    width: 750px;
    height: 96px;
    line-height: 96px;
    color: #34354b;
    text-align: left;
    // background-color: #34354b;
    font-size: 30px;
}
.pt216{
    padding-top: 216px;
}
</style>
