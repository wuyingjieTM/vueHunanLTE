<template>
  <div class="hello mt10">
    <div class="clearfix">
      <div class="pull-left">
        <v-breadcrumb>
          <v-breadcrumb-item>问题点管理</v-breadcrumb-item>
          <v-breadcrumb-item>场景问题</v-breadcrumb-item>
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
      <div class="pull-left"> 覆盖问题智能分析-场景问题</div>
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
        <span>场景名称：</span>
        <v-input
          placeholder="基本使用"
          disabled
          v-model="ruleForm.minor"
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
              <div
              class="mt10 gridIssueMapTab"
              style="height:30px;"
            >
              <template v-for="item in mapCover">
                <v-button
                  :class="item.text === changeMap ? 'activeColor' : 'color'"
                  @click="selectMap(item.text)"
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
              </v-button>
              <v-button
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
                id="sceneIssueMap"
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
              class="containBorder mt10 p15 font12 overY fontStyle"
              style="height:380px;background-color:#fafafa;line-height:2;"
            >{{curConclusion}}
            </div>
          </v-col>
        </v-row>

        <div class="partTitle clearfix mt10">
          <div class="pull-left">覆盖智能分析</div>
          <div class="pull-right predicte">
            <v-button
              slot="control "
              type="primary "
              html-type="button "
            >保存结果并添加仿真计划</v-button>
            <v-button
              slot="control "
              type="primary "
              html-type="button "
              @click="effectPrediction"
            >效果预测</v-button>
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
                  {{readyCounled}}
                </div>
              </v-tab-pane>
              <v-tab-pane
                tab-key="annlyze2"
                tab="解决方案明细"
              >
                <div class="mt10">
                  <grid-issue-detail
                    :params="ruleForm"
                    :url="'sceneDetail'"
                  ></grid-issue-detail>
                </div>

              </v-tab-pane>
              <v-tab-pane
                tab-key="annlyze3"
                tab="场景历史覆盖指标"
              >
                <div
                  class="h350 containBorder mt10"
                  ref="sceneIssueLine"
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
  import jizuobiao from "../../common/data/jizuobiao.json";
  import relitu from "../../common/data/relitu.json";
  import selectData from "../../common/data/selectData.json";
  import { dealArr } from "../../common/js/dealArr";
  import { dealStr } from "../../common/js/dealStr.js";
  import allProvince from "../../common/data/allCityData.json";
  import arcgisData from "../../common/data/arcgisData.js";

  export default {
    data: () => {
      return {
        showModel: false,
        allowClear: false,
        isReload: false,
        allSelect: { allProvince: [] },
        totallist: 0,
        getTableData: {},
        readyCounled: "",
        ruleForm: {
          date: "",
          grid: "",
          city: "",
          major: "",
          minor: ""
        },
        echartsPolarTab: [],
        echartsCalendarTab: [],
        indexType: [],
        pageSizeOptions: [9],
        mapCover: [
          //   { text: "小区覆盖", icon: "#icon-noun__cc" },
          //   { text: "栅格覆盖", icon: "#icon-zhichi" },
          { text: "区域覆盖", icon: "#icon-3changgouchima" }
        ],
        arcgisObj: {
          arcgis: {},
          map: {},
          centerArc: [],
          toolBarData: ["测距"], //地图工具buttons
          curToolBar: "",
          gridIssueGrid: [],
          measurementWidget: null //地图测量工具
        },
        issueManageEchartsPolarData: {}, //极坐标数据
        issueManageEchartsCalendarData: {}, //热力图数据
        curIndex: "", //单签tab标签的值
        curMap: "小区覆盖",
        jizuobiao: jizuobiao.jizuobiao,
        curConclusion: "",
        differentConclusion: "",
        gridArcgisData: [],
        arcgisLine: [], //arcgis连线数据
        stateConclusion: {},
        tabPolarIndex: 1,
        tabCalendarIndex: 1
      };
    },
    computed: {
      changeTab() {
        return this.curIndex;
      },
      changeMap() {
        return this.curMap;
      }
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
      // 改变模态框状态
      changeState(item) {
        this.showModel = item;
      },
      // 点击八维度
      selectIndex(item) {
        this.curIndex = item;
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
      //   栅格、结论、汇总结论
      sceneConclued(isHiveCounclued) {
        const _this = this;
        httpUrl.url
          .sceneConclued({
            param: this.ruleForm
          })
          .then(
            function(data) {
              const getData = JSON.parse(data.data.body);
              // 设置状态
              _this.indexStatus(getData.conclusionMap);
              //   设置结论
              _this.stateConclusion = getData.conclusionMap;
              //   点击生成结论的时候生效
              _this.readyCounled = dealArr.changeLine(
                getData.conclusionResult,
                "@"
              );
            },
            function(item) {
              console.log("获取各维度状态失败...");
              const obj = {};
              selectData.gridIssueTabSArr.forEach(function(item) {
                obj[item] = [0];
              });
              // 设置状态和结论
              _this.indexStatus(obj);
              _this.stateConclusion = "暂时无结论...";
              _this.readyCounled = "暂时无结论...";
            }
          )
          .then(function() {
            _this.selectIndex(_this.curIndex);
          });
      },
      // echarts折线图
      scenceIssueEchartLine() {
        const _this = this;
        httpUrl.url
          .scenceIssueEchartLine({
            param: this.ruleForm
          })
          .then(
            function(data) {
              const getData = JSON.parse(data.data.body).sceneCoverage;
              const xData = [];
              const yData = [];
              for (let item of getData) {
                xData.push(item[0]);
                yData.push(item[1]);
              }
              echartsAxisConfig({
                target: _this.$refs.sceneIssueLine,
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
                target: _this.$refs.sceneIssueLine,
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
      //   加载地图栅格
      sceneGridIdGrid() {
        const _this = this;
        this.arcgisObj.map.then(function(map) {
          _this.arcgisObj.arcgis = map;
          httpUrl.url
            .sceneGridIdGrid({
              param: _this.ruleForm
            })
            .then(function(data) {
              const getData = JSON.parse(data.data.body);
              _this.arcgisObj.centerArc = getData.gridPoint;
              const centerArc = getData.gridPoint;
              //   从新定位地图位置和添加定位小红点
              addMap.relocation(map, _this.arcgisObj.centerArc);
              addMap.dynamicPoint(map, {
                layerId: "point",
                imgUrl: commonMethod.url.imgUrl,
                data: {
                  x: _this.arcgisObj.centerArc[0],
                  y: _this.arcgisObj.centerArc[1]
                }
              });
              for (let item of getData.rangeGrid) {
                if ("01" == item.covertype) {
                  item.title = "其他栅格";
                  item.type = 1;
                  item.color = 1;
                } else if ("10" == item.covertype) {
                  item.title = "弱覆盖栅格";
                  item.type = 2;
                  item.color = 2;
                } else {
                  item.title = "其他栅格";
                  item.type = 0;
                  item.color = 0;
                }
                item.x = item.lon;
                item.y = item.lat;
                item.top1 = "top1";
                item.top2 = "top2";
                item.top3 = "top3";
              }
              var num = 0;
              _this.arcgisObj.gridIssueGrid = [];
              var timer = setInterval(() => {
                num++;
                _this.arcgisObj.gridIssueGrid.push("gridIssueGrid" + num);
                if (getData.rangeGrid.length > 0) {
                  addMap.drawGrid(map, {
                    layerId: "gridIssueGrid" + num,
                    data: getData.rangeGrid.splice(0, 500),
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
                    },
                    callBack: function(obj) {
                      _this.arcgisObj.centerArc = [obj.x, obj.y];
                      const params = {
                        date: _this.ruleForm.date,
                        city: _this.ruleForm.city,
                        grid: obj.gridid
                      };
                      addMap.deleteLayer(map.map, "point");
                      addMap.deleteLayer(map.map, "gridIssueLine");
                      addMap.deleteLayer(map.map, "gridIssueSector");
                      _this.issueManageGridIdLine(params);
                      //   从新定位地图位置和添加定位小红点
                      addMap.relocation(map, _this.arcgisObj.centerArc);
                      addMap.dynamicPoint(map, {
                        layerId: "point",
                        imgUrl: commonMethod.url.imgUrl,
                        data: {
                          x: _this.arcgisObj.centerArc[0],
                          y: _this.arcgisObj.centerArc[1]
                        }
                      });
                    }
                  });
                  //   调整图层顺序
                  addMap.reorder(map, [{ id: "point", layer: 10 }]);
                  addMap.reorder(map, [{ id: "gridIssueLine", layer: 10 }]);
                  addMap.reorder(map, [{ id: "gridIssueSector", layer: 10 }]);
                  addMap.reorder(map, [{ id: "gridIssueGrid" + num, layer: 2 }]);
                } else {
                  clearInterval(timer);
                }
              }, 200);
              return map;
            })
            .then(function(arcgis) {
              //   加载地图连线
              _this.issueManageGridIdLine();
            });
        });
      },
      //   加载地图折线
      issueManageGridIdLine(params) {
        const _this = this;
        const map = this.arcgisObj.arcgis.map;
        // 加载arcgis地图连线;
        httpUrl.url
          .issueManageGridIdLine({
            param: params || this.ruleForm
          })
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
            addMap.drawLine(_this.arcgisObj.arcgis, {
              data: arr,
              center: _this.arcgisObj.centerArc,
              layerId: "gridIssueLine",
              text: [{ title: "经度", text: "x" }, { title: "纬度", text: "y" }]
            });
            // 加载扇叶
            addMap.drawSector(_this.arcgisObj.arcgis, {
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
            addMap.reorder(_this.arcgisObj.arcgis, [{ id: "point", layer: 10 }]);
          });
      },
      // 解析地址栏
      analysisUrl() {
        if (this.$route.query.date) {
          this.ruleForm.date = this.$route.query.date;
          this.ruleForm.grid = this.$route.query.wo_id;
          this.ruleForm.city = this.$route.query.city;
          this.ruleForm.major = this.$route.query.major;
          this.ruleForm.minor = this.$route.query.minor;
          //   栅格、结论、汇总结论
          this.sceneConclued();
          // 加载折线图
          this.scenceIssueEchartLine();
          //   加载arcgis地图栅格
          this.sceneGridIdGrid();
        }
      },
      //   初始化地图
      initMap() {
        const arcgis = addMap.initMap({
          id: "sceneIssueMap",
          center: [0, 0],
          layerShan: commonMethod.url.layerShan,
          layerUrl: commonMethod.url.layerUrl,
          imgUrl: commonMethod.url.imgUrl,
          showCenter: false,
          showTool: false,
          zoom: 15
        });
        this.arcgisObj.map = arcgis;
      },
      //   点击事件：效果预测（页面跳转）
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
      //   点击事件：返回上一页
      returnPre() {},
      //   点击事件：查询搜索
      toSearch() {}
    },
    created() {
      // 生成省市选择下拉框
      this.allSelect.allProvince = dealArr.createDown(allProvince["湖南"]);
    },
    mounted() {
      this.initMap();
    },
    activated() {
      const _this = this;
      const url = this.$route.query;
      const isReload =
        this.ruleForm.date != url.date ||
        this.ruleForm.city != url.city ||
        this.ruleForm.major != url.major ||
        this.ruleForm.minor != url.minor ||
        this.ruleForm.wo_id != url.wo_id;
      if (isReload) {
        if (this.arcgisObj.arcgis.map) {
          const _this = this;
          this.arcgisObj.gridIssueGrid.forEach(function(item) {
            addMap.deleteLayer(_this.arcgisObj.arcgis.map, item);
          });
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "point");
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "gridIssueLine");
          addMap.deleteLayer(this.arcgisObj.arcgis.map, "gridIssueSector");
        }
        this.analysisUrl();
      }
    }
  };
</script>
<style scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";

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