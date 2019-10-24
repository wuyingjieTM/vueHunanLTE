<template>
    <div class="hello mt10">

        <div class="detailPart">
            覆盖问题精细化分析-问题小区：长沙农大逸夫楼FHL-D390053867PT-131 时间：2018年6月1日
        </div>

        <!-- 切换标签 -->
        <div class="mt15">
            <v-button type="primary" html-type="button">生成精细化分析报告</v-button>
            <v-button type="primary" html-type="button">天馈老化分析</v-button>
            <v-button type="primary" html-type="button">天线方位角分析</v-button>
            <v-button type="primary" html-type="button">未占用最优小区分析</v-button>
            <v-button type="primary" html-type="button">未占用最优小区分析</v-button>
            <v-button type="primary" html-type="button">告警分析</v-button>
            <v-button type="primary" html-type="button">邻区漏配分析</v-button>
            <v-button type="primary" html-type="button">站间距过远分析</v-button>
            <v-button type="primary" html-type="button">建筑物阻挡分析</v-button>
        </div>

        <!-- 详细分析展示 -->
        <div>
            <div class="grid-demo mt15">
                <v-row>
                    <v-col span="12" class="p10">
                        <div class="partTitle">站间距过远分析</div>
                        <div class="h300 containBorder mt10" id="map"></div>
                    </v-col>
                    <v-col span="12" class="p10">
                        <div class="partTitle">详情文字分析</div>
                        <div class="h300 containBorder mt10" id="map1"></div>
                    </v-col>
                    <v-col span="12" class="p10">
                        <div class="partTitle">覆盖问题精细化分析报告</div>
                        <div class="h300 containBorder mt10"></div>
                    </v-col>
                    <v-col span="12" class="p10">
                        <div class="partTitle">详情图标分析</div>
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
    import { arcgis } from "../../common/js/arcgis/arcgis.js";
    import {
      echartsConfig,
      echartsAxisConfig,
      echartsMap
    } from "../../common/js/echartsConfig";

    export default {
      data: () => {
        return {};
      },
      methods: {
        addMap() {
          arcgis.initMap(new Lgis());
          arcgis.initMap1(new Lgis());
        }
      },
      created() {},
      mounted() {
        this.addMap();
      },
      beforeUpdate() {}
    };
</script>
<style scoped lang='less'>
    @import "../../common/less/common.less";

    span {
      color: #fff;
    }
</style>