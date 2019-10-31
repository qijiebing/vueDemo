<template>
    <div id='search'>
        <div class="search fbox">
            <!-- <div class="sbox fbox " :class="{'active':!isEnd}">
                <span class="magnifier" v-if='!isEnd'></span>
                <input class="enter flex1 f14 textDot" :class="{'entered':isEnd}" type="text" v-model="startVal" @input='userSearch' placeholder="输入出发地" value :disabled='!!isEnd'>
                <span class="delete" v-show="!!startVal && !isEnd"></span>
            </div>
            <div class="sbox fbox" :class="{'active':isEnd}">
                <span class="magnifier" v-if='isEnd'></span>
                <input class="enter flex1 f14 textDot" :class="{'wait-enter':!isEnd}" type="text" v-model="endVal" placeholder="输入目的地" @input='userSearch' :disabled='!!isEnd'>
                <span class="delete" v-show="!!endVal && isEnd"></span>
            </div> -->
            <div class="sbox fbox " v-if='!isEnd'>
                <span class="magnifier"></span>
                <input class="enter flex1 f14" type="text" v-model="startVal" :placeholder="dptPlace" @input='userSearch'>
                <span class="delete" v-show="!!startVal" @click='del(isEnd)'></span>
            </div>
            <div class="sbox fbox" v-if='isEnd'>
                <span class="magnifier"></span>
                <input class="enter flex1 f14" type="text" v-model="endVal" :placeholder="desPlace" @input='userSearch'>
                <span class="delete" v-show="!!endVal" @click='del(isEnd)'></span>
            </div>
        </div>
        <div class="search-result" v-if="hasResult">
            <template v-if="resultList.length>0">
                <template v-for="(son, index) in resultList">
                    <div :key="son.cityId+'-'+index">
                        <p class="rcname" :class="[cityClass[son.cityType]]" @click="btnSelectCity(son)">{{son.showText || son.nameT}}</p>
                    </div>
                </template>
            </template>
            <template v-else>
                <p class="no-res">没有结果，换个路线试试吧</p>
            </template>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { isEmpty } from '../../../../../libs/util'
export default {
    data() {
        return {
            dptPlace: this.$t('输入出发地'),
            desPlace: this.$t('输入目的地'),
            endVal: '',
            startVal: '',
            hiddenText: '',
            type: 1,
            hasResult: false,
            resultList: [],
            isGetting: false,
            searchStatus: 'city',
            currentType: this.$route.query.currentType, // 字符串： start[选择出发城市]，end[选择到达城市]
            cityClass: ['', 'cityname-item', 'scenicname-item', 'airportname-item', 'sitename-item'] // 城市标记样式列表，根据type直接获取，减少处理
        }
    },
    props: {
        isEnd: {
            type: Boolean,
            default: false
        },
        cityList: {
            type: Object,
            default: null
        },
        cityListTH: {
            type: Array,
            default: null
        }
    },
    computed: {
        ...mapState(['startCity', 'endCity'])

    },
    watch: {
        // 产品不要展示已选择的
        // startCity: {
        //     handler(obj) {
        //         this.startVal = obj.scenicName || obj.cityName || ''
        //     },
        //     immediate: true,
        //     deep: true
        // },
        // endCity: {
        //     handler(obj) {
        //         this.endVal = obj.scenicName || obj.cityName || ''
        //     },
        //     immediate: true,
        //     deep: true
        // }
    },
    methods: {
        ...mapMutations(['setData']),
        userSearch(e) {
            console.log(e)
            let keyWord = e.target.value
            if (keyWord === '') {
                this.hasResult = false
            } else {
                this.getSearchResult(keyWord)
            }
            window.$tcevt('城市选择页', `搜索栏`, `搜索框`)
        },
        btnSelectCity(item) {
            let locale = () => {
                return window.locale === 'zh' ? 'Zh' : window.locale === 'th' ? 'Th' : window.locale === 'en' ? 'En' : 'Zh'
            }
            if (this.currentType === 'start' && !this.isEnd) {
                this.setData({
                    'startCity': {
                        cityId: item.cityId,
                        cityName: item.fullName,
                        cityType: item.cityType,
                        showText: item[`name${locale}`]
                    },
                    'endCity': {}
                })
            } else {
                this.setData({
                    'endCity': {
                        cityId: item.cityId,
                        cityName: item.fullName,
                        cityType: item.cityType,
                        showText: item[`name${locale}`]
                    }
                })
            }
            // 选择到达城市后，进行回退
            this.$router.go(-1)
            this.hasResult = false
            this.resultList = []
            window.$tcevt('城市选择页', `搜索`, `搜索完成`)
        },
        // 获取搜索结果
        getSearchResult(keyword) {
            if (this.isGetting) return
            this.resultList = []
            // let url = ''
            // let param = {}
            // if (this.isEnd) {
            //     url = '/departureLike'// api.destinationLike
            //     param = {
            //         cityType: this.startCity.cityType,
            //         cityId: this.startCity.cityId,
            //         cityName: this.startCity.cityName
            //     }
            // } else {
            //     url = '/departureLike'// api.departureLike
            // }
            // this.isGetting = true
            // this.fetch({
            //     url: url,
            //     method: 'POST',
            //     data: {
            //         ...param,
            //         keyword: keyword
            //     }
            // }).then(res => {
            //     res = res.data.data
            //     if (res.errCode === 'EC_ALL_00000') {
            //         console.log(res.body)
            //         this.resultList = res.body
            //         this.hasResult = true
            //         this.isGetting = false
            //     }
            // })
            // 前端自己筛选。。。
            let searchKey = window.locale === 'zh' ? 'nameZh' : window.locale === 'en' ? 'nameEn' : window.locale === 'th' ? 'nameTh' : 'nameZh'
            if (searchKey === 'nameTh' && this.cityListTH.length > 0) {
                this.resultList = this.cityListTH.filter((v, i) => {
                    if (v[searchKey].indexOf(keyword) >= 0) {
                        return v
                    }
                })
                console.log(this.resultList)
            } else {
                // this.resultList = this.cityList.filter((v, i) => {
                //     console.log(v)

                //     if (v[searchKey].indexOf(keyword) >= 0) {
                //         return v
                //     }
                // })
                for (let idx in this.cityList) {
                    let val = this.cityList[idx]
                    for (let idx2 in val) {
                        if (window.locale === 'zh' && val[idx2]['nameZh'].indexOf(keyword) >= 0) {
                            this.resultList.push(val[idx2])
                        }
                        if (window.locale === 'en' && val[idx2]['nameEn'].indexOf(keyword) >= 0) {
                            this.resultList.push(val[idx2])
                        }
                    }
                }
                console.log(this.resultList)
            }
            if (!isEmpty(this.resultList)) {
                this.hasResult = true
                this.isGetting = false
            } else {
                this.hasResult = false
                this.isGetting = false
            }
            // axios.get('/departureLike').then((res) => {
            //     res = res.data.data
            //     if (res.errCode === 'EC_ALL_00000') {
            //         this.resultList = res.body
            //         this.hasResult = true
            //         this.isGetting = false
            //     }
            // })
        },
        // 去除输入
        del(type) {
            console.log(type)
            if (type) {
                this.endVal = ''
            } else {
                this.startVal = ''
            }
            this.hasResult = false
            this.resultList = []
            window.$tcevt('城市选择页', `取消搜索`, `搜索取消`)
        }
    }
}
</script>
<style lang="less" scoped>
@import '../style/search.less';
</style>
