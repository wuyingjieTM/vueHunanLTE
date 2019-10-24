<template>
  <!-- <div-- id="app" :class="{ workTheme: changeTheme }"> -->
  <div
    id="app"
    v-bind:class="{ themeBg: true }"
  >
    <header class="login">
      <span class="loginText">
        湖南移动集中网优平台<br />&nbsp;&nbsp;&nbsp;&nbsp;覆盖智能分析模块
      </span>
      <!-- 导航栏 -->
      <div class="appLog">
        <ul>
          <template v-for="item in navBarData">
            <li
              @click="changeNavbar(item)"
              :class="{addColor:(item === listenNarbar )}"
            >
              {{item}}
            </li>
          </template>
        </ul>
      </div>

      <!-- 推出按钮 >
      <div
        class="dropOut"
        @click="showConfirm"
      >
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use xlink:href="#icon-tuichu"></use>
        </svg>
      </div-->
    </header>

    <!-- 老版本：导航栏 -->
    <!-- <div class="sideBarTop">
            <nav-bar @themeSelect="themeSelect"></nav-bar>
        </div> -->

    <!-- 背景图 -->
    <div class="appContainer">
      <keep-alive>
        <router-view class="Contain"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import { http } from "./common/js/es6";
  import { httpUrl } from "./common/js/setting";
  import { commonMethod } from "./common/js/common";
  import navBarData from "./common/data/navBar.js";
  import { storageProject } from "./common/js/session.js";
  import {
    echartsConfig,
    echartsAxisConfig,
    echartsMap
  } from "./common/js/echartsConfig";
  export default {
    data() {
      return {
        navBarData: [],
        themeBg: true,
        selectTab: this.$store.getters.getNavBar,
        menuData1: [
          {
            name: "nav 1"
          },
          {
            name: "nav 2",
            selected: true
          },
          {
            name: "nav 3"
          }
        ]
      };
    },
    methods: {
      //   路由跳转

      routeTip(itme) {
        switch (itme) {
          case "首页":
            this.$router.push("/LTEItem/homePage");
            break;
          case "问题点管理":
            this.$router.push("/LTEItem/issueManage");
            break;
          case "栅格问题":
            this.$router.push("/LTEItem/gridIssue");
            break;
          case "场景问题":
            this.$router.push("/LTEItem/scenceIssue");
            break;
          case "竞对问题":
            this.$router.push("/LTEItem/raceToIssue");
            break;
          case "投诉问题":
            this.$router.push("/LTEItem/complaintIssue");
            break;
          case "节假日对比":
            this.$router.push("/LTEItem/holidayContrast");
            break;
          case "仿真对比管理":
            this.$router.push("/LTEItem/simulationManage");
            break;
          case "MR与仿真数据":
            this.$router.push("/LTEItem/MRData");
            break;
          default:
            this.$router.push("/LTEItem/homePage");
            break;
        }
      },
      //   点击bar改变值
      changeNavbar(item) {
        storageProject.setStorage("narBar", item);
        this.$store.commit("upDataNavBar", item);
        this.routeTip(item);
      },
      themeSelect(item) {
        this.themeBg = item;
      },
      // 点击退出按钮
      showConfirm() {
        const _this = this;
        this.$modal.confirm({
          title: "您是否确退出",
          content: "",
          onOk: function() {
            _this.$router.push("/LTEItem/login");
          },
          onCancel: function() {}
        });
      },
      itemclick() {}
    },
    //watch和computed各自处理的数据关系场景不同
    // 1.watch擅长处理的场景：一个数据影响多个数据
    // 2.computed擅长处理的场景：一个数据受多个数据影响
    // watch擅长处理的场景：一个数据影响多个数据
    //   计算属性--由某个值的变化,引起computed下函数的调用
    computed: {
      listenNarbar() {
        return this.$store.getters.getNavBar;
      }
    },
    watch: {
      selectTab(curVal) {
        console.log("当前值为", curVal);
      }
    },
    created() {
      this.navBarData = navBarData.navBarData;
      const curNav = storageProject.getStorage("narBar");
      if (!curNav) {
        this.$router.push("/LTEItem/homePage");
        this.$store.commit("upDataNavBar", "首页");
      } else {
        this.$store.commit("upDataNavBar", curNav);
      }
    }
  };
</script>   

<style lang='less'>
  @import "./common/css/common.css";
  @import "./common/less/common.less";
  @import "./common/less/table.less";
  @import "./common/less/model.less";
  @import "./common/less/fontStyle.less";
  @import "./common/less/mediaStyle.less";

  @import "./common/css/baseStyle.css";
  @import "./common/css/plug.css";
  @import "./common/css/workTheme.css";
  @import "./common/css/theme.css";

  .ant-modal {
    min-width: 400px !important;
  }
  .dropOut {
    position: fixed;
    top: 8px;
    right: 25px;
    z-index: 999;
    color: #7ff2e3;
    font-size: 32px;
  }
  .dropOut:hover {
    color: #afc8ef;
  }

  .sideBarTop {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    height: 46px;
    background-color: #fff;
    z-index: 99;
  }

  .ant-modal-mask,
  .ant-modal-wrap,
  .ant-modal {
    z-index: 999;
  }

  /* 字体图标 */
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .addColor {
    background-color: #1a41cd !important;
  }
</style>
