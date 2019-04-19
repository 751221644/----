<template>
  <div class="container">
    <homeHeader @getAnt="toclick"></homeHeader>
    <div style="display:flex; height: 100%;">
      <div class="flex-d myCen">
        <div class="company_name">
          <p class="tabContail">{{nickname}}</p>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo slide_left"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          :collapse="!isCollapse"
          :unique-opened="true"
          text-color="#6b7ca4"
          active-text-color="#3b8cff"
          background-color="#2a3651"
          router
        >
          <template v-for="(item,index) in $store.state.routers" v-if="!item.hidden">
            <el-menu-item v-if="!item.hasChild" :index="item.children[0].path">
              <i class="univ_icon" :class="item.icon"></i>
              {{item.children[0].name}}
            </el-menu-item>
            <el-submenu :index="index+''" v-if="item.hasChild">
              <template slot="title">
                <i class="univ_icon" :class="item.icon"></i>
                <!-- <img v-if="" :src="item.icon" alt="">
                <img :src="item.activeicon" alt="">-->
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="(child,idx) in item.children"
                v-if="!child.hidden"
                :key="idx"
                :index="child.path"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <!-- <el-menu-item v-if="item.ref" :index="item.path">
              <i :class="item.icon"></i>
              {{item.name}}
            </el-menu-item>-->
          </template>
        </el-menu>
      </div>
      <div class="flex-d view_right">
        <div class="pad">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              :to="{ path: '/' }"
              separator-class="el-icon-arrow-right"
              v-for="item in $route.matched"
              :key="item.path"
            >{{ item.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex-d container_view">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homeHeader from "../../components/header";
import base from "../../api/base.js";
export default {
  data() {
    return {
      isCollapse: true,
      marLeft: 0,
      isMar: false,
      imageUrl: "",
      personInfo: {},
      nickname: ""
    };
  },
  components: { homeHeader },
  mounted() {
    this.personInfo = this.$storage.get("personInfo");
    this.nickname = this.personInfo.userinfo.nickname;
    this.imageUrl = this.$imagePath + "elp/logo1.png";

    // //方法1: 直接生成一个验证码对象
    // var captcha1 = new TencentCaptcha("appId", function(res) {
    //   /* callback */
    // });
    // captcha1.show(); // 显示验证码
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {},
    handleSelect(key, keyPath) {
    },
    //侧边栏收缩，暂时不用
    toclick(args) {
      // this.isMar = args;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file, id) {
      let self = this;
      let formData = new FormData();
      formData.append("imgFile", file);

      this.$api.article
        .Upload(formData)
        .then(res => {
        })
        .catch(err => {});
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    }
  }
};
</script>
 <style lang="less" scoped>
@import url("../../theme/color.less");
@import url("../../assets/iconfont/iconfont.css");

.univ_icon {
  font-size: 18px;
  color: rgb(107, 124, 164);
}

.el-submenu.is-opened {
  /deep/.el-submenu__title {
    background-color: #1c2845 !important;
    color: #3b8cff !important;
    .univ_icon {
      font-size: 18px;
      color: #3b8cff;
    }
  }
  /deep/.el-menu-item {
    background-color: #1c2845 !important;
    &.is-active {
      background-color: #3b8cff !important;
      color: white !important;
    }
  }
}
// .el-menu {
//   /deep/ .el-submenu__title{
//     font-size: 16px!important
//   }
//   /deep/ .el-menu-item {
//     font-size: 14px!important;
//     &.is-active {
//       font-weight: bold;
//     }
//   }
// }

.tabContail {
  cursor: pointer;
}
.container {
  height: 100%;
  background-color: #f1f1f1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 92%;
}
.marginRight {
  margin-left: -200px;
  transition: all 0.6s;
}
.marginRR {
  margin-right: 0px;
  transition: all 0.6s;
}
.flex-d {
  display: flex;
  flex-direction: column;
}
.sTitle {
  font-size: 24px;
}
.pad {
  padding: 20px 35px;
  font-size: 14px;
  // .el-breadcrumb {
  //   /deep/.el-breadcrumb__inner {
  //     color: #999;
  //     &.is-link {
  //       color: #1c2845
  //     }
  //   }
  // }
}
h2 {
  font-weight: 100;
}
.slide_left {
  background-color: #2a3651;
  color: #3b8cff;
}
.company_name {
  background-color: #2a3651;
  color: white;
  font-size: 24px;
  width: 200px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}
.view_right {
  width: 100%;
  margin-left: 200px;
  margin-top: 60px;
  background-color: @themeBac;
  overflow: auto;
}
.myCen {
  height: 100%;
  margin-top: 60px;
  position: fixed;
}
.breadcrumb-inner {
  margin-top: 60px;
}
.container_view {
  width: 100%;
  height: 100%;
  background-color: @themeBac;
}
</style>
