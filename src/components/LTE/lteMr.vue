<template>
    <div class="hello mt10">

        <v-more-panel>
            <v-form slot="form">
                <v-form-item label="开始时间">
                    <v-input placeholder=""></v-input>
                </v-form-item>
                <v-form-item label="结束时间">
                    <v-input type="password" placeholder="请输入密码"></v-input>
                </v-form-item>
                <v-form-item label="查询ID">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item label="渲染数据来源">
                    <v-input></v-input>
                </v-form-item>
            </v-form>
            <div>
                <v-button slot="control" type="primary" html-type="button" icon="search">查询</v-button>
            </div>
        </v-more-panel>

        <!-- GIS地图 -->

        <div class="mt15">
            <div class="border h400 bg" id="lteMrMap"></div>
        </div>

        <!-- table表格 -->
        <div class="clearfix mt15">
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
    import arcgisData from "../../common/data/arcgisData.js";
    import { arcgis } from "../../common/js/arcgis/arcgis.js";
    import tableData from "../../common/data/tableData.js";
    import {
      echartsConfig,
      echartsAxisConfig,
      echartsMap
    } from "../../common/js/echartsConfig";

    export default {
      data: () => {
        return {
          noClickF5: true, //是否手动刷新了地图
          loadMap: false,
          initMapData: [],
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
        },
        // 初始化地图
        addMap() {
          const obj = {
            data: arcgisData.arcgisData.initgisData,
            map: new Lgis()
          };
          arcgis.lteMrMap(obj);
        },
        // 监听F5事件
        reLoad(e) {}
      },
      created() {},
      mounted() {
        this.addMap();
      }
    };
</script>
<style scoped>
</style>