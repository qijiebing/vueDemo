<template>
    <div class="language-box full-page">
        <md-field title="" class="radio-field">
            <md-radio-list
                v-model="language"
                :options="languages"
                icon-size="lg"
            />
        </md-field>
    </div>
</template>

<script>
import { Field, RadioList } from 'mand-mobile'
import { mapState, mapMutations } from 'vuex'
import { setStore } from '@/libs/util'
export default {
    name: 'language',
    components: {
        [Field.name]: Field,
        [RadioList.name]: RadioList
    },
    computed: {
        ...mapState(['locale', 'home', 'travel', 'my'])
    },
    data() {
        return {
            language: '',
            languages: [
                {
                    value: '0',
                    text: 'English'
                },
                {
                    value: '1',
                    text: 'ภาษาไทย'
                },
                {
                    value: '2',
                    text: '中文'
                }
            ],
            firstInit: true
        }
    },
    watch: {
        language(newValue, oldValue) {
            if (this.firstInit) {
                this.firstInit = false
                return
            }
            console.log(newValue)
            let lang = ''
            switch (newValue) {
                case '0':
                    lang = 'en'
                    this.setData({
                        home: 'home',
                        travel: 'Travel Assistant',
                        my: 'Mine'
                    })
                    break
                case '1':
                    lang = 'th'
                    this.setData({
                        home: 'ซื้อตั๋ว',
                        travel: 'ผู้ช่วยการเดินทาง',
                        my: 'ของฉัน'
                    })
                    break
                case '2':
                    lang = 'zh'
                    this.setData({
                        home: '购票',
                        travel: '行程助手',
                        my: '我的'
                    })
                    break
            }
            window.locale = lang
            setStore('locale', window.locale)
            this.setData({
                locale: window.locale
            })
            this.$i18n.locale = lang
            this.$router.go(-1)
            // location.href = location.replace(/newValue/, `locale=${window.locale}&`)
        }
    },
    mounted() {
        let locale = ''
        setStore('locale', window.locale)
        // tab数组中不能动弹
        switch (window.locale) {
            case 'en':
                locale = '0'
                this.setData({
                    home: 'home',
                    travel: 'Travel Assistant',
                    my: 'Mine'
                })
                break
            case 'th':
                locale = '1'
                this.setData({
                    home: 'ซื้อตั๋ว',
                    travel: 'ผู้ช่วยการเดินทาง',
                    my: 'ของฉัน'
                })
                break
            case 'zh':
                locale = '2'
                this.setData({
                    home: '购票',
                    travel: '行程助手',
                    my: '我的'
                })
                break
        }
        this.language = locale
    },
    methods: {
        ...mapMutations({
            setData: 'setData'
        })
    }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/base.less';
</style>
