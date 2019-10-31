<template>
    <div class="date" :class="{'date-air': isShowTip}">
        <div class="banner border-bottom" v-if="title && isReturn">{{title}}</div>
        <div class="canlder-box fbox">
            <div class="list flex1" id="listBox">
                <div class="grid" v-for="son in dateArr" :key="son.day" @click="btnSelectDate(son)">
                    <div class="box" :class="{'selected': son.selected ,'disable-style': son.disableSel}">
                        <div class="center">{{son.text}}<br><span class="num">{{son.day.substr(5, 5)}}</span></div>
                    </div>
                </div>
            </div>
            <div class="btn" v-if="locale ==='en'" @click="btnOpenCalendar">{{$t('发车1')}}</div>
            <div class="btn" v-else @click="btnOpenCalendar">{{$t('发车日期')}}</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { formatDate } from '@/libs/util'
// isEmpty
export default {
    props: {
        isShowTip: {
            type: Boolean,
            default: false
        },
        urlData: {
            type: Object,
            default() {
                return {}
            }
        },
        isDpt: {
            type: Boolean
        },
        title: {
            type: String
        },
        isReturn: {
            type: Boolean
        }
    },
    data() {
        return {
            lockBeforeBtn: false,
            lockAfterBtn: false,
            domList: null,
            dateArr: [],
            disAbleDate: '',
            locale: ''
        }
    },
    computed: {
        ...mapState(['depDate', 'chooseDate', 'returnDate'])
    },
    mounted() {
        this.locale = window.locale
        if (this.urlData.isDpt === '0') {
            this.disAbleDate = this.urlData.departDate
        }
        this.domList = document.getElementById('listBox')

        this.funInitDate()
    },
    watch: {
        chooseDate(n, o) {
            if (n && n !== o) {
                this.funCheckDate()
            }
        }
    },
    methods: {
        ...mapMutations(['setData']),
        funInitDate() {
            let arr = []

            for (let i = 0; i <= 29; i++) {
                arr.push(this.funAddDay(i))
            }

            this.dateArr = arr

            setTimeout(() => {
                this.funCheckDate()
            }, 100)
        },
        funAddDay(add) {
            let copyDate = new Date()
            let newDay = new Date(copyDate.setDate(copyDate.getDate() + add))

            return {
                text: this.$t(formatDate(newDay, 'ww')),
                day: formatDate(newDay, 'yyyy-MM-dd'),
                selected: false
            }
        },
        funCheckDate() {
            let index = 0

            // 设置选中效果
            for (let i = 0; i < this.dateArr.length; i++) {
                let son = this.dateArr[i]

                if (son.day === this.disAbleDate) {
                    son.disableSel = true
                } else {
                    son.disableSel = false
                }
                if (son.day === this.chooseDate) {
                    son.selected = true
                    index = i
                } else {
                    son.selected = false
                }
            }

            // 设置列表滚动
            if (this.domList) {
                if (index > 2) {
                    this.domList.scrollLeft = (index - 2) * 68
                } else {
                    this.domList.scrollLeft = 0
                }
            }
        },
        btnSelectDate(son) {
            if (son.disableSel) return
            // console.log(this.isDpt)
            if (!this.isDpt) {
                this.setData({
                    returnDate: son.day,
                    chooseDate: son.day
                })
            } else {
                this.setData({
                    depDate: son.day,
                    chooseDate: son.day
                })
            }
            window.$tcevt('列表页', 'LB-04', `出发日期:${son.day}`)
        },
        btnOpenCalendar() {
            this.$router.push({
                name: 'listCalendar'
            })
            window.$tcevt('列表页', 'LB-05', `全部日期`)
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/list/topCalendar.less';
.banner{
    padding-left:27px;
    background: #fff;
    width: 750px;
    height: 96px;
    line-height: 96px;
    color: #34354b;
    text-align: left;
    // background-color: #34354b;
    font-size: 30px;
}
</style>
