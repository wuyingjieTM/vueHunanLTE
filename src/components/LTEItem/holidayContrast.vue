<template>
  <div class="hello mt10">

    <div>
      <v-breadcrumb>
        <v-breadcrumb-item>节假日对比</v-breadcrumb-item>
      </v-breadcrumb>
    </div>

    <div class="mt15">
      <v-more-panel>
        <v-form slot="form">
          <v-form-item label="时段一">
            <v-date-picker
              range
              style="width: 200px;"
              v-model="date1"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="时段二">
            <v-date-picker
              range
              style="width: 200px;"
              v-model="date2"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="地市">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.allProvince"
              v-model="ruleForm.city"
            ></v-select>
          </v-form-item>
          <v-form-item label="场景分类">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.scene_type"
              v-model="ruleForm.scene_type"
            ></v-select>
          </v-form-item>
        </v-form>
        <div>
          <v-button
            type="primary"
            @click="toSearch"
            icon="search"
          >查询</v-button>
          <v-button
            type="primary"
            icon="sync"
          >条件重置</v-button>
          <v-button
            type="primary"
            icon="arrow-down"
            @click="clickLoad()"
          >导出</v-button>
        </div>
      </v-more-panel>
    </div>

    <div class="mt15">
      <text-table
        :hideSizeChanger=true
        :isReload="isReload"
        @reloadTable="reloadTable"
        :tabPage=ruleForm.page
        :tabSize=ruleForm.limit
        :tabHead="tabHead"
        :totallist="totallist"
        :tabBody="tabBody"
      ></text-table>
    </div>

    <!-- tabs -->
    <div class="mt15 tabs">
      <v-tabs
        active-tab-key=tabsArr[0]
        @tab-click="tabsTable"
      >
        <template v-for="item in tabsArr">
          <v-tab-pane
            :tab-key=item
            :tab=item
          > </v-tab-pane>
        </template>
      </v-tabs>
      <div
        class="containBorder mt5"
        style="height:400px"
        ref="holidayContrastEchart"
      ></div>
    </div>

    <!-- 当前小区详情 -->
    <div>
      <div class="clearfix mt15">
        <!-- <v-button
          class="pull-right"
          slot="control"
          type="primary"
          html-type="button"
          icon="arrow-down"
        >导出</v-button> -->
      </div>
      <div class=" containBorder p15 mt10 font12">
        <template v-for="item of holidayContrastCounclued">
          <p style="line-height:2;">{{item}}</p>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from "axios";
  import { httpUrl } from "../../common/js/setting";
  import { commonMethod } from "../../common/js/common";
  import arcgisData from "../../common/data/arcgisData.js";
  import { arcgis } from "../../common/js/arcgis/arcgis.js";
  import tableData from "../../common/data/tableData.json";
  import { dealArr } from "../../common/js/dealArr.js";
  import { dealTime } from "../../common/js/dealTime.js";
  import allProvince from "../../common/data/allCityData.json";
  import selectData from "../../common/data/selectData.json";
  import {
    echartsAxisConfig,
    echartsConfig,
    echartsMap,
    echartsWaterfall,
    echartsRevertBar,
    echartsPolar,
    echartsCalendar
  } from "../../common/js/echartsConfig";
  import { http } from "../../common/js/es6";

  export default {
    data: () => {
      return {
        params: {},
        allowClear: false,
        totallist: 0,
        isReload: false,
        tabsArr: ["流量", "覆盖率", "无线接通率", "无线掉线率", "切换成功率"],
        tabHead: tableData.holidayContrastTable,
        tabBody: [],
        barDatas: [],
        date1: ["2018-07-01", "2018-08-20"],
        date2: ["2018-08-20", "2018-10-25"],
        ruleForm: {
          date1: "",
          date2: "",
          city: "长沙",
          scene_type: "高校",
          page: 1,
          limit: 10
        },
        resetPage: false,
        curTabsVal: "pdcp",
        onlyOne: true, //柱状图只能在查询的时候更新
        allSelect: { allProvince: [] },
        holidayContrastCounclued: []
      };
    },
    methods: {
      clickLoad() {
        var obj = { export_flag: 1 };
        for (var key of Object.keys(this.ruleForm)) {
          obj[key] = this.ruleForm[key];
        }
        httpUrl.downLoad({ url: "holidayCompared/compared", param: obj })
        return false;
      },
      // 点击echarts标签
      tabsTable(item) {
        const _this = this;
        switch (item) {
          case "流量":
            _this.curTabsVal = "pdcp";
            this.holidayContrastEchart("pdcp");
            break;
          case "覆盖率":
            _this.curTabsVal = "cover";
            this.holidayContrastEchart("cover");
            break;
          case "无线接通率":
            _this.curTabsVal = "connection_rate";
            this.holidayContrastEchart("connection_rate");
            break;
          case "无线掉线率":
            _this.curTabsVal = "drop_rate";
            this.holidayContrastEchart("drop_rate");
            break;
          case "切换成功率":
            _this.curTabsVal = "ho_succ";
            this.holidayContrastEchart("ho_succ");
            break;
        }
      },
      // search
      toSearch() {
        this.ruleForm.page = 1;
        this.onlyOne = true;
        // 从新加载table表格
        this.isReload = !this.isReload;
        this.resetPage = true;
        // 从新加载折线图
        this.holidayContrastEchart(this.curTabsVal);
        //   获取结论
        this.holidayContrastConclusion();
        return false;
      },
      // 从新加载table
      reloadTable(item) {
        console.log(this.resetPage);
        if (this.resetPage) {
          this.ruleForm.page = 1;
          this.ruleForm.limit = 10;
          this.resetPage = false;
        } else {
          this.ruleForm.page = item.tabPage;
          this.ruleForm.limit = item.tabSize;
        }
        this.holidayContrastTable();
      },
      //   table表格
      holidayContrastTable() {
        this.ruleForm.date1 = this.date1.join("~");
        this.ruleForm.date2 = this.date2.join("~");
        const _this = this;
        httpUrl.url
          .holidayContrastTable({
            param: _this.ruleForm
          })
          .then(function(data) {
            const getData = commonMethod.getData(data);
            //   加载table列表;
            _this.totallist = getData.resultCount;
            _this.tabBody = getData.resultList;
            //   展示柱状图
            if (_this.onlyOne) {
              _this.onlyOne = false;
              _this.holidayContrastEchart("pdcp");
            }
          });
      },
      //   折线图
      holidayContrastEchart(type) {
        const _this = this;
        const getData = this.tabBody;
        const xData = [];
        const yDataBar1 = [];
        const yDataBar2 = [];
        const yDataLine = [];
        for (let item of getData) {
          xData.push(item.type_name);
          yDataBar1.push(parseFloat(item[type + "1"]));
          yDataBar2.push(parseFloat(item[type + "2"]));
          yDataLine.push(parseFloat(item[type + "_change"]));
        }
        echartsAxisConfig({
          target: _this.$refs["holidayContrastEchart"],
          xData: xData,
          lineareaStyle: true,
          interval: 1,
          isYAxis: true,
          lengData: [_this.date1.join("~"), _this.date2.join("~"), "差值"],
          legendTop: "15px",
          yData: [
            {
              type: "bar",
              name: _this.date1.join("~"),
              data: yDataBar1,
              barMaxWidth: 20
            },
            {
              type: "bar",
              name: _this.date2.join("~"),
              data: yDataBar2,
              barMaxWidth: 20
            },
            {
              type: "line",
              name: "差值",
              data: yDataLine,
              yAxisIndex: 1
            }
          ]
        });
      },
      // 获取结论
      holidayContrastConclusion() {
        const _this = this;
        httpUrl.url
          .holidayContrastConclusion({ param: this.ruleForm })
          .then(function(data) {
            const getData = commonMethod.getData(data).conclusion;
            _this.holidayContrastCounclued = getData;
          });
      }
    },
    created() {
      // 生成省市选择下拉框
      this.allSelect.allProvince = dealArr.createDown(allProvince["湖南"]);
      // 场景类型
      this.allSelect.scene_type = dealArr.createDown(selectData["scene_type"]);
    },
    mounted() {
      //   获取table表格
      this.holidayContrastTable();
      // 结论
      this.holidayContrastConclusion();
    },
    beforeUpdate() {}
  };
</script>
<style scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";
  .hello {
    @{deep} .aaaaa {
      border-right: none !important;
    }
    @{deep} .bbbbb {
      border-left: none !important;
      border-right: none !important;
    }
  }
</style>