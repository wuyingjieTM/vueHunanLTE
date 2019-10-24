import Vue from 'vue';
import Vuex from 'vuex';

import navBar from './modules/navBar'
Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        navBar
    }
})