<template>
	<div class="hello">
		<div ref="textEcharts" class="echarts"></div>
		<div ref="textEchart1" class="echarts"></div>
		<div ref="textEchart2" class="echarts"></div>
	</div>
</template>

<script>
	// 引入公共的方法
	import {
	  echartsAxisConfig,
	  echartsConfig
	} from "../../../common/js/echartsConfig";

	export default {
	  methods: {
	    loadEchart: function() {
	      echartsAxisConfig({
	        target: this.$refs.textEcharts,
	        aroundPad: ["10%", "10%", "10%", "10%"],
	        xData: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
	        lengData: [
	          "右边0",
	          "右边1",
	          "右边2",
	          "右边3",
	          "右边4",
	          "右边5",
	          "右边6",
	          "右边7",
	          "右边8",
	          "右边9"
	        ],
	        textTitla: "",
	        yData: [
	          {
	            type: "bar",
	            name: "右边0",
	            data: [5, 20, 36, 10, 10, 20],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边1",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边2",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边3",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边4",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边5",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边6",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边7",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边8",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          },
	          {
	            type: "bar",
	            name: "右边9",
	            data: [23, 72, 2, 34, 93, 44],
	            stack: "same"
	          }
	        ],
	        xTitla: "x轴",
	        yTitla1: "y轴"
	      });
	      echartsAxisConfig({
	        type: "line",
	        target: this.$refs.textEchart1,
	        aroundPad: ["10%", "10%", "10%", "10%"],
	        xData: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
	        lengData: ["销量"],
	        textTitla: "barEcharts",
	        yTitla1: "左边Y轴",
	        yTitla2: "右边Y轴轴",
	        xTitla: "x轴",
	        isYAxis: true,
	        yData: [
	          {
	            type: "line",
	            data: [5, 20, 36, 10, 10, 20]
	          },
	          {
	            type: "bar",
	            data: [5, 20, 36, 10, 10, 20],
	            yAxisIndex: 1
	          }
	        ]
	      });

	      //   饼状图
	      echartsConfig({
			target: this.$refs.textEchart2,
			lengLeft:'0',
			radus:['50%','70%'],
			center:['50%','50%'],
			labelColor:"#333",
			lengData:["直接访问","邮件营销","联盟广告","视频广告","搜索引擎",
			"搜索引擎1","搜索引擎2","搜索引擎3","搜索引擎4","搜索引擎5"
			,"搜索引擎6","搜索引擎7","搜索引擎8","搜索引擎9"],
	        data: [
	          { value: 335, name: "直接访问" },
	          { value: 310, name: "邮件营销" },
	          { value: 234, name: "联盟广告" },
	          { value: 135, name: "视频广告" },
	          { value: 1548, name: "搜索引擎" },
	          { value: 1548, name: "搜索引擎1" },
	          { value: 1548, name: "搜索引擎2" },
	          { value: 1548, name: "搜索引擎3" },
	          { value: 1548, name: "搜索引擎4" },
	          { value: 1548, name: "搜索引擎5" },
	          { value: 1548, name: "搜索引擎6" },
	          { value: 1548, name: "搜索引擎7" },
	          { value: 1548, name: "搜索引擎8" },
	          { value: 1548, name: "搜索引擎9" },
	        ]
	      });
	    }
	  },
	  mounted: function() {
	    this.loadEchart();
	  }
	};
</script>

<style scoped>
	.echarts {
	  width: 800px;
	  height: 500px;
	  margin: 50px auto;
	}
	.commodity-tab {
	  border: 1px solid #666;
	}
	.demo-carousel {
	  padding: 20px;
	}
</style>
