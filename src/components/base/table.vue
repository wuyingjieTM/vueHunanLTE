<template>
    <div>
        <div style='overflow: hidden;' class="borderb">
            <v-data-table bordered ref="xtable" :data='getTabBody' :pageSizeOptions="pageSizeOptions" :responseParamsName="{total:'totalCount'} " :pageSize='pageSize' :total=200 :pageNum='pageNum' :columns='tabHead' @clickrow="clickRow">
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='tabEdit'" class="textCenter" @click="clickTabCompile({ row:props })">
                        <b>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-bianji"></use>
                            </svg>
                        </b>
                    </div>
                    <div v-else-if="props.column.field=='tabDelete'" class="textCenter">
                        <v-popconfirm title="确定删除吗?" placement="topRight" @confirm="clickTabDelete({ row:props })">
                            <b>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                            </b>
                        </v-popconfirm>
                    </div>
                    <div v-else-if="props.column.field=='pageSkip'" class="textCenter" @click="clickPageSkip({ row:props })">
                        <b>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-bangding"></use>
                            </svg>
                        </b>
                    </div>
                    <span v-else v-html="props.content" @click="curListDetail(props)"></span>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import { shejiyuanHttp } from "../../common/js/es6";
    import { httpUrl } from "../../common/js/setting";
    import { commonMethod } from "../../common/js/common";
    import tableData from "../../common/data/testTable.json";
    import {
      echartsConfig,
      echartsAxisConfig
    } from "../../common/js/echartsConfig";

    export default {
      props: [
        "directObj",
        "tabHead",
        "tabUrl",
        "tabParams",
        "body",
        "nextBody",
        "clickrow",
        "isReload",
        "callBackDele",
        "text"
      ],
      data: () => {
        return {
          bodyLength: 0, //通知父元素，table总数
          pageNum: 1,
          pageSize: 10,
          tabList: 0,
          pageSizeOptions: [5, 10, 15, 20, 30]
        };
      },
      methods: {
        refreshTable: function() {
          this.$refs.xtable.refresh();
        },
        reloadTable: function() {
          this.$refs.xtable.reload();
        },
        edit: function() {
          this.mydata = [];
        },
        //点击table编辑功能
        clickTabCompile(item) {
          this.$emit("tabCompile", item.row.item);
        },
        //点击table删除功能
        clickTabDelete(item) {
          this.$emit("tabDelete", item.row);
          this.refreshTable();
        },
        //点击table页面跳转
        clickPageSkip(item) {
          this.$emit("tabPageSkip", item.row.item);
        },
        //更新tab页码和大小
        upPageNum(item) {
          if (item) {
            if (
              this.tabParams &&
              this.tabParams.param &&
              this.tabParams.param.limit
            ) {
              this.tabParams.param.limit = item.pageSize;
            }
            if (
              this.tabParams &&
              this.tabParams.param &&
              this.tabParams.param.page
            ) {
              this.tabParams.param.page = item.pageNo;
            }
            this.pageSize = item.pageSize;
            this.pageNum = item.pageNo;
          }
        },
        getTabBody(item) {
          const _this = this;
          this.upPageNum(item);
          // 是否真的去后台请求数据
          if (_this.text) {
            //   返回table数据
            return httpUrl.url[this.tabUrl](this.tabParams).then(success => {
              let bodyData = [];
              if (_this.tabParams) {
                if ("string" === typeof success.data.body) {
                  if (null != _this.nextBody) {
                    bodyData = JSON.parse(success.data.body)[_this.body || "body"][
                      _this.nextBody
                    ];
                  } else {
                    bodyData = JSON.parse(success.data.body)[_this.body || "body"];
                  }
                } else {
                  //   直接返回对象：{data：[]}
                  if (this.directObj) {
                    bodyData = success[_this.body || "body"];
                  } else {
                    if (_this.nextBody) {
                      bodyData = success.data[_this.body || "body"][_this.nextBody];
                    } else {
                      bodyData = success.data[_this.body || "body"];
                    }
                  }
                }
              } else {
                bodyData = success.data.result || [];
              }
              //  返回数组个数
              _this.bodyLength = bodyData.length;
              const obj = {
                result: bodyData.slice(0, 10),
                totalCount: bodyData.length
                //   totalCount: success.data.totallist
              };
              return obj;
            });
          } else {
            return new Promise(function(resolve, reject) {
              resolve(tableData);
            });
          }
        },
        // 点击当前行table
        clickRow(item) {
          this.$emit("tabClickRow", item.row);
        },
        // 点击：当前小格子信息
        curListDetail(item) {
          this.$emit("curListDetail", item);
        },
        upData() {}
      },
      mounted() {},
      watch: {
        //   重新加载table表格
        isReload(item) {
          this.refreshTable();
        },
        pageNum(item) {
          this.$emit("changePage", item);
        },
        pageSize(item) {
          this.$emit("changeSize", item);
        },
        bodyLength(item) {
          this.$emit("tabBodyNumber", item);
        }
      }
    };
</script>

<style scoped>
</style>
