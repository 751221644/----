<template>
  <div class="header">
    <div class="container">
      <div class="header-left">
        <img  v-if="school_img" :src="school_img" class="logo" alt="logo">
        <img  v-else="school_img" src="https://static.hrloo.com/hrloo56/elp/rl/defalut_logo.jpg" class="logo" alt="logo">
        <p class="university">{{school_name}}</p>
        <el-dropdown @command="tabSchool" v-if="hiddenChange">
          <span class="el-dropdown-link tab_university">
            切换大学
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="item.school_id"
              v-for="(item,idx) in allSchoolArr"
              :key="idx"
            >{{item.school_name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="header-right">
        <p class="loginOut" @click="_go">优化建议</p>
        <p class="loginOut" @click="_go">联系客服</p>
        <p class="loginOut" @click="loginOut">退出登录</p>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { fail } from 'assert';
export default {
  name: "homeHeader",
  data() {
    return {
      allSchoolArr: [],
      school_name: "",
      school_img: '',
      hiddenChange:false
    };
  },
  created() {
    this.getSchoolInfo();
    this.getAllSchool();
  },
  mounted() {},

  methods: {
    getAllSchool() {
      this.$api.school
        .getAllSchool()
        .then(res => {
          this.allSchoolArr = res.data.data.data.data;
          
          if(res.data.result==66||res.data.data.data.count==1){
            this.hiddenChange = false
          }else{
            this.hiddenChange = true
          }
        })
        .catch(err => {
          Error(err);
        });
    },
    changeSchool(s_id) {
      var parms = {
        school_id: s_id
      };
      this.$api.school
        .changeSchool(parms)
        .then(res => {
          this.allSchoolArr.forEach((item, idx) => {
            if (item.school_id == res.data.data.school_id) {
              this.school_name = item.school_name;
              // sessionStorage.setItem["tokensss"] = that.token;
              var parms = {
                school_id: res.data.data.school_id
              };
              this.$api.toLogin
                .getUserRole(parms)
                .then(res => {
                  // this.$storage.set("changeRole", res.data.data.user_role);
                   this.$storage.set("role", res.data.data.user_role);
                   this.$storage.set("isChange","isChange");

                  // this.$store.dispatch();

                  this.$store.dispatch("getRole", res.data.data.user_role).then(res=>{
                      

                  // this.$storage.set("changeRole", res.data.data.user_role);
                  location.reload()
                  }).catch(Error(err))
                })
                .catch(err => {
                  Error(err);
                });

              // if(this.$route.path == '/person'){
              //   this.$store.dispatch('schoolId',s_id);
              // }
            }
          });
          // window.reload()
        })
        .catch(err => Error(err));
    },
    getSchoolInfo() {
      this.$api.school
        .getSchoolInfo()
        .then(res => {
          let {school_name,logo} = res.data.data.school_info
          this.school_name = school_name;
          this.school_img = logo;
        })
        .catch(err => {});
    },
    loginOut() {
      Cookies.remove("token");
      location.reload();
    },
    tabSchool(s_id) {
      this.changeSchool(s_id);
    },
    _go(){
      window.open('http://wpa.qq.com/msgrd?v=3&uin=1196070365&site=qq&menu=yes')
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  background-color: #3b8cff;
  align-items: center;
  position: fixed;
  z-index: 999;
  .header-left {
    display: flex;
  }
  .logo {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .university {
    display: flex;
    font-size: 18px;
    color: white;
    line-height: 30px;
    margin-left: 10px;
  }
  .tab_university {
    font-size: 14px;
    color: #b3cdff !important;
    margin-left: 18px;
    margin-top: 4px;
  }
  .header-right {
    display: flex;
    width: 210px;
    justify-content: space-around;
    p {
      font-size: 14px;
      color: #fff;
    }
  }
  .i_arrow {
    margin-top: 9px;
    margin-left: 2px;
  }
  .container {
    width: 95.7%;
    display: flex;
    justify-content: space-between;
    background-color: #3b8cff;
    align-items: center;
  }
  .el-dropdown-link {
    display: inline-block;
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .loginOut {
    cursor: pointer;
  }
}
</style>
