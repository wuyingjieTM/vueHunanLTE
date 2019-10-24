import selectData from "../data/selectData.json"

// 将对象转化为数组
const commonMethod = {
    url: {
        // 湖南部署
        baseURL: "http://" + location.host + "/LteCoverWeb/",
        layerUrl: "http://10.159.55.37:6080/arcgis/rest/services/HUNANLTE/MapServer",
        // layerShan: "http://10.159.55.37:6080/arcgis/rest/services/HUNANNEWCELL/MapServer",
        // layerUrl: "http://10.159.55.4:6080/arcgis/rest/services/hunan/MapServer",
        // layerShan: "http://10.159.55.4:6080/arcgis/rest/services/HUNANNEWCELL/MapServer",
        imgUrl: "http://10.159.55.35:8080/arcgis4.9/arcgisConfig/point.svg",
        // 公司部署
        // baseURL: "http://" + location.host + "/LteCoverWeb/",
        // layerUrl: "http://" + location.hostname + ":6080/arcgis/rest/services/hunanall/MapServer",
        // imgUrl: "http://" + location.hostname + ":8080/arcgis/arcgisConfig/point.png",
        // // 设计院
        // baseURL: "http://124.205.224.235:8080/LteCoverWeb/",
        // layerUrl: "http://124.205.224.235:6080/arcgis/rest/services/hunanall/MapServer",//发布的地图服务
        // // layerUrl: "http://124.205.224.235:6080/arcgis/rest/services/SITETEST/MapServer",//临时测试接口
        // // imgUrl: "http://124.205.224.235:8080/arcgis/arcgisConfig/point.svg",
        // imgUrl: "http://127.0.0.1/arcgis4.9/arcgisConfig/point.svg"
        // 张梦迪
        // baseURL: "http://169.254.11.5:8080/LteCoverWeb/",
        // layerUrl: "http://192.168.2.218:6080/arcgis/rest/services/hunanall/MapServer"
        // 张梦迪（设计院） 
        // baseURL: "http://10.254.188.206:8080/LteCoverWeb/",
        // layerUrl: "http://124.205.224.235:6080/arcgis/rest/services/hunanall/MapServer",
        // imgUrl: "http://127.0.0.1/arcgis4.9/arcgisConfig/point.png",
        // 开发
        // baseURL: "http://192.168.2.218:8080/LteCoverWeb/",
        // layerUrl: "http://192.168.2.218:6080/arcgis/rest/services/hunanall/MapServer",
        // imgUrl: "http://127.0.0.1/arcgis4.9/arcgisConfig/point.png",
    },

    // 获取返回数据 
    getData: function (data) {
        return JSON.parse(data.data.body)
    },
    // 动态生成script标签
    createScript: function (url) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        head.appendChild(script);
    },
    // 处理 :"栅格问题"、"场景问题"、 "竞对问题"tab  切换状态
    dealTabs: function (data) {
        const obj = {
            isSelect: '',
            arr: []
        }
        var preSelect = true;
        for (let k in selectData.gridIssueTabs)
        {
            obj.arr.push({
                text: selectData.gridIssueTabs[k],
                // value: data[k] == 0 ? true : false, //禁用标签
                value: false,
                num: data[k]
            })

            if (preSelect && (0 != data[k]))
            {
                preSelect = false;
                obj.isSelect = selectData.gridIssueTabs[k];
            }
        }
        return obj;
    },
}

// 项目加载完成之后，初始化地图
window.onload = function () {
    sessionStorage.setItem("startInitMap", true)
}

export {
    commonMethod
}
