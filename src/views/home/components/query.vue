<template>
    <div class="top">
        <div class="main">
            <div class="choose fbox border-bottom">
                <div class="flex1">
                    <div class="city border-bottom" @click="btnSelectCity('start')">
                        <div>
                            <p class="dep textDot bold" :class="{'nodata': !allCityInfo.start.showText, 'fly': isAnimate, 'depfly': isAnimate}">{{allCityInfo.start.showText || $t(allCityInfo.start.tipsText)}}</p>
                        </div>
                    </div>
                    <div class="city" @click="btnSelectCity('end')">
                        <div>
                            <p class="dep des textDot bold" :class="{'nodata': !allCityInfo.end.showText, 'fly': isAnimate, 'desfly': isAnimate}">{{allCityInfo.end.showText || $t(allCityInfo.end.tipsText)}}</p>
                        </div>
                    </div>
                </div>
                <div class="change" @click="btnChangeCity"></div>
            </div>
            <div class="date fbox">
                <div class="dpt-time border-bottom flex1" @click="btnSelectDate('start',$event)">
                    <p class="time-txt">{{$t('出发日期')}}</p>
                    <p class="time-dpt" v-if="depDate">
                        {{depDate}}
                    </p>
                    <p class="time-dpt dark" v-else>-/-</p>
                </div>
                <div class="des-time border-bottom flex1" @click="btnSelectDate('return',$event)">
                    <p class="time-txt">{{$t('返程日期')}}</p>
                    <p class="time-dpt" v-if="returnDate">
                        {{returnDate}}
                        <md-icon
                            @click="closeReturn"
                            name="clear"
                            size="lg"
                        ></md-icon>
                    </p>
                    <p class="time-dpt dark" v-else>-/-</p>
                </div>
            </div>
            <div class="pax fbox">
                <div class="flex1 l-t">{{$t('乘客人数')}}</div>
                <div class="flex1 r-t">
                    <md-field>
                        <md-field-item title="">
                            <md-stepper slot="right" v-model="PAX" :min="1" :max="6" read-only />
                        </md-field-item>
                    </md-field>
                </div>
            </div>
            <div class="btn">
                <div class="query" :class="{'grey':!isCanBuy}" @click="btnQueryList">{{$t(allCityInfo.queryText)}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as util from '@/libs/util'
import { getLocation } from '@/channelModules/index'
import { getCityInfoByLocation } from '@/libs/location'
import { Stepper, Field, FieldItem, Icon } from 'mand-mobile'
let category = '首页'

export default {
    data() {
        return {
            isAnimate: false,
            lockChange: false,
            couponList: [],
            queryData: {},
            allCityInfo: {
                queryText: '查询线路',
                start: {
                    tipsText: '始发'
                },
                end: {
                    tipsText: '到达'
                }
            },
            PAX: 1,
            isCanBuy: false
        }
    },
    computed: {
        ...mapState(['startCity', 'endCity', 'depDate', 'returnDate', 'isReturn'])
    },
    components: {
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Stepper.name]: Stepper,
        [Icon.name]: Icon
    },
    async created() {
        console.log(this.$t('始发'))
        let query = this.$route.query

        // 首页数据和历史记录同步，每次触发created都从localStorage获取首页数据
        let local = util.getStore('newlinebus_indexquery')
        console.log(!util.isEmpty(local))
        // 本地有历史记录
        if (!util.isEmpty(local)) {
            this.allCityInfo = local
            this.getLocationCity()
        } else {
            // 获取用户当前位置
            const getlos = await getLocation()

            getlos(res => {
                getCityInfoByLocation(res).then(result => {
                    if (result.success && !util.isEmpty(result.body) && result.body.cityName) {
                        let name = result.body.cityName.replace('市', '')

                        let backObj = {
                            cityName: name,
                            cityId: result.body.busCityId || '',
                            showText: name
                        }

                        let obj = Object.assign({}, this.allCityInfo)

                        obj.start = {
                            ...obj.start,
                            ...backObj
                        }

                        this.allCityInfo = obj
                        this.setLocalInfo(backObj)
                    }
                })
            })
        }

        // 第一次打开，从链接获取depDate或默认今天，并写入vuex
        if (!this.depDate) {
            let today = util.formatDate()
            this.setData({
                depDate: query.depDate ? query.depDate : today
            })
        }
        // 返程日期默认为空，若不设置，则后续流程走单程，若设置则后续流程走往返
        if (!this.returnDate) {
            this.setData({
                returnDate: query.returnDate ? query.returnDate : '',
                isReturn: !!query.returnDate
            })
        }
    },
    filters: {
        dateToWeek(value = util.addDate().day) {
            return util.formatDate(value, `MM月dd日 ww`)
        }
    },
    watch: {
        startCity(n) {
            if (!util.isEmpty(n)) {
                this.funWatchSelectedCity(n, 'start')
            }
        },
        endCity(n) {
            if (!util.isEmpty(n)) {
                this.funWatchSelectedCity(n, 'end')
            }
        },
        allCityInfo(n) {
            if (n.end.cityName && n.start.cityName) {
                this.isCanBuy = true
            }
        }
    },
    methods: {
        ...mapMutations({
            setData: 'setData',
            setLocalInfo: 'SET_LOCALINFO'
        }),
        ...mapActions(['getLocationCity']),

        /**
         * 格式化城市选择，并把首页数据写入localStorage
         */
        funWatchSelectedCity(value, type) {
            let obj = Object.assign({}, this.allCityInfo)

            value.showText = value.showText ? value.showText : value.cityName

            obj[type] = {
                ...obj[type],
                ...value
            }

            this.allCityInfo = obj

            util.setStore('newlinebus_indexquery', obj)
        },

        /**
         * 选择城市
         */
        btnSelectCity(value) {
            let obj = this.allCityInfo

            let startCity = {
                ...obj.start
            }

            let endCity = {
                ...obj.end
            }

            this.setData({
                startCity,
                endCity
            })

            this.$router.push({
                name: 'city',
                query: {
                    currentType: value
                }
            })

            window.$tcevt(category, `${value === 'end' ? '到达城市选择' : '出发城市选择'}`, `类型：${value === 'end' ? '到达' : '出发'}`)
        },
        closeReturn(e) {
            console.log(e.target.localName)
            if (e.target.localName === 'i') {
                this.setData({
                    returnDate: ''
                })
                return false
            }
        },

        /**
         * 城市上下交换
         */
        btnChangeCity() {
            if (this.lockChange) return false

            let obj = Object.assign({}, this.allCityInfo)

            if (util.isEmpty(obj.start) || util.isEmpty(obj.end)) {
                return false
            }

            let tempStart = Object.assign({}, obj.start)
            let tempEnd = Object.assign({}, obj.end)

            this.lockChange = true
            this.isAnimate = true

            setTimeout(() => {
                obj.start = tempEnd
                obj.end = tempStart

                this.allCityInfo = obj

                this.isAnimate = false
                this.lockChange = false
            }, 410)
            window.$tcevt(category, `城市切换`, `类型：互换`)
        },

        /**
         * 选择日期
         */
        btnSelectDate(type, e) {
            if (e.target.localName === 'i') {
                return false
            }
            if (this.lockChange) return false

            let obj = this.allCityInfo

            if (!obj.start.cityName) {
                this.$alert('请选择出发地')
                return false
            }

            if (!obj.end.cityName) {
                this.$alert('请选择目的地')
                return false
            }

            this.$router.push({
                name: 'calendar',
                query: {
                    startCity: obj.start.cityName,
                    endCity: obj.end.cityName,
                    type: type
                }
            })
            window.$tcevt(category, `日期选择`)
        },

        /**
         * 查询按钮
         */
        async btnQueryList() {
            let obj = this.allCityInfo || {}

            if (!obj.start.cityName) {
                this.$alert('请选择出发地')
                return false
            }

            if (!obj.end.cityName) {
                this.$alert('请选择目的地')
                return false
            }

            let query = {
                startCity: obj.start.showText,
                startCityId: obj.start.cityId,
                endCity: obj.end.showText,
                endCityId: obj.end.cityId,
                departDate: this.depDate,
                returnDate: this.returnDate,
                listDate: this.depDate, // 默认搜索的日期
                isDpt: 1 // 是否是去程
            }

            // 历史数据用
            let historyObj = {
                ...query,
                startText: obj.start.showText,
                endText: obj.end.showText
            }

            // 删除多余属性
            delete historyObj.departDate

            this.queryData = historyObj

            // 等历史记录写入后再跳转
            await this.$nextTick()
            this.setData({
                query
            })

            this.$router.push({
                name: 'list',
                query
            })
            window.$tcevt(category, `${window.productNames}-查询`, `出发城市:${obj.start.cityName}^到达城市:${obj.end.cityName}^出发日期:${this.depDate}`)
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/home/query.less';
 * {
    touch-action: pan-y;
}
.dark{
    color: #a9b5cb!important;
}
</style>
