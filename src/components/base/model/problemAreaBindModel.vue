<template>

	<div class="hello ">
		<div class="hello ">
			<v-modal title="编辑工单绑定列表" :visible="isVisible" @ok="handleOk" @cancel="handleCancel">
				<v-form :rules="customRules" ref="customRuleForm" :model="ruleForm">
					<div>
						<v-form-item label="工单规则" prop="issue_name" has-feedback>
							<v-input placeholder="类型选择" class="inputWidthMax" :allowClear=false v-model='ruleForm.issue_name'></v-input>
						</v-form-item>
					</div>
					<div class="mt15">
						<v-form-item label="工单状态">
							<v-radio-group v-model="ruleForm.bind_type" :data="[{value: '停用', text: '停用',},{value: '应用', text: '应用'},{value: '实验', text: '实验'}]"></v-radio-group>
						</v-form-item>
					</div>
				</v-form>
			</v-modal>
		</div>
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
	  props: ["isVisible", "tabCompileBind", "isReload", "upDateForm"],
	  data: () => {
	    return {
	      customRules: {
	        issue_name: [
	          {
	            required: true,
	            message: "工单规则名称不能为空"
	          },
	          {
	            validator: (rule, value, callback) => {
	              setTimeout(() => {
	                if (!value) {
	                  callback(new Error("工单规则名称不能为空"));
	                } else {
	                  callback();
	                }
	              }, 500);
	            }
	          }
	        ]
	      },
	      ruleForm: {
	        issue_name: "",
	        bind_type: "",
	        id: ""
	      }
	    };
	  },
	  methods: {
	    problemAreaWorkSearchCompile() {
	      console.log(this.ruleForm);

	      httpUrl.url
	        .problemAreaWorkSearchCompile({
	          param: this.ruleForm
	        })
	        .then(success => {
	          console.log(success.data);
	        });
	    },
	    submitForm(formName) {
	      const _this = this;
	      this.$refs[formName].validate(valid => {
	        if (valid) {
	          _this.$emit("closeModal", !_this.isVisible);

	          _this.problemAreaWorkSearchCompile();

	          _this.$emit("isReloadTab", !this.isReload);

	          /* 对话框将在两秒后关闭 */
	          setTimeout(() => {
	            // 新增或编辑时，更新table
	          }, 500);
	        } else {
	          return false;
	        }
	      });
	    },
	    handleOk() {
	      // 提交
	      this.submitForm("customRuleForm");
	    },
	    handleCancel() {
	      this.$emit("closeModal", !this.isVisible);
	    }
	  },
	  watch: {
	    upDateForm(item) {
	      console.log(this.tabCompileBind);

	      this.ruleForm.id = this.tabCompileBind.id;

	      this.ruleForm.issue_name = this.tabCompileBind.issue_name;

	      this.ruleForm.bind_type =
	        this.tabCompileBind.bind_type === "新增"
	          ? "应用"
	          : this.tabCompileBind.bind_type;
	    }
	  },
	  created() {},
	  beforeUpdate() {}
	};
</script>
<style scoped>
</style>