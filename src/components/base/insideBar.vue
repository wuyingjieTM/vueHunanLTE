<template>
    <div class="hello selectTabBar">
        <v-menu mode="horizontal" :data="insideBar" @item-click="itemclick">
            <template slot-scope="{data}">
                <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
                <router-link :to='{path:data.href.path}' style="display:inline">{{ data.name }}</router-link>
            </template>
        </v-menu>
    </div>
</template>

<script>
    import axios from "axios";
    import { http } from "../../common/js/es6";
    import { httpUrl } from "../../common/js/setting";
    import { commonMethod } from "../../common/js/common";
    import {
      echartsConfig,
      echartsAxisConfig
    } from "../../common/js/echartsConfig";

    export default {
      props: ["insideBar"],
      data: () => {
        return {
          defaultSelectTab: ""
        };
      },
      methods: {
        tabClick(item) {
          this.$router.push(item);
        },
        itemclick() {}
      },
      created() {
        console.log(this.insideBar[0]);

        this.defaultSelectTab = this.insideBar[0].tabUrl;
      },
      beforeUpdate() {}
    };
</script>
<style scoped>
    .insideBar .ant-tabs-nav .ant-tabs-tab {
      height: 60px;
      line-height: 60px !important;
    }
</style>