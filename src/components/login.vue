<template>
    <div class=" loginPage ">
        <!-- <div class=" upLog  bg"></div> -->
        <div class="verifyLogin">
            <v-form class="loginForm" :model="ruleForm" :rules="customRules" ref="customRuleForm">
                <v-form-item prop="user" class="userForm">
                    <v-input style="width:220px;" class="loginBorder" v-model="ruleForm.user" placeholder="请输入账户名">
                    </v-input>
                </v-form-item>
                <br>
                <v-form-item prop="passWord" class="passwordForm">
                    <v-input style="width:220px;" class="loginBorder" v-model="ruleForm.passWord" placeholder="请输入密码">
                    </v-input>
                </v-form-item>
                <br>
                <v-form-item>
                    <v-button class="loginBtn loginBorder" @click="loginBtn">登录</v-button>
                    <p v-if="errorLogin" class="errorLogin">请输入正确的用户名或密码</p>
                </v-form-item>
            </v-form>
        </div>
        <!-- <div class="downLog"></div> -->
    </div>
</template>


<script>
    import axios from "axios";
    import { shejiyuanHttp } from "../common/js/es6";
    import { httpUrl } from "../common/js/setting";
    import { commonMethod } from "../common/js/common";
    import { echartsConfig, echartsAxisConfig } from "../common/js/echartsConfig";

    export default {
      data: () => {
        return {
          errorLogin: false,
          ruleForm: {
            user: "",
            passWord: ""
          },
          customRules: {
            user: [
              {
                message: "规则名称不能为空"
              },
              {
                validator: (rule, value, callback) => {
                  const reg = /[\u4e00-\u9fa5]/;
                  setTimeout(() => {
                    if (!value) {
                      callback(new Error("规则名称不能为空"));
                    } else {
                      // else if (value && !reg.test(value)) {
                      //   callback(new Error("请输入中文"));
                      callback();
                    }
                  }, 500);
                }
              }
            ],
            passWord: [
              {
                message: "规则名称不能为空"
              },
              {
                validator: (rule, value, callback) => {
                  const reg = /[\u4e00-\u9fa5]/;
                  setTimeout(() => {
                    if (!value) {
                      callback(new Error("规则名称不能为空"));
                    } else {
                      // else if (value && !reg.test(value)) {
                      //   callback(new Error("请输入中文"));
                      // }
                      callback();
                    }
                  }, 500);
                }
              }
            ]
          }
        };
      },
      methods: {
        // 鼠标键入，判断是否按enter键
        isLogin(e) {
          const _this = this;
          document.onkeyup = function(e) {
            //按键信息对象以函数参数的形式传递进来了，就是那个e
            var code = e.charCode || e.keyCode; //取出按键信息中的按键代码(大部分浏览器通过keyCode属性获取按键代码，但少部分浏览器使用的却是charCode)
            if (code == 13) {
              //登陆验证
              _this.loginBtn();
            }
          };
        },
        loginBtn() {
          const _this = this;
          this.$refs["customRuleForm"].validate(valid => {
            if (valid) {
              //   this.$router.push({ path: "/workOverview/areaStatistics" });
              if (
                "admin" === this.ruleForm.user &&
                "admin888" === this.ruleForm.passWord
              ) {
                this.errorLogin = false;
                _this.$router.push("/LTEItem/homePage");
              } else {
                this.errorLogin = true;
              }
            } else {
              return false;
            }
          });
        }
      },
      created() {},
      mounted() {
        // 点击enter，登陆
        this.isLogin();
      },
      activated() {
        this.ruleForm.user = "";
        this.ruleForm.passWord = "";
      }
    };
</script>
<style scoped>
    .loginPage {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
      background-color: #fafafa;
      /* background: url("../static/images/login/login.png") no-repeat 0 0; */
      /* background-size: 100% 100%; */
    }
    .upLog {
      width: 1000px;
      height: 80px;
      margin: 50px auto;
      margin-bottom: 0;
      background: url("../static/images/login/single.png") no-repeat 0 0;
      background-size: 100% 100%;
    }
    .verifyLogin {
      width: 400px;
      margin: 140px auto;
      border: 1px solid #bbb9b9;
      padding-bottom: 35px;
    }
    .downLog {
      position: absolute;
      width: 300px;
      bottom: 40px;
      height: 60px;
      left: 50%;
      margin-left: -150px;
      background: url("../static/images/login/move.png") no-repeat 0 0;
      background-size: 100% 100%;
    }
    .loginForm {
      text-align: center;
    }
    .userForm {
      margin-top: 50px;
    }
    .passwordForm {
      margin-top: 30px;
    }
    .loginBtn {
      width: 220px;
      margin-top: 50px;
    }
    .loginBtn:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .loginBorder {
      border: 1px solid #bbb9b9 !important;
      background-color: transparent;
      color: #bbb9b9;
    }

    .ant-form-inline .ant-form-item {
      margin-right: 0 !important;
    }
    .has-error .ant-form-explain,
    .has-error .ant-form-split {
      color: #000 !important;
    }
    .errorLogin {
      color: red;
    }
</style>