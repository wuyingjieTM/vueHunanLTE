<template>
  <div class="hello mt10">

    <!-- 模态框 -->
    <div class="modelDetail">
      <template>
        <v-modal
          title="解决方案明细"
          :visible="visible"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <div>
            <v-tabs
              active-tab-key="alarm"
              @tab-click='tabClick'
            >
              <template v-for="(item,index) in tabsArr">
                <v-tab-pane
                  :tab-key="item.tab"
                  :tab="item.title"
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
                </v-tab-pane>
              </template>
            </v-tabs>
          </div>
        </v-modal>
      </template>
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
    props: ["showModel", "params"],
    data: () => {
      return {
        visible: false, //弹出框默认为false
        allowClear: false,
        allSelect: { allProvince: [] },
        tabsArr: [],
        totallist: 0,
        isReload: false,
        pageSizeOptions: [5, 20],
        ruleForm: {
          date: "",
          city: "",
          minor: "",
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
      showModel(cur, old) {
        this.visible = cur;
      },
      params: {
        handler(newValue, oldValue) {
          this.ruleForm.date = newValue.date;
          this.ruleForm.city = newValue.city;
          this.ruleForm.minor = newValue.minor;
          for (let item in this.tabBodys) {
            this.loadTable(item, 1);
          }
        },
        deep: true
      }
    },
    methods: {
      // 弹框
      handleOk() {
        this.visible = false;
        this.$emit("changeState", this.visible);
      },
      handleCancel() {
        this.visible = false;
        this.$emit("changeState", this.visible);
      },
      // 重载table
      reloadTable(item) {
        this.loadTable(this.curTab, item.tabPage);
      },
      // 加载table表格
      loadTable(type, page) {
        const _this = this;
        httpUrl.url
          .sceneDetail({
            param: {
              date: this.ruleForm.date,
              city: this.ruleForm.city,
              limit: this.ruleForm.limit,
              minor: this.ruleForm.minor,
              page: page,
              flag: type
            }
          })
          .then(function(data) {
            const getData = JSON.parse(data.data.body);
            _this.tabBodys[type]["data"] = getData.resultList;
            _this.tabBodys[type]["totallist"] =
              parseInt(getData.resultCount) || 0;
          });
      },
      // 点击切换签
      tabClick(item) {
        this.curTab = item;
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