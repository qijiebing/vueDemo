<template>
  <div class="wrapper">
    <swiper :options="swiperOption" v-if="showSwiper">
      <swiper-slide :class="{'swiper-no-swiping':list.length===1}" v-for="(item,index) of list" :key="index">
        <img class="swiper-img" :src="item" />
      </swiper-slide>
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
    name: 'HomeSwiper',
    props: {
        list: Array
    },
    data() {
        return {
            swiperOption: {
                pagination: '.swiper-pagination',
                loop: true
            }
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        showSwiper() {
            return this.list.length
        }
    }
}
</script>
<style lang="less">
@import '~@/assets/styles/home/swiper.less';
</style>
<style lang="less" scoped>
  .wrapper{
    overflow: hidden;
    width: 100%;
    height: 0;
    padding-bottom: 38.4%;
    background: #eee;
    .swiper-img{
        width: 100%
    }
  }
</style>
