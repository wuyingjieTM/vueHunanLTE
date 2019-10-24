<template>

	<div class="hello ">
		<v-modal title="第一个 Modal" :visible="isVisible" @ok="handleOk" @cancel="handleCancel">
			<p>对话框的内容</p>
			<p>对话框的内容</p>
			<p>对话框的内容</p>
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
	  props: ["isVisible"],
	  data: () => {
	    return {};
	  },
	  methods: {
	    handleOk() {
	      this.$emit("closeModal", !this.isVisible);
	    },
	    handleCancel() {
	      this.$emit("closeModal", !this.isVisible);
	    }
	  },
	  created() {},
	  beforeUpdate() {}
	};
</script>
<style scoped>

</style>