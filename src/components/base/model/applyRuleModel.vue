<template>
	<div>
		<v-modal style="width:600px" :title="title" :visible="asyncModalVisible" ok-text="提交" @ok="handleAsyncOk" @cancel="handleAsyncCancel" :confirm-loading="asyncConfirmLoading">
			<v-form :model="ruleForm" :rules="customRules" ref="customRuleForm">
				<div v-if="isCreate">
					<v-form-item label="类型">
						<v-select placeholder="类型选择" style="width: 120px;" :allowClear=false :data="type" v-model='ruleForm.type'></v-select>
					</v-form-item>
					<!-- <v-form-item label="区域">
						<v-select placeholder="区域选择" style="width: 120px;" :allowClear=false :data="allSelect.province" v-model='ruleForm.province'></v-select>
					</v-form-item> -->
					<v-form-item label="设备">
						<v-select placeholder="设备选择" style="width: 120px;" :allowClear=false :data="allSelect.equipment" v-model='ruleForm.equipment'></v-select>
					</v-form-item>
				</div>

				<div class="mt10" v-if="isCreate">
					<v-form-item label="规则名称" has-feedback prop="name">
						<v-input placeholder="请输入则名称" style="width: 130px;" v-model='ruleForm.name'></v-input>
					</v-form-item>
					<v-form-item v-if="isSpecial" label="ECI名称" has-feedback prop="cell_name">
						<v-input placeholder="出入要绑定的ECI的名称" style="width: 130px;" v-model='ruleForm.cell_name' prop="isEmpty"></v-input>
					</v-form-item>
					<v-form-item v-if="isSpecial" label="输入ECI" has-feedback prop="eci">
						<v-input size="large" class="dealRow" type='number' style="width: 130px;" placeholder="出入要绑定的ECI" v-model='ruleForm.eci' prop="isEmpty"></v-input>
					</v-form-item>
				</div>


				<div class="mt10">
					<v-form-item label="状态" v-if="isCreate">
						<v-radio-group v-model="ruleForm.status" :data="[{value: '新增', text: '新增'}]"></v-radio-group>
					</v-form-item>
					<v-form-item label="粒度选择" v-if="isDayGrade">
						<v-radio-group v-model="ruleForm.time_type" :data="[{value: 0, text: '天级'},{disabled:false,value: 1, text: '小时级'}]"></v-radio-group>
					</v-form-item>
					<v-form-item label="粒度选择" v-if="!isDayGrade">
						<v-radio-group v-model="ruleForm.time_type" :data="[{value: 0, text: '天级'},{disabled:true,value: 1, text: '小时级'}]"></v-radio-group>
					</v-form-item>
				</div>
				<div class="mt10">
					<v-form-item label="指标">
						<v-select placeholder="设备选择" style="width: 150px;" :allowClear=false :data="getRule" v-model='group.getRule'></v-select>
					</v-form-item>
					<v-form-item label="逻辑运算">
						<v-select placeholder="设备选择" style="width: 50px;" :allowClear=false :data="logic" v-model='group.logic'></v-select>
					</v-form-item>
					<v-form-item label="门限">
						<v-input placeholder="请输入账规则名称" style="width: 80px;" :min="0" v-model='group.val' type='number'></v-input>
					</v-form-item>
					<v-form-item label="关系">
						<v-select placeholder="设备选择" style="width: 60px;" :allowClear=false :data="relation" v-model='group.relation'></v-select>
					</v-form-item>
					<v-button slot="control" html-type="button" @click="addAll">组合</v-button>
				</div>

				<div class="mt10">
					<v-form-item label="活动形式" prop="info">
						<v-input placeholder="添加组合的规则" prop="isEmpty" style="width: 590px;height: 80px" disabled v-model="ruleForm.info" type="textarea"></v-input>
					</v-form-item>
					<v-button slot="control" class="pull-right clearAll" html-type="button" @click="clearAll">清空</v-button>
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
  props: ["icClose", "allSelect", "title", "tabCompileContain", "upDateForm"],
  data: () => {
    return {
      isCreate: true,
      isDayGrade: true,
      isSpecial: false, //判断是否为专项工单
      asyncModalVisible: false,
      asyncConfirmLoading: false,
      number: 0,
      ruleDay: [],
      ruleHour: [],
      group: {
        relation: "AND",
        logic: ">",
        getRule: "",
        val: 0
      },
      getRule: [],
      customRules: {
        //  是否为空
        name: [
          {
            required: true,
            message: "规则名称不能为空"
          },
          {
            validator: (rule, value, callback) => {
              const reg = /[\u4e00-\u9fa5]/;
              setTimeout(() => {
                if (!value) {
                  callback(new Error("规则名称不能为空"));
                } else if (value && !reg.test(value)) {
                  callback(new Error("请输入中文"));
                } else {
                  callback();
                }
              }, 500);
            }
          }
        ],
        cell_name: [
          {
            required: true,
            message: "ECI名称不能为空"
          },
          {
            validator: (rule, value, callback) => {
              const reg = /[\u4e00-\u9fa5]/;
              setTimeout(() => {
                if (!value) {
                  callback(new Error("ECI名称不能为空"));
                } else if (value && !reg.test(value)) {
                  callback(new Error("请输入中文"));
                } else {
                  callback();
                }
              }, 500);
            }
          }
        ],
        info: [
          {
            required: true,
            message: "组合信息不能为空"
          },
          {
            validator: (rule, value, callback) => {
              const reg = /[\u4e00-\u9fa5]/;
              setTimeout(() => {
                if (!value) {
                  callback(new Error("ECI名称不能为空"));
                } else {
                  callback();
                }
              }, 500);
            }
          }
        ],
        eci: [
          {
            required: true,
            message: "请输入要绑定的ECI"
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^[0-9]*$/;
              setTimeout(() => {
                if (value === "") {
                  callback(new Error("请输入要绑定的ECI"));
                } else {
                  callback();
                }
              }, 500);
            }
          }
        ]
      },
      type: [
        {
          label: "大网规则",
          value: "大网规则"
        },
        {
          label: "场景规则",
          value: "场景规则"
        },
        {
          label: "专项规则",
          value: "专项规则"
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
      ],
      ruleForm: {
        equipment: "全部",
        type: "大网规则",
        status: "新增",
        info: "",
        name: "",
        cell_name: "",
        eci: "",
        time_type: 0,
        id: ""
      }
    };
  },
  methods: {
    clearAll() {
      this.ruleForm.info = "";
      this.number = 0;
      //   清空规则
    },
    //   组合规则
    addAll() {
      if (this.number === 0) {
        const strAll =
          this.group.getRule + " " + this.group.logic + this.group.val;
        this.ruleForm.info = this.ruleForm.info + strAll;
      } else if (this.number === 1) {
        const strAll =
          "　" +
          this.group.relation +
          " " +
          this.group.getRule +
          " " +
          this.group.logic +
          this.group.val;
        this.ruleForm.info = this.ruleForm.info + strAll;
      }
      this.number = this.number + 1;
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
            _this.$emit("changeClosed", false, true);
            if (_this.isCreate) {
              //表单提交：新增
              httpUrl.url
                .applyRuleCreate({
                  param: _this.ruleForm
                })
                .then(success => {
                  console.log(success.data);
                });
            } else {
              //表单提交：编辑
              httpUrl.url
                .applyRuleCompile({
                  param: _this.ruleForm
                })
                .then(success => {
                  console.log(success.data);
                });
            }
          }, 1000);
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
    getAllRule() {
      httpUrl.url.applyRulegetSelect({}).then(success => {
        const arrDay = [];
        const arrHour = [];
        for (let item of success.data.IssueRuleParams) {
          const obj = {
            label: item.parameterName,
            value: item.parameterName
          };
          if (item.time_type === 1) {
            arrDay.push(obj);
          } else {
            arrHour.push(obj);
          }
        }
        this.ruleDay = arrDay;
        this.ruleHour = arrHour;
        this.getRule = arrDay;
        this.group.getRule = arrDay[0].value;
      });
    },
    changeForm(type, target, isCreate) {
      // 重制form表单
      if (isCreate) {
        if ("equipment" === target) {
          this.ruleForm[target] = "全部";
        } else if ("type" === target) {
          this.ruleForm[target] = "大网规则";
        } else if ("status" === target) {
          this.ruleForm[target] = "新增";
        } else if ("time_type" === target) {
          this.ruleForm[target] = 0;
        } else {
          this.ruleForm[target] = "";
        }

        this.group.relation = "AND";
        this.group.logic = ">";
        this.group.getRule =
          (this.getRule && this.getRule[0] && this.getRule[0].value) || "";
        this.group.val = 0;
      } else {
        // 动态改变form表单内容
        if (this.tabCompileContain[type]) {
          this.ruleForm[target] = this.tabCompileContain[type];
        }
      }
    },
    changeFormType(isCreate) {
      this.isCreate = isCreate;
      this.changeForm("ruleType", "type", isCreate);
      this.changeForm("ruleEquipment", "equipment", isCreate);
      this.changeForm("ruleStatus", "status", isCreate);
      this.changeForm("ruleInfo", "info", isCreate);
      this.changeForm("ruleName", "name", isCreate);
      this.changeForm("cell_name", "cell_name", isCreate);
      this.changeForm("eci", "eci", isCreate);
      this.changeForm("time_type", "time_type", isCreate);
      this.changeForm("id", "id", isCreate);
    }
  },
  watch: {
    icClose(item) {
      if (item) {
        this.asyncModalVisible = item;
      }
    },
    upDateForm() {
      // 新增和编辑判断
      if ("新增规则" === this.title) {
        this.changeFormType(true);
      } else {
        this.changeFormType(false);
      }
    }
  },
  mounted() {},
  beforeUpdate() {
    //   规则类型切换
    if ("大网规则" === this.ruleForm.type) {
      this.isDayGrade = true;
      this.isSpecial = false;
    } else if ("专项规则" === this.ruleForm.type) {
      this.isSpecial = true;
      this.ruleForm.time_type = 0;
      this.isDayGrade = false;
    } else {
      this.ruleForm.time_type = 0;
      this.isSpecial = false;
      this.isDayGrade = false;
    }
    // 天级和小时级下拉框切换
    if (1 === this.ruleForm.time_type) {
      this.getRule = this.ruleHour;
      if (this.ruleHour[0]) {
        this.group.getRule = this.ruleHour[0].value;
      }
    } else {
      this.getRule = this.ruleDay;
      if (this.ruleDay[0]) {
        this.group.getRule = this.ruleDay[0].value;
      }
    }
  },
  created() {
    this.getAllRule();
  }
};
</script>
<style scoped>
.clearAll {
  margin-top: -28px;
}
</style>