// 引入第三方插件
import Vue from 'vue'
import Router from 'vue-router'

// 在实例上注册插件
Vue.use(Router)

// 登录界面
import login from '../components/login'

// let九大模块
import homePage from '../components/LTEItem/homePage.vue'
import issueManage from '../components/LTEItem/issueManage.vue'
import gridIssue from '../components/LTEItem/gridIssue.vue'
import gridIssueDetail from '../components/LTEItem/gridIssueDetail.vue'
import scenceIssue from '../components/LTEItem/scenceIssue.vue'
import scenceIssueDetail from '../components/LTEItem/scenceIssueDetail.vue'
import raceToIssue from '../components/LTEItem/raceToIssue.vue'
import complaintIssue from '../components/LTEItem/complaintIssue.vue'
import holidayContrast from '../components/LTEItem/holidayContrast.vue'
import simulationManage from '../components/LTEItem/simulationManage.vue'
import MRData from '../components/LTEItem/MRData.vue'

// 项目路由结构
export default new Router({
    // mode: 'history',
    base: __dirname,
    routes: [

        { //添加单斜线，是基于根目录（如果不添加，则表示当前目录下）
            path: '/',
            component: login,
            redirect: "/LTEItem/homePage",
        },
        //  登陆页面
        {
            component: login,
            path: "/LTEItem/login",
        },

        // let九大模块
        {
            component: homePage,
            path: "/LTEItem/homePage",
        }, {
            component: issueManage,
            path: "/LTEItem/issueManage",
        }, {
            component: gridIssue,
            path: "/LTEItem/gridIssue",
        },
        {
            component: gridIssueDetail,
            path: "/LTEItem/gridIssueDetail",
        }, {
            component: scenceIssue,
            path: "/LTEItem/scenceIssue",
        }, {
            component: scenceIssueDetail,
            path: "/LTEItem/scenceIssueDetail",
        }, {
            component: raceToIssue,
            path: "/LTEItem/raceToIssue",
        }, {
            component: complaintIssue,
            path: "/LTEItem/complaintIssue",
        }, {
            component: holidayContrast,
            path: "/LTEItem/holidayContrast",
        }, {
            component: simulationManage,
            path: "/LTEItem/simulationManage",
        }, {
            component: MRData,
            path: "/LTEItem/MRData",
        }
    ]
})
