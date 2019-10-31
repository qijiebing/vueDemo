<template>
    <div class="full-page new-card">
        <!-- <div>合作/形象展示</div> -->
        <div>
            <md-field title="Name On Card：">
                <md-input-item
                    type="text"
                    v-model="nameOnCard"
                    placeholder="Name On Card (Must fill in)"
                    is-highlight
                    clearable
                >
                </md-input-item>
            </md-field>
            <md-field title="Card Number：">
                <md-input-item
                    type="bankCard"
                    v-model="cardNo"
                    placeholder="16 digits (Must fill in)"
                    is-highlight
                    clearable
                    is-virtual-keyboard
                    maxlength='16'
                >
                </md-input-item>
            </md-field>
            <md-field title="Expiry Date：">
                <div class="fbox">
                    <div class="flex1 border-bottom data-box">
                        <DropDown @selDown="onSelectorMonthChoose" placeholder="Month" :selectedValue='selectorMonthValue' :list='monthData'></DropDown>
                    </div>
                    <div class="flex1 border-bottom data-box">
                        <DropDown @selDown="onSelectorYearChoose" placeholder="Year" :selectedValue='selectorYearValue' :list='yearData'></DropDown>
                    </div>
                </div>
            </md-field>
            <md-field title="CVC：">
                <md-input-item
                    type="password"
                    v-model="cvc"
                    placeholder="3 digits (Must fill in)"
                    is-highlight
                    clearable
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
                    I agree on <span style="color:#179AFF;text-decoration:underline;" >XXXXXXX</span>.
                </md-agree>
                <br>
                <md-button :type="agreeConf.payBtnType" @click="bindCard" round>
                    <md-activity-indicator
                        v-if="agreeConf.payLoading"
                        class="md-activity-indicator-css"
                        type="carousel"
                        color="#fff"
                        :size="15"
                        text-color="#fff"
                    ></md-activity-indicator>
                    <span v-else>Commit</span>
                </md-button>
            </div>
    </div>
</template>

<script>
import { InputItem, Field, FieldItem, Agree, Button, ActivityIndicator, Toast } from 'mand-mobile'
import api from '../../../../config/api'
import DropDown from '../../../payment/component/dropDown'
import { setTimeout } from 'timers'
let Omise = window.Omise
export default {
    name: 'addCard',
    components: {
        [InputItem.name]: InputItem,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Agree.name]: Agree,
        [ActivityIndicator.name]: ActivityIndicator,
        [Toast.name]: Toast,
        [Button.name]: Button,
        DropDown
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                Omise.setPublicKey('pkey_5e94iuanb7sd1fgsv92')
            })
        }, 200)
    },
    data() {
        return {
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
            selectorYearValue: ''
        }
    },
    created() {
        // 初始化yearData
        this.initYearData()
    },
    methods: {
        goback() {
            this.$router.go(-1)
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
        onChange(name, checked) {
            console.log(`agree name = ${name} is ${checked ? 'checked' : 'unchecked'}`)
            if (checked) {
                this.agreeConf.payBtnType = 'warning'
            } else {
                this.agreeConf.payBtnType = 'disabled'
            }
        },
        // 绑卡
        bindCard() {
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
                var card = {
                    'name': this.nameOnCard,
                    'number': this.cardNo,
                    'expiration_month': this.selectorMonthValue,
                    'expiration_year': this.selectorYearValue,
                    'security_code': this.cvc
                }
                // 获取token
                let that = this
                Omise.createToken('card', card, function(statusCode, response) {
                    if (statusCode === 200 && response.object === 'token') {
                        let tokenId = response.id
                        // 绑卡
                        that.fetch({
                            url: api.bindCard,
                            method: 'POST',
                            data: {
                                tokenId: tokenId
                            }
                        }).then(res => {
                            if (res.code === '200') {
                                that.agreeConf.payLoading = false
                                Toast.succeed('Added Successfully', 2000)
                                // 返回列表页, 并刷新卡列表
                                that.$parent.loadCardList()
                                setTimeout(that.goback(), 2000)
                            } else {
                                that.$alert({
                                    txt: res.msg
                                })
                            }
                        })
                    } else {
                        that.agreeConf.payLoading = false
                        that.$alert({
                            txt: response.message
                        })
                    }
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.new-card{
    height: 100%;
    background-color:white;
    .payAgree{
        padding: 27px 27px 6px 27px;
    }
}
</style>
