<template>
    <div class="cale">
        <calendar :filter-list="showList" :init-date="initData" @calendarcallback="backSelectCalendar"></calendar>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import api from '@/config/api'
import { isEmpty } from '@/libs/util'
import calendar from './calendar.vue'
// import axios from 'axios'

export default {
    data() {
        return {
            initData: '',
            showList: {},
            months: {
                1: 31,
                2: 28,
                3: 31,
                4: 30,
                5: 31,
                6: 30,
                7: 31,
                8: 31,
                9: 30,
                10: 31,
                11: 30,
                12: 31
            }
        }
    },
    mounted() {
        this.initData = this.$route.query.type === 'start' ? this.depDate : this.$route.query.type === 'return' ? this.returnDate : this.depDate
        this.showList = this.createDefaultDate()
        // this.ajaxGetCalendarList()
    },
    components: {
        calendar
    },
    computed: {
        ...mapState(['depDate', 'productType', 'returnDate', 'chooseDate'])
    },
    methods: {
        ...mapMutations(['setData']),
        ajaxGetCalendarList() {
            this.$loading()
            this.fetch({
                url: api.getCalendarList,
                method: 'POST',
                data: {
                    startCity: this.$route.query.startCity,
                    endCity: this.$route.query.endCity,
                    startScenicId: this.$route.query.startScenicId,
                    endScenicId: this.$route.query.endScenicId,
                    startStationId: this.$route.query.startStationId,
                    endStationId: this.$route.query.endStationId,
                    productType: this.productType
                }
            })
                .then(result => {
                    this.$hloading()

                    if (result.success && !isEmpty(result.body)) {
                        this.showList = result.body
                    } else {
                        // this.setCalendarList({
                        //     list: dataList,
                        //     dep: this.$route.query.dep,
                        //     des: this.$route.query.des
                        // })
                        this.showList = this.createDefaultDate()
                    }
                })
                .catch(e => {
                    console.warn(e)
                    this.showList = this.createDefaultDate()
                    this.$alert({
                        txt: '抱歉哟，暂时没有日历数据',
                        okFn: () => {
                            this.$router.go(-1)
                        }
                    })
                })
            // axios.get('/minPriceCalendar').then(res => {
            //     let result = res.data.data
            //     if (result.success && !isEmpty(result.body)) {
            //         this.showList = result.body
            //     } else {
            //         this.showList = this.createDefaultDate()
            //     }
            // })
        },
        backSelectCalendar(date) {
            let type = 'depDate'
            if (this.$route.query.type === 'start') {
                type = 'depDate'
                if (!!this.returnDate && (new Date(date).getTime() > new Date(this.returnDate).getTime())) {
                    this.$router.go(-1)
                    this.$alert({
                        txt: '返程日期需要晚于出发日期'
                    })
                    return false
                }
            } else if (this.$route.query.type === 'return') {
                type = 'returnDate'
                // 返程日期 小于出发日期 false
                if (new Date(date).getTime() < new Date(this.depDate).getTime()) {
                    this.$router.go(-1)
                    this.$alert({
                        txt: '返程日期需要晚于出发日期'
                    })
                    return false
                }
            }
            this.setData({
                [type]: date,
                chooseDate: date
            })
            this.$router.go(-1)
        },

        createDefaultDate() {
            var today = new Date()
            var year = today.getFullYear()
            var month = today.getMonth() + 1
            var day = today.getDate()

            var dateList = {}
            this.leapYear(year)
            // 把今天先加进去
            dateList[`${year}-${this.addZero(month)}-${this.addZero(day)}`] = '-'

            for (var i = 0; i < this.months[month] - 2; i++) {
                // console.log(i)
                day++
                if (day > this.months[month]) {
                    day = 1
                    month++
                }
                if (month > 12) {
                    year++
                    month = 1
                }
                dateList[`${year}-${this.addZero(month)}-${this.addZero(day)}`] = '-'
            }
            return dateList
        },
        addZero(num) {
            return num < 10 ? '0' + num : num
        },
        leapYear(year) {
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                this.months[2] = 29
            } else {
                this.months[2] = 28
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cale {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    overflow: hidden;
    z-index: 10086;
}
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>
