<template>
    <div class="contain-box full-page max-index">
        <template v-if="!!couponList && couponList.length>0">
            <div class="coupon-item fbox" @click="selectCouponfun(index, item)" v-for="(item, index) in couponList" :key="index" :class="{'disable': item.canUse !==1 && selectPage}">
                <div class="cpn-img"><img :src="logo2Url"/></div>
                <div class="right-des flex1">
                    <div class="coupon-title" v-if="item.couponName">{{item.couponName}}</div>
                    <!-- <div class="coupon-subdes" v-if="item.couponDesc">{{item.couponDesc}}</div> -->
                    <div class="coupon-subdes" v-if="item.couponType === 1 && item.exemptionCondition">{{$t('满')}}{{item.exemptionCondition}}{{$t('可用')}}</div>
                    <div class="coupon-subdes" v-if="item.couponType === 2 && item.discountCondition">{{$t('满')}}{{item.discountCondition}}{{$t('可用')}}</div>
                    <div class="coupon-des" v-if="item.effectEndDate">{{item.effectEndDate | endTime}}到期</div>
                </div>
                <div style="width: 100px">
                    <div class="price" style="float: right" v-if="item.couponType === 1">{{item.exemptionFee}} THB</div>
                    <div class="price" style="float: right" v-if="item.couponType === 2">{{item.discount}}% OFF</div>
                    <!-- 勾选的填写订单页面 -->
                    <template v-if="selectPage">
                        <div class="gohome n-b" style="float: right; clear: right">
                            <template v-if="checkedCoupon === index">
                                <md-icon name="checked" size="lg"></md-icon>
                            </template>
                            <template v-else>
                                <md-icon name="check" size="lg"></md-icon>
                            </template>
                            <!-- <md-radio :name="index" v-model="checkedCoupon" label=""/> -->
                        </div>
                    </template>
                    <template v-else-if="!selectPage">
                        <div class="gohome" @click="gohome" style="float: right; clear: right">去使用</div>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="!couponList || couponList.length===0">
            <div class="icon"><i class="cubeic-tag"></i></div>
            <div class="none-coupon">{{$t('暂无优惠券')}}</div>
        </template>
    </div>
</template>
<script>
import api from '../../config/api'
import { getStore, formatDate } from '../../libs/util'
import { Radio, Icon } from 'mand-mobile'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'couponIndex',
    data() {
        return {
            logo2Url: '',
            loading: false,
            page: 1,
            pageSize: 20,
            // couponList: [],
            selectPage: false
            // checked: 0
        }
    },
    components: {
        [Radio.name]: Radio,
        [Icon.name]: Icon
    },
    computed: {
        ...mapState(['checkedCoupon', 'couponList'])
    },
    watch: {
    },
    filters: {
        endTime: function(value) {
            return formatDate(value, 'yyyy-MM-dd')
        }
    },
    methods: {
        ...mapMutations({
            setData: 'setData'
        }),
        selectCouponfun(index, item) {
            console.log(item.canUse)
            console.log(this.selectPage)
            if (item.canUse !== 1 && this.selectPage) {
                return
            }
            if (this.selectPage) {
                let checked = ''
                if (this.checkedCoupon === index) {
                    checked = ''
                } else {
                    checked = index
                }
                this.setData({
                    'checkedCoupon': checked
                })
                // this.checked = checked
                this.$router.go(-1)
            } else {
                this.gohome()
            }
        },
        gohome() {
            this.$router.push({
                name: 'home'
            })
        },
        scrollLoad(event) {
            let listH = window.innerHeight // 高度
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 已滚动的距离
            let scrollH = document.documentElement.scrollHeight || document.body.scrollHeight // 总高度
            if ((listH + scrollTop) / scrollH * 100 > 75) {
                this.page++
                this.getCouponList()
            }
        },
        getLogo2Url() {
            this.fetch({
                url: api.logo2Url,
                method: 'POST',
                data: {}
            }).then((result) => {
                if (result.success) {
                    this.logo2Url = result.data
                } else {
                    this.$alert({ txt: this.$t('获取数据失败') })
                }
            })
        },
        getCouponList() {
            if (this.loading) {
                return
            }
            let memberId = getStore('memberId') || ''
            this.loading = true
            this.fetch({
                url: api.couponPageList,
                method: 'POST',
                data: {
                    userId: memberId,
                    page: this.page,
                    pageSize: 1000// this.pageSize
                }
            }).then((result) => {
                if (result.success) {
                    // this.couponList = result.data.list
                    this.setData({
                        couponList: result.data.list
                    })
                } else {
                    this.$alert({ txt: this.$t('获取数据失败') })
                }
                this.loading = false
            })
        }
    },
    beforeRouteLeave(to, from, next) {
        // window.removeEventListener('scroll', this.scrollLoad, true)
        next()
    },
    created() {
        // book 过来的 选择优惠券
    },
    mounted() {
        // book 过来的 选择优惠券
        this.selectPage = Number(this.$route.query.selectPage) === 1
        console.log(this.selectPage)
        // window.addEventListener('scroll', this.scrollLoad, true)
        this.getLogo2Url()
        if (!this.selectPage) {
            this.setData({
                couponList: []
            })
            this.getCouponList()
        } else {
            // this.checked = this.checkedCoupon
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.contain-box{
    width: 100%;
    padding: 0 20px;
    .none-coupon{
        width: 100%;
        height: 100px;
        text-align: center;
        line-height: 200px;
    }
    .coupon-item{
        display: flex;
        background: #fff;
        height: 180px;
        background-color: #ffffff;
        border-radius: 20px;
        margin-top: 20px;
        padding: 32px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        .cpn-img{
            width: 80px;
            height: 80px;
            border-radius: 100%;
            display: flex;
            align-items: center;
            overflow: hidden;
            img{
                width: 80px;
                height: 80px;
                border-radius: 100%;
            }
        }
        .right-des{
            padding-left:40px;
           .coupon-title{
                    height: 32px;
                    line-height: 32px;
                    font-family: PingFang-SC-Bold;
                    font-size: 32px;
                    color: #333;
                    font-weight: bold;
                }
                .coupon-subdes{
                    height: 24px;
                    line-height: 24px;
                    font-family: PingFang-SC-Bold;
                    font-size: 24px;
                    color: #999;
                    margin-top: 20px;
                }
                .coupon-des{
                    height: 24px;
                    line-height: 24px;
                    font-family: PingFang-SC-Bold;
                    font-size: 24px;
                    color: #999;
                    margin-top: 20px;
                }
        }
        .price{
            font-size: 36px;
            color: #f27460;
            letter-spacing: -4px;
        }
        .gohome{
            border: 2px solid #666;
            padding: 0 14px;
            border-radius: 20px;
            font-size: 28px;
            color: #666;
            margin-top:20px;
        }
        .n-b{
            border: none;
            margin-top: 0;
        }
    }
    .disable{
        background-color: #ccc !important;
        color: #999;
        .price{
            color: #999;
        }
    }
    .md-radio.is-checked .md-radio-icon{
        color: #34354b;
        font-size: 24px;
    }
    .md-icon.icon-font.lg{
        color: #2f86f6;
    }
}
.max-index{
    z-index: 9999!important;
    padding-bottom: 20px;
}
</style>
