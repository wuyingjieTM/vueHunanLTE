import {
    http,
    httpLocal
} from "./es6";
import {
    commonMethod
} from "./common";


const httpUrl = {
    downLoad(parameter){
        var urlDown = parameter.url;
        if (parameter.param)
        {
            var arr = ["?"];
            for (var key of Object.keys(parameter.param))
            {
                arr.push(key);
                arr.push("=");
                arr.push(parameter.param[key]);
                arr.push("&");
            }
            arr.pop();
            urlDown += arr.join("");
        }
        window.location.href = commonMethod.url.baseURL + urlDown
    },
    url: {
        // 首页：动态获取时间和省市
        homePageIndex(parameter) {
            return http({
                url: `index/queryFields`,
                method: parameter.method,
            })
        },
        // 首页：获取指标数据
        homePageIScene(parameter) {
            return http({
                url: `index/summaryInfo`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 首页：table
        homePageTable(parameter) {
            return http({
                url: `problemsManager/indexProblemsList`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理：参数联动
        issueManageParams(parameter) {
            return http({
                // url: `problemsManager/sceneQueryFields`,
                url: `problemsManager/problemsListState`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理页面 :table表格 ----  表名: web_grid_base
        issueManageTable(parameter) {
            return http({
                url: `problemsManager/problemsList`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID  (状态、结论)
        issueManageGridIdConclued(parameter) {
            return http({
                url: `problemsManager/gridConclusion`,
                // url: `solveManager/solveConclusion`,
                method: parameter.method,
                param: parameter.param
            })
        },
        issueManageGridIdConclueds(parameter) {
            return http({
                // url: `problemsManager/gridConclusion`,
                url: `solveManager/solveConclusion`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID  (栅格)
        issueManageGridIdGrid(parameter) {
            return http({
                url: `problemsManager/gisGridRange`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID  (arcgis连线)
        issueManageGridIdLine(parameter) {
            return http({
                url: `problemsManager/gisGridTop3CellPosition`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID(table)：
        issueManageGridIdTable(parameter) {
            return http({
                url: `problemsManager/alarmResult`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID(折线图)
        issueManageEchartLine(parameter) {
            return http({
                url: `problemsManager/gridCoverage`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID(极坐标)
        issueManageEchartsPolar(parameter) {
            return http({
                url: `problemsManager/gridPolar`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID(热力图)
        issueManageEchartsCalendar(parameter) {
            return http({
                url: `problemsManager/gridSpectrum`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID-详细分析
        issueManageDetail(parameter) {
            return http({
                url: `solveManager/solveGrid`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-场景问题(折线图)
        scenceIssueEchartLine(parameter) {
            return http({
                url: `problemsManager/sceneCoverage`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-场景问题(地图栅格)
        sceneGridIdGrid(parameter) {
            return http({
                url: `problemsManager/gisMinorGridRange`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-场景问题（结论状态）
        sceneConclued(parameter) {
            return http({
                url: `problemsManager/sceneConclusion`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-栅格ID-详细分析
        sceneDetail(parameter) {
            return http({
                url: `solveManager/solveMajor`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-投诉管理:投诉时段指标、用户占用小区RSRP分布图、异常信令
        issueManageComplaint(parameter) {
            return http({
                url: `complaintManager/complaint`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-投诉管理:arcgis地图
        issueManageComplaintMap(parameter) {
            return http({
                url: `problemsManager/gisSimplePosition`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-投诉管理:table
        issueManageComplaintTable(parameter) {
            return http({
                url: `complaintManager/signaling`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 问题点管理-投诉管理:柱状图
        issueManageComplaintEchartBar(parameter) {
            return http({
                url: `complaintManager/pic`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 节假日对比
        holidayContrastTable(parameter) {
            return http({
                url: `holidayCompared/compared`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // 节假日对比:结论
        holidayContrastConclusion(parameter) {
            return http({
                url: `holidayCompared/conclusion`,
                method: parameter.method,
                param: parameter.param
            })
        },
        // MR与仿真数据
        MRDataTable(parameter) {
            return http({
                url: `MrSimulManager/mrsimullist`,
                method: parameter.method,
                param: parameter.param
            })
        },
        //   工单概览
        workOverviewAreaStatistics(parameter) { //区域统计总数
            return http({
                url: `overview/taskview`,
                method: parameter.method,
                param: parameter.param
            })
        },
        table(parameter) { //区域统计总数
            return httpLocal({
                url: `/static/data/tableData.json`,
            })
        }
    },


}

export {
    httpUrl
}
