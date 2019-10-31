<template>
    <div class="rgs-box full-page">
        <div class="yzm">
            <div class="input-box fbox" v-show="!hasGetVerfiy">
                <div class="intelInpu" v-if="!isMail">
                    <intelInpu @getback="getback" :countryCode='countryCode'></intelInpu>
                </div>
                <div class="normal-input flex1">
                    <input v-model.trim="pom" :placeholder="$t('手机号/邮箱')">
                </div>
            </div>
            <div class="bt-btn" :class="{'grey':times>0}" @click="submitMsg" v-show="!hasGetVerfiy">
                {{$t('发送验证码')}}
                <template v-if="times>0">
                    ({{times}})
                </template>
            </div>

            <template v-if="hasGetVerfiy">
                <p class='de-txt'>{{$t('我们发送了验证码到:')}}{{pom}}</p>
                <p class='de-txt-sec'>{{$t('请输入验证码确认账号')}}</p>
                <div class="verfy-input-box flex1" >
                    <input v-model.trim="verfitycode" :placeholder="$t('请输入手机/邮箱验证码')">
                </div>
                <div class="bt-btn" @click="submitVerfiy">
                    {{$t('验证')}}
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import intelInpu from '../../components/index'
import api from '../../../../config/api'
// import { isEmpty } from '../../../../libs/util'
export default {
    name: 'register',
    data() {
        return {
            countryCode: 'th',
            isMail: false,
            times: 0,
            pom: '',
            phoneAreaCode: '66',
            hasGetVerfiy: false,
            verfitycode: ''
        }
    },
    components: {
        intelInpu
    },
    watch: {
        pom(newValue, oldValue) {
            if (!!(newValue) && (newValue).indexOf('@') >= 0) {
                this.isMail = true
                this.pom = newValue
            }
        },
        verfitycode(newValue) {
            if (newValue) {
                this.verfitycode = newValue
            }
        }
    },
    methods: {
        getback(val) {
            this.phoneAreaCode = val.dialCode
            this.countryCode = val.code
        },
        // 获取验证吗
        submitMsg() {
            // this.$router.push({
            //     path: './fillmsg',
            //     query: {
            //         validateFlag: this.isMail ? 2 : 1 // 1:手机验证注册 2:邮箱验证注册
            //     }
            // })
            if (this.times > 0) {
                return
            }
            if (!this.pom) {
                this.$alert({
                    txt: this.$t('请输入手机/邮箱验证码')
                })
                return
            }
            this.fetch({
                url: api.getVerifyCode,
                method: 'POST',
                data: {
                    email: this.isMail ? this.pom : '',
                    phone: !this.isMail ? this.pom : '',
                    phoneAreaCode: !this.isMail ? this.phoneAreaCode : '',
                    useSms: !this.isMail
                }
            }).then((result) => {
                if (result.success) {
                    this.hasGetVerfiy = true
                    this.times = 30
                    let timeInt = setInterval(() => {
                        if (this.times > 0) {
                            this.times = this.times - 1
                        } else {
                            clearInterval(timeInt)
                        }
                    }, 1000)
                } else {
                    this.$alert({
                        txt: this.$t('该账户已注册')
                    })
                }
            })
        },
        // 校验验证码
        submitVerfiy() {
            if (!this.verfitycode) {
                this.$alert({
                    txt: this.$t('请输入手机/邮箱验证码')
                })
                return
            }
            this.fetch({
                url: api.verifyCode,
                method: 'POST',
                data: {
                    email: this.isMail ? this.pom : '',
                    phone: !this.isMail ? this.pom : '',
                    phoneAreaCode: !this.isMail ? this.phoneAreaCode : '',
                    useSms: !this.isMail,
                    verifyCode: this.verfitycode
                }
            }).then((result) => {
                if (result.success) {
                    this.$router.push({
                        path: './fillmsg',
                        query: {
                            validateFlag: this.isMail ? 2 : 1, // 1:手机验证注册 2:邮箱验证注册
                            pom: this.pom,
                            AreaCode: this.phoneAreaCode,
                            countryCode: this.countryCode
                        }
                    })
                } else {
                    this.$alert({
                        txt: this.$t('验证码错误，请重新输入')
                    })
                }
            })
        }
    },
    mounted() {
        // 解决ios返回到填写页空白问题
        let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        if (isIos) {
            let $body = document.querySelector('body')
            let st = $body.scrollTop
            // let sh = $body.scrollHeight
            let move = st + 1

            // alert('st:'+st+';sh:'+sh+';move:'+move);
            setTimeout(function() {
                $body.scrollTop = move
            }, 100)
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.rgs-box{
    .yzm{
        .input-box{
            width: 90%;
            height: 80px;
            border-radius: 4px;
            box-shadow: 0 0 4px #ddd;
            border: 2px solid #ddd;
            background: #fff;
            margin:0 auto;
            margin-top:160px;
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
        height: 80px;
        border-radius: 4px;
        box-shadow: 0 0 4px #ddd;
        border: 2px solid #ddd;
        background: #fff;
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
        width: 90%;
        height: 94px;
        font-size:36px;
        line-height: 94px;
        border-radius: 72px;
        background-color: #ff6f61;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #ffffff;
        text-align: center;
        margin:0 auto;
        margin-top:20px;
    }
    .grey{
        background: #ddd
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
}
/deep/.dial-codes{
    color: #000!important;
    line-height: 75px!important;
    font-weight: normal;
    background: #eee;
}
</style>
