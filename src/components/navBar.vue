<template>
    <div class="sideBar">
        <v-menu mode="horizontal" :data="inlineMenuData" @item-click="itemclick">
            <template slot-scope="{data}">
                <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
                <router-link :to="data.href" style="display:inline">{{ data.name }}</router-link>
            </template>
        </v-menu>
    </div>
</template>

<script>
    export default {
      data: () => ({
        inlineMenuData: [
          {
            name: "LTE覆盖问题精细化分析",
            // icon: "ie",
            children: [
              {
                name: "分场景网络覆盖情况展示",
                href: "/LTE/lteScence"
              },
              {
                name: "覆盖问题点列表",
                href: "/LTE/lteCoverList"
                // disabled: true,
              },
              {
                name: "MR与仿真数据综合呈现",
                href: "/LTE/lteMr"
                // disabled: true,
              },
              {
                name: "覆盖问题精细化分析",
                href: "/LTE/lteCoverAnalyze"
                // disabled: true,
              },
              {
                name: "竞对问题列表",
                href: "/LTE/lteUnexpecteList"
                // disabled: true,
              },
              {
                name: "竞对问题精细化分析",
                href: "/LTE/lteUnexpecteAnaluze"
                // disabled: true,
              }
            ]
          },
          {
            name: "重要场景",
            // icon: "apple",
            children: [
              {
                name: "分场景覆盖问题列表",
                href: "/scence/scenceCover"
              },
              {
                name: "重要场景精细化分析",
                href: "/scence/scenceAnalyze"
              },
              {
                name: "重要节日指标对比",
                href: "/scence/scenceCompare"
              }
            ]
          },
          {
            name: "投诉问题精细化分析",
            // icon: "ie",
            children: [
              {
                name: "投诉精细化分析",
                // disabled: true,
                href: "/complaint/complaintAnalyze"
              },
              {
                name: "用户轨迹GIS分析",
                // disabled: true,
                href: "/complaint/complaintUser"
              },
              {
                name: "精细化分析工单管理",
                // disabled: true,
                href: "/complaint/complaintManage"
              }
            ]
          }
        ]
      }),
      methods: {
        itemclick(item) {
          //   item[0].selected = true;
          //   this.$emit("select", item[0].name);
        }
      },
      beforeUpdate(item) {
        this.$emit("themeSelect", this.$route.path.includes("index"));
      }
    };
</script>

<style scoped>
    h1,
    h2 {
      font-weight: normal;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
    }
    a {
      color: #42b983;
    }
    .slider {
      margin: auto;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .ant-menu-horizontal > .ant-menu-item > a,
    .ant-menu-horizontal > .ant-menu-submenu > a {
      background-color: transparent;
      /* color:#fff; */
    }

    li.ant-menu-item-selected a {
      color: #108ee9 !important;
    }
</style>

