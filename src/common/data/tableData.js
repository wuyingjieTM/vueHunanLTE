
const tableData = {
    comHead: [{
        field: "date",
        title: "日期"
    },
    {
        field: "city",
        title: "城市"
    },
    {
        field: "gridID",
        title: "柵格ID"
    },
    {
        field: "scenceType",
        title: "归属场景类型"
    },
    {
        field: "scenceName",
        title: "归属场景名称"
    },
    {
        field: "gridType",
        title: "栅格类型"
    },
    {
        field: "gridAllCount",
        title: "移动栅格总采样点数"
    }
        ,
    {
        field: "overPartGridCount",
        title: "移动栅格大于-110采样点数"
    }
        ,
    {
        field: "YDCoverage",
        title: "移动覆盖率"
    }
        ,
    {
        field: "LTCoverage",
        title: "联通覆盖率"
    }
        ,
    {
        field: "DXCoverage",
        title: "电信覆盖率"
    }
        ,
    {
        field: "complaintWorkOrder",
        title: "栅格内投诉工单"
    }
        ,
    {
        field: "programState",
        title: "状态"
    }
        ,
    {
        field: "programReport",
        title: "分析报告"
    }],
    head: [
        {
            field: "city",
            title: "城市"
        },
        {
            field: "scence",
            title: "场景分类"
        },
        {
            field: "classify",
            title: "二级分类"
        },
        {
            field: "scenceName",
            title: "场景名称"
        },
        {
            field: "allNumber",
            title: "总采点数"
        },
        {
            field: "sambleNumber",
            title: "小于-110采样点数"
        },
        {
            field: "samblePersent",
            title: "小于-110采样点占比%"
        }
    ],
    body: [
        {
            city: "长沙",
            scence: "高校",
            classify: "教学区",
            scenceName: "湖南大学",
            allNumber: "8778485",
            sambleNumber: "79006",
            samblePersent: "0.9"
        },
        {
            city: "长沙",
            scence: "高校",
            classify: "教学区",
            scenceName: "湖南大学",
            allNumber: "8778485",
            sambleNumber: "79006",
            samblePersent: "0.9"
        }
    ]
}




export default {
    tableData
}
