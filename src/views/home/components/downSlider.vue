<template>
    <div class="down-slider" @click="showTitle">
        <div class="moren"><span>{{psgType}}</span>
            <md-icon
                :name="arrName"
                size="md"
            ></md-icon>
        </div>

        <div class="slider-bt" v-show="isShowTitile">
            <div class="item border-bottom" :class="{'selected': item.value === psgType }" v-for="(item, index) in list" :key="index" @click="selItem(item,index)">{{item.value}}&nbsp;<span>{{item.des}}</span></div>
        </div>
    </div>
</template>

<script>
import { Icon } from 'mand-mobile'
export default {
    name: 'downSlider',
    props: {
        psgType: {
            type: String,
            default: '1'
        },
        list: {
            type: Array
        },
        index: {
            type: Number
        }
    },
    components: {
        [Icon.name]: Icon
    },
    data() {
        return {
            isShowTitile: false,
            arrName: 'arrow-up'
        }
    },
    methods: {
        showTitle() {
            this.isShowTitile = !this.isShowTitile
            if (!this.isShowTitile) {
                this.arrName = 'arrow-up'
            } else {
                this.arrName = 'arrow-down'
            }
        },
        selItem(item, index) {
            this.$emit('selDown', item, this.index, index)
        }
    }
}
</script>

<style lang="less" scoped>
.down-slider{
    position: relative;
    i{
        position: absolute;
        right:20px;
        top:50%;
        transform: translateY(-50%);
        transition: all 1s ease;
    }
    .moren {
        span{
            padding-right: 20px;
        }
    }
    .slider-bt{
        position: absolute;
        top: 100%;
        width: 100%;
        background: #fff;
        z-index:99;
        border:2px solid #eee;
        transition: all 2s ease;
        .item{
            padding-left:10px;
            width: 100%;
            height: 120px;
            line-height: 120px;
        }
        .selected{
            color: #000;
            background: #f2b2ac;
            font-weight: bold;
        }
    }
}
</style>
