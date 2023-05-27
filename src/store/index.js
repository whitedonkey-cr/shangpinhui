//引入vuex插件（只有vue自带的插件 使用的时候需要use 别的插件用import）
import Vue from 'vue'
import Vuex from 'vuex'
// 使用vuex插件
Vue.use(Vuex)

// 当我们数据很多的时候，我们需要进行模块化开发，更方便的来管理数据
// 接受暴露出来的小仓库 放在这个大仓库中
import home from './Home'
import search from './Search'
import detail from './Detail'
import shopcart from './ShopCart'
import user from './User'
import trade from './Trade'

//插件身上有一个store方法 它是用来构造store类的实例的 我们需要调用该方法构造一个store实例
export default new  Vuex.Store({
    modules:{home, search, detail, shopcart,user,trade}
})


/************************************************注释***********************/ 
// state:仓库存储数据的地方
// const state={}
//  mutations：修改state的唯一手段
// const mutations={}
//  actions：处理action，可以书写自己的业务逻辑，也可以处理i异步
// const actions={}
//  getters：理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
// const getters={}