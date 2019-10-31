<template>
    <div class="order-box">
        <div class="filter-box ">
            <div class="face-top fbox" @click="showSlide">
                <div class="l-b-d flex1"></div>
                <div class="center-txt">{{$t('所有订单')}}  <md-icon name="arrow-down"></md-icon></div>
                <div class="l-b-d flex1"></div>
            </div>
            <div class="down-slide" :class="{'showSlide':isShowSlide}">
                <div class="left-item " @click="filter(0)">{{$t('所有订单')}}</div>
                <div class="left-item " @click="filter(1)">{{$t('一个月内')}}</div>
                <div class="left-item " @click="filter(2)">{{$t('两个月内')}}</div>
                <div class="left-item " @click="filter(3)">{{$t('更早')}}</div>
            </div>
        </div>

        <div class="order-item" v-for="(item,index) in orderList" :key="index" @click="goDetail(item)">
            <div class="ticket-info">
                <div class="main-info">
                    <!-- 出发到达的修饰文案start -->
                    <div class="ticket-type fbox" v-if="item.orderType===1">
                        <div class="flex1 left-type">{{$t('出发信息')}}</div>
                    </div>
                    <!-- 出发到达的修饰文案end -->
                    <div class="ticket-msg fbox">
                        <div class="left-sm">
                            <div class="dpt-date">{{item.startDayTrip |filday }}</div>
                            <div class="dpt-time">{{item.startTimeTrip}}</div>
                            <div class="dpt-arrive">{{item.endTimeTrip}}<span class="red" v-if="item.minutesTrip>1440">+1{{item.minutesTrip |filDay}}</span></div>
                        </div>
                        <div class="right-bg flex1">
                            <div class="dpt-long">{{item.minutesTrip | filTime}}</div>
                            <div class="dpt-stations">{{item.departureStationTrip}}</div>
                            <div class="dpt-endstations">{{item.arriveStationTrip}}</div>
                        </div>
                    </div>
                    <div class="price-status">
                        <span class="price-box">THB {{item.payAmount}}</span>
                        <span class="status-box">{{item.displayStatus | dealStatus}}</span>
                    </div>
                </div>
                <!-- 返程 -->
                <div class="main-info" v-if="item.orderType===1" :class="{'border-top':item.orderType===1}">
                    <!-- 出发到达的修饰文案start -->
                    <div class="ticket-type fbox" v-if="item.orderType=1">
                        <div class="flex1 left-type">{{$t('返回信息')}}</div>
                    </div>
                    <!-- 出发到达的修饰文案end -->
                    <div class="ticket-msg fbox">
                        <div class="left-sm">
                            <div class="dpt-date">{{item.startDayReturn |filday}}</div>
                            <div class="dpt-time">{{item.startTimeReturn}}</div>
                            <div class="dpt-arrive">{{item.endTimeReturn}}<span class="red" v-if="item.minutesReturn>1440">+{{item.minutesReturn |filDay}}</span></div>
                        </div>
                        <div class="right-bg flex1">
                            <div class="dpt-long">{{item.minutesReturn | filTime}}</div>
                            <div class="dpt-stations">{{item.departureStationReturn}}</div>
                            <div class="dpt-endstations">{{item.arriveStationReturn}}</div>
                        </div>
                    </div>
                    <!-- <div class="price-status">
                        <span class="price-box">THB {{item.orderAmount}}</span>
                        <span class="status-box">待支付</span>
                    </div> -->
                </div>
            </div>
        </div>

        <!-- <div class="order-item">
            <div class="ticket-info">
                <div class="main-info">
                    <div class="ticket-type fbox">
                        <div class="flex1 left-type">Depart Info</div>
                    </div>
                    <div class="ticket-msg fbox">
                        <div class="left-sm">
                            <div class="dpt-date">66666</div>
                            <div class="dpt-time">6666</div>
                            <div class="dpt-arrive">6666</div>
                        </div>
                        <div class="right-bg flex1">
                            <div class="dpt-long">66666</div>
                            <div class="dpt-stations">66666</div>
                            <div class="dpt-endstations">666666</div>
                        </div>
                    </div>
                    <div class="price-status">
                        <span class="price-box">THB 555</span>
                        <span class="status-box">待支付</span>
                    </div>
                </div>
            </div>
        </div> -->
        <div class='no-more' v-if="showNomore">{{$t('没有更多')}}</div>
    </div>
</template>

<script>
import { Icon } from 'mand-mobile'
import api from '../../config/api'
import { isEmpty, formatDate, getStore } from '../../libs/util'
export default {
    name: 'orderlist',
    components: {
        [Icon.name]: Icon
    },
    created() {
        this.getList()
    },
    filters: {
        filday: function(value) {
            let tmp = formatDate(value, 'MM/dd')
            return tmp // 06/27
        },
        filTime: function(value) {
            let day = parseInt(value / (60 * 24)) ? parseInt(value / (60 * 24)) + 'd' : ''
            let hour = parseInt(value / 60) ? parseInt(value / 60) + 'h' : ''
            let min = parseInt(value % 60) ? parseInt(value % 60) + 'm' : ''
            return day + hour + min
        },
        dealStatus: function(value) {
            // 对乘客展示的状态  0待支付 1已支付 4已出票 6已取消 9退票成功 11已完成(已过检票时间)
            // let status = ''
            let state0 = '待支付'
            let state1 = '已取消'
            let state2 = '已出票'
            let state4 = '已支付'
            // let state5 = '退款中'
            // let state6 = '已退款'
            let state7 = '已退票'
            let state8 = '已完成'
            if (window.locale === 'en') {
                state0 = 'Waiting for payment'
                state1 = 'Calcelled'
                state2 = 'Ticket issued'
                state4 = 'Paid'
                // state5 = 'Refunding'
                // state6 = 'Refunded'
                state7 = 'Cancelled'
                state8 = 'Success'
            } else if (window.locale === 'th') {
                state0 = 'รอชำระเงิน'
                state1 = 'ยกเลิกแล้ว'
                state2 = 'ออกตั๋วแล้ว'
                state4 = 'ชำระเงินแล้ว'
                // state5 = 'กำลังคืนเงิน'
                // state6 = 'คืนเงินแล้ว'
                state7 = 'คืนตั๋วแล้ว'
                state8 = 'สำเร็จแล้ว'
            }
            let txt = ''
            switch (value) {
                case 0:
                    txt = state0
                    break
                case 1:
                    txt = state4
                    break
                case 4:
                    txt = state2
                    break
                case 6:
                    txt = state1
                    break
                case 9:
                    txt = state7
                    break
                case 11:
                    txt = state8
                    break
            }
            return txt
        },
        filDay: function(val) {
            let d = window.locale === 'en' ? 'D' : window.locale === 'th' ? '天' : '天'
            let day = parseInt(val / (60 * 24)) ? parseInt(val / (60 * 24)) + d : ''
            return day
        }
    },
    data() {
        return {
            page: 1,
            orderList: [],
            pages: 0, // 总页数
            queryingData: false, // 是否正在请求数据
            showNomore: false, // 没有更多
            noData: false, // 没有数据
            timeType: 0,
            isShowSlide: false
        }
    },
    beforeRouteLeave(to, from, next) {
        window.removeEventListener('scroll', this.scrollLoad, true)
        next()
    },
    mounted() {
        this.$nextTick(() => {
            // 监听这个dom的scroll事件
            window.addEventListener('scroll', this.scrollLoad, true)
        })
    },
    methods: {
        filter(timeType) {
            if (timeType === this.timeType) {
                return
            } else {
                this.timeType = timeType
            }
            this.page = 0
            this.isShowSlide = false
            this.queryingData = false
            this.getList(timeType)
        },
        getList(timeType) {
            if (this.queryingData) return
            this.$loading()
            this.queryingData = true
            let memberId = getStore('memberId') || ''
            this.fetch({
                url: api.onlineOrder,
                method: 'POST',
                data: {
                    memberId: memberId,
                    timeType: this.timeType,
                    page: this.page,
                    pageSize: 20,
                    searchInput: '',
                    vcode: window.provider
                }
            }).then((result) => {
                this.$hloading()
                if ((result.code === '200' || result.success) && !isEmpty(result.data) && !isEmpty(result.data.list)) {
                    if (this.page === 1) {
                        this.pages = result.data.pages
                        this.orderList = result.data.list
                    } else {
                        this.orderList.push(...result.data.list)
                    }
                    this.page++
                    if (this.page > this.pages) {
                        this.queryingData = true
                        this.showNomore = true
                    } else {
                        this.queryingData = false
                    }
                } else {
                    this.queryingData = true
                    this.noData = true
                    this.$alert({
                        txt: this.$t('获取数据失败')
                    })
                }
            })
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
        },
        showSlide() {
            this.isShowSlide = !this.isShowSlide
        },
        goDetail(item) {
            this.$router.push({
                name: 'orderdetail',
                query: {
                    orderNo: item.orderSn
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.order-box{
    padding: 0 27px;
    .face-top{
        position: relative;
        z-index: 99;
        height: 86px;
        padding-top:24px;
        padding-bottom:24px;
        background: #fff;
    }
    .no-more{
        width: 100%;
        height: 100px;
        text-align: center;
        color: #999;
    }
    .filter-box{
        width: 100%;
        // height: 62px;
        text-align: center;
        color: #34354b;
        font-family: '方正兰亭黑简体';
        // padding-bottom:24px;
        margin-bottom:24px;
        background: #f2f4f7;
        position: relative;
        .down-slide{
            position: absolute;
            left:0;
            top:48px;
            width: 100%;
            background: #fff;
            padding:20px 20px;
            -moz-box-shadow:0px 0px 10px #999; -webkit-box-shadow:0px 0px 10px #999; box-shadow:0px 0px 10px #999;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            z-index: 98;
            transform: translate3D(0, -100%, 0);
            visibility: hidden;
            transition: all 0.6s ease;
            .left-item{
                width: 100%;
                height: 60px;
                line-height: 60px;
            }
        }
        .showSlide{
            transform: translate3D(0, 0, 0);
            visibility: visible;
        }
        .l-b-d{
            width: 100%;
            height: 1px;
            border-bottom: 1px dashed #a5adbe;
            position: relative;
            top:  24px;
        }
        .center-txt{
            width: 216px;
            line-height:48px;
            font-size:24px;
            color: #34354b
        }
    }
    .order-item{
        margin-bottom: 24px;
        width: 696px;
        border-radius: 8px;
        -moz-box-shadow:0px 0px 10px #999; -webkit-box-shadow:0px 0px 10px #999; box-shadow:0px 0px 10px #999;
        background-color: #ffffff;
        overflow: hidden;
    }
    .ticket-info{
        position: relative;
        .price-status{
            position: absolute;
            right: 27px;
            top:20px;
            .price-box{
                font-size: 24px;
                font-family: '方正兰亭黑简体';
                color: #9ea5b9;
                margin-right: 10px;
            }
            .status-box{
                font-size: 24px;
                font-family: '方正兰亭黑简体';
                color: #ff6f61;
            }
        }
        .main-info{
            background: #fff;
            color:#34354b;
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
            font-size:28px;
            font-family: '方正兰亭黑简体';
            color: #263056;
            .right-seat{
                text-align: right
            }
        }
        .ticket-msg{
            width: 100%;
            height: 156px;
            padding-bottom: 24px;
            font-weight: 700;
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
                    color: #34354b;
                    font-weight: 700;
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
                    color: #34354b;
                    font-weight: 700;
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
                height: 120px;
                position: relative;
                .id-txt{
                    font-size:28px;
                    color:#1e1e1e;
                    line-height: 120px;
                    span{
                        width:134px;
                        padding-left:18px;
                    }
                }
                .sub-txt{
                    position: absolute;
                    left:134px;
                    top:72px;
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
    .red{
        margin-left:10px;
        color:red;
    }
}
</style>
