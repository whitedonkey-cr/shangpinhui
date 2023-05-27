import { reqcarlist, reqdeletecarlist, reqchangechecked } from "@/api"

const state = {
    carlist: []
}
const actions = {
    async getcarlist({ commit }) {
        let result = await reqcarlist()
        if (result.code == 200) {
            commit('GETCARLIST', result.data)
        }
    },
    // 删除某一个产品的信息
    async deletecarlist({ commit }, skuId) {
        let result = await reqdeletecarlist(skuId)
        if (result.code == 200) {
            return "ok"
        }
        else {
            return Promise.reject(new Error("faile"))
        }
    },
    // 改变复选框状态
    async changeischecked({ commit }, { skuId, isChecked }) {
        let result = await reqchangechecked(skuId, isChecked)
        if (result.code == 200) {
            return "ok"
        }
        else {
            Promise.reject(new Error('faile'))
        }
    },
    // 删除选中的商品
    deleteallcheckedcart({ dispatch, getters }) {
        let promiseAll = []
        getters.carlist.cartInfoList.forEach(item => {
            // 每循环一次发送一个请求 返回来的是promise对象， 我们需要知道是否都成功了，就需要用到promise的静态方法all 且他的参数是 对象数组， 数组里面都是promise对象
            let promise = item.isChecked == 1 ? dispatch('deletecarlist', item.skuId) : ''
            promiseAll.push(promise)
        });
        return Promise.all(promiseAll)

    },

    // 全选框的选中和不选
    isallchecked({ dispatch, getters }, isAllCheck) {
        let promiseAll = []
        getters.carlist.cartInfoList.forEach(item => {

            let promise = isAllCheck ? dispatch('changeischecked', { skuId: item.skuId, isChecked: '1' }) : dispatch('changeischecked', { skuId: item.skuId, isChecked: '0' })

            promiseAll.push(promise)
        });
        return Promise.all(promiseAll)

    },
}
const mutations = {
    GETCARLIST(state, carlist) {
        state.carlist = carlist
    }
}
const getters = {
    carlist(state) {
        return state.carlist[0] || {}
    }
}

export default {
    actions,
    mutations,
    state,
    getters,
}