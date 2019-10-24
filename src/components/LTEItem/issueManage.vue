<template>
  <div class="hello mt10">
    <div>
      <v-breadcrumb>
        <v-breadcrumb-item>问题点管理</v-breadcrumb-item>
      </v-breadcrumb>
    </div>
    <div class="mt15 more">
      <v-more-panel>
        <v-form slot="form">
          <v-form-item label="时间">
            <v-date-picker
              style="width: 120px;"
              @change="changeMore('time')"
              v-model="ruleForm.date"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="地市">
            <v-select
              search
              :allowClear="allowClear"
              @change="changeMore('city')"
              style="width: 100px;"
              :data="allSelect.city"
              v-model="ruleForm.city"
            ></v-select>
          </v-form-item>
          <v-form-item label="场景类型">
            <v-select
              :search="allowClear"
              @change="changeMore('scene')"
              style="width: 100px;"
              :data="allSelect.scene_type"
              v-model="ruleForm.scene_type"
            ></v-select>
          </v-form-item>
          <v-form-item label="场景名称">
            <v-select
              search
              style="width: 120px;"
              :data="allSelect.scene_name"
              v-model="ruleForm.scene_name"
            ></v-select>
          </v-form-item>
          <v-form-item label="栅格类型">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.problem_type"
              v-model="ruleForm.problem_type"
            ></v-select>
          </v-form-item>
          <v-form-item label="智能分析状">
            <v-select
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.status"
              v-model="ruleForm.status"
            ></v-select>
          </v-form-item>
          <v-form-item label="栅格ID">
            <v-input
              v-model="ruleForm.GRIDID"
              @keydown="isEmptyGRIDID"
            ></v-input>
          </v-form-item>
          <v-form-item label="投诉工单ID">
            <v-input
              v-model="ruleForm.wo_id"
              @keydown="isEmptyid"
            ></v-input>
          </v-form-item>
        </v-form>
        <div>
          <v-button
            slot="control "
            type="primary "
            @click="clickSearch()"
            icon="search "
          >查询</v-button>
          <v-button
            slot="control "
            type="primary "
            @click="clickReset()"
            icon="sync"
          >条件重置</v-button>
          <v-button
            slot="control "
            type="primary "
            @click="clickLoad()"
            icon="arrow-down "
          >查询结果导出</v-button>
          <v-button
            slot="control "
            type="primary "
            @click="clickLoad2()"
            icon="arrow-down "
          >解决方案导出</v-button>
        </div>
      </v-more-panel>
    </div>

    <div class="mt15 tableStyle">
      <text-table
        :pageSizeOptions="pageSizeOptions"
        :load="load"
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
  import { dealTime } from "../../common/js/dealTime.js";
  import { dealStr } from "../../common/js/dealStr.js";
  import { dealArr } from "../../common/js/dealArr.js";
  import { storageProject } from "../../common/js/session.js";
  import selectData from "../../common/data/selectData.json";
  import allProvince from "../../common/data/allCityData.json";
  import tableData from "../../common/data/tableData.json";
  import { http } from "../../common/js/es6";

  export default {
    data: () => {
      return {
        load: false,
        params: {},
        getAllParams: {},
        ruleForm: {
          date: "",
          city: "全省",
          scene_type: "",
          scene_name: "",
          problem_type: "全部",
          status: "全部",
          GRIDID: "",
          wo_id: "",
          page: 1,
          limit: 15
        },
        resetPage: false,
        pageSizeOptions: [10, 15, 20, 50],
        initializePage: true,
        totallist: 0,
        isReload: false,
        isText: true, //是否为table的测试数据
        isAnalyzeUrl: false, //是否使用地址栏参数
        allowClear: false,
        allSelect: { city: [] },
        tabHead: tableData.comHead,
        tabBody: []
      };
    },
    methods: {
      isEmptyGRIDID(item) {
        this.ruleForm.GRIDID = dealArr.trim(item);
      },
      isEmptyid(item) {
        this.ruleForm.wo_id = dealArr.trim(item);
      },
      // 参数联动
      issueManageParams(isReloadTable, changeCity) {
        const _this = this;
        httpUrl.url
          .issueManageParams({
            param: { date: this.ruleForm.date }
          })
          .then(function(data) {
            const getData = JSON.parse(data.data.body).sceneQueryFields;
            // 将参数赋值给：getAllParams
            _this.getAllParams = getData[_this.ruleForm.date];
          })
          .then(function() {
            if (changeCity) {
              _this.setCity();
            }
            // 是否重新加载table
            if (isReloadTable) {
              _this.setCity();
              _this.setScene();
              _this.setName();
              _this.dealTable();
            }
          });
      },
      // 动态设置
      setdynamic(isCirculation, data, type) {
        var arr = [];
        var curVal = "";
        if (isCirculation) {
          for (let item in data) {
            arr.push(item);
          }
        } else {
          arr = data;
        }
        if ("city" === type) {
          curVal = this.ruleForm.city || arr[0];
        } else if ("scene_type" === type) {
          curVal = this.ruleForm.scene_type || arr[0];
        } else if ("scene_name" === type) {
          curVal = this.ruleForm.scene_name || "";
        }
        this.ruleForm[type] = curVal;
        this.allSelect[type] = dealArr.createDown(arr);
      },
      // 动态设置：城市参数
      setCity() {
        const obj = this.getAllParams;
        this.setdynamic(true, obj, "city");
      },
      // 动态设置：场景类型
      setScene() {
        const obj = this.getAllParams[this.ruleForm.city];
        this.setdynamic(true, obj, "scene_type");
      },
      // 动态设置：场景名称
      setName() {
        const arr = this.getAllParams[this.ruleForm.city][
          this.ruleForm.scene_type
        ];
        this.setdynamic(false, arr, "scene_name");
      },
      // 更改时间：联动
      changeMore(item) {
        const _this = this;
        switch (item) {
          case "time":
            // 是否立刻刷新table
            _this.issueManageParams(false, "city");
            break;
          case "city":
            _this.setScene();
            break;
          case "scene":
            _this.setName();
            break;
        }
      },
      // 从新加载table
      reloadTable(item) {
        if (this.resetPage) {
          this.ruleForm.page = 1;
          this.ruleForm.limit = 15;
          this.resetPage = false;
        } else {
          this.ruleForm.page = item.tabPage;
          this.ruleForm.limit = item.tabSize;
        }
        this.dealTable();
      },
      // 当前行的详细信息：跳转
      curListDetail(item) {
        const curList = item.column.field;
        if ("gridid" === curList) {
          //   栅格问题
          storageProject.setStorage("narBar", "问题点管理");
          this.$store.commit("upDataNavBar", "问题点管理");
          this.$router.push({
            path: "/LTEItem/gridIssue",
            query: {
              date: item.item.date,
              grid: item.item.gridid.replace(/[^0-9]/gi, ""),
              city: item.item.city
            }
          });
        } else if ("minor" === curList) {
          const obj = {
            date: item.item.date,
            wo_id: dealStr.getNum(item.item.gridid),
            major: item.item.major,
            minor: item.item.minor.replace(/<a>/, "").replace(/<\/a>/, ""),
            city: item.item.city
          };
          //   场景问题
          storageProject.setStorage("narBar", "问题点管理");
          this.$store.commit("upDataNavBar", "问题点管理");
          this.$router.push({
            path: "/LTEItem/scenceIssue",
            query: obj
          });
        } else if ("type" === curList && "竞对差" === item.content) {
          // //   竞对问题
          // storageProject.setStorage("narBar", "问题点管理");
          // this.$store.commit("upDataNavBar", "问题点管理");
          // this.$router.push("/raceToIssue");
        // } else if ("programState" === curList) {
        } else if ("mr" === curList && "未分析" != item.content) {
          // MR 与仿真数据
          storageProject.setStorage("narBar", "MR与仿真数据");
          this.$store.commit("upDataNavBar", "MR与仿真数据");
          this.$router.push({
            path: "/LTEItem/MRData",
            query: {
              date: this.ruleForm.date,
              city: this.ruleForm.city,
              wo_id: dealStr.getNum(item.item.gridid)
            }
          });
        } else if ("complaintWorkOrder" === curList) {
          storageProject.setStorage("narBar", "问题点管理");
          this.$store.commit("upDataNavBar", "问题点管理");
          this.$router.push({
            path: "/LTEItem/complaintIssue",
            query: {
              date: this.ruleForm.date,
              city: this.ruleForm.city,
              wo_id: item.content.replace(/<a>/, "").replace(/<\/a>/, "")
            }
          });
        }
      },
      // 加载table
      dealTable() {
        const _this = this;
        this.ruleForm.scene_name = this.ruleForm.scene_name || "全部";
        httpUrl.url
          .issueManageTable({ param: this.ruleForm })
          .then(function(data) {
            const getData = commonMethod.getData(data);
            for (let item of getData.tabData) {
              item.gridid = "<a>" + item.gridid + "</a>";
              item.minor = "<a>" + item.minor + "</a>";
              console.log(item.content);
              item = "<a>查询数据</a>";
              if ("有" == item.iss) {
                //item.iss = "<a>" + item.iss + "</a>";
                item.iss = "" + item.iss + "";
              }
              if ("竞对差" == item.type) {
                item.type = "<a>" + item.type + "</a>";
              }
            }
            _this.tabBody = getData.tabData;
            _this.totallist = parseInt(getData.totallist);
          });
      },
      // 点击查询
      clickSearch() {
        this.resetPage = true;
        // 参数联动
        this.isReload = !this.isReload;
        return false;
      },
      // 点击重置条件
      clickReset() {
        this.ruleForm.scene_type = "";
        this.ruleForm.scene_name = "";
        this.ruleForm.problem_type = "全部";
        this.ruleForm.status = "全部";
        this.ruleForm.GRIDID = "";
        this.ruleForm.wo_id = "";
      },
      // 点击查询结果导出
      clickLoad() {
        var obj = { export_flag: 1 };
        for (var key of Object.keys(this.ruleForm)) {
          obj[key] = this.ruleForm[key];
        }
        httpUrl.downLoad({ url: "problemsManager/problemsList", param: obj })
        return false;
      },
      // 点击解决方案导出
      clickLoad2() {
        var obj = { export_flag: 1 };
        for (var key of Object.keys(this.ruleForm)) {
          obj[key] = this.ruleForm[key];
        }
        httpUrl.downLoad({ url: "problemsManager/problemsSolutionList", param: obj })
        return false;
      },
      
      // 初始化参数
      init() {
        // 重置参数
        this.ruleForm.date =
          this.$route.query.date || this.ruleForm.date || dealTime.localTime();
        this.ruleForm.city = this.$route.query.city || this.ruleForm.city || "全省";
        this.ruleForm.scene_type =
          this.$route.query.scene_type || this.ruleForm.scene_type || "";
        this.ruleForm.scene_name =
          this.$route.query.scene_name || this.ruleForm.scene_name || "";
        this.ruleForm.problem_type =
          this.$route.query.problem_type || this.ruleForm.problem_type || "全部";
        this.ruleForm.status = "全部";
        this.ruleForm.GRIDID = "";
        this.ruleForm.wo_id = "";
        this.ruleForm.page = 1;
        this.ruleForm.limit = 15;
        // 参数联动
        this.issueManageParams(true);
      }
    },
    created() {
      //   栅格类型
      this.allSelect.problem_type = dealArr.createDown(
        selectData["problem_type"]
      );
      this.allSelect.status = dealArr.createDown(selectData["status"]);
      this.initializePage = false;
      //   初始化页面
      this.init();
    },
    watch: {
      ruleForm: {
        handler(newValue, oldValue) {
          this.ruleForm.GRIDID = newValue.GRIDID.trim();
          this.ruleForm.wo_id = newValue.wo_id.trim();
        },
        deep: true
      }
    },
    activated() {
      const url = this.$route.query;
      const isReload =
        this.ruleForm.date != url.date ||
        this.ruleForm.city != url.city ||
        this.ruleForm.scene_type != url.scene_type ||
        this.ruleForm.scene_name != url.scene_name ||
        this.ruleForm.problem_type != url.problem_type;
      const idSame =
        this.ruleForm.date == url.date &&
        this.ruleForm.city == url.city &&
        this.ruleForm.scene_type == url.scene_type &&
        this.ruleForm.scene_name == url.scene_name &&
        this.ruleForm.problem_type == url.problem_type;
      if (this.$route.query.date && isReload) {
        this.init();
      } else if (this.$route.query.date && idSame) {
        this.init();
      }
    },
    mounted() {},
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
  .tableStyle {
    @{deep} td a {
      color: #0284da !important;
    }
  }
</style>