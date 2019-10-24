<template>
  <div class="hello mt10">

    <div>
      <v-breadcrumb>
        <v-breadcrumb-item>MR与仿真数据</v-breadcrumb-item>
      </v-breadcrumb>
    </div>
    <div class="mt15">
      <v-more-panel>
        <v-form slot="form">
          <v-form-item label="时间">
            <v-date-picker
              style="width: 120px;"
              v-model="ruleForm.date"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="地市">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.allProvince"
              v-model="ruleForm.city"
            ></v-select>
          </v-form-item>
          <v-form-item label="栅格ID">
            <v-input
              style="width: 120px;"
              v-model="ruleForm.grid"
            ></v-input>
          </v-form-item>
          <v-form-item label="渲染数据源">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.type"
              v-model="ruleForm.type"
            ></v-select>
          </v-form-item>
          <v-form-item>
            <v-button
              type="primary"
              icon="search"
              @click="toSearch"
            >查询</v-button>
          </v-form-item>
        </v-form>
      </v-more-panel>
    </div>
    <!-- GIS地图 -->
    <div class="mt15">
      <div
        class="border bg"
        id="lteMrMap"
        style="position:relative;height:340px"
      ></div>
    </div>

    <!-- table表格 -->
    <div class="clearfix mt15">
      <div class="pull-right">
        <v-button
          slot="control"
          type="primary"
          html-type="button"
          icon="arrow-down"
          @click="clickLoad()"
        >导出</v-button>
      </div>
    </div>
    <div class="mt15">
      <text-table
        :isReload="isReload"
        @reloadTable="reloadTable"
        :tabPage=ruleForm.page
        :tabSize=ruleForm.limit
        :tabHead="tabHead"
        :totallist="totallist"
        :tabBody="tabBody"
      ></text-table>
    </div>

  </div>
</template>
<script>
  import axios from "axios";
  import { httpUrl } from "../../common/js/setting";
  import { commonMethod } from "../../common/js/common";
  import arcgisData from "../../common/data/arcgisData.js";
  import { arcgis } from "../../common/js/arcgis/arcgis.js";
  import tableData from "../../common/data/tableData.json";
  import { arcgisConfig } from "../../common/js/arcgis/arcgisConfig.js";
  import { dealArr } from "../../common/js/dealArr.js";
  import { dealTime } from "../../common/js/dealTime.js";
  import allProvince from "../../common/data/allCityData.json";
  import selectData from "../../common/data/selectData.json";
  import { http } from "../../common/js/es6";

  export default {
    data: () => {
      return {
        ruleForm: {
          date: "2018-09-20",
          city: "长沙",
          grid: "2046348",
          type: "MR数据",
          page: 1,
          limit: 10
        },
        totallist: 0,
        isReload: false,
        tabHead: tableData.mrDataTable,
        tabBody: [],
        lmap: {},
        arcgis: {},
        allowClear: false,
        allSelect: { allProvince: [], type: [] },
        noClickF5: true, //是否手动刷新了地图
        loadMap: false,
        initMapData: [],
        resetPage: true,
        params: {},
        initPage: false
      };
    },
    methods: {
      clickLoad() {
        var obj = { export_flag: 1 };
        for (var key of Object.keys(this.ruleForm)) {
          obj[key] = this.ruleForm[key];
        }
        httpUrl.downLoad({ url: "MrSimulManager/mrsimullist", param: obj })
        return false;
      },
      //   重载table表格
      reloadTable(item) {
        if (this.resetPage) {
          this.ruleForm.page = 1;
          this.ruleForm.limit = 10;
          this.resetPage = false;
        } else {
          this.ruleForm.page = item.tabPage;
          this.ruleForm.limit = item.tabSize;
        }
        this.MRDataTable();
      },
      //   点击查询
      toSearch() {
        //   配置参数
        const url = this.$route.query;
        this.ruleForm.date = url.date || "2018-09-20";
        this.ruleForm.city = url.city || "长沙";
        this.ruleForm.grid = url.wo_id || "2046348";

        this.resetPage = true;
        // table表格数据
        this.isReload = !this.isReload;
        // 获取栅格数据
        this.issueManageGridIdGrid();
        return false;
      },
      // table表格数据
      MRDataTable() {
        const _this = this;
        httpUrl.url.MRDataTable({ param: this.ruleForm }).then(
          function(data) {
            const getData = JSON.parse(data.data.body);
            _this.totallist = getData.resultCount;
            _this.tabBody = getData.resultList;
          },
          function() {
            _this.totallist = 0;
            _this.tabBody = [];
          }
        );
      },
      // 添加栅格
      issueManageGridIdGrid() {
        //   如果存在图层
        if (this.arcgis.map) {
          addMap.deleteAll(this.arcgis.map);
        }
        const _this = this;
        httpUrl.url
          .issueManageGridIdGrid({
            param: this.ruleForm
          })
          .then(
            function(data) {
              const getData = JSON.parse(data.data.body);
              _this.centerArc = getData.gridLonLat;
              const centerArc = getData.gridLonLat;
              const arcgisDatas = getData.rangeGrid;
              //   初始化地图
              const arcgis = addMap.initMap({
                id: "lteMrMap",
                center: getData.gridLonLat,
                layerUrl: commonMethod.url.layerUrl,
                imgUrl: commonMethod.url.imgUrl,
                showTool: false,
                zoom: 15
              });

              arcgis.then(function(map) {
                _this.arcgis = map;
                const objData = [];
                for (let item in arcgisDatas) {
                  var title = "其他栅格";
                  if (1 == arcgisDatas[item][2]) {
                    title = "竞对差栅格";
                  } else if (2 == arcgisDatas[item][2]) {
                    title = "弱覆盖栅格";
                  } else {
                    title = "其他栅格";
                  }
                  objData.push({
                    x: arcgisDatas[item][0],
                    y: arcgisDatas[item][1],
                    color: arcgisDatas[item][2],
                    eci: item,
                    title: title
                  });
                }
                addMap.drawGrid(map, {
                  layerId: "lteMrMapGrid",
                  data: objData,
                  text: [
                    { title: "经度", text: "x" },
                    { title: "纬度", text: "y" },
                    { title: "栅格ID", text: "eci" }
                  ]
                });
                //   调整图层顺序
                addMap.reorder(map, [{ id: "point", layer: 10 }]);
              });
              return arcgis;
            },
            function() {
              console.log("失败");
            }
          )
          .then(function() {
            //   加载arcgis地图连线
            httpUrl.url
              .issueManageGridIdLine({ param: _this.ruleForm })
              .then(function(data) {
                const getData = JSON.parse(data.data.body).Top3CellPos;
                const arr = [];
                for (let item of getData) {
                  arr.push({
                    x: item[1],
                    y: item[2],
                    pop: item[3] || 0,
                    eci: [0]
                  });
                }
                // 加载连线
                addMap.drawLine(_this.arcgis, {
                  data: arr,
                  center: _this.centerArc,
                  layerId: "lteMrMapLine",
                  text: [
                    { title: "经度", text: "x" },
                    { title: "纬度", text: "y" }
                  ]
                });
                // 加载扇叶
                addMap.drawSector(_this.arcgis, {
                  data: arr,
                  radius: 1200,
                  layerId: "lteMrMapSector",
                  text: [
                    { title: "经度", text: "x" },
                    { title: "纬度", text: "y" }
                  ]
                });
                //   调整图层顺序
                addMap.reorder(_this.arcgis, [{ id: "point", layer: 10 }]);
              });
          });
      }
    },
    created() {
      this.ruleForm.date = this.$route.query.date || "2018-09-20";
      this.ruleForm.city = this.$route.query.city || "长沙";
      this.ruleForm.grid = this.$route.query.wo_id || "2046348";
      // 生成省市选择下拉框
      this.allSelect.allProvince = dealArr.createDown(
        allProvince["湖南"],
        "全省"
      );
      // 渲染数据源
      this.allSelect.type = dealArr.createDown(selectData.type);
    },
    mounted() {
      //   加载table表格
      this.MRDataTable();
    },
    activated() {
      const url = this.$route.query;
      const isReload =
        this.ruleForm.date != url.date ||
        this.ruleForm.city != url.city ||
        this.ruleForm.grid != url.wo_id;
      const idSame =
        this.ruleForm.date == url.date &&
        this.ruleForm.city == url.city &&
        this.ruleForm.grid == url.wo_id;
      const isSpace = !url.date && !url.city && !url.wo_id;
      // 直接点击：MR与仿真数据页面
      if (isSpace) {
        this.toSearch();
      } else if (url.date && isReload) {
        this.toSearch();
      } else if (url.date && idSame) {
      } else {
        this.toSearch();
      }
    }
  };
</script>
<style scoped lang='less'>
  @import "../../common/less/common.less";

  @deep: ~">>>";
  .hello {
    @{deep} .aaaaa {
      border-right: none !important;
    }
    @{deep} .bbbbb {
      border-left: none !important;
      border-right: none !important;
    }
  }
</style>