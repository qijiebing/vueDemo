<!--- 基本模板 --->
<template>
    <div>
        <div class="layer" v-if='showLayer' @click='close'></div>
        <div class="vertical-slider white-bg" :class="{'show':move}">
            <div class=" c  title" v-if='title'>
                <p class=" f20">{{title}}</p>
                <span class="close c ifont light-gray f16" @click='close' v-if='hasClose'>&#xe91c;</span>
            </div>
            <div class="title" v-else>
                <slot name="header"></slot>
                <span class="close c ifont light-gray f16" @click='close' v-if='hasClose'>&#xe91c;</span>
            </div>
            <div class="solt-box">
                <slot v-if='showlot'></slot>
            </div>

        </div>
    </div>
</template>
<script>
import { setTimeout } from 'timers'
export default {
    data() {
        return {
            move: false,
            showLayer: false,
            showlot: false
        }
    },
    // props: ['isShow', 'title', 'closeFromFather', 'hasClose'],
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        closeFromFather: {
            type: Boolean,
            default: false
        },
        hasClose: {
            type: Boolean,
            default: true
        }
    },
    created() {
        setTimeout(() => {
            this.showlot = true
            this.move = this.isShow
            this.showLayer = true
        }, 10)
    },
    components: {},
    computed: {},
    watch: {
        isShow(val) {
            if (val) {
                this.showLayer = true
                this.showlot = true
                setTimeout(() => {
                    this.move = this.isShow
                }, 10)
            } else {
                this.move = false
                setTimeout(() => {
                    this.showlot = false
                    this.showLayer = false
                }, 10)
            }
            // this.closeFromFather = false
        },
        closeFromFather(val) {
            // if (val) {
            this.close()
            // }
        }
    },
    methods: {
        close() {
            this.move = false
            setTimeout(() => {
                this.$emit('hiddenSlider')
            }, 210)
        }
    }
}
</script>
<style lang="less" scoped>
@import './vertical-slider.less';
</style>
