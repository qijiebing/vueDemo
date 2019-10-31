<template>
    <div class="travel-box listWrap" ref="viewBox">
        <div class="no-result" v-if="noTravelData">
            <img src="./../../../assets/img/list/recommond.png" alt="">
            <p>{{$t('暂时无线路')}}</p>
        </div>
        <md-steps
            direction="vertical"
            :steps="orderList"
            :current="0"
            >
            <template slot="reached">
                <md-icon name="checked"></md-icon>
            </template>
            <div
                class="custom-content"
                slot="content"
                slot-scope="{ index, step }"
                vertical-adaptive
            >
                <template>
                    <div class="big-title">{{step.lineName}}</div>
                    <div class="card-module ticket-info" >
                        <div class="main-info" :class="{'greybg':step.displayStatus === 11}">
                            <div class="ticket-msg fbox">
                                <div class="left-sm">
                                    <div class="dpt-date">{{step.startDay | filday}}</div>
                                    <div class="dpt-time">{{step.startTime}}</div>
                                    <div class="dpt-arrive">{{step.expectedArriveTime}} <span class="red">{{step | filTime}}</span></div>
                                </div>
                                <div class="right-bg flex1">
                                    <div class="dpt-long">{{step.minutes | filTime1}}</div>
                                    <div class="dpt-stations">{{step.departureStation}}</div>
                                    <div class="dpt-endstations">{{step.arriveStation}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="order-id">
                            <div class='order-box' v-if="step.displayStatus!== 11">
                                <p class="id-txt fbox"><span class="name-id">{{$t('订单号')}}:</span><span class="flex1 center-span">{{step.orderSn}}</span></p>
                                <p class="sub-txt">{{$t('请凭借订单号，到出发车站取票乘车')}}</p>
                            </div>
                            <div class="psger-detail fbox" @click="showPsgerPop(step)" v-if="step.displayStatus!== 11">
                                <div class="flex1 left-txt"><md-icon name="user"></md-icon>{{$t('乘客详情')}}</div>
                                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            </md-steps>
            <div class="layer" v-if="isShowPsger" @click="closeBtn">
                <div class="pop-wrap">
                    <div class="fb-title boder-b-d">
                        {{tripType===0? $t('出发'):$t('返回')}}: {{$t('乘客详情')}}
                    </div>
                    <div class="wrap">
                        <div class="se-title border-b-d" v-for="(item,index) in psgerList" :key="index">
                            <div class="line-banner fbox"  @click="dropDown(index)">
                                <div class="flex1">{{item.passengerName}}</div>
                                <div class="psger-type">{{item.ticketTypeName}}</div>
                                <div class="psger-seats"><img src="./../../../assets/img/orderdetail/ewm.png" alt="">{{item.seatNo}}</div>
                            </div>
                            <div class="dropDown" v-if="showDownArr[index]===true">
                                <!-- <img src="./../../../assets/img/orderdetail/ewm.png" alt=""> -->
                                <img :id="'barcode_' + item.scheduleId" :barcode="getBarcode(item.scheduleId, item.ticketNo)" src="#"/>
                            </div>
                        </div>
                    </div>

                    <div class="close-btn" @click="closeBtns">Close</div>
                </div>
            </div>

            <div class='no-more' v-if="showNomore">{{$t('没有更多')}}</div>
    </div>
</template>

<script>
import { Steps, Amount, Icon } from 'mand-mobile'
import api from '@/config/api'
import jsbarcode from 'jsbarcode'
import { isEmpty, formatDate } from '@/libs/util'
export default {
    name: 'travel',
    components: {
        [Steps.name]: Steps,
        [Amount.name]: Amount,
        [Icon.name]: Icon
    },
    props: {
        currentTabRF: {
            type: Number
        }
    },
    filters: {
        filday: function(value) {
            let tmp = formatDate(value, 'MM/dd')
            return tmp // 06/27
        },
        // filTime1: function(value) {
        //     let day = parseInt(value / (60 * 24)) ? parseInt(value / (60 * 24)) + 'd' : ''
        //     let hour = parseInt(value / 60) ? parseInt(value / 60) + 'h' : ''
        //     let min = parseInt(value % 60) ? parseInt(value % 60) + 'm' : ''
        //     return day + hour + min
        // },
        filTime1: function(value) {
            let d = window.locale === 'en' ? 'D' : window.locale === 'th' ? 'วัน' : '天'
            let H = window.locale === 'en' ? 'Hour' : window.locale === 'th' ? 'ชั่วโมง' : '时'
            let M = window.locale === 'en' ? 'Min' : window.locale === 'th' ? 'นาที' : '分'
            let day = parseInt(value / (60 * 24)) ? parseInt(value / (60 * 24)) + d : ''
            let hour = parseInt(value / 60) ? parseInt(value / 60) + H : ''
            let min = parseInt(value % 60) ? parseInt(value % 60) + M : ''
            return day + hour + min
        },
        filTime: function(val) {
            let day = 0
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
        }
    },
    watch: {
        currentTabRF: {
            handler(newValue) {
                console.log(newValue)
                if (newValue === 1) {
                    this.getList()
                }
            },
            deep: true,
            immediate: true
        }
    },
    beforeRouteLeave(to, from, next) {
        window.removeEventListener('scroll', this.scrollLoad, true)
        next()
    },
    data() {
        return {
            showDownArr: [true],
            isShowPsger: false,
            orderList: [],
            page: 1,
            steps0: [
                {
                    name: ''
                }
            ],
            tripType: 0, // 出行类型 0:去程 1:返程
            psgerList: [],
            pages: 0, // 总页数
            queryingData: false, // 是否正在请求数据
            showNomore: false, // 没有更多
            noTravelData: false // list没数据
        }
    },
    mounted() {
        this.$nextTick(() => {
            // 监听这个dom的scroll事件
            window.addEventListener('scroll', this.scrollLoad, true)
        })
    },
    methods: {
        showPsgerPop(item) {
            this.isShowPsger = true
            this.tripType = item.tripType
            this.$loading()
            this.fetch({
                url: api.getOrderPassengerTicketDetail,
                method: 'POST',
                data: {
                    orderSn: item.orderSn,
                    scheduleId: item.id
                }
            }).then((result) => {
                this.$hloading()
                // result = {
                //     'code': '200',
                //     'msg': '操作成功！',
                //     'data': [
                //         {
                //             'passengerName': '张三',
                //             'seatNo': '1',
                //             'ticketTypeName': 'พระภิกษุสงฆ์',
                //             'ticketNo': 'TC003#874',
                //             'scheduleId': 85
                //         },
                //         {
                //             'passengerName': '张三儿子',
                //             'seatNo': '3',
                //             'ticketTypeName': 'พระภิกษุสงฆ์',
                //             'ticketNo': 'TC003#875',
                //             'scheduleId': 85
                //         }
                //     ],
                //     'success': true
                // }
                if (result.code === '200' && !isEmpty(result.data)) {
                    this.psgerList = result.data
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
        getList() {
            if (this.queryingData) return
            this.$loading()
            this.queryingData = true
            this.fetch({
                url: api.pageOrderSchedule,
                method: 'POST',
                data: {
                    page: this.page,
                    pageSize: 20
                }
            }).then((result) => {
                this.$hloading()
                // result = {
                //     'code': '200',
                //     'msg': '操作成功！',
                //     'data': {
                //         'total': 2,
                //         'list': [
                //             {
                //                 'id': 73,
                //                 'orderSn': 'r2eYWomKdPdy5DUPTUdH',
                //                 'departureCity': 'Krabi',
                //                 'departureStation': '甲米府站',
                //                 'arriveCity': 'Tak',
                //                 'arriveStation': '来兴府站',
                //                 'startDay': '2019-07-24',
                //                 'startTime': '03:00',
                //                 'minutes': 30,
                //                 'lineNo': '000019',
                //                 'lineName': '任申的测试线路 甲米—曼谷1',
                //                 'tripType': 0,
                //                 'carModelName': '',
                //                 'expectedArriveDay': '2019-07-25',
                //                 'expectedArriveTime': '03:30'
                //             }
                //         ],
                //         'pageNum': 1,
                //         'pageSize': 2,
                //         'size': 2,
                //         'startRow': 1,
                //         'endRow': 2,
                //         'pages': 1,
                //         'prePage': 0,
                //         'nextPage': 0,
                //         'isFirstPage': true,
                //         'isLastPage': true,
                //         'hasPreviousPage': false,
                //         'hasNextPage': false,
                //         'navigatePages': 8,
                //         'navigatepageNums': [
                //             1
                //         ],
                //         'navigateFirstPage': 1,
                //         'navigateLastPage': 1
                //     },
                //     'success': true
                // }
                if ((result.code === '200' || result.success) && !isEmpty(result.data) && !isEmpty(result.data.list)) {
                    if (this.page === 1) {
                        this.pages = result.data.pages
                        this.orderList = result.data.list
                    } else {
                        this.orderList.push(...result.data.list)
                    }
                    console.log(this.orderList)
                    this.page++
                    if (this.page > this.pages) {
                        this.queryingData = true
                        this.showNomore = true
                        return
                    } else {
                        this.queryingData = false
                    }
                } else if (isEmpty(result.data.list)) {
                    this.noTravelData = true
                } else if (result.code === '50007') {
                    // this.$alert({
                    //     txt: this.$t('未登录，请登录'),
                    //     okFn: () => {
                    this.$router.replace({
                        name: 'login',
                        query: {
                            goTo: 'home',
                            tab: 1
                        }
                    })
                    // }
                    // })
                }
                console.log(result)
            })
        },
        getBarcode(id, ticketNo) {
            this.$nextTick(() => {
                jsbarcode('#barcode_' + id, ticketNo, { format: 'CODE128', displayValue: false })
            })
            // if (this.ticketNos.filter(item => item === ticketNo).length > 0) {
            //     return ticketNo
            // }
            // this.ticketNos.push(ticketNo)
            // this.barcodeCount++
            // const clockId = this.tryLater(() => {
            //     clearInterval(clockId)
            //     jsbarcode('#barcode_' + id, ticketNo, {format: 'CODE128', displayValue: false})
            //     this.barcodeCount--
            // }, 300)
            return ticketNo
        },
        // 滚动加载汽车票列表
        scrollLoad(event) {
            let listH = window.innerHeight // 高度
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 已滚动的距离
            let scrollH = document.documentElement.scrollHeight || document.body.scrollHeight // 总高度

            // 滚动超过75%请求班次列表
            if ((listH + scrollTop) / scrollH * 100 > 75) {
                console.log('滚动超过了70%，请求班次列表')
                this.getList()
            }
        }
    }
}
</script>

<style lang="less">
.md-steps .icon-wrapper .step-node-default-icon{
    background: rgb(102, 111, 131);
    width: 20px!important;
    height: 20px!important;
}
.md-steps-vertical .step-wrapper:last-of-type{
    color:#fff
}
.step-wrapper:last-child .step-node-default-icon{
    width: 16px!important;
    height: 16px!important;
}
.md-steps .bar{
   background-color: rgb(102, 111, 131);
}
.vertical-bar{
    // height: 250px!important;
}
</style>

<style lang="less" scoped>
.travel-box{
    padding-bottom: 100px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .no-more{
        width: 100%;
        height: 100px;
        text-align: center;
        color: #999;
    }
    .big-title{
        // width: 325px;
        height: 60px;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体 Bold', '方正兰亭黑简体';
        font-weight: 700;
        color: #34354b;
        text-align: left;
        line-height: 30px;
    }
    .card-module{
        width: 604px;
        border-radius: 8px;
        overflow: hidden;
    }
    .md-steps{
        min-height: 350px;
    }
    .ticket-info{
        .main-info{
            background: #34354b;
            color:#fff;
            padding:18px 18px;
        }
        div.hasGone{
            background: #c0c5d1;
        }
        .back-info{
            border-top:1px dashed #eee;
        }
        .ticket-type{
            width: 100%;
            height: 48px;
            line-height: 48px;
            font-size:24px;
            .right-seat{
                text-align: right
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
                }
                .dpt-time,.dpt-arrive{
                    height: 48px;
                    line-height:48px;
                    font-size:28px;
                    text-align: left;
                    text-indent:10px;
                }
            }
            .right-bg {
                .dpt-long{
                    height: 60px;
                    line-height:60px;
                    font-size:24px;
                }
                .dpt-stations{
                    line-height:48px;
                    height: 48px;
                    font-size:28px;
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
                    font-size:28px;
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
                        top: 0;
                        bottom: 50%;
                    }
                }
            }
        }
        .order-id{
            width: 100%;
            background:#fff;
            .order-box{
                width: 100%;
                // height: 120px;
                position: relative;
                .id-txt{
                    padding-top:10px;
                    font-size:32px;
                    // color:#1e1e1e;
                    line-height: 80px;
                    span{
                        width:160px;
                        padding-left:18px;
                        line-height: 1.2;
                        font-size:32px;
                        display: flex;
                        align-items: center;
                    }
                    .name-id{
                        // color: #000;
                        // font-weight: 600;
                    }
                }
                .sub-txt{
                    // text-align: right;
                    color: #9ea5b9;
                    margin:10px 10px;
                    margin-left:160px;
                }
            }
        }
        .psger-detail{
            height: 96px;
            border-top: 1px dashed #c9c9c9;
            box-sizing: border-box;
            font-family: '方正兰亭黑简体';
            color: #666666;
            font-size: 24px;
            line-height: 96px;
            padding: 0 18px;
            .left-txt i{
                padding-right:10px;
            }
        }
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
            }
        }
        .dropDown{
            // width: 360px;
            // height: 360px;
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
.bt-btn{
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform:translateX(-50%);
    .refund{
        width: 360px;
        height: 72px;
        line-height: 72px;
        color: #8b94ab;
        text-align: center;
        margin: 0 auto;
        i{
            transform: rotate(-45deg);
            margin-right: 10px;
            margin-top:4px;
        }
    }
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
.red{
    color: #ff6f61;
}
.no-result{
    margin-top:30%;
    p{
        text-align: center;
    }
}
.center-span{
    line-height: 1;
    word-break: break-all;
    display: flex;
    align-items: center;
}
}

</style>
