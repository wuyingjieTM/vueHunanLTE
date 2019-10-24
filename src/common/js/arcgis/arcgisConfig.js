function pointover() { }
function pointclick() { }
function pointdbclick() { }
const eventJson = {
    mouseClick: "pointclick",
    mousedbClick: "pointdbclick",
    mouseOver: "pointover"
};



const arcgisConfig = {
    // arcgis地图上的点
    pointConfig(obj) {
        var cityPoint = [
            {
                "geometry": {
                    "x": parseFloat(obj.x) || 112.40736,
                    "y": parseFloat(obj.y) || 27.62694,
                    "spatialReference": { "wkid": 4326 }
                },
                // Tooltip: "<div style='font-size: 14px;font-weight: 700;line-height: 40px'>北京</div>"
                // "attributes": { "ID": "1", "type": "municipality", "name": '', "pop": 50, },
                // "infoTemplate": { "title": "${name}", "content": "类型: ${type} <br/>人口: ${pop} <br/> Plant Name:${Plant}" }
            }
        ]
        var uvrSimpleJson = {
            "type": "uniqueValue",
            "field1": "ID",
            "defaultSymbol": {
                // "url": "img/map/point_7.png",
                "url": "/static/images/arcgis/point_1.png",
                "height": 16,
                "width": 10,
                "angle": 0,
                "xoffset": 0,
                "yoffset": 0,
                "type": "esriPMS",
            }
        }
        var graJsonPoint = {
            geometry: cityPoint,
            gra: {
                layerID: "arcgis",
                // visible: true,
                symbol: uvrSimpleJson,
            },
            event: eventJson,
            zoom: 15
        };
        obj.lmap.LayerClear("arcgis");
        obj.lmap.AddNewPoints(graJsonPoint);
    },
    // arcgis地图上的柵格
    gridConfig(obj) {
        var config = {
            "type": "classBreaks",
            "field": "rsrp",
            "minValue": 0,
            "defaultLabel": "no data",
            "defaultSymbol": {
                "type": "esriSFS",
                "color": [128, 128, 128, 180],
                "outline": {
                    "type": "esriSLS",
                    "color": [255, 255, 255, 255],
                    "width": 0.5,
                    "style": "esriSLSSolid"
                }
            },
            "classBreakInfos": [
                {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [255, 0, 0, 180],
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 255],
                            "width": 0.5,
                            "style": "esriSLSSolid"
                        }, "style": "esriSFSSolid"
                    },
                    "classMaxValue": 30
                }, {
                    "symbol": {
                        "type": "esriSFS", "color": [0, 255, 0, 180],
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 100],
                            "width": 0.5,
                            "style": "esriSLSSolid"
                        }, "style": "esriSFSSolid"
                    },
                    "classMaxValue": 40
                }, {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [0, 0, 255, 180],
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 255],
                            "width": 0.5,
                            "style": "esriSLSSolid"
                        }, "style": "esriSFSSolid"
                    },
                    "classMaxValue": 50
                }, {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [0, 136, 55, 180],
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 255],
                            "width": 0.5,
                            "style": "esriSLSSolid"
                        },
                        "style": "esriSFSSolid"
                    },
                    "classMaxValue": 500
                }
            ],
            "visualVariables": [
                {
                    "type": "rotationInfo",
                    "field": "ID",
                    "rotationType": "geographic"
                }
            ]
        }

        // tip:显示的栅格内容
        var content = '';
        if ("gridIssueMap" == obj.gisName)
        {
            content = "经度: ${x} <br/> 维度: ${y}<br/>gridID: ${gridID}<br/>栅格类型: ${type}<br/>";
        }
        var cityPoint = []
        obj.target.forEach(function (item) {
            cityPoint.push(
                {
                    "attributes": {
                        ID: (parseInt(item.rsrp) + 140),
                        "x": item.x,
                        "eci": item.eci,
                        "gridID": item.cellname,
                        "rsrp": item.rsrp,
                        "y": item.y,
                        "type": item.type,
                        "yd_mrreport": item.yd_mrreport,
                        "ydover110": item.ydover110,
                        "ydrsrpsum": item.ydrsrpsum,
                        "rsrp": item.rsrp,
                        Tooltip: "<div></div>"
                    },
                    "infoTemplate": {
                        "title": "栅格信息",
                        "content": content
                    },
                    "geometry": { "rings": [[[item.x - 0.000243, item.y - 0.000226], [item.x + 0.000243, item.y - 0.000226], [item.x + 0.000243, item.y + 0.000226], [item.x - 0.000243, item.y + 0.000226], [item.x - 0.000243, item.y - 0.000226]]] }
                    // // // // "geometry": { "rings": [[[item.x, item.y], [item.x + 0.01, item.y], [item.x + 0.01, item.y + 0.01], [item.x, item.y + 0.01], [item.x, item.y]]] }
                }
            )
        })
        var graJsonGrid = {
            geometry: cityPoint,
            fieldRadius: "pop",
            gra: {
                layerID: obj.gisName,
                symbol: config,
                scale: { max: obj.range }
            },
            event: eventJson,
            // zoom:obj.numZoom
        };
        obj.lmap.AddNewPolygons(graJsonGrid);
    },
    // arcgis地图上的连线
    lineConfig(obj) {
        var cityPoint = [];
        obj.target.forEach(function (item) {
            cityPoint.push(
                {
                    geometry: {
                        "paths": [
                            [[obj.source.x, obj.source.y], [item.x, item.y]],
                        ],
                        "spatialReference": { "wkid": 4326 }
                    },
                    "attributes": { "ID": item.id, x: item.x, y: item.y, Tooltip: "<div></div>" },
                    "infoTemplate": {
                        "title": "连线信息", "content": "小区名: ${name}<br/> 经度：${x} <br/> 维度：${y}<br/> " +
                            ""
                    }
                }
            )
        })

        var config = {
            "type": "classBreaks",
            "minValue": 0,
            "field": "ID",
            "defaultSymbol": {
                "type": "esriSLS",
                "color": [0, 0, 255, 255],
                "width": 1
            },
            "classBreakInfos": [
                {
                    "symbol": {
                        "type": "esriSLS",
                        "color": [237, 173, 7, 200],//土色
                        "width": 1
                    },
                    "classMaxValue": 1
                },
                {
                    "symbol": {
                        "type": "esriSLS",
                        "color": [251, 255, 13, 200],//黄色
                        "width": 1
                    },
                    "classMaxValue": 2
                }
                ,
                {
                    "symbol": {
                        "type": "esriSLS",
                        "style": "esriSLSDash",
                        "color": [255, 0, 0, 200],//褐色
                        "width": 1
                    },
                    "classMaxValue": 3
                },
                {
                    "symbol": {
                        "type": "esriSLS",
                        "color": [0, 67, 255, 200],//蓝色
                        "width": 1
                    },
                    "classMaxValue": 4
                },
                {
                    "symbol": {
                        "type": "esriSLS",
                        "style": "esriSLSDash",
                        "color": [0, 67, 255, 200],//蓝色
                        "width": 1
                    },
                    "classMaxValue": 5
                },
                {
                    "symbol": {
                        "type": "esriSLS",
                        "style": "esriSLSDash",
                        "color": [0, 67, 255, 200],//蓝色
                        "width": 1
                    },
                    "classMaxValue": 10000
                }
            ]
        }
        //加载线形图
        var graJsonLine = {
            geometry: cityPoint,
            gra: {
                layerID: obj.gisName,
                symbol: config,
                // scale: {min: 0, max: 1000}
            },
            center: obj.source,
            event: eventJson,
        };
        obj.lmap.AddNewPolylines(graJsonLine);
    },
    // arcgis地图上的扇形
    sectorConfig(obj) {
        var cityPoint = [];
        obj.target.forEach(function (item) {
            cityPoint.push(
                {
                    "geometry": { "x": item.x, "y": item.y, "spatialReference": { "wkid": 4326 } },
                    "attributes": {
                        "x": item.x,
                        "eci": (item.eci),
                        "y": item.y,
                        "ID": (item.id),
                        "name": (item.name),
                        "pop": (item.pop),
                        // Tooltip: "<div></div>"
                    },
                    "infoTemplate": {
                        "title": "扇形信息",
                        // + (obj.describe || ''
                        "content": "ECI: ${eci}<br/> 方向角: ${pop}<br/> 经度: ${x}<br/> 纬度: ${y}<br/> <span id='curAnalyze'></span>"
                    }
                }
            )
        })
        var config = {
            "type": "classBreaks",
            "field": "ID",
            "minValue": 0,
            "defaultLabel": "no data",
            "defaultSymbol": {
                "type": "esriSFS",
                "color": [128, 128, 128, 255],
                "outline": {
                    "type": "esriSLS",
                    "color": [255, 255, 255, 255],
                    "width": 0,
                    "style": "esriSLSSolid"
                }
            },
            "classBreakInfos": [
                {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [190, 215, 190, 200],// 绿色
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 255],
                            "width": 0,
                            "style": "esriSLSSolid"
                        }, "style": "esriSFSSolid"
                    },
                    "label": "< 35%",
                    "classMaxValue": 10
                }, {
                    "symbol": {
                        "type": "esriSFS", "color": [251, 255, 13, 220],//黄色
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 100],
                            "width": 0,
                            "style": "esriSLSSolid"
                        }, "style": "esriSFSSolid"
                    },
                    "label": "35 - 50%",
                    "classMaxValue": 50
                }, {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [255, 177, 0, 220],//橙色
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 225],
                            "width": 0.3,
                            "style": "esriSLSSolid"
                        }, "style": "esriSFSSolid"
                    },
                    "label": "50 - 75%",
                    "classMaxValue": 80
                }, {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [255, 83, 0, 220],//红色
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 255],
                            "width": 0,
                            "style": "esriSLSSolid"
                        },
                        "style": "esriSFSSolid"
                    },
                    "label": "> 80%",
                    "classMaxValue": 100
                },
                {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [255, 255, 0, 220],//褐色
                        "outline": {
                            "type": "esriSLS",
                            "color": [255, 255, 255, 255],
                            "width": 0,
                            "style": "esriSLSSolid"
                        },
                        "style": "esriSFSSolid"
                    },
                    "label": "> 90%",
                    "classMaxValue": 200
                },
                {
                    "symbol": {
                        "type": "esriSFS",
                        "color": [0, 200, 0, 200],
                        "outline": {
                            "type": "esriSLS",
                            "color": [100, 220, 100, 200],//黑色
                            "width": 0,
                            "style": "esriSLSSolid"
                        },
                        "style": "esriSFSSolid"
                    },
                    "label": "> 100%",
                    "classMaxValue": 1000000000
                }
            ],
            "visualVariables": [
                {
                    "type": "rotationInfo",
                    "field": "ID",
                    "rotationType": "geographic"
                }
            ]
        }
        var graJsonSector = {
            geometry: cityPoint,
            fieldRadius: "pop",
            angle: obj.angle || 45,
            radius: obj.radius || 1200,
            gra: {
                layerID: (obj.coverageName || "coverageName"),
                symbol: config,
            },
            textgra: {},
            event: eventJson,
        };
        obj.lmap.AddShanyePolygons(graJsonSector);
    }
}


export {
    arcgisConfig
}
