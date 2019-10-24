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

        <!-- tabs -->
        <div class="mt15">
            <v-tabs active-tab-key="1">
                <v-tab-pane tab-key="1" tab="流量">
                    <div class="h300 containBorder"></div>
                </v-tab-pane>
                <v-tab-pane tab-key="2" tab="下行速率">
                    <div class="h300 containBorder"></div>
                </v-tab-pane>
                <v-tab-pane tab-key="3" tab="切换成功率">
                    <div class="h300 containBorder"></div>
                </v-tab-pane>
                <v-tab-pane tab-key="4" tab="覆盖率">
                    <div class="h300 containBorder"></div>
                </v-tab-pane>
                <v-tab-pane tab-key="5" tab="无线接通率">
                    <div class="h300 containBorder"></div>
                </v-tab-pane>
                <v-tab-pane tab-key="6" tab="无线掉话率">
                    <div class=" h300 containBorder "></div>
                </v-tab-pane>
            </v-tabs>
        </div>

        <!-- 当前小区详情 -->
        <div class="h300 containBorder mt15 "></div>

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
<style scoped>
</style>