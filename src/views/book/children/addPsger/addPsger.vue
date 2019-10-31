<template>
    <div class="psg-box full-page">
        <div class="psg-type">
            <p class="type-name">Type：</p>
            <md-field>
                <md-field-item title=""  solid>
                    <md-radio :label="item.name" :name="item.name" v-model="psgType" inline  v-for="(item) in DownLists" :key="item.name"/>
                    <!-- <md-radio name="男人" v-model="psgType" label="男人" inline />
                    <md-radio name="女人" v-model="psgType" label="女人" inline />
                    <md-radio name="和尚" v-model="psgType" label="和尚" inline />
                    <md-radio name="小孩" v-model="psgType" label="小孩" inline /> -->
                </md-field-item>
            </md-field>
        </div>
        <div class="psg-name fbox">
            <!-- <div class="left-decortation border-bottom">
                <DownSlider @selDown="selDown" :psgType="psgType" :list='DownList'></DownSlider>
            </div> -->
            <div class="right-name flex1 border-bottom">
                 <md-input-item
                    ref="input"
                    v-model="name"
                    :title="$t('姓名')"
                    :placeholder="$t('姓名')"
                    @blur="writeDone"
                    clearable
                ></md-input-item>
                <!-- <md-input-item
                    ref="input"
                    v-model="nameB"
                    :placeholder="$t('名')"
                    clearable
                ></md-input-item> -->
            </div>
        </div>
        <div class="psg-phone border-bottom fbox">
            <div class="left-input " style="display:none">
                <intelInpu :countryCode='countryCode' @getback="getback"></intelInpu>
            </div>
            <div class="flex1">
                <md-input-item
                    :title="$t('手机号码')"
                    v-model="phone"
                    :error="errorPhone"
                    :placeholder="$t('手机号码')"
                    @blur="changePhone"
                >
                </md-input-item>
            </div>
        </div>
        <div class="psg-id border-bottom">
            <md-input-item
                :title="$t('证件号')"
                v-model="Id"
                :placeholder="$t('证件号')"
                :error="errorId"
                @blur="changeId"
            ></md-input-item>
        </div>
        <div class="tips" @click="showTips">
            {{$t('会员说明：（会员价说明）')}} <a href="javascript:;">{{$t('详情')}}</a>
        </div>
        <div class="bt-padding"></div>

        <div class="bt-btn red" :class="{'grey': !canSub}" @click="submitMsg">
             {{$t('提交')}}
        </div>
    </div>
</template>

<script>
import { Icon, Radio, Field, FieldItem, InputItem } from 'mand-mobile'
// import { mapState } from 'vuex'
// import DownSlider from '../../component/downSlider'
import api from '@/config/api'
import intelInpu from '@/views/login/components/index'
import { isEmpty, getStore } from '@/libs/util'
export default {
    name: 'addPsger',
    data() {
        return {
            countryCode: 'cn',
            phoneAreaCode: '86',
            psgType: '',
            errorPhone: '',
            errorId: '',
            phone: '',
            Id: '',
            name: '',
            canSub: false,
            // nameB: '',
            DownLists: [],
            type: 2 // 2 添加 1 更新修改
        }
    },
    watch: {
        psgType(newValue, oldValue) {
            if (this.phone && newValue && this.name) {
                this.canSub = true
            } else {
                this.canSub = false
            }
        },
        phone(v) {
            if (v && this.psgType && this.name) {
                this.canSub = true
            } else {
                this.canSub = false
            }
        },
        // Id(v) {
        //     if (this.phone && v && this.psgType && this.name) {
        //         this.canSub = true
        //     } else {
        //         this.canSub = false
        //     }
        // },
        name(v) {
            if (this.phone && this.psgType && v) {
                this.canSub = true
            } else {
                this.canSub = false
            }
        }
    },
    mounted() {
        this.phoneAreaCode = getStore('phoneAreaCode')
        let query = this.$route.query
        if (query.type === 1 || query.type === '1') {
            // let typeName = this.DownList.filter(item => parseInt(item.id) === parseInt(query.passengerType))
            this.phone = query.phone
            // this.phone = (query.phone).indexOf(')') >= 0 ? query.phone.split(')')[1] : query.phone
            // this.phoneAreaCode = (query.phone).indexOf(')') >= 0 ? (query.phone.split(')')[0]).split('(')[1] : '86'
            this.Id = query.certificateNo
            this.psgType = '男人' // typeName[0].value
            this.name = query.passengerName
            console.log(this.phone, this.Id, this.psgType, this.name)
        }
        this.psgType = '男人'
        this.getTypeList()
    },
    components: {
        [Icon.name]: Icon,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [InputItem.name]: InputItem,
        [Radio.name]: Radio,
        // DownSlider,
        intelInpu
    },
    methods: {
        getTypeList() {
            this.fetch({
                url: api.passengerType,
                method: 'POST',
                data: {}
            }, {
                name: 'book',
                query: { ...this.$route.query }
            })
                .then((result) => {
                    if (result.code === '200' && !isEmpty(result.data)) {
                        this.DownLists = result.data
                        this.psgType = this.DownLists[0]['name']
                        console.log(this.DownLists)
                    }
                })
        },
        goback() {
            this.$router.go(-1)
        },
        getback(val) {
            this.phoneAreaCode = val.dialCode
        },
        submitMsg() {
            if (!this.canSub) {
                return
            }
            // && this.Id
            if (this.phone && this.psgType && this.name) {
                let that = this
                let typeId = this.DownLists.find(item => {
                    if (item.name === that.psgType) {
                        return item
                    }
                })
                this.type = this.$route.query.type
                // 2是添加 1 是更新
                let tmpUri = (this.type === '2' || this.type === 2) ? api.addPsger : (this.type === '1' || this.type === 1) ? api.updatePsger : ''
                // console.log(tmpUri)
                let params = (this.type === '2' || this.type === 2) ? {
                    passengerName: this.name,
                    phone: '(' + this.phoneAreaCode + ')' + this.phone,
                    passengerType: typeId.type,
                    passengerTypeId: typeId.id,
                    certificateNo: this.Id
                } : {
                    id: this.$route.query.id,
                    passengerName: this.name,
                    phone: this.phone,
                    passengerType: typeId.type,
                    passengerTypeId: typeId.id,
                    certificateNo: this.Id
                }
                this.fetch({
                    url: tmpUri,
                    method: 'POST',
                    data: params
                }, {
                    name: 'book',
                    query: { ...this.$route.query }
                })
                    .then((result) => {
                        if (result.code === '200') {
                            let id = result.data
                            this.$alert({
                                txt: this.$t('添加成功'),
                                okFn: () => {
                                    // 更新乘客
                                    this.$parent.ajaxPsgerWithResult(id)
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
                                txt: this.$t('未登录，请登录'),
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
                this.errorPhone = this.$t('请输入你的手机号')
                setTimeout(() => { this.errorPhone = '' }, 1000)
            } else {
                // let regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/
                if (!this.phone) {
                    this.errorPhone = this.$t('请输入你的手机号')
                    setTimeout(() => { this.errorPhone = '' }, 1000)
                }
            }
            this.writeDone()
        },
        writeDone() {
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
        changeId() {
            this.writeDone()
            // let regexp = /^\w+$/
            // if (!regexp.test(this.Id)) {
            //     this.errorId = this.$t('请输入正确id')
            //     setTimeout(() => { this.errorId = '' }, 1000)
            // }
        },
        showTips() {
            this.$router.push({
                name: 'detail',
                query: {
                    id: 1
                }
            })
        },
        selDown(item) {
            console.log(item)
            this.psgType = item.value
        }
    }
}
</script>
<style lang="less" >
    @import '~@/assets/styles/base.less';
    .md-field-item-control{
        margin-left:10px;
    }
   .md-input-item-fake,.md-input-item-input,.psg-name .md-field-item-content,.psg-phone .md-field-item-content,.psg-id .md-field-item-content{
        height: 120px!important;
        line-height: 120px!important;
        border:none!important;
    }
    .psg-type .md-field-item-control{
        border-bottom: none!important;
        border: none;
    }
    .psg-box{
        .md-field-item-title{
            flex-shrink: 0;
            margin-right: 0.2rem;
            font-size: 0.64rem;
            line-height: 1.2;
        }
    }
</style>

<style lang="less" scoped>
.psg-box{

    .left-input{
        width: 100px;
    }
    background: #fff;
    padding: 24px 27px 0;
    .psg-type{
        padding-bottom: 20px;
        .type-name{
            height: 48px;
            line-height: 48px;
            font-size: 32px;
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
    .psg-id{
        margin-top:10px;
    }
    .tips{
        height:84px;
        line-height: 84px;
        margin-top:20px;
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
        right:0;;
        z-index: 99;
    }
    .red{
        background: #ff6f61
    }
    .grey{
        background: #eee;
    }
    /deep/.md-input-item-fake,/deep/.md-input-item-input{
        height: 120px!important;
        line-height: 120px!important;
        border:none!important;
    }
    .psg-type /deep/.md-field-item-control{
        border-bottom: none!important;
        border: none;
    }
    .bt-padding{
        height: 300px;
    }
}
</style>
