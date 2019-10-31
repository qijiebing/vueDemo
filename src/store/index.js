import Vue from 'vue'
import Vuex from 'vuex'
import main from './modules/store'
// 目前看数据存储更多是首页缓存数据，其他页面缓存数据量不大，后期再看是否需要对数据进行模块化拆分
// import home from './modules/home'
// import list from './modules/list'
// import book from './modules/book'
// import detail from './modules/detail'

Vue.use(Vuex)

export default new Vuex.Store({
    ...main
    // modules: {
    //     home,
    //     list,
    //     book,
    //     detail
    // },
    // strict: true
})
