<!--- 基本模板 --->
<template>
    <div class="flist">
        <template v-if="showType == 1">
            <div class="fmain">
                <div class="grid fbox border-bottom" v-for='(item, index) in departStation' :key='index' @click='choose(item, index)'>
                    <p class="md-icon-check icon-font md-icon" :class="{'md-icon-checked': item.isSelected}"></p><p class="box textDot" :class="{'selected': item.isSelected}">{{$t(item.text)}}</p>
                </div>
            </div>
        </template>
        <template v-if="showType == 3">
            <div class="fmain">
                <div class="grid fbox border-bottom" v-for='(item, index) in arriveStation' :key='index' @click='choose(item, index)'>
                    <p class="md-icon-check icon-font md-icon" :class="{'md-icon-checked': item.isSelected}"></p><p class="box textDot" :class="{'selected': item.isSelected}">{{$t(item.text)}}</p>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    data() {
        return {
            departStation: [],
            arriveStation: []
        }
    },
    mounted() {
        this.departStation = this.depShowList()
        this.arriveStation = this.desShowList()

        this.departStation = this.departStation.map(item => {
            if (this.selDpt.includes(item.text)) {
                item.isSelected = true
            }
            return item
        })
        if (!!this.selDpt && this.selDpt.length > 0) {
            this.departStation[0].isSelected = false
        }

        this.arriveStation = this.arriveStation.map(item => {
            if (this.selArr.includes(item.text)) {
                item.isSelected = true
            }
            return item
        })
        if (!!this.selArr && this.selArr.length > 0) {
            this.arriveStation[0].isSelected = false
        }
    },
    props: {
        depArr: {
            type: Array,
            default() {
                return []
            }
        },
        desArr: {
            type: Array,
            default() {
                return []
            }
        },
        selDpt: {
            type: Array,
            default() {
                return []
            }
        },
        selArr: {
            type: Array,
            default() {
                return []
            }
        },
        selectedDep: {
            type: String,
            default: ''
        },
        selectedArr: {
            type: String,
            default: ''
        },
        showType: {
            type: Number,
            default: 1
        }
    },
    watch: {
        selDpt: {
            handler(val, older) {
                if (this.departStation.length === 0) return
                this.departStation = this.departStation.map(item => {
                    if (val.includes(item.text)) {
                        item.isSelected = true
                    }
                    return item
                })
                if (!!val && val.length > 0 && (val.length === 1 && val[0] !== '全部车站')) {
                    this.departStation[0].isSelected = false
                }
            },
            immediate: true
        },
        selArr: {
            handler(val, older) {
                if (this.arriveStation.length === 0) return
                this.arriveStation = this.arriveStation.map(item => {
                    if (val.includes(item.text)) {
                        item.isSelected = true
                    }
                    return item
                })
                if (!!val && val.length > 0 && (val.length === 1 && val[0] !== '全部车站')) {
                    this.arriveStation[0].isSelected = false
                }
            },
            immediate: true
        }
    },
    methods: {
        depShowList() {
            let tmpArr = []
            this.depArr.forEach((val, i) => {
                tmpArr.push({
                    key: i + 1,
                    keyName: 'departStation',
                    text: val.name,
                    isSelected: false
                })
            })
            tmpArr.unshift({ key: 0, departStation: 'departStation', text: '全部车站', isSelected: true })
            return tmpArr
        },
        desShowList() {
            let tmpArr = []
            this.desArr.forEach((val, i) => {
                tmpArr.push({
                    key: i + 1,
                    keyName: 'arriveStation',
                    text: val.name,
                    isSelected: false
                })
            })
            tmpArr.unshift({ key: 0, desStation: 'desStation', text: '全部车站', isSelected: true })
            return tmpArr
        },
        choose(item, index) {
            if (this.showType === 1) {
                if (index === 0) {
                    this.departStation.forEach((v, i) => {
                        v.isSelected = (i === 0)
                    })
                } else {
                    this.departStation[index].isSelected = !item.isSelected
                    let selectedArr = this.departStation.filter(v => v.isSelected === true)
                    if (selectedArr.length > 0) {
                        this.departStation[0].isSelected = false
                    }
                }

                let selArrs = this.departStation.filter((v, i) => {
                    return i !== 0 && v.isSelected
                })
                if (selArrs.length === 0) {
                    this.departStation[0].isSelected = true
                }
                this.$emit('storeSite', this.departStation, 'departStation')
            } else if (this.showType === 3) {
                if (index === 0) {
                    this.arriveStation.forEach((v, i) => {
                        v.isSelected = (i === 0)
                    })
                } else {
                    this.arriveStation[index].isSelected = !item.isSelected
                    let selectedArr = this.arriveStation.filter(v => v.isSelected === true)
                    if (selectedArr.length > 0) {
                        this.arriveStation[0].isSelected = false
                    }
                }
            }
            // 全部选 默认全部车站勾选
            let selArrs = this.arriveStation.filter((v, i) => {
                return i !== 0 && v.isSelected
            })
            if (selArrs.length === 0) {
                this.arriveStation[0].isSelected = true
            }
            this.$emit('storeSite', this.arriveStation, 'arriveStation')
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/list/filter.less';
</style>
