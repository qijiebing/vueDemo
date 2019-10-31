<template>
    <div class="down-slider" @click="showDropDown">
        <div class="moren fbox">
            <span class="flex1" style="text-align:center">{{selectedValue}}</span>
            <span class="flex1" style="color: #C8CDD7;">{{placeholder}}</span>
            <md-icon
                :name="arrName"
                size="md"
            ></md-icon>
        </div>

        <div class="slider-bt" v-show="isShowDropDown">
            <div class="item border-bottom" :class="{'selected': item.value === selectedValue }" v-for="(item, index) in list" :key="index" @click="selItem(item)">{{item.value}}</div>
        </div>
    </div>
</template>

<script>
import { Icon } from 'mand-mobile'
export default {
    name: 'dropDown',
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        selectedValue: {
            type: String,
            default: ''
        },
        list: {
            type: Array
        }
    },
    components: {
        [Icon.name]: Icon
    },
    data() {
        return {
            isShowDropDown: false,
            arrName: 'arrow-down'
        }
    },
    methods: {
        showDropDown() {
            this.isShowDropDown = !this.isShowDropDown
            if (!this.isShowDropDown) {
                this.arrName = 'arrow-down'
            } else {
                this.arrName = 'arrow-up'
            }
        },
        selItem(item) {
            this.$emit('selDown', item)
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
        top: 120px;
        width: 100%;
        overflow-y: scroll;
        max-height: 720px;
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

<style lang="less">
.md-agree-icon .md-agree-icon-container .md-icon.md-icon-check{
    color: #111a34
}
.md-agree-icon{
    color: #111a34
}
.md-agree-icon.checked .md-agree-icon-container .md-icon-checked{
    color: #111a34
}

</style>
