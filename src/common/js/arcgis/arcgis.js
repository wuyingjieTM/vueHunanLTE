import { arcgisConfig } from "./arcgisConfig";
import { commonMethod } from "../common"

const arcgis = {
    initMapParams(x, y) {
        const obj = {
            center: { x: x || 112.40736, y: y || 27.62694 },
            zoom: 11,
            basemaps: [{
                layerUrl: commonMethod.url.layerUrl,
                visible: true
            }]
        }
        return obj;
    },
    // 初始化地图：id为map的
    initMap(lmap) {
        const timer = setInterval(function () {
            if (sessionStorage.getItem("startInitMap"))
            {
                lmap.InitMap(arcgis.initMapParams(), function () { });
                clearInterval(timer);
            }
        }, 10);
    },
    //问题点管理，arcgis加载
    gridIssueMap(obj) {
        const timer = setInterval(function () {
            if (sessionStorage.getItem("startInitMap") && obj.lmap && obj.lmap.InitMap1)
            {
                obj.lmap.InitMap1('gridIssueMap', arcgis.initMapParams(obj.x, obj.y), function () { });
                clearInterval(timer);
            }
        }, 10);
    },
    //场景问题页面arcgis
    sceneIssueMap(obj) {
        const timer = setInterval(function () {
            if (sessionStorage.getItem("startInitMap") && obj.lmap && obj.lmap.InitMap1)
            {
                obj.lmap.InitMap1('sceneIssueMap', arcgis.initMapParams(obj.x, obj.y), function () { });
                clearInterval(timer);
            }
        }, 10);
    },
    // MR与仿真数据综合呈现，arcgis加载
    lteMrMap(obj) {
        const timer = setInterval(function () {
            if (sessionStorage.getItem("startInitMap") && obj.lmap && obj.lmap.InitMap1)
            {
                obj.lmap.InitMap1('lteMrMap', arcgis.initMapParams(), function () {
                    // arcgisConfig.pointConfig(obj)
                });
                clearInterval(timer);
            }
        }, 10);
    },
    // 投诉管理arcgis地图arcgis加载   
    issueManageComplaintMap(obj) {
        const timer = setInterval(function () {
            if (sessionStorage.getItem("startInitMap") && obj.lmap && obj.lmap.InitMap1)
            {
                obj.lmap.InitMap1('complaintMap', arcgis.initMapParams(), function () {
                });
                clearInterval(timer);
            }
        }, 10);
    },
    // 初始化地图：id为map的
    initMap1(lmap) {
        const timer = setInterval(function () {
            if (sessionStorage.getItem("startInitMap") && obj.lmap && obj.lmap.InitMap1)
            {
                lmap.InitMap1('map1', arcgis.initMapParams(), function () { });
                clearInterval(timer);
            }
        }, 10);
    },

}

export {
    arcgis
}
