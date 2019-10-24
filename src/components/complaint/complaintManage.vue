<template>
    <div class="hello mt10">

        <div class="workComplain">
            投诉工单管理
        </div>

        <div class="clearfix mt10">
            <div class="pull-right">
                <v-button slot="control" type="primary" html-type="button" icon="arrow-down">导出</v-button>
            </div>
        </div>

        <div class="mt15">
            <!-- <my-table class="mt15" :isLocal="'local'" :body="'result'" :tabUrl="'table'" :tabParams="ruleForm" :pagination="'true'" :tabHead="tabHead"></my-table> -->
            <v-data-table bordered ref="xtable" :data='getBody' :columns='tabHead'> </v-data-table>
        </div>

    </div>
</template>

<script>
    import axios from "axios";
    import { httpUrl } from "../../common/js/setting";
    import { commonMethod } from "../../common/js/common";
    import tableData from "../../common/data/tableData.js";
    import {
      echartsConfig,
      echartsAxisConfig,
      echartsMap
    } from "../../common/js/echartsConfig";

    export default {
      data: () => {
        return {
          tabBody: tableData.tableData.body,
          tabHead: tableData.tableData.head
        };
      },
      methods: {
        getBody() {
          return httpUrl.local.table({}).then(
            success => {
              const obj = {
                result: this.tabBody,
                totalCount: 1
              };
              return obj;
            },
            error => {
              const obj = {
                result: this.tabBody,
                totalCount: 1
              };
              return obj;
            }
          );
        }
      },
      created() {},
      mounted() {
        //   this.submitForm("customRuleForm");
      },
      beforeUpdate() {}
    };
</script>
<style scoped lang="less">
    @import "../../common/less/common.less";

    .workComplain {
      padding: 4px 0 10px;
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      border-bottom: 1px solid @line-border;
    }
</style>