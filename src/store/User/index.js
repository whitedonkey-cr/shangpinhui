import { reqphonecode, reqsendforminfo, requserlogin, requserinfo, reqloginout } from "@/api"

const actions = {
    async getphonecode({ commit }, phone) {
        let result = await reqphonecode(phone)
        if (result.code == 200) {
            commit('GETPHONECODE', result.data)
        }
    },
    async sendinfo(context, data) {
        let result = await reqsendforminfo(data)
        if (result.code == 200) {
            return 'ok'
        }
        else {
            Promise.reject(new Error('faile'))
        }
    },
    // 登录成功返回token
    async userlogin({ commit }, data) {
        let result = await requserlogin(data)
        if (result.code = 200) {
            localStorage.setItem('token', result.data.token)
            commit('USERLOGIN', result.data.token)
            return 'ok'
        }
        else {
            Promise.reject(new Error('faile'))
        }
    },

    //根据token获取用户信息 登录成功后获取个人信息
    async getuserinfo({ commit }) {
        let result = await requserinfo()
        if (result.code == 200) {
            commit('GETUSERINFO', result.data.name)
            return 'ok'
        }
        else {
            return Promise.reject(new Error('faile'))
        }
    },

    //退出登录
    async userlogout({ commit }) {
        let result = await reqloginout()
        console.log(result)
        if (result.code == 200) {
            console.log(result)
            commit('CLEARUSER')
            return 'ok'
        }
        else {
            return Promise.reject(new Error('faile'))
        }
    }
}

const mutations = {
    CLEARUSER(state) {
        state.token = '',
            localStorage.removeItem('token')
        state.username = ''
    },
    GETPHONECODE(state, value) {
        state.code = value
    },
    USERLOGIN(state, value) {
        state.token = value
    },
    GETUSERINFO(state, value) {
        state.username = value
    }
}

const state = {
    code: '',
    token: localStorage.getItem('token'),
    username: ''
}

const getters = {

}

export default {
    actions, mutations, state, getters
}