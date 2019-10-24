// 引入第三方插件
import Vue from 'vue'
import App from './App'
import router from './router/router'
import V2Datepicker from 'v2-datepicker' //日期选择器
import Less from 'less' //日期选择器


// 多选下拉框
import treeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


// vue-beauty插件(样式)
import '../node_modules/vue-beauty/package/style/vue-beauty.min.css'
import vueBeauty from 'vue-beauty'

// vue-chart
import '../node_modules/chart.js/dist/Chart'

// 注册第三方插件   
Vue.use(V2Datepicker)
Vue.use(vueBeauty)
Vue.use(Less)
// Vue.use( hchsVueCharts )

// 引入文件
import navBar from './components/navBar'
import myTable from './components/base/table.vue'
import myTableArr from './components/base/tableArr.vue'
import textTable from './components/base/textTable.vue'
import formSelectProvince from './components/base/model/formSelectProvince'
import gridIssueDetail from './components/LTEItem/gridIssueDetail.vue'
import scenceIssueDetail from './components/LTEItem/scenceIssueDetail.vue'


// 字体图标
import './static/fontSize/iconfont.js'



// 全局注册组件
Vue.component('nav-bar', navBar);
Vue.component('my-table', myTable);
Vue.component('text-table', textTable);
Vue.component('my-table-arr', myTableArr);
Vue.component('form-select-province', formSelectProvince);
Vue.component('grid-issue-detail', gridIssueDetail);//栅格模态框
Vue.component('scence-issue-detail', scenceIssueDetail);//栅格模态框




// 引入vuex
import store from './store'


Vue.config.productionTip = false
// 创建VUE实例
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App,
    }
})
