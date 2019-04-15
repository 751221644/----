
<template>
  <section style="padding: 0 35px;">
    <div class="layout">
      <div class="top">
        <el-tabs v-model="activeName" @tab-click="_tabHandleClick">
          <el-tab-pane label="有效课程" name="1">有效课程</el-tab-pane>
          <el-tab-pane label="已过期" name="2">已过期</el-tab-pane>
          <el-tab-pane label="全部" name="4">全部</el-tab-pane>
        </el-tabs>

        <div class="search">
          <div class="input-layout">
            <el-input
              placeholder="请输入课程包名称进行搜索"
              v-model="searchVal"
              @keyup.native="_keyUpForSearch"
            >
              <i class="el-icon-search el-input__icon" slot="suffix" @click="_clickForSearch"></i>
            </el-input>
          </div>
        </div>
      </div>
      <div class="content">
        <table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr class="thead">
              <th width="40%" class="tc" >课程名称</th>
              <th width="20%">有效期至</th>
              <th width="20%" >已分配人数</th>
              <th width="20%" class="tc">操作</th>
            </tr>
          </thead>
          <tbody v-if="lesson">
            <tr class="t-item" v-for="(v,i) in lesson" :key="i">
              <td>
                <div class="img-title">
                  <img :src="v.thumb" alt>
                  <div class="title">
                    <div>
                      <h2 style="cursor: pointer;" @click="toLessonInfo(v.package_id)">{{v.name}}</h2>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="dateline">{{v.end_time}}</span>
              </td>
              <td>
                <span class="people" style="cursor: pointer;" @click="toDetail">{{v.count}}</span>
              </td>
              <td class="tc">
                <div class="operation" v-if="v.shelves != 2">
                  <span @click="_allocationCourse(v.package_id,i)">分配课程</span>
                  <b>丨</b>
                  <span @click="_editNote2(i)">编辑留言</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4">
                <div class="null">
                  <img src="https://static.hrloo.com/hrloo56/elp/rl/null.png" alt>
                  <p v-if="!searchVal && activeName==2">暂无已过期课程</p>
                  <p v-else-if="!searchVal">
                    暂无课程，可前往 课程中心
                    <router-link to="/lessonCenter">去购买</router-link>
                  </p>
                  <p v-else>没有搜索到 "{{searchVal}}" 相关课程</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagebar" v-if="lesson">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pagesNum"
            :page-size="pages"
            @current-change="_currentChange"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <!-- 分配课程公共组件 allotCourse -->
    <allotCourse ref="allotCourseFn"></allotCourse>

    <!-- 弹窗 编辑留言 -->
    <el-dialog title="编辑留言" :visible.sync="editMessageDialog" width="700px" center>
      <div class="note">
        <textarea name id placeholder="例：重点学习第2~5节课程" v-model="message"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_editNoteSubmit">确 认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import homeHeader from "../../components/header";
import allotCourse from "../../components/company/allotCourse";

export default {
  data() {
    return {
      activeName: "1", //tab默认选择
      lesson: [], //课程列表
      pagesNum: 0, //页码
      pages: 5, //每页显示5条
      //搜索相关
      searchVal: "",
      //分配课程-选择员工弹窗
      selectAdmin: !1,
      //分配课程-部门列表
      depGroupby: [],
      //分配课程-课程包id
      packageId: "",
      //当前操作的数据列表所在下标
      _index: '',
      editMessageDialog: !1, //编辑留言弹窗
      message: "" //需要编辑的留言
    };
  },
  components: { homeHeader, allotCourse },
  mounted() {
    this.getLessonList({
      status: self.activeName //tab选中
    });
  },
  methods: {
    //获取课程列表
    getLessonList(args) {
      const self = this;
      self.$api.lessonCenter
        .getLessonListByStatus(args)
        .then(res => {
          if (res.data.result === 0) {
            let { data, dep, count } = res.data.data;
            self.lesson = data;
            self.pagesNum = +count;
            self.depGroupby = dep;
          } else {
            self.$message.error(result.msg);
          }
        })
        .catch(err => {});
    },
    //跳转分配详情
    toDetail(){
      this.$router.push('/companyDetails')
    },
    //跳转课程详情页
    toLessonInfo(package_id){
      this.$router.push({
        path: "./lessonInfo",
        query: {
          package_id: package_id
        }
      });
    },
    //tab
    _tabHandleClick(tab, event) {
      const self = this;
      self.searchVal = "";
      self.getLessonList({
        status: self.activeName
      });
    },
    //搜索操作 1-键盘确定按钮
    _keyUpForSearch(args) {
      const self = this;
      if (args.keyCode == 13) {
        self.getLessonList({
          name: self.searchVal, //搜索输入框的值
          status: self.activeName //tab选中
        });
      }
    },
    //搜索操作 2-鼠标点击搜索图标
    _clickForSearch(args) {
      const self = this;
      self.getLessonList({
        name: self.searchVal, //搜索输入框的值
        status: self.activeName //tab选中
      });
    },
    //分页
    _currentChange(res) {
      const self = this;
      self.getLessonList({
        page: res,
        status: self.activeName
      });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    //分配课程 并启动分配课程组件
    _allocationCourse(pid, index) {
      const self = this;

      self.packageId = pid;
      self.message = self.lesson[index].message;
      let prams = {
        packageID: pid,
        message: self.lesson[index].message
      };

      self.$refs.allotCourseFn.init(prams);
      return;
    },
    /**
     * 编辑留言2
     * 根据id显示留言
     *
     */
    _editNote2(args) {
      const self = this;

      self._index = args
      //   this.$router.push({path:'companyDetails'})
      const lesson = self.lesson;
      self.packageId = lesson[self._index].package_id;
      self.message = lesson[self._index].message;
      self.editMessageDialog = !self.editMessageDialog;
    },
    /**
     *  编辑留言2 弹窗 确认按钮按钮
     *
     */
    _editNoteSubmit() {
      const self = this;
      let prams = {
        package_id: self.packageId,
        message: self.message
      };
      self.$api.lessonCenter
        .editMessage(prams)
        .then(res => {
          let { data } = res.data;
          if (res.data.result === 0) {
            self.packageId = "";
            // self.message = self.message;

            self.lesson[self._index].message = self.message

            self.editMessageDialog = !self.editMessageDialog;
            self.$message({
              message: "留言编辑成功~",
              type: "success"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
//引入基础less文件
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";

.layout {
  padding: 30px;
  background-color: #fff;
  min-height: 766px;
  box-sizing: border-box;
}

.top {
  position: relative;
  .search {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 1;
  }
}

.content {
  margin-top: 35px;
}

.table {
  .thead {
    height: 35px;
    background-color: #ebf3ff;
  }
  .img-title {
    .clearfix();
    margin: 15px 15px 15px 30px;
    img {
      display: block;
      width: 110px;
      height: 70px;
      float: left;
    }
    .title {
      display: block;
      margin-left: 160px;
      h2 {
        .text-overflow();
        color: #004cb7;
        font-size: 12px;
        margin-top: 25px;
      }
    }
  }
  .t-item {
    border-bottom: solid 1px #f1f1f1;
    // &:last-child {
    //   border-bottom: none;
    // }
    .dateline {
      color: #666;
    }
    .people,
    .operation {
      color: #004cb7;
      span {
        cursor: pointer;
      }
    }
    b {
      color: #eee;
      font-weight: normal;
    }
  }
}
.tc {
  text-align: center;
}

//note样式
.note {
  text-align: center;
  textarea {
    width: 500px;
    height: 150px;
    padding: 10px;
    border: solid 1px #ddd;
    border-radius: 5px;
    resize: none;
    font-size: 14px;
    line-height: 1.6;
    .placeholder(#ccc);
  }
}

//tab重置样式
.el-tabs {
  /deep/ .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0;
    background-color: #fff;
    z-index: 1;
  }
  /deep/ .el-tabs__nav-scroll {
    padding-left: 0;
  }
  /deep/ .el-tabs__content {
    display: none;
  }
}

//input 搜索框样式重置
// .input-layout .el-input {
//   /deep/ .el-input__inner {
//     border-right: none;
//   }
//   /deep/ .el-button {
//     border-left: none;
//   }
//   /deep/ .el-input-group__append,
//   .el-input-group__prepend {
//     background-color: #fff;
//     padding: 0 10px;
//   }
// }
</style>


