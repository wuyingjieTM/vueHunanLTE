import echarts from "echarts"; //引入echarts
import "echarts/map/js/china"
import "echarts/map/js/province/hunan"
// import 'echarts/theme/shine'



// 含有坐标轴的Echarts（柱状图、折线图） 含有坐标轴的Echarts（ 柱状图、 折线图） 含有坐标轴的Echarts（ 柱状图、 折线图）

const echartsAxisConfig = ({
    // x轴和y轴数据
    xData = [],
    yData = [],
    min = null,
    max = null,
    formatter = "{b}" + " : " + "{c}",

    // x轴和y轴线顶端文字(x轴和y轴上的文字)
    xTitla = "",
    yTitla1 = "",
    yTitla2 = "",
    isYAxis = false, //是否显示右侧的Y轴yAxisIndex: 1
    xTextBottomDistance = 20,
    // yAxisIndex: 1,
    axisTextShow = true, //x轴上的文字是否显示
    axisColor = "#999",
    lineColor = '#f0f0f0',
    axisTextColor = '#999',
    xAxisPosition = 'middle',
    // Echart中legend
    lengData = [],
    lengLeft = 'center',
    legendTop = 0,
    lengType = 'scroll',
    lengOrient = 'horizontal', //竖直方向：vertical  水平方向：horizontal
    // title部分的设置
    textTitle = '',
    textTop = '5%',
    textLeft = 'center',
    titleColor = '#999',
    titleFont = '12px',
    // echart中X轴基本信息配置
    aroundPad = null,
    interval = 0,
    rotate = 0,
    barColor = '#3398DB',
    barWidth = null,
    center = ['50%', '50%'],
    barNumber = null,

    //X轴上的显示工具
    isDataZoomD = false,
    start = 0,
    end = 100,

    // 加载前设置echart的宽度和高度
    chartHeight = '',
    target = '',
    //   柱状图上是否显示信息
    seriesShow = false,
    color = [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
    ],
    borderColor = [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
    ],
}) => {
    // 添加echarts
    const myChart = echarts.init(target);
    // 指定图表的配置项和数据
    const shouYdata = (yData) => {
        const yDataArr = [];
        for (let item of yData)
        {
            const obj = {};
            for (var key of Object.keys(item))
            {
                obj[key] = item[key];
            }
            yDataArr.push(obj);
        }
        return yDataArr;
    }

    const leng = xData.length;
    if (barNumber && (leng > barNumber))
    {
        isDataZoomD = true

        if (!aroundPad)
        {
            aroundPad = ["40px", "20px", "25px", "20px"];
        }
        end = parseInt(100 * barNumber / leng);

    } else
    {
        isDataZoomD = false;
        if (!aroundPad)
        {
            aroundPad = ["40px", "20px", "25px", "20px"]
        }
    }

    const option = {
        dataZoom: { //X轴上的显示工具
            show: isDataZoomD,
            type: 'slider',
            start: start,
            end: end
        },
        title: {
            text: textTitle,
            textStyle: {
                color: titleColor,
                fontSize: titleFont,
                verticalAlign: "middle",
            },
            top: textTop,
            left: textLeft,
        },
        tooltip: {
            trigger: 'item',
            formatter: formatter
        },

        legend: {
            type: lengType,
            orient: lengOrient,
            show: "true",
            zlevel: 1000,
            left: lengLeft,
            top: legendTop,
            data: lengData,
            z: 2,
        },
        grid: { //用来在直角坐标系内绘制网格（如直线图，网状图，散点图）
            top: aroundPad[0],
            bottom: aroundPad[1],
            left: aroundPad[2],
            right: aroundPad[3],
            containLabel: true
        },
        xAxis: { //坐标系中的X轴
            name: xTitla,
            type: 'category',
            axisLine: { //坐标轴样式的设置
                lineStyle: {
                    color: axisColor,
                    width: 1,
                    left: 20
                }
            },
            axisTick: { //坐标轴刻度相关设置
                "show": true,
                inside: true, // 控制小标记是否在grid里
                length: 0, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: axisColor,
                    width: 1
                }
            },
            axisLabel: { // x轴上的字体显示
                show: axisTextShow,
                interval: interval,
                rotate: rotate,
                textStyle: {
                    color: axisTextColor,
                    fontSize: 12
                }
            },
            boundaryGap: true, //false时X轴从0开始
            nameLocation: xAxisPosition,
            nameGap: xTextBottomDistance,
            data: xData
        },
        yAxis: [{ //坐标轴中的Y轴
            name: yTitla1,
            min: min,
            max: max,
            axisLine: { //坐标轴样式的设置
                lineStyle: {
                    color: axisColor,
                    width: 1,
                    left: 20
                }
            },
            splitLine: { // 内容该区域，线的颜色
                show: true,
                lineStyle: {
                    color: lineColor,
                    type: 'dashed'
                }
            },
            "axisTick": { // 在y轴上是否要多出数字的指向线
                "show": false
            },
            axisLabel: { // x轴上的字体显示
                textStyle: {
                    color: axisTextColor,
                    fontSize: 12
                }
            },
            type: 'value',
        }, { //坐标轴中的Y轴
            show: isYAxis,
            name: yTitla2,
            axisLine: { //坐标轴样式的设置
                lineStyle: {
                    color: axisColor,
                    width: 1,
                    left: 20
                }
            },
            splitLine: { // 内容该区域，线的颜色
                show: true,
                lineStyle: {
                    color: lineColor
                }
            },
            "axisTick": { // 在y轴上是否要多出数字的指向线
                "show": false
            },
            axisLabel: { // x轴上的字体显示
                textStyle: {
                    color: axisTextColor,
                    fontSize: 12
                }
            },
            type: 'value',
        }],
        series: shouYdata(yData)
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.clear();
    myChart.setOption(option);
}


// 反向柱状图
const echartsRevertBar = ({
    target = '',
    xData = [],
    yData = [],
    aroundPad = ["40px", "20px", "25px", "20px"],
    barMaxWidth = 35,
    min = 0,
    max = 100,
    formatter = "{c}%",
    unit = '',//单位
    // title部分的设置
    textTitle = '',
    textTop = '5%',
    textLeft = 'center',
    titleColor = '#999',
    titleFont = '12px',
    callBack
}) => {
    // 添加echarts
    const myChart = echarts.init(target);
    const option = {
        color: ['#3398DB'],
        title: {
            text: '',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: formatter
        },
        title: {
            text: textTitle,
            textStyle: {
                color: titleColor,
                fontSize: titleFont,
                verticalAlign: "middle",
            },
            top: textTop,
            left: textLeft,
        },
        grid: { //用来在直角坐标系内绘制网格（如直线图，网状图，散点图）
            top: aroundPad[0],
            bottom: aroundPad[1],
            left: aroundPad[2],
            right: aroundPad[3],
            containLabel: true
        },
        xAxis: {
            min: min,
            max: max,
            type: 'value',
            boundaryGap: [0, 10],
            interval: 20,
            axisLabel: {
                formatter: '{value}' + unit,
                textStyle: {
                    fontWeight: '80'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: yData,
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 0,
                margin: 10,
                inside: false,
                textStyle: {
                    fontWeight: '50'
                }
            }
        },
        series: [{
            type: 'bar',
            data: xData,
            barMaxWidth: barMaxWidth,
            label: {
                normal: {
                    show: true,
                    formatter: function (v) {
                        var val = v.data;
                        if (val == 0)
                        {
                            return '';
                        }
                        return val + " " + unit;
                    },
                    color: '#fff'
                }
            },
        }]
    };

    myChart.off('click');
    myChart.on('click', function (params) {
        if (callBack)
        {
            callBack(params)
        }
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.clear();
    myChart.setOption(option);
}

// 瀑布图
const echartsWaterfall = ({
    // x轴和y轴数据
    data = [],
    level = [],
    xData = [],
    yData = [],
    // x轴和y轴线顶端文字(x轴和y轴上的文字)
    xTitle = "",
    yTitle1 = "",
    yTitle2 = "",
    isYAxis = false, //是否显示右侧的Y轴
    xTextBottomDistance = 20,
    // yAxisIndex: 1,
    axisTextShow = true, //x轴上的文字是否显示
    axisColor = "#999",
    lineColor = '#f0f0f0',
    axisTextColor = '#999',
    xAxisPosition = 'middle',
    // Echart中legend
    lengData = [],
    lengLeft = 'center',
    lengType = 'scroll',
    lengOrient = 'horizontal', //竖直方向：vertical  水平方向：horizontal
    // title部分的设置
    textTitle = '',
    textTop = '5%',
    textLeft = 'center',
    titleColor = '#666',
    titleFont = '12px',
    // echart中X轴基本信息配置
    min = 0,
    max = 120,
    aroundPad = ["40px", "20px", "25px", "20px"],
    interval = 0,
    rotate = 0,
    barColor = '#3398DB',
    barWidth = null,
    center = ['50%', '50%'],

    // formatter
    formatter = {
        'c': "b"
    },
    //X轴上的显示工具
    isDataZoomD = false,
    start = 0,
    end = 100,

    // 加载前设置echart的宽度和高度
    chartHeight = '',
    target = '',
    //   柱状图上是否显示信息
    seriesShow = false,
    color = ['#999', "orange", 'green', '#63E20C', 'blue'],

    // 瀑布图中点击的当前坐标值
    curPlace = [],
    // 回掉函数
    callBack

}) => {
    // 添加echarts
    const myChart = echarts.init(target);
    // 指定图表的配置项和数据
    const option = {
        dataZoom: { //X轴上的显示工具
            show: isDataZoomD,
            type: 'slider',
            start: start,
            end: end
        },
        title: {
            text: textTitle,
            textStyle: {
                color: titleColor,
                fontSize: titleFont,
                verticalAlign: "middle",
            },
            top: textTop,
            left: textLeft,
        },
        tooltip: {
            position: 'top'
        },
        legend: {
            type: lengType,
            orient: lengOrient,
            show: "true",
            zlevel: 1000,
            left: lengLeft,
            top: "0%",
            data: lengData,
            z: 2,
        },
        grid: { //用来在直角坐标系内绘制网格（如直线图，网状图，散点图）
            top: aroundPad[0],
            bottom: aroundPad[1],
            left: aroundPad[2],
            right: aroundPad[3],
            containLabel: true
        },
        xAxis: { //坐标系中的X轴
            name: xTitle,
            type: 'category',
            data: xData,
            splitArea: {
                show: true
            },
            axisLine: { //坐标轴样式的设置
                lineStyle: {
                    color: axisColor,
                    width: 1,
                    left: 20
                }
            },
            axisTick: { //坐标轴刻度相关设置
                "show": true,
                inside: true, // 控制小标记是否在grid里
                length: 0, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: axisColor,
                    width: 1
                }
            },
            axisLabel: { // x轴上的字体显示
                show: axisTextShow,
                interval: interval,
                rotate: rotate,
                textStyle: {
                    color: axisTextColor,
                    fontSize: 12
                }
            },
            boundaryGap: true, //false时X轴从0开始
            nameLocation: xAxisPosition,
            nameGap: xTextBottomDistance,
        },
        yAxis: [{ //坐标轴中的Y轴
            name: yTitle1,
            type: 'category',
            data: yData,
            splitArea: {
                show: true
            },
            axisLine: { //坐标轴样式的设置
                lineStyle: {
                    color: axisColor,
                    width: 1,
                    left: 20
                }
            },
            splitLine: { // 内容该区域，线的颜色
                show: true,
                lineStyle: {
                    color: lineColor
                }
            },
            "axisTick": { // 在y轴上是否要多出数字的指向线
                "show": false
            },
            axisLabel: { // x轴上的字体显示
                textStyle: {
                    color: axisTextColor,
                    fontSize: 12
                }
            },

        }],
        visualMap: {
            min: min,
            max: max,
            color: color,
            calculable: false,
            orient: 'horizontal',
            right: '30px',
            bottom: '10px'
        },
        series: [{
            name: 'Punch Card',
            type: 'heatmap',
            data: data,
            label: {
                normal: {
                    show: true,
                    position: "inside", //文本标签的问题可选值：[outside,inside,cente]
                    textStyle: {
                        fontSize: "12px",
                        color: "#ddd",
                    },
                    formatter: formatter
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    myChart.off('click');
    myChart.on('click', function (params) {
        if (callBack)
        {
            callBack(params.data, level, xData, yData, data)
        }
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.clear();
    myChart.setOption(option);
}

// 饼状图
const echartsConfig = ({
    // 目标元素
    target = '',
    // 饼状图数据
    data = [],
    data2 = [],
    // Echart中legend
    lengData = [],
    lengLeft = 'center',
    lengRight = 'center',
    lengTop = 0,
    lengType = 'scroll',
    islegendShow = true,
    lengOrient = 'horizontal', //竖直方向：vertical  水平方向：horizontal
    // title部分的设置
    textTitle = '',
    textTop = '5%',
    textLeft = 'center',
    titleColor = '#999',
    titleFont = '12px',

    // 饼状图在容器中的位置
    center = ['50%', '50%'],
    center2 = ['50%', '50%'],
    radus = ['45%', '75%'],
    // 鼠标放入饼状图显示：字体
    isLabel = true,
    isLabel2 = false,
    labelPosition = 'outside',
    labelFont = '14px',
    labelColor = '#999',
    formation = '{d}' + '%',
    formation2 = '{d}' + '%',


}) => {
    // 添加echarts
    const myChart = echarts.init(target);
    // 指定图表的配置项和数据
    const option = {
        title: {
            text: textTitle,
            textStyle: {
                color: titleColor,
                fontSize: titleFont,
                verticalAlign: "middle",
            },
            top: textTop,
            left: textLeft,
        },
        tooltip: {},
        legend: {
            type: lengType,
            orient: lengOrient,
            show: islegendShow,
            zlevel: 1000,
            left: lengLeft,
            right: lengRight,
            top: lengTop,
            data: lengData,
            z: 2,
        },
        series: [{
            type: 'pie',
            center: center,
            radius: radus,
            // name: legendData,
            clockWise: true, //顺时加载
            hoverAnimation: true, //鼠标移入变大
            label: { //饼图图形上的文本标签，可用于说明图形的一些数据信息
                normal: {
                    show: isLabel,
                    position: labelPosition, //文本标签的问题可选值：[outside,inside,cente]
                    textStyle: {
                        fontSize: labelFont,
                        color: labelColor,
                    },
                    formatter: formation
                }
            },
            labelLine: { //标签的视觉引导线样式
                normal: {
                    show: isLabel,
                    textStyle: {
                        color: labelColor,
                    },
                    length: 12, //第一段线的长度
                    length2: 12, //第二段线的长度
                    smooth: false, //是否平滑过渡
                }
            },
            data: data
        }, {
            center: center2,
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            //   label: {
            //     normal: {
            //       position: 'inner',
            //     },
            //   },
            tooltip: {
                formatter: formation2
            },
            labelLine: {
                normal: {
                    show: true,
                    length: 60, //第一段线的长度
                    length2: 40, //第二段线的长度
                    smooth: false, //是否平滑过渡
                }
            },
            data: data2
        }]

    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}



// 地图
const echartsMap = ({
    // 当前地市
    curPart = "china",
    // 目标元素
    target = '',
    // 饼状图数据
    data = [],
    // title部分的设置
    textTitle = '',
    textTop = '5%',
    textLeft = 'center',
    titleColor = '#999',
    titleFont = '12px',

    // Echart中图例
    lengData = [],
    lengLeft = 'center',
    lengTop = "5%",
    lengType = 'scroll',
    lengOrient = 'horizontal', //竖直方向：vertical  水平方向：horizontal
    dataRange = null,
    areaColor = 'transparent',

    // 鼠标放入地图显示：字体
    isLabel = true,
    labelPosition = 'outside',
    labelFont = '14px',
    labelColor = '#999',
    formation = '{b}',


    // 回掉函数
    callBack = function () { }


}) => {
    // 添加echarts

    const myChart = echarts.init(target);
    // 指定图表的配置项和数据
    const option = {
        //   backgroundColor:"#999",
        title: {
            text: textTitle,
            textStyle: {
                color: titleColor,
                fontSize: titleFont,
                verticalAlign: "middle",
            },
            top: textTop,
            left: textLeft,
        },
        dataRange: dataRange,
        visualMap: { //用来设置地图上的散点数据
            left: -3000,
            bottom: 0,
            calculable: false,
            min: 0,
            max: 2500,
        },
        tooltip: {
            trigger: 'item',
            formatter: formation
        },
        legend: {
            type: lengType,
            orient: lengOrient,
            show: false,
            zlevel: 1000,
            left: lengLeft,
            top: lengTop,
            data: lengData,
            z: 2,
        },
        toolbox: {
            show: false,
            orient: 'vertical',
            right: '20px',
            top: 'center',
            feature: {
                dataView: {
                    //   readOnly: false
                    title: [{
                        text: '类别展示'
                    }],
                    optionToContent: (item) => {
                    }
                },
                saveAsImage: {}
            }
        },
        itemStyle: {
            areaColor: "#999",
            //   opacity: 0
        },
        series: [{
            type: 'map',
            mapType: curPart,
            label: { //饼图图形上的文本标签，可用于说明图形的一些数据信息
                normal: {
                    show: isLabel,
                    position: labelPosition, //文本标签的问题可选值：[outside,inside,cente]
                    textStyle: {
                        fontSize: labelFont,
                        color: labelColor,
                    },
                    formatter: "{b}"
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: "#666",
                    areaColor: areaColor, //"rgba(0,0,0,.4)"

                },
                emphasis: {
                    areaColor: '#999', //'#389BB7'
                    borderWidth: 1
                }
            },
            roam: false,
            data: data
        }]

    };
    myChart.off('click');
    myChart.on('click', function (params) {
        callBack(params.data)
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.clear();
    myChart.setOption(option);

}


// 日历坐标系（热力图）
const echartsCalendar = ({
    target = '',
    // x轴和y轴数据
    data = [],
    xData = [],
    yData = [],

    // x轴和y轴线顶端文字(x轴和y轴上的文字)
    yTitle = "",
    xTitle = "",

    // title配置
    textTitle = '',
    titleTop = '15px',
    titleLeft = 'center',


    // 基本配置
    max = "",
    min = "",
    level = "",
    color = ['red', '#a2ec84', 'blue'],
    aroundPad = ["5%", "5%", "5%", "5%"],
    formatter = "{b}" + " : " + "{c}",

}) => {

    const myChart = echarts.init(target);
    // 指定图表的配置项和数据
    const option = {
        title: [{
            text: textTitle,
            top: titleTop,
            left: titleLeft,
            textStyle: {
                color: '#999',
                fontSize: '14',
                fontWeight: 400,
            },
            subtextStyle: {
                fontSize: 14,
                color: '#ffd285',
            }
        }],
        tooltip: {
            position: 'top'
        },
        animation: false,
        grid: { //用来在直角坐标系内绘制网格（如直线图，网状图，散点图）
            top: aroundPad[0],
            bottom: aroundPad[1],
            left: aroundPad[2],
            right: aroundPad[3],
            containLabel: true
        },

        xAxis: {
            name: xTitle,
            type: 'category',
            data: xData,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            name: yTitle,
            type: 'category',
            data: yData,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: min,
            max: max,
            color: color,
            calculable: false,
            orient: 'horizontal',
            right: '100px',
            bottom: '0px'
        },
        series: [{
            name: 'Punch Card',
            type: 'heatmap',
            data: data,
            label: {
                normal: {
                    show: true,
                    position: "inside", //文本标签的问题可选值：[outside,inside,cente]
                    textStyle: {
                        fontSize: "12px",
                        color: "#ddd",
                    },
                    formatter: formatter
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart.clear();
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}


// 极坐标系
const echartsPolar = ({
    target = '',
    // x轴和y轴数据
    data1 = [],
    data2 = [],

    // x轴和y轴线顶端文字(x轴和y轴上的文字)
    yTitle = "",
    xTitle = "",

    // title配置
    textTitle = '',
    titleTop = '15px',
    titleColor = '#ddd',
    titleFont = '12px',
    titleLeft = 'center',

    // 基本配置
    aroundPad = ["5%", "5%", "5%", "5%"],

}) => {

    const myChart = echarts.init(target);
    // 指定图表的配置项和数据
    const option = {

        title: [{
            text: textTitle,
            top: titleTop,
            left: titleLeft,
            textStyle: {
                color: titleColor,
                fontSize: titleFont,
                fontWeight: 400,
            },
            subtextStyle: {
                fontSize: 14,
                color: '#ffd285',
            }
        }],
        legend: {
            // data2: ['line']
        },
        grid: { //用来在直角坐标系内绘制网格（如直线图，网状图，散点图）
            left: aroundPad[0],
            right: aroundPad[1],
            top: aroundPad[2],
            bottom: aroundPad[3],
        },
        polar: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        angleAxis: {
            type: 'value',
            startAngle: 0
        },
        radiusAxis: {},
        series: [{
            coordinateSystem: 'polar',
            // name: 'line',
            type: 'line',
            data: data1
        }, {
            coordinateSystem: 'polar',
            // name: 'line',
            type: 'line',
            data: data2
        }]
    };
    myChart.clear();
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}


export {
    echartsAxisConfig,
    echartsConfig,
    echartsMap,
    echartsWaterfall,
    echartsRevertBar,
    echartsPolar,
    echartsCalendar
}
