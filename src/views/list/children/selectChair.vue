<template>
    <div class="chair-box">
        <div class="title border-bottom">
            <template v-if="!isReturn">Please select your seat(s)</template>
            <template v-else>
                <template v-if="isDpt">
                    Choose seats for departing trip
                </template>
                <template v-else>
                    Choose seats for arrive trip
                </template>
            </template>
        </div>
        <div class="chair-detail">
            <md-tabs v-if="layerNumber===2">
                <md-tab-pane class="content" name="p1" label="Upper Deck">
                    <div class="chair-wrap">
                        <div class="chair-row fbox" v-for="(item,index) in layA" :key="index">
                            <div class="chair-item"
                            :class="{'has-icon': citem.type!=0,'dis-sel':(citem.sellSeatType===1||citem.sellSeatType===2||citem.sellSeatType===3),'selected-chair':citem.isSelected}"
                            v-for="(citem,cindex) in item"
                            @click="selSeat(citem,index,cindex,layA)"
                            :key="citem.seatNo">
                                <p>{{index+1}}{{zm[cindex]}}</p>
                                <!-- 普通 -->
                                <!-- <p v-if="citem.type===1">
                                    <img src="../../../assets/img/list/u235.png" alt="">
                                </p> -->
                                <!-- 女 -->
                                <!-- <p v-else-if="citem.type===2">
                                    <img src="../../../assets/img/list/u235.png" alt="">
                                </p> -->
                                <!-- 僧侣 -->
                                <!-- <p v-else-if="citem.type===3">
                                    <img src="../../../assets/img/list/u235.png" alt="">
                                </p> -->
                                <!-- 残孕 -->
                                <!-- <p v-else-if="citem.type===4">
                                    <img src="../../../assets/img/list/u235.png" alt="">
                                </p> -->
                            </div>
                        </div>
                    </div>
                </md-tab-pane>
                <md-tab-pane class="content" name="p2" label="Lower Deck">
                     <div class="chair-wrap">
                        <div class="chair-row fbox" v-for="(item,index) in layB" :key="index">
                            <div class="chair-item" v-for="(citem,cindex) in item" :key="citem.seatNo">
                                <p>{{index+1}}{{zm[cindex]}}</p>
                                <p><img src="../../../assets/img/list/u235.png" alt=""></p>
                            </div>
                        </div>
                    </div>
                </md-tab-pane>
            </md-tabs>
            <template v-else>
                <div class="chair-wrap">
                    <div class="chair-row fbox" v-for="(item,index) in layA" :key="index">
                        <div class="chair-item" v-for="(citem,cindex) in item" :key="citem.seatNo"><p>{{index+1}}{{zm[cindex]}}</p><p><img src="../../../assets/img/list/u235.png" alt=""></p></div>
                    </div>
                </div>
            </template>

            <div class="btn-wrap">
                <div class="btn-btn fbox" @click="selectChair()" :class="{'disabled-btn':seatSelected.length===0}">
                    <div class="seats" v-if="seatSelected.length>0">
                        <template v-for="(item, index) in seatSelected">
                            <span :key="index">
                                {{item.keys}}
                            </span>
                        </template>
                    </div>
                    <div class="seats" v-else>-/-</div>
                    <div class="text-decoration flex1">
                        <template v-if="isDpt">
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
import { isEmpty } from '@/libs/util'
export default {
    name: 'chairs',
    data() {
        return {
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
            seatSelected: []
        }
    },
    computed: {
        ...mapState(['isReturn', 'isDpt', 'query'])
    },
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane
    },
    created() {
        this.getSeats()
    },
    mounted() {
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
                    result = {
                        code: '200',
                        data: [{
                            layerNumber: 2,
                            seatList: [
                                [
                                    {
                                        id: 1,
                                        status: 1,
                                        seatNo: 1,
                                        layerIndex: 1,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 1
                                    }, {
                                        id: 2,
                                        status: 1,
                                        seatNo: 2,
                                        layerIndex: 1,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 1
                                    }, {
                                        id: 3,
                                        status: 1,
                                        seatNo: 3,
                                        layerIndex: 1,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 2
                                    }, {
                                        id: 4,
                                        status: 1,
                                        seatNo: 4,
                                        layerIndex: 1,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 3
                                    }, {
                                        id: 5,
                                        status: 1,
                                        seatNo: 5,
                                        layerIndex: 1,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 0
                                    }
                                ],
                                [
                                    {
                                        id: 1,
                                        status: 1,
                                        seatNo: 1,
                                        layerIndex: 2,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 1
                                    }, {
                                        id: 2,
                                        status: 1,
                                        seatNo: 2,
                                        layerIndex: 2,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 1
                                    }, {
                                        id: 3,
                                        status: 1,
                                        seatNo: 3,
                                        layerIndex: 2,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 2
                                    }, {
                                        id: 4,
                                        status: 1,
                                        seatNo: 4,
                                        layerIndex: 2,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 3
                                    }, {
                                        id: 5,
                                        status: 1,
                                        seatNo: 5,
                                        layerIndex: 2,
                                        type: 1,
                                        byWindow: 1,
                                        sellSeatType: 0
                                    }
                                ]
                            ]
                        }]
                    }
                    console.log(6666)
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
        selSeat(citem, bi, sindex, arr) {
            // 未使用的 直接返回
            if (citem.status === 0) {
                return false
            }
            // 已售 直接返回
            if (citem.sellSeatType !== 0) {
                return false
            }
            if (citem.hasOwnProperty('isSelected')) {
                citem.isSelected = !citem.isSelected
            } else {
                citem.isSelected = true
            }
            this.$set(arr[bi], sindex, citem)
            let keys = bi + 1 + '' + this.zm[sindex]
            this.getSeatSelected(citem, keys)
            // console.log(citem, keys)
        },
        getSeatSelected(citem, keys) {
            let hasPushArrIndex = this.seatSelected.findIndex(v => v.keys === keys)
            console.log(hasPushArrIndex)

            if (hasPushArrIndex >= 0) {
                this.seatSelected.splice(hasPushArrIndex, 1)
            } else {
                this.seatSelected.push({
                    keys: keys,
                    ...citem
                })
            }
            console.log(this.seatSelected)
        },
        selectChair() {
            let query = this.query
            if (this.seatSelected.length === 0) return
            // 是有往返程
            if (this.isReturn) {
                // 是去程 点击跳转返程
                if (this.isDpt) {
                    this.setData({
                        isDpt: false
                    })
                    console.log({
                        ...query,
                        listDate: query.returnDate,
                        startCity: query.endCity,
                        startCityId: query.endCityId,
                        endCity: query.startCity,
                        endCityId: query.startCityId,
                        isDpt: 0
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
                    console.log('fillorder')
                    // 已经是返程 跳填写订单
                //     this.$router.replace({
                //         name: 'fillorder',
                //         query
                //     })
                }
            } else {
                console.log('fillorder')
                // this.$router.push({
                //     name: 'fillorder',
                //     query
                // })
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.chair-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    overflow: hidden;
    z-index: 1200;
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
            p{
                width: 100%;
                height: 24px;
                line-height: 24px;
            }
            img{
                width: 48px;
                height: 48px;
            }
        }
        .has-icon{
            padding-top:10px;
        }
        .type-chair{
            padding-top:10px;
        }
        .dis-sel{
            background-color: #f2f2f2;
            color: #ccc;
        }
        .selected-chair{
            padding-top:10px;
            background-color: #ff6f61;
            color: #fff;
            font-weight: bold;
        }
    }
}
.btn-wrap{
    position: fixed;
    bottom: 40px;
    width: 696px;
    height: 96px;
    left: 50%;
    transform: translateX(-50%)
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
        padding-right: 20px;
        padding-left: 20px;
        border-right: 1px solid #fff;
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
