<template>
    <div class="full-page loading-wrap">
        <div class="loading-top">
            <template v-if="isProcessing">
                <div class="lol lo-c"></div>
                <div class="for-word txt-pro">{{$t('正在支付')}}…</div>
            </template>
            <template v-if="!isProcessing && isSuccess">
                <div class="lol lo-s"></div>
                <div class="for-word txt-suc">
                    <md-icon
                        name="right"
                        size="lg"
                    ></md-icon>
                   <p>{{$t('已完成')}}</p>
                </div>
            </template>
            <template v-if="!isProcessing && !isSuccess">
                <div class="lol lo-f"></div>
                <div class="for-word txt-fail">
                    <md-icon
                        name="wrong"
                        size="lg"
                    ></md-icon>
                    <p>{{$t('失败')}}</p>
                </div>
            </template>
        </div>
        <div class="loading-bt"  v-if="isProcessing">
            <p>Do not leave until the result is returned.</p>
        </div>
        <div class="loading-bt" v-if="!isProcessing && isSuccess">
            <md-button type="default" @click="goToOrderDetail" round>
                <span>OK</span>
            </md-button>
        </div>
        <div class="loading-bt" v-if="!isProcessing && !isSuccess">
            <md-button type="warning" @click="goToPayment" round>
                <span>{{$t('再试一次')}}</span>
            </md-button>
        </div>
    </div>
</template>

<script>
import { Toast, Icon, Button } from 'mand-mobile'
import api from '../../config/api'
export default {
    name: 'payResult',
    components: {
        [Toast.name]: Toast,
        [Button.name]: Button,
        [Icon.name]: Icon
    },
    data() {
        return {
            orderNo: '', // 订单流水号
            orderPayId: -1, // 订单支付记录ID
            pollingCount: 0, // 轮询次数
            maxPolingCount: 300, // 最大轮询次数
            isProcessing: true, // 加载中
            isSuccess: false // 是否成功
        }
    },
    created() {
        this.getOrderNo()
    },
    mounted() {
        // 等待支付结果
        this.waitPayResult()
        // setInterval(this.waitPayResult, 3000)
    },
    methods: {
        getOrderNo() {
            this.orderNo = this.$route.query.orderNo
        },
        // 跳转到订单详情页
        goToOrderDetail() {
            this.$router.push({ path: 'orderdetail', query: { orderNo: this.orderNo } })
        },
        // 跳转到支付页
        goToPayment() {
            this.$router.push({ path: 'payment', query: { orderNo: this.orderNo } })
        },
        // 等待支付结果
        waitPayResult() {
            if (this.pollingCount >= this.maxPolingCount) {
                return
            }

            let params = {
                'orderSn': this.orderNo
            }
            if (this.orderPayId > 0) {
                params.push({ 'id': this.orderPayId })
            }

            this.fetch({
                url: api.waitPayResult,
                method: 'post',
                data: params
            }).then(res => {
                if (res.code === '200') {
                    this.orderPayId = res.data.id
                    // 支付状态 0:支付中 1:支付结束
                    // 如果支付结束, 展示出票结果
                    if (res.data.payStatus === 1) {
                        // 终止轮询
                        this.pollingCount = this.maxPolingCount
                        this.isProcessing = false
                        if (res.data.ticketOutSuccess) {
                            this.isSuccess = true
                        } else {
                            this.isSuccess = false
                        }
                    }
                } else {
                    // 支付已经结束
                    if (res.code === '60012') {
                        // 终止轮询
                        this.pollingCount = this.maxPolingCount
                        this.$alert({ txt: res.msg })
                        setTimeout(this.goToOrderDetail, 3000)
                    } else {
                        Toast.failed(res.msg, 3500)
                    }
                }
                setTimeout(() => {
                    this.waitPayResult()
                }, 3000)
            })
            this.pollingCount++
        }
    }
}

</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.loading-wrap{
    height: 100vh;
    background: #fff;
    .loading-top{
        width: 100%;
        height: 600px;
        background-color: #34354b;
        box-sizing: border-box;
        color: #ffffff;
        text-align: left;
        position: relative;
        .lol{
            font-size: 28px;
            text-align: center;
            line-height: 304px;
            position: relative;
            width: 304px;
            height: 304px;
            background: #34354b;
            top: 140px;
            left:50%;
            z-index: 2;
            transform:translateX(-50%);
        }
        .lo-c{
            border-width: 8px;
            border-right-color: #48d281;
            border-top-color: #48d281;
            border-style: solid;
            border-left-color: #6b7694;
            border-bottom-color: #48d281;
            border-radius: 100%;
            animation:mymove 5s infinite;
            -webkit-animation:mymove 5s infinite;
            &::before{
                content: " ";
                display: block;
                width: 18px;
                height: 18px;
                background-color: #48d281;
                box-sizing: border-box;
                border-radius: 100%;
                position: absolute;
                left:  30px;
                bottom: 30px;
            }
        }
        .lo-s{
            border-width: 8px;
            border-right-color: #48d281;
            border-top-color: #48d281;
            border-style: solid;
            border-left-color: #48d281;
            border-bottom-color: #48d281;
            border-radius: 100%;
        }
        .lo-f{
            border-width: 8px;
            border-right-color: #ff6f61;
            border-top-color: #ff6f61;
            border-style: solid;
            border-left-color: #ff6f61;
            border-bottom-color: #ff6f61;
            border-radius: 100%;
        }
        .for-word{
            font-size: 28px;
            text-align: center;
            position: absolute;
            width: 304px;
            height: 304px;
            transform: translateX(-50%);
            left:50%;
            z-index: 2;
        }
        .txt-pro{
            line-height: 304px;
            top: 140px;
        }
        .txt-suc{
            line-height: 1.4;
            top: 250px;
            color: #48d281
        }
        .txt-fail{
            line-height: 1.4;
            top: 250px;
            color: #ff6f61
        }
        @keyframes mymove
        {
            from {transform:translateX(-50%) rotate(0)}
            to {transform:translateX(-50%) rotate(360deg)}
        }

        @-webkit-keyframes mymove /*Safari and Chrome*/
        {
            from {transform:translateX(-50%) rotate(0)}
            to {transform:translateX(-50%) rotate(360deg)}
        }
    }
    .loading-bt{
        margin-top:75px;
        padding: 0 20px 0px 20px;
        p{
            font-size: 28px;
            text-align: center;
            padding-top: 20px;
            color: #34354b;
        }
    }
}
</style>
