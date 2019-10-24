<template>
    <div class="hello ">
        <div class="h300 boxShadow">
            <div class="curBarTitle">
                <span>{{chartBar.title}}</span>
                <span class="floatR mr20">{{chartBar.type}}</span>
            </div>
            <div class="curBarEchart" :ref="target">
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import { shejiyuanHttp } from "../../common/js/es6";
    import { httpUrl } from "../../common/js/setting";
    import { commonMethod } from "../../common/js/common";
    import {
      echartsConfig,
      echartsAxisConfig
    } from "../../common/js/echartsConfig";
    export default {
      props: ["chartBar", "target"],
      data: () => {
        return {};
      },
      methods: {
        createBar() {
          const arrNum = this.chartBar.items;
          const leng = this.chartBar.x.length;
          const yData = [];
          let percentage = 100;

          for (let item of arrNum) {
            const obj = {
              name: item,
              type: "bar",
              stack: "curBar",
              barMaxWidth: "36px",
              data: []
            };
            for (let curItem of this.chartBar.y) {
              let isHave = true;
              if (curItem[0]) {
                for (let indexItem of curItem) {
                  if (indexItem[item]) {
                    obj.data.push(indexItem[item]);
                    isHave = true;
                  }
                }
                if (!isHave) {
                  obj.data.push(0);
                }
              } else {
                obj.data.push(0);
                continue;
              }
            }
            yData.push(obj);
          }

          console.log(this.chartBar);

          echartsAxisConfig({
            target: this.$refs[this.target],
            xData: this.chartBar.x,
            barNumber: 6,
            xTextBottomDistance: 12,
            formatter: function(item) {
              return item.seriesName + " : " + (item.value * 100).toFixed(2) + " %";
            },
            // yTitla1: "率（%）",
            xAxisIndex: 0,
            yAxisIndex: 0,
            lineColor: "#afaf9c57",
            isDataZoomD: true,
            yData: yData
          });
        }
      },
      created() {},
      updated() {
        this.createBar();
      },
      mounted() {
        this.createBar();
      },
      beforeUpdate() {}
    };
</script>
<style scoped>
    .curBarTitle {
      height: 38px;
      line-height: 38px;
      background-color: #194858;
      padding-left: 15px;
      font-size: 12px;
      color: #fff;
    }
    .curBarEchart {
      height: 260px;
    }
    .timeProvince .ant-more-panel,
    .timeProvince .ant-more-panel:hover {
      border: none !important;
    }
    .timeProvince .ant-input,
    .timeProvince .ant-btn,
    .timeProvince .ant-more-panel,
    .timeProvince .ant-more-panel-btn,
    .timeProvince .ant-select-selection {
      box-shadow: none !important;
    }
</style>