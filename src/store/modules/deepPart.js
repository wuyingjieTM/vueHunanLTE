import Vue from 'vue'

const state = {
    curSlect: 'alert',
    curParams: {}
}

// 用来获取数据(不能直接使用state获取数据，必须通过gettters)
const getters = {
    getCurSlect: state => state.curSlect,
    getParams: state => state.curParams
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
    upCurSlect(state, curSlect) {
        state.curSlect = curSlect;
    },
    upParams(state, params) {
        state.curParams = params;
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}