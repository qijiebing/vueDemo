<template>
    <div class='home-box'>
        <transition-group name="fade">
            <div class="home" key="0" v-if="currentTabRF===0">
                <home-swiper :list='swiperList'></home-swiper>
                <query></query>
            </div>
            <div class="travel" key="1" v-if="currentTabRF===1" >
                <travel :currentTabRF="currentTabRF"></travel>
            </div>
            <div class="me" key="2" v-if="currentTabRF===2">
                <Me @goDetail="goDetail" @goLanguage="goLanguage"></Me>
            </div>
        </transition-group>
        <tab-bar :currentTab='currentTab' @tabConfig='getTabCfg'></tab-bar>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import HomeSwiper from './components/Swiper'
import query from './components/query'
import tabBar from './components/tabBar'
import travel from './components/travel'
import Me from './components/me'
// import axios from 'axios'
import { isEmpty } from '../../libs/util'
import api from '../../config/api'
export default {
    name: 'Home',
    data() {
        return {
            swiperList: [],
            currentTab: 0,
            currentTabRF: 0
        }
    },
    components: {
        HomeSwiper,
        query,
        tabBar,
        travel,
        Me
    },
    methods: {
        getSwiper() {
            this.fetch({
                url: api.bannerUrl,
                method: 'POST',
                data: {}
            }).then((result) => {
                if ((result.code === '200' || result.success) && !isEmpty(result.data)) {
                    if (typeof result.data === 'string') {
                        this.swiperList = [result.data]
                    } else {
                        this.swiperList = result.data
                    }
                }
            })
        },
        getTabCfg(data) {
            this.currentTabRF = data
        },
        goDetail(id) {
            this.$router.push({
                name: 'detail',
                query: {
                    id: id
                }
            })
        },
        goLanguage() {
            this.$router.push({
                name: 'language'
            })
        }
    },
    mounted() {
        this.getSwiper()
        this.$nextTick(() => {
            // 通过url传tab的值
            this.currentTabRF = parseInt(this.$route.query.tab) || 0
            this.currentTab = parseInt(this.$route.query.tab) || 0
        })
    }
}
</script>

<style lang="less">
@import '~@/assets/styles/base.less';
.home-box .md-icon.icon-font:before{
    color: rgb(102, 111, 131)!important;
}
.md-tab-bar{
    padding-left: 0!important;
    padding-right: 0!important;
}
.custom-item .text span{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.md-tab-bar-item{
    width: 33%!important;
    padding: 0!important;
}
.md-tab-bar-item.is-active{
    color: #34354b!important;
    font-weight: bold;
}
.md-stepper-button-reduce{
    background: #fff!important;
    border: 1px solid #999!important;

}
.md-stepper-button-reduce::after{
    background: #999!important;
    opacity: 1!important;
}
.md-stepper-button-reduce.disabled{
    opacity: .3!important;
}
.md-stepper-button.disabled:after{
    opacity: .3!important;
}
</style>
<style lang='less' scoped>
.vs-show{
    visibility: hidden;
}
.home-box {
    height: 100%;
}
.slide-enter,
.slide-leave-to{
    transform: translate3d(100%, 0 , 0);
}
.slide-enter-active,
.slide-leave-active{
    transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to{
    opacity: 0;
    display: none
}
.fade-enter-active,
.fade-leave-active{
    transition: opacity .3s ease;
}
</style>
