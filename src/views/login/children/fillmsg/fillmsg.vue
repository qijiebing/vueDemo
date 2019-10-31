<template>
    <div class="fill-box full-page">
        <div class="item">
            <p class="title">{{$t('称谓')}}</p>
            <md-field>
                <md-field-item
                    title=""
                    :content="selectorValue"
                    @click="showSelector"
                    arrow
                    solid
                />
            </md-field>
            <md-selector
                v-model="isSelectorShow"
                :data="data"
                default-value="1"
                title=""
                @choose="onSelectorChoose"
                >
            </md-selector>
        </div>
        <div class="item">
            <p class="title">{{$t('姓名')}}</p>
            <div class="normal-inputs fbox">
                <input class="flex1 left" v-model.trim="gn" :placeholder="$t('姓')"/>
                <input class="flex1" v-model.trim="sn" :placeholder="$t('名')"/>
            </div>
        </div>
        <div class="item">
            <p class="title">{{$t('手机号码')}}{{$t('(注意修改正确区号)')}}</p>
            <div class="input-box fbox">
                <div class="intelInpu">
                    <intelInpu :countryCode='countryCode' :phoneAreaCode='phoneAreaCode' :validateFlag="validateFlag" @getback="getback"></intelInpu>
                </div>
                <div class="normal-input flex1">
                    <input v-model.trim="phone" :disabled='disablePhone' :placeholder="$t('请输入你的手机号')">
                </div>
            </div>
        </div>
        <div class="item">
            <p class="title">{{$t('邮箱账户')}}</p>
            <div class="normal-inputs">
                    <input v-model.trim="mail" :disabled='disableMail' :placeholder="$t('填写邮箱')">
            </div>
        </div>
        <div class="item">
            <p class="title">{{$t('密码')}}</p>
            <div class="normal-inputs">
                    <input type="password" v-model.trim="password" :placeholder="$t('密码')">
            </div>
        </div>
        <div class="item">
            <p class="title">{{$t('确认密码')}}</p>
            <div class="normal-inputs">
                    <input type="password" v-model.trim="secpassword" :placeholder="$t('确认密码')">
            </div>
        </div>
        <p class="tips">
            <md-icon
                name="security"
                size="lg"
            ></md-icon>
            {{$t('您的隐私信息被保护且不会被泄露')}}
        </p>
        <div class="bt-btn" @click="submitVerfiy" :class="{'grey':!confirmable}">
                    {{$t('提交')}}
        </div>
    </div>
</template>

<script>
import { Selector, Field, FieldItem, Icon } from 'mand-mobile'
import { setStore } from '../../../../libs/util'
// import { formatDate } from '@/libs/util'
import intelInpu from '../../components/index'
import api from '../../../../config/api'
export default {
    components: {
        [Selector.name]: Selector,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Icon.name]: Icon,
        intelInpu
    },
    watch: {
        phone(newValue, oldValue) {
            if (this.phone) {
                this.phone = newValue
            }
            if (this.selectorValue && newValue && this.phoneAreaCode && this.secpassword && this.password && this.mail && this.gn && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        selectorValue(nv) {
            if (nv && this.phone && this.phoneAreaCode && this.secpassword && this.password && this.mail && this.gn && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        phoneAreaCode(nv) {
            if (this.selectorValue && this.phone && nv && this.secpassword && this.password && this.mail && this.gn && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        secpassword(nv) {
            if (this.selectorValue && this.phone && this.phoneAreaCode && nv && this.password && this.mail && this.gn && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        password(nv) {
            if (this.selectorValue && this.phone && this.phoneAreaCode && this.secpassword && nv && this.mail && this.gn && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        mail(nv) {
            if (this.selectorValue && this.phone && this.phoneAreaCode && this.secpassword && this.password && nv && this.gn && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        gn(nv) {
            if (this.selectorValue && this.phone && this.phoneAreaCode && this.secpassword && this.password && this.mail && nv && this.sn) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        },
        sn(nv) {
            if (this.selectorValue && this.phone && this.phoneAreaCode && this.secpassword && this.password && this.mail && this.gn && nv) {
                this.confirmable = true
            } else {
                this.confirmable = false
            }
        }
    },
    data() {
        return {
            countryCode: 'th',
            isSelectorShow: false,
            data: [
                {
                    value: '1',
                    text: 'Mr'
                },
                {
                    value: '2',
                    text: 'Mrs'
                },
                {
                    value: '3',
                    text: 'Miss'
                }
            ],
            selectorValue: 'Mr',
            phone: '',
            phoneAreaCode: '66',
            secpassword: '',
            password: '',
            mail: '',
            gn: '',
            sn: '',
            validateFlag: '',
            confirmable: false,
            pom: '',
            disableMail: false,
            disablePhone: false
        }
    },
    mounted() {
        this.validateFlag = this.$route.query.validateFlag
        this.pom = this.$route.query.pom + ''
        this.phoneAreaCode = this.$route.query.AreaCode + ''
        this.countryCode = this.$route.query.countryCode + ''
        if (this.validateFlag === '1' || this.validateFlag === 1) {
            this.phone = this.$route.query.pom
        } else if (this.validateFlag === '2' || this.validateFlag === 2) {
            this.mail = this.$route.query.pom
        }
        this.disableMail = !!(this.pom && this.mail)
        this.disablePhone = !!(this.pom && this.phone)
    },
    methods: {
        getback(val) {
            this.phoneAreaCode = val.dialCode + ''
            this.countryCode = val.code + ''
            console.log(this.phoneAreaCode)
        },
        showSelector() {
            this.isSelectorShow = true
        },
        onSelectorChoose({ text }) {
            console.log(text)
            this.selectorValue = text
        },
        submitVerfiy() {
            if (!this.confirmable) return
            if (this.selectorValue && this.phone && this.phoneAreaCode && (this.secpassword === this.password) && this.mail && this.gn && this.sn) {
                let regexp = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
                if (!regexp.test(this.mail)) {
                    this.$alert({
                        txt: this.$t('请填写正确邮箱')
                    })
                    return
                }
                if ((this.secpassword.length < 6 || this.secpassword.length > 16) || (this.password.length < 6 || this.password.length > 16)) {
                    this.$alert({
                        txt: this.$t('密码输入6-16位！')
                    })
                    return
                }
            } else {
                if (!this.phone) {
                    this.$alert({
                        txt: this.$t('请填写手机号码')
                    })
                    return
                }
                let regexp = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
                if (!this.mail || !regexp.test(this.mail)) {
                    this.$alert({
                        txt: this.$t('请填写正确邮箱')
                    })
                    return
                }
                if (!this.secpassword || !this.secpassword) {
                    this.$alert({
                        txt: this.$t('请填写密码')
                    })
                    return
                }
                if (this.secpassword !== this.password) {
                    this.$alert({
                        txt: this.$t('请确认密码一致')
                    })
                    return
                }
                if (!this.gn || !this.sn) {
                    this.$alert({
                        txt: this.$t('请填写姓名')
                    })
                    return
                }
                return
            }
            this.fetch({
                url: api.add,
                method: 'POST',
                data: {
                    // certificateNo: 1, // 证件号
                    // certificateType: 0, // 证件类型 0 - 身份证 1 - 护照
                    // createTime: formatDate(), // 不需要填写
                    // createUserId: 0, // 不需要填写
                    title: this.selectorValue, // 称谓
                    email: this.mail,
                    // id: this.id, // 不需要填写
                    memberName: this.gn + this.sn, // 会员名称
                    memberTypeId: 0, // 会员类型ID
                    password: this.password, // 密码
                    phone: `(${this.phoneAreaCode})${this.phone}`, // 手机号 包含国际区号
                    // status: 0, // 不需要填写
                    // updateTime: formatDate(), //  不需要填写
                    // updateUserId: 0, // 不需要填写
                    // vcode: 1 //不需要填写
                    validateFlag: this.validateFlag // 1:手机验证注册 2:邮箱验证注册
                }
            }).then((result) => {
                if (result.success) {
                    this.$alert({
                        txt: this.$t('注册成功，点击跳转首页登录'),
                        okFn: () => {
                            setStore('phoneNo', this.validateFlag === 1 ? this.phone : this.mail)
                            this.$router.go(-2)
                        }
                    })
                } else {
                    this.$alert({
                        txt: result.msg || this.$t('失败，再试一次')
                    })
                }
            }).catch(e => {
                this.$alert({
                    txt: this.$t('失败，再试一次')
                })
            })
        }
    }
}
</script>

<style lang="less">
@import '~@/assets/styles/base.less';
.fill-box .md-icon.icon-font:before {
    position: relative;
    z-index: 0;
}
.fill-box{
    padding: 20px 20px;
    .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 30px;
        // color: #4b4be3;
    }
    .md-field-item-title{
        width: 0!important;
    }
    .md-field{
        padding: 0 10px;
        background: transparent;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .md-field-item-control{
        padding-left:10px;
    }
    .input-box{
        width: 100%;
        height: 100px;
        border-radius: 4px;
        box-shadow: 0 0 4px #ddd;
        border: 2px solid #ddd;
        margin:0 auto;
        .intelInpu{
            width: 140px;
            color: #000;
        }
        .normal-input{
            input{
                width: 100%;
                height: 100%;
                color: #000;
                padding-left:10px;
            }
        }
        /deep/.dial-codes{
            color: #000;
        }
    }
    .normal-inputs{
        width: 100%;
        height: 100px;
        border-radius: 4px;
        box-shadow: 0 0 4px #ddd;
        border: 2px solid #ddd;
        margin:0 auto;
        input{
            width: 100%;
            height: 100%;
            color: #000;
            padding-left:10px;
        }
        .left{
            border-right: 1px solid #eee;
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
        margin-top:40px;
    }
    .grey{
        background: #ddd;
    }
    .tips{
        margin-top:20px;
    }
}
</style>
