<template>
    <div class="payment-wrap">
        <div class="ticket-msg">
            <div class="bar-banner fbox border-bottom" @click="showDown(1)">
                <div class="flex1 b-title">{{$t('行程')}}</div>
                <div class="flex1 sub-title">
                    <template v-if="isHasReturn">
                        {{$t('出发')}}/{{$t('返回')}}
                    </template>
                    <md-icon
                        :name="arroneName"
                        size="md"
                    ></md-icon>
                </div>
            </div>
            <div class="down-slider" v-show='showOne'>
                <div class="ticket-info">
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
                                <div class="dpt-arrive">{{departInfo.expectedArriveTime}}<span>{{departInfo.minutes|filDD}}</span></div>
                            </div>
                            <div class="right-bg flex1">
                                <div class="dpt-long">{{departInfo.minutes|filTime}}</div>
                                <div class="dpt-stations">{{departInfo.departureStation}}</div>
                                <div class="dpt-endstations">{{departInfo.arriveStation}}</div>
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
                                <div class="dpt-arrive">{{returnInfo.expectedArriveTime}}<span>{{departInfo.minutes|filDD}}</span></div>
                            </div>
                            <div class="right-bg flex1">
                                <div class="dpt-long">{{returnInfo.minutes|filTime}}</div>
                                <div class="dpt-stations">{{returnInfo.departureStation}}</div>
                                <div class="dpt-endstations">{{returnInfo.arriveStation}}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="bar-banner fbox border-bottom" @click="showDown(2)">
                <div class="flex1 b-title">{{$t('乘客详情')}}</div>
                <div class="flex1 sub-title">
                    <md-icon
                        :name="arrtwoName"
                        size="md"
                    ></md-icon>
                </div>
            </div>
            <div class="down-slider" v-show='showTwo'>
                <div class="psger-box">
                    <div class="normal-ps-item fbox" v-for="(item,index) in psgerList" :key="index">
                        <div :key="index" class="left-title" v-if="item.indexs===1 && isHasReturn ">{{$t('出发')}}</div>
                        <div :key="index" class="left-title" v-else-if="item.indexs===2 && isHasReturn">{{$t('返回')}}</div>
                        <div class="flex1 bdd">{{item.passengerName}}</div>
                        <div class="psger-type bdd">{{item.ticketTypeName}}</div>
                    </div>
                    <!-- <div class="normal-ps-item fbox">
                        <div class="flex1">PasgerName</div>
                        <div class="psger-type">Adult</div>
                    </div> -->
                </div>
                <div class="contact-box fbox border-bottom" v-if="phone">
                    <div class="flex1">{{$t('联系方式')}}</div>
                    <div class="flex1 phone-box">{{phone}}</div>
                </div>
            </div>
            <div class="bar-banner fbox border-bottom" @click="showDown(3)">
                <div class="flex1 b-title">{{$t('支付信息')}}</div>
                <div class="flex1 sub-title red">{{$t('总价')}} <span class="red">{{scheduleDetail.payAmount}}</span> THB
                    <md-icon
                        :name="arrthreeName"
                        size="md"
                    ></md-icon>
                </div>
            </div>
            <div class="down-slider" v-show='showThree'>
                <div class="psger-listbox">
                    <div clas="d-r-t">
                        <div class="fbox" v-for="(item,index) in priceList" :key="index">
                            <div :key="index" class="left-title" v-if="item.indexs===1 && isHasReturn ">{{$t('出发')}}</div>
                            <div :key="index" class="left-title" v-else-if="item.indexs===2 && isHasReturn">{{$t('返回')}}</div>
                            <div class="right-deslist flex1">
                                <div class="list-item fbox" >
                                    <div class="list-name flex1">{{item.ticketTypePrintName}}</div>
                                    <div class="list-price">{{item.ticketFinalPrice}}THB x 1</div>
                                </div>
                                <!-- <div class="list-item fbox" >
                                    <div class="list-name flex1">Adult</div>
                                    <div class="list-price">120THB x 1</div>
                                </div>
                                <div class="list-item fbox">
                                    <div class="list-name flex1">Adult</div>
                                    <div class="list-price">120THB x 1</div>
                                </div> -->
                            </div>
                        </div>
                        <!-- <div class="price-box fbox border-bottom">
                            <div class="flex1">Discount:</div>
                            <div class="flex1 price-total">35THB</div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="ticket-payment-old-customer" v-if="!isNewCustomer">
            <div class="detailLabel"> Choose A Payment Option: </div>
            <div>
                <CardTable @selCard="onSelectCard" :list="cardList"></CardTable>
            </div>
            <div class="add-card" @click="onAddCard" v-show="!cardListLoading">
                <img class="img" src="./../../assets/img/payment/add.svg" alt="">
               {{$t('添加信用卡')}}
            </div>
            <div class="payAgree">
                <md-agree
                    v-model="agreeConf.checked"
                    @change="onChange(agreeConf.name, agreeConf.checked, $event)"
                    >
                    {{$t('我同意')}} <span style="color:#179AFF;text-decoration:underline;" @click="goTicketPolicy">{{$t('出票政策')}}</span>.
                </md-agree>
                <br>
                <md-button :type="agreeConf.payBtnType" @click="payNow" round>
                    <span>{{$t('支付')}}</span>
                </md-button>
            </div>
        </div>
        <div class="ticket-payment-new-customer" v-if="isNewCustomer">
            <div class="detailLabel">{{$t('信用卡支付')}}：</div>
            <div>
                <md-field :title="$t('帐户名')">
                    <md-input-item
                        type="text"
                        v-model="nameOnCard"
                        :placeholder="$t('帐户名')"
                        autocomplete="off"
                        @blur="writeDone"
                        is-highlight
                        clearable
                    >
                    </md-input-item>
                </md-field>
                <md-field :title="$t('卡号')">
                    <md-input-item
                        type="bankCard"
                        v-model="cardNo"
                        :placeholder="$t('16位')"
                        autocomplete="off"
                        is-highlight
                        clearable
                        is-virtual-keyboard
                        maxlength='16'
                        @blur="writeDone"
                    >
                    </md-input-item>
                </md-field>
                <md-field :title="$t('到期日期')">
                    <div class="fbox">
                        <div class="flex1 border-bottom data-box">
                            <DropDown @selDown="onSelectorMonthChoose" :placeholder="$t('月')" :selectedValue='selectorMonthValue' :list='monthData'></DropDown>
                        </div>
                        <div class="flex1 border-bottom data-box">
                            <DropDown @selDown="onSelectorYearChoose" :placeholder="$t('年')" :selectedValue='selectorYearValue' :list='yearData'></DropDown>
                        </div>
                    </div>
                </md-field>
                <md-field :title="$t('CVV')">
                    <md-input-item
                        type="password"
                        v-model="cvc"
                        :placeholder="$t('3位')"
                        autocomplete="off"
                        is-highlight
                        clearable
                        @blur="writeDone"
                        maxlength='3'
                    >
                    </md-input-item>
                </md-field>
            </div>
            <div class="payAgree">
                <md-agree
                    v-model="agreeConf.checked"
                    @change="onChange(agreeConf.name, agreeConf.checked, $event)"
                    >
                   {{$t('我同意')}} <span style="color:#179AFF;text-decoration:underline;" @click="goTicketPolicy">{{$t('出票政策')}}</span>.
                </md-agree>
                <br>
                <md-button :type="agreeConf.payBtnType" @click="payNow" round>
                    <span>{{$t('支付')}}</span>
                </md-button>
            </div>
        </div>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import { InputItem, Field, FieldItem, Agree, Button, Toast, Icon } from 'mand-mobile'
import { isEmpty, formatDate, getSession, getStore } from '@/libs/util'
import api from '../../config/api'
import DropDown from '../payment/component/dropDown'
import CardTable from '../payment/component/cardTable'
let Omise = window.Omise
export default {
    name: 'payment',
    components: {
        [InputItem.name]: InputItem,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Agree.name]: Agree,
        [Toast.name]: Toast,
        [Button.name]: Button,
        [Icon.name]: Icon,
        DropDown,
        CardTable
    },
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // console.log(from)
        // console.log(to)
        // 后退跳转详情页
        let query = from.query
        if (to.name === 'book') {
            this.$router.push({
                name: 'orderdetail',
                query
            })
        }
        next()
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                console.log(Omise)
                window.scrollTo(0, 0)
                Omise.setPublicKey('pkey_5e94iuanb7sd1fgsv92')
            })
        }, 200)
    },
    data() {
        return {
            orderNo: '', // 订单流水号
            isNewCustomer: false, // 是否是新客户
            currentCustomerId: '', // 当前customerId
            cardList: [], // 卡列表
            cardListLoading: true, // 卡列表加载中
            selectedCardId: '', // 选中的卡ID
            agreeConf: {
                checked: false,
                name: 'agree0',
                payBtnType: 'disabled',
                payLoading: false
            },
            monthData: [
                {
                    id: '1',
                    value: '1'
                },
                {
                    id: '2',
                    value: '2'
                },
                {
                    id: '3',
                    value: '3'
                },
                {
                    id: '4',
                    value: '4'
                },
                {
                    id: '5',
                    value: '5'
                },
                {
                    id: '6',
                    value: '6'
                },
                {
                    id: '7',
                    value: '7'
                },
                {
                    id: '8',
                    value: '8'
                },
                {
                    id: '9',
                    value: '9'
                },
                {
                    id: '10',
                    value: '10'
                },
                {
                    id: '11',
                    value: '11'
                },
                {
                    id: '12',
                    value: '12'
                }
            ],
            yearData: [
                {
                    id: '2019',
                    value: '2019'
                }
            ],
            nameOnCard: '',
            cardNo: '',
            cvc: '',
            selectorMonthValue: '',
            selectorYearValue: '',
            payReturnUrl: '', // 支付返回的链接
            scheduleDetailId: '',
            departInfo: {},
            returnInfo: {},
            isHasdepartInfo: true,
            isHasReturn: true,
            TmpseatSelected: [],
            TmpseatSelectedB: [],
            showOne: false,
            showTwo: false,
            showThree: false,
            arroneName: 'arrow-down',
            arrtwoName: 'arrow-down',
            arrthreeName: 'arrow-down',
            priceList: [],
            tripType: 0,
            psgerList: [],
            scheduleDetail: {},
            phone: ''
        }
    },
    created() {
        // 路由接收参数
        this.getRouterData()
        // 初始化yearData
        this.initYearData()
        // 查询customerId
        this.fetch({
            url: api.listCustomer,
            method: 'get',
            data: {}
        }).then(res => {
            if (res.code === '200') {
                // 如果有customerId, 进入卡列表页面
                if (res.data != null && res.data.length > 0) {
                    this.currentCustomerId = res.data[0].customerId
                    this.isNewCustomer = false
                    // 加载卡列表
                    this.loadCardList()
                } else {
                    // 如果没有customerId, 进入直接填写支付页面
                    this.isNewCustomer = true
                }
            } else {
                // Toast.failed(res.msg, 3500)
                this.$alert({
                    txt: res.msg
                })
            }
        })
        // 获取缓存参数
        // this.initParams()
        this.initDetail()
        this.phone = getStore('phone')
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
        filDD: function(value) {
            let day = parseInt(value / (60 * 24)) ? parseInt(value / (60 * 24)) + 'd' : ''
            return day ? `+${day}` : ''
        }
    },
    methods: {
        getRouterData() {
            console.log(this.$route.query)
            this.orderNo = this.$route.query.orderNo
        },
        initYearData() {
            let currentYear = new Date().getFullYear()
            let yearArr = []
            for (let i = 0; i < 50; i++) {
                let year = (currentYear + i).toString()
                yearArr.push({
                    id: year,
                    value: year
                })
            }
            this.yearData = yearArr
        },
        onSelectorMonthChoose(item) {
            this.selectorMonthValue = item.id
        },
        onSelectorYearChoose(item) {
            this.selectorYearValue = item.id
        },
        // 选中卡
        onSelectCard(cardId) {
            this.selectedCardId = cardId
        },
        onChange(name, checked) {
            console.log(`agree name = ${name} is ${checked ? 'checked' : 'unchecked'}`)
            if (checked) {
                this.agreeConf.payBtnType = 'warning'
            } else {
                this.agreeConf.payBtnType = 'disabled'
            }
        },
        // 跳转到TicketPolicy
        goTicketPolicy() {
            this.$router.push({
                name: 'detail',
                query: {
                    id: 1
                }
            })
        },
        // 支付
        payNow() {
            if (this.isNewCustomer) {
                this.payForNewCustomer()
            } else {
                this.payForOldCustomer()
            }
        },
        // 点击新增卡
        onAddCard() {
            // 如果达到6张, 不允许新增
            if (this.cardList.length >= 6) {
                this.$alert({
                    txt: 'You hava reached maximum card count'
                })
                return
            }
            this.$router.push({
                name: 'addCard'
            })
        },
        // 老客户的支付
        payForOldCustomer() {
            // 校验字段
            if (this.selectedCardId === '') {
                this.$alert({
                    txt: 'Please select credit card'
                })
                return
            }
            if (this.agreeConf.payLoading === false) {
                this.agreeConf.payLoading = true
                this.$loading({ txt: 'loading' })
                // 根据卡支付
                this.payByCard(this.selectedCardId)
            }
        },
        // 新customer的支付
        payForNewCustomer() {
            // 校验字段
            if (this.nameOnCard === '') {
                this.$alert({
                    txt: 'Please input Name On Card'
                })
                return
            }
            if (this.cardNo === '') {
                this.$alert({
                    txt: 'Please input Card Number'
                })
                return
            }
            if (this.selectorMonthValue === '' || this.selectorYearValue === '') {
                this.$alert({
                    txt: 'Please input Expiry Date'
                })
                return
            }
            if (this.cvc === '') {
                this.$alert({
                    txt: 'Please input CVC'
                })
                return
            }

            if (this.agreeConf.payLoading === false) {
                this.agreeConf.payLoading = true
                this.$loading({ txt: 'loading' })

                var card = {
                    'name': this.nameOnCard,
                    'number': this.cardNo,
                    'expiration_month': this.selectorMonthValue,
                    'expiration_year': this.selectorYearValue,
                    'security_code': this.cvc
                }
                let that = this

                Omise.createToken('card', card, function(statusCode, response) {
                    console.log(response)
                    if (statusCode === 200 && response.object === 'token') {
                        let tokenId = response.id
                        // 支付
                        that.payByToken(tokenId, card)
                    } else {
                        that.agreeConf.payLoading = false
                        that.$hloading()
                        that.$alert({
                            txt: response.message
                        })
                    }
                })
            }
        },
        // 根据card支付
        payByCard(cardId) {
            let params = {
                'payType': 2,
                'orderNo': this.orderNo,
                'cardId': cardId,
                'customerId': this.currentCustomerId
            }
            this.fetch({
                url: api.pay,
                method: 'post',
                data: params
            }).then(res => {
                this.agreeConf.payLoading = false
                this.$hloading()
                if (res.code === '200') {
                    console.log(res)
                    this.payReturnUrl = res.data
                    // 等待支付结果
                    this.waitPayResult()
                } else {
                    // Toast.failed(res.msg, 3500)
                    this.$alert({
                        txt: res.msg
                    })
                }
            })
        },
        // 根据token支付
        payByToken(tokenId, card) {
            let that = this
            let params = {
                'payType': 2,
                'orderNo': this.orderNo,
                'tokenId': tokenId
            }
            this.fetch({
                url: api.pay,
                method: 'post',
                data: params
            }).then(res => {
                this.agreeConf.payLoading = false
                this.$hloading()
                if (res.code === '200') {
                    console.log(res)
                    that.payReturnUrl = res.data
                    if (card) {
                        // 注册customer并绑卡
                        that.registerCustomerWithBindCard(card, this.waitPayResult)
                    } else {
                        that.waitPayResult()
                    }
                } else {
                    // Toast.failed(res.msg, 3500)
                    this.$alert({
                        txt: res.msg
                    })
                }
            })
        },
        // 等待支付结果
        waitPayResult() {
            console.log('pay success')
            location.href = this.payReturnUrl
            // window.open(this.payReturnUrl, '_blank')
        },
        // 注册customer并绑卡
        registerCustomerWithBindCard(card, callback) {
            // 获取token
            let that = this
            Omise.createToken('card', card, function(statusCode, response) {
                if (statusCode === 200 && response.object === 'token') {
                    let tokenId = response.id
                    // 注册customer(如果有tokenId,自动绑卡)
                    that.fetch({
                        url: api.registerCustomer,
                        method: 'POST',
                        data: {
                            orderNo: that.orderNo,
                            tokenId: tokenId
                        }
                    }).then(res => {
                        if (res.code === '200') {
                            that.currentCustomerId = res.data.customerId
                        } else {
                            that.$alert({
                                txt: res.msg
                            })
                        }
                    })

                    if (callback) {
                        callback()
                    }
                } else {
                    that.agreeConf.payLoading = false
                    that.$hloading()
                    that.$alert({
                        txt: response.message
                    })
                }
            })
        },
        // 加载卡列表
        loadCardList() {
            let that = this
            that.cardListLoading = true
            this.$loading({ txt: 'loading' })
            // 查询卡列表
            this.fetch({
                url: api.listCard,
                method: 'post',
                data: {}
            }).then(res => {
                that.$hloading()
                if (res.code === '200') {
                    that.cardList = res.data
                    that.cardListLoading = false
                } else {
                    // Toast.failed(res.msg, 3500)
                    this.$alert({
                        txt: res.msg
                    })
                }
            })
        },
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
        showDown(key) {
            if (key === 1) {
                this.showOne = !this.showOne
                this.arroneName = this.showOne ? 'arrow-up' : 'arrow-down'
            } else if (key === 2) {
                this.showTwo = !this.showTwo
                this.arrtwoName = this.showTwo ? 'arrow-up' : 'arrow-down'
            } else if (key === 3) {
                this.showThree = !this.showThree
                this.arrthreeName = this.showThree ? 'arrow-up' : 'arrow-down'
            }
        },
        initDetail() {
            this.fetch({
                url: api.getOrderScheduleDetail,
                method: 'POST',
                data: {
                    orderSn: this.$route.query.orderNo
                }
            }).then((result) => {
                if ((result.code === '200' || result.success) && !isEmpty(result.data)) {
                    this.scheduleDetail = result.data
                    // this.scheduleDetail = detail
                    this.isHasdepartInfo = !!this.scheduleDetail.scheduleList.length && this.scheduleDetail.scheduleList.length >= 1
                    this.isHasReturn = !!this.scheduleDetail.scheduleList.length && this.scheduleDetail.scheduleList.length === 2
                    this.departInfo = this.scheduleDetail.scheduleList[0]
                    this.returnInfo = this.scheduleDetail.scheduleList[1]
                    // console.log(this.scheduleDetail)
                    // console.log(this.isHasReturn)
                    // console.log(this.returnInfo)
                    this.initPrice()
                    this.showPsgerPop()
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
            }).then((result) => {
                if ((result.code === '200' || result.success) && !isEmpty(result.data) && !isEmpty(result.data.schedulePassengerPriceList)) {
                    console.log(result)
                    // this.priceList = result.data.schedulePassengerPriceList
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
        showPsgerPop(item) {
            this.$loading()
            this.fetch({
                url: api.getOrderPassengerTicketDetail,
                method: 'POST',
                data: {
                    orderSn: this.orderNo,
                    scheduleId: this.scheduleDetailId
                }
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
        writeDone() {
            // 解决ios返回到填写页空白问题
            let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            if (isIos) {
                let $body = document.querySelector('body')
                let st = $body.scrollTop

                let move = st + 1
                setTimeout(function() {
                    $body.scrollTop = move
                }, 100)
            }
            this.keyBorading = false
        }
    }
}
</script>
<style lang="less">
@import '~@/assets/styles/base.less';
    .md-field {
    // padding: 0.8rem 0.8rem 0rem 0.8rem;
    padding: 27px 27px 0px 27px;
    border: none;
    background-color: #fff;
    }
    .fbox{
        .data-box{
            margin-right: 40px;
            height: 120px;
            line-height: 120px;
        }
    }
    .md-button.warning:after{
        border: 0.06rem solid #ff6f61;
    }
    .md-button.warning{
        background: #ff6f61;
    }
    .md-agree-icon .md-agree-icon-container .md-icon.md-icon-check{
    color: #111a34
    }
    .md-agree-icon{
        color: #111a34
    }
    .md-agree-icon.checked .md-agree-icon-container .md-icon-checked{
        color: #111a34
    }
    .sub-title {
        .md-icon-arrow-down:before{
            color: rgba(52, 53, 75, 0.7);
        }
        .md-icon-arrow-up:before{
            color: rgba(52, 53, 75, 0.7);
        }
    }
    .md-field-title{
        font-size: 32px;
    }
</style>
<style lang="less" scoped>
    * { touch-action: pan-y; }
    .bar-banner{
        height: 96px;
        line-height: 96px;
        background: #fff;
        color: #333333;
        font-size: 32px;
        font-family: '方正兰亭黑简体 Bold', '方正兰亭黑简体';
        padding:0 27px;
        .b-title{
            font-weight: 700;
        }
        .sub-title{
            color: rgba(52, 53, 75, 0.7);
            text-align: right;
            .red{
                color: #ff6f61;
            }
        }
        .red{
             color: #ff6f61;
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

    .payment-wrap{
        height: 100%;
        .ticket-payment-old-customer{
            height: 100%;
            background-color: #F1F4F9;
            .detailLabel{
                color:#A4A3AD;
                padding: 27px 27px 6px 27px;
            }
            .add-card{
                text-align:center;
                width:100%;
                .img{
                    width:30px;
                    height:30px;
                    margin-right:15px;
                }
            }
            .payAgree{
                padding: 27px 27px 6px 27px;
            }
        }
        .ticket-payment-new-customer{
            height: 100%;
            background-color:white;
            .detailLabel{
                background-color: #F1F4F9;
                color:#A4A3AD;
                padding: 27px 27px 6px 27px;
            }
            .payAgree{
                padding: 27px 27px 6px 27px;
            }
        }

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
            font-size:24px;
            .left-type{
                font-size: 28px;
            }
            .right-seat{
                text-align: right;
                font-size: 28px;
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
                    font-size:28px;
                    // font-weight: 600;
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
        padding: 0 27px;
        background: #fff;
        .left-title{
            width: 160px;
        }
        .bdd{
            border-bottom: 1px dashed #c9c9c9;
        }
        .normal-ps-item{
            // margin-left:85px;
            height: 96px;
            line-height: 96px;
            font-size: 28px;
            color: #666;
        }
        .psger-type{
            // width: 100px;
            height: 96px;
            line-height: 96px;
            font-size: 28px;
            color: #666;
            text-align: right;
        }
    }
    .contact-box{
        background: #fff;
        width: 100%;
        height: 96px;
        line-height: 96px;
        font-size: 28px;
        color: #666;
        padding: 0 27px;
        .phone-box{
            text-align: right;
        }
    }
    .psger-listbox{
        background: #fff;
        padding: 0 27px;
        .left-title{
            width: 160px;
            line-height: 72px;
        }
        .right-deslist{
            .list-item{
                height: 72px;
                line-height: 72px;
                border-bottom: 1px dashed #c9c9c9;
                box-sizing: border-box;
                font-family: '方正兰亭黑简体';
                color: #333;
                .list-price{
                    font-weight: 700;
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
</style>
