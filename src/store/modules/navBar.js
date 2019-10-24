import Vue from 'vue'

const state = {
    navBar: '',
}

// 获取：当前导航位置
const getters = {
    getNavBar: state => state.navBar
}

// 异步的状态修改
const actions = {
    // commit是用来调用mutations的
    fetchOrderList({ commit, state }) {
        // Vue.http.post( '/api/getOrderList', state.params )
        // 	.then( ( res ) => {

        // 	})
    }
}

// 同步的状态修改
const mutations = {
    upDataNavBar(state, curNavBar) {
        state.navBar = curNavBar;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}