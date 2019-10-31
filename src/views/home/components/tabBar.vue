<template>
    <div class="tabbar-box">
        <md-tab-bar
            v-model="current"
            :items="items"
            :has-ink="false"
            @change="onTabChange"
        >
            <template slot="item" slot-scope="{ item, index }">
                <div class="custom-item">
                    <div class="icon">
                        <md-icon :name="item.icon" />
                    </div>
                    <div class="text">
                        <template v-if="index===0">
                            <span>{{home}}</span>
                        </template>
                        <template v-if="index===1">
                            <span>{{travel}}</span>
                        </template>
                        <template v-if="index===2">
                            <span>{{my}}</span>
                        </template>
                    </div>
                </div>
            </template>
        </md-tab-bar>
    </div>
</template>

<script>
import { TabBar, Icon } from 'mand-mobile'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'tab-bar',
    components: {
        [TabBar.name]: TabBar,
        [Icon.name]: Icon
    },
    props: {
        currentTab: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapState(['home', 'travel', 'my'])
    },
    watch: {
        currentTab: {
            handler(newV) {
                this.current = this.currentTab + 1
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            current: this.currentTab + 1,
            items: [
                { name: 1, label: this.$t('购票'), icon: 'home' },
                { name: 2, label: this.$t('行程助手'), icon: 'discovery' },
                { name: 3, label: this.$t('我的'), icon: 'user' }
            ],
            label0: '',
            label1: '',
            label2: ''
        }
    },
    mounted() {
        switch (window.locale) {
            case 'en':
                this.setData({
                    home: 'home',
                    travel: 'Travel Assistant',
                    my: 'Mine'
                })
                break
            case 'th':
                this.setData({
                    home: 'ซื้อตั๋ว',
                    travel: 'ผู้ช่วยการเดินทาง',
                    my: 'ของฉัน'
                })
                break
            case 'zh':
                this.setData({
                    home: '购票',
                    travel: '行程助手',
                    my: '我的'
                })
                break
        }
    },
    methods: {
        ...mapMutations({
            setData: 'setData'
        }),
        onTabChange(item, index) {
            this.$emit('tabConfig', index)
            console.log(item, index)
        }
    }
}
</script>

<style lang="less">
.tabbar-box{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 99;
}
.custom-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex: 1
}
.md-tab-bar-item.is-active{
    color: #34354b;
    font-weight: bold;
}
</style>
