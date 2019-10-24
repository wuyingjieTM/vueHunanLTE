<template>
  <div class="hello mt10">
    <div>
      <v-breadcrumb>
        <v-breadcrumb-item>问题点管理</v-breadcrumb-item>
        <v-breadcrumb-item>投诉管理</v-breadcrumb-item>
      </v-breadcrumb>
    </div>
    <div class="clearfix mt5">
      <v-button
        class="pull-right"
        slot="control "
        type="primary "
        html-type="button "
        @click="returnPre"
      >返回</v-button>
    </div>
    <div class="mt10">
      <v-more-panel>
        <v-form slot="form">
          <v-form-item label="时间">
            <v-date-picker
              style="width: 120px;"
              disabled
              v-model="ruleForm.date"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="地市">
            <v-select
              :search="allowClear"
              disabled
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.allProvince"
              v-model="ruleForm.city"
            ></v-select>
          </v-form-item>
          <v-form-item label="工单ID">
            <v-input
              disabled
              type="text"
              v-model="ruleForm.wo_id"
            ></v-input>
          </v-form-item>
          <!-- <v-form-item>
                        <v-button type="primary" icon="search" html-type="submit" @click="toSearch">查询</v-button>
                    </v-form-item> -->
        </v-form>
      </v-more-panel>
    </div>
    <div>
      <div class="grid-demo">
        <v-row>
          <v-col
            span="12"
            class="p10"
          >
            <div class="  mt15">
              <!-- 投诉时段指标 -->
              <div>
                <p class="partTitle mt15">投诉时段指标</p>
                <div class="mt15">
                  <div
                    class="bordered clearfix mt15"
                    style="height:53px;"
                  >
                    <template v-for="(item,index) in allNumbers">
                      <div
                        class="pull-left complaintAnalyzeShowNumber border"
                        :style=item.color
                      >
                        <p>{{item.title}}</p>
                        <span>{{item.number}}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- 用户占用小区RSRP分布图 -->
              <div>
                <p class="partTitle mt15">用户占用小区RSRP分布图</p>
                <div class="mt15">
                  <div
                    class="bordered clearfix mt15"
                    style="height:53px;"
                  >
                    <div
                      class="pull-left complaintAnalyzeShowNumber border"
                      style="background-color: rgb(85, 170, 253); border: 1px solid rgb(85, 170, 253);"
                    >
                      <p>MR数量</p>
                      <span>{{RSRPNum[0]}}</span>
                    </div>
                    <div
                      class="pull-left complaintAnalyzeShowNumber border"
                      style="background-color: rgb(51, 200, 118); border: 1px solid rgb(51, 200, 118);"
                    >
                      <p>小区数量</p>
                      <span>{{RSRPNum[1]}}</span>
                    </div>
                  </div>
                </div>
                <div class="mt15">
                  <div>
                    <template>
                      <v-tabs
                        active-tab-key=complaintIssueBars[0]
                        type="card"
                        @tab-click="tabPsrp"
                      >
                        <template v-for="item in complaintIssueBars">
                          <v-tab-pane
                            :tab-key=item
                            :tab=item
                          ></v-tab-pane>
                        </template>
                      </v-tabs>
                      <div
                        class="containBorder"
                        style="height:270px"
                        ref="issueManageComplaintEchartBar"
                      ></div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- 异常信令 -->
              <p class="partTitle mt15">异常信令</p>
              <div class="mt15 tableStyle">
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
            </div>
          </v-col>
          <v-col
            span="12"
            class="p10"
          >
            <div>
              <!-- 地图模块 -->
              <div>
                <p class="partTitle mt15">地图模块</p>
                <div class="mt10 predicte">
                  <v-button
                    slot="control "
                    type="primary "
                    html-type="button "
                    @click="trackBall"
                  >播放运动轨迹</v-button>
                  <div class="pull-right">
                    <v-form slot="form">
                      <v-form-item label="用户在栅格内的渲染指标：">
                        <v-select
                          :search="allowClear"
                          :allowClear="allowClear"
                          style="width: 120px;"
                          :data="allSelect.gridIndex"
                          v-model="ruleForm.gridIndex"
                        ></v-select>
                      </v-form-item>
                    </v-form>
                  </div>
                </div>
                <div
                  class=" containBorder mt15"
                  style="height:462px;"
                  id="complaintMap"
                ></div>
              </div>
              <!-- 智能分析报告 -->
              <div class="partTitle mt15 clearfix">
                <div class="pull-left"> 智能分析报告</div>
                <div class="pull-right predicte">
                  <v-button
                    slot="control "
                    type="primary "
                    html-type="button "
                  >生成覆盖智能分析报告</v-button>
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
                class=" containBorder mt15"
                style="height:300px;background-color:#fafafa;"
              ></div>
            </div>
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
  import tableData from "../../common/data/tableData.json";
  import {
    echartsAxisConfig,
    echartsConfig,
    echartsMap,
    echartsWaterfall,
    echartsRevertBar,
    echartsPolar,
    echartsCalendar
  } from "../../common/js/echartsConfig";
  import arcgisData from "../../common/data/arcgisData.js";
  import { arcgisConfig } from "../../common/js/arcgis/arcgisConfig.js";
  import { storageProject } from "../../common/js/session.js";
  import { dealArr } from "../../common/js/dealArr.js";
  import { dealTime } from "../../common/js/dealTime.js";
  import allProvince from "../../common/data/allCityData.json";
  import selectData from "../../common/data/selectData.json";
  import { arcgis } from "../../common/js/arcgis/arcgis";
  export default {
    data: () => {
      return {
        complaintIssueBars: [], //动态柱状图标签
        complaintIssueBarObj: [], //动态柱状图标签
        ruleForm: {
          date: "",
          city: "长沙",
          wo_id: "", //WO_S12123_222
          page: 1,
          limit: 10
        },
        lmap: "",
        arcgisMapData: {},
        RSRPNum: [0, 0], //用户占用小区RSRP分布图:两个数字显示
        gridIndex: "平均RSRP",
        isReload: false,
        totallist: 100,
        allowClear: false,
        allSelect: { allProvince: [] },
        params: {},
        tabHead: tableData.complaintIssueTable,
        tabBody: [],
        allNumbers: selectData.allNumbers
      };
    },
    methods: {
      //   点击运动轨迹：显示arcgis栅格和连线
      trackBall() {
        const _this = this;
        const arr = [];
        this.arcgisMapData.forEach(function(item, index) {
          var config = {
            lmap: _this.lmap,
            //   range: 100,
            radius: 200,
            numZoom: 8,
            target: [
              {
                x: item[1],
                y: item[2],
                id: 240,
                pop: 60,
                cellname: item[0],
                mrnum: 200,
                rsrp: 200,
                lownum: 200
              }
            ],
            coverageName: "coverOnesd",
            gisId: "id",
            angle: 360,
            overcover: "overcover"
          };
          arcgisConfig.sectorConfig(config);
        });
      },
      // 点击搜索查询
      toSearch() {
        // 阻止页面跳转
        return false;
      },
      // 返回上一页面
      returnPre() {
        storageProject.setStorage("narBar", "问题点管理");
        this.$store.commit("upDataNavBar", "问题点管理");
        this.$router.push("/LTEItem/issueManage");
      },
      // 柱状图切换签
      tabPsrp(item) {
        echartsAxisConfig({
          target: this.$refs.issueManageComplaintEchartBar,
          xData: selectData.ComplaintEchartBar,
          lineareaStyle: true,
          interval: 10,
          yData: [
            {
              type: "bar",
              data: this.complaintIssueBarObj[item],
              barMaxWidth: 35
            }
          ]
        });
      },
      // 效果预测
      effectPrediction() {
        storageProject.setStorage("narBar", "MR与仿真数据");
        this.$store.commit("upDataNavBar", "MR与仿真数据");
        this.$router.push("/LTEItem/MRData");
      },
      // 投诉时段指标
      complaintsIndex() {
        const _this = this;
        httpUrl.url
          .issueManageComplaint({
            param: {
              // wo_id: "'HN-108-180902-2','HN-108-180920-12','HN-108-180903-3'"
            }
          })
          .then(function(data) {
            const getData = JSON.parse(data.data.body);
            // 用户占用小区RSRP分布图：两个数据
            const first = (getData.rsrpmr[0] && getData.rsrpmr[0].number) || 0;
            const second = (getData.rsrpmr[1] && getData.rsrpmr[1].number) || 0;
            _this.RSRPNum = [first, second];
            // 投诉时段指标:六个数据显示
            getData.allnumber.forEach(function(item, index) {
              selectData.allNumbers[index].number =
                +parseFloat(item.number || 0).toFixed(2) || 0;
            });
          });
      },
      // table
      issueManageComplaintTable() {
        const _this = this;
        httpUrl.url
          .issueManageComplaintTable({
            param: {
              date: "2018-10-22",
              city: "长沙",
              wo_id: "", //'HN-108-180902-2','HN-108-180920-12','HN-108-180903-3'
              page: _this.ruleForm.page,
              limit: _this.ruleForm.limit
            }
          })
          .then(function(data) {
            const getData = JSON.parse(data.data.body);
            _this.tabBody = getData.signaling;
            _this.totallist = parseInt(getData.signalingCount);
          });
      },
      //   从新加载table
      reloadTable(item) {
        //   this.isReload = !this.isReload;
        this.ruleForm.page = item.tabPage;
        this.ruleForm.limit = item.tabSize;
        this.issueManageComplaintTable();
      },
      // 柱状图
      issueManageComplaintEchartBar() {
        const _this = this;
        httpUrl.url
          .issueManageComplaintEchartBar({
            param: {
              date: "2018-10-25",
              wo_id: "" //'HN-108-180902-2','HN-108-180920-12','HN-108-180903-3'
            }
          })
          .then(function(data) {
            const getData = JSON.parse(data.data.body).piclist;
            const arr = [];
            const obj = {};
            getData.forEach(function(item, index) {
              const key = dealArr.mapToJson(getData[index])[0].name;
              const val = dealArr.mapToJson(getData[index])[0].value;
              arr.push(key);
              obj[key] = val;
            });
            _this.complaintIssueBars = arr;
            _this.complaintIssueBarObj = obj;
            echartsAxisConfig({
              target: _this.$refs.issueManageComplaintEchartBar,
              xData: selectData.ComplaintEchartBar,
              lineareaStyle: true,
              interval: 10,
              yData: [
                {
                  type: "bar",
                  data: obj[arr[0]],
                  barMaxWidth: 35
                }
              ]
            });
          });
      },
      // arcgis地图
      issueManageComplaintMap() {
        const _this = this;
        httpUrl.url
          .issueManageComplaintMap({
            param: {
              woid: "HN-108-180916-4"
            }
          })
          .then(function(data) {
            const getData = commonMethod.getData(data).posList;
            _this.arcgisMapData = getData;
          });
      },
      addMap() {
        //   加载arcgis地图
        const obj = {
          lmap: new Lgis()
        };
        this.lmap = obj.lmap;
        arcgis.issueManageComplaintMap(obj);
      },
      // 加载页面
      loadPage() {
        //   加载投诉时段指标
        this.complaintsIndex();
        //   // table表格
        this.issueManageComplaintTable();
        //   柱状图
        this.issueManageComplaintEchartBar();
        //   arcgis地图
        this.issueManageComplaintMap();
      }
    },
    created() {},
    activated() {
      this.addMap();

      // 获取当前时间
      this.ruleForm.date = this.$route.query.date;
      this.ruleForm.city = this.$route.query.city;
      this.ruleForm.wo_id = this.$route.query.wo_id;
      // 生成省市选择下拉框
      this.allSelect.allProvince = dealArr.createDown(allProvince["湖南"]);
      // 生成省市选择下拉框
      this.allSelect.gridIndex = dealArr.createDown(selectData["gridIndex"]);
    },
    mounted() {
      this.loadPage();
    },
    beforeUpdate() {}
  };
</script>
<style  scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";

  #complaintMap {
    position: relative;
  }

  .complaintAnalyzeShowNumber {
    padding: 8px 20px;
    margin-right: 10px;
    text-align: center;
    border-radius: 5px;
    font-size: 12px;
  }
  .complaintAnalyzeShowNumber span {
    color: #fff;
  }
  .complaintAnalyzeShowNumber p {
    color: #fff;
  }

  .predicte {
    @{deep} button span {
      color: #999 !important;
      height: 24px;
      font-size: 10px;
    }
  }
  .predicte {
    @{deep} button {
      color: #ccc !important;
      border: 1px solid #ccc !important;
      background-color: #f8f8f8 !important;
    }
  }
</style>