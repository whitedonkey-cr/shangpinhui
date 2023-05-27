import { requseraddress, reqgoodlist } from "@/api"

const state = {
    address: [],
    goodlist: {},
}
const actions = {
    async getuseraddress({ commit }) {
        let result = await requseraddress()
        if (result.code == 200) {
            commit('GETUSERADDRESS', result.data)
        }
    },
    async getgoodlist({ commit }) {
        let result = await reqgoodlist()
        if (result.code == 200) {
            commit('GETGOODLIST', result.data)
        }
    }
}
const mutations = {
    GETUSERADDRESS(state, value) {
        state.address = value
    },
    GETGOODLIST(state, value) {
        state.goodlist = value
    }
}
const getters = {

}

export default {
    actions,
    mutations,
    state,
    getters,
}