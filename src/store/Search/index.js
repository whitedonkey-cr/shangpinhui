
import { reqGetSeachInfo } from "@/api"

// search模块小仓库
// state:仓库存储数据的地方
const state = {
    searchlist: {}
}
//  mutations：修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state, value) {
        state.searchlist = value
    },
}
//  actions：处理action，可以书写自己的业务逻辑，也可以处理i异步
const actions = {
    async getSearList({ commit }, params = {}) {
        // 当前这个函数在调用获取服务器数据的时候，至少传递一个参数且是空对象
        // params参数：是当用户派发action的时候，且给params一个默认参数空对象
        let result = await reqGetSeachInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}
//  getters：理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    //这个state是当前仓库的state  不是大仓库的state
    goodsList(state) {
        //这样书写是有问题的，假如请求失败，那么空对象里面是没有该属性的返回的就是undefined 通用的解决办法就是 或一个空数组
        return state.searchlist.goodsList || []
    },
    trademarkList(state) {
        return state.searchlist.trademarkList || []
    },
    attrsList(state) {
        return state.searchlist.attrsList || []
    }
}

// 全部暴露出去
export default {
    state, mutations, actions, getters
}