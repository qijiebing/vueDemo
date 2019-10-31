<template>
    <div>
        <div class="filter-base">
            <ul class="fbox fbtn" :class="{'active': showBox}">
                <li class="flex1" @click='showFilter(0)' :class="{'selected': curSelected.dptTimeSpan.length>0}">
                    <span class="point">{{$t('所有时间')}}</span>
                </li>
                <li class="flex1 lline" @click='showFilter(1)' :class="{'selected': curSelected.departStation.length>0 && curSelected.departStation[0]!=='全部车站'}">
                    <span class="point">{{$t('出发车站')}}</span>
                </li>
                <li class="flex1 lline" @click='showFilter(3)' :class="{'selected': curSelected.arriveStation.length>0 && curSelected.arriveStation[0]!=='全部车站' }">
                    <span class="point">{{$t('到达车站')}}</span>
                </li>
            </ul>
            <ul class="fbox fbtn" :class="{'active': showBox}">
                <li class="flex1 cancel" @click="hiddenBox">{{$t('取消')}}</li>
                <li class="flex1 ok" @click='filterConfirm'>{{$t('过滤')}}</li>
            </ul>
        </div>
        <div class="layer" style="background:transparent" v-if='showBox' @click="hiddenBox"></div>
        <section class="filters bg" :class="{'show':showBox}">
            <div class="fbox c filters-tit">
                <p class="flex1 c" :class="{'selected': filterType == 0}" @click='showFilter(0)'>{{$t('所有时间')}}</p>
                <p class="flex1 c" :class="{'selected': filterType == 1}" @click='showFilter(1)'>{{$t('出发车站')}}</p>
                <p class="flex1 c" :class="{'selected': filterType == 3}" @click='showFilter(3)'>{{$t('到达车站')}}</p>
            </div>
            <div class="filers-box pd10">
                <filter-time
                    v-if="filterType == 0"
                    :selectedTime='curSelected.dptTimeSpan'
                    @storeTime='storeFilter'
                ></filter-time>

                <filter-site
                    v-if="filterType == 1 || filterType == 3"
                    :desArr='filterCategory.arriveStation'
                    :depArr='filterCategory.departStation'
                    :selDpt='curSelected.departStation'
                    :selArr='curSelected.arriveStation'
                    :showType="filterType"
                    @storeSite='storeFilter'
                ></filter-site>

            </div>
        </section>
    </div>
</template>

<script>
// 如果把三个组件都放到一个里的话，其实也合并一个方法几个变量就完成了整个组件
import filterTime from './filter-time'
import filterSite from './filter-site'
import { deepCopy, isEmpty } from '@/libs/util'
export default {
    props: {
        filterCategory: {
            type: Object,
            default() {
                return {}
            }
        },
        indexSelected: {
            type: Object,
            default() {
                return {
                    dptTimeSpan: [],
                    departStation: [],
                    arriveStation: []
                }
            }
        }
    },
    data() {
        return {
            title: ['出发时段', '出发/到达', '高级筛选'],
            filterType: '',
            curSelected: {
                dptTimeSpan: [],
                departStation: [],
                arriveStation: []
            },
            showBox: false,
            // 保存上次选择的记录
            lastSelected: {
                dptTimeSpan: [],
                departStation: [],
                arriveStation: []
            },
            // 筛选项的基础数据格式化和类型定义
            baseFormat: {
                发车时段: {
                    type: 1,
                    keyName: 'dptTimeSpan',
                    isOnly: false
                },
                到达站: {
                    type: 2,
                    keyName: 'arriveStation',
                    isOnly: false
                },
                出发站: {
                    type: 2,
                    keyName: 'departStation',
                    isOnly: false
                }
            }
        }
    },
    components: { filterTime, filterSite },
    computed: {
    },
    watch: {
        indexSelected(n) {
            this.curSelected = n
            this.lastSelected = n
        }
    },
    methods: {
        // 接收选中的返回值
        storeFilter(val, type) {
            if (type === 'departStation' || type === 'arriveStation') {
                let tmpArr = []
                val.forEach((v, i) => {
                    if (v.isSelected === true && i !== 0) {
                        tmpArr.push(v.text)
                    }
                })
                this.curSelected[`${type}`] = tmpArr
            } else {
                this.curSelected[`${type}`] = val
            }
            // window.$tcevt('列表页', `LB-12`, `用户选择:${type}-${val||tmpArr}`)
        },
        // 点击确定时与老数据进行对比，发生变化时
        filterConfirm() {
            if (this.haschanged()) {
                console.log(this.curSelected)
                this.lastSelected = this.curSelected
                this.$emit('filterGetSchedule', this.curSelected)
            }
            this.showBox = false
        },
        // 判断新旧数据是否有改变
        haschanged() {
            let haschange = false
            for (let key in this.lastSelected) {
                if (this.lastSelected[key] !== this.curSelected[`${key}`]) {
                    haschange = true
                }
            }
            return haschange
        },
        // 取消选择，重置已选项，用上次覆盖
        hiddenBox() {
            this.showBox = false
            // 取消筛选时重置历史数据
            this.curSelected = this.lastSelected
            window.$tcevt('列表页', this.productType, `LB-12`)
        },
        // 展示筛选框和筛选的内容
        showFilter(type) {
            if (isEmpty(this.filterCategory)) {
                this.$alert('没有筛选数据，请稍后重试')
                return false
            }

            if (!this.showBox) {
                this.lastSelected = deepCopy(this.curSelected)
                this.showBox = true
            }

            this.filterType = type
            window.$tcevt('列表页', this.productType, `LB-0${8 + Number(type)}`)
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/list/filter.less';
</style>
