<template>
  <div class="hello mt10">
    <div>
      <v-breadcrumb>
        <v-breadcrumb-item>仿真对比管理</v-breadcrumb-item>
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
          <v-form-item label="省份">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 100px;"
              :data="allSelect.city"
              v-model="ruleForm.city"
            ></v-select>
          </v-form-item>
          <v-form-item label="场景类型">
            <v-select
              :search="allowClear"
              :allowClear="allowClear"
              style="width: 100px;"
              @change="selectScence"
              :data="allSelect.scene_type"
              v-model="ruleForm.scene_type"
            ></v-select>
          </v-form-item>
          <v-form-item label="场景名称">
            <v-select
              search
              :allowClear="allowClear"
              style="width: 120px;"
              :data="allSelect.scene_name"
              v-model="ruleForm.scene_name"
            ></v-select>
          </v-form-item>
          <v-form-item label="栅格ID">
            <v-input
              style="width: 120px;"
              v-model="ruleForm.GRIDID"
            ></v-input>
          </v-form-item>
          <v-form-item label="投诉工单ID">
            <v-input
              style="width: 120px;"
              v-model="ruleForm.wo_id"
            ></v-input>
          </v-form-item>
        </v-form>
        <div>
          <v-button
            slot="control "
            type="primary "
            @click="clickBtn('查询')"
            icon="search "
          >查询</v-button>
        </div>
      </v-more-panel>
    </div>

    <!-- table表格 -->
    <div class="mt15">
      <my-table
        :tabUrl="'homePageIndex'"
        :tabParams="params"
        :pagination="'true'"
        :body="'result'"
        :tabHead="tabHead"
      ></my-table>
    </div>

    <!-- 2D和3D效果图前后对比 -->
    <div>
      <div class="changTu">
        <v-button
          slot="control "
          type="primary "
          html-type="button "
          @click="clickChangeTu"
        >切换到{{opposite}}D</v-button>
      </div>
      <div class="grid-demo">
        <v-row>
          <v-col
            span="12"
            class="p10"
          >
            <div class="partTitle">调整前{{changTu}}D效果图</div>
            <div class="h300 containBorder mt10"></div>
          </v-col>
          <v-col
            span="12"
            class="p10"
          >
            <div class="partTitle">调整后{{changTu}}D效果图</div>
            <div class="h300 containBorder mt10"></div>
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
  import tableData from "../../common/data/tableData.json";
  import {
    echartsAxisConfig,
    echartsConfig,
    echartsMap,
    echartsWaterfall,
    echartsRevertBar,
    echartsPolar,
    echartsCalendar
  } from "../../common/js/echartsConfig";
  import { dealTime } from "../../common/js/dealTime.js";
  import { dealArr } from "../../common/js/dealArr.js";
  import { storageProject } from "../../common/js/session.js";
  import selectData from "../../common/data/selectData.json";
  import allProvince from "../../common/data/allCityData.json";

  export default {
    data: () => {
      return {
        allowClear: false,
        params: {},
        changTu: 2,
        tabHead: tableData.comHead.slice(0, 6),
        ruleForm: {
          date: "2018-06-28",
          city: "全省",
          scene_type: "全部",
          scene_name: "全部",
          GRIDID: "",
          wo_id: ""
        },
        allSelect: { city: [] },
        tabBody: tableData.body,
        tabHead: tableData.comHead
      };
    },
    computed: {
      opposite() {
        return this.changTu === 2 ? 3 : 2;
      }
    },
    methods: {
      // 点击查询
      clickBtn() {
        console.log(this.ruleForm);
      },
      // 切换2D或3D效果图显示
      clickChangeTu() {
        this.changTu = this.changTu === 2 ? 3 : 2;
      },
      // 改变场景类型：实现场景名称联动
      selectScence() {
        const curScence = this.ruleForm.scene_type;
        console.log(curScence);
        if ("全部" === curScence) {
          this.allSelect.scene_name = dealArr.createDown(
            selectData["scene_name"]["all"]
          );
        } else {
          this.allSelect.scene_name = dealArr.createDown(
            selectData["scene_name"][curScence]
          );
        }
      },
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
      // 初始化参数
      init() {
        // 获取当前时间
        this.ruleForm.date = dealTime.localTime();
        // 生成省市选择下拉框
        this.allSelect.city = dealArr.createDown(allProvince["湖南"]);
        // 场景类型
        this.allSelect.scene_type = dealArr.createDown(selectData["scene_type"]);
        // 场景名称
        this.allSelect.scene_name = dealArr.createDown(
          selectData["scene_name"]["all"]
        );
        // 栅格类型
        this.allSelect.problem_type = dealArr.createDown(
          selectData["problem_type"]
        );
        // 栅格类型
        this.allSelect.status = dealArr.createDown(selectData["status"]);
      }
    },
    created() {
      //   初始化页面
      this.init();
    },
    mounted() {
      //   this.submitForm("customRuleForm");
    },
    beforeUpdate() {}
  };
</script>
<style scoped>
  .changTu {
    text-align: center;
    margin-top: 20px;
  }
</style>