<template>
    <div class="card-table">
        <div class="item" v-for="(item, index) in list" :key="index" @click="selCard(item)">
            <div class="card-info">
                <div class="bank textDot">{{item.bank}}</div>
                <div class="brief">
                    <span>Credit Card</span>
                    <span class="lastDigit">******{{item.lastDigits}}</span>
                    <span>
                        <img v-if="item.brand=='Visa'" src="../../../assets/img/payment/visa.png" alt="">
                        <img v-else-if="item.brand=='MasterCard'" src="../../../assets/img/payment/master-card.png" alt="">
                        <!-- <img v-else-if="item.brand=='JCB'" src="../../../assets/img/payment/jcb.png" alt=""> -->
                        <img v-else-if="item.brand=='AmericanExpress'" src="../../../assets/img/payment/american-express.png" alt="">
                        <img v-else src="" alt="">
                    </span>
                </div>
            </div>
            <div class="card-radio">
                <md-radio :name="item.cardId" v-model="selectedCardId"/>
            </div>
        </div>
    </div>
</template>

<script>
import { Radio } from 'mand-mobile'
export default {
    name: 'cardTable',
    props: {
        list: {
            type: Array
        }
    },
    components: {
        [Radio.name]: Radio
    },
    data() {
        return {
            selectedCardId: ''
        }
    },
    methods: {
        selCard(item) {
            this.selectedCardId = item.cardId
            this.$emit('selCard', this.selectedCardId)
        }
    },
    watch: {
        list(newValue, oldValue) {
            // 默认选中第一个
            if (newValue.length > 0) {
                this.selCard(newValue[0])
            }
        }
    }
}
</script>

<style lang="less" scoped>
.card-table{
    padding: 6px 27px 20px 27px;
    .item{
        margin-bottom:24px;
        width: 100%;
        height: 144px;
        border:1px solid #e4e4e4;
        background-color: white;
        box-sizing: border-box;;
        border-radius:12px;
        box-shadow:#E8EBF0 1.6px 1.3px 1.4px 4px;
        display: flex;
        img{
            height: 45px;
            margin-bottom:-10px;
        }
        .card-info{
            width: 92%;
            padding: 25px 0px 0 25px;
            .bank{
                font-weight: bold;
                padding-bottom: 25px;
            }
            .brief{
                .lastDigit{
                     padding:0px 35px 0px 35px;
                }
            }
        }
        .card-radio{
            padding-top:40px;
        }
    }
    .selected{
        color: #000;
        background: #f2b2ac;
        font-weight: bold;
    }
}
</style>
<style lang="less">
.md-radio .md-radio-icon .md-icon{
    color: #111a34;
}
</style>
