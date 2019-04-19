<template>
  <div id="login">
    <img :src="backgroundPath" class="bgi" alt>
    <div class="loginConbox">
      <div class="loginBox">
        <div class="loginCon">
          <el-card shadow="always" class="login-module" v-if="smdl">
            <div class="formTitlt">
              <img class="logo" :src="companyLogo" alt srcset>
              <h1 class="school-name">{{companyName}}</h1>
            </div>
            <el-form :model="loginForm" status-icon class="demo-ruleForm" @validate="validate">
              <el-form-item verify phone prop="telNum">
                <el-input
                  type="text"
                  v-model="loginForm.telNum"
                  auto-complete="off"
                  placeholder="请输入手机号码"
                  maxlength="11"
                  prefix-icon="prefix-icon1 prefix-icon-mb"
                ></el-input>
              </el-form-item>
              <el-form-item prop="capCode" verify :length="5">
                <el-input
                  type="number"
                  maxlength="5"
                  v-model="loginForm.capCode"
                  placeholder="请输入验证码"
                  prefix-icon="prefix-icon1 prefix-icon-cd"
                ></el-input>
                <el-button
                  class="btn_sendMsg"
                  type="primary"
                  plain
                  v-if="!isSend"
                  @click="sendMsg"
                >{{btnMsg}}</el-button>
                <el-button class="btn_sendMsg" type="info" v-else disabled>{{countTime}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="subBtn"  :loading="loading" type="primary" @click="submitForm">登录</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import { setInterval, clearInterval } from "timers";
export default {
  data() {
    return {
      smdl: true,
      loginForm: {
        telNum: null,
        capCode: null
      },
      token: "",
      backgroundPath: "",
      companyLogo: "",
      companyName: "",
      btnMsg: "获取验证码",
      countTime: 120,
      url_school_id: null,
      isSend: false, //是否点击了发送按钮
      rules: {},
      rulesTel: false,
      loading:false
    };
  },
  methods: {
    submitForm() {
      //登陆
      let that = this;
      that.loading = true
      //密码登录
      if (this.$route.query.login_tp == 1) {
        that.loading = false
        parms = this.$route.query;
      } else {
        
        if (that.loginForm.telNum === null || that.loginForm.capCode === null) {
          that.loading = false
          this.$message.error("请输入手机号或验证码");
          return;
        }
        //手机号登录
        var parms = {
          login_tp: 2,
          mobile: that.loginForm.telNum,
          verifycode: that.loginForm.capCode,
          school_id: that.url_school_id
        };
      }
      that.$api.toLogin.login(parms).then(res => {
        if (res.data.result == 0) {
        that.loading = false
          
          console.log("进入登录", res.data);
          that.token = res.data.data.elp_token;
          that.$store.dispatch("getPersonInfo", res.data.data);
          // that.$store.dispatch("changeLogin", "100");
          // sessionStorage.setItem("ISLOGIN", true);
          that.$storage.set("personInfo", this.$store.state.personInfo);
          var args = {
            elp_token: that.token
          };
          // sessionStorage.setItem["tokensss"] = that.token;
          that.$api.toLogin
            .getUserRole(args)
            .then(res => {
              that.$store.dispatch("getRole", res.data.data.user_role);
              that.$storage.set("role", res.data.data.user_role);
              that.$storage.set("isChange", "isChange");
              // that.$storage.set("changeRole", res.data.data.user_role);
            })
            .catch(err => {
              Error(err);
            });

          that.$store
            .dispatch("setToken", that.token)
            .then(() => {
              this.$api.school
                .getAllSchool()
                .then(res => {
                  console.log("进入", res.data);

                  //若没有创建就去企业概况
                  if (res.data.result == 66) {
                    that.$router.push({ path: "/companyManage" });
                  } else {
                    var _role = that.$storage.get("role");
                    console.log("_role++++++++++", _role);

                    if (_role == "staff") {
                      that.$router.push({ path: "/studyCenter" });
                    } else {
                      that.$router.push({ path: "/lessonCenter" });
                    }
                  }
                  // if(res.data.data.data.data.length==0){

                  // }else{
                  // that.$router.push({ path: "/lessonCenter" });

                  // }
                  // console.log("allSchoolArr", this.allSchoolArr);
                })
                .catch(err => {
                  Error(err);
                });
            })
            .catch(res => {
              that.$message({
                showClose: true,
                message: res,
                type: "error"
              });
            });
          // if (res.data.result == 100) {
          // } else {
          //   that.$api.person.getSchoolId({}).then(res => {
          //     console.log(res);
          //     // localStorage.setItem("currentSchoolId",res.data.data.school_id)
          //     this.$store.dispatch("schoolId", res.data.data.school_id);
          //     console.log(this.$store.state);
          //   });
        } else {
          this.$message.error(res.data.msg);
          that.loading = false
        }
      });

      // }
    },
    validate(props, object) {
      if (props == "telNum") {
        this.rulesTel = false;
        if (props == "telNum" && object) {
          this.rulesTel = true;
        }
      }
    },
    getLoginInfo() {
      let prams = {
        school_id: this.url_school_id
      };
      this.$api.toLogin
        .getDefaultInfo(prams)
        .then(res => {
          let { logo, school_name } = res.data.data;
          // console.log("res", res.data.data.logo);
          this.companyLogo = logo;
          this.companyName = school_name;
        })
        .catch(err => Error(err));
    },
    //发手机验证码
    sendMsg() {
      console.log("this.rulesTel", this.rulesTel);

      if (this.loginForm.telNum === null || !this.rulesTel) {
        this.$message.error("请输入正确的电话号码");
        return;
      }

      var _this = this;
      _this.countTime = 120;

      // 直接生成一个验证码对象
      var captcha1 = new TencentCaptcha(
        _this.$config.TencentCaptcha_appid,
        function(res) {
          var that = _this;
          /* callback */

          if (res.ret === 0) {
            _this.isSend = !_this.isSend;
            var t = setInterval(() => {
              that.countTime--;
              if (that.countTime < 1) {
                that.isSend = false;
                clearInterval(t);
              }
            }, 1000);
            let args = {
              mobile: that.loginForm.telNum,
              ticket: res.ticket,
              randstr: res.randstr
            };
            that.$api.global.getMsg(args).then(res => {
              if (res.data.msg == "发送成功") {
                that.$message.success("发送成功");
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      );
      captcha1.show(); // 显示验证码
    }
  },
  mounted() {
    console.log("this.", this.$route.query);
    if (this.$route.query.school_id) {
      this.url_school_id = this.$route.query.school_id;
    }
    this.isSend ? (this.btnMsg = this.countTime) : this.btnMsg;
    this.getLoginInfo();
    this.backgroundPath = this.$imagePath + "elp/rl/bg1.jpg";
    console.log("this.backgroundPath", this.backgroundPath);
  }
};
</script>
<style lang="less" scoped>
//引入基础less文件
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";

.loginConbox {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.btn_sendMsg {
  position: absolute;
  right: 8px;
  width: 90px !important;
  height: 28px;
  top: 9px;
  text-align: center;
  /deep/ span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.el-input {
  /deep/.el-input__inner {
    height: 45px;
  }
}
.logo {
  display: block;
  width: 60px;
  height: 60px;
  margin: 0 auto;
}
.school-name {
  font-size: 26px;
  color: #333;
  margin-top: 20px;
  font-weight: normal;
  .text-overflow(100%);
  height: 40px;
  line-height: 40px;
}
.el-form {
  /deep/ .el-form-item__content {
    line-height: 40px;
    margin-left: 0px;
    width: 100%;
  }
}
.el-card {
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-button {
  width: 100%;
}
.el-card {
  /deep/ .el-card__body {
    width: 300px;
  }
}

#login {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .bgi {
    display: block;
    position: relative;
    left: 50%;
    margin-left: -960px;
  }
  .loginBox {
    .iconcolor {
      color: #409eff;
    }

    .loginCon {
      .el-card__header {
        border-bottom: 0px;
      }
      .title {
        font-size: 36px;
        font-weight: 600;
        color: #ffffff;
        width: 500px;
        float: left;
        margin-top: 0px;
        &:first-child {
          font-size: 34px;
          margin-top: 50px;
          margin-bottom: 30px;
        }
      }
      .login-module {
        width: 430px;
        padding: 25px;
        border-radius: 10px;

        .formTitlt {
          font-size: 18px;
          font-weight: 400;
          text-align: center;
          margin-bottom: 20px;

          .titIconbox {
            float: right;

            .pointer {
              cursor: pointer;
            }
          }
        }

        .smalltxt {
          text-align: right;

          .a {
            text-decoration: none;
            color: #999999;
            font-size: 12px;
            margin-left: 8px;
          }
        }
      }
    }

    // .el-input__inner,
    // .el-button,
    // .el-card,
    // .el-message {
    // }

    .el-form-item__content .ico {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 999;
      width: 40px;
      height: 39px;
      text-align: center;
      border-right: 1px solid #ccc;
    }
    .subBtn {
      margin-top: 5px;
      font-size: 22px;
      font-weight: 200;
    }
    .ewmbox {
      width: 100%;
      height: 240px;
      margin-top: -25px;

      .ewm {
        width: 140px;
        height: 140px;
        margin: 20px auto;

        p {
          font-size: 12px;
          padding-left: 40px;
          margin: 0;
        }
      }

      .ewmicon {
        width: 140px;
        margin: 20px auto 0;

        .iconfont {
          float: left;
        }

        p {
          font-size: 12px;
          padding-left: 40px;
          margin: 0;
        }
      }
    }
  }

  // .el-input__prefix {
  //   /deep/.prefix-icon {
  //     display: block;
  //     width: 16px;
  //     height: 18px;
  //     .prefix-icon-mb {
  //       background: url('https://static.hrloo.com/hrloo56/elp/global/img/icon_01.png') no-repeat center center;
  //     }
  //   }
  // }
}

.el-form {
  /deep/.el-input__prefix {
    left: 9px;
  }
  /deep/.prefix-icon-mb {
    display: block;
    width: 16px;
    height: 100%;
    background: url("https://static.hrloo.com/hrloo56/elp/rl/icon_04.png")
      no-repeat center center;
  }
  /deep/.prefix-icon-cd {
    display: block;
    width: 16px;
    height: 100%;
    background: url("https://static.hrloo.com/hrloo56/elp/rl/icon_05.png")
      no-repeat center center;
  }
}
</style>
