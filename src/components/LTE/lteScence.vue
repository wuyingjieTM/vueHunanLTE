<template>
    <div class="hello mt10">

        <div class="details clearfix">
            <template v-for="(item,index) in barArrs">
                <div class="detail" v-bind:class="{ double: index % 2, }" style="width:20%;">
                    <div class="inDetail boxShadow" v-bind:class="{ boxShadowGreen: index % 2,boxShadowBlue: !(index % 2) }">
                        <div class="detailTitle font16">
                            {{item.title}}
                        </div>
                        <p class="font12 p6"> 总场景数：
                            <span>{{item.index}}</span>
                        </p>
                        <p class="font12 p6">质差场景数:
                            <span>{{item.index1}}</span>
                        </p>
                        <p class="font12 p6">整体覆盖率：
                            <span> {{item.index2}}</span>
                        </p>
                    </div>
                </div>
            </template>

        </div>

        <!-- table -->
        <div class="partTitle mt15 font16">
            <span>质差场景</span>

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
    import { tabHeadData, tabBodyData } from "../../common/data/tableData.js";
    import tableData from "../../common/data/tableData.js";
    import {
      echartsConfig,
      echartsAxisConfig,
      echartsMap
    } from "../../common/js/echartsConfig";

    export default {
      data: () => {
        return {
          pageSize: 5,
          pageNum: 1,
          ruleForm: {
            param: {}
          },
          barArrs: [
            {
              title: "高校",
              index: "7265",
              index1: "392",
              index2: "98.5%"
            },
            {
              title: "高层",
              index: "68577",
              index1: "3573",
              index2: "96.3%"
            },
            {
              title: "高架",
              index: "48672",
              index1: "4738",
              index2: "97.4%"
            },
            {
              title: "高速",
              index: "53826",
              index1: "523",
              index2: "96.3%"
            },
            {
              title: "高铁",
              index: "46367",
              index1: "2690",
              index2: "98.5%"
            },
            {
              title: "高铁",
              index: "46367",
              index1: "2690",
              index2: "98.5%"
            },
            {
              title: "高铁",
              index: "46367",
              index1: "2690",
              index2: "98.5%"
            },
            {
              title: "高铁",
              index: "46367",
              index1: "2690",
              index2: "98.5%"
            },
            {
              title: "高铁",
              index: "46367",
              index1: "2690",
              index2: "98.5%"
            },
            {
              title: "高铁",
              index: "46367",
              index1: "2690",
              index2: "98.5%"
            }
          ],
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
      created() {
        // console.log(tabHeadData);
        // console.log(tabBodyData);
      },
      mounted() {},
      beforeUpdate() {}
    };
</script>
<style scoped lang='less'>
    @import "../../common/less/common.less";

    .detail {
      width: 20%;
      float: left;
      padding: 10px;
    }

    .detail .inDetail {
      padding: 10px;
      border-radius: 5px;
      background-color: @btn-blue;
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
</style>