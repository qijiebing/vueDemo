<template>
    <div class="chair-box full-page">
        <div class="title border-bottom">
            <template v-if="!isReturn">{{$t('请选择你的座位')}}</template>
            <template v-else>
                <template v-if="isDpt">
                    {{$t('选择出发票')}}
                </template>
                <template v-else>
                    {{$t('前往返程票')}}
                </template>
            </template>
        </div>
        <div class="chair-detail">
            <md-tabs v-if="layerNumber===2">
                <md-tab-pane class="content" name="p1" :label="$t('下层')">
                    <div class="chair-wrap">
                        <div class="chair-row fbox" v-for="(item,index) in layA" :key="index">
                            <div class="chair-item"
                            :class="{
                                'has-icon': citem.type!=0 && !!citem.iconUrl,
                                'dis-sel':(citem.sellSeatType===4||citem.sellSeatType===2||citem.sellSeatType===3 ||citem.sellSeatType===1 || citem.type===7 || citem.type===8 || citem.type===9),
                                'selected-chair':(citem.isSelected ||citem.sellSeatType===1),
                                'transparent':citem.type===0,
                                'noborder': citem.type=== 7 || citem.type=== 8 ||  citem.type=== 9,
                                'bgfont': !!citem.carShippingIconUrl && !citem.iconUrl,
                                'pointer': citem.carShippingIconUrl && !citem.iconUrl
                            }"
                            v-for="(citem,cindex) in item"
                            :style="{
                                background:citem.carShippingIconUrl && !citem.iconUrl ? 'url('+ citem.carShippingIconUrl+') center no-repeat': citem.type===7 ? backColor[7]: citem.type===8 ? backColor[8]: citem.type===9 ? backColor[9]: '',
                                }"
                            @click="selSeat(citem,index,cindex,layA,1)"
                            :key="citem.seatNo+cindex+index">
                                <p>{{citem.seatNo}}</p>
                                <!-- 普通 -->
                                <p v-if="citem.type===1 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 女 -->
                                <p v-else-if="citem.type===2 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 僧侣 -->
                                <p v-else-if="citem.type===3 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 残孕 -->
                                <p v-else-if="citem.type===4 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                            </div>
                        </div>
                    </div>
                </md-tab-pane>
                <md-tab-pane class="content" name="p2" :label="$t('上层')">
                     <div class="chair-wrap">
                        <div class="chair-row fbox" v-for="(item,index) in layB" :key="index">
                            <div class="chair-item"
                            :class="{
                                'has-icon': citem.type!=0 && !!citem.iconUrl,
                                'dis-sel':(citem.sellSeatType===4||citem.sellSeatType===2||citem.sellSeatType===3||citem.sellSeatType===1|| citem.type===7 || citem.type===8 || citem.type===9),
                                'selected-chair':(citem.isSelected ||citem.sellSeatType===1),
                                'transparent':citem.type===0,
                                'noborder': citem.type=== 7 || citem.type=== 8 ||  citem.type=== 9,
                                'bgfont': !!citem.carShippingIconUrl && !citem.iconUrl,
                                'pointer': citem.carShippingIconUrl && !citem.iconUrl
                             }"
                            v-for="(citem,cindex) in item"
                            :style="{
                                    background:citem.carShippingIconUrl && !citem.iconUrl ? 'url('+citem.carShippingIconUrl+') center no-repeat': citem.type===7 ? backColor[7]: citem.type===8 ? backColor[8]: citem.type===9 ? backColor[9]: '',
                                }"
                            @click="selSeat(citem,index,cindex,layB,2)"
                            :key="citem.seatNo+cindex+index">
                            <!-- {{index+1}}{{zm[cindex]}} -->
                                <p>{{citem.seatNo}}</p>
                                <!-- 普通 -->
                                <p v-if="citem.type===1 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 女 -->
                                <p v-else-if="citem.type===2 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 僧侣 -->
                                <p v-else-if="citem.type===3 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 残孕 -->
                                <p v-else-if="citem.type===4 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                            </div>
                        </div>
                    </div>
                </md-tab-pane>
            </md-tabs>
            <template v-else>
                <div class="chair-wrap">
                        <div class="chair-row fbox" v-for="(item,index) in layA" :key="index">
                            <div class="chair-item"
                            :class="{
                                'has-icon': citem.type!=0 && !!citem.iconUrl,
                                'dis-sel':(citem.sellSeatType===4||citem.sellSeatType===2||citem.sellSeatType===3||citem.sellSeatType===1|| citem.type===7 || citem.type===8 || citem.type===9),
                                'selected-chair':(citem.isSelected ||citem.sellSeatType===1),
                                'transparent':citem.type===0,
                                'noborder': citem.type=== 7 || citem.type=== 8 ||  citem.type=== 9,
                                'bgfont': !!citem.carShippingIconUrl && !citem.iconUrl,
                                'pointer': citem.carShippingIconUrl && !citem.iconUrl
                            }"
                            v-for="(citem,cindex) in item"
                            :style="{
                                    background:citem.carShippingIconUrl && !citem.iconUrl ? 'url('+citem.carShippingIconUrl+') center no-repeat': citem.type===7 ? backColor[7]: citem.type===8 ? backColor[8]: citem.type===9 ? backColor[9]: '',
                                }"
                            @click="selSeat(citem,index,cindex,layA,1)"
                            :key="citem.seatNo+cindex+index">
                                <p>{{citem.seatNo}}</p>
                                <!-- 普通 -->
                                <p v-if="citem.type===1 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 女 -->
                                <p v-else-if="citem.type===2 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 僧侣 -->
                                <p v-else-if="citem.type===3 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                                <!-- 残孕 -->
                                <p v-else-if="citem.type===4 && citem.iconUrl">
                                    <img :src="citem.iconUrl" alt="">
                                </p>
                            </div>
                        </div>
                    </div>
            </template>

            <div class="btn-wrap">
                <div class="btn-btn fbox" @click="selectChair()" :class="{'disabled-btn':seatSelectedTmp.length===0}">
                    <div class="seats flex1" v-if="seatSelectedTmp.length>0">
                        <template v-for="(item, index) in seatSelectedTmp">
                            <span :key="index">
                                {{index+1!=seatSelectedTmp.length ? item.keys+',':item.keys}}
                            </span>
                        </template>
                    </div>
                    <div class="seats flex1" v-else>-/-</div>
                    <div class="text-decoration flex1">
                        <template v-if="isDpt && isReturn">
                            Go to Retruning Trips
                        </template>
                        <template v-else>
                            Next
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Tabs, TabPane } from 'mand-mobile'
import api from '@/config/api'
import { isEmpty, getStore, setSession } from '@/libs/util'
export default {
    name: 'chairs',
    data() {
        return {
            backColor: {
                // 0-过道或门等不可用位置，1-普通座位，2-女士座位，3-僧侣座位，4-残、孕座位, 7-楼梯, 8-厕所, 9-安全出口
                '-1': 'white',
                '0': 'rgb(234,234,234)',
                '1': '#fff', // 'rgb(155,200,75)',./../../assets/img/tickettype/
                '2': 'url(' + require('./../../assets/img/tickettype/woman.png') + ') center top no-repeat',
                '3': 'url(' + require('./../../assets/img/tickettype/monk.png') + ') center top no-repeat',
                '4': 'url(' + require('./../../assets/img/tickettype/disability.png') + ') center top no-repeat',
                '7': 'url(' + require('./../../assets/img/tickettype/Stairs.png') + ') center no-repeat',
                '8': 'url(' + require('./../../assets/img/tickettype/toilet.png') + ') center no-repeat',
                '9': 'url(' + require('./../../assets/img/tickettype/Exit.png') + ') center no-repeat'
            },
            chairsArr: [],
            // 默认的层数
            layerNumber: 1,
            zm: ['A', 'B', 'C', 'D', 'E', 'F'],
            classes: ['has-icon', 'dis-sel', 'selected-chair'],
            layA: [],
            layB: [],
            // 座位类型背景颜色
            seatTypeToBGColor: {
                // 过道或门不可用位置
                0: 'transparent',
                // 普通座位
                1: '#e8eaec',
                // 女士
                2: '#FF33FF',
                // 僧侣
                3: '#FFCC00',
                // 残，孕
                4: '#33CCFF'
            },
            seatSelectedTmp: [] // 本地
        }
    },
    computed: {
        ...mapState(['isReturn', 'isDpt', 'query', 'seatAmount', 'seatSelectedB', 'seatSelected'])
    },
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane
    },
    created() {
        this.getSeats()
    },
    mounted() {
        // 重置座位数据
        if (this.isDpt) {
            this.setData({
                seatAmount: 0,
                // seatAmountB: 0,
                seatSelected: [], // 往
                seatSelectedB: [] // 反
            })
        }
        console.log(this.isReturn)
    },
    methods: {
        ...mapMutations({
            setData: 'setData'
        }),
        getSeats() {
            this.$loading()
            this.fetch({
                url: api.listSeat,
                method: 'POST',
                data: {
                    scheduleDetailId: this.$route.query.scheduleDetailId
                }
            })
                .then(result => {
                    this.$hloading()
                    // 自己已售 sellSeatType === 1,
                    // 他人已售 sellSeatType === 2,
                    // 电话预定 sellSeatType === 3,
                    if (result.code === '200' && !isEmpty(result.data)) {
                        result = result.data[0]
                        this.layerNumber = result.layerNumber
                        this.chairsArr = result.seatList
                        if (this.layerNumber === 2) {
                            this.layA = this.chairsArr.filter(item => item[0].layerIndex === 1)
                            this.layB = this.chairsArr.filter(item => item[0].layerIndex === 2)
                        } else {
                            this.layA = this.chairsArr
                        }
                    } else {
                        this.$toast({
                            txt: result.msg
                        })
                    }
                    console.log(result)
                })
                .catch(e => {
                    this.$toast({
                        txt: this.$t('获取数据失败')
                    })
                    this.$hloading()
                })
        },
        selSeat(citem, bi, sindex, arr, layerIndex) {
            // 未使用的 直接返回
            if (citem.status === 0) {
                return false
            }
            // 已售 直接返回
            if (citem.sellSeatType !== 0) {
                return false
            }
            if (citem.type === 7 || citem.type === 8 || citem.type === 9) {
                return
            }
            if (!citem.isSelected && this.seatAmount >= 6) {
                this.$alert({
                    txt: this.$t('最多选六个座位')
                })
                return
            }
            if (citem.hasOwnProperty('isSelected')) {
                citem.isSelected = !citem.isSelected
            } else {
                citem.isSelected = true
            }
            this.$set(arr[bi], sindex, citem)
            let keys = citem.seatNo// (bi + 1) + '' + this.zm[sindex] // layerIndex
            this.getSeatSelected(citem, keys, layerIndex)
            // console.log(citem, keys)
        },
        getSeatSelected(citem, keys, layerIndex) {
            // 从已有列表中筛选出重复的 取消勾选，keys是展示标识 修改展示的 也用这个
            let hasPushArrIndex = this.seatSelectedTmp.findIndex(v => v.keys === keys && layerIndex === v.layerIndex)
            console.log(hasPushArrIndex)

            if (hasPushArrIndex >= 0) {
                this.seatSelectedTmp.splice(hasPushArrIndex, 1)
            } else {
                this.seatSelectedTmp.push({
                    keys,
                    layerIndex,
                    ...citem
                })
            }
            if (this.isDpt) {
                this.setData({
                    seatSelected: this.seatSelectedTmp,
                    seatAmount: this.seatSelectedTmp.length
                })
                setSession(`seatSelected_${this.$route.query.scheduleDetailId}`, this.seatSelectedTmp)
            } else {
                this.setData({
                    seatSelectedB: this.seatSelectedTmp,
                    seatAmount: this.seatSelectedTmp.length
                })
                setSession(`seatSelectedB_${this.$route.query.scheduleDetailId}`, this.seatSelectedTmp)
            }
            console.log(this.seatSelectedTmp)
        },
        selectChair() {
            let query = this.query
            if (this.seatSelectedTmp.length === 0) return
            // 是有往返程
            if (this.isReturn) {
                // 是去程 点击跳转返程
                if (this.isDpt) {
                    this.setData({
                        isDpt: false
                    })
                    this.$router.replace({
                        path: '/list',
                        query: {
                            ...query,
                            listDate: query.returnDate,
                            startCity: query.endCity,
                            startCityId: query.endCityId,
                            endCity: query.startCity,
                            endCityId: query.startCityId,
                            isDpt: 0
                        }
                    })
                } else {
                    if (this.seatAmount !== this.seatSelected.length) {
                        this.$alert({
                            txt: this.$t('往返乘客人数需一致')
                        })
                        return
                    }
                    console.log('book')
                    // 已经是返程 跳填写订单
                    this.verfiyIsLogin(() => {
                        this.$router.replace({
                            name: 'book',
                            query: {
                                scheduleDetailId: this.$route.query.scheduleDetailId
                            }
                        })
                    })
                }
            } else {
                console.log('book')
                this.verfiyIsLogin(() => {
                    this.$router.replace({
                        name: 'book',
                        query: {
                            scheduleDetailId: this.$route.query.scheduleDetailId
                        }
                    })
                })
            }
        },
        verfiyIsLogin(fn) {
            let phoneNo = getStore('phoneNo') || ''
            console.log(phoneNo)
            if (!phoneNo) {
                this.$alert({
                    txt: this.$t('未登录，请登录'),
                    okFn: () => {
                        this.$router.push({
                            name: 'login',
                            query: {
                                goTo: 'book',
                                scheduleDetailId: this.$route.query.scheduleDetailId
                            }
                        })
                    }
                })
                return
            }
            this.fetch({
                url: api.queryByPhone,
                method: 'POST',
                data: {
                    phoneNo: phoneNo
                }
            }).then(result => {
                if (result.code === '200') {
                    // 回调跳转
                    fn()
                } else {
                    this.$alert({
                        txt: this.$t('未登录，请登录'),
                        okFn: () => {
                            this.$router.push({
                                name: 'login',
                                query: {
                                    goTo: 'book',
                                    scheduleDetailId: this.$route.query.scheduleDetailId
                                }
                            })
                        }
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.chair-box{
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // background-color: #fff;
    // overflow: hidden;
    // z-index: 1200;
    padding-bottom: 176px;
    .title{
        width: 100%;
        height: 72px;
        line-height: 72px;
        color: #34354b;
        text-align: center;
    }
}
/deep/.md-tab-bar-item.is-active{
    color: #ff6f61!important;
}
/deep/.md-tab-bar-ink{
    background-color: #ff6f61!important;
}

.chair-wrap{
    width: 696px;
    margin:0 auto;
    justify-content: center;
    padding-top:46px;
    .chair-row{
        width: 100%;
        height: 96px;
        margin:0 auto;
        margin-bottom: 24px;
        justify-content: center;
        .chair-item{
            width: 96px;
            height: 96px;
            line-height: 96px;
            border-radius: 12px;
            border: 2px solid #cccccc;
            background-color: #ffffff;
            color: #34354b;
            text-align: center;
            margin-right: 24px;
            box-shadow:0px 0px 2px #333333;
            font-size: 24px;
            color: #34354b;
            background-size: 100% 100%!important;
            p{
                width: 100%;
            }
            img{
                width: 48px;
                height: 48px;
            }
        }
        .has-icon{
            padding-top:10px;
            background: #ddd;
            p{
                height: 24px;
                line-height: 24px;
            }
        }
        .type-chair{
            // padding-top:10px;
        }
        .dis-sel{
            background-color: #f2f2f2;
            color: #ccc;
        }
        .selected-chair{
            // padding-top:10px;
            background: #ff6f61!important;
            color: #fff;
            font-weight: bold;
        }
        .transparent{
            background: transparent;
            visibility: hidden;
        }
        .noborder{
            border: none!important;
            box-shadow: none!important;
            background-size: 96% 96%!important;
        }
        .bgfont{
            p{
               line-height: 140px!important;
            }
        }
    }
}
.btn-wrap{
    // position: fixed;
    // bottom: 80px;
    width: 696px;
    height: 96px;
    // left: 50%;
    // transform: translateX(-50%)
    margin: 0 auto;
    margin-top: 20px;
}
.btn-btn{
    width: 696px;
    height: 96px;
    line-height: 96px;
    border-radius: 48px;
    border: 1px solid #e4e4e4;
    background-color: #ff6f61;
    box-sizing: border-box;
    font-family: '方正兰亭黑简体';
    color: #fff;
    text-align: center;
    text-align: right;
    .seats{
        min-width: 100px;
        // padding-right: 20px;
        // padding-left: 20px;
        border-right: 1px solid #fff;
        box-sizing: border-box;
        text-align: center;
    }
    .text-decoration{
        text-align: center;
    }
}
.disabled-btn{
    line-height: 96px;
    background-color: #c0c5d1!important;
}
.l-m{
    margin-left: 96px;
}
</style>
