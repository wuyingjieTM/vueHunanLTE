<template>
  <div class="hello mt10">
    <div class="clearfix">
      <div class="pull-left">
        <v-breadcrumb>
          <v-breadcrumb-item>问题点管理</v-breadcrumb-item>
          <v-breadcrumb-item>栅格问题</v-breadcrumb-item>
        </v-breadcrumb>
      </div>
      <div class="pull-right">
        <div class=" clearfix mt5">
          <v-button
            class="pull-right"
            slot="control "
            type="primary "
            html-type="button "
            @click="returnPre"
          >返回</v-button>
        </div>
      </div>
    </div>

    <div class="detailPart clearfix mt15">
      <div class="pull-left"> 覆盖问题智能分析-栅格问题</div>
      <div class="pull-left ml15">
        <span> 日期：</span>
        <v-date-picker
          v-model="ruleForm.date"
          disabled
          style="width:120px;"
        ></v-date-picker>
      </div>
      <div class="pull-left ml15">
        <span>地市</span>
        <v-select
          :search="allowClear"
          disabled
          :allowClear="allowClear"
          style="width: 120px;"
          :data="allSelect.allProvince"
          v-model="ruleForm.city"
        ></v-select>
      </div>
      <div class="pull-left  ml15">
        <span>栅格ID：</span>
        <v-input
          placeholder="基本使用"
          disabled
          v-model="ruleForm.grid"
          style="width:120px;"
        ></v-input>
      </div>
    </div>

    <!-- 切换标签 -->
    <div class="mt15 btns">
      <template v-for="item in indexType">
        <v-button
          v-if="2==item.num"
          class="mr15"
          type="error"
          :class="{activeColor:item.text==changeTab}"
          @click="selectIndex(item.text)"
          html-type="button"
        >{{item.text}}</v-button>
        <v-button
          v-else-if="1==item.num"
          class="mr15"
          type="warning"
          :class="{activeColor:item.text==changeTab}"
          @click="selectIndex(item.text)"
          html-type="button"
        >{{item.text}}</v-button>
        <v-button
          v-else="0==item.num"
          type="success"
          :class="{activeColor:item.text==changeTab}"
          class="mr15"
          @click="selectIndex(item.text)"
          html-type="button"
        >{{item.text}}</v-button>
      </template>
    </div>

    <!-- 详细分析展示 -->
    <div>
      <div class="grid-demo">
        <v-row>
          <!-- 当前维度 -->
          <v-col
            span="12"
            class="p10"
          >
            <div class="partTitle">
              <span> {{curIndex}}</span>
            </div>
            <div
              class="mt10 gridIssueMapTab"
              style="height:30px;"
            >
              <template v-for="item in mapCover">
                <v-button
                  :class="item.text === changeMap ? 'activeColor' : 'color'"
                  type="primary"
                  html-type="button"
                >
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use :xlink:href=item.icon></use>
                  </svg>
                  {{item.text}}
                </v-button>
              </template>
              <!-- <v-button
                class="color"
                type="primary"
                html-type="button"
              >
                切换到仿真数据
              </v-button> -->
              <!-- <label for="">
                                <span>经纬度:</span>
                                <v-input style="width:120px;" v-model="ruleForm.wo_id"></v-input>
                            </label> -->
              <!-- <v-button
                slot="control "
                type="primary "
                html-type="button "
              >查询</v-button> -->
            </div>

            <!-- 承载地图 -->
            <div class="mapContain">
              <div
                class=" containBorder"
                style="height:350px;"
                id="gridIssueMap"
              >
              </div>
              <div class="toolBar">
                <template v-for="(item, index) in arcgisObj.toolBarData">
                  <v-button
                    :class="{ toolBarActive: (item== arcgisObj.curToolBar ) }"
                    @click="toolBarClick(item)"
                    type="dashed"
                    html-type="button"
                  >{{item}}</v-button>
                </template>
              </div>
            </div>
          </v-col>
          <!-- 当前维度结论 -->
          <v-col span="12">
            <div class="partTitle mt10">{{curIndex}}结论</div>
            <div
              v-if="isOnlyText"
              class="containBorder overY mt10 p10 font12 fontStyle"
              style="height:380px; background-color:#fafafa;"
            >
              {{curConclusion}}
            </div>

            <!-- 天线方位角 -->
            <div
              v-if="txfwjfx"
              class="grid-demo mt10 cardTab txfwjTabs"
              style="height:380px;background-color:#fafafa;"
            >
              <div class="card-container">
                <div class="titleBtn">
                  <template v-for="item in echartsPolarTab">
                    <v-button
                      :class="{curtitleBtn:tabPolarIndex==item.index}"
                      @click="tabPolar('txfwjfx' + item.index)"
                      v-tooltip.topright='"<em>"+ item.key+"</em>"'
                    >{{item.key}}</v-button>
                    </v-tab-pane>
                  </template>
                </div>
                <div
                  style="height:344px;"
                  class="mt5"
                >
                  <v-row>
                    <v-col
                      span="12"
                      class="pr5"
                    >
                      <div
                        class="containBorder"
                        style="height:344px;"
                        ref="aaaaa1"
                      ></div>
                    </v-col>
                    <v-col
                      span="12"
                      class="pl5"
                    >
                      <div
                        class="containBorder p10 font12 overY fontStyle"
                        style="height:344px;"
                      >
                        {{differentConclusion}}
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>

            <!-- 小区越区覆盖分析 -->
            <div
              v-if="xqyqfgfx"
              class="grid-demo mt10 cardTab xqufgTabs"
              style="height:380px;background-color:#fafafa;"
            >
              <div class="card-container">
                <div class="titleBtn">
                  <template v-for="item in echartsCalendarTab">
                    <v-button
                      :class="{curtitleBtn:tabCalendarIndex==item.index}"
                      @click="tabCalendar(item.index)"
                      v-tooltip.topright='"<em>"+ item.key+"</em>"'
                    >{{item.key}}</v-button>
                    </v-tab-pane>
                  </template>
                </div>

                <div
                  class="mt5"
                  style="height:344px;"
                >
                  <div style="height:241px;background-color:#fafafa;">
                    <v-row>
                      <v-col
                        span="16"
                        class="pr5"
                      >
                        <div
                          class="containBorder"
                          style="height:241px;background-color:#fafafa;"
                          ref="gridIssueRelitu"
                        >
                        </div>
                      </v-col>
                      <v-col
                        span="8"
                        class="pl5"
                      >
                        <div
                          class="containBorder p10 font12 overY fontStyle"
                          style="height:241px;background-color:#fafafa;"
                        >
                          {{differentConclusion}}
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                  <div>
                    <v-row class="overX disturb-proportion">
                      <table
                        border="1"
                        class="mb5 mt5"
                      >
                        <tr>
                          <td rowspan="2">TA区间值(m)</td>
                          <td>TA00</td>
                          <td>TA01</td>
                          <td>TA02</td>
                          <td>TA03</td>
                          <td>TA04</td>
                          <td>TA05</td>
                          <td>TA06</td>
                          <td>TA07</td>
                          <td>TA08</td>
                          <td>TA09</td>
                          <td>TA010</td>
                        </tr>
                        <tr>
                          <td>[0,233)</td>
                          <td>[233,466)</td>
                          <td>[466,698)</td>
                          <td>[698,931)</td>
                          <td>[931,1397)</td>
                          <td>[1397,1862)</td>
                          <td>[1862,2794)</td>
                          <td>[2794,3725)</td>
                          <td>[3725,4656)</td>
                          <td>[4656,9933)</td>
                          <td>[9933,∞)</td>
                        </tr>
                      </table>
                      <table
                        border="1"
                        class="mt5"
                      >
                        <tr>
                          <td rowspan="2">RSRP区间值(dBm)</td>
                          <td>RSRP00</td>
                          <td>RSRP01</td>
                          <td>RSRP02</td>
                          <td>RSRP03</td>
                          <td>RSRP04</td>
                          <td>RSRP05</td>
                          <td>RSRP06</td>
                          <td>RSRP07</td>
                          <td>RSRP08</td>
                          <td>RSRP09</td>
                          <td>RSRP10</td>
                          <td>RSRP11</td>
                        </tr>
                        <tr>
                          <td>[-∞,-110)</td>
                          <td>[-110,-105)</td>
                          <td>[-105,-100)</td>
                          <td>[-100,-95)</td>
                          <td>[-95,-90)</td>
                          <td>[-90,-85)</td>
                          <td>[-85,-80)</td>
                          <td>[-80,-75)</td>
                          <td>[-75,-70)</td>
                          <td>[-70,-65)</td>
                          <td>[-65,-60)</td>
                          <td>[-60,∞)</td>
                        </tr>
                      </table>
                    </v-row>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="gjfx"
              class="grid-demo mt10 cardTab"
              style="height:380px;background-color:#fafafa;"
            >
              <div class="card-container">
                <v-tabs
                  active-tab-key="a"
                  type="card"
                  position="top"
                  @tab-click="tabClickTable"
                >
                  <v-tab-pane
                    tab-key="a"
                    tab='TOP1'
                  > </v-tab-pane>
                  <v-tab-pane
                    tab-key="b"
                    tab='TOP2'
                  ></v-tab-pane>
                  <v-tab-pane
                    tab-key="c"
                    tab='TOP3'
                  ></v-tab-pane>
                </v-tabs>
                <div style="height:324px;">
                  <v-col
                    span="14"
                    class="pr5"
                  >
                    <div style="height:324px;background-color:#fafafa;">
                      <text-table
                        :hideSizeChanger=true
                        :pageSizeOptions="pageSizeOptions"
                        :isReload="isReload"
                        @reloadTable="reloadTable"
                        :tabPage=ruleForm.page
                        :tabSize=ruleForm.limit
                        :tabHead="tabHead"
                        :totallist="totallist"
                        :tabBody="tabBody"
                      ></text-table>
                    </div>
                  </v-col>
                  <v-col
                    span="10"
                    class="pl5"
                  >
                    <div
                      class="containBorder p10 font12 overY fontStyle"
                      style="height:324px;background-color:#fafafa;"
                    >
                      {{curConclusion}}
                    </div>
                  </v-col>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <div class="partTitle clearfix mt10">
          <div class="pull-left">覆盖智能分析</div>
          <div class="pull-right predicte">
            <!-- <v-button
              slot="control "
              type="primary "
              html-type="button "
            >保存结果并添加仿真计划</v-button>
            <v-button
              slot="control "
              type="primary "
              html-type="button "
              @click="effectPrediction"
            >效果预测</v-button> -->
          </div>
        </div>

        <div class="titleBtn tabs">
          <template>
            <v-tabs active-tab-key="annlyze1">
              <v-tab-pane
                tab-key="annlyze1"
                tab="分析报告"
              >
                <div
                  class="h350 containBorder mt10 p15 font12 overY fontStyle"
                  style="background-color:#fafafa;line-height:2;"
                >
                  {{analyzeCounled}}
                </div>
              </v-tab-pane>
              <v-tab-pane
                tab-key="annlyze2"
                tab="解决方案明细"
              >
                <div class="mt10">
                  <grid-issue-detail
                    :params="ruleForm"
                    :url="'issueManageDetail'"
                  ></grid-issue-detail>
                </div>
              </v-tab-pane>
              <v-tab-pane
                tab-key="annlyze3"
                tab="栅格历史覆盖指标"
              >
                <div
                  class="h350 containBorder mt10"
                  ref="gridEchartLine"
                ></div>
              </v-tab-pane>
            </v-tabs>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from "axios";
  import { httpUrl } from "../../common/js/setting";
  import { commonMethod } from "../../common/js/common";
  import { arcgis } from "../../common/js/arcgis/arcgis.js";
  import { arcgisConfig } from "../../common/js/arcgis/arcgisConfig.js";
  import {
    echartsAxisConfig,
    echartsConfig,
    echartsMap,
    echartsWaterfall,
    echartsRevertBar,
    echartsPolar,
    echartsCalendar
  } from "../../common/js/echartsConfig";
  import { storageProject } from "../../common/js/session.js";
  import tableData from "../../common/data/tableData.json";
  import relitu from "../../common/data/relitu.json";
  import selectData from "../../common/data/selectData.json";
  import { dealArr } from "../../common/js/dealArr";
  import { dealStr } from "../../common/js/dealStr.js";
  import allProvince from "../../common/data/allCityData.json";
  import arcgisData from "../../common/data/arcgisData.js";
  export default {
    data: () => {
      return {
        allowClear: false,
        isReload: false,
        isOnlyText: true,
        txfwjfx: false,
        xqyqfgfx: false,
        gjfx: false,
        allSelect: { allProvince: [] },
        totallist: 0,
        tabHead: tableData.gridIssueTable,
        tabBody: [],
        getTableData: {},
        analyzeCounled: "",
        ruleForm: {
          date: "",
          grid: "",
          city: "",
          page: 1,
          limit: 9
        },
        echartsPolarTab: [],
        echartsCalendarTab: [],
        pageSizeOptions: [9],
        mapCover: [
          //   { text: "小区覆盖", icon: "#icon-noun__cc" },
          { text: "区域覆盖", icon: "#icon-3changgouchima" }
          //   { text: "地图测距", icon: "#icon-zhichi" }
        ],
        arcgisObj: {
          arcgis: {},
          map: {},
          centerArc: [],
          toolBarData: ["测距"], //地图工具buttons
          curToolBar: "",
          measurementWidget: null //地图测量工具
        },
        indexType: [],
        curIndex: "", //单签tab标签的值
        curMap: "小区覆盖",
        curConclusion: "",
        differentConclusion: "",
        stateConclusion: {},
        tabPolarIndex: 1,
        tabCalendarIndex: 1,
        activeIndex: ["1"]
      };
    },
    watch: {
      activeIndex(val) {}
    },
    methods: {
      toolBarClick(item) {
        if (this.arcgisObj.curToolBar == item) {
          this.arcgisObj.curToolBar = null;
          this.arcgisObj.arcgis.view.ui.remove(this.measurementWidget);
          this.measurementWidget.destroy();
          this.measurementWidget = null;
        } else {
          this.arcgisObj.curToolBar = item;
          //   添加测距功能
          this.measurementWidget = new this.arcgisObj.arcgis.module.measure({
            view: this.arcgisObj.arcgis.view
          });
          this.arcgisObj.arcgis.view.ui.add(
            this.measurementWidget,
            "bottom-right"
          );
        }
      },
      onChange(index, status) {},
      // 返回前一页
      returnPre() {
        storageProject.setStorage("narBar", "问题点管理");
        this.$store.commit("upDataNavBar", "问题点管理");
        this.$router.push("/LTEItem/issueManage");
      },
      //   处理tabs中小区名
      tabsName(obj) {
        const arr = [];
        for (let k in obj) {
          arr.push({ index: k, key: obj[k][1], value: obj[k][2] });
        }
        return arr;
      },
      // 点击极坐标上面的tab切换签
      tabPolar(item) {
        this.tabPolarIndex = parseInt(dealStr.getNum(item));
        this.echartsPolar(parseInt(dealStr.getNum(item)) - 1);
      },
      // 加载极坐标
      echartsPolar(ind) {
        const _this = this;
        httpUrl.url
          .issueManageEchartsPolar({
            param: this.ruleForm
          })
          .then(function(item) {
            const getData = JSON.parse(item.data.body).gridPolar;
            const returnData = _this.tabsName(getData);
            _this.echartsPolarTab = returnData;
            echartsPolar({
              target: _this.$refs.aaaaa1,
              data1: returnData[ind]["value"][0],
              data2: returnData[ind]["value"][1]
            });
            _this.differentConclusion = dealArr.changeLine(
              _this.stateConclusion["ANGLE"][ind + 1] || "暂时无结论...",
              "@"
            );
          });
      },
      // 点击热力图上面的tab切换签
      tabCalendar(item) {
        this.tabCalendarIndex = parseInt(dealStr.getNum(item));
        this.issueManageEchartsCalendar(parseInt(dealStr.getNum(item)) - 1);
      },
      // 加载热力图
      issueManageEchartsCalendar(ind) {
        const _this = this;
        httpUrl.url
          .issueManageEchartsCalendar({
            param: this.ruleForm
          })
          .then(function(data) {
            const getData = commonMethod.getData(data).gridSpectrum;
            const returnData = _this.tabsName(getData);
            _this.echartsCalendarTab = returnData;
            // 处理热力图返回数据：为null的情况
            returnData[ind].value.map(function(item) {
              if (!item[2]) {
                item[2] = 0;
              }
            });
            echartsCalendar({
              target: _this.$refs.gridIssueRelitu,
              data: returnData[ind].value,
              xData: relitu.xDate,
              yData: relitu.yDate,
              max: 1500,
              min: 0,
              color: ["red", "orange", "green"],
              formatter: function(param) {
                return param.data[2];
              },
              aroundPad: ["15px", "28px", "10px", "15px"]
            });
            _this.differentConclusion = dealArr.changeLine(
              _this.stateConclusion["OVERCOVER"][ind + 1] || "暂时无结论...",
              "@"
            );
          });
      },
      // 点击八维度
      selectIndex(item) {
        this.curIndex = item;
        switch (this.curIndex) {
          case "天线方位角分析":
            this.isOnlyText = false;
            this.txfwjfx = true;
            this.xqyqfgfx = false;
            this.gjfx = false;
            this.tabPolarIndex = 1;
            this.echartsPolar(0);
            break;
          case "小区越区覆盖分析":
            this.isOnlyText = false;
            this.txfwjfx = false;
            this.xqyqfgfx = true;
            this.gjfx = false;
            this.tabCalendarIndex = 1;
            this.issueManageEchartsCalendar(0);
            break;
          case "告警分析":
            this.isOnlyText = false;
            this.txfwjfx = false;
            this.xqyqfgfx = false;
            this.gjfx = true;
            break;
          default:
            this.isOnlyText = true;
            this.txfwjfx = false;
            this.xqyqfgfx = false;
            this.gjfx = false;
            break;
        }
        if (item) {
          const cur = selectData.stateConclusionKey[item];
          this.curConclusion = dealArr.changeLine(
            this.stateConclusion[cur][1] || "暂时无结论...",
            "@"
          );
          this.differentConclusion = dealArr.changeLine(
            this.stateConclusion[cur][1] || "暂时无结论...",
            "@"
          );
        } else {
          this.curConclusion = "暂时无结论...";
          this.differentConclusion = "暂时无结论...";
        }
      },
      // 搜索查询
      toSearch() {
        // 重新加载页面
        this.loadPage();
      },

      // 效果预测
      effectPrediction() {
        storageProject.setStorage("narBar", "节假日对比");
        this.$store.commit("upDataNavBar", "节假日对比");
        this.$router.push({
          path: "/LTEItem/simulationManage",
          query: {
            date: this.$route.query.date,
            city: this.$route.query.city,
            grid: this.$route.query.grid
          }
        });
      },
      // tbs处理状态
      indexStatus(data) {
        const obj = {};
        selectData.gridIssueTabSArr.forEach(function(item) {
          obj[item] = data[item][0];
        });
        const dearData = commonMethod.dealTabs(obj);
        this.indexType = dearData.arr;
        this.curIndex = dearData.isSelect;
      },
      // echarts折线图
      issueManageEchartLine() {
        const _this = this;
        httpUrl.url
          .issueManageEchartLine({
            param: this.ruleForm
          })
          .then(
            function(data) {
              const getData = JSON.parse(data.data.body).gridCoverage;
              const xData = [];
              const yData = [];
              for (let item of getData) {
                xData.push(item[0]);
                yData.push(item[1]);
              }
              echartsAxisConfig({
                target: _this.$refs.gridEchartLine,
                yTitla1: "覆盖率(%)",
                xData: xData,
                rotate: 45,
                min: (dealArr.getMin(yData) * 0.9).toFixed(2),
                max: (dealArr.getMax(yData) * 1.1).toFixed(2),
                formatter: function(item) {
                  return item.name + " : " + item.data + "%";
                },
                yData: [
                  {
                    type: "line",
                    data: yData
                  }
                ]
              });
            },
            function() {
              echartsAxisConfig({
                target: _this.$refs.gridEchartLine,
                yTitla1: "覆盖率(100%)",
                xData: [],
                rotate: 45,
                formatter: function(item) {
                  return item.name + " : " + item.data + "%";
                },
                yData: [
                  {
                    type: "line",
                    data: []
                  }
                ]
              });
            }
          );
      },
      tabClickTable(item) {
        if ("a" == item) {
          this.totallist = this.getTableData.resultCount1 || 0;
          this.tabBody = this.getTableData.resultList[0].top || [];
        } else if ("b" == item) {
          this.totallist = this.getTableData.resultCount2 || 0;
          this.tabBody = this.getTableData.resultList[1].top || [];
        } else if ("c" == item) {
          this.totallist = this.getTableData.resultCount3 || 0;
          this.tabBody = this.getTableData.resultList[2].top || [];
        }
      },
      //   从新加载table
      reloadTable(item) {
        this.ruleForm.page = item.tabPage;
        //   this.ruleForm.limit = item.tabSize;
        this.issueManageGridIdTable();
      },
      // table表格
      issueManageGridIdTable() {
        const _this = this;
        httpUrl.url
          .issueManageGridIdTable({
            param: _this.ruleForm
          })
          .then(function(data) {
            const getData = JSON.parse(data.data.body);
            _this.getTableData = getData;
            _this.totallist = getData.resultCount1 || 0;
            _this.tabBody = getData.resultList[0].top || [];
          });
      },
      // 加载地图栅格
      issueManageGridIdGrid() {
        //   如果存在图层
        const _this = this;
        this.arcgisObj.map.then(function(map) {
          httpUrl.url
            .issueManageGridIdGrid({
              param: _this.ruleForm
            })
            .then(function(data) {
              _this.arcgisObj.arcgis = map;
              const getData = JSON.parse(data.data.body);
              _this.arcgisObj.centerArc = getData.gridLonLat;
              const centerArc = getData.gridLonLat;
              for (let item of getData.rangeGrid) {
                if ("01" == item.covertype) {
                  item.title = "其他栅格";
                  item.color = 1;
                } else if ("10" == item.covertype) {
                  item.title = "弱覆盖栅格";
                  item.color = 2;
                } else {
                  item.title = "其他栅格";
                  item.color = 0;
                }
                item.x = item.lon;
                item.y = item.lat;
                item.top1 = "top1";
                item.top2 = "top2";
                item.top3 = "top3";
              }

              //   从新定位地图位置和添加定位小红点;
              addMap.relocation(map, centerArc);
              addMap.dynamicPoint(map, {
                layerId: "point",
                imgUrl: commonMethod.url.imgUrl,
                data: { x: centerArc[0], y: centerArc[1] }
              });
              addMap.drawGrid(map, {
                layerId: "gridIssueGrid",
                data: getData.rangeGrid,
                text: [
                  { title: "数据时间", text: "date" },
                  { title: "栅格id", text: "gridid" },
                  { title: "栅格总采样点数", text: "mrnum" },
                  { title: "栅格弱覆盖采样点", text: "mrpoornum" },
                  { title: "栅格覆盖率", text: "cover" },
                  { title: "栅格平均RSRP", text: "avgrsrp" }
                ],
                table: {
                  head: [
                    "TOP",
                    "ECI",
                    "小区名",
                    "总采样点数",
                    "弱覆盖采样点数",
                    "弱覆盖采样点占比",
                    "平均RSRP"
                  ],
                  body: [
                    [
                      "top1",
                      "top1eci",
                      "top1name",
                      "top1mrnum",
                      "top1mrpoornum",
                      "top1cover",
                      "top1avgrsrp"
                    ],
                    [
                      "top2",
                      "top2eci",
                      "top2name",
                      "top2mrnum",
                      "top2mrpoornum",
                      "top2cover",
                      "top2avgrsrp"
                    ],
                    [
                      "top3",
                      "top3eci",
                      "top3name",
                      "top3mrnum",
                      "top3mrpoornum",
                      "top3cover",
                      "top3avgrsrp"
                    ]
                  ]
                }
              });

              addMap.reorder(map, [{ id: "point", layer: 10 }]);
              //   调整图层顺序
              addMap.reorder(map, [{ id: "point", layer: 10 }]);

              return map;
            })
            .then(function(arcgis) {
              //   加载arcgis地图连线;
              httpUrl.url
                .issueManageGridIdLine({ param: _this.ruleForm })
                .then(function(data) {
                  const getData = JSON.parse(data.data.body).Top3CellPos;
                  const arr = [];
                  for (let item of getData) {
                    arr.push({
                      x: item[1],
                      y: item[2],
                      pop: item[3] || 0,
                      eci: item[0],
                      name: item[4] || ""
                    });
                  }
                  // 加载连线
                  addMap.drawLine(arcgis, {
                    data: arr,
                    center: _this.arcgisObj.centerArc,
                    layerId: "gridIssueLine",
                    text: [
                      { title: "经度", text: "x" },
                      { title: "纬度", text: "y" }
                    ]
                  });
                  // 加载扇叶
                  addMap.drawSector(arcgis, {
                    data: arr,
                    radius: 400,
                    layerId: "gridIssueSector",
                    text: [
                      { title: "经度", text: "x" },
                      { title: "纬度", text: "y" },
                      { title: "ECI", text: "eci" },
                      { title: "小区名称", text: "name" }
                    ]
                  });
                  //   调整图层顺序
                  addMap.reorder(arcgis, [{ id: "point", layer: 10 }]);
                });
            });
        });
      },
      // 栅格、结论、汇总结论
      issueManageGridIdConclued(isHiveCounclued) {
        const _this = this;
        httpUrl.url
          .issueManageGridIdConclued({
            param: this.ruleForm
          })
          .then(
            function(data) {
              const getData = JSON.parse(data.data.body);
              // 设置状态
              _this.indexStatus(getData.conclusionMap);
              //   设置结论
              _this.stateConclusion = getData.conclusionMap;
            },
            function(item) {
              const obj = {};
              selectData.gridIssueTabSArr.forEach(function(item) {
                obj[item] = [0];
              });
              // 设置状态和结论
              _this.indexStatus(obj);
              _this.stateConclusion = "暂时无结论...";
            }
          )
          .then(function() {
            //   分析报告
            httpUrl.url
              .issueManageGridIdConclueds({
                param: _this.ruleForm
              })
              .then(
                function(data) {
                  const getData = JSON.parse(data.data.body);
                  //   点击生成结论的时候生效
                  _this.analyzeCounled = dealArr.changeLine(
                    getData.conclusionResult,
                    "@"
                  );
                },
                function(item) {
                  _this.analyzeCounled = "暂时无结论...";
                }
              );
          })
          .then(function() {
            _this.selectIndex(_this.curIndex);
          });
      },
      // 加载页面数据
      loadPage() {
        //   栅格、结论、汇总结论
        this.issueManageGridIdConclued();
        // 加载折线图
        this.issueManageEchartLine();
        //   table表格;
        this.issueManageGridIdTable();
        //   加载arcgis地图栅格
        this.issueManageGridIdGrid();
      },
      // 解析地址栏
      analysisUrl() {
        if (this.$route.query.date) {
          this.ruleForm.date = this.$route.query.date;
          this.ruleForm.grid = this.$route.query.grid;
          this.ruleForm.city = this.$route.query.city;
          this.loadPage();
        }
      }
    },
    created() {},
    computed: {
      changeTab() {
        return this.curIndex;
      },
      changeMap() {
        return this.curMap;
      }
    },
    mounted() {
      //   初始化地图
      const arcgis = addMap.initMap({
        id: "gridIssueMap",
        center: [0, 0],
        layerShan: commonMethod.url.layerShan,
        layerUrl: commonMethod.url.layerUrl,
        imgUrl: commonMethod.url.imgUrl,
        showCenter: false,
        showTool: false,
        zoom: 15
      });
      this.arcgisObj.map = arcgis;
      console.log("初始化栅格地图");
    },
    activated() {
      const _this = this;
      const url = this.$route.query;
      const isReload =
        this.ruleForm.date != url.date ||
        this.ruleForm.city != url.city ||
        this.ruleForm.grid != url.grid;
      if (isReload) {
        //   如果地图已经加载
        if (this.arcgisObj.arcgis.map) {
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "gridIssueGrid");
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "point");
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "gridIssueLine");
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "gridIssueSector");
        }
        // 生成省市选择下拉框
        this.allSelect.allProvince = dealArr.createDown(allProvince["湖南"]);
        this.analysisUrl();
      }
    }
  };
</script>
<style scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";

  .modelDetail {
    @{deep} .ant-modal-content,
    @{deep}.ant-modal {
      width: 1000px !important;
    }
  }

  .detailPart {
    @{deep} input,
    @{deep} button {
      height: 24px;
      font-size: 10px !important;
    }
    @{deep} .ant-select-selection--single {
      height: 24px;
      font-size: 10px !important;
    }
    @{deep} .ant-select {
      margin-top: 6px;
    }
  }
  .titleBtn {
    @{deep} .ant-btn {
      width: 140px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 3px;
      background-color: #f9f9f9;
    }
    @{deep} span {
      color: #999 !important;
    }
    @{deep} .ant-btn.curtitleBtn {
      background-color: #fff;
    }
    @{deep} .curtitleBtn span {
      color: #0284da !important;
    }
  }

  //   地图
  .mapContain {
    position: relative;
  }
  .mapContain .toolBar {
    position: absolute;
    top: 15px;
    padding-left: 60px;
  }
  .mapContain .toolBar {
    @{deep} button.ant-btn {
      font-size: 10px;
      padding: 2px 10px !important;
      margin-right: 10px;
    }
    @{deep} button span {
      color: #666 !important;
    }
  }

  // 八维度切换
  .activeColor {
    background-color: #2a2a2a !important;
  }
  .color2 {
    background-color: rgba(233, 234, 236, 1) !important;
  }
  .color2 {
    @{deep} span {
      color: #333 !important;
    }
  }
  .color1 {
    background-color: #a4a6aa !important;
  }
  .color1 {
    @{deep} span {
      color: #555454 !important;
    }
  }
  .btns {
    @{deep} button {
      border: 1px solid #ccc !important;
    }
  }
  .btns {
    @{deep} button:disabled {
      border: 1px solid #ddd !important;
      background-color: #6a6a6a !important;
    }
    @{deep} button:disabled span {
      color: #b2b2b2 !important;
    }
  }
  .txfwjTabs,
  .xqufgTabs {
    @{deep} .ant-tabs-tab {
      width: 140px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    @{deep} .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
      border-bottom: 1px solid #d9d9d9 !important;
    }
  }

  // 地图上切换
  .gridIssueMapTab {
    @{deep} button,
    @{deep} input {
      line-height: 13px;
      margin-top: 3px;
      background-color: #f8f8f8 !important;
      height: 24px;
      padding: 3px 8px !important;
      margin-right: 10px;
      border: 1px solid #ccc !important;
    }
  }
  .gridIssueMapTab,
  .predicte {
    @{deep} button span {
      color: #a2a2a2 !important;
      height: 24px;
      font-size: 10px;
    }
  }
  .gridIssueMapTab {
    @{deep} .activeColor {
      color: #fff !important;
      background-color: #80848f !important;
    }
  }

  .gridIssueMapTab {
    @{deep} .activeColor {
      color: #fff !important;
      background-color: #80848f !important;
    }
  }
  .gridIssueMapTab {
    @{deep} .activeColor span {
      color: #fff !important;
    }
  }
  .predicte {
    @{deep} button {
      color: #ccc !important;
      border: 1px solid #ccc !important;
      background-color: #e9eaec !important;
    }
  }

  .cardTab {
    @{deep} .ant-tabs-tab {
      font-size: 12px !important;
    }
  }
  .disturb-proportion::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px @text-title;
    background-color: #ddd;
  }
  .fontStyle {
    line-height: 1.6;
    white-space: pre-line;
  }

  //   arcgis弹出框
  .containBorder {
    @{deep} .esri-popup__content {
      overflow-y: scroll;
      overflow-x: scroll;
    }
    @{deep} .esri-feature__main-container div {
      font-size: 10px;
    }
    @{deep} table td,
    @{deep} table th {
      max-width: 80px !important;
      padding: 3px;
      font-size: 12px;
      text-overflow: ellipsis; /* for IE */
      -moz-text-overflow: ellipsis; /* for Firefox,mozilla */
      overflow: hidden;
      white-space: nowrap;
    }
    @{deep} table tr td:hover {
      overflow: visible;
      white-space: normal;
      word-wrap: break-word;
    }
  }
  //   地图工具栏是否显示
  .toolBarActive {
    background-color: #3c3c34bf !important;
  }
  .toolBar {
    @{deep} button.toolBarActive span {
      color: #fafafa !important;
    }
  }
</style>