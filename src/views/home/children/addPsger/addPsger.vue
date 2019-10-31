<template>
    <div class="psg-box full-page">
        <div class="psg-type border-bottom">
            <p class="type-name">Type：</p>
            <md-field>
                <md-field-item title=""  solid>
                    <md-radio name="Mr" v-model="psgType" label="Men" inline />
                    <md-radio name="Mrs" v-model="psgType" label="Ladies" inline />
                    <md-radio name="Miss" v-model="psgType" label="Monk" inline />
                    <md-radio name="dear" v-model="psgType" label="children" inline />
                </md-field-item>
            </md-field>
        </div>
        <div class="psg-name fbox">
            <div class="left-decortation border-bottom">
                <!-- 下拉组件 -->
                <DownSlider @selDown="selDown" :psgType="psgType" :list='DownList'></DownSlider>
            </div>
            <div class="right-name flex1 border-bottom">
                 <md-input-item
                    ref="input"
                    v-model="name"
                    placeholder="Name(Must fill in)"
                    clearable
                ></md-input-item>
            </div>
        </div>
        <div class="psg-phone border-bottom">
            <md-input-item
                title="Phone"
                v-model="phone"
                :error="errorPhone"
                placeholder="Must fill in"
                @blur="changePhone"
            ></md-input-item>
        </div>
        <div class="psg-id border-bottom">
            <md-input-item
                title="ID/Passport"
                v-model="Id"
                placeholder=""
                :error="errorId"
                @blur="changeId"
            ></md-input-item>
        </div>
        <div class="tips" @click="showTips">
            会员说明：（会员价说明） <a href="javascript:;">Details</a>
        </div>

        <div class="bt-btn red" @click="submitMsg">
            Submit
        </div>
    </div>
</template>

<script>
import { Icon, Radio, Field, FieldItem, InputItem } from 'mand-mobile'
// import { mapState, mapMutations } from 'vuex'
import DownSlider from '../../component/downSlider'
import api from '@/config/api'
// import { isEmpty } from '@/libs/util'
export default {
    name: 'addPsger',
    data() {
        return {
            psgType: 'Mr',
            errorPhone: '',
            errorId: '',
            phone: '',
            Id: '',
            name: '',
            DownList: [
                {
                    id: 0,
                    value: 'Mr'
                },
                {
                    id: 1,
                    value: 'Mrs'
                },
                {
                    id: 3,
                    value: 'Miss'
                }
            ],
            type: 2 // 2 添加 1 更新修改
        }
    },
    watch: {
        psgType(newValue, oldValue) {
            console.log(newValue)
        }
    },
    mounted() {
        let query = this.$route.query
        if (query.type === 1 || query.type === '1') {
            let typeName = this.DownList.filter(item => parseInt(item.id) === parseInt(query.passengerType))
            console.log(typeName)
            this.phone = query.phone
            this.Id = query.certificateNo
            this.psgType = typeName[0].value
            this.name = query.passengerName
            console.log(this.phone, this.Id, this.psgType, this.name)
        }
    },
    components: {
        [Icon.name]: Icon,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [InputItem.name]: InputItem,
        [Radio.name]: Radio,
        DownSlider
    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        submitMsg() {
            if (this.phone && this.Id && this.psgType && this.name) {
                let that = this
                let typeId = this.DownList.find(item => {
                    if (item.value === that.psgType) {
                        return item
                    }
                })
                this.type = this.$route.query.type
                let tmpUri = (this.type === '2' || this.type === 2) ? api.addPsger : (this.type === '1' || this.type === 1) ? api.updatePsger : ''
                // console.log(tmpUri)
                let params = (this.type === '2' || this.type === 2) ? {
                    passengerName: this.name,
                    phone: this.phone,
                    passengerType: typeId.id,
                    certificateNo: this.Id
                } : {
                    id: this.$route.query.id,
                    passengerName: this.name,
                    phone: this.phone,
                    passengerType: typeId.id,
                    certificateNo: this.Id
                }
                this.fetch({
                    url: tmpUri,
                    method: 'POST',
                    data: params
                })
                    .then((result) => {
                        if (result.code === '200') {
                            this.$alert({
                                txt: this.$t('添加成功'),
                                okFn: () => {
                                    // 更新乘客
                                    this.$parent.ajaxPsger()
                                    this.$router.replace({
                                        name: 'book',
                                        query: {
                                            scheduleDetailId: this.$route.query.scheduleDetailId
                                        }
                                    })
                                }
                            })
                        } else if (result.code === '50007') {
                            this.$alert({
                                txt: this.$t('获取数据失败，请重新选择班次！'),
                                okFn: () => {
                                    this.$router.replace({
                                        name: 'login',
                                        query: {
                                            goTo: 'book',
                                            scheduleDetailId: this.$route.query.scheduleDetailId
                                        }
                                    })
                                }
                            })
                        } else {
                            this.$alert({
                                txt: this.$t('添加失败，请重试')
                            })
                        }
                    })
                    .catch(e => {
                        this.$alert({
                            txt: this.$t('添加失败，请重试')
                        })
                    })
            }
        },
        changePhone() {
            if (!this.phone) {
                this.errorPhone = this.$t('请填写手机号码')
                setTimeout(() => { this.errorPhone = '' }, 1000)
            } else {
                // let regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/
                if (!this.phone) {
                    this.errorPhone = this.$t('请输入正确的手机号码!')
                    setTimeout(() => { this.errorPhone = '' }, 1000)
                }
            }
        },
        changeId() {
            let regexp = /^\w+$/
            if (!regexp.test(this.Id)) {
                this.errorId = this.$t('请输入正确id!')
                setTimeout(() => { this.errorId = '' }, 1000)
            }
        },
        showTips() {
            this.$desc({
                txt: '..',
                okBtn: 'Ok'
            })
        },
        selDown(item) {
            console.log(item)
            this.psgType = item.value
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.psg-box{
    background: #fff;
    padding: 24px 27px 0;
    .psg-type{
        padding-bottom: 20px;
        .type-name{
            height: 48px;
            line-height: 48px;
            font-size: 28px;
        }
        .md-field{
            padding: 0;
            border: none;
            background-color: transparent;
        }
        /deep/.md-field-item-content{
            padding-top: 0!important;
            padding-bottom: 0!important;
        }
    }
    .psg-name{
        width: 100%;
        height: 120px;
        font-size: 28px;
        .left-decortation{
            width: 216px;
            line-height: 120px;
            text-indent: 10px;
            margin-right: 40px;
            position: relative;
            .slider-bt{
                position: absolute;
                top: 120px;
                width: 100%;
                background: #fff;
                z-index:99;
                border:2px solid #fff;
                .item{
                    width: 100%;
                    height: 60px;
                    line-height: 60px;
                }
            }
        }
        .md-input-item{
            height: 120px;
            line-height: 120px;
        }
    }
    .psg-phone,.psg-id{
        width: 100%;
        height: 120px;
        font-size: 28px;
        input{
            padding-left:10px;
        }
    }
    .tips{
        height:84px;
        line-height: 84px;
    }
    .bt-btn{
        width: 696px;
        height: 94px;
        font-size:36px;
        line-height: 94px;
        border-radius: 72px;
        background-color: #c0c5d1;
        box-sizing: border-box;
        font-family: '方正兰亭黑简体';
        color: #ffffff;
        text-align: center;
        position: fixed;
        bottom: 24px;
        left:50%;
        transform: translateX(-50%);
        right:0;
    }
    .red{
        background: #ff6f61
    }
    /deep/.md-input-item-fake,/deep/.md-input-item-input,/deep/.md-field-item-content{
        height: 120px!important;
        line-height: 120px!important;
        border:none!important;
    }
    .psg-type /deep/.md-field-item-control{
        border-bottom: none!important;
        border: none;
    }
}
</style>
