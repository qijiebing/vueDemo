<!--- 基本模板 --->
<template>
    <div class="full-page city">
        <city-list :cityList='cityList' :cityListTH='cityListTH' :hotList='hotList' :isEnd='isEnd'></city-list>
        <search :cityList='cityList' :cityListTH='cityListTH' :isEnd='isEnd'></search>
    </div>
</template>
<script>
import search from './modules/search'
import cityList from './modules/cityList'
import api from '@/config/api'
import { isEmpty } from '@/libs/util'
export default {
    data() {
        return {
            isEnd: this.$route.query.currentType === 'end',
            cityList: null, // 城市数据
            cityListTH: null, // 城市数据
            hotList: []// 热门城市
        }
    },
    computed: {},
    components: { search, cityList },
    methods: {
        // 获取城市数据
        getCityInfo() {
            let TmpArr = []
            let locale = ''
            if (window.locale === 'zh') {
                locale = 'Zh'
            } else if (window.locale === 'th') {
                locale = 'Th'
            } else if (window.locale === 'en') {
                locale = 'En'
            }
            this.$loading()
            this.fetch({
                url: api.citylist,
                method: 'POST',
                data: {}
            }).then(result => {
                this.$hloading()
                console.log(66666)
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
                        // Object枚举只能用 for in/object.key()/Object.getOwnPropertyNames()方法，其返回的是数组，但是是所有的自有属性名称的数组。
                        for (let cityIn in TmpArr) {
                            for (let singleCI in TmpArr[cityIn]) {
                                // console.log(singleCI)
                                if (TmpArr[cityIn][singleCI].isHot === 1) {
                                    this.hotList.push(TmpArr[cityIn][singleCI])
                                }
                                TmpArr[cityIn][singleCI].showText = TmpArr[cityIn][singleCI][`name${locale}`]
                            }
                        }
                        let keyNames = []
                        let tmpcitylist = {}
                        for (let key in TmpArr) {
                            keyNames.push(key)
                        }
                        keyNames = keyNames.sort()
                        keyNames.forEach((v) => {
                            for (let keys in TmpArr) {
                                if (v === keys) {
                                    tmpcitylist[keys] = TmpArr[keys]
                                }
                            }
                        })
                        // console.log(tmpcitylist)
                        this.cityList = tmpcitylist
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
    },
    mounted() {
        this.getCityInfo()
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/styles/base.less';
.full-page {
    background: #fff;
}
</style>
