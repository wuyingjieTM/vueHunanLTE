<template>
    <div class="hello mt10">
        <v-more-panel>
            <v-form slot="form">
                <v-form-item label="开始时间">
                    <v-input placeholder=""></v-input>
                </v-form-item>
                <v-form-item label="结束时间">
                    <v-input type="password"></v-input>
                </v-form-item>
                <v-form-item label="字段选择">
                    <v-input></v-input>
                </v-form-item>
                <v-form-item placeholder="请选择字段内容">
                    <v-input></v-input>
                </v-form-item>
            </v-form>
            <div>
                <v-button slot="control" type="primary" html-type="button" icon="search">查询</v-button>
            </div>
        </v-more-panel>

        <div class="bordered clearfix mt15">
            <template v-for="(item,index) in allNumbers">
                <div class="pull-left complaintAnalyzeShowNumber border" :style=item.color>
                    <p>{{item.title}}</p>
                    <span>{{item.number}}</span>
                </div>
            </template>
        </div>

        <div>
            <div class="grid-demo">
                <v-row>
                    <v-col span="12" class="p10">
                        <div class="  mt15">

                            <p class="partTitle mt15">投诉时段指标</p>
                            <div class="mt15">
                                <v-data-table bordered ref="xtable" :data='getBody' :columns='tabHead'> </v-data-table>
                            </div>

                            <p class="partTitle mt15">用户遍历栅格问题分析表</p>
                            <div class="mt15">
                                <v-data-table bordered ref="xtable" :data='getBody' :columns='tabHead'> </v-data-table>
                            </div>

                            <p class="partTitle mt15">用户遍历栅格问题分析图</p>
                            <div class="mt15">
                                <div style="height: 300px;" class="containBorder " ref="complaintAnalyzeEchart"></div>
                            </div>

                        </div>
                    </v-col>
                    <v-col span="12" class="p10">
                        <p class="partTitle mt15">地图模块</p>
                        <div class=" containBorder mt15" style="height:800px;"></div>
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
    import tableData from "../../common/data/tableData.js";
    import {
      echartsConfig,
      echartsAxisConfig,
      echartsMap
    } from "../../common/js/echartsConfig";

    export default {
      data: () => {
        return {
          allNumbers: [
            {
              title: "平均RSRP",
              number: -105,
              color: "background-color:#F8A042"
            },
            {
              title: "平均RSRP",
              number: -85,
              color: "background-color:#55AAFD"
            },
            {
              title: "平均RSRP",
              number: -105,
              color: "background-color:#33C876"
            },
            {
              title: "平均RSRP",
              number: -105,
              color: "background-color:#F55B3E"
            },
            {
              title: "平均RSRP",
              number: -105,
              color: "background-color:#F8A042"
            },
            {
              title: "平均RSRP",
              number: -85,
              color: "background-color:#55AAFD"
            },
            {
              title: "平均RSRP",
              number: -105,
              color: "background-color:#33C876"
            },
            {
              title: "平均RSRP",
              number: -105,
              color: "background-color:#F55B3E"
            }
          ],
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
        complaintAnalyzeEchart() {
          echartsAxisConfig({
            target: this.$refs["complaintAnalyzeEchart"],
            xData: [
              "2018-05-01",
              "2018-05-02",
              "2018-05-03",
              "2018-05-04",
              "2018-05-05"
            ],
            lineareaStyle: true,
            yData: [
              {
                type: "line",
                data: ["4", "12", "28", "2", "24"],
                barMaxWidth: 35
              }
            ]
          });
        }
      },
      created() {},
      mounted() {
        this.complaintAnalyzeEchart();
        //   this.submitForm("customRuleForm");
      },
      beforeUpdate() {}
    };
</script>
<style scoped>
    /* @import "../../common/less/common.less"; */
    .complaintAnalyzeShowNumber {
      padding: 8px 20px;
      border: 1px solid red;
      margin-right: 15px;
      text-align: center;
      border-radius: 5px;
    }
    .complaintAnalyzeShowNumber span {
      color: #fff;
    }
    .complaintAnalyzeShowNumber p {
      color: #fff;
    }
</style>