<template>
    <div class="coupon-box">
        <div class="bg-box">
            <img src="./../../assets/img/activity/bg01.png" alt="">
            <img src="./../../assets/img/activity/bg02.png" alt="">
            <img src="./../../assets/img/activity/bg03.png" alt="">
        </div>
        <div class="mian-box">
            <div class="coupon-item fbox">
                <div class="coupon-img"><img :src="logo2Url" alt=""></div>
                <div class="coupon-des-box flex1 fbox">
                    <div class="left-des flex1">
                        <div class="coupon-title">{{couponMsg.couponName}}</div>
                        <div class="coupon-subdes" v-if="couponMsg.couponType === 1">{{$t('满')}}{{couponMsg.exemptionCondition}}{{$t('可用')}}</div>
                        <div class="coupon-subdes" v-if="couponMsg.couponType === 2">{{$t('满')}}{{couponMsg.discountCondition}}{{$t('可用')}}</div>
                        <div class="coupon-des">{{couponMsg.endDate}}{{$t('到期')}}</div>
                    </div>
                    <div class="right-des" :class="{'double-line': isRegister}">
                        <p class="price-st" v-if="couponMsg.couponType === 1">{{couponMsg.exemptionFee}}&nbsp;THB</p>
                        <p class="price-st" v-else-if="couponMsg.couponType === 2">{{couponMsg.discount}}%&nbsp;OFF</p>
                        <p class="gohome" @click="gohome" v-if="isRegister">{{$t('去使用')}}</p>
                    </div>
                </div>
            </div>

            <div class="yzm" v-if="!phoneNo">
                <div class="input-box fbox">
                    <div class="intelInpu">
                        <intelInpu @getback="getback" :countryCode='countryCode'></intelInpu>
                    </div>
                    <div class="normal-input flex1">
                        <input v-model.trim="pom" @blur="showbt" :placeholder="$t('请输入手机号')">
                    </div>
                </div>
                <div class="bt-btn" @click="submitMsg" >
                    {{$t('点击领券')}}
                </div>
            </div>
            <div class="msg-box" v-if="isRegister">
                <p class="invite-msg">{{$t('尊敬的')}}{{userMsg.memberName}}{{$t('用户您好,优惠券已经放置到您的卡包')}}</p>
                <a class="touch-coupon" @click="goCoupon" href="javascript:;">{{$t('查看卡券')}}</a>
            </div>
        </div>
    </div>
</template>

<script>
import intelInpu from './../login/components/index'
import api from './../../config/api'
import { isEmpty, formatDate, getStore } from './../../libs/util'
export default {
    data() {
        return {
            logo2Url: '',
            couponId: '',
            pom: '',
            phoneNo: '',
            phoneAreaCode: '66',
            countryCode: 'th',
            couponMsg: {},
            userMsg: {},
            isRegister: false // 是否注册过的用户
        }
    },
    components: {
        intelInpu
    },
    watch: {
        verfitycode(newValue) {
            if (newValue) {
                this.verfitycode = newValue
            }
        }
    },
    methods: {
        showbt() {
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
        },
        goCoupon() {
            this.$router.push({
                name: 'couponList'
            })
        },
        gohome() {
            this.$router.push({
                name: 'home'
            })
        },
        getback(val) {
            this.phoneAreaCode = val.dialCode
            console.log(this.phoneAreaCode)
        },
        submitMsg() {
            console.log(this.pom)
            let phoneNo = `(${this.phoneAreaCode})${this.pom}`
            this.getCoupon(phoneNo)
        },
        initCard() {
            this.fetch({
                url: api.findById,
                method: 'POST',
                data: {
                    couponId: this.couponId
                }
            }).then((result) => {
                if (result.code === '200' && !isEmpty(result.data)) {
                    let endDate = formatDate(result.data.effectEndDate, 'yyyy-MM-dd')
                    this.couponMsg = result.data
                    this.couponMsg.endDate = endDate
                } else {
                    this.$alert({
                        txt: result.msg
                    })
                }
                console.log(result)
            }).catch(error => {
                this.$alert({
                    txt: error.msg
                })
            })
        },
        getCoupon(phoneNo) {
            this.fetch({
                url: api.bindPhoneNo,
                method: 'POST',
                data: {
                    couponId: this.couponId,
                    phoneNo: phoneNo || this.phoneNo
                }
            }).then((result) => {
                if (result.code === '200') {
                    this.isRegister = true
                    this.userMsg = !isEmpty(result.data) ? result.data : {}
                } else if (result.code === '60001') {
                    this.$confirm({
                        title: '',
                        txt: '用户不存在，请重新输入', // this.$t('确定要退票吗？'),
                        okBtn: '新用户注册',
                        cancelBtn: '确定',
                        okFn: () => {
                            this.$router.push({
                                name: 'register'
                            })
                        }
                    })
                } else if (result.code === '60019') {
                    this.isRegister = true
                    this.$alert({
                        txt: result.msg
                    })
                } else {
                    this.$alert({
                        txt: result.msg
                    })
                }
            }).catch(error => {
                this.$alert({
                    txt: error.msg
                })
            })
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
        }
    },
    created() {
        this.phoneNo = getStore('phone') || ''
        this.couponId = this.$route.query.couponId
        if (this.phoneNo) {
            this.getCoupon()
        }
        this.initCard()
        this.getLogo2Url()
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.coupon-box{
    position: relative;
    background-color: #ff8b79;
    height: 100vh;
    .bg-box{
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        img{
            display: block;
            padding: 0;
            margin: 0;
            width: 100%;
        }
    }
    .mian-box{
        width: 100%;
        padding: 0 20px;
        padding-top: 380px;
        position: relative;
        z-index: 1;
        .coupon-item{
            width: 100%;
            padding: 34px 28px 34px 32px;
            background-color: #fff;
            border-radius: 20px;
            align-items: center;
        }
        .coupon-img{
            width: 80px;
            height: 80px;
            border-radius: 100%;
            background: yellow;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        }
        .coupon-des-box{
            padding-left: 40px;
            .left-des{
                justify-content: space-between;
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
            .right-des{
                width: 150px;
                display: flex;
                align-items: center;
                text-align: right;
                font-size: 36px;
                color: #f27460;
                letter-spacing: -4px;
                position: relative;
                .price-st{
                    font-size: 36px;
                    font-weight: 600;
                    text-align: right;
                    width: 100%;
                    padding-right: 10px;
                }
                p{
                    // width: 100%;
                    text-align: right;
                }
                .gohome{
                    border: 2px solid #666;
                    padding: 0 14px;
                    border-radius: 20px;
                    font-size: 28px;
                    color: #666;
                    margin-top:20px;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
            .double-line{
                flex-direction: column;
            }
        }
    }
    .yzm{
        .input-box{
            width: 100%;
            height: 90px;
            border-radius: 20px;
            background: #fff;
            margin:0 auto;
            margin-top: 30px;
            overflow: hidden;
            .intelInpu{
                width: 140px;
            }
            .normal-input{
                input{
                    width: 100%;
                    height: 100%;
                    color: #000;
                    padding-left:10px;
                }
            }
        }
    }
    .verfy-input-box {
        width: 90%;
        height: 90px;
        border-radius: 4px;

        border: 2px solid #ddd;
        background: #333;
        margin:0 auto;
        margin-top: 20px;
        input{
            width: 100%;
            height: 100%;
            color: #000;
            padding-left:10px;
        }
    }
    .bt-btn{
        width: 100%;
        height: 90px;
        background-image: linear-gradient(0deg,
            #34354b 0%,
            #50549f 100%),
        linear-gradient(
            #34354b,
            #34354b);
        background-blend-mode: normal,
            normal;
        border-radius: 45px;
        font-size:32px;
        line-height: 90px;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #ffffff;
        text-align: center;
        margin:0 auto;
        margin-top:40px;
    }
    .de-txt{
        margin: 0 auto;
        margin-top:160px;
        width: 90%;
    }
    .de-txt-sec{
        margin: 0 auto;
        width: 90%;
    }
    .msg-box{
        width: 100%;
        text-align: center;
        font-weight: 600;
        padding-bottom: 20px;
        margin-top: 30px;
        .touch-coupon{
            text-decoration: underline;
        }
    }
}
</style>
<style lang="less">
.coupon-box .intl-tel-input{
    height: 90px;
    line-height: 90px;
    .dial-codes{
        height: 90px;
        line-height: 90px;
        font-size: 32px;
        color: #333;
        font-weight: normal;
        position: relative;
        &::after{
            content: ' ';
            display: block;
            width: 2px;
            height: 80%;
            position: absolute;
            right: 0;
            top: 10%;
            background: #eee;
        }
    }
}
.confirm-box .title {
    display: none;
}
img {
  -webkit-touch-callout: none;
  pointer-events: none; // 像微信浏览器还是无法禁止，加上这行样式即可
}

// 禁止长按选择文字
div {
  -webkit-user-select: none;
}

// 禁止长按呼出菜单
div {
  -webkit-touch-callout: none;
}
</style>
