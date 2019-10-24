<template>
    <div class="hello mt10">
        <v-more-panel>
            <v-form slot="form">
                <v-form-item label="日期">
                    <v-input placeholder=""></v-input>
                </v-form-item>
                <v-form-item label="地市">
                    <v-input type="password" placeholder="请输入密码"></v-input>
                </v-form-item>
                <v-form-item label="场景分类">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="一级场景">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="问题来源">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="问题栅格">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="问题类型">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="二级场景">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="智能分析状态">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="调整小区ECI">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="小区名称">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="问题状态">
                    <v-input></v-input>
                </v-form-item>
            </v-form>
            <div>
                <v-button slot="control" type="primary" html-type="button" icon="search">查询</v-button>
                <v-button slot="control" type="primary" html-type="button" icon="sync">条件重置</v-button>
                <v-button slot="control" type="primary" html-type="button" icon="arrow-down">导出</v-button>
            </div>
        </v-more-panel>

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
          tabHead: tableData.tableData.head,
          tabBody: tableData.tableData.body
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
<style scoped>
</style>