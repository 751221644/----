<template>
  <div class="allot-course">
    <!-- 选择新管理员弹窗 第一弹 -->
    <el-dialog
      title="选择分配员工"
      :visible.sync="dialog.selectUsers"
      :class
      width="700px"
      :before-close="_closeDialogs"
    >
      <div class="select-layout">
        <div class="select-overly select-tree-overly">
          <el-tree
            :props="treeData"
            :load="_loadNode"
            ref="treeForm"
            node-key="uid"
            :key="treeKey"
            lazy
            show-checkbox
            @check="_selectUserClick"
          ></el-tree>
        </div>
        <div class="select-overly selected-overly">
          <p>已选择 {{staffData.length}} 人</p>
          <div class="be-ac-selected" v-for="(item,index) in staffData" :key="index">
            <b>{{item.name}}</b>
            <span @click="_updateStaffData(index)">移除</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_nextStep">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 填写留言弹窗 -->
    <el-dialog title="填写留言" :visible.sync="dialog.editMessage" width="700px" center>
      <div class="edit-message">
        <textarea name id placeholder="例：重点学习第2~5节课程" v-model="message"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_editMessageSubmit">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 操作成功弹窗 -->
    <el-dialog
      title="操作成功"
      :visible.sync="dialog.submitSuccess"
      width="700px"
      :before-close="_closeSubmitSuccess"
    >
      <div class="submit-success">
        <img src="https://static.hrloo.com/hrloo56/elp/rl/icon_03.png" alt>
        <p>操作成功</p>
        <!-- <router-link :to="{ name: 'news', params: { userId: 1111}}"></router-link> -->
        <div class="btn">
          <el-button @click="_checkDetails" type="primary">查看分配详情</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "allotCourse",
  props: {
    //部门列表
    // depGroupby: {
    //   type: Array
    // }
  },
  data() {
    return {
      packageID: "", //课程包id
      depGroupby: [], //部门列表
      //所有弹窗
      dialog: {
        selectUsers: !1, //选择分配对象弹窗
        editMessage: !1, //填写留言弹窗
        submitSuccess: !1 //提交成功弹窗
      },
      //分配课程-部门列表弹窗数据
      treeKey: "", // 控制tree渲染的key
      treeData: {
        label: "dep_name",
        children: "name",
        isLeaf: "isLeaf"
      },
      //已选择的分配员工数据
      staffData: [],
      //留言
      message: "",
      allotCourseCallback: null
    };
  },
  methods: {
    /***
     * 第一步 1
     * 检查是否有分配权限
     * 根据参数 pid (packageID)获取初始化数据
     * 检测通过则进行下一步 渲染弹窗
     */
    init(args) {
      let self = this;
      //处理初始化参数 保存到组件
      self.packageID = args.packageID;
      self.message = args.message;
      //回调函数
      self.allotCourseCallback = args.callback ? args.callback : null;
      //获取参数
      let prams = { package_id: self.packageID };
      self.$api.lessonCenter
        .assignCheck(prams)
        .then(res => {
          if (res.data.result === 0) {
            self._getAllDep();
          } else if (res.data.result === 1) {
            self
              .$confirm(res.data.msg, "温馨提示", {
                confirmButtonText: "增加账号",
                cancelButtonText: "",
                showCancelButton: false,
                type: "warning",
                center: true
              })
              .then(() => {
                self.$storage.set("historyPath", self.$route.fullPath);
                self.$router.push({
                  path: "./buyLesson",
                  query: {
                    count: 1,
                    onlyBuyCount: true
                  }
                });
              })
              .catch(() => {});
          } else if (res.data.result === 2) {
            self
              .$confirm(res.data.msg, "温馨提示", {
                confirmButtonText: "联系客服",
                cancelButtonText: "",
                showCancelButton: false,
                type: "warning",
                center: true
              })
              .then(() => {
                window.open(
                  "http://wpa.qq.com/msgrd?v=3&uin=1196070365&site=qq&menu=yes"
                );
              })
              .catch(() => {});
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    },
    /***
     * 第二步 2-1
     * 获取所有部门信息
     */
    _getAllDep() {
      let self = this;
      self.$api.companyInfo
        .getDepByName()
        .then(res => {
          if (res.data.result === 0) {
            let { data } = res.data;
            self.depGroupby = data;
            self.dialog.selectUsers = !self.dialog.selectUsers;
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    },
    /***
     * 第二步 2-2
     * 加载所有部门和部门下员工
     */
    _loadNode(node, resolve) {
      let self = this;
      if (node.level === 0) {
        let arr = self.depGroupby;
        let arr1 = [];
        for (let index = 0; index < arr.length; index++) {
          let ele = arr[index];
          // arr1.push({ dep_id: ele.id, dep_name: ele.name, disabled: true });
          arr1.push({ dep_id: ele.id, dep_name: ele.name });
        }
        return resolve(arr1);
      } else if (node.level === 1) {
        var children = [];
        self.$api.lessonCenter
          .getAssignStaff({
            dep_id: node.data.dep_id,
            package_id: self.packageID
          })
          .then(res => {
            if (res.data.result === 0) {
              let { data } = res.data;
              if (data && data.length > 0) {
                for (let index = 0; index < data.length; index++) {
                  let ele = data[index];
                  let options = {
                    uid: ele.uid,
                    dep_name: ele.name + "(" + ele.mobile + ")",
                    name: ele.name,
                    mobile: ele.mobile,
                    isLeaf: true
                  };
                  //如果不能点击 则需要添加 disabled: true 否则不需要
                  ele.disabled == 1
                    ? Object.assign(options, { disabled: true })
                    : "";
                  self.$refs.treeForm.getCurrentNode()
                    ? (self.$refs.treeForm.getCurrentNode().disabled = false)
                    : "";
                  children.push(options);
                }
                //如果部门下有员工,则放开父节点的全选框
                self.$refs.treeForm.getCurrentNode()
                  ? (self.$refs.treeForm.getCurrentNode().disabled = false)
                  : "";
              } else {
                self.$message.warning("该部门下还没有添加员工~");
              }
            } else {
              self.$message.error(res.data.msg);
            }
            return resolve(children);
          })
          .catch(err => {
          });
      } else {
        return resolve([]);
      }
    },
    // _currentChange(data,node){
    //   let self = this
    //   self.$refs.treeForm.setCurrentNode(data)
    // },
    /**
     * 第三步 3-1
     * 3-1,选择分配员工
     * 选择员工
     */
    _selectUserClick(data, checked, indeterminate) {
      let self = this;
      let arr = self.$refs.treeForm.getCheckedNodes(1); //所有被选中的子节点数据
      arr.length == 0 ? self.$message.warning("未选中员工") : "";
      self.staffData = arr;
    },
    /**
     * 第三步 3-2
     * 3-2,选择分配员工
     * 移除已选择的员工 更新右侧被选中的员工数据 & 更新关联左侧数据
     */
    _updateStaffData(index) {
      let self = this;
      self.staffData.splice(index, 1);
      self.$refs.treeForm.setCheckedNodes(self.staffData);
    },
    /**
     * 第四步 4
     * 选择分配员工完成
     * 点击下一步
     */
    _nextStep() {
      let self = this;
      let uids = [];
      let arr = self.staffData;
      if (arr.length == 0) {
        self.$message.warning("未选中员工");
        return;
      }
      for (let index = 0; index < arr.length; index++) {
        const uid = arr[index].uid;
        uids.push(uid);
      }
      self.$api.lessonCenter
        .assignCheck({
          uids: uids,
          package_id: self.packageID
        })
        .then(res => {
          if (res.data.result === 0) {
            //检测通过 展示填写留言弹窗
            self.dialog.editMessage = !self.dialog.editMessage;
          } else if (res.data.result === 1) {
            self
              .$confirm(res.data.msg, "温馨提示", {
                confirmButtonText: "增加账号",
                showCancelButton: false,
                type: "warning",
                center: true
              })
              .then(() => {
         self.$storage.set("historyPath", self.$route.fullPath);
      self.$router.push({
        path: "./buyLesson",
        query: {
          count: 1,
          onlyBuyCount: true
        }
      });
              })
              .catch(() => {});
          } else if (res.data.result === 2) {
            self
              .$confirm(res.data.msg, "温馨提示", {
                confirmButtonText: "联系客服",
                showCancelButton: false,
                type: "warning",
                center: true
              })
              .then(() => {
                window.open(
                  "http://wpa.qq.com/msgrd?v=3&uin=1196070365&site=qq&menu=yes"
                );
              })
              .catch(() => {});
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {
        });
    },
    /**
     * 第五步 5
     * 提交留言
     */
    _editMessageSubmit() {
      let self = this;
      let uids = [];
      let arr = self.staffData;

      for (let index = 0; index < arr.length; index++) {
        const uid = arr[index].uid;
        uids.push(uid);
      }

      let prams = {
        uids: uids,
        package_id: self.packageID,
        message: self.message
      };

      self.$api.lessonCenter
        .assignPackage(prams)
        .then(res => {
          let { data } = res.data;
          if (res.data.result === 0) {
            self._closeDialogs();
            self.dialog.submitSuccess = !self.dialog.submitSuccess;
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {
        });
    },
    //关闭选择分配员工后 刷新树
    _closeDialogs() {
      this.dialog.selectUsers = !1;
      this.treeKey = +new Date(); //每次加载弹窗都会刷新tree
      this.staffData = [];
      this.dialog.editMessage = !1;
    },
    //关闭 操作成功 弹窗以后的回调
    //如果 父级组件传递了 回调函数 则执行回调
    _closeSubmitSuccess() {
      let self = this;
      self.dialog.submitSuccess = !self.dialog.submitSuccess;
      if (self.allotCourseCallback) {
        self.allotCourseCallback();
      }
    },
    //查看分配详情
    _checkDetails() {

      if (this.$route.path.indexOf("companyDetails") > -1) {
        location.reload();
      } else {
        this.$router.push({
          path: "companyDetails",
          query: { package_id: this.packageID }
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
//引入基础less文件
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";
.select-layout .select-overly[data-v-7c4e51e2]::-webkit-scrollbar-thumb{
  background-color: #fff
}
//选择分配员工
.select-layout {
  height: 400px;
  margin: -30px 0;
  .flex();
  .select-overly {
    padding: 30px 0;
    overflow-y: scroll;
    .pretty-scroll(3px, 3px);
    .flex-value();
    &:nth-child(1) {
      padding-right: 20px;
    }
    &:nth-child(2) {
      border-left: solid 1px #eee;
      padding-left: 15px;
    }
  }
  p {
    font-size: 14px;
    color: #999;
  }
  .be-ac-selected {
    height: 40px;
    line-height: 40px;
    background-color: #f8f8f8;
    font-size: 14px;
    color: #333;
    text-align: left;
    padding: 0 15px;
    margin-top: 10px;
    .clearfix();
    &:hover {
      background-color: #ebf3ff;
    }
    span {
      display: block;
      color: @gColor;
      font-size: 12px;
      float: right;
      cursor: pointer;
    }
    b {
      font-weight: normal;
    }
  }
}
//edit-message 编辑留言弹窗
.edit-message {
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

//submit-success 操作成功弹窗
.submit-success {
  text-align: center;
  padding: 70px 0;
  p {
    font-size: 22px;
    color: #333;
    margin-top: 10px;
  }
  .btn {
    margin-top: 50px;
  }
}
</style>
