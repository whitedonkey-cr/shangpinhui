import { reqGoodsInfo } from "@/api"
import { reqaddorupdatashopcar } from "@/api"
import { getUUID } from "@/utils/uuid_token"
const actions = {
    async getgoodInfo({ commit }, skuid) {
        let result = await reqGoodsInfo(skuid)
        if (result.code == 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    // 将产品添加到购物车，但是服务器返回的数据只是用来验证是否添加成功并没有返回数据 所以我们也不需要存储数据

    async addorupdatashopcar({ commit }, { skuId, skuNum }) {
        let result = await reqaddorupdatashopcar(skuId, skuNum)
        if (result.code == 200) {
            return "ok"
        }
        else {
            return Promise.reject(new Error("faile"))
        }
    }
}

const mutations = {
    GETGOODINFO(state, goodinfo) {
        state.goodinfo = goodinfo
    },
}

const state = {
    //看接口文档返回的是对象还是数组
    goodinfo: {},
    uuid_token: getUUID()
}

const getters = {
    categoryView(state) {
        //初始值是空，空对象的categoryview是undefined 所以我们要或一个空对象 这样就不会报警告了
        return state.goodinfo.categoryView || {}
    },
    skuInfo(state) {
        return state.goodinfo.skuInfo || {}
    },
    skuSaleAttrValueList() {
        return state.goodinfo.spuSaleAttrList || []
    }
}

export default {
    actions, mutations, state, getters
}