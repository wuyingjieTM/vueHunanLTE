<template>
  <div>
    <div class="tabStyle">
      <v-data-table
        :fixed-right="fixedRight"
        stripe
        @clickrow="clickRow"
        bordered
        ref="table"
        :data='loadData'
        :columns='tabHead'
        :pagination="false"
      >
        <template
          slot="td"
          slot-scope="props"
        >
          <div
            v-if="props.column.field=='tabEdit'"
            class="textCenter"
            @click="clickTabCompile({ row:props })"
          >
            <b>
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-bianji"></use>
              </svg>
            </b>
          </div>
          <div
            v-else-if="props.column.field=='tabDelete'"
            class="textCenter"
          >
            <v-popconfirm
              title="确定删除吗?"
              placement="topRight"
              @confirm="clickTabDelete({ row:props })"
            >
              <b>
                <svg
                  class="icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-shanchu"></use>
                </svg>
              </b>
            </v-popconfirm>
          </div>
          <div
            v-else-if="props.column.field=='pageSkip'"
            class="textCenter"
            @click="clickPageSkip({ row:props })"
          >
            <b>
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-bangding"></use>
              </svg>
            </b>
          </div>
          <span
            v-else
            v-html="props.content"
            @click="curListDetail(props)"
          ></span>
        </template>

        <!-- 无数据的时候显示 -->
        <template
          slot="emptytext"
          slot-scope="props"
        >
          <v-tag>暂无数据......</v-tag>
        </template>
      </v-data-table>

    </div>
    <!-- 分页 -->
    <div class="clearfix">
      <div class="pull-right mt15">
        <template>
          <v-pagination
            :pageSizeOptions="pageSizeArr"
            :showQuickJumper="showQuickJumper"
            :showSizeChanger='changeSize'
            :show-total="showTotal"
            :value=tableParams.tabPage
            :total=tableParams.totallist
            :page-size=tableParams.tabSize
            @change="loadPage"
            show-size-changer
            @sizechange="pageSizeChange"
          >
          </v-pagination>
        </template>
      </div>
    </div>

  </div>

</template>

<script>
  import axios from "axios";
  import { shejiyuanHttp } from "../../common/js/es6";
  import { httpUrl } from "../../common/js/setting";
  import { commonMethod } from "../../common/js/common";
  export default {
    props: [
      "directObj",
      "tabHead",
      "tabBody",
      "load",
      "totallist",
      "tabPage",
      "tabSize",
      "isReload",
      "hideSizeChanger",
      "pageSizeOptions",
      "resetPage",
      "fixRight"
    ],
    data: () => {
      return {
        fixedRight: "",
        changeSize: true,
        pageSizeArr: [10, 15, 20, 50],
        tableParams: {
          totallist: 0, //总数,
          tabPage: 1, //当前页数
          tabSize: 10 //当前页数大小
        },
        showQuickJumper: false,
        tabHeadData: [],
        tabBodyData: {
          result: []
        }
      };
    },
    methods: {
      //   点击当前行
      clickRow(item) {
        this.$emit("clickRow", item);
      },
      // 显示数据总数
      showTotal(total) {
        return `全部 ${this.tableParams.totallist} 条`;
      },
      //   改变每页大小
      pageSizeChange(current, size) {
        this.tableParams.tabSize = size;
        this.refreshTable();
      },
      //   改变页数
      loadPage(current) {
        this.tableParams.tabPage = current;
        this.refreshTable();
      },
      // 将数据显示到table中
      loadData(pramas) {
        const _this = this;
        return new Promise(function(resolve, reject) {
          resolve(_this.tabBodyData);
        }).then(function(item) {
          return item;
        });
      },
      // 从新加载table
      refreshTable() {
        this.$emit("reloadTable", this.tableParams);
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
      // 当前行的详细信息
      curListDetail(item) {
        this.$emit("curListDetail", item);
      }
    },
    watch: {
      //   监听数据是否变化，刷新table
      tabBody: {
        //深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.tabBodyData.result = val;
          this.$refs.table.refresh();
        },
        deep: true
      },
      totallist: {
        //深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.tableParams.totallist = val;
        },
        deep: true
      },
      tabPage(val, oldVal) {
        this.tableParams.tabPage = val;
      },
      tabSize(val, oldVal) {
        this.tableParams.tabSize = val;
      },
      isReload: function() {
        this.refreshTable();
      }
    },
    created() {
      //   头部
      this.tabHeadData = this.tabHead;
      //   body
      this.tabBodyData.result = this.tabBody;
      // 总数
      this.tableParams.totallist = parseInt(this.totallist);
      // 页数
      this.tableParams.tabPage = parseInt(this.tabPage);
      // 页数大小
      this.tableParams.tabSize = parseInt(this.tabSize);
      // 是否启动手动改变pageSIze大小
      this.changeSize = !this.hideSizeChanger;
      // 设置分页选择
      this.pageSizeArr = this.pageSizeOptions || [10, 20, 30, 50];
      // 固定右侧第几行
      this.fixedRight = this.fixRight || 0;
    }
  };
</script>

<style scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";
  .tabStyle {
    @{deep} .ant-tag-text {
      font-size: 12px !important;
    }
  }
</style>
