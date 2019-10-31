<!--- 基本模板 --->
<template>
    <div class="flist">
        <div class="fmain">
            <div class="grid fbox border-bottom" v-for='(item, index) in timeList' :key='index' @click='select(item, index)'>
                <p class="md-icon-check icon-font md-icon" :class="{'md-icon-checked': item.isSelected}"></p><p class="box time-box flex1" :class="{'selected': item.isSelected}" v-html="item.text"></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            timeList: [
                { key: 0, text: `${this.$t('不限')}`, isSelected: true },
                { key: 1, text: `${this.$t('凌晨出发')}<span class="list-filter-time">(00:00-6:00)</span>`, isSelected: false },
                { key: 2, text: `${this.$t('上午出发')}<span class="list-filter-time">(6:00-12:00)</span>`, isSelected: false },
                { key: 3, text: `${this.$t('下午出发')}<span class="list-filter-time">(12:00-18:00)</span>`, isSelected: false },
                { key: 4, text: `${this.$t('晚上出发')}<span class="list-filter-time">(18:00-24:00)</span>`, isSelected: false }
            ],
            timeSelect: []
        }
    },
    props: ['times', 'selectedTime'],
    watch: {
        selectedTime: {
            handler(val, older) {
                this.timeList = this.timeList.map(item => {
                    if (val.includes(item.key)) {
                        item.isSelected = true
                    }
                    return item
                })
                if (!!val && val.length > 0) {
                    this.timeList[0].isSelected = false
                }
            },
            immediate: true
        }
    },
    methods: {
        select(item, index) {
            if (index === 0) {
                this.timeSelect = []
                this.timeList.forEach((v, i) => {
                    v.isSelected = (i === 0)
                })
                // this.$set(this.timeList, 0, tmpItem)
            } else {
                // let tmpItem = { ...item, isSelected: !item.isSelected }
                // this.$set(this.timeList, index, tmpItem)
                this.timeList[index].isSelected = !item.isSelected

                if (this.timeSelect.includes(item.key)) {
                    this.timeSelect = this.timeSelect.filter(arr => arr !== item.key)
                } else {
                    this.timeSelect.push(item.key)
                }
                if (this.timeSelect.length > 0) {
                    // let tmpItem = { ...this.timeList[0], isSelected: false }
                    // this.$set(this.timeList, 0, tmpItem)
                    this.timeList[0].isSelected = false
                }
            }
            let selArrs = this.timeList.filter((v, i) => {
                return i !== 0 && v.isSelected
            })
            if (selArrs.length === 0) {
                this.timeList[0].isSelected = true
                this.timeSelect = []
            }
            this.$emit('storeTime', this.timeSelect, 'dptTimeSpan')
        }
        // 同步提示示例
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/list/filter.less';
</style>
