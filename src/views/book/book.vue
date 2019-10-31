<template>
    <div class="book-box">
        <div class="ticket-info">

            <div class="main-info" v-if="isHasdepartInfo">
                <div class="ticket-type fbox">
                    <div class="flex1 left-type">{{$t('出发信息')}}</div>
                    <div class="flex1 right-seat">
                        <template v-for="(item,index) in TmpseatSelected">
                            {{item.keys}}<span :key="index" v-if="index!=TmpseatSelected.length-1">,</span>
                        </template>
                    </div>
                </div>
                <div class="ticket-msg fbox">
                    <div class="left-sm">
                        <div class="dpt-date">{{departInfo.startDay|filday}}</div>
                        <div class="dpt-time">{{departInfo.startTime}}</div>
                        <div class="dpt-arrive">{{departInfo.arriveTimeExpect}} <span v-if="departInfo.minutes>1440" class="red-c">+{{departInfo.minutes|filDays}}</span> </div>
                    </div>
                    <div class="right-bg flex1">
                        <div class="dpt-long">{{departInfo.minutes|filTime}}</div>
                        <div class="dpt-stations">{{departInfo.startStation}}</div>
                        <div class="dpt-endstations">{{departInfo.endStation}}</div>
                    </div>
                </div>
            </div>
            <div class="main-info back-info" v-if="isHasReturn">
                <div class="ticket-type fbox">
                    <div class="flex1 left-type">{{$t('返回信息')}}</div>
                    <div class="flex1 right-seat">
                        <template v-for="(item, index) in TmpseatSelectedB">
                            {{item.keys}} <span :key="index" v-if="index!=TmpseatSelectedB.length-1">,</span>
                        </template>
                    </div>
                </div>
                <div class="ticket-msg fbox">
                    <div class="left-sm">
                        <div class="dpt-date">{{returnInfo.startDay|filday}}</div>
                        <div class="dpt-time">{{returnInfo.startTime}}</div>
                        <div class="dpt-arrive">{{returnInfo.arriveTimeExpect}} <span v-if="returnInfo.minutes>1440" class="red-c">+{{returnInfo.minutes|filDays}}</span></div>
                    </div>
                    <div class="right-bg flex1">
                        <div class="dpt-long">{{returnInfo.minutes|filTime}}</div>
                        <div class="dpt-stations">{{returnInfo.startStation}}</div>
                        <div class="dpt-endstations">{{returnInfo.endStation}}</div>
                    </div>
                </div>
            </div>

        </div>
        <div class="services" :class="{'lessFour': facility.length<4}" v-if="facility.length>0">
            <div class="service-item"  v-for="(itemi,indexi) in facility" :key="indexi" >
                <!-- <img src="./../../assets/img/book/wift.svg" alt=""> -->
                <i class="iconfont block-icon" :class="'icon-'+facilityDemo[indexi]"></i>
                <p class="textDot">{{facilityDemo[indexi]}}</p>
            </div>
            <!-- <div class="flex1">
                <img src="./../../assets/img/book/cof.svg" alt="">
                <p>service</p>
            </div>
            <div class="flex1">
                <img src="./../../assets/img/book/ser.svg" alt="">
                <p>serivce</p>
            </div>
            <div class="flex1">
                <img src="./../../assets/img/book/office.svg" alt="">
                <p>service</p>
            </div> -->
        </div>
        <!-- 常旅 -->
        <div class="psger-box" :class="{'withPsg': curPassengerCount>0}">
            <div class="number fbox">
                <div class="flex1">
                    <img class="person" src="./../../assets/img/book/person.svg" alt="">
                    {{$t('乘客')}}
                </div>
                <div class="flex1 psger-num"><span class="red-c">{{curPassengerCount}}</span><span>/</span><span>{{maxDueNumber}}</span></div>
            </div>
            <!-- 常旅 -->
            <template>
                <section class="passenger-list fbox border-bottom book-line ul" v-if='linkerData.length>0'>
                    <ul class="fbox" ref='passengerScroll'>
                        <li class="c f14 black textDot " :class="{'selected bold':item.isSelected}" v-for='(item,index) in linkerData' :key='index' @click='selectPassenger(item)'>{{item.passengerName}}</li>
                    </ul>
                    <!-- <span class="ifont white-bg gray passenger-arrow txt-gray " @click='addPassenger(1)'>&#xe929;</span> -->
                </section>
                <ul class="passenger-choosed  ">
                    <li v-for="(item,index) in selectedPassenger" :key='"select-"+index' class="fbox border-bottom book-line">
                        <p class="delete-icon" @click="showDelete(item)" :class='{"show-delete-icon":deleteId ==item.id}'></p>
                        <dl class="flex1 f16 fbox">
                            <dt class="black textDot book-line-left mr15 bold">{{item.passengerName}} </dt>
                            <dd class="gold flex1 f15" v-if="item.member">VIP</dd>
                            <!-- <dd class="gray flex1 f15">{{item.certificateNo}}</dd> -->
                        </dl>
                        <p class="down-wrap"><DownSlider @selDown="selDown" :psgType="item.typeName" :index="index" :list='DownList'></DownSlider></p>
                        <p class="delete c f12 " :class='{"show-delete":deleteId ==item.id}' @click="selectPassenger(item)">{{$t('删除')}}</p>
                    </li>
                </ul>
                <!-- <section class="add-box  book-line green f16  bold" v-if='curPassengerCount!=maxDueNumber' :class="{'add-person-icon':linkerData.length===0}">
                    <p @click='addPassenger' class="add-item"> <span class="book-add-icon  ifont f18 bold">&#xe928;</span>添加/修改乘客</p>
                </section> -->
            </template>
            <!-- 常旅 -->
            <div class="empty-add" v-if='curPassengerCount!=maxDueNumber' @click="addPassenger">
                <img class="adds" src="./../../assets/img/book/add.svg" alt="">
                {{$t('添加乘客')}}
            </div>
        </div>
        <!-- 电话 -->
        <div class="phone-box fbox">
            <img class="phone-icon" src="./../../assets/img/book/phone.svg" alt="">
            <p class="b-g-t">{{$t('联系方式')}}</p>
            <input class="flex1" type="tel" @focus="write" @blur="writeDone" v-model="contactPhone" :placeholder="$t('请输入你的手机号')">
            <!-- <md-field>
                <md-input-item
                    :title="$t('联系方式')"
                    type="contactPhone"
                    v-model="contactPhone"
                    :placeholder="$t('请输入你的手机号')"
                    is-virtual-keyboard
                    clearable
                ></md-input-item>
            </md-field> -->
        </div>
        <!-- 优惠券 -->
        <div class="phone-box fbox" @click="openCoupon">
            <md-icon name="coupon"></md-icon>
            <p class="b-g-t">{{$t('Discount')}}</p>
            <div class="flex1 right-txt" v-if="(selectCoupon.discount || selectCoupon.exemptionFee) && selectedPassenger.length>0">
                <template v-if="selectCoupon.couponType === 1">
                    -{{selectCoupon.exemptionFee}}THB
                </template>
                <template v-else-if="selectCoupon.couponType === 2">
                    -{{discount2}}THB
                </template>
                <md-icon name="arrow-right 1"></md-icon></div>
            <div class="flex1 right-txt" v-else-if="couponList.length>0 && selectedPassenger.length>0 && iscanUse">{{$t('可选优惠券')}}<md-icon name="arrow-right 2"></md-icon></div>
            <div class="flex1 right-txt" v-else-if="couponList.length===0 || selectedPassenger.length===0 || !iscanUse">{{$t('暂无优惠券')}}<md-icon name="arrow-right 3"></md-icon></div>
            <div class="flex1 right-txt" v-else>{{$t('暂无优惠券')}}<md-icon name="arrow-right 4"></md-icon></div>
        </div>
        <!-- 底部按钮 -->
        <div class="bt-wrap" v-show="showBTN && !keyBorading">
            <div class="price-box fbox">
                <div class="flex1 price-DropMenu">
                    <div class="total-price t-c" @click="showPriceList">{{$t('总价')}} {{totalPrice}} {{$t('RMB')}} <md-icon
                        :name="arrName"
                        size="md"
                    ></md-icon></div>
                </div>
                <div class="flex1 t-c sub-btn" :class="{'grey':totalPrice===0 || !contactPhone,'red':totalPrice!=0 && !!contactPhone}" @click="payBtn">{{$t('提交')}}</div>
            </div>
            <slider v-if='showDetail' :isShow='showDetail' :hasClose='false' @hiddenSlider='closeSlider()'>
                <section class="pd10 price-list">
                    <ul class="white-bg pd15 radius10">
                        <li class="fbox">
                            <p class=" f16">{{$t('订单总额')}}</p>
                            <p class="r f16 redcolor">{{$t('RMB')}} {{totalPrice}}</p>
                        </li>

                        <li v-for="(itemz,indexz) in DRPirceList" :key='"price-"+indexz'>
                            <template v-if="itemz['showTitle'] && itemz['priceList'].length>0">
                                <P v-if="rtnScheduleDiD">{{$t(itemz['showTitle'])}}</P>
                                <div v-for="(iteml,indexl) in itemz['priceList']" :key="indexl" v-show="iteml.isShowItem!='noShow'" class="fbox">
                                    <p class="gold f14 flex1" v-if="iteml.useMemberDiscount===1">VIP</p>
                                    <p class="gray f14 flex1" v-if="iteml.useMemberDiscount!==1">{{iteml.showName}}</p>
                                    <p class="r f14 gray flex1">{{iteml.ticketFinalPrice}}
                                        <template v-if="numberLitery[iteml.showName]">
                                            {{numberLitery[iteml.showName]?'x'+numberLitery[iteml.showName]:''}}
                                        </template>
                                    </p>
                                </div>
                            </template>
                        </li>
                        <li v-if="!!selectCoupon && (selectCoupon.discount || selectCoupon.exemptionFee) && selectedPassenger.length>0" class="fbox red-font">
                            <p class=" f16">{{$t('DisCount')}}</p>
                            <p class="r f16 redcolor">
                                <template v-if="selectCoupon.couponType === 1">
                                    -{{selectCoupon.exemptionFee}}THB
                                </template>
                                <template v-else-if="selectCoupon.couponType === 2">
                                    -{{discount2}}THB
                                </template>
                            </p>
                        </li>
                    </ul>
                </section>
            </slider>
        </div>

        <transition name="slide">
            <router-view></router-view>
        </transition>
        <slider v-if='showAdd' :isShow='showAdd' :title="$t('添加/修改常旅')" @hiddenSlider='closeSliderB()'>
            <allPassenger :passengerList="linkerData" :maxDueNumber='maxDueNumber' @selectFromAdd='selectPassenger' :entry='entry' :scheduleDetailId='scheduleDetailId'></allPassenger>
        </slider>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import slider from '@/components/slot-box/vertical-slider.vue'
import { Icon, InputItem, Field, DropMenu, ScrollView } from 'mand-mobile'
import { isEmpty, formatDate, getSession, accAdd, accSub, getStore } from '@/libs/util'
import api from '@/config/api'
import DownSlider from './component/downSlider'
import allPassenger from './component/passenger-more'
export default {
    name: 'book',
    components: {
        [Icon.name]: Icon,
        [InputItem.name]: InputItem,
        [ScrollView.name]: ScrollView,
        [DropMenu.name]: DropMenu,
        [Field.name]: Field,
        slider,
        DownSlider,
        allPassenger
    },
    computed: {
        ...mapState(['isReturn', 'isDpt', 'query', 'seatAmount', 'ticketMsg', 'seatSelected', 'seatSelectedB', 'selectedPassengerx', 'DownList', 'checkedCoupon', 'couponList'])
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
        filDays: function(val) {
            let d = window.locale === 'en' ? 'D' : window.locale === 'th' ? '天' : '天'
            let day = parseInt(val / (60 * 24)) ? parseInt(val / (60 * 24)) + d : ''
            return day
        }
    },
    watch: {
        $router(to, from) {
            console.log(from)
        },
        showAdd(newValue, oldValue) {
            this.showBTN = !newValue
        },
        selectedPassenger(newValue, oldValue) {
            if (this.limitNum) {
                this.$alert({
                    txt: this.limitNum
                })
                this.limitNum = false
                return
            }
            this.curPassengerCount = newValue.length
            let tmpArr = []
            newValue.forEach((itemss, indexss) => {
                if (this.dptscheduleDID) {
                    tmpArr.push({
                        ticketTypeId: itemss.typeId || this.psgTypeId, // 添加的都默认第一个typeid
                        typeName: itemss.typeName || this.psgType,
                        cerificateNumber: itemss.certificateNo,
                        scheduleDetailId: this.dptscheduleDID,
                        carShippingId: this.TmpseatSelected[indexss].carShippingId
                    })
                }
                if (this.rtnScheduleDiD) {
                    tmpArr.push({
                        ticketTypeId: itemss.typeId || this.psgTypeId,
                        typeName: itemss.typeName || this.psgType,
                        cerificateNumber: itemss.certificateNo,
                        scheduleDetailId: this.rtnScheduleDiD,
                        carShippingId: this.TmpseatSelectedB[indexss].carShippingId
                    })
                }
            })
            this.schedulePassengerPriceList = tmpArr // 乘客传参的index和类型的index一致 要对应改
            if (!isEmpty(tmpArr)) {
                // 缓存页面已选乘客
                this.setData({
                    selectedPassengerx: newValue
                })
                console.log(newValue)
                this.ajaxcalculateOrderPrice(tmpArr)
            } else {
                this.totalPrice = 0
                this.DRPirceList = []
            }
            console.log(this.schedulePassengerPriceList)
            // psgTypeArr成人 儿童熟悉数组的push pop
            // if (isEmpty(this.psgTypeArr)) {
            //     this.psgTypeArr = Array(newValue.length).fill(this.DownList[0]) // 初始赋予默认值
            // } else {
            //     if (newValue.length > oldValue.length) {
            //         this.psgTypeArr.push(this.DownList[0])
            //     } else {
            //         let newIdArr = []
            //         newValue.forEach((item, index) => {
            //             newIdArr.push(item.id)
            //         })
            //         oldValue.forEach((element, eindex) => {
            //             if (!newIdArr.indexOf(element.id) === -1) {
            //                 this.psgTypeArr.splite(eindex, 1)
            //             }
            //         })
            //     }
            // }
            // console.log('psgArr' + JSON.stringify(this.psgTypeArr))
        },
        checkedCoupon(nv) {
            if (nv === '') {
                // let tmpdiscount = this.selectCoupon.discount
                if (this.totalPrice > 0) {
                    if (this.selectCoupon.couponType === 1) {
                        this.totalPrice = accAdd(this.beforeMinusPrice, 0)
                    } else if (this.selectCoupon.couponType === 2) {
                        this.totalPrice = accAdd(this.beforeMinusPrice, 0)
                    }
                } else {
                    this.totalPrice = 0
                }
                this.selectCoupon = {}
                return
            }
            this.selectCoupon = this.couponList[nv]
            // this.totalPrice = accSub(this.totalPrice, this.selectCoupon.discount)
            if (!isEmpty(this.selectCoupon)) {
                if (this.selectCoupon.couponType === 1) {
                    this.totalPrice = accSub(this.beforeMinusPrice, this.selectCoupon.exemptionFee)
                } else if (this.selectCoupon.couponType === 2) {
                    this.discount2 = Math.round((this.beforeMinusPrice * this.selectCoupon.discount) / 100)
                    this.totalPrice = accSub(this.beforeMinusPrice, this.discount2)
                    // console.log(this.discount2,this.totalPrice,this.discount2+this.totalPrice)
                    // this.totalPrice = Math.round((this.beforeMinusPrice * (100 - this.selectCoupon.discount))) / 100
                }
                if (this.totalPrice < 0) {
                    this.totalPrice = 0
                }
            }
        }
    },
    data() {
        return {
            contactPhone: '',
            priceData: [],
            beforeMinusPrice: 0, // 没有减优惠的价格
            totalPrice: 0,
            priceList: [],
            showDetail: false,
            arrName: 'arrow-up',
            selectedPassenger: this.selectedPassengerx || [],
            maxDueNumber: 6,
            limitNum: false,
            curPassengerCount: 0,
            linkerData: [],
            departInfo: {},
            returnInfo: {},
            isHasdepartInfo: true,
            isHasReturn: true,
            deleteId: 0,
            showAdd: false,
            psgType: '',
            psgTypeId: '',
            // psgTypeArr: [],
            showBTN: true,
            // DownList: [],
            entry: false,
            scheduleDetailId: '',
            schedulePassengerPriceList: [],
            dptscheduleDID: 0,
            rtnScheduleDiD: 0,
            TmpseatSelected: [],
            TmpseatSelectedB: [],
            facility: [],
            facilityDemo: ['wifi', 'Toilet', 'Lie-flat-Seat-or-Bed', 'Air-Conditioning', 'USB', 'snacks'],
            DRPirceList: [],
            numberLitery: {},
            phoneAreaCode: '',
            keyBorading: false,
            // couponList: {},
            selectCoupon: {},
            discount2: 0, // 折扣券减的钱
            iscanUse: false // 是否有可用的券
        }
    },
    mounted() {
        // 分页获取常旅
        let ajpsger = this.ajaxPsger()
        // 初始化数据从vuex
        this.initParams(ajpsger)
        // 获取顶部图标
        this.getIcon()
        this.phoneAreaCode = getStore('phoneAreaCode')
    },
    beforeRouteEnter(to, from, next) {
        console.log('★★★beforeEnter★★★', from)
        console.log('★★★beforeEnter★★★', to)
        next()
    },
    methods: {
        ...mapMutations({
            setData: 'setData'
        }),
        initParams(ajpsger) {
            // 缓存session 用于替换vuex刷新的问题scheduleDetailId是最后一个 出发的 或者 返程的id 放置于url
            this.scheduleDetailId = this.$route.query.scheduleDetailId

            let ticketMsg = getSession(`ticketMsg_${this.$route.query.scheduleDetailId}`) || {}
            console.log(ticketMsg)
            this.departInfo = !!this.ticketMsg.departInfo && !isEmpty(this.ticketMsg.departInfo) ? this.ticketMsg.departInfo : ticketMsg.departInfo || {}
            this.returnInfo = !!this.ticketMsg.returnInfo && !isEmpty(this.ticketMsg.returnInfo) ? this.ticketMsg.returnInfo : ticketMsg.returnInfo || {}
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
                this.maxDueNumber = this.TmpseatSelected.length
            }
            if (this.isHasReturn) {
                this.rtnScheduleDiD = this.returnInfo.id
                let seatSelectedB = getSession(`seatSelectedB_${this.rtnScheduleDiD}`) || []
                this.TmpseatSelectedB = !isEmpty(this.seatSelectedB) ? this.seatSelectedB : seatSelectedB
            }
            // 获取票种
            this.ajaxticketType(ajpsger)
            // this.getCouponList()
        },
        ajaxPsger() {
            return this.fetch({
                url: api.queryPsger,
                method: 'POST',
                data: {
                    page: 1,
                    pageSize: 1000
                }
            }, {
                name: 'book',
                query: { ...this.$route.query }
            })
            // .then((result) => {
            //     if (result.code === '200' && !isEmpty(result.data)) {
            //         result = result.data
            //         let linkerData = (result.list).map((item, val) => {
            //             item.isSelected = false
            //             return item
            //         })
            //         console.log(linkerData)
            //         this.linkerData = linkerData
            //         // this.selectedPassenger = linkerData
            //     } else if (result.code === '50007') {
            //         this.$alert({
            //             txt: '获取数据失败，请重新选择班次！',
            //             okFn: () => {
            //                 this.$router.replace({
            //                     name: 'login',
            //                     query: {
            //                         goTo: 'book',
            //                         scheduleDetailId: this.$route.query.scheduleDetailId
            //                     }
            //                 })
            //             }
            //         })
            //     }
            //     console.log(result)
            // })
            // .catch((e) => {
            //     console.log(e)
            // })
        },
        // id来自添加新用户回调
        ajaxPsgerWithResult(id) {
            this.fetch({
                url: api.queryPsger,
                method: 'POST',
                data: {
                    page: 1,
                    pageSize: 1000
                }
            }, {
                name: 'book',
                query: { ...this.$route.query }
            })
                .then((result) => {
                    if (result.code === '200' && !isEmpty(result.data)) {
                        let resultList = result.data.list
                        // 超出 不 selected true
                        let linkerData = []
                        console.log(id)
                        console.log(this.selectedPassengerx.length)
                        console.log(this.maxDueNumber)
                        if (this.selectedPassengerx.length >= this.maxDueNumber) {
                            // 超出数量限制
                            linkerData = (resultList).map((item, val) => {
                                item.isSelected = item.id === id // Boolean(this.selectedPassengerx.find(items => items.id === item.id))
                                item.typeName = this.psgType
                                item.typeId = this.psgTypeId
                                return item
                            })
                            // this.$alert({
                            //     txt: this.$t('抱歉，本车次最大预订人数为') + ` ${this.maxDueNumber} ` + this.$t('名乘客')
                            // })
                        } else {
                            linkerData = (resultList).map((item, val) => {
                                item.isSelected = item.id === id || Boolean(this.selectedPassengerx.find(items => items.id === item.id))
                                item.typeName = this.psgType
                                item.typeId = this.psgTypeId
                                return item
                            })
                        }
                        // 计算价格
                        console.log(linkerData)
                        this.linkerData = linkerData
                        this.selectedPassenger = linkerData.filter(v => v.isSelected === true)
                    } else if (result.code === '50007') {
                        this.$alert({
                            txt: this.$t('获取数据失败，请重新选择班次！'),
                            okFn: () => {
                                this.$router.replace({
                                    name: 'login',
                                    query: {
                                        goTo: 'book',
                                        scheduleDetailId: this.$route.query.scheduleDetailId
                                    }
                                })
                            }
                        })
                    }
                    console.log(result)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        getIcon() {
            this.fetch({
                url: api.getCarModelInfo,
                method: 'POST',
                data: {
                    scheduleDetailId: this.scheduleDetailId || this.$route.query.scheduleDetailId
                }
            })
                .then((result) => {
                    if (result.code === '200' && !isEmpty(result.data)) {
                        this.facility = JSON.parse(result.data[0].facility)
                        // this.facility = [1, 2, 4, 5, 5, 5]
                        // console.log(result)
                    }
                })
        },
        ajaxticketType(ajpsger) {
            let fetchTypeListA
            // let fetchTypeListB
            // let promiseArr = []
            if (this.dptscheduleDID) {
                fetchTypeListA = this.fetch({
                    url: api.ticketTypelist,
                    method: 'POST',
                    data: {
                        scheduleDetailId: this.dptscheduleDID
                    }
                }, {
                    name: 'book',
                    query: { ...this.$route.query }
                })
                // promiseArr.push(fetchTypeListA)
            }
            // if (this.rtnScheduleDiD) {
            //     fetchTypeListB = this.fetch({
            //         url: api.ticketTypelist,
            //         method: 'POST',
            //         data: {
            //             scheduleDetailId: this.rtnScheduleDiD
            //         }
            //     })
            //     promiseArr.push(fetchTypeListB)
            // }

            Promise.all([fetchTypeListA, ajpsger])
                .then((result) => {
                    let [ dptArr, resPsger ] = result
                    if (dptArr.code === '200' && !isEmpty(dptArr.data)) {
                        let DownList = dptArr.data.map(item => {
                            item.value = item.name
                            return item
                        })
                        console.log(DownList)
                        // this.psgTypeArr = [{
                        //     ...this.DownList[0]
                        // }]
                        this.psgType = DownList[0]['name']
                        this.psgTypeId = DownList[0]['id']
                        this.setData({
                            DownList: DownList
                        })
                    }
                    if (resPsger.code === '200' && !isEmpty(resPsger.data)) {
                        resPsger = resPsger.data
                        let linkerData = (resPsger.list).map((item, val) => {
                            item.isSelected = false
                            item.typeName = this.psgType
                            item.typeId = this.psgTypeId
                            return item
                        })
                        console.log(linkerData)
                        this.linkerData = linkerData
                    } else if (resPsger.code === '50007') {
                        this.$alert({
                            txt: this.$t('获取数据失败，请重新选择班次！'),
                            okFn: () => {
                                this.$router.replace({
                                    name: 'login',
                                    query: {
                                        goTo: 'book',
                                        scheduleDetailId: this.$route.query.scheduleDetailId
                                    }
                                })
                            }
                        })
                    }
                })
        },
        ajaxcalculateOrderPrice(tmpArr) {
            this.$loading()
            this.fetch({
                url: api.calculateOrderPrice,
                method: 'POST',
                data: {
                    schedulePassengerPriceList: tmpArr
                }
            })
                .then(result => {
                    this.$hloading()
                    if (result.code === '200' && result.data && !isEmpty(result.data.schedulePassengerPriceList)) {
                        let PriceList = result.data.schedulePassengerPriceList
                        let DRPirceList = [{
                            showTitle: '出发',
                            priceList: []
                        }, {
                            showTitle: '返回',
                            priceList: []
                        }]
                        this.totalPrice = 0
                        PriceList.forEach(vals => {
                            this.totalPrice = accAdd(this.totalPrice, vals.ticketFinalPrice)
                            if (vals.scheduleDetailId === this.dptscheduleDID) {
                                this.DownList.forEach(valD => {
                                    if (valD.id === vals.ticketTypeId) {
                                        vals.showName = valD.name
                                    }
                                })
                                DRPirceList[0]['priceList'].push(vals)
                            } else if (vals.scheduleDetailId === this.rtnScheduleDiD) {
                                this.DownList.forEach(valD => {
                                    if (valD.id === vals.ticketTypeId) {
                                        vals.showName = valD.name
                                    }
                                })
                                DRPirceList[1]['priceList'].push(vals)
                            }
                        })

                        // if (!isEmpty(this.selectCoupon) && this.selectCoupon.discount) {
                        //     if (this.selectCoupon.couponType === 1) {
                        //         this.totalPrice = accSub(this.totalPrice, this.selectCoupon.discount)
                        //     } else if (this.selectCoupon.couponType === 2) {
                        //         this.totalPrice = Math.round((this.totalPrice * (100 - this.selectCoupon.discount))) / 100
                        //     }
                        // }
                        this.totalPrice = this.totalPrice <= 0 ? 0 : this.totalPrice
                        this.beforeMinusPrice = this.totalPrice
                        this.getCouponList()
                        // this.priceList = PriceList
                        let showNameArray = []
                        let ticketFinalPriceArray = []
                        let numberLitery = {}
                        DRPirceList.forEach((itemD, indexD) => {
                            itemD.priceList.forEach((iitem, iindex) => {
                                if (showNameArray.indexOf(iitem.showName) >= 0 && ticketFinalPriceArray.indexOf(iitem.ticketFinalPrice) >= 0 && showNameArray.indexOf(iitem.showName) === ticketFinalPriceArray.indexOf(iitem.ticketFinalPrice)) {
                                    iitem.isShowItem = 'noShow'
                                    numberLitery[iitem.showName] += 1
                                } else {
                                    iitem.isShowItem = ''
                                    numberLitery[iitem.showName] = 1
                                    // push
                                    showNameArray.push(iitem.showName)
                                    ticketFinalPriceArray.push(iitem.ticketFinalPrice)
                                }
                            })
                        })
                        this.DRPirceList = DRPirceList
                        this.numberLitery = numberLitery
                        console.log(DRPirceList)
                        console.log(numberLitery)
                    }
                })
        },
        showPriceList() {
            this.showDetail = !this.showDetail
            this.arrName = this.showDetail ? 'arrow-down' : 'arrow-up'
        },
        closeSlider() {
            this.showDetail = false
            this.arrName = 'arrow-up'
        },
        closeSliderB(item) {
            this.showAdd = !this.showAdd
        },
        addPsger() {
            this.$router.push({
                name: 'addPsger',
                query: {
                    type: 2,
                    scheduleDetailId: this.$route.query.scheduleDetailId
                }
            })
        },
        addPassenger(num) {
            if (this.linkerData.length === 0) {
                this.$router.push({
                    name: 'addPsger',
                    query: {
                        type: 2,
                        scheduleDetailId: this.$route.query.scheduleDetailId
                    }
                })
                return
            }
            this.showAdd = true
            this.showBTN = false
        },
        selectPassenger(item, isDeal) {
            this.limitNum = false
            if (this.showAdd) {
                this.showAdd = false
            }
            this.deleteId = ''
            // this.$emit('selectPass', item, isDeal)
            if (!item) return
            // 组件中直接处理好的直接赋值
            if (isDeal) {
                this.selectedPassenger = item
                this.linkerData = (this.linkerData).map(item => {
                    item.isSelected = Boolean(this.selectedPassenger.find(items => items.id === item.id))
                    return item
                })
                return
            }
            // compare selected passenger length or max number is one
            if (this.selectedPassenger.length === 0 || this.maxDueNumber === 1) {
                if (this.selectedPassenger.length !== 0 && this.selectedPassenger[0].id === item.id) {
                    this.selectedPassenger = []
                } else {
                    this.selectedPassenger = []
                    this.selectedPassenger.push(item)
                }
            } else {
                // 注意，这里会重新构建已选的常旅
                // 如果是直接选的进行处理过滤已经存在的，存在的不会添加到新的list中
                let isHasd = false
                this.selectedPassenger = this.selectedPassenger.reduceRight((pre, cur, index) => {
                    if (item.id === cur.id) {
                        isHasd = true
                    } else {
                        cur.isSelected = true
                        pre.push(cur)
                    }
                    if (index === 0 && !isHasd) {
                        if (this.maxDueNumber >= pre.length + 1) {
                            pre.push(item)
                        } else {
                            this.limitNum = this.$t('抱歉，本车次最大预订人数为') + ` ${this.maxDueNumber} ` + this.$t('名乘客')
                        }
                    }
                    return pre
                }, [])
            }

            this.linkerData = (this.linkerData).map(item => {
                item.isSelected = Boolean(this.selectedPassenger.find(items => items.id === item.id))
                return item
            })
        },
        showDelete(item) {
            this.deleteId = this.deleteId === item.id ? '' : item.id
        },
        selDown(item, index, indexs) {
            // console.log(item, index, indexs) // 乘客index 乘客类型index
            // this.$set(this.psgTypeArr, index, this.DownList[indexs])
            let psgerItem = this.selectedPassenger[index]
            psgerItem.typeName = this.DownList[indexs]['name']
            psgerItem.typeId = this.DownList[indexs]['id']
            this.$set(this.selectedPassenger, index, psgerItem)
            console.log(this.selectedPassenger)
            // console.log(this.psgTypeArr)
            // this.psgType = item.value
            // 获取价格参数修改
            // if (!isEmpty(this.schedulePassengerPriceList)) {
            //     // 只有出发
            //     if (this.dptscheduleDID && !this.rtnScheduleDiD) {
            //         this.schedulePassengerPriceList[index]['ticketTypeId'] = this.DownList[indexs]['id']
            //         // this.selectedPassenger[index].showName = this.DownList[indexs]['name']
            //     } else if (this.dptscheduleDID && this.rtnScheduleDiD) {
            //         let tmpArr = []
            //         this.selectedPassenger.forEach((itemss, indexss) => {
            //             if (this.dptscheduleDID && indexss === index) {
            //                 tmpArr.push({
            //                     ticketTypeId: this.DownList[indexs]['id'],
            //                     cerificateNumber: itemss.certificateNo,
            //                     scheduleDetailId: this.dptscheduleDID
            //                 })
            //             }
            //             if (this.rtnScheduleDiD && indexss === index) {
            //                 tmpArr.push({
            //                     ticketTypeId: this.DownList[indexs]['id'],
            //                     cerificateNumber: itemss.certificateNo,
            //                     scheduleDetailId: this.rtnScheduleDiD
            //                 })
            //             }
            //             // this.selectedPassenger[index].showName = this.DownList[indexs]['name']
            //         })
            //         this.schedulePassengerPriceList = tmpArr
            //     }
            //     if (!isEmpty(this.schedulePassengerPriceList)) {
            //         // 根据乘客参数 去计算价格
            //         this.ajaxcalculateOrderPrice(this.schedulePassengerPriceList)
            //     }
            //     // console.log(this.schedulePassengerPriceList)
            // }
        },
        payBtn() {
            // ss
            // this.$router.push({
            //     name: 'payment',
            //     query: {
            //         orderNo: 'ReK0YY6iuXnL9tbHF3B8',
            //         scheduleDetailId: 4596
            //     }
            // })
            // return false
            // ee
            if (this.totalPrice === 0) {
                return
            }
            if (this.curPassengerCount === 0) {
                this.$alert({
                    txt: this.$t('请选择乘客')
                })
                return
            }
            if (!this.contactPhone) {
                this.$alert({
                    txt: this.$t('请输入号码')
                })
                return
            }
            let passengerList = []
            this.selectedPassenger.forEach((liitem, liindex) => {
                passengerList.push({
                    ticketTypeId: liitem.typeId, // || this.psgTypeArr[liindex]['id'], // this.psgTypeId,
                    certificateNo: liitem.certificateNo,
                    passengerName: liitem.passengerName,
                    phone: liitem.phone,
                    passengerType: liitem.passengerType,
                    passengerTypeId: liitem.passengerTypeId || ''
                })
            })
            // console.log('pay+++:' + JSON.stringify(passengerList))

            let seatListA = []
            let seatListB = []
            if (!isEmpty(this.TmpseatSelected)) {
                this.TmpseatSelected.forEach(seatA => {
                    seatListA.push({
                        seatId: seatA.id,
                        carShippingId: seatA.carShippingId
                    })
                })
            }
            if (!isEmpty(this.TmpseatSelectedB)) {
                this.TmpseatSelectedB.forEach(seatB => {
                    seatListB.push({
                        seatId: seatB.id,
                        carShippingId: seatB.carShippingId
                    })
                })
            }

            console.log(seatListA)
            let scheduleList = [
                {
                    originScheduleDetailId: this.dptscheduleDID,
                    tripType: 0,
                    seatList: [...seatListA]
                },
                {
                    originScheduleDetailId: this.rtnScheduleDiD,
                    tripType: 1,
                    seatList: [...seatListB]
                }
            ]
            console.log('pay+++:' + JSON.stringify(scheduleList))
            let discount = 0
            if (this.selectCoupon.couponType === 1) {
                discount = this.selectCoupon.exemptionFee
            } else if (this.selectCoupon.couponType === 2) {
                discount = this.discount2
            }
            let couponMsg = (!isEmpty(this.selectCoupon)) ? {
                couponId: this.selectCoupon.couponId,
                id: this.selectCoupon.id,
                discountPrice: discount,
                lineId: this.departInfo.id,
                type: 1,
                vcode: this.selectCoupon.vcode
            } : {}
            let preferentialList = []
            if (!isEmpty(this.selectCoupon)) {
                preferentialList.push(couponMsg)
            }

            let params = {
                payAmount: this.totalPrice,
                orderType: this.isHasReturn ? 1 : 0,
                contactPhone: '(' + this.phoneAreaCode + ')' + this.contactPhone,
                passengerList: passengerList,
                scheduleList: this.isHasReturn ? scheduleList : [scheduleList[0]],
                preferentialAmount: discount,
                preferentialList: preferentialList
            }
            console.log(params)
            this.$loading({ txt: this.$t('正在生产订单...') })
            this.fetch({
                url: api.createOrder,
                method: 'POST',
                data: {
                    ...params
                }
            })
                .then(result => {
                    this.$hloading()
                    if (result.code === '200' && result.data) {
                        this.$router.push({
                            name: 'payment',
                            query: {
                                orderNo: result.data,
                                scheduleDetailId: this.scheduleDetailId
                            }
                        })
                    } else {
                        this.$alert({
                            txt: result.msg || this.$t('创单失败,请重试！')
                        })
                    }
                    console.log(result)
                })
        },
        write() {
            this.keyBorading = false // 暂时不隐藏了
        },
        writeDone() {
            // 解决ios返回到填写页空白问题
            let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            if (isIos) {
                let $body = document.querySelector('body')
                let st = $body.scrollTop

                let move = st + 1
                setTimeout(function() {
                    $body.scrollTop = move
                    window.scrollTo(0, move)
                }, 100)
            }
            this.keyBorading = false
        },
        getCouponList() {
            let memberId = getStore('memberId') || ''
            // 重置券 不然不会在watch里面监听变化 修改价格
            this.discount2 = 0
            this.selectCoupon = {}
            this.setData({
                checkedCoupon: '',
                couponList: {}
            })
            // 重置券
            this.fetch({
                url: api.couponPageList,
                method: 'POST',
                data: {
                    lineId: this.departInfo.lineId, // this.departInfo.id,
                    price: this.totalPrice, // departInfo.price,
                    userId: memberId,
                    page: 1,
                    pageSize: 1000
                }
            }).then((result) => {
                // result = {"code":"200","msg":"操作成功！","data":{"list":[{"id":83,"createUserId":300,"createTime":"2019-10-18 13:57:02","updateUserId":300,"updateTime":"2019-10-18 13:57:52","status":1,"vcode":"TC003","couponBatch":"83","couponName":"折扣券","couponType":2,"exemptionFee":0.00,"exemptionCondition":0.00,"discount":30,"discountCondition":100.00,"couponDesc":"满一百可用","effectWay":1,"effectStartDate":"2019-10-18 00:00:00","effectEndDate":"2019-10-18 23:59:59","afterDay":0,"effectDay":0,"lineId":0,"inventory":10,"enableStatus":1}]},"success":true}
                if (result.success) {
                    let couponList = result.data.list
                    // this.selectCoupon = isEmpty(couponList) ? [] : couponList[0]
                    if (!isEmpty(couponList)) {
                        let checkedCoupon = ''
                        for (let i = 0; i < couponList.length; i++) {
                            if (couponList[i].canUse === 1) {
                                this.selectCoupon = couponList[i]
                                checkedCoupon = i
                                this.iscanUse = true
                                break
                            } else {
                                this.iscanUse = false
                            }
                        }
                        this.setData({
                            checkedCoupon: checkedCoupon,
                            couponList: couponList
                        })
                    }
                    // this.dealCouponPrice()
                } else {
                    this.$alert({ txt: this.$t('获取数据失败') })
                }
                this.loading = false
            })
        },
        // dealCouponPrice() {
        //     if (!isEmpty(this.selectCoupon)) {
        //         if (this.selectCoupon.couponType === 1) {
        //             this.totalPrice = accSub(this.totalPrice, this.selectCoupon.exemptionFee)
        //         } else if (this.selectCoupon.couponType === 2) {
        //             this.discount2 = Math.round((this.totalPrice * this.selectCoupon.discount)) / 100
        //             this.totalPrice = Math.round((this.totalPrice * (100 - this.selectCoupon.discount))) / 100
        //         }
        //     }
        //     this.totalPrice = this.totalPrice <= 0 ? 0 : this.totalPrice
        // },
        openCoupon() {
            if (!this.couponList || isEmpty(this.couponList) || this.couponList.length === 0 || this.selectedPassenger.length === 0) {
                return
            }
            this.$router.push({
                name: 'couponListt',
                query: {
                    selectPage: 1
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.book-box{
    background: #f1f4f9;
    padding-bottom: 400px;
    width: 100%;
    overflow-x: hidden;
    .red-c{
        color: #ff6f61;
    }
    .t-c{
        text-align: center;
    }
    .grey{
        background: #c0c5d1
    }
    .red{
        background: #ff6f61
    }
    .ticket-info{
        background: #34354b;
        color:#fff;
        padding:20px 27px;
        .main-info{
            padding: 20px 0;
        }
        .back-info{
            border-top:1px dashed #eee;
        }
        .ticket-type{
            width: 100%;
            height: 48px;
            line-height: 48px;
            font-size:28px;
            .left-type{
                font-size:28px;
            }
            .right-seat{
                text-align: right;
                font-size:32px;
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
                    font-size:40px;
                    font-weight: bold;
                    text-align: left;
                    text-indent:10px;
                }
                .dpt-time,.dpt-arrive{
                    height: 48px;
                    line-height:48px;
                    font-size:30px;
                    text-align: left;
                    text-indent:10px;
                }
            }
            .right-bg {
                .dpt-long{
                    height: 60px;
                    line-height:60px;
                    font-size:30px;
                }
                .dpt-stations{
                    line-height:48px;
                    height: 48px;
                    font-size:30px;
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
                    font-size:30px;
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
    }
    .lessFour{
        justify-content: center!important;
        display: flex!important;
         padding:30px 27px;
        div{
            flex:1
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
    .psger-box{
        margin-top: 24px;
        padding:0 27px 24px;
        background:#fff;
        .number{
            width: 100%;
            height: 72px;
            line-height: 72px;
            font-size: 28px;
            font-weight: bold;
            color: #333;
            .psger-num{
                text-align: right;
                .red-c{
                    color: #ff6f61;
                }
                span{
                    margin-right:10px;
                }
            }
            .person{
                display: inline-block;
                width:26px;
                height:28px;
                margin-right:10px;
                position: relative;
                top:4px;
                color:#6b7694;
            }
        }
        .empty-add{
            width: 100%;
            height: 96px;
            line-height: 96px;
            text-align: center;
            color:#6b7694;
            .adds{
                width: 30px;
                height: 30px;
                position: relative;
                top: 4px;
                margin-right:10px;
            }
        }
        .psg-item{
            width: 100%;
            height: 96px;
            line-height: 96px;
        }
    }
    .phone-box{
        overflow: hidden;
        margin-top: 24px;
        width: 100%;
        height: 96px;
        background:#fff;
        padding:0 28px;
        position: relative;
        .right-txt{
            text-align: right;
            color: #f27460;
            font-weight: bold;
        }
        .b-g-t{
            font-weight: bold;
        }
        i{
            line-height: 96px;
            font-weight: bold;
        }
        .phone-icon{
            // display: inline-block;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            top:50%;
            transform: translateY(-50%)
        }
        p{
            height: 96px;
            line-height: 96px;
            padding: 0 16px;
        }
        .md-field{
            padding:0 0 0 40px;
        }
        .md-field-item-title{
           font-size:28px;
           color: #333;
           font-weight: bold;
           font-family: '方正兰亭黑简体 Bold', '方正兰亭黑简体';
        }
    }
    .price-box{
        width: 696px;
        height: 96px;
        border-radius: 48px;
        border: 1px solid #e4e4e4;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体 Bold', '方正兰亭黑简体';
        color: #fff;
        text-align: left;
        margin: 0 auto;
        position: fixed;
        bottom: 24px;
        left:50%;
        transform: translateX(-50%);
        line-height: 96px;
        z-index: 1022;
        font-size: 34px;
        overflow: hidden;
        .total-price{
            background: #fff;
            color: #ff6f61;
        }
        .sub-btn{
            font-weight: 600;
        }
    }
    .price-list {
        padding-bottom: 135px;

        line-height: 70px;
        // ul {
        //     padding-top: 20px;
        // }
        li {
            & > p {
                width: 50%;
            }
        }
    }
    .giving-txt {
        color: #7585c0;
        .giving-tit {
            width: 80px;
        }
        .giving-price {
            width: 50%;
        }
    }
    .discout-txt {
        line-height: 1;
        padding: 20px 0 0;
    }
    .nocan {
        color: #fff;
        background: #ccc;
    }
    .btn {
        width: 334px;
        height: 90px;
        border-radius: 45px;
        line-height: 90px;
        // margin-top: 20px;
        // margin-right: 30px;
    }
}
.passenger-list {
    // padding-right: 54px;
    overflow: hidden;
    position: relative;
    .passenger-tit {
        width: 140px;
    }
    .chart-btn {
        color: #7585c0;
    }
    .passenger-arrow {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 30px;
        right: -6px;
    }
    .shadow {
        position: absolute;
        width: 2px;
        right: 20px;
        top: -30px;
        bottom: -30px;
        box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
    }
    ul {
        overflow: auto;
        margin: auto;
        white-space: nowrap;
        height: 100%;
        min-width: 100%;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    li {
        flex: 0 0 142px;
        border: 2px solid #ddd;
        height: 60px;
        line-height: 1;
        padding: 14px 2px 0;
        border-radius: 10px;
        margin: auto 20px auto 0;
        overflow: hidden;
        position: relative;
        &.selected {
            color: #000;
            border: 2px solid rgba(52, 53, 75, 0.65);
            background: rgba(176, 176, 176, 0.65);
            &::after,
            &::before {
                content: '';
                position: absolute;
            }
            &::before {
                height: 56px;
                width: 56px;
                border-radius: 50%;
                right: -32px;
                top: -32px;
                background: rgba(52, 53, 75, 0.65);
            }
            &::after {
                height: 6px;
                width: 12px;
                border-left: 2px solid #fff;
                border-bottom: 2px solid #fff;
                transform: rotate(-45deg);
                right: 2px;
                top: 2px;
            }
        }
    }
    &.chart-item {
        padding-right: 0;
        .passenger-tit {
            margin-right: 100px;
        }
    }
}

.add-item {
    position: relative;

    &.add-person-icon {
        &::before {
            content: '\e921';
            height: 44px;
            width: 44px;
            line-height: 44px;
            font-size: 34px;
            background-size: 100%;
            position: absolute;
            color: #0dd66c;
            font-family: 'iconfont';
            left: 0;
            top: 40px;
        }
    }
}

.passenger-choosed {
    dt {
        width: 140px;
    }
    .delete {
        background: #fb5454;
        color: #fff;
        width: 0;
        transition: width ease-in 0.1s;
        &.show-delete {
            width: 92px;
        }
    }
}
.delete-icon {
    width: 44px;
    margin-right: 26px;
    position: relative;
    transition: all ease-in 0.1s;
    &::before {
        content: '\e913';
        height: 38px;
        width: 38px;
        line-height: 38px;
        display: inline-block;
        font-family: 'iconfont';
        color: #4c4a4a;
        font-size: 36px;
        position: absolute;
        font-weight: 500;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        box-sizing: border-box;
        font-weight: 600;
    }
    &.show-delete-icon {
        transform: rotate(90deg);
    }
}
.slide-enter,
.slide-leave-to{
    transform: translate3d(100%, 0 , 0);
}
.slide-enter-active,
.slide-leave-active{
    transition: all 0.3s ease;
}
.full-page{
    z-index: 9999
}
.md-scroll-view{
    display: flex;
    align-items: center;
    .scroll-view-list{
        display: flex;
        width: 1000px;
        .scroll-view-item{
            flex: 1;
            text-align: center;
            font-size: 28px;
            font-family: DINAlternate-Bold;
            border-right: .5px solid #efefef;
        }
    }
}
.book-line{
    height: 96px;
    line-height: 96px;
}
.down-wrap{
    width: 240px;
}
/deep/.md-scroll-view .scroll-view-container{
    display: flex!important;
}
/deep/.md-scroll-view{
    width: 96%;
}
.red-font{
    color: #ff6f61;
}
</style>
<style lang="less" scoped>
@font-face{font-family:iconfont;src:url(/seatmsweb/dist/63a49b263722a0843a02c9706d8af79f.eot);src:url(/seatmsweb/dist/63a49b263722a0843a02c9706d8af79f.eot#iefix) format("embedded-opentype"),url("data:application/x-font-woff;charset=utf-8;base64,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") format("woff"),url(/seatmsweb/dist/9f20c99860481188dc090f3f9adc95ee.ttf) format("truetype"),url(/seatmsweb/dist/1c9075d2a4bf8869de31706ff575eba2.svg#iconfont) format("svg")}.iconfont{font-family:iconfont!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-cesuo:before{content:"\E69E"}.icon-wifiwofi:before{content:"\E707"}.icon-lingshi:before{content:"\E63E"}.icon-tangyi:before{content:"\E614"}.icon-cesuo1:before{content:"\E7E0"}.icon-usb:before{content:"\E7CB"}.icon-kongtiao:before{content:"\E694"}
.iconfont {
    font-family: iconfont!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.icon-wifi::before{
    content: "\E707";
}
.icon-Toilet::before {
    content: "\E69E";
}
.icon-Lie-flat-Seat-or-Bed::before {
    content: "\E614";
}
.icon-Air-Conditioning::before {
    content: "\E694";
}
.icon-USB::before {
    content: "\E7CB";
}
.icon-snacks::before {
    content: "\E63E";
}
.block-icon{
    font-size: 36px;
    display: block;
    text-align: center;
}
.gold{
    color: #ff9900;
    font-style: italic;
}
.redcolor{
    color: #ff6f61;
}
</style>
