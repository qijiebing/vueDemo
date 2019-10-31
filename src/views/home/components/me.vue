<template>
    <div class="me-box">
        <div class="person-msg">
            <div class="person-top fbox">
                <div class="header-img">{{memberTypeId | filterman}}</div>
                <div class="flex1 right-name">{{memberName}}</div>
            </div>
            <!-- <div class="bt-card fbox">
                <div class="card-box flex1">3 card</div>
                <div class="travel-box flex1">7 travel</div>
            </div> -->
            <md-icon class="logout" name="share" @click="logout"></md-icon>
        </div>
        <div class="field-list">
            <div class="psger-detail fbox border-bottom" @click="goList">
                <div class="flex1 left-txt"><md-icon name="order"></md-icon>{{$t('所有订单')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </div>
            <div class="psger-detail fbox border-bottom" @click="goCoupon">
                <div class="flex1 left-txt"><md-icon name="coupon"></md-icon>{{$t('卡券')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </div>
            <div class="psger-detail fbox" @click="goDetail(0)">
                <div class="flex1 left-txt"><md-icon name="user"></md-icon>{{$t('退票说明')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </div>
            <div class="psger-detail fbox" @click="goDetail(1)">
                <div class="flex1 left-txt"><md-icon name="address-book"></md-icon>{{$t('隐私政策')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </div>
            <a href="tel:0897820192" class="psger-detail fbox border-bottom">
                <div class="flex1 left-txt"><md-icon name="service"></md-icon>{{$t('客服服务')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </a>
            <div class="psger-detail fbox" @click="goLanguage">
                <div class="flex1 left-txt"><md-icon name="volumn"></md-icon>{{$t('语言设置')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </div>
            <div class="psger-detail fbox" @click="goDetail(4)">
                <div class="flex1 left-txt"><md-icon name="setting"></md-icon>{{$t('系统支持')}}</div>
                <div class="arrow"><md-icon name="arrow-right"></md-icon></div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from 'mand-mobile'
import api from '@/config/api'
import { getStore, setStore } from '@/libs/util'
export default {
    components: {
        [Icon.name]: Icon
    },
    filters: {
        filterman: function(value) {
            let tmp = 'Mr'
            switch (value) {
                case 0:
                    tmp = 'Mr'
                    break
                case 1:
                    tmp = 'Mis'
                    break
                case 2:
                    tmp = 'Miss'
                    break
            }
            return tmp
        }
    },
    data() {
        return {
            memberName: '',
            memberTypeId: 0
        }
    },
    methods: {
        goList() {
            this.$router.push({
                name: 'orderlist'
            })
        },
        goCoupon() {
            this.$router.push({ name: 'couponList' })
        },
        goDetail(id) {
            this.$emit('goDetail', id)
        },
        goLanguage() {
            this.$emit('goLanguage')
        },
        getInfo() {
            let phoneNo = getStore('phoneNo') || ''
            console.log(phoneNo)
            if (!phoneNo) {
                // this.$alert({
                //     txt: this.$t('未登录，请登录'),
                //     okFn: () => {
                this.$router.push({
                    name: 'login',
                    query: {
                        goTo: 'home',
                        tab: 2
                    }
                })
                // }
                // })
                return
            }
            this.fetch({
                url: api.queryByPhone,
                method: 'POST',
                data: {
                    phoneNo: phoneNo
                }
            }, {
                name: 'home',
                query: { tab: 2 }
            }).then(result => {
                if (result.code === '200') {
                    this.memberName = result.data.memberName || ''
                    this.memberTypeId = result.data.memberTypeId
                } else {
                    // this.$alert({
                    //     txt: this.$t('未登录，请登录'),
                    //     okFn: () => {
                    this.$router.push({
                        name: 'login',
                        query: {
                            goTo: 'home',
                            tab: 2
                        }
                    })
                    //     }
                    // })
                }
            }).catch(error => {
                console.log(error)
            })
        },
        logout() {
            this.fetch({
                url: api.logout,
                method: 'POST',
                data: {}
            }, {
                name: 'home',
                query: { tab: 2 }
            }).then(result => {
                if (result.code === '200') {
                    setStore('phoneNo', '')
                    setStore('phone', '')
                    this.$alert({
                        txt: this.$t('登出成功'),
                        okFn: () => {
                            this.$router.push({
                                name: 'login',
                                query: {
                                    goTo: 'home',
                                    tab: 2
                                }
                            })
                        }
                    })
                } else {
                    this.$alert({
                        txt: this.$t('登出失败')
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        }
    },
    mounted() {
        this.getInfo()
        this.memberName = getStore('memberName') || 'userName'
    }
}
</script>

<style lang="less" scoped>
.me-box{
    .person-msg{
        width: 100%;
        background: #34354b;
        padding:0 27px;
        position: relative;
        .share {
            position: absolute;
            right: 27px;
            top:50%;
            transform: translateY(-50%);
            color: #fff;
        }
        .person-top{
            width: 100%;
            height: 216px;
            .header-img{
                width: 120px;
                height: 120px;
                background: #9ea5b9;
                line-height: 120px;
                box-sizing: border-box;
                font-family: '方正兰亭黑简体 Bold', '方正兰亭黑简体';
                font-weight: 700;
                color: #34354b;
                text-align: center;
                border-radius: 100%;
                margin-top:48px;
                font-size:36px;
                margin-left:21px;
            }
            .right-name{
                font-size:32px;
                line-height: 216px;
                color:#fff;
                padding-left:48px;
            }
        }
        .bt-card{
            display: none;
        }
    }
    .field-list{
        width: 100%;
        padding: 0 27px;
        background: #fff;
    }
    .psger-detail{
        height: 120px;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #34354b;
        font-size: 28px;
        line-height: 120px;
        .left-txt i{
            padding-right:10px;
        }
    }
}
</style>
