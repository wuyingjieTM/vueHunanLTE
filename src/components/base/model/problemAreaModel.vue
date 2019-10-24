<template>
  <div>
    <v-modal
      style="width:600px"
      :title=title
      :visible="asyncModalVisible"
      ok-text="提交"
      @ok="handleAsyncOk"
      @cancel="handleAsyncCancel"
      :confirm-loading="asyncConfirmLoading"
    >
      <v-form
        :rules="customRules"
        ref="customRuleForm"
        :model="ruleForm"
      >
        <div>
          <v-form-item label="类型">
            <v-select
              placeholder="类型选择"
              :disabled='isDisabled'
              @change="changeType"
              style="width: 120px;"
              :allowClear=false
              :data="type"
              v-model='ruleForm.type'
            ></v-select>
          </v-form-item>
        </div>

        <div class="mt10">
          <v-form-item
            label="工单规则"
            prop="name"
            has-feedback
          >
            <v-input
              placeholder="请输入则工单规则"
              style="width: 160px;"
              v-model='ruleForm.name'
            ></v-input>
          </v-form-item>
        </div>

        <div class="mt10">
          <v-form-item
            label="统计天数"
            prop="days"
            has-feedback
          >
            <v-input
              class="dealRow"
              placeholder="请输入1-8的数字"
              type="number"
              style="width: 120px;"
              :min="1"
              :max="8"
              v-model='ruleForm.days'
            ></v-input>
          </v-form-item>
          <v-form-item
            v-if="isTimeShow"
            prop="starttime"
            label="起始时间"
            has-feedback
          >
            <v-input
              class="dealRow"
              type="number"
              style="width: 120px;"
              v-model='ruleForm.starttime'
            ></v-input>
          </v-form-item>
          <v-form-item
            v-if="isTimeShow"
            prop="endtime"
            label="结束时间"
            has-feedback
          >
            <v-input
              class="dealRow"
              type="number"
              style="width: 120px;"
              v-model='ruleForm.endtime'
            ></v-input>
          </v-form-item>
        </div>
        <div class="mt10">
          <v-form-item label="统计类型">
            <v-input
              disabled
              style="width: 160px;"
              v-model='ruleForm.counttype'
            ></v-input>
          </v-form-item>
          <v-form-item
            v-if="isTimeLong"
            prop="duration"
            label="时长"
            has-feedback
          >
            <v-input
              placeholder="请输入时长"
              class="dealRow"
              type="number"
              style="width: 130px;"
              v-model='ruleForm.duration'
            ></v-input>
          </v-form-item>
          <v-form-item
            v-if="isTimeDay"
            prop="happendays"
            label="发生天数"
            has-feedback
          >
            <v-input
              placeholder="请输入发生天数"
              class="dealRow"
              type="number"
              style="width: 130px;"
              v-model='ruleForm.happendays'
            ></v-input>
          </v-form-item>
          <v-form-item
            v-if="isTimeNumber"
            prop="happentimes"
            label="发生次数"
            has-feedback
          >
            <v-input
              placeholder="请输入发生次数"
              class="dealRow"
              type="number"
              style="width: 130px;"
              v-model='ruleForm.happentimes'
            ></v-input>
          </v-form-item>
        </div>
      </v-form>

    </v-modal>
  </div>
</template>

<script>
  import axios from "axios";
  import { shejiyuanHttp } from "../../../common/js/es6";
  import { httpUrl } from "../../../common/js/setting";
  import { commonMethod } from "../../../common/js/common";
  import {
    echartsConfig,
    echartsAxisConfig
  } from "../../../common/js/echartsConfig";

  export default {
    props: [
      "icClose",
      "allSelect",
      "title",
      "tabCompileContain",
      "upDateForm",
      "isReload"
    ],
    data: () => {
      return {
        isDisabled: true,
        isTimeShow: false,
        isTimeLong: true,
        isTimeDay: false,
        isTimeNumber: true,
        compareMax: 0,
        compareMin: 0,
        durationMax: 24,
        happentimesMax: 24,
        isSpecial: false, //判断是否为专项工单
        asyncModalVisible: false,
        asyncConfirmLoading: false,
        number: 0,
        ruleForm: {
          type: "持续类",
          counttype: "持续",
          name: "",
          days: "1",
          starttime: "0",
          endtime: "0",
          duration: 1,
          happentimes: 1,
          happendays: 1,
          work_id: ""
        },
        group: {
          relation: "AND",
          logic: ">",
          getRule: "",
          val: 0
        },
        customRules: {
          happentimes: [],
          happendays: [],
          duration: [],
          endtime: [],
          starttime: [],
          days: [],
          name: [
            {
              required: true,
              message: "工单规则名称不能为空"
            },
            {
              validator: (rule, value, callback) => {
                const reg = /[\u4e00-\u9fa5]/;
                setTimeout(() => {
                  if (!value) {
                    callback(new Error("工单规则名称不能为空"));
                  } else if (value && !reg.test(value)) {
                    callback(new Error("请输入中文"));
                  } else {
                    callback();
                  }
                }, 500);
              }
            }
          ]
        },
        getRule: [],
        type: [
          {
            label: "持续类",
            value: "持续类",
            default: "scopedSlot"
          },
          {
            label: "累计类",
            value: "累计类"
          },
          {
            label: "间歇类",
            value: "间歇类"
          },
          {
            label: "累计类天级",
            value: "累计类天级"
          },
          {
            label: "持续类天级",
            value: "持续类天级"
          }
        ],
        relation: [
          {
            label: "AND",
            value: "AND"
          },
          {
            label: "OR",
            value: "OR"
          },
          {
            label: "NOT",
            value: "NOT"
          }
        ],
        logic: [
          {
            label: ">",
            value: ">"
          },
          {
            label: "<",
            value: "<"
          },
          {
            label: "=",
            value: "="
          },
          {
            label: "!",
            value: "!"
          }
        ],
        allProvince: [
          {
            label: "全省",
            value: "全省"
          }
        ]
      };
    },
    methods: {
      //   创建新规则
      problemAreaWorkCreate(params) {
        httpUrl.url
          .problemAreaWorkCreate({
            param: params
          })
          .then(success => {
            console.log(success.data);
          });
      },
      //   编辑新规则
      problemAreaWorkUpdate(params) {
        httpUrl.url
          .problemAreaWorkUpdate({
            param: params
          })
          .then(success => {
            console.log(success.data);
          });
      },
      formVerify() {
        const verifyArr = [
          "happentimes",
          "happendays",
          "duration",
          "endtime",
          "starttime",
          "days"
        ];
        for (let item of verifyArr) {
          this.customRules[item] = [
            {
              required: true,
              message: "输入内容不能为空"
            },
            {
              validator: (rule, value, callback) => {
                setTimeout(() => {
                  if (!value && value !== "0") {
                    callback(new Error("输入内容不能为空"));
                  } else {
                    callback();
                  }
                }, 500);
              }
            }
          ];
        }
      },
      postParams(params) {
        if (params.type === "持续类") {
          params.endtime = "";
          params.starttime = "";
          params.happendays = "";
          return params;
        } else if (params.type === "累计类") {
          params.happentimes = "";
          params.happendays = "";
          return params;
        } else if (params.type === "间歇类") {
          params.duration = "";
          return params;
        } else if (params.type === "持续类天级") {
          params.endtime = "";
          params.starttime = "";
          params.duration = "";
          params.happentimes = "";
          return params;
        } else if (params.type === "累计类天级") {
          params.endtime = "";
          params.starttime = "";
          params.duration = "";
          params.happentimes = "";
          return params;
        }
      },
      //   改变选择类型，重置一些参数
      changeInitialize(time, long, day, number) {
        this.isTimeShow = time;
        this.isTimeLong = long;
        this.isTimeDay = day;
        this.isTimeNumber = number;
      },
      //   改变选择类型
      changeType(item) {
        if (item) {
          //   改变统计类型
          this.ruleForm.counttype = item.replace("类", "");
          const _this = this;
          // 根据类型，显示具体的值
          switch (item) {
            case "持续类":
              _this.changeInitialize(false, true, false, true);
              break;
            case "累计类":
              _this.changeInitialize(true, true, false, false);
              break;
            case "间歇类":
              _this.changeInitialize(true, false, true, true);
              break;
            case "持续类天级":
              _this.changeInitialize(false, false, true, false);
              break;
            case "累计类天级":
              _this.changeInitialize(false, false, true, false);
              break;
            default:
          }
        }
      },
      //   选择起始时间
      starTime(item) {},
      clearAll() {
        this.ruleForm.info = "";
        this.number = 0;
        //   清空规则
      },
      //表单提交
      submitForm(formName) {
        const _this = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            /* 对话框将在两秒后关闭 */
            _this.asyncConfirmLoading = true;
            setTimeout(() => {
              _this.asyncConfirmLoading = false;
              _this.asyncModalVisible = false;
              _this.$emit("changeClosed", false);
              const postParams = _this.postParams(_this.ruleForm);
              if (_this.title === "添加规则") {
                _this.problemAreaWorkCreate(postParams);
              } else {
                console.log("提价", postParams);
                _this.problemAreaWorkUpdate(postParams);
              }
              // 新增或编辑时，更新table
              _this.$emit("isReloadTab", !this.isReload);
            }, 500);
          } else {
            return false;
          }
        });
      },
      //表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showAsyncModal() {
        this.asyncModalVisible = true;
      },
      handleAsyncOk() {
        this.submitForm("customRuleForm");
      },
      //取消提交，重置form
      handleAsyncCancel() {
        // 重置form
        this.asyncModalVisible = false;
        this.$emit("changeClosed", false);
      },
      // 将table表格内容，填入form表单中
      isInclude(type, target, initialize) {
        if (initialize) {
          // 编辑
          if (this.tabCompileContain[type]) {
            this.ruleForm[target] = this.tabCompileContain[type];
          }
        } else {
          // 新增规则
          if ("count_type" === type) {
            this.ruleForm[target] = "持类";
            console.log("持类");
          } else if ("work_type" === type) {
            this.ruleForm[target] = "持续类";
            console.log("持续类");
          } else {
            this.ruleForm[target] = "";
          }
        }
      },
      compileModel(initialize) {
        this.isDisabled = initialize;
        this.isInclude("work_type", "type", initialize);
        this.isInclude("count_type", "counttype", initialize);
        this.isInclude("work_name", "name", initialize);
        this.isInclude("day_count", "days", initialize);
        this.isInclude("start_time", "starttime", initialize);
        this.isInclude("end_time", "endtime", initialize);
        this.isInclude("duration_time", "duration", initialize);
        this.isInclude("happen_count", "happentimes", initialize);
        this.isInclude("day_time", "happendays", initialize);
        this.isInclude("work_id", "work_id", initialize);
      }
    },
    watch: {
      ruleForm: {
        handler(newValue, oldValue) {},
        deep: true
      },
      icClose(item) {
        if (item) {
          this.asyncModalVisible = item;
        }
      },
      upDateForm(item) {
        //添加规则还是编辑规则
        if ("添加规则" === this.title) {
          this.compileModel(false);
        } else {
          this.compileModel(true);
        }
      }
    },
    created() {
      this.formVerify();
    },
    mounted() {}
  };
</script>
<style scoped>
  .clearAll {
    margin-top: -28px;
  }
</style>