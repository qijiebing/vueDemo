<template>
    <div class="down-slider" @click="showTitle">
        <div class="moren fbox"><span class="textDot">{{psgType}}</span>
            <md-icon
                :name="arrName"
                size="md"
            ></md-icon>
        </div>

        <div class="slider-bt" v-show="isShowTitile">
            <div class="item border-bottom textDot" :class="{'selected': item.value === psgType }" v-for="(item, index) in list" :key="index" @click="selItem(item,index)">{{item.value}}&nbsp;<span>{{item.des}}</span></div>
        </div>
    </div>
</template>

<script>
import { Icon } from 'mand-mobile'
export default {
    name: 'DownSlider',
    props: {
        psgType: {
            type: String,
            default: ''
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
            arrName: 'arrow-down'
        }
    },
    methods: {
        showTitle() {
            this.isShowTitile = !this.isShowTitile
            if (!this.isShowTitile) {
                this.arrName = 'arrow-down'
            } else {
                this.arrName = 'arrow-up'
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
        top:48px;
        transform: translateY(-50%);
        transition: all 1s ease;
    }
    .moren {
        span{
            padding-right: 20px;
        }
    }
    .slider-bt{
        max-height: 490px;
        overflow: auto;
        -webkit-overflow-scrolling: scroll;
        position: relative;
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
            background: #c5e1f7;
            font-weight: bold;
        }
    }
}
</style>
