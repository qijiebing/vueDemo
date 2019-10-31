<template>
    <div class="new-list">
        <div class="box " v-for='(item, index) in list' :key='index' @click='booking(item)' :class="{'noSale':item.saleFlag === 0 ||item.onlineLeftNum === 0 }">
            <div class="fbox">
                <div class="left-part flex1">
                    <div class="water fbox" >
                        <p class="time">{{item.startTime}}</p>
                        <p class="trip">{{item.minutes | filMin}}</p>
                    </div>
                    <div class="station">
                        <template v-if='item.startStation'>
                            <p class="dep" v-html="item.startStation"></p>
                        </template>
                        <p class="des-txt">{{item.arriveTimeExpect}}<span>{{item |filDay}}</span></p>
                        <template v-if='item.endStation'>
                            <p class="des" v-html="item.endStation"></p>
                        </template>
                    </div>
                </div>
                <div class="right-part flex-ac">
                    <p class="ticket-price">{{item.price}}<span class="type">THB</span></p>
                    <p class="ticket-left"><span :class="{'sred': item.ticketLeft <= 5}">{{item.onlineLeftNum}}</span>{{$t('张')}}</p>
                    <!-- <p class="ticket-vol"><span>-6%</span><span>-7%</span></p> -->
                </div>
            </div>
             <div class="line">
                <p class="trip">{{item.lineNo}}</p>
                <p class="type">{{item.lineName}}</p>
                <p class="type">{{item.carModelName}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { setSession } from '@/libs/util'
export default {
    data() {
        return {
            isVerify: false
        }
    },
    props: {
        scheduleType: {
            type: String,
            default: ''
        },
        getCurrentDate: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        limit: {
            type: Boolean,
            default: false
        }
    },
    filters: {
        filMin: function(value) {
            let d = window.locale === 'en' ? 'D' : window.locale === 'th' ? 'วัน' : '天'
            let H = window.locale === 'en' ? 'Hour' : window.locale === 'th' ? 'ชั่วโมง' : '时'
            let M = window.locale === 'en' ? 'Min' : window.locale === 'th' ? 'นาที' : '分'
            let day = parseInt(value / (60 * 24)) ? parseInt(value / (60 * 24)) + d : ''
            let hour = parseInt(value / 60) ? parseInt(value / 60) + H : ''
            let min = parseInt(value % 60) ? parseInt(value % 60) + M : ''
            return day + hour + min
        },
        filDay: function(val) {
            let day = 0
            if (new Date((val.arriveDayExpect).replace(/-/g, '/')).getDate() !== new Date((val.startDay).replace(/-/g, '/')).getDate()) {
                let arriveTimeExpect = new Date((val.arriveDayExpect).replace(/-/g, '/')).getTime()
                let startTime = new Date((val.startDay).replace(/-/g, '/')).getTime()
                let minus = arriveTimeExpect - startTime
                day = `+${parseInt(minus / (1000 * 60 * 60 * 24))}`
                return day
            } else {
                day = ``
                return day
            }
        }
    },
    computed: {
        ...mapState(['ticketMsg', 'isDpt'])
    },
    methods: {
        ...mapMutations(['setData']),
        // isend(item) {
        //     let saleStopDate = item.saleStopDate
        //     let now = this.getCurrentDate || new Date()
        //     if (new Date(saleStopDate).getTime() >= new Date(now).getTime()) {
        //         console.log(1)
        //         return true
        //     } else {
        //         console.log(2)
        //         return false
        //     }
        // },
        booking(item) {
            if (item.saleFlag === 0 || item.onlineLeftNum === 0) {
                return
            }
            // 去程信息
            if (this.isDpt) {
                this.setData({
                    [`ticketMsg.departInfo`]: {
                        ...item
                    },
                    scheduleDetailId: item.id
                })
            } else {
                // 返程信息
                this.setData({
                    [`ticketMsg.returnInfo`]: {
                        ...item
                    },
                    scheduleDetailIdB: item.id
                })
            }

            setSession(`ticketMsg_${item.id}`, this.ticketMsg)
            console.log(this.ticketMsg)
            this.$router.push({
                name: 'selectChair',
                query: {
                    scheduleDetailId: item.id
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/list/schedule-item.less';
</style>
