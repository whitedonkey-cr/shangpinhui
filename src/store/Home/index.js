
import { reqCategoryList, reqmockbannerlist, reqfloor, requserinfo } from "@/api"

// Home模块小仓库
// state:仓库存储数据的地方
const state = {
    // state中数据的默认值的初始值不能瞎写！！要看服务器返回的数据是什么类型 默认值设为什么类型
    categoryList: [],
    bannerlist: [],
    floorlist: []
}

//  mutations：修改state的唯一手段
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerlist) {
        state.bannerlist = bannerlist
    },
    GETFLOOR(state, floorlist) {
        state.floorlist = floorlist
    },
}

//  actions：处理action，可以书写自己的业务逻辑，也可以处理i异步
const actions = {
    // 通过api里面的接口函数调用，向服务器发送请求，获取服务器数据
    //这里解构了 store 中的commit 要加括号！！！！！
    async categoryList({ commit }) {
        let result = await reqCategoryList()
        //console.log(result)//返回的是一个promise对象 然后老师就加了async和await 然后就拿到数据了，这里没懂？？？
        if (result.code == 200) {
            commit('CATEGORYLIST', result.data)
        }
    },
    async getbannerlist(context) {
        let result = await reqmockbannerlist()
        if (result.code === 200) {
            context.commit('GETBANNERLIST', result.data)
        }
    },
    async getfloor({ commit }) {
        let result = await reqfloor()
        if (result.code === 200) {
            commit('GETFLOOR', result.data)
        }
    },
}


//  getters：理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {}

// 全部暴露出去
export default {
    state, mutations, actions, getters,
}