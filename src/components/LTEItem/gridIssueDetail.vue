<template>
  <div class="hello mt10">
    <!-- 模态框 -->
    <div class="modelDetail">
      <div>
        <v-collapse
          @change="onChange"
          v-model="activeIndex"
        >
          <template v-for="(item,index) in tabsArr">
            <v-panel
              :header='item.title 
              + " - "+ tabBodys[item.tab].totallist'
              :index=item.tab
            >
              <div class="mt10">
                <text-table
                  :hideSizeChanger=true
                  :isReload="isReload"
                  @reloadTable="reloadTable"
                  :tabPage=ruleForm.page
                  :tabSize=ruleForm.limit
                  :pageSizeOptions="pageSizeOptions"
                  :tabHead=tabHeads[item.tab]
                  :totallist=tabBodys[item.tab].totallist
                  :tabBody=tabBodys[item.tab].data
                ></text-table>
              </div>
            </v-panel>
          </template>
        </v-collapse>
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
    props: ["params", "url"],
    data: () => {
      return {
        getUrl: "issueManageDetail",
        activeIndex: ["告警分析"],
        allowClear: false,
        allSelect: { allProvince: [] },
        tabsArr: [],
        totallist: 0,
        isReload: false,
        pageSizeOptions: [5, 20],
        ruleForm: {
          date: "",
          city: "",
          grid: "1905902",
          table: "",
          page: 1,
          limit: 5,
          flag: "alarm"
        },
        curTab: "alarm",
        tabHeads: [],
        tabBodys: {
          alarm: {
            data: [],
            totallist: 0,
            page: 1
          },
          angle: {
            data: [],
            totallist: 0,
            page: 1
          },
          antenna: {
            data: [],
            totallist: 0,
            page: 1
          },
          backbuild: {
            data: [],
            totallist: 0,
            page: 1
          },
          missnei: {
            data: [],
            totallist: 0,
            page: 1
          },
          nobestcell: {
            data: [],
            totallist: 0,
            page: 1
          },
          overcover: {
            data: [],
            totallist: 0,
            page: 1
          },
          overdistance: {
            data: [],
            totallist: 0,
            page: 1
          }
        }
      };
    },
    watch: {
      params: {
        handler(newValue, oldValue) {
          this.getUrl = this.url;
          this.ruleForm.date = newValue.date;
          this.ruleForm.city = newValue.city;
          this.ruleForm.grid = newValue.grid || "";
          this.ruleForm.minor = newValue.minor || "";
          for (let item in this.tabBodys) {
            this.loadTable(item, 1);
          }
        },
        deep: true
      }
    },
    methods: {
      // 更改折叠框事件
      onChange(item) {
        this.curTab = item;
      },
      // 重载table
      reloadTable(item) {
        this.loadTable(this.curTab, item.tabPage);
      },
      // 加载table表格
      loadTable(type, page) {
        const _this = this;
        httpUrl.url[this.getUrl]({
          param: {
            date: this.ruleForm.date,
            city: this.ruleForm.city,
            limit: this.ruleForm.limit,
            grid: this.ruleForm.grid || "",
            minor: this.ruleForm.minor || "",
            page: page,
            flag: type
          }
        }).then(function(data) {
          const getData = JSON.parse(data.data.body);
          _this.tabBodys[type]["data"] = getData.resultList;
          _this.tabBodys[type]["totallist"] = parseInt(getData.resultCount) || 0;
        });
      }
    },
    created() {
      this.tabHeads = tableData.gridIssueDetailBody;
      this.allSelect.allProvince = dealArr.createDown(allProvince["湖南"]);
      this.tabsArr = selectData.gridIssueDetailTab;
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

  .hello {
    @{deep} .ant-tabs-nav .ant-tabs-tab {
      font-size: 12px !important;
      padding: 8px 8px !important;
    }
  }
</style>