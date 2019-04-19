<template>
  <section style="padding: 0 35px;">
    <div class="ci-layout">
      <div class="ci-item">
        <div class="ci-tt">企业信息</div>
        <div class="ci-overly">
          <div class="c-details">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <th>企业ID：</th>
                <td v-if="schoolInfo.id">{{schoolInfo.id}}</td>
                <td v-else>暂无</td>
              </tr>
              <tr>
                <th>企业大学名称：</th>
                <td>{{schoolInfo.school_name}}</td>
              </tr>
              <tr>
                <th>企业名称：</th>
                <td>{{schoolInfo.enter_name}}</td>
              </tr>
              <tr>
                <th>公司规模：</th>
                <td>{{enpPeople[schoolInfo.people]}}</td>
              </tr>
              <tr>
                <th>联系方式：</th>
                <td>{{schoolInfo.telephone}}</td>
              </tr>
              <tr>
                <th>&nbsp;</th>
                <td>
                  <!-- 修改企业信息 -->
                  <el-button
                    type="text"
                    @click.stop.prevent="_modifyInfomation"
                    class="ui-modify-btn ui-btns"
                  >修改</el-button>
                  <p class="z-link">
                    <span>
                      专属登录链接：
                      <b>https://peixun.2haohr.com/i/{{schoolInfo.id}}</b>
                    </span>
                    <span>如要预览页面，请复制后用其它浏览器打开</span>
                  </p>
                  <!-- <router-link  class="ui-btns ui-login-btn">专属登陆页</router-link> -->
                </td>
              </tr>
            </table>
          </div>
          <div class="c-logo">
            <div class="c-tit">企业LOGO：</div>
            <el-upload
              class="avatar-uploader"
              action="123"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

            <p class="c-intro">
              只支持jpg、png、jpeg格式，文件不超过2MB
              <br>建议尺寸300*300
            </p>
          </div>
        </div>
      </div>
      <div class="ci-item">
        <div class="ci-tt">管理员信息</div>
        <div class="data-table">
          <el-table
            :data="adminData"
            style="width: 100%"
            :header-cell-style="{
    'background-color': '#fafafa',
    'color': '#333',
    'font-size': '12px'}"
          >
            <el-table-column prop="name" label="用户名" width="180"></el-table-column>
            <el-table-column prop="mobile" label="手机" width="280"></el-table-column>
            <el-table-column prop="studentid" label="学号" width="520"></el-table-column>
            <el-table-column prop label="操作">
              <el-button type="text" @click.stop.prevent="changeAdmin = true">更换</el-button>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 修改企业信息弹窗 -->
    <el-dialog title="修改企业信息" width="520px" :visible.sync="modifyInfomation">
      <el-form :model="modifyInfoForm" :rules="modifyInfoFormRules" ref="modifyInfoForm">
        <el-form-item label="企业ID：" :label-width="formLabelWidth">
          <p>{{schoolInfo['id']}}</p>
        </el-form-item>
        <el-form-item label="企业大学名称：	" prop="school_name" :label-width="formLabelWidth">
          <el-input v-model="modifyInfoForm.school_name" autocomplete="off" placeholder="请输入企业大学名称"></el-input>
        </el-form-item>
        <el-form-item label="企业名称：	" prop="enter_name" :label-width="formLabelWidth">
          <el-input v-model="modifyInfoForm.enter_name" autocomplete="off" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="公司规模：	" prop="people" :label-width="formLabelWidth">
          <el-select v-model="modifyInfoForm.people" placeholder="请选择公司规模">
            <el-option v-for="(value, key) of enpPeople" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：	" prop="telephone" :label-width="formLabelWidth">
          <el-input v-model="modifyInfoForm.telephone" autocomplete="off" placeholder="请输入联系方式"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop.prevent="_resetForm('modifyInfoForm')">取 消</el-button>
        <el-button type="primary" @click.stop.prevent="_modifyInfoSubmit('modifyInfoForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更换管理员弹窗 -->
    <el-dialog title="更换管理员" width="520px" :visible.sync="changeAdmin">
      <el-form :model="changeAdminForm" :rules="changeAdminFormRules" ref="changeAdminForm">
        <el-form-item label="手机号码：" :label-width="formLabelWidth2">
          <span class>{{adminData[0]['mobile']}}</span>
          <span class="ui-getmsg-btn" v-if="MSG.show" @click="_sendMSG">获取验证码</span>
          <span class="ui-getmsg-cd" v-else>{{MSG.count}}秒后重新发送</span>
        </el-form-item>
        <el-form-item
          label="短信验证码："
          :label-width="formLabelWidth2"
          prop="verifycode"
          verify
          empty-message="短信验证码不正确"
        >
          <el-input
            style="width: 250px;"
            v-model.number="changeAdminForm.verifycode"
            maxlength="5"
            autocomplete="off"
            placeholder="请输入短信验证码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="新管理员：" :label-width="formLabelWidth2">
          <el-input
            style="width: 175px;"
            v-model="changeAdminForm.name"
            autocomplete="off"
            readonly
            placeholder="请选择新管理员"
          ></el-input>
          <span class="slc-new-admin" @click.stop.prevent="selectAdmin = true">选择</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop.prevent="_resetForm('changeAdminForm')">取 消</el-button>
        <el-button type="primary" @click.stop.prevent="_changeAdminSubmit('changeAdminForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择新管理员弹窗 -->
    <el-dialog title="选择新管理员" :visible.sync="selectAdmin" :class width="700px">
      <div class="new-admin-layout">
        <div class="select-layout select-tree-layout">
          <el-tree
            :props="treeData"
            :load="loadNode"
            ref="treeForm"
            node-key="dep_id"
            lazy
            :highlight-current="true"
            @current-change="_handleClick"
          ></el-tree>
        </div>
        <div class="select-layout selected-layout">
          <div class="autocomplete">
            <el-autocomplete
              v-model="autocomplete.state4"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入姓名搜索"
              @select="handleSelect"
              :debounce="500"
            ></el-autocomplete>
            <div
              class="be-ac-selected"
              v-if="autocomplete.name && autocomplete.new_uid"
            >{{autocomplete.name}}({{autocomplete.mobile}})</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectAdmin = false">取 消</el-button>
        <el-button type="primary" @click="_selectAdminConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import homeHeader from "../../components/header";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      pagedata: {},
      //企业信息
      schoolInfo: {
        id: "",
        school_name: "",
        enter_name: "",
        telephone: ""
      },
      //公司规模类型
      enpPeople: {},
      imageUrl: "", //上传企业logo图片地址
      upload_url: "",
      modifyInfomation: !1, //修改企业信息弹窗显示隐藏
      changeAdmin: !1, //更换管理员弹窗显示隐藏
      //修改企业信息表单
      modifyInfoForm: {
        school_name: "",
        enter_name: "",
        people: "",
        telephone: ""
      },
      //修改企业信息表单验证规则
      modifyInfoFormRules: {
        school_name: [
          { required: true, message: "请输入企业大学名称", trigger: "blur" }
        ],
        enter_name: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        people: [
          { required: true, message: "请选择公司规模", trigger: "change" }
        ],
        telephone: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ]
      },
      formLabelWidth: "175px", //修改企业弹窗formLabelWidth
      formLabelWidth2: "155px", //更换管理员弹窗formLabelWidth
      //更换管理员弹窗表单
      changeAdminForm: {
        verifycode: "",
        name: "",
        new_uid: ""
      },
      changeAdminFormRules: {
        verifycode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        name: [{ required: true, message: "请选择新管理员", trigger: "blur" }]
      },
      //更改管理员 选择管理员弹窗
      selectAdmin: false,
      //更改管理员 选择管理列表数据
      depGroupby: [],
      treeData: {
        label: "dep_name",
        children: "name",
        isLeaf: "isLeaf"
      },
      //更改管理员 选择管理列表数据
      defaultProps: {
        children: "children",
        label: "label"
      },
      __i: 0,
      //管理员信息
      adminData: [
        {
          name: "",
          mobile: "",
          studentid: ""
        }
      ],
      //发送短信验证码相关
      MSG: {
        show: true, // 初始启用按钮
        count: "", // 初始化次数
        timer: null
      },
      //输入搜索用户
      autocomplete: {
        state4: "",
        name: "",
        new_uid: "",
        mobile: ""
      }
    };
  },
  components: { homeHeader },
  mounted() {
    //获取企业信息
    this.getCompanyInfo();
  },
  methods: {
    //获取企业信息
    getCompanyInfo() {
      let self = this;
      self.$api.companyInfo
        .company()
        .then(res => {
          let result = res.data.data;
          //企业信息
          console.log("result.school_info", result.school_info);

          self.schoolInfo = result.school_info;
          self.enpPeople = result.enp_people;
          self.imageUrl = result.school_info.logo;

          //管理员信息
          self.adminData = [
            {
              name: result.staff_user.name,
              mobile: result.userinfo.mobile,
              studentid: result.userinfo.studentid
            }
          ];
          //所有部门信息
          self.depGroupby = result.dep_groupby;
        })
        .catch(err => {});
    },
    //修改企业信息
    updateCompanyInfo(args) {
      let self = this;
      // const parms = args;
      self.$api.companyInfo
        .updateCompanyInfo(args)
        .then(res => {
          let result = res.data;
          if (result.result == 0) {
            self.$message({
              message: "企业信息修改成功",
              type: "success",
              onClose: function() {
                // window.location.reload()
                self.getCompanyInfo();
                self.modifyInfomation = !self.modifyInfomation;
              }
            });
          } else {
            self.$message.error(result.msg);
          }
        })
        .catch(err => {});
    },
    //图片上传相关
    // uploadSectionFile(params) {
    //   var self = this,
    //     file = params.file,
    //     fileType = file.type;
    //   // file_url = self.$refs.upload.uploadFiles[0].url;
    //   let formData = new FormData();
    //   // formData.append("imgFile", file);
    //   self.$api.global
    //     .uploadImage(formData)
    //     .then(res => {
    //     })
    //     .catch(err => {});
    // },
    //图片上传地址
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPEG/JPG/PNG 格式!");
        return;
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过5MB!");
        return;
      }

      var self = this;
      // file_url = self.$refs.upload.uploadFiles[0].url;
      let formData = new FormData();
      formData.append("imgFile", file);
      self.$api.global
        .uploadImage(formData)
        .then(res => {
          let r = res.data;
          if (r.result === 0) {
            self._modifyCompanyLogo(r.data);
          } else {
            self.$message.error(r.msg);
          }
        })
        .catch(err => {});
    },
    //修改企业logo
    _modifyCompanyLogo(args) {
      let self = this;

      let prams = {
        logo: args.imgUrl
      };
      self.$api.global
        .modifyCompanyLogo(prams)
        .then(res => {
          let r = res.data;
          if (r.result === 0) {
            // self._modifyCompanyLogo(r.data)
            self.$message({
              message: "企业头像修改成功!",
              type: "success"
            });
            self.imageUrl = r.data.logo;
          } else {
            self.$message.error(r.msg);
          }
        })
        .catch(err => {});
    },
    //_modifyInfomation 修改企业信息按钮
    _modifyInfomation() {
      let self = this;
      self.modifyInfomation = true;
      //填充默认表单
      self.modifyInfoForm = {
        school_name: self.schoolInfo.school_name,
        enter_name: self.schoolInfo.enter_name,
        people: self.schoolInfo.people,
        telephone: self.schoolInfo.telephone
      };
    },
    //_modifyInfomation 修改企业信息提交
    _modifyInfoSubmit(modifyInfoForm) {
      let self = this;

      // this.changeAdmin = false;
      this.$refs[modifyInfoForm].validate(valid => {
        if (valid) {
          self.updateCompanyInfo(self.modifyInfoForm);
        } else {
          return false;
        }
      });
    },
    //_changeAdminSubmit 更换管理员
    _changeAdminSubmit(changeAdminForm) {
      let self = this;
      self.$refs[changeAdminForm].validate(valid => {
        if (valid) {
          self.$api.companyInfo
            .changeAdmin(self.changeAdminForm)
            .then(res => {
              if (res.data.result == 0) {
                self.$message({
                  message: "更改成功,即将退出,请重新登录",
                  type: "success",
                  onClose: () => {
                    Cookies.remove("token");
                    location.reload();
                  }
                });
                self._resetForm(changeAdminForm);
              } else {
                self.$message.error(res.data.msg);
              }
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    //发送短信验证码 [倒计时]
    _sendMSG() {
      let self = this;
      let TIME_COUNT = self.$config.MSGTIME;

      //方法1: 直接生成一个验证码对象
      var captcha1 = new TencentCaptcha(
        self.$config.TencentCaptcha_appid,
        function(r) {
          /* callback */
          if (r.ret === 0) {
            let args = {
              mobile: self.adminData[0]["mobile"],
              ticket: r.ticket,
              randstr: r.randstr
            };
            self.$api.global
              .getMsg(args)
              .then(res => {
                let result = res.data;
                if (result.result == 0) {
                  if (!self.MSG.timer) {
                    self.MSG.count = TIME_COUNT;
                    self.MSG.show = false;
                    self.MSG.timer = setInterval(() => {
                      if (self.MSG.count > 0 && self.MSG.count <= TIME_COUNT) {
                        self.MSG.count--;
                      } else {
                        self.MSG.show = true;
                        clearInterval(self.MSG.timer); // 清除定时器
                        self.MSG.timer = null;
                      }
                    }, 1000);
                  }
                } else {
                  self.$message.error(result.msg);
                }
              })
              .catch(err => {});
          }
        }
      );
      captcha1.show(); // 显示验证码
    },
    //重置表单
    _resetForm(formName) {
      this.$refs[formName].resetFields();
      this.modifyInfomation = false;
      this.changeAdmin = false;
    },
    //选择新管理员弹窗
    //清空选择的新管理列表
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    handleClick(data, checked, node) {
      if (checked == true) {
        this.checkedId = data.id;
        this.$refs.treeForm.setCheckedNodes([data]);
      }
    },
    nodeClick(data, checked, node) {
      this.checkedId = data.id;
      this.$refs.treeForm.setCheckedNodes([data]);
    },
    _selectAdminConfirm() {
      let self = this;
      self.selectAdmin = false;

      self.changeAdminForm.name = self.autocomplete.name;
      self.changeAdminForm.new_uid = self.autocomplete.new_uid;
    },
    //选择新管理员 加载所有部门和部门下员工
    loadNode(node, resolve) {
      let self = this;
      if (node.level === 0) {
        let arr = self.depGroupby;
        let arr1 = [];
        for (let index = 0; index < arr.length; index++) {
          let ele = arr[index];
          arr1.push({ dep_id: ele.dep_id, dep_name: ele.dep_name });
        }

        return resolve(arr1);
      } else if (node.level === 1) {
        var children = [];
        self.$api.companyInfo
          .getDepStaffList({ dep_id: node.data.dep_id })
          .then(res => {
            let result = res.data.data.dep_staff;
            for (let index = 0; index < result.length; index++) {
              let ele = result[index];
              children.push({
                new_uid: ele.uid,
                dep_name: ele.name + "(" + ele.mobile + ")",
                name: ele.name,
                mobile: ele.mobile,
                isLeaf: true
              });
            }
            return resolve(children);
          })
          .catch(err => {});
      } else {
        return resolve([]);
      }
    },
    //选择员工
    _handleClick(data, checked, indeterminate) {
      let self = this;

      self.autocomplete.new_uid = data.new_uid;
      self.autocomplete.name = data.name;
      self.autocomplete.mobile = data.mobile;
    },
    //选择新管理员 搜索框
    querySearchAsync(queryString, cb) {
      let self = this;
      if (queryString && queryString.length > 0) {
        self.$api.companyInfo
          .getStaffListByName({ name: queryString })
          .then(res => {
            let result = res.data.data.data.data;
            let arr = [];
            for (let index = 0; index < result.length; index++) {
              let ele = result[index];
              arr.push({
                new_uid: ele.uid,
                value: ele.name + "(" + ele.mobile + ")",
                name: ele.name,
                mobile: ele.mobile
              });
            }
            return cb(arr);
          })
          .catch(err => {});
      }
    },
    //搜索框结果选择
    handleSelect(item) {
      let self = this;
      self.autocomplete.new_uid = item.new_uid;
      self.autocomplete.name = item.name;
      self.autocomplete.mobile = item.mobile;
    }
  }
};
</script>

<style lang="less" scoped>
//引入基础less文件
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";

.ci-layout {
  padding: 20px;
  background-color: #fff;
  .ci-tt {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    line-height: 50px;
    text-indent: 12px;
    position: relative;
    &::before {
      position: absolute;
      content: " ";
      width: 3px;
      height: 18px;
      background-color: @bgColor;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      border-radius: 3px;
      overflow: hidden;
    }
  }
}

.ci-overly {
  height: 360px;
  .clearfix();
  .c-details {
    width: 60%;
    height: 360px;
    float: left;
  }
  .c-logo {
    margin-left: 60%;
    height: 360px;
    .c-tit {
      font-size: 14px;
      color: #333;
      height: 50px;
      line-height: 50px;
    }
    .c-intro {
      font-size: 12px;
      color: #999;
      margin-top: 20px;
    }
  }
  table {
    tr {
      font-size: 14px;
      color: #333;
      height: 55px;
      th {
        font-weight: normal;
        width: 130px;
        text-align: right;
      }
      td {
        text-indent: 15px;
      }
    }
  }
}
//企业logo上传
.avatar-uploader {
  margin-top: 5px;
  .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: solid 1px #eaeaea;
    background-color: #f9f9f9;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
}

//修改企业信息
.el-form-item__content {
  padding-right: 50px;
}
.el-input {
  .clearfix();
  .el-input__inner {
    .content-box();
    // width: 90% !important;
    margin-left: 0 !important;
    height: @inputH;
    line-height: @inputH;
  }
}

// 按钮
.ui-btns {
  display: inline-block;
  height: 34px;
  line-height: 34px;
  border: solid 1px @borderColor;
  padding: 0 15px;
  border-radius: 3px;
  font-size: 16px;
  text-align: center;
  &.ui-modify-btn {
    color: #fff;
    background-color: @bgColor;
    padding: 0 30px;
    margin-right: 10px;
    &:hover {
      background-color: @hovColor;
    }
  }
  &.ui-login-btn {
    text-indent: 0px;
    text-decoration: none;
    color: @gColor;
    &:hover {
      border-color: @hovColor;
      color: @hovColor;
    }
  }
}

//表格数据
.data-table {
  overflow: hidden;
}
.view_right {
  box-sizing: content-box;
  // box-sizing: border-box;
}

.el-table {
  th.is-leaf {
    background-color: #ebf3ff;
  }
  .el-input__prefix,
  .el-input__suffix {
    right: 0;
  }
}

//更换管理员弹窗
//选择新管理按钮
.slc-new-admin {
  display: inline-block;
  height: 30px;
  color: @gColor;
  border: solid 1px @borderColor;
  vertical-align: middle;
  padding: 0 16px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 8px;
  font-size: 14px;
  &:hover {
    border-color: @hovColor;
    color: @hovColor;
  }
}

//选择新管理员弹窗
.new-admin-layout {
  height: 400px;
  margin: -30px 0;
  .flex();
  .select-layout {
    padding: 30px 0;
    overflow-y: scroll;
    .pretty-scroll(3px, 3px);
    .flex-value();
    &:nth-child(1) {
      padding-right: 20px;
    }
    &:nth-child(2) {
      border-left: solid 1px #eee;
    }
  }
}

//选择新管理员 搜索框
.autocomplete {
  text-align: center;
  margin: 0 20px;
  .el-autocomplete {
    width: 100%;
  }
  .be-ac-selected {
    height: 40px;
    line-height: 40px;
    background-color: #ebf3ff;
    font-size: 14px;
    color: #333;
    text-align: left;
    text-indent: 15px;
    margin-top: 25px;
  }
}

//获取验证码btn
.ui-getmsg-btn {
  display: inline-block;
  margin-left: 15px;
  color: @gColor;
  cursor: pointer;
}
.ui-getmsg-cd {
  display: inline-block;
  margin-left: 15px;
  color: #999;
}

.el-select {
  width: 100%;
}

.z-link {
  font-size: 14px;
  color: #999;
  margin-top: 15px;
}
// .el-dialog__body {
//   padding: 0 !important;
// }
// .el-form-item__content {
//   width: auto !important;
//   line-height: 32px;
// }
</style>


