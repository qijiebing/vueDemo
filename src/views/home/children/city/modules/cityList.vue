<!--- 基本模板 --->

<template>
    <div id='cityScroll'>
        <!-- <p class="part-tit f12">当前定位</p>
        <ul class="item-box fbox">
            <li class="city-item gps" @click='chooseCity(localCityInfo)'>
                <p class="c">{{localCityInfo.cityName}}<span class="f10 ml10">GPS定位</span></p>
            </li>
        </ul> -->
        <!-- <section v-if='historyList'>
            <p class="part-tit f12" id='cityHot'>历史</p>
            <ul class="item-box fbox flex-wrap">
                <li class="city-item c" :class="{fbox:item.cityType==1}" v-for='item in historyList' :key='item.cityName + item.scenicName' @click='chooseCity(item)'>
                    <p>{{item.cityName}}</p>
                    <p v-if='item.scenicName' class="textDot">{{item.scenicName}}</p>
                </li>
            </ul>
        </section> -->
        <section v-if='hotList' class="hot-part">
            <p class="part-tit f12" id='cityHot'>{{$t('热门')}}</p>
            <ul class="item-box fbox flex-wrap">
                <li class="city-item   fbox" :class="{ selected:isSelectCity(localCityInfo)}" v-if='localCityInfo.cityId && currentType=="start"' @click='chooseCity(localCityInfo)'>
                    <p v-if="locale==='en'"><span class="ifont light-gray f16" style="vertical-align: middle;">&#xe904;</span> {{localCityInfo.nameEn}}</p>
                    <p v-else-if="locale==='th'"><span class="ifont light-gray f16" style="vertical-align: middle;">&#xe904;</span> {{localCityInfo.nameTh}}</p>
                    <p v-else-if="locale==='zh'"><span class="ifont light-gray f16" style="vertical-align: middle;">&#xe904;</span> {{localCityInfo.nameZh}}</p>
                    <p v-else><span class="ifont light-gray f16" style="vertical-align: middle;">&#xe904;</span> {{localCityInfo.fullName}}</p>
                </li>
                <li class="city-item  " :class="{fbox:item.cityType==1 , selected:isSelectCity(item)}" v-for='item in hotList' :key='item.id' @click='chooseCity(item,"hot")'>
                    <p v-if="locale==='en'" class="  f11">{{item.nameEn}}</p>
                    <p v-else-if="locale==='th'" class="  f11">{{item.nameTh}}</p>
                    <p v-else-if="locale==='zh'" class="  f11">{{item.nameZh}}</p>
                    <p v-else class="  f11">{{item.fullName}}</p>
                </li>
            </ul>
        </section>
        <template v-if='cityList'>
            <section class="word-list">
                <template v-for="(item,key) in cityList">
                    <h4 class="bg f14" :key='"word-"+key' :id='"city"+key'>{{key}}</h4>
                    <ul :key='key'>
                        <template v-for='(son,ins) in item'>
                            <li v-if="locale==='en'" :key='"son-"+ins' :class="[cityClass[son.cityType]]" @click='chooseCity(son)'>{{son.showText}}</li>
                            <li v-else-if="locale==='th'" :key='"son-"+ins' :class="[cityClass[son.cityType]]" @click='chooseCity(son)'>{{son.showText}}</li>
                            <li v-else-if="locale==='zh'" :key='"son-"+ins' :class="[cityClass[son.cityType]]" @click='chooseCity(son)'>{{son.showText}}</li>
                        </template>
                    </ul>
                </template>
            </section>
            <section class="letter-list">
                <ul>
                    <li v-for="arr in letterList" :key='arr' class="f10 c" @click="quickLetter(arr)">
                        <template v-if="arr ==='热门'">
                            {{$t('热门')}}
                        </template>
                        <template v-else>
                            {{arr}}
                        </template>
                    </li>
                </ul>
            </section>
        </template>
        <template v-else-if='cityListTH'>
             <section class="word-list">
                    <ul>
                        <template v-for='(son,ins) in cityListTH'>
                            <li v-if="locale==='th'" :key='"son-"+ins' :class="[cityClass[son.cityType]]" @click='chooseCity(son)'>{{son.nameTh}}</li>
                            <li v-else :key='"son-"+ins' :class="[cityClass[son.cityType]]" @click='chooseCity(son)'>{{son.nameZh}}</li>
                        </template>
                    </ul>
            </section>
        </template>
        <template v-else>
            <p class="nodata">暂无城市数据...</p>
        </template>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import api from '@/config/api'
import { isEmpty } from '@/libs/util'
export default {
    data() {
        return {
            // cityList: null, // 城市数据
            // cityListTH: null, // 城市数据
            cityClass: ['', 'cityname-item', 'scenicname-item', 'airportname-item', 'sitename-item'], // 城市标记样式列表，根据type直接获取，减少处理
            // hotList: [], // 热门城市
            historyList: '', // 历史记录
            localName: '', // 保存点击的字母
            currentType: this.$route.query.currentType // 字符串： start[选择出发城市]，end[选择到达城市]
        }
    },
    created() {
        // 去掉历史记录
        // this.getHistory()
        // 获取城市
        // this.getCityInfo()
        console.log(this.locale)
        if (isEmpty(this.localCityInfo)) {
            this.getLocationCity()
        }
        // console.log(this.localCityInfo)
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
        },
        hotList: {
            type: Array,
            default: null
        }
    },
    components: {},
    computed: {
        ...mapState(['startCity', 'endCity', 'localCityInfo']),
        // 后端没给字母列表，前端自己处理
        letterList() {
            // return this.cityList.reduce((prev, cur) => {
            //     prev.push(cur.word)
            //     return prev
            // }, ['热门'])
            let keyNames = []
            for (let key in this.cityList) {
                keyNames.push(key)
            }
            keyNames = keyNames.sort()
            // 默认添加热门，如果有的话
            if (this.hotList) {
                keyNames.unshift('热门')
            }
            return keyNames
        },
        locale() {
            return window.locale
        }
    },
    watch: {

    },
    methods: {
        ...mapMutations(['setData']),
        ...mapActions(['getLocationCity']),
        // 当前是否是选择的城市
        isSelectCity(item) {
            let curChoose = this.currentType === 'start' ? this.startCity : this.endCity
            if (item.cityId === curChoose.cityId || item.id === curChoose.id) {
                return true
            }
            return false
        },
        // 选择城市传入原始item源数据
        chooseCity(item, type) {
            let locale = () => {
                return window.locale === 'zh' ? 'Zh' : window.locale === 'th' ? 'Th' : window.locale === 'en' ? 'En' : 'Zh'
            }
            let tLocale = locale()
            // console.log(item[`name${tLocale}`])
            if (this.currentType === 'start') {
                this.setData({
                    startCity: {
                        cityId: item.cityId,
                        cityName: item.fullName,
                        cityType: item.cityType,
                        showText: item[`name${tLocale}`]
                    },
                    endCity: {}
                })
            } else {
                this.setData({
                    endCity: {
                        cityId: item.cityId,
                        cityName: item.fullName,
                        cityType: item.cityType,
                        showText: item[`name${tLocale}`]
                    }
                })
                console.log(this.endCity)
                // 选择到达城市后，进行回退
            }
            this.$router.go(-1)
            window.$tcevt('城市选择页', `城市选择`, `当前城市:${item.cityName},热门:${type ? '是' : '否'}`)
        },
        // 字母切换
        quickLetter(keyName) {
            // 滚动的元素需要有滚动条，得设置当前元素高度，超出部分滚动
            keyName = keyName === '热门' || keyName === 'cityHot' ? 'cityHot' : 'city' + keyName
            let top = 0
            let ptopHeight = document.querySelector('.hot-part').offsetHeight
            top = keyName === '热门' || keyName === 'cityHot' ? document.querySelector('#' + keyName).offsetTop - 80 : document.querySelector('#' + keyName).offsetTop + ptopHeight
            if (this.localName && this.localName === keyName) {
                // console.log('相同了')
                // 相同的点击失效
                return
            }
            this.localName = keyName
            console.log(top)
            let scroll = document.querySelector('#cityScroll')
            scroll.scrollTo(0, top)
            window.$tcevt('城市选择页', `城市字母筛选`, `字母:${keyName}`)
        },
        // 获取历史记录
        getHistory() {
            // storage中拿到历史数据，如果没有给默认空数组
            let historyStore = JSON.parse(localStorage.getItem('newlinebus_indexhistory')) || {}
            let currentList = historyStore

            if (!currentList) {
                this.historyList = ''
            }

            let obj = {}

            for (let son of currentList) {
                let cityType = son[`${this.currentType}CityType`]
                let cityId = son[`${this.currentType}CityId`]
                let cityName = son[`${this.currentType}City`]

                obj = {
                    cityType,
                    cityId,
                    cityName
                }
            }

            this.historyList = obj
        },
        // 获取城市数据
        getCityInfo() {
            let TmpArr = []
            let locale = () => {
                return window.locale === 'zh' ? 'Zh' : window.locale === 'th' ? 'Th' : window.locale === 'en' ? 'En' : 'Zh'
            }
            this.$loading()
            this.fetch({
                url: api.citylist,
                method: 'POST',
                data: {}
            }).then(result => {
                this.$hloading()
                if (result.code === '200' && !isEmpty(result.data)) {
                    TmpArr = result.data
                    // 泰语没分类 就放入0000 数组内
                    if (TmpArr['0000'] && TmpArr['0000'].length > 0) {
                        this.hotList = TmpArr['0000'].filter(item => {
                            if (item.isHot === 1) {
                                return item
                            }
                        })
                        this.cityListTH = TmpArr['0000']
                    } else {
                        TmpArr.forEach(v => {
                            v.forEach((vv) => {
                                if (vv.isHot === 1) {
                                    this.hotList.push(vv)
                                }
                                vv.showText = `name${locale}`
                            })
                        })
                        let keyNames = []
                        for (let key in TmpArr) {
                            keyNames.push([key, TmpArr[key]])
                        }
                        this.cityList = keyNames.sort()
                        // this.cityList = TmpArr
                        console.log(keyNames)
                        // console.log(this.cityList)
                    }
                }
            }).catch(e => {
                this.$hloading()
                this.$toast({
                    txt: this.$t('获取数据失败')
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '../style/cityList.less';
</style>
