<!--- 常旅弹窗选择模块 --->
<template>
    <div>
        <div class="add-passenger bg ">
            <div class="pd10 add-passenger-list">
                <div class="add-passenger-box white-bg radius10">
                    <p class="c f16 add-el" @click='addPassenger'><span class=" ifont more-add-icon  c  mr10 f18">&#xe91a;</span><span>{{$t('添加乘客')}}</span></p>
                    <ul class="add-passenger-scroll">
                        <li v-for='(item,index) in addPassengerList' :key='"base-"+index' class="fbox border-top">
                            <p class="ifont  f20 c add-passenger-select" :class="{selected:item.isSelected}" @click='select(item)'></p>
                            <dl class="flex1" @click='select(item)'>
                                <dt class="f16 textDot add-name">{{item.passengerName}}</dt>
                                <dd class="gray line-font ">{{$t('证件号')}}：{{item.certificateNo}}</dd>
                            </dl>
                            <p class="ifont f18 c add-passenger-edit" @click="edit(item)">&#xe900;</p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="white-bg pd10 passenger-btn-box">
            <button class="confirm-passenger" @click='addSelect'>{{$t('确认选择')}}</button>
        </div>
    </div>
</template>
<script>
import { deepCopy } from '@/libs/util'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            chooseList: [],
            addPassengerList: []
        }
    },
    props: ['passengerList', 'maxDueNumber', 'entry', 'scheduleDetailId'],
    mounted() {
        // 因为不能联动，所以这里的选择数据不能直接赋值，不然会直接指向原数据，发生改变，外面会跟着改变
        // this.addPassengerList = deepCopy(this.passengerList)
    },
    watch: {
        passengerList: {
            handler(val, older) {
                console.log(666)
                console.log(val)
                this.addPassengerList = deepCopy(val)
            },
            deep: true,
            immediate: true
        },
        newPassengerId(val) {
            if (!val) {
                this.addPassengerList.forEach(item => {
                    if (item.id === val && this.maxDueNumber <= this.currentNum + 1) {
                        item.isSelected = true
                    }
                })
            }
        }
    },
    computed: {
        ...mapState(['newPassenger', 'scheduleInfo']),
        // 当前选中的 人数
        currentNum() {
            return this.dealSelectedList.length
        },
        // 处理当前选中的数据
        dealSelectedList() {
            // let m = 0
            return this.addPassengerList.reduce((pre, cur) => {
                if (cur.isSelected) {
                    pre.push(cur)
                }
                return pre
            }, [])
        }
    },
    methods: {
        add() { },
        // 选中操作
        select(item) {
            if (this.currentNum === 0) {
                item.isSelected = !item.isSelected
                return
            }

            if (this.maxDueNumber === 1) {
                // console.log(222)
                // if (item.cardType === 1) {
                let oneHasd = false
                this.dealSelectedList.forEach(arr => {
                    if (arr.id === item.id) {
                        arr.isSelected = !item.isSelected
                    } else {
                        arr.isSelected = false
                    }
                })
                if (!oneHasd) {
                    item.isSelected = !item.isSelected
                }
                // }
                return
            }
            // 判断是否已经存在已经存在的话改变选择项，不
            let hasd = false

            this.dealSelectedList.reduce((pre, cur, index) => {
                if (cur.cardType === 1 && cur.id === item.id) {
                    hasd = true
                    item.isSelected = !item.isSelected
                }
            }, [])

            if (!hasd) {
                //  {
                if (this.currentNum >= this.maxDueNumber && !item.isSelected) {
                    this.$alert({
                        txt: this.$t('最多可以添加') + this.maxDueNumber + this.$t('名乘客')
                    })
                    return
                }
                item.isSelected = !item.isSelected
            }
        },
        addSelect() {
            if (this.dealSelectedList.length === 0) {
                this.$emit('selectFromAdd', [], true)
            } else {
                this.$emit('selectFromAdd', this.dealSelectedList, true)
            }
        },
        addPassenger() {
            this.$router.push({
                // name: 'edit-passenger',
                name: 'addPsger',
                query: {
                    type: 2,
                    scheduleDetailId: this.scheduleDetailId
                }
            })
        },
        edit(item) {
            this.$router.push({
                // name: 'edit-passenger',
                name: 'addPsger',
                query: {
                    type: 1,
                    ...item,
                    scheduleDetailId: this.scheduleDetailId
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/book/passenger-more.less';
</style>
