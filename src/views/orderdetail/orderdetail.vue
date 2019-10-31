<template>
    <div class="orderdetail-box">
        <div class="ticket-status" :class="{'grey':scheduleDetail.displayStatus===13 || scheduleDetail.displayStatus===6 }">
            {{scheduleDetail.displayStatus | filStatus}} <span v-if="scheduleDetail.displayStatus===0" v-html="statusTips"></span>
        </div>
        <div class="ticket-info" :class="{'grey':scheduleDetail.displayStatus===13 || scheduleDetail.displayStatus===6}">
            <div class="main-info" v-if="isHasdepartInfo">
                <div class="ticket-type fbox">
                    <div class="flex1 left-type">{{$t('出发信息')}}</div>
                    <div class="flex1 right-seat">
                        <!-- <template v-for="(item,index) in TmpseatSelected">
                            {{item.keys}}<span :key="index" v-if="index!=TmpseatSelected.length-1">,</span>
                        </template> -->
                        {{departInfo.seaNos}}
                    </div>
                </div>
                <div class="ticket-msg fbox">
                    <div class="left-sm">
                        <div class="dpt-date">{{departInfo.startDay|filday}}</div>
                        <div class="dpt-time">{{departInfo.startTime}}</div>
                        <div class="dpt-arrive">{{departInfo.expectedArriveTime}}<span>{{departInfo|filDD}}</span></div>
                    </div>
                    <div class="right-bg flex1">
                        <div class="dpt-long">{{departInfo.minutes|filTime}}</div>
                        <div class="dpt-stations">{{departInfo.departureStation}}</div>
                        <div class="dpt-endstations">{{departInfo.arriveStation}}</div>
                    </div>
                </div>
                <div class="psger-detail" v-if="scheduleDetail.displayStatus!==0 && scheduleDetail.displayStatus!==6" @click="showPsgerPop(departInfo)">
                    <md-icon
                        name="user"
                        size="md"
                    ></md-icon>
                    {{$t('乘客详情')}}
                    <md-icon
                        name="arrow-right"
                        size="md"
                    ></md-icon>
                </div>
                <!-- <div class="status-tips">{{scheduleDetail.displayStatus | filStatus}}</div> -->
            </div>
            <div class="main-info back-info" v-if="isHasReturn">
                <div class="ticket-type fbox">
                    <div class="flex1 left-type">{{$t('返回信息')}}</div>
                    <div class="flex1 right-seat">
                        <!-- <template v-for="(item, index) in TmpseatSelectedB">
                            {{item.keys}} <span :key="index" v-if="index!=TmpseatSelectedB.length-1">,</span>
                        </template> -->
                        {{returnInfo.seaNos}}
                    </div>
                </div>
                <div class="ticket-msg fbox">
                    <div class="left-sm">
                        <div class="dpt-date">{{returnInfo.startDay|filday}}</div>
                        <div class="dpt-time">{{returnInfo.startTime}}</div>
                        <div class="dpt-arrive">{{returnInfo.expectedArriveTime}}<span>{{returnInfo|filDD}}</span></div>
                    </div>
                    <div class="right-bg flex1">
                        <div class="dpt-long">{{returnInfo.minutes|filTime}}</div>
                        <div class="dpt-stations">{{returnInfo.departureStation}}</div>
                        <div class="dpt-endstations">{{returnInfo.arriveStation}}</div>
                    </div>
                </div>
                <div class="psger-detail" v-if="scheduleDetail.displayStatus!==0 && scheduleDetail.displayStatus!==6" @click="showPsgerPop(returnInfo)">
                    <md-icon
                        name="user"
                        size="md"
                    ></md-icon>
                    {{$t('乘客详情')}}
                    <md-icon
                        name="arrow-right"
                        size="md"
                    ></md-icon>
                </div>
                <!-- <div class="status-tips">{{scheduleDetail.displayStatus | filStatus}}</div> -->
            </div>
        </div>
        <div class="services fbox" v-if="scheduleDetail.displayStatus ===0 && facility.length>0">
            <div class="flex1" v-for="(itemi,indexi) in facility" :key="indexi" >
                <i class="iconfont block-icon" :class="'icon-'+facilityDemo[indexi]"></i>
                <p class="textDot">{{facilityDemo[indexi]}}</p>
            </div>
        </div>
        <div class="orderid-box red-txt" v-if="scheduleDetail.displayStatus===12">
            {{$t('退款将原来返还至支付账户，请注意查收')}}
        </div>
        <div class="orderid-box" v-if="scheduleDetail.displayStatus!==12 && scheduleDetail.displayStatus!==0 && scheduleDetail.displayStatus!==6 || 1">
            <div class="order-id fbox">
                <div class="orderid">OrderID:</div>
                <div class="orderid-a flex1">{{orderSn}}</div>
            </div>
            <div class="des flex1">
                {{$t('请凭借订单号，到出发车站取票乘车')}}
            </div>
        </div>
        <div class="payInfo-box">
            <div class="bar-banner fbox border-bottom" @click="showDown(3)">
                <div class="flex1 b-title">{{$t('支付信息')}}</div>
                <div class="flex1 sub-title red-txt">
                    {{$t('总价')}} <span class="red">{{scheduleDetail.payAmount}}</span> THB
                    <md-icon
                        :name="arrthreeName"
                        size="md"
                    ></md-icon>
                </div>
            </div>
            <div class="down-slider" v-show='showThree'>
                <div class="psger-listbox">
                        <div clas="d-r-t">
                            <div class="">
                                <div class="line-item fbox" v-for="(item,index) in priceList" :key="index+'pp'">
                                    <div class="left-title" v-if="item.indexs===1 && isHasReturn ">{{$t('出发')}}</div>
                                    <div class="left-title" v-else-if="item.indexs===2 && isHasReturn">{{$t('返回')}}</div>
                                    <div class="right-deslist flex1 bdd">
                                        <div class="list-item fbox bdd" >
                                            <div class="list-name flex1" v-if="item.useMemberDiscount === 0">{{item.ticketTypePrintName}}</div>
                                            <div class="list-name flex1 gold" v-if="item.useMemberDiscount === 1">VIP</div>
                                            <div class="list-price">{{item.ticketFinalPrice}}THB x 1</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="price-box fbox border-bottom" v-if="preferentialAmount">
                                <div class="flex1 b-title">{{$t('Discount')}}:</div>
                                <div class="flex1 price-total">{{preferentialAmount}} THB</div>
                            </div>
                            <!-- <div class="price-box fbox border-bottom">
                                <div class="flex1 b-title">{{$t('总价')}}:</div>
                                <div class="flex1 price-total">{{scheduleDetail.payAmount}} THB</div>
                            </div> -->
                        </div>
                    </div>
                </div>
        </div>

         <div class="payInfo-box second" v-if="scheduleDetail.displayStatus===0 || scheduleDetail.displayStatus===6">
            <div class="bar-banner fbox border-bottom" @click="showDown(4)">
                <div class="flex1 b-title">{{$t('乘客详情')}}</div>
                <div class="flex1 sub-title red-txt">
                    <md-icon
                        :name="arrFourName"
                        size="md"
                    ></md-icon>
                </div>
            </div>
            <div class="down-slider" v-show='showFour'>
                <div class="psger-listbox">
                        <div clas="d-r-t">
                            <div class="fbox">
                                <!-- <div class="left-title">{{$t('出发')}}</div> -->
                                <div class="right-deslist flex1">
                                    <div class="list-item fbox" v-for="(item, index) in psgerList" :key="index+100">
                                        <div class="left-title" v-if="item.indexs===1 && isHasReturn ">{{$t('出发')}}</div>
                                        <div class="left-title" v-else-if="item.indexs===2 && isHasReturn">{{$t('返回')}}</div>
                                        <div class="list-name flex1 bdd">{{item.passengerName}}</div>
                                        <div class="list-price bdd">{{item.ticketTypeName}}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="price-box fbox border-bottom">
                                <div class="flex1 b-title">{{$t('总价')}}:</div>
                                <div class="flex1 price-total">{{scheduleDetail.payAmount}} THB</div>
                            </div> -->
                        </div>
                    </div>
                </div>
        </div>
        <div class="creation-time border-bottom">
            {{$t('创单时间')}}：{{scheduleDetail.createTime}}
        </div>
        <div class="creation-time border-bottom" v-if="scheduleDetail.displayStatus===12 || scheduleDetail.displayStatus===0">
            {{$t('订单号')}}:{{orderSn}}
        </div>
        <a href='tel:0897820192' class="creation-time border-bottom fbox">
            <div class="left-phone flex1">{{$t('客服电话')}}: 0897820192</div>
            <div class="phone-box">Call</div>
        </a>
        <div class="refund" v-if="scheduleDetail.displayStatus===0" @click='cancel' >
           <img src="./../../assets/img/orderdetail/cancel.png" alt="">
            {{$t('取消订单')}}</div>
        <div class="bt-btn">
            <!-- <div class="refund" @click='goRefund'>
                <md-icon
                    name="coupon"
                    size="md"
                ></md-icon>Refund</div> -->
            <div class="red-btn" @click="goHome" v-if="scheduleDetail.displayStatus!==0">{{$t('再次预定')}}</div>
            <div class="red-btn" @click="pay" v-if="scheduleDetail.displayStatus===0">{{$t('立即支付')}}</div>
        </div>

        <div class="layer" v-if="isShowPsger" @click="closeBtn">
            <div class="pop-wrap">
                <div class="fb-title boder-b-d">
                    {{tripType===0?'Depart：':'Return：'}} {{$t('乘客详情')}}
                </div>
                <div class="wrap">
                    <div class="se-title border-b-d" v-for="(item,index) in psgerList" :key="index">
                        <div class="line-banner fbox"  @click="dropDown(index)">
                            <div class="flex1">{{item.passengerName}}</div>
                            <div class="psger-type">{{item.ticketTypeName}}</div>
                            <div class="psger-seats"><img src="./../../assets/img/orderdetail/ewm.png" alt="">{{item.seatNo}}</div>
                        </div>
                        <div class="dropDown" v-if="showDownArr[index]===true">
                            <!-- <img src="./../../../assets/img/orderdetail/ewm.png" alt=""> -->
                            <img :id="'barcode_' + item.scheduleId" :barcode="getBarcode(item.scheduleId, item.ticketNo)" src="#"/>
                        </div>
                    </div>
                </div>
                <div class="close-btn" @click="closeBtns">{{$t('关闭')}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from 'mand-mobile'
import { isEmpty, getSession, formatDate } from '@/libs/util'
import jsbarcode from 'jsbarcode'
import api from '@/config/api'
export default {
    name: 'orderdetail',
    components: {
        [Icon.name]: Icon
    },
    data() {
        return {
            orderSn: '',
            scheduleDetail: {},
            scheduleDetailId: '',
            departInfo: {},
            returnInfo: {},
            isHasdepartInfo: true,
            isHasReturn: true,
            TmpseatSelected: [],
            TmpseatSelectedB: [],
            showThree: false,
            showFour: false,
            arrthreeName: 'arrow-down',
            arrFourName: 'arrow-down',
            showDownArr: [true],
            isShowPsger: false,
            priceList: [],
            preferentialAmount: 0,
            tripType: 0,
            psgerList: [],
            getCurrentDate: '',
            statusTips: '',
            facility: [],
            facilityDemo: ['wifi', 'Toilet', 'Lie-flat-Seat-or-Bed', 'Air-Conditioning', 'USB', 'snacks'],
            interalTimer: null,
            getOrderTimer: null
        }
    },
    filters: {
        filday: function(value) {
            let tmp = formatDate(value, 'MM/dd')
            return tmp // 06/27
        },
        filTime: function(value) {
            let d = window.locale === 'en' ? 'D' : window.locale === 'th' ? 'วัน' : '天'
            let H = window.locale === 'en' ? 'Hour' : window.locale === 'th' ? 'ชั่วโมง' : '时'
            let M = window.locale === 'en' ? 'Min' : window.locale === 'th' ? 'นาที' : '分'
            let day = parseInt(value / (60 * 24)) ? parseInt(value / (60 * 24)) + d : ''
            let hour = parseInt(value / 60) ? parseInt(value / 60) + H : ''
            let min = parseInt(value % 60) ? parseInt(value % 60) + M : ''
            return day + hour + min
        },
        filDD: function(val) {
            let day = 0
            if (!val.expectedArriveDay || !val.startDay) {
                day = ``
                return day
            }
            if (new Date((val.expectedArriveDay).replace(/-/g, '/')).getDate() !== new Date((val.startDay).replace(/-/g, '/')).getDate()) {
                let arriveTimeExpect = new Date((val.expectedArriveDay).replace(/-/g, '/')).getTime()
                let startTime = new Date((val.startDay).replace(/-/g, '/')).getTime()
                let minus = arriveTimeExpect - startTime
                day = `+${parseInt(minus / (1000 * 60 * 60 * 24))}`
                return day
            } else {
                day = ``
                return day
            }
        },
        filStatus: function(value) {
            let status = ''
            let state0 = '待支付'
            let state1 = '已取消'
            let state2 = '已出票'
            let state4 = '已支付'
            let state5 = '退款中'
            let state6 = '已退款'
            let state7 = '已退票'
            let state8 = '已完成'
            // 0待支付 1已支付 4已出票 6已取消 9已退票 11已完成(已过检票时间) 12退款中(前提:未出票) 13已退款
            if (window.locale === 'en') {
                state0 = 'Waiting for payment'
                state1 = 'Calcelled'
                state2 = 'Ticket issued'
                state4 = 'Paid'
                state5 = 'Refunding'
                state6 = 'Refunded'
                state7 = 'Cancelled'
                state8 = 'Success'
            } else if (window.locale === 'th') {
                state0 = 'รอชำระเงิน'
                state1 = 'ยกเลิกแล้ว'
                state2 = 'ออกตั๋วแล้ว'
                state4 = 'ชำระเงินแล้ว'
                state5 = 'กำลังคืนเงิน'
                state6 = 'คืนเงินแล้ว'
                state7 = 'คืนตั๋วแล้ว'
                state8 = 'สำเร็จแล้ว'
            }
            switch (value) {
                case 0:
                    status = state0
                    break
                case 1:
                    status = state4
                    break
                case 4:
                    status = state2
                    break
                case 6:
                    status = state1
                    break
                case 9:
                    status = state7
                    break
                case 11:
                    status = state8
                    break
                case 12:
                    status = state5
                    break
                case 13:
                    status = state6
                    break
            }
            return status
        }
    },
    created() {
        // this.initParams()
        this.scheduleDetailId = this.$route.query.scheduleDetailId
        this.initDetail()
    },
    mounted() {
        this.orderSn = this.$route.query.orderNo
    },
    methods: {
        initParams() {
            // 缓存session 用于替换vuex刷新的问题scheduleDetailId是最后一个 出发的 或者 返程的id 放置于url
            this.scheduleDetailId = this.$route.query.scheduleDetailId

            let ticketMsg = getSession(`ticketMsg_${this.$route.query.scheduleDetailId}`) || {}
            console.log(ticketMsg)
            this.departInfo = ticketMsg.departInfo || {}
            this.returnInfo = ticketMsg.returnInfo || {}
            this.isHasdepartInfo = !isEmpty(this.departInfo)
            this.isHasReturn = !isEmpty(this.returnInfo)

            if (!this.isHasdepartInfo && !this.isHasReturn) {
                this.$alert({
                    txt: this.$t('获取数据失败，请重新选择班次！'),
                    okFn: () => {
                        this.$router.replace({
                            name: 'home'
                        })
                    }
                })
            }
            // 获取出发到达的detailid
            if (this.isHasdepartInfo) {
                this.dptscheduleDID = this.departInfo.id
                let seatSelected = getSession(`seatSelected_${this.dptscheduleDID}`) || []
                this.TmpseatSelected = !isEmpty(this.seatSelected) ? this.seatSelected : seatSelected
            }
            if (this.isHasReturn) {
                this.rtnScheduleDiD = this.returnInfo.id
                let seatSelectedB = getSession(`seatSelectedB_${this.rtnScheduleDiD}`) || []
                this.TmpseatSelectedB = !isEmpty(this.seatSelectedB) ? this.seatSelectedB : seatSelectedB
            }
        },
        initDetail() {
            this.fetch({
                url: api.getOrderScheduleDetail,
                method: 'POST',
                data: {
                    orderSn: this.$route.query.orderNo
                }
            }, {
                name: 'orderdetail',
                query: { ...this.$route.query }
            }).then((result) => {
                if ((result.code === '200' || result.success) && !isEmpty(result.data)) {
                    let detail = result.data
                    this.scheduleDetail = detail
                    this.isHasdepartInfo = !!this.scheduleDetail.scheduleList.length && this.scheduleDetail.scheduleList.length >= 1
                    this.isHasReturn = !!this.scheduleDetail.scheduleList.length && this.scheduleDetail.scheduleList.length === 2 && this.scheduleDetail.scheduleList[1]['tripType'] === 1
                    this.departInfo = this.scheduleDetail.scheduleList[0]
                    this.returnInfo = this.scheduleDetail.scheduleList[1]
                    this.preferentialAmount = this.scheduleDetail.preferentialAmount
                    this.initPrice()
                    if (this.scheduleDetail.displayStatus === 0) {
                        this.AjaxgetCurrentDate()
                        this.getIcon()
                        this.showPsgerPop()
                    }
                    if (this.scheduleDetail.displayStatus === 6) {
                        this.showPsgerPop()
                    }
                }
            })
        },
        getIcon() {
            this.fetch({
                url: api.getCarModelInfo,
                method: 'POST',
                data: {
                    scheduleDetailId: this.scheduleDetailId
                }
            })
                .then((result) => {
                    if (result.code === '200' && !isEmpty(result.data)) {
                        this.facility = JSON.parse(result.data[0].facility)
                        // console.log(result)
                    }
                })
        },
        initPrice() {
            this.fetch({
                url: api.getOrderPriceDetail,
                method: 'POST',
                data: {
                    orderSn: this.$route.query.orderNo
                }
            }, {
                name: 'orderdetail',
                query: { ...this.$route.query }
            }).then((result) => {
                // result = {
                //     'code': '200',
                //     'msg': '操作成功！',
                //     'data': {
                //         'schedulePassengerPriceList': [
                //             {
                //                 'orderScheduleId': 85,
                //                 'ticketFinalPrice': 22,
                //                 'ticketTypeId': 227,
                //                 'ticketTypePrintName': 'พระภิกษุสงฆ์',
                //                 'useMemberDiscount': 1
                //             },
                //             {
                //                 'orderScheduleId': 85,
                //                 'ticketFinalPrice': 24,
                //                 'ticketTypeId': 227,
                //                 'ticketTypePrintName': 'พระภิกษุสงฆ์',
                //                 'useMemberDiscount': 0
                //             },
                //             {
                //                 'orderScheduleId': 86,
                //                 'ticketFinalPrice': 1104,
                //                 'ticketTypeId': 227,
                //                 'ticketTypePrintName': 'พระภิกษุสงฆ์',
                //                 'useMemberDiscount': 1
                //             },
                //             {
                //                 'orderScheduleId': 86,
                //                 'ticketFinalPrice': 1227,
                //                 'ticketTypeId': 227,
                //                 'ticketTypePrintName': 'พระภิกษุสงฆ์',
                //                 'useMemberDiscount': 0
                //             }
                //         ]
                //     },
                //     'success': true
                // }
                if ((result.code === '200' || result.success) && !isEmpty(result.data) && !isEmpty(result.data.schedulePassengerPriceList)) {
                    // console.log(result)
                    this.priceList = result.data.schedulePassengerPriceList.map((v) => {
                        if (v.orderScheduleId === this.departInfo.id) {
                            v.indexs = 1
                        } else {
                            v.indexs = 2
                        }
                        return v
                    })

                    // this.showPricelist = []
                    // let sampleArr = []
                    // result.data.schedulePassengerPriceList.forEach((item, index) => {
                    //     if (sampleArr.indexOf(item.orderScheduleId) != -1) {
                    //         this.showPricelist.push({
                    //             orderScheduleId: item.orderScheduleId,
                    //             orderScheduleId: item.orderScheduleId,
                    //         })
                    //     }
                    // })
                }
            })
        },
        AjaxgetCurrentDate() {
            this.fetch({
                url: api.getCurrentDate,
                method: 'POST',
                data: {}
            }).then((result) => {
                if ((result.code === '200' || result.success) && !isEmpty(result.data)) {
                    this.getCurrentDate = result.data
                    console.log(this.getCurrentDate)
                    this.countDown()
                }
            })
        },
        // 倒计时
        countDown() {
            /* eslint-disable */
            let od = this.scheduleDetail
            let lessTime = new Date(od.createTime.replace(/\-/g, '/')).getTime() + (15 * 60 * 1000) - (new Date(this.getCurrentDate.replace(/\-/g, '/')).getTime())
            // let getOrderTimer = null

            if (lessTime <= 0) {
                this.getOrderTimer = setTimeout(() => {
                    // 到时间自动取消
                    this.cancelDeil()
                    // this.initDetail()
                    clearTimeout(this.getOrderTimer)
                }, 3000)
                return
            }
            this.interalTimer = setInterval(() => {
                lessTime -= 1000
                if (lessTime <= 0) {
                    clearInterval(this.interalTimer)
                    this.initDetail()
                    return
                }
                var min = parseInt((lessTime / 1000 / 60) % 60)
				var	secd = parseInt((lessTime / 1000) % 60)
				min = min < 10 ? '0' + min + '' : min + '',
				secd = secd < 10 ? '0' + secd + '' : secd + ''
                this.statusTips = `<em class='sub-color'>${min}:${secd}</em>`
                console.log(this.statusTips)
            }, 1000)
            /* eslint-disable */
        },
        showDown(key) {
            if (key === 4) {
                this.showFour = !this.showFour
                this.arrFourName = this.showFour ? 'arrow-up' : 'arrow-down'
            } else {
                this.showThree = !this.showThree
                this.arrthreeName = this.showThree ? 'arrow-up' : 'arrow-down'
            }
        },
        showPsgerPop(item={}) {
            if (!isEmpty(item)) {
                this.isShowPsger = true
                this.tripType = item.tripType
            }
            this.$loading()
            this.fetch({
                url: api.getOrderPassengerTicketDetail,
                method: 'POST',
                data: {
                    orderSn: this.orderSn,
                    scheduleId: item.id ||''
                }
            }, {
                name: 'orderdetail',
                query: { ...this.$route.query }
            }).then((result) => {
                this.$hloading()
                if (result.code === '200' && !isEmpty(result.data)) {
                    // this.psgerList = result.data
                    this.psgerList = result.data.map((v) => {
                        if (v.scheduleId === this.departInfo.id) {
                            v.indexs = 1
                        } else {
                            v.indexs = 2
                        }
                        return v
                    })
                } else {
                    this.$alert({
                        txt: this.$t('获取数据失败')
                    })
                }
            })
        },
        dropDown(e) {
            let lengths = parseInt(e) + 1
            if (this.showDownArr.length !== lengths) {
                this.showDownArr = Array(lengths).fill(false)
            }
            let newValue = !this.showDownArr[e]
            this.$set(this.showDownArr, e, newValue)
            console.log(this.showDownArr)
        },
        closeBtn(e) {
            if (e.target.className === 'layer') {
                this.isShowPsger = false
            }
        },
        closeBtns() {
            this.isShowPsger = false
        },
        goRefund() {
            this.$confirm({
                title: 'tips',
                txt: this.$t('确定要退票吗？'),
                okBtn: 'Refund',
                cancelBtn: 'No',
                okFn: () => {
                    this.$toast({
                        txt: this.$t('退款申请已提交')
                    })
                }
            })
        },
        goHome() {
            this.$router.push({
                name: 'home'
            })
        },
        cancelDeil() {
            this.fetch({
                url: api.cancelOrder,
                method: 'POST',
                data: {
                    "orderList": [
                        {
                            "orderSn": this.$route.query.orderNo
                        }
                    ]
                }
            }).then((result) => {
                this.initDetail()
            })
        },
        cancel() {
            this.$confirm({
                title: 'tips',
                txt: this.$t('你确定要取消这个订单吗？'),
                okBtn: this.$t('取消订单'),
                cancelBtn: 'No',
                okFn: () => {
                    this.fetch({
                        url: api.cancelOrder,
                        method: 'POST',
                        data: {
                            "orderList": [
                                {
                                    "orderSn": this.$route.query.orderNo
                                }
                            ]
                        }
                    }).then((result) => {
                        this.$toast({
                            txt: this.$t('已取消'),
                            complete: () => {
                                clearInterval(this.interalTimer)
                                this.initDetail()
                            }
                        })
                    })
                }
            })
        },
        pay() {
            this.$router.push({
                name: 'payment',
                query: {
                    orderNo: this.orderSn
                }
            })
        },
        getBarcode(id, ticketNo) {
            this.$nextTick(() => {
                jsbarcode('#barcode_' + id, ticketNo, { format: 'CODE128', displayValue: false })
            })
            return ticketNo
        }
    },
    destroyed() {
        console.log(123)
        clearInterval(this.interalTimer)
    }
}
</script>
<style lang="less">
@import '~@/assets/styles/base.less';
.md-icon.icon-font{
    color: #ddd;
}
</style>

<style lang="less" scoped>
* { touch-action: pan-y; }
.grey{
    background: #c0c5d1!important;
}
.orderdetail-box{
    width: 100%;
    overflow: hidden;
}
.border-b-d{
    border-bottom:1px dashed #c9c9c9;
}
.ticket-info{
    background: #34354b;
    color:#fff;
    padding:20px 27px;
    .main-info{
        padding: 20px 0;
        position: relative;
    }
    .back-info{
        border-top:1px dashed #c9c9c9;
    }
    .ticket-type{
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size:24px;
        .right-seat{
            text-align: right;
            font-size:28px;
        }
        .left-type{
            font-size:28px;
        }
    }
    .ticket-msg{
        width: 100%;
        height: 156px;
        padding-bottom: 24px;
        .left-sm{
            width: 170px;
            .dpt-date{
                height: 60px;
                line-height:60px;
                font-size:36px;
                text-align: left;
                text-indent:10px;
                font-weight: bold;
            }
            .dpt-time,.dpt-arrive{
                height: 48px;
                line-height:48px;
                font-size:32px;
                text-align: left;
                text-indent:10px;
            }
        }
        .right-bg {
            .dpt-long{
                height: 60px;
                line-height:60px;
                font-size:32px;
            }
            .dpt-stations{
                line-height:48px;
                height: 48px;
                font-size:32px;
                position: relative;
                &::before{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -20px;
                    background-color: #999;
                    width: 8px;
                    height: 8px;
                    border: 1px solid #eaebee;
                    -webkit-transform: translateY(-50%) rotate(45deg);
                    transform: translateY(-50%) rotate(45deg);
                    z-index: 3;
                }
                &::after{
                    content: '';
                    position: absolute;
                    left: -16px;
                    background-color: #eaebee;
                    width: 2px;
                    z-index: 1;
                    top: 50%;
                    bottom: 0;
                }
            }
            .dpt-endstations{
                line-height:48px;
                height: 48px;
                font-size:32px;
                position: relative;
                span{
                    color: #ff6f61;
                }
                &::before{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -20px;
                    background-color: #999;
                    width: 8px;
                    height: 8px;
                    border: 1px solid #eaebee;
                    -webkit-transform: translateY(-50%) rotate(45deg);
                    transform: translateY(-50%) rotate(45deg);
                    z-index: 3;
                }
                &::after{
                    content: '';
                    position: absolute;
                    left: -16px;
                    background-color: #eaebee;
                    width: 2px;
                    z-index: 1;
                    top: 0;
                    bottom: 50%;
                }
            }
        }
    }
}
.services{
        justify-content: space-between;
        width: 100%;
        height: 120px;
        padding:30px 0;
        background: #fff;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: scroll;
        white-space: nowrap;
        .service-item{
            width: 25%;
            display: inline-block;
        }
        &>div{
            width: 40px;
            height: 60px;
            img{
                display: block;
                width: 36px;
                height: 26px;
                margin:0 auto;
            }
            p{
                font-size:20px;
                text-align: center;
                color: #34354b;
                text-align: center
            }
        }
    }
.withPsg{
    padding-bottom:0!important;
}
.red-txt{
    color: #ff6f61!important;
    font-weight: 700;
}
.psger-detail{
    width: 696px;
    height: 56px;
    font-size:28px;
    line-height: 96px;
    box-sizing: border-box;
    font-family: '方正兰亭黑简体';
    color: #ffffff;
    text-align: left;
}
.orderdetail-box{
    // width: 100%;
    // overflow-x: hidden;
    padding-bottom: 180px;
    .ticket-status{
        background: #34354b;
        width: 100%;
        height: 96px;
        line-height: 96px;
        font-size:36px;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        position: relative;
        border-bottom: 2px dashed #ededf0;
        span{
            position: absolute;
            right: 27px;
            color: #ff6f61;
            font-size: 36px;
        }
    }
    .orderid-box{
        background: #fff;
        width: 100%;
        // Height: 144px;
        padding: 0 27px;
        line-height: 1;
        color: #1e1e1e;
        line-height: 144px;
        position: relative;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: space-around;
        .orderid{
            width: 152px;    
            line-height: 80px;
            font-size: 32px
        }
        .orderid-a{
            line-height: 80px;
            font-size: 32px
        }
        .order-id{
            width: 100%;
            height: 72px;
            line-height: 72px;
        }
        .des{
            width: 100%;
            // height: 48px;
            padding-left:152px;
            line-height: 1;
            background-color: rgba(255, 255, 255, 0);
            box-sizing: border-box;
            font-family: '方正兰亭黑简体';
            color: #9ea5b9;
            padding-bottom: 10px;
            // position: absolute;
            // bottom: 0;
        }
    }
    .payInfo-box{
            margin-top:24px;
            .b-title{
                font-weight: 700;
            }
            .sub-title{
                color: rgba(52, 53, 75, 0.7);
                text-align: right
            }
            .bar-banner{
                height: 96px;
                line-height: 96px;
                background: #fff;
                color: #333333;
                font-size: 32px;
                font-family: '方正兰亭黑简体 Bold', '方正兰亭黑简体';
                padding:0 27px;
                
            }
            .psger-listbox{
                background: #fff;
                padding: 0 27px;
                .left-title{
                    width: 160px;
                    line-height: 72px;
                }
                .right-deslist{
                    .left-title{
                        width: 160px;
                    }
                    .bdd{
                        border-bottom: 1px dashed #c9c9c9;
                    }
                    .list-item{
                        height: 72px;
                        line-height: 72px;
                        // border-bottom: 1px dashed #c9c9c9;
                        box-sizing: border-box;
                        font-family: '方正兰亭黑简体';
                        color: #333;
                        .list-price{
                            // font-weight: 700;
                            color: #6b7694;
                            text-align: right
                        }
                    }
                }
            }
            .price-box{
                width: 100%;
                height: 96px;
                line-height: 96px;
                font-size: 28px;
                color: #666;
            }
            .price-total{
                color: #ff6f61;
                text-align: right;
                font-weight: bold;
            }
        }
}
.creation-time{
    width: 100%;
    height: 72px;
    line-height: 72px;
    border-radius: 36px;
    background-color: rgba(255, 255, 255, 0);
    box-sizing: border-box;
    font-family: '方正兰亭黑简体';
    color: #8b94ab;
    margin-top:24px;
    padding:0 24px;
    .phone-box{
        width: 88px;
        height: 48px;
        line-height: 48px;
        border-radius: 8px;
        font-size: 24px;
        border: 2px solid #ddd;
        text-align: center;
    }
}
.status-tips{
    position: absolute;
    right:27px;
    bottom:50px;
    z-index: 2;
    transform: rotate(-45deg);
}
.layer{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    .boder-b-d{
        border-bottom: 1px dashed #c9c9c9;
    }
    .pop-wrap{
        width: 696px;
        // max-height: 907px;
        overflow-y: scroll;
        border-radius: 12px;
        background-color: #ffffff;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #000000;
        text-align: left;
        padding:27px;
        margin:0 auto;
        margin-top: 100px;
        .wrap{
            max-height: 807px;
            overflow: scroll;
            -webkit-overflow-scrolling: touch
        }
        .fb-title{
            width: 100%;
            height: 96px;
            line-height: 96px;
            color: #333;
            font-family: 'Arial Regular', 'Arial';
        }
        .se-title{}
        .line-banner{
            width: 100%;
            height: 96px;
            line-height: 96px;
            color: #333;
            font-family: 'Arial Regular', 'Arial';
        }
        .psger-seats{
            padding-left:16px;
            img{
                display: inline-block;
                width:36px;
                height:36px;
                position: relative;
                top:8px;
                margin-right: 16px;
            }
        }
        .dropDown{
            // width: 360px;
            // height: 360px;
            // margin:0 auto;
            margin:0 auto;
            img{
                max-width: 100%;
                display: block;
                margin: 0 auto;
            }
        }
    }
    .close-btn{
        width: 360px;
        height: 72px;
        line-height: 72px;
        border-radius: 48px;
        border: 1px solid #9ea5b9;
        background-color: #ffffff;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #263056;
        text-align: center;
        margin:0 auto;
        margin-top:10px;
    }
}
.refund{
    display: flex;
    align-items: center;
    width: 360px;
    height: 72px;
    line-height: 72px;
    color: #8b94ab;
    text-align: center;
    margin: 0 auto;
    margin-top: 20px;
    text-align: center;
    justify-content: center;
    img{
        width: 28px;
        height: 28px;
        margin-right:10px;
    }
    i{
        transform: rotate(-45deg);
        margin-right: 10px;
        margin-top:4px;
    }
}
.bt-btn{
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform:translateX(-50%);
    .red-btn{
        width: 696px;
        height: 96px;
        border-radius: 48px;
        border: 1px solid #e4e4e4;
        background-color: #ff6f61;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #ffffff;
        text-align: center;
        line-height: 96px;
    }
}
.gold{
    color: #ff9900!important;
    font-style: italic!important;
}
</style>
