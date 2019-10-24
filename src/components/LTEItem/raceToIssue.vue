<template>
  <div class="hello mt10">
    <div class="clearfix">
      <v-button
        class="pull-right"
        slot="control "
        type="primary "
        html-type="button "
        @click="returnPre"
      >返回</v-button>
    </div>

    <div class="detailPart clearfix mt15">
      <div class="pull-left"> 覆盖问题智能分析-栅格问题</div>
      <div class="pull-left  ml15">
        <span>栅格ID：</span>
        <v-input
          placeholder="基本使用"
          style="width:120px;"
        ></v-input>
      </div>
      <div class="pull-left ml15">
        <span> 日期：</span>
        <v-date-picker
          v-model="date1"
          style="width:120px;"
        ></v-date-picker>
      </div>
      <div class="pull-left ml15">
        <v-button
          slot="control "
          type="primary "
          html-type="button "
          @click="toSearch()"
          icon="search "
        >查询</v-button>
      </div>
      <div class="pull-left ml15">
        <v-button
          type="primary"
          html-type="button"
        >生成覆盖智能分析</v-button>
      </div>
    </div>

    <!-- 切换标签 -->
    <div class="mt15 btns">
      <template v-for="item in indexType">
        <v-button
          class="mr15"
          :class="item === changeTab ? 'activeColor' : 'color'"
          @click="selectIndex(item)"
          type="primary"
          html-type="button"
        >{{item}}</v-button>
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
            <div class="partTitle">{{curIndex}}</div>
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
              <v-button
                class="color"
                type="primary"
                html-type="button"
              >
                切换到仿真数据
              </v-button>
              <label for="">
                <span>经纬度查询:</span>
                <v-input
                  style="width:120px;"
                  v-model="ruleForm.wo_id"
                ></v-input>
              </label>
              <v-button
                slot="control "
                type="primary "
                html-type="button "
                icon="search "
              >查询</v-button>
            </div>
            <div
              class=" containBorder"
              style="height:350px;"
              id="map"
            ></div>
          </v-col>
          <!-- 当前维度结论 -->
          <v-col
            span="12"
            class="p10"
          >
            <div class="partTitle">{{curIndex}}结论</div>
            <div
              v-if="isOnlyText"
              class="containBorder mt10 p10 font12"
              style="height:380px; background-color:#fafafa;"
            >
              {{textDetail}}
            </div>
            <div
              v-if="txfwjfx"
              class="grid-demo mt10 cardTab"
              style="height:380px;background-color:#fafafa;"
            >
              <div class="card-container">
                <v-tabs
                  active-tab-key="1"
                  type="card"
                  position="top"
                >
                  <v-tab-pane
                    tab-key="1"
                    tab="TOP1"
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
                          class="containBorder p10 font12"
                          style="height:344px;"
                        >
                          {{textDetail}}
                        </div>
                      </v-col>
                    </v-row>
                  </v-tab-pane>
                  <v-tab-pane
                    tab-key="2"
                    tab="TOP2"
                  >
                    <v-row>
                      <v-col
                        span="12"
                        class="pr5"
                      >
                        <div
                          class="containBorder"
                          style="height:344px;"
                          ref="aaaaa2"
                        ></div>
                      </v-col>
                      <v-col
                        span="12"
                        class="pl5"
                      >
                        <div
                          class="containBorder p10 font12"
                          style="height:344px;"
                        >
                          {{textDetail}}
                        </div>
                      </v-col>
                    </v-row>
                  </v-tab-pane>
                  <v-tab-pane
                    tab-key="3"
                    tab="TOP3"
                  >
                    <v-row>
                      <v-col
                        span="12"
                        class="pr5"
                      >
                        <div
                          class="containBorder"
                          style="height:344px;"
                          ref="aaaaa3"
                        ></div>
                      </v-col>
                      <v-col
                        span="12"
                        class="pl5"
                      >
                        <div
                          class="containBorder p10 font12"
                          style="height:344px;"
                        >
                          {{textDetail}}
                        </div>
                      </v-col>
                    </v-row>
                  </v-tab-pane>
                </v-tabs>
              </div>
            </div>

            <div
              v-if="xqyqfgfx"
              class='mt10'
            >
              <v-row>
                <v-col
                  span="14"
                  class="pr5"
                >
                  <div
                    class="containBorder"
                    style="height:257px;background-color:#fafafa;"
                    ref="gridIssueRelitu"
                  >
                  </div>
                </v-col>
                <v-col
                  span="10"
                  class="pl5"
                >
                  <div
                    class="containBorder p10 font12"
                    style="height:257px;background-color:#fafafa;"
                  >
                    {{textDetail}}
                  </div>
                </v-col>
              </v-row>
              <v-row class="mt10">
                <table
                  border="1"
                  class="mb5 mt10"
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
                  class="mt10"
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

            <div
              v-if="gjfx"
              class='mt10'
            >
              <v-col
                span="14"
                class="pr5"
              >
                <div
                  class="containBorder"
                  style="height:380px;background-color:#fafafa;"
                >
                  <my-table
                    :tabUrl="'homePageIndex'"
                    :tabParams="params"
                    :pagination="'true'"
                    :body="'result'"
                    :tabHead="tabHead"
                  ></my-table>
                </div>
              </v-col>
              <v-col
                span="10"
                class="pl5"
              >
                <div
                  class="containBorder p10 font12"
                  style="height:380px;background-color:#fafafa;"
                >
                  {{textDetail}}
                </div>
              </v-col>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            span="12"
            class="p10"
          >
            <div class="partTitle clearfix">
              <div class="pull-left">{{curIndex}}报告</div>
              <div class="pull-right predicte">
                <v-button
                  slot="control "
                  type="primary "
                  html-type="button "
                >保存结果并添加仿真计划</v-button>
                <v-button
                  slot="control "
                  type="primary "
                  icon="arrow-down "
                  html-type="button "
                >导出分析报告</v-button>
                <v-button
                  slot="control "
                  type="primary "
                  html-type="button "
                  @click="effectPrediction"
                >效果预测</v-button>
              </div>
            </div>
            <div
              class="h300 containBorder mt10"
              style="background-color:#fafafa;"
            >

            </div>
          </v-col>
          <v-col
            span="12"
            class="p10"
            style="margin-top:7px;"
          >
            <div class="partTitle">栅格历史覆盖指标</div>
            <div
              class="h300 containBorder mt10"
              ref="gridEchartLine"
            ></div>
          </v-col>
        </v-row>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from "axios";
  import { httpUrl } from "../../common/js/setting";
  import { commonMethod } from "../../common/js/common";
  import { arcgis } from "../../common/js/arcgis/arcgis.js";
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

  export default {
    data: () => {
      return {
        params: {},
        ruleForm: {},
        tabHead: tableData.comHead.slice(0, 6),
        date1: "2015-12-06",
        indexType: [
          "天馈老化分析",
          "天线方位角分析",
          "未占用最优小区分析",
          "小区越区覆盖分析",
          "告警分析",
          "邻区漏配分析",
          "站间距过远分析",
          "建筑物阻挡分析"
        ],
        mapCover: [
          { text: "小区覆盖", icon: "#icon-noun__cc" },
          { text: "栅格覆盖", icon: "#icon-zhichi" },
          { text: "区域覆盖", icon: "#icon-3changgouchima" }
        ],
        curIndex: "天馈老化分析",
        curMap: "小区覆盖",
        isOnlyText: true,
        txfwjfx: false,
        xqyqfgfx: false,
        gjfx: false,
        jizuobiao: jizuobiao.jizuobiao,
        textDetail:
          "结论详细介绍：时代峰峻欧式的风景哦水电费胜多负少东方打发第三方防守打法发时代峰峻时代峰峻时代峰峻"
      };
    },

    computed: {
      // curIndex: function() {
      //   console.log("你变了");
      // }
      changeTab() {
        return this.curIndex;
      },
      changeMap() {
        return this.curMap;
      }
    },
    methods: {
      returnPre() {
        storageProject.setStorage("narBar", "问题点管理");
        this.$store.commit("upDataNavBar", "问题点管理");
        this.$router.go(-1);
      },
      addMap() {
        arcgis.initMap(new Lgis());
      },
      // 加载极坐标
      echartsPolar() {
        const _this = this;
        const timer = setInterval(function() {
          const target = _this.$refs.aaaaa1;
          if (target) {
            clearInterval(timer);
            echartsPolar({
              target: target,
              data1: _this.jizuobiao[0],
              data2: _this.jizuobiao[1]
            });
            echartsPolar({
              target: _this.$refs.aaaaa2,
              data1: _this.jizuobiao[0],
              data2: _this.jizuobiao[1]
            });
            echartsPolar({
              target: _this.$refs.aaaaa3,
              data1: _this.jizuobiao[0],
              data2: _this.jizuobiao[1]
            });
          }
        }, 10);
      },

      // 加载热力图
      echartsCalendar() {
        const _this = this;
        const timer = setInterval(function() {
          const target = _this.$refs.gridIssueRelitu;
          if (target) {
            clearInterval(timer);
            echartsCalendar({
              target: target,
              data: relitu.data,
              xData: relitu.yDate,
              yData: relitu.xDate,
              max: 8000,
              min: 0,
              color: ["red", "orange", "green"],
              formatter: function(param) {
                return param.data[2];
              },
              aroundPad: ["15px", "28px", "10px", "15px"]
            });
          }
        }, 10);
      },
      // 点击八维度
      selectIndex(item) {
        const _this = this;
        switch (item) {
          case "天线方位角分析":
            _this.isOnlyText = false;
            _this.txfwjfx = true;
            _this.xqyqfgfx = false;
            _this.gjfx = false;
            _this.echartsPolar();
            break;

          case "小区越区覆盖分析":
            _this.isOnlyText = false;
            _this.txfwjfx = false;
            _this.xqyqfgfx = true;
            _this.gjfx = false;
            _this.echartsCalendar();
            break;
          case "告警分析":
            _this.isOnlyText = false;
            _this.txfwjfx = false;
            _this.xqyqfgfx = false;
            _this.gjfx = true;
            break;
          default:
            _this.isOnlyText = true;
            _this.txfwjfx = false;
            _this.xqyqfgfx = false;
            _this.gjfx = false;
            break;
        }

        this.curIndex = item;
      },
      // 点击地图展示类型
      selectMap(item) {
        this.curMap = item;
      },
      // 加载折线图
      gridEchartLine() {
        echartsAxisConfig({
          target: this.$refs.gridEchartLine,
          yTitla1: "dajihao",
          xData: ["北京", "上海", "广州", "深圳"],
          yData: [
            {
              type: "line",
              data: [12, 43, 23, 5]
            }
          ]
        });
      },
      // 搜索查询
      toSearch() {},

      // 效果预测
      effectPrediction() {
        storageProject.setStorage("narBar", "MR与仿真数据");
        this.$store.commit("upDataNavBar", "MR与仿真数据");
        this.$router.push("/LTEItem/MRData");
      }
    },
    created() {},
    mounted() {
      //   加载arcgis地图
      // this.addMap();

      // 加载折线图
      const _this = this;
      setTimeout(function() {
        _this.gridEchartLine();
      }, 10);
    },
    beforeUpdate() {}
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
  }

  // 八维度切换
  .activeColor {
    background-color: rgb(128, 132, 143) !important;
  }
  .color {
    background-color: rgba(233, 234, 236, 1) !important;
  }
  .color {
    @{deep} span {
      color: #333 !important;
    }
  }
  .btns {
    @{deep} button {
      border: 1px solid #ccc !important;
    }
  }

  // 地图上切换
  .gridIssueMapTab {
    background-color: #fff;
  }
  .gridIssueMapTab {
    @{deep} button,
    @{deep} input {
      line-height: 13px;
      margin-top: 3px;
      background-color: #e9eaec !important;
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
</style>