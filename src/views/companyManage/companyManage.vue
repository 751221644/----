<template>
  <section>
    <div class="detail">
      <div class="item-layout">
        <div class="d-item">
          <div class="d-i-overly">
            <div class="tt">已购课程</div>
            <div class="ct" style="cursor: pointer;" @click="toLessonManage">
              <count-to
                class="ct_b"
                :start-val="0"
                :end-val="companyInfo.payPackage"
                :duration="2000"
              />
            </div>
          </div>
        </div>
        <div class="d-item">
          <div class="d-i-overly">
            <div class="tt">已添加/总账号数</div>
            <div class="ct" style="cursor: pointer;"  @click="toStaffManage('all')">
                <count-to
                class="ct_b"
                :start-val="0"
                :end-val="companyInfo.addAccount"
                :duration="2000"
              />/
                  <count-to
                  style="font-size:30px"
                class="ct_b"
                :start-val="0"
                :end-val="companyInfo.allAccount"
                :duration="2000"
              />
            </div>
          </div>
        </div>
        <div class="d-item">
          <div class="d-i-overly">
            <div class="tt">申请加入</div>
            <div class="ct" style="cursor: pointer;" @click="toStaffManage('SH')">
                <count-to
                class="ct_b"
                :start-val="0"
                :end-val="companyInfo.accessAccount"
                :duration="2000"
              />
            </div>
          </div>
        </div>
        <div class="d-item">
          <div class="d-i-overly">
            <div class="tt">服务到期日</div>
            <div class="ct dateline">{{companyInfo.endTime}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="layout">
      <div class="overly">
        <div class="tt">快捷通道</div>
        <div class="ct">
          <div class="links">
            <div class="link-item">
              <router-link class="l-i-layout" to="/lessonManage">
                <i class="icon"></i>
                <div class="title">
                  <h2>课程管理</h2>
                  <p>企业大学课程分配和管理</p>
                </div>
                <div class="router-link">立即前往 &gt;</div>
              </router-link>
            </div>
            <div class="link-item">
              <router-link class="l-i-layout" to="/staffManage">
                <i class="icon icon1"></i>
                <div class="title">
                  <h2>员工管理</h2>
                  <p>企业人员审核和管理</p>
                </div>
                <div class="router-link">立即前往 &gt;</div>
              </router-link>
            </div>
            <div class="link-item">
              <router-link class="l-i-layout" to="/companyInfo">
                <i class="icon icon2"></i>
                <div class="title">
                  <h2>企业信息</h2>
                  <p>企业信息、管理员信息的查询与修改</p>
                </div>
                <div class="router-link">立即前往 &gt;</div>
              </router-link>
            </div>
            <div class="link-item">
              <router-link class="l-i-layout" to="/staffRecord">
                <i class="icon icon3"></i>
                <div class="title">
                  <h2>订单记录</h2>
                  <p>查看企业订单记录</p>
                </div>
                <div class="router-link">立即前往 &gt;</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      center
      :visible.sync="hasSchool"
      :modal-append-to-body="false"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <span class="title_d">给您的企业大学起个名字吧</span>
        <el-form-item>
          <el-input v-model="form.name" autocomplete="off" placeholder="例：三茅大学"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createSchool">确认创建</el-button>
        </el-form-item>
        <div class="foot_dialog">
          <!-- <el-checkbox v-model="checked" style="color:rgba(178, 178, 178, 1)">《用户协议及保密承诺》</el-checkbox> -->
          <div></div>
          <el-button type="text" style="color:rgba(178, 178, 178, 1)" @click="outCreate">退出创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import homeHeader from "../../components/header";
import Cookies from "js-cookie";
import router from "../../router/index.js";
import CountTo from "vue-count-to";

// import VueRouter from 'vue-router'

export default {
  data() {
    return {
      companyInfo: {
        payPackage: 0,
        addAccount: 0,
        allAccount: 0,
        accessAccount: 0,
        endTime: 0
      },
      checked: true,
      form: {
        name: ""
      },
      // formLabelWidth: "120px",
      hasSchool: false
    };
  },
  components: { homeHeader, CountTo },

  mounted() {
    this._companyInfo();
  },
  methods: {
    toLessonManage(args){
      this.$router.push({path:"./LessonManage",query:{params:args}})
    },
    toStaffManage(args){
      this.$router.push({path:"./staffManage",query:{params:args}})
    },
    //创建大学
    createSchool() {
      var parms = {
        school_name: this.form.name
      };
      this.$api.school
        .create_school(parms)
        .then(res => {
          if (res.data.data.school_id) {
            this.hasSchool = false;
            this.$message.success("创建大学成功！");
            location.reload();
          }
        })
        .catch(err => {
          Error(err);
        });
    },
    outCreate() {
      Cookies.remove("token");
      location.reload();
    },
    //获取当前用户订单信息
    _companyInfo(args) {
      const self = this;
      self.$api.companyInfo
        .company(args)
        .then(res => {

          if (res.data.result === 0) {
            let {
              ispay_package,
              access_count,
              total_count,
              use_count,
              school_info
            } = res.data.data;

            self.companyInfo.payPackage = Number(ispay_package);
            self.companyInfo.addAccount = Number(use_count) 
            self.companyInfo.allAccount =  Number(total_count) 
            self.companyInfo.accessAccount = Number(access_count)
            self.companyInfo.endTime = school_info.end_time_str;
            // self.ORDERLIST = data;
            // self.pagesNum = +count;
          } else if (res.data.result == 66) {
            self.hasSchool = true;
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    }
  },
  beforeRouteEnter(to, from, next) {
    if (
      (to.path == "/companyManage" &&
        to.query.changeSchool &&
        from.path == "/person") ||
      (to.path == "/studyCenter" &&
        to.query.changeSchool &&
        from.path == "/person")
    ) {
      next(() => {
        window.location.reload();
      });
    } else {
      next();
    }
  }
};
</script>
<style lang="less" scoped>
//引入基础less文件
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";

.title_d {
  font-size: 24px;
  padding-bottom: 45px;
}
.foot_dialog {
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-dialog__wrapper {
  /deep/.el-dialog {
    border-radius: 15px !important;
  }
}

.el-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-form-item {
  width: 100%;
  display: flex;
  justify-content: center;
}
.el-input {
  /deep/ input {
    height: 45px;
  }
}
.el-form {
  /deep/.el-form-item__content {
    width: 400px;
  }
}
.el-form-item {
  /deep/.el-button {
    width: 400px;
    height: 45px;
    font-size: 20px;
  }
}
.el-dialog__title {
  font-size: 24px;
}

.detail {
  padding: 0 15px;
  .item-layout {
    .flex();
    .d-item {
      .flex-value();
      height: 150px;
      padding: 0 15px;
      .d-i-overly {
        height: 150px;
        background-color: #fff;
      }
      .tt {
        font-size: 14px;
        color: #333;
        text-indent: 20px;
        padding-top: 20px;
      }
      .ct {
        color: @gColor;
        font-size: 28px;
        text-align: center;
        margin-top: 20px;
        b {
          font-size: 50px;
          font-weight: normal;
        }
        &.dateline {
          font-size: 26px;
          color: #333;
          margin-top: 35px;
        }
      }
    }
  }
}
.ct_b {
  font-size: 50px;
  font-weight: normal;
  margin-top: 35px;

}
.layout {
  padding: 30px;
  .overly {
    padding: 30px;
    background-color: #fff;
  }
  .tt {
    font-size: 14px;
    color: #333;
  }
  .links {
    text-align: center;
    margin: 35px 0;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .link-item {
    width: 47%;
    height: 120px;
    border: solid 1px #eee;
    margin: 15px;
    &:hover {
      background-color: #f5f9ff;
      border-color: #e3eeff;
    }
  }
  .l-i-layout {
    padding: 30px;
    .clearfix();
    display: block;
    .icon {
      display: block;
      float: left;
      width: 60px;
      height: 60px;
      background: url("https://static.hrloo.com/hrloo56/elp/rl/icon_01.png")
        no-repeat 0 0;
      &.icon1 {
        background-position: 0 -60px;
      }
      &.icon2 {
        background-position: 0 -120px;
      }
      &.icon3 {
        background-position: 0 -180px;
      }
    }
    .title {
      float: left;
      text-align: left;
      margin-left: 20px;
      h2 {
        color: #333;
        font-size: 18px;
        font-weight: bold;
        line-height: 2;
      }
      p {
        font-size: 14px;
        color: #666;
      }
    }
    .router-link {
      float: right;
      color: @gColor;
      font-size: 14px;
      margin-top: 35px;
    }
  }
}
</style>

