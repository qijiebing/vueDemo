<template>
    <div class="login-wrap" :class="{'bgreset': !isShowBt}">
        <div class="login-box">
            <div class="title">
                <p>{{$t('在线预订平台')}}</p>
            </div>
            <div class="input-box">
                <md-field>
                    <div class="id-box fbox">
                        <div class="left-intel" v-if="!isEmail">
                            <intelInpu :countryCode='countryCode' @getback="getback"></intelInpu>
                        </div>
                        <div class="flex1 id-box">
                            <md-input-item
                                ref="name"
                                title="账号"
                                type="email"
                                :placeholder="$t('手机号/邮箱')"
                                :maxlength ='maxlength'
                                @focus="hidebt"
                                @blur="showbt"
                                v-model="id"
                                is-title-latent
                                clearable
                            ></md-input-item>
                        </div>
                    </div>
                    <md-input-item
                        ref="id"
                        type="password"
                        title="密码"
                        :placeholder="$t('密码')"
                        @focus="hidebt"
                        @blur="showbt"
                        v-model="psd"
                        is-title-latent
                        clearable
                    ></md-input-item>

                    <md-button class="sub-btn" type="warning" @click="loginTms">{{$t('登录')}}</md-button>
                    <div class="fbox regist">
                        <div class="flex1"> </div>
                        <div class="flex1" @click="goRegister">{{$t('注册')}}</div>
                    </div>
                </md-field>
            </div>
        </div>

        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { isEmpty, setStore } from '../../libs/util'
import api from '../../config/api'
import { Icon, InputItem, Field, Button } from 'mand-mobile'
import intelInpu from './components/index'
export default {
    name: 'login',
    components: {
        [Icon.name]: Icon,
        [InputItem.name]: InputItem,
        [Button.name]: Button,
        [Field.name]: Field,
        intelInpu
    },
    data() {
        return {
            countryCode: 'th',
            id: '',
            psd: '',
            rangeData: [
                {
                    text: '选择区号',
                    options: [
                        {
                            value: '0',
                            text: '+66'
                        },
                        {
                            value: '1',
                            text: '+88'
                        }
                    ]
                }
            ],
            isEmail: false,
            isShowBt: true,
            phoneAreaCode: '66',
            maxlength: 40
        }
    },
    watch: {
        id(newValue, oldValue) {
            if (!!(this.id) && (this.id).indexOf('@') >= 0) {
                this.isEmail = true
            } else {
                this.isEmail = false
            }
        }
    },
    methods: {
        getback(val) {
            this.phoneAreaCode = val.dialCode
        },
        hidebt() {
            this.isShowBt = false
        },
        showbt() {
            this.isShowBt = true
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
        validate(id, type) {
            if (id && type === 'psd') {
                if (id.length < 6 || id.length > 16) {
                    this.$alert({
                        txt: this.$t('密码输入6-16位！')
                    })
                    return false
                }
                return true
            } else if (id && type === 'name') {
                return id
            } else {
                return false
            }
        },
        loginTms() {
            if (this.validate(this.id, 'name') && this.validate(this.psd, 'psd')) {
                this.fetch({
                    url: api.login,
                    method: 'POST',
                    data: {
                        password: this.psd,
                        userNo: !this.isEmail ? `(${this.phoneAreaCode})${this.id}` : this.id
                    }
                }).then((result) => {
                    if (result.code === '200' && !isEmpty(result.data)) {
                        setStore('phoneNo', !this.isEmail ? `(${this.phoneAreaCode})${this.id}` : this.id)
                        setStore('memberName', result.data.memberName)
                        setStore('memberId', result.data.id)
                        let phoneTmp = (result.data.phone).indexOf('(') >= 0 ? ((result.data.phone).split('(')[1]).split(')')[0] : this.phoneAreaCode
                        setStore('phoneAreaCode', phoneTmp)
                        setStore('phone', result.data.phone)
                        if (this.$route.query.goTo === 'book') {
                            this.$router.replace({
                                name: 'book',
                                query: {
                                    scheduleDetailId: this.$route.query.scheduleDetailId
                                }
                            })
                        } else if (this.$route.query.goTo === 'home') {
                            this.$router.replace({
                                name: 'home',
                                query: {
                                    tab: this.$route.query.tab
                                }
                            })
                        } else if (this.$route.query.goTo) {
                            this.$router.replace({
                                name: this.$route.query.goTo,
                                query: {
                                    ...this.$route.query
                                }
                            })
                        } else {
                            this.$router.push({
                                name: 'home'
                            })
                        }
                    } else {
                        this.$alert({
                            txt: this.$t('账号或密码填写错误！')
                        })
                    }
                })
            } else {
                this.$alert({
                    txt: this.$t('账号或密码填写错误！')
                })
            }
        },
        goRegister() {
            this.$router.push({
                name: 'register'
            })
        }
    }
}
</script>
<style lang="less">
@import '~@/assets/styles/base.less';
.login-wrap{
    .md-field-item-content{
        height: 100px;
        min-height: 100px;
    }
    .id-box{
        height: 100px;
        min-height: 100px;
        box-sizing: border-box;
    }
    .md-input-item.is-title-latent .md-field-item-content{
        height: 100px;
        min-height: 100px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .md-button.warning{
        background-color: #ff6f61!important;
    }
}
</style>

<style lang="less">
@import '~@/assets/styles/base.less';
.md-button.warning:after{
    border: none;
}
.login-wrap{
    width: 100%;
    height: 100vh;
    position: relative;
    background: #34354b url('../../assets/img/login/loginbg_1080x1920.png') top center repeat-y;
    background-size:100% auto;
    img{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .login-box{
        padding: 40px 44px 110px;
        position: relative;
        height: 100vh;
        background-color: rgba(52,53,75,.45);
        .skip{
            position: absolute;
            right: 44px;
            top: 40px;
            font-size: 30px;
            color:#fff;
        }
        .title{
            p:nth-child(1){
                font-size: 48px;
                font-family: '方正正黑简体';
                color: #ffffff;
                text-align: center;
                margin-top:120px;
            }
            p:nth-child(2){
                font-size: 28px;
                font-family: '方正正黑简体';
                color: #ffffff;
                text-align: center;
                margin-top:35px;
            }
        }
        .input-box{
            margin-top:80px;
            .id-box{
                margin-bottom: 40px;
            }
            .left-intel{
                width: 144px;
                height: 100px;
                border:1px solid #fff;
            }
            .md-field{
                background: transparent;
            }
            .md-field-item-control{
                border: 1px solid #fff;
                box-sizing: border-box;
                height: 2rem;
            }
            .md-input-item-input::-webkit-input-placeholder{
                color: #fff;
                padding-left: 20px;
            }
            .md-input-item.is-title-latent .md-field-item-title{
                color:#fff;
                display: none;
            }
            .md-input-item-fake, .md-input-item-input{
                color: #fff;
            }
            .sub-btn{
                margin-top: 72px;
            }
            .regist{
                color: #fff;
                margin-top:10px;
                div{
                    &:nth-child(1){
                        text-align: left;
                        Size: 24px;
                        color: #fff;
                    }
                    &:nth-child(2){
                        text-align: right;
                        Size: 24px;
                        color: #fff;
                    }
                }
            }
            .md-input-item.is-title-latent .md-field-item-content, .md-input-item.is-title-latent .md-field-item-left, .md-input-item.is-title-latent .md-field-item-right, .md-input-item.is-title-latent .md-input-item-fake, .md-input-item.is-title-latent .md-input-item-input{
                padding-top: 0;
            }
            .md-field-item-content:before{
                border:none;
            }
        }
    }
    .share-box{
        width: 100%;
        height: 20vh;
        background:#fff;
    }
}
@media screen and (min-width: 1px) and (max-width: 330px) {
    .login-wrap{
        background: #34354b url('../../assets/img/login/loginbg_1080x1920.png') top center repeat-y;
        background-size:100% auto;
        // color: #666
    }
}
@media screen and (min-width: 330px) and (max-width: 506px) {
    .login-wrap{
        background: #34354b url('../../assets/img/login/loginbg_750x1624.png') top center repeat-y;
        background-size:100% auto;
        // color: #999
    }
}
</style>
