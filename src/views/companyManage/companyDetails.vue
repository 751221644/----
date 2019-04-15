
<template>
  <section style="padding: 30px 20px;">
    <div class="layout">
      <div class="content">
        <div class="title">
          <h1>课程名称：{{packageName}}</h1>
        </div>
        <div class="filter">
          <div class="fl">
            <span class="tt">时间：</span>
            <el-date-picker
              class="date-picker"
              v-model="dateline"
              size="small"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd"
              @change="_datePicker"
            ></el-date-picker>
            <span class="tt">部门：</span>
            <el-select
              class="ipt-select"
              v-model="selectDep"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              no-data-text="没有相关部门"
              :remote-method="_remoteMethod"
              :default-first-option="true"
              :clearable="true"
              :loading="loading"
              @change="_doDepSelect"
              @clear="_clearDepSelect"
              value-key="dep_id"
            >
              <el-option
                v-for="item in selectDepOptions"
                :key="item.dep_id"
                :label="item.value"
                :value="item.dep_id"
              ></el-option>
            </el-select>
            <span class="tt">姓名：</span>
            <el-input
              size="small"
              :clearable="true"
              v-model="name"
              class="ipt-name"
              placeholder="请输入姓名"
            ></el-input>
            <span class="btn" @click="_doFilter">查询</span>
          </div>
          <div class="fr">
            <span>已分配人数：{{assignCount}}</span>
            <span class="btn" @click="_addAllot">新增分配</span>
            <span>剩余可分配：{{remainCount}}</span>
            <span class="btn" @click="addCount">增加账号</span>
          </div>
        </div>
        <table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr class="thead">
              <th width="25%" class="th">分配时间</th>
              <th width="20%">部门</th>
              <th width="20%">姓名</th>
              <th width="25%">学习进度</th>
              <th width="10%" class="tc">操作</th>
            </tr>
          </thead>
          <tbody v-if="assignList">
            <tr class="t-item" v-for="(v,i) in assignList" :key="i">
              <td class="th">
                <div class="dateline">{{v.assign_time}}</div>
              </td>
              <td>{{v.dep_name}}</td>
              <td>{{v.username}}</td>
              <td>
                <div class="progress">
                  <el-progress :percentage="parseInt(v.rate)" color="#53c14b"></el-progress>
                </div>
              </td>
              <td class="tc">
                <el-button type="text" @click="_delAssign(v.id,i)">移除</el-button>
              </td>
            </tr>
          </tbody>
          
          <tbody v-else>
            <tr>
              <td colspan="4">
                <div class="null">
                  <img src="https://static.hrloo.com/hrloo56/elp/rl/null.png" alt>
                  <p v-if="name || startTime || endTime || selectDepID">
                      没有查询到相关分配明细
                  </p>
                  <p v-else>没有分配明细</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagebar" v-if="assignList && assignList.length>pages">
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

    <allotCourse ref="allotCourseFn"></allotCourse>
  </section>
</template>

<script>
import homeHeader from "../../components/header";
import allotCourse from "../../components/company/allotCourse";

export default {
  data() {
    return {
      packageID: "", //课程包id
      dateline: "", //日期选择器
      startTime: "", //日期选择器-选择后返回的开始时间
      endTime: "", //日期选择器-选择后返回的结束时间
      selectDep: [], //部门选择器
      selectDepOptions: [], //部门选择器 搜索结果列表
      selectDepID: "", //部门选择器 xuanid
      loading: false,
      name: "", //输入姓名
      packageName: "", //课程名称
      assignCount: 0, //已分配人数
      remainCount: 0, //剩余可分配人数
      assignList: [], //数据列表
      pagesNum: 0, //页码
      pages: 10 //每页显示10条
    };
  },
  components: { homeHeader, allotCourse },
  mounted() {
    let opttions = this.$route.query;
    this.packageID = opttions.package_id;
    //获取页面数据
    this._getAssignList();
  },
  methods: {
    //获取课程列表
    _getAssignList(args) {
      const self = this;
      let params = {
        package_id: self.packageID
      };
      Object.assign(params, args);
      
      self.$tools.startLoding()

      self.$api.lessonCenter
        .getAssignList(params)
        .then(res => {
          if (res.data.result === 0) {
            let {
              data,
              assign_count,
              remain_count,
              package_name
            } = res.data.data;
            self.packageName = package_name; //课程名称
            self.assignCount = assign_count; //已分配人数
            self.remainCount = remain_count; //剩余可分配人数
            self.assignList = data.data; //数据列表
            
            self.$tools.closeLoading()
          } else {
            self.$message.error(result.msg);
          }
        })
        .catch(err => {});
    },
    /*
     *时间选择器返回的结果
     */
    _datePicker(args) {
      this.startTime = args[0];
      this.endTime = args[1];
    },
    /**
     * 根据部门名称搜索部门 dep_name
     */
    _remoteMethod(queryString) {
      const self = this;
      let prams = {
        dep_name: queryString
      };
      self.$api.companyInfo
        .getDepByName(prams)
        .then(res => {
          if (res.data.result === 0) {
            let { data } = res.data;
            let result = [];
            if (data) {
              for (let index = 0; index < data.length; index++) {
                const ele = data[index];
                result.push({
                  dep_id: ele.id,
                  value: ele.name
                });
              }
              return (self.selectDepOptions = result);
            }
            return (self.selectDepOptions = result);
          } else {
            self.$message.error(result.msg);
          }
        })
        .catch(err => {});
    },
    //选择了搜索结果中的部门
    _doDepSelect(args) {
      this.selectDepID = args;
    },
    //
    _clearDepSelect(args) {
      this.selectDepID = "";
    },
    //查询按钮
    _doFilter() {
      const self = this;
      self._getAssignList({
        starttime: self.startTime,
        endtime: self.endTime,
        username: self.name,
        dep_id: self.selectDepID
      });
    },
    //移除用户
    _delAssign(aid, index) {
      const self = this;
      self
        .$confirm("此操作将永久移除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.$api.lessonCenter
            .delAssign({
              id: aid
            })
            .then(res => {
              if (res.data.result === 0) {
                self.assignList.splice(index, 1);
                self.assignCount--;
                self.remainCount++;
                self.$message({
                  type: "success",
                  message: "除该用户移除成功!"
                });
              } else {
                self.$message.error(res.data.msg);
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          //   self.$message({
          //     type: "info",
          //     message: "已取消移除该用户~"
          //   });
        });
    },
    _currentChange() {},
    addCount(){
           this.$storage.set("historyPath",this.$route.fullPath)
      this.$router.push({
        path: "./buyLesson",
        query: {
          count: 1,
          onlyBuyCount: true
        }
      });
    },
    /**
     * 新增分配
     */
    _addAllot() {
      const self = this;
      let prams = {
        packageID: self.packageID
      };
      self.$refs.allotCourseFn.init(prams);
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
.content {
  //   margin-top: 20px;
  h1 {
    font-size: 22px;
    font-weight: normal;
  }
  .filter {
    .clearfix();
    margin-top: 30px;
    font-size: 14px;
    .fl {
      float: left;
      .clearfix();
      .tt {
        float: left;
        line-height: 32px;
      }
      .date-picker {
        float: left;
        width: 220px;
        margin-right: 15px;
      }
      .ipt-select {
        float: left;
        width: 145px;
        margin-right: 15px;
      }
      .ipt-name {
        float: left;
        width: 120px;
        margin-right: 15px;
      }
    }
    .fr {
      float: right;
      line-height: 32px;
      color: #999;
      & > span {
        display: inline-block;
        &:nth-child(2) {
          margin-right: 20px;
        }
      }
    }
    .btn {
      font-size: 14px;
      line-height: 32px;
      color: @gColor;
      cursor: pointer;
    }
  }
}

.table {
  margin-top: 30px;
  text-align: left;
  .thead {
    height: 35px;
    background-color: #ebf3ff;
  }

  .t-item {
    border-bottom: solid 1px #f1f1f1;
    height: 50px;
    color: #666;
    font-size: 12px;
    /deep/ .el-progress__text {
      font-size: 12px;
      color: #666;
    }
    .progress {
      width: 50%;
    }
    &:hover {
      background-color: #f9f9f9;
    }
  }

  .btn {
    font-size: 12px;
    color: @gColor;
    cursor: pointer;
  }
  .th {
    text-indent: 30px;
  }
  .tc {
    text-align: center;
  }
}
</style>


