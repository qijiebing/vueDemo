<template>
    <div class="calendar">
        <div class="wrapper" v-for="item in calendar" :key="item.month">
            <p class="title">{{item.year + '-' + item.month}}</p>
            <ul class="fbox bor-bottom">
                <li class="week flex1" v-for="week in weekList" :key="week">{{week}}</li>
            </ul>
            <div class="month">
                <div class="grid" v-for="(day, index) in item.dayList" :key="index">
                    <div class="day" v-if="day" :class="[day.class]" @click="btnSelectDate(day, item.month, item.year)">
                        <p class="num">{{day.text}}</p>
                        <!-- <p class="jia" v-if="day.jia">假</p> -->
                        <!-- <p class="recent" v-if="day.price">¥{{day.price}}起</p> -->
                    </div>
                    <div class="day" v-else></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as util from '@/libs/util'
// import holiday from '@/libs/holiday'

export default {
    props: {
        filterList: {
            type: Object,
            default() {
                return {}
            }
        },
        initDate: {
            type: String,
            default: util.formatDate()
        }
    },
    data() {
        return {
            today: {},
            weekList: [this.$t('日1'), this.$t('一'), this.$t('二'), this.$t('三'), this.$t('四'), this.$t('五'), this.$t('六')],
            year: 0,
            month: 0,
            calendar: [],
            selectedDate: {},
            deadlineDate: {},
            festival: {} // holiday.data
        }
    },
    created() {
        this.today = this.funResetTime(new Date())
        this.deadlineDate = new Date(this.today.getTime() + 29 * 86400000)
        this.selectedDate = this.funResetTime(util.newDate(this.initDate))
        this.year = this.today.getFullYear()
        this.month = this.today.getMonth() + 1

        if (!util.isEmpty(this.filterList)) {
            this.funCreateClendar()
        } else {
            this.calendar = []
        }
    },
    watch: {
        initDate(n) {
            this.selectedDate = this.funResetTime(util.newDate(n))
        },
        filterList(n) {
            if (!util.isEmpty(n)) {
                this.funCreateClendar()
            }
        }
    },
    methods: {
        funCreateClendar() {
            let endYear = this.deadlineDate.getFullYear()
            let endMonth = this.deadlineDate.getMonth() + 11
            let interval = (endYear - this.year) * 12 + endMonth - this.month

            this.$hloading()
            this.calendar = []

            for (let i = 0; i <= interval; i++) {
                let month = this.month + i
                let year = this.year
                let monthData = {}

                if (month > 12) {
                    month = month - 12
                    year += 1
                }

                monthData.year = year
                monthData.month = month
                monthData.dayList = this.funCreateDayList(month, year)

                this.calendar.push(monthData)
            }
        },
        funGetDayNum(month, year) {
            let dayNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                dayNum[1] = 29
            }
            return dayNum[month - 1]
        },
        funCreateDayList(month, year) {
            let allDayNum = this.funGetDayNum(month, year)
            let firstDayWeek = new Date(year + '/' + month + '/1').getDay()
            let list = []

            for (let i = 1; i <= allDayNum; i++) {
                let thisDay = year + '-' + util.addZero(month) + '-' + util.addZero(i)
                let thisDayObj = util.newDate(thisDay)
                let festivalDay = this.festival[thisDay]
                let filterDay = parseFloat(this.filterList[thisDay])
                let className = []
                let caleText = i
                let calePrice = 0

                // 是否是选中日期
                if (thisDayObj.getTime() === this.selectedDate.getTime()) {
                    className.push('selected')
                }

                // 周六周日样式
                if (thisDayObj.getDay() === 0 || thisDayObj.getDay() === 6) {
                    className.push('weekend')
                }

                // 判断今天明天后天
                if (thisDayObj.getTime() === this.today.getTime()) {
                    caleText = this.$t('今天')
                    className.push('today')
                    className.push('festival')
                } else if (thisDayObj.getTime() - this.today.getTime() === 86400000) {
                    // caleText = this.$t('明天')
                    // className.push('festival')
                } else if (thisDayObj.getTime() - this.today.getTime() === 2 * 86400000) {
                    // caleText = this.$t('后天')
                    // className.push('festival')
                }

                // 判断假期
                if (festivalDay) {
                    if (festivalDay === '假') {
                        className.push('holiday')
                    } else {
                        caleText = festivalDay
                        className.push('festival')
                        className.push('holiday')
                    }
                }

                // 判断是否可售
                if (filterDay) {
                    calePrice = filterDay
                } else {
                    if (thisDayObj.getTime() < this.today.getTime()) {
                        className.push('disabled')
                    }
                    // className.push('disabled')
                }

                list.push({
                    num: i,
                    text: caleText,
                    class: className,
                    price: calePrice,
                    jia: festivalDay
                })
            }

            for (let i = 0; i < firstDayWeek; i++) {
                list.unshift(null)
            }

            return list
        },
        funResetTime(date) {
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)

            return date
        },
        btnSelectDate(day, month, year) {
            // console.log(day.class)
            if ((day.class).indexOf('disabled') >= 0) {
                // console.log('disable')
                return false
            }
            // if (!day.price) return false
            this.$emit('calendarcallback', year + '-' + util.addZero(month) + '-' + util.addZero(day.num))
        }
    }
}
</script>

<style lang="less" scoped>
@import './calendar.less';
</style>
