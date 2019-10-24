

<template>
  <div class="hello mt10">

    <div class="mt10 searchCk">
      <v-more-panel>
        <v-form slot="form">
          <v-form-item label="时间">
            <v-select
              :search="allowClear"
              @change="changeTime"
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.getDatas"
              v-model="ruleForm.date"
            ></v-select>
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
          <v-form-item>
            <v-button
              type="primary"
              icon="search"
              @click="toSearch"
            >查询</v-button>
          </v-form-item>
        </v-form>
      </v-more-panel>
    </div>

    <div class="partTitle mt10">概况</div>
    <div
      class="mt15"
      :class="isMore? 'more' : '' "
    >
      <div class="details clearfix containBorder">
        <v-more-panel originalHeight=175>
          <v-form slot="form">
            <template v-for="(item,index) in barArrs">
              <v-form-item
                style="width:20%"
                class="vFormItem"
                v-if="'其它' != item[0]"
              >
                <div
                  @click="scenceAnalyze(item)"
                  class="detail"
                  v-bind:class="{ double: index % 2, }"
                >
                  <div
                    class="inDetail boxShadow"
                    v-bind:class="{ boxShadowGreen: index % 2,boxShadowBlue: !(index % 2) }"
                  >
                    <div class="detailTitle font16">
                      {{item[0]}}
                    </div>
                    <p class="font12 ">{{item[0]}}总数：
                      <span>{{item[1]}}</span>
                    </p>
                    <p class="font12 ">弱覆盖{{item[0]}}数:
                      <span>{{item[2]}}</span>
                    </p>
                    <p class="font12 ">{{item[0]}}覆盖率：
                      <span> {{item[3]}}</span>
                    </p>
                  </div>
                </div>
              </v-form-item>
            </template>
          </v-form>
        </v-more-panel>
      </div>
    </div>

    <!-- table -->
    <div class="partTitle mt10">场景排名</div>

    <div class="scence">
      <div class="grid-demo tabs">
        <v-row>
          <v-col
            span="8"
            class="pr10"
          >
            <div>
              <template>
                <v-tabs active-tab-key="1">
                  <v-tab-pane
                    tab-key="1"
                    tab="场景覆盖率"
                  >
                    <div class='echartConatain'>
                      <div
                        class=" h350 containBorder showEchart mt5"
                        ref="weakOver"
                      >
                      </div>
                    </div>
                  </v-tab-pane>
                  <v-tab-pane
                    tab-key="2"
                    tab="弱覆盖场景数"
                  >
                    <div>
                      <div
                        class="h350 containBorder mt5"
                        ref="weakScenceCover"
                      ></div>
                    </div>
                  </v-tab-pane>
                </v-tabs>
              </template>
            </div>
          </v-col>
          <v-col
            span="16"
            class="pl10"
          >
            <div
              class=" h350 tableStyle"
              style="margin-top:26px;"
            >
              <text-table
                :fixRight="fixRight"
                :pageSizeOptions="pageSizeOptions"
                :hideSizeChanger="hideSizeChanger"
                :isReload="isReload"
                @curListDetail="curListDetail"
                @reloadTable="reloadTable"
                :tabPage=ruleForm.page
                :tabSize=ruleForm.limit
                :tabHead="tabHead"
                :totallist="totallist"
                :tabBody="tabBody"
              ></text-table>
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
  import { dealArr } from "../../common/js/dealArr.js";
  import { dealStr } from "../../common/js/dealStr.js";
  import { dealTime } from "../../common/js/dealTime.js";
  import allProvince from "../../common/data/allCityData.json";
  import tableData from "../../common/data/tableData.json";

  export default {
    data: () => {
      return {
        pageSize: 5,
        pageNum: 1,
        ruleForm: {
          date: "2018-06-28",
          city: "全省",
          scene_type: "",
          page: 1,
          limit: 12
        },
        fixRight: 3,
        pageSizeOptions: [12, 13, 14, 15],
        hideSizeChanger: true,
        resetPage: false,
        tabHead: tableData.homepageTable,
        tabBody: [],
        totallist: 0,
        isReload: false,
        allTimeCity: {},
        isMore: false,
        allowClear: false, //
        hideClick: false, //当返回指标类型的数量超过5的时候为true
        getParams: {}, //从后台获取的日期和城市
        isShowMore: false,
        allSelect: { allProvince: [], getDatas: [] },
        //   获取想半部分：所有指标
        barArrs: [],
        heightArr: [325, 480]
      };
    },
    methods: {
      curListDetail(item) {
        const curList = item.column.field;
        const problem_type = "poor" == curList ? "弱覆盖" : "竞对差";
        const isLink = parseInt(dealStr.getNum(item.content));
        if (("poor" === curList || "count" === curList) && isLink) {
          storageProject.setStorage("narBar", "问题点管理");
          this.$store.commit("upDataNavBar", "问题点管理");
          this.$router.push({
            path: "/LTEItem/issueManage",
            query: {
              date: this.ruleForm.date,
              city: this.ruleForm.city,
              scene_type: item.item.major,
              scene_name: item.item.minor,
              problem_type: problem_type
            }
          });
        }
      },
      reloadTable(item) {
        if (this.resetPage) {
          this.ruleForm.page = 1;
          this.ruleForm.limit = 12;
          this.resetPage = false;
        } else {
          this.ruleForm.page = item.tabPage;
          this.ruleForm.limit = item.tabSize;
        }
        this.homePageTable();
      },
      //   点击查询
      toSearch() {
        // 参数联动
        this.getIndexData();
        return false;
      },
      // 更改时间：联动
      changeTime() {
        const cityArr = this.allTimeCity[this.ruleForm.date];
        this.allSelect.allProvince = dealArr.createDown(cityArr, "全省");
        this.ruleForm.city = cityArr[1];
      },
      //   点击上面模块:进入问题管理页面
      scenceAnalyze(item) {
        if (item[0] != this.ruleForm.scene_type) {
          this.ruleForm.scene_type = item[0];
          this.resetPage = true;
          this.isReload = !this.isReload;
        }
      },
      // 显示更多：指标
      showMore() {
        this.isShowMore = !this.isShowMore;
        return false;
      },
      // 处理时间和地市
      dealTimeCity(getData) {
        this.getParams = getData;
        const dateArr = [];
        for (var k in getData) {
          dateArr.push(k);
        }
        //   处理获取的时间
        this.allSelect.getDatas = dealArr.createDown(dateArr);
        this.ruleForm.date = dateArr[0];
        //   处理获取的地市
        this.allSelect.allProvince = dealArr.createDown(
          this.getParams[dateArr[0]],
          "全省"
        );
        this.ruleForm.city = this.getParams[dateArr[0]][1];
      },
      // 获取时间和地市
      initParams() {
        const _this = this;
        httpUrl.url
          .homePageIndex({})
          .then(function(data) {
            if ("success" === data.data.requestStatus) {
              const getData = JSON.parse(data.data.body).queryFields;
              _this.allTimeCity = getData;
              //   将获取的日期和地市：赋值给getParams
              _this.dealTimeCity(getData);
            }
          })
          .then(function() {
            // 显示指标数据
            _this.getIndexData();
          });
      },
      // 显示反向：echart图
      showEchart(obj) {
        const _this = this;
        echartsRevertBar({
          target: this.$refs[obj.target],
          xData: obj.yData,
          textTitle: obj.title,
          titleFont: "16px",
          textTop: "10px",
          yData: obj.xData,
          unit: obj.unit || "",
          formatter: obj.formatter,
          barMaxWidth: 30,
          min: obj.min || 0,
          max: obj.max || 100,
          callBack: function(item) {
            if (item.name != _this.ruleForm.scene_type) {
              _this.ruleForm.scene_type = item.name;
              _this.resetPage = true;
              _this.isReload = !_this.isReload;
            }
          }
        });
      },
      // 展示场景排名：弱覆盖子场景数
      showOver() {
        const obj = {
          xData: [],
          yData: [],
          target: "weakScenceCover",
          title: "弱覆盖场景数",
          formatter: function(item) {
            return "场景数为：" + item[0].data;
          },
          min: 90,
          max: 100
        };
        for (let item of this.barArrs) {
          obj.xData.push(item[0]);
          obj.yData.push(parseFloat(item[2]));
        }
        dealArr.echartSort(obj.xData, obj.yData, true);
        var min = dealArr.getMin(obj.yData);
        var max = dealArr.getMax(obj.yData);
        if ((min == 0 && max == 0) || (min == 1 && max == 1)) {
          min = 0;
          max = 1;
        } else if (min == max) {
          min = min - 1;
          max = max + 1;
        }
        obj.min = min;
        obj.max = max;
        this.showEchart(obj);
      },
      // 展示场景排名：场景覆盖率
      showSceneBar() {
        const obj = {
          xData: [],
          yData: [],
          target: "weakOver",
          title: "场景覆盖率",
          unit: "%",
          formatter: function(item) {
            return "覆盖率：" + item[0].data + "%";
          },
          min: 90,
          max: 100
        };
        for (let item of this.barArrs) {
          obj.xData.push(item[0]);
          obj.yData.push(parseFloat(item[3].replace("%", "")));
        }
        dealArr.echartSort(obj.xData, obj.yData, true);
        const min = dealArr.getMin(obj.yData);
        const max = dealArr.getMax(obj.yData);
        if (min == max) {
          obj.min = (min * 0.9).toFixed(2);
          obj.max = max;
        } else {
          obj.min = (dealArr.getMin(obj.yData) - (max - min) * 0.2).toFixed(2);
          obj.max = (dealArr.getMax(obj.yData) + (max - min) * 0.2 > 100
            ? 100
            : dealArr.getMax(obj.yData) + (max - min) * 0.2
          ).toFixed(2);
        }
        this.ruleForm.scene_type = obj.xData[0];
        this.showEchart(obj);
        this.ruleForm.scene_type = obj.xData[0];
        //   加载table表格
        this.ruleForm.page = 1;
        this.ruleForm.limit = 14;
        this.homePageTable();
      },
      // 加载table表格
      homePageTable() {
        const _this = this;
        httpUrl.url.homePageTable({ param: this.ruleForm }).then(function(data) {
          const getData = JSON.parse(data.data.body);
          _this.totallist = getData.totallist;
          _this.tabBody = getData.tabData;
          const body = [];
          getData.tabData.forEach(function(item) {
            item.poor = "<a>" + (item.poor || 0) + "</a>";
            item.count = "<a>" + (item.count || 0) + "</a>";
            body.push(item);
          });
          _this.tabBody = body;
        });
      },
      // 获取指标数据
      getIndexData() {
        const _this = this;
        httpUrl.url
          .homePageIScene({ param: this.ruleForm })
          .then(function(data) {
            if ("success" === data.data.requestStatus) {
              const getData = JSON.parse(data.data.body).summary;
              // 当场景数大于5的时候，才展开更多
              _this.hideClick = getData.length > 5 ? true : false;
              _this.isMore = getData.length > 5 ? true : false;
              // 显示场景
              _this.barArrs = getData;
            }
          })
          .then(function() {
            // 展示两个ehcarts图
            _this.showOver();
            _this.showSceneBar();
          });
      }
    },
    created() {
      // 获取时间和地市
      this.initParams();
    },
    mounted() {
      // document.getElementsByClassName("inDetail").setAttribute("width", "400px");
    },
    beforeUpdate() {}
  };
</script>
<style scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";
  .more {
    @{deep} .ant-more-panel-btn {
      display: block !important;
    }
  }
  .details {
    @{deep} .vFormItem > div,
    @{deep} .ant-form-item-control,
    @{deep} .detail,
    @{deep} > div > div > div > div {
      width: 100% !important;
    }
  }
  .details {
    @{deep} .ant-more-panel-form {
      display: block !important;
    }
  }
  .details {
    @{deep} .vFormItem {
      margin-right: 0px !important;
    }
  }
  .scence {
    @{deep} .ant-tabs-nav .ant-tabs-tab {
      font-size: 12px;
      padding: 4px 5px;
    }
  }
  .tableStyle {
    @{deep} td a {
      color: #0284da !important;
    }
    @{deep} td {
      text-align: center;
    }
  }

  // 指标概览
  .detail {
    float: left;
    padding: 10px;
  }
  .detail .inDetail {
    padding: 10px;
    border-radius: 5px;
    background-color: @btn-blue;
  }
  .detail .inDetail:hover {
    cursor: pointer;
  }
  .detail.double .inDetail {
    background-color: @btn-green;
  }
  .detail .detailTitle {
    text-align: center;
    font-weight: 700;
    color: @text-fff;
    padding-bottom: 5px;
    border-bottom: 1px dashed @line-split;
  }
  .detail p {
    color: @text-fff;
    padding-left: 10px;
  }
  .detail p span {
    color: @text-fff;
    font-weight: 700;
  }

  // 多余十个：显示更多
  .details {
    overflow: hidden;
    position: relative;
    background-color: #fafafa;
  }
  .details > span {
    border: 1px solid #ddd;
    margin-left: -16px;
    display: inline-block;
    padding: 0px 16px;
    position: absolute;
    bottom: -8px;
    left: 50%;
    color: #000;
    font-size: 16px;
  }
  .showMore {
    height: 325px;
  }
  .showLess {
    height: 166px;
  }
</style>
