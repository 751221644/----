<template>
  <div class="wrap_card">
    <div class="box-card">
      <div class="flex">
        <el-tabs v-model="activeName" style="padding:10px" @tab-click="handleClick">
          <el-tab-pane :label="'全部员工('+use_count+')'" name="first">
            <div class="flex align-c" v-if="activeName=='first'">
              <el-tree
                :data="data"
                :props="defaultProps"
                @node-click="clickTreePane"
                default-expand-all
              ></el-tree>
              <div class="addOrEdit">
                <span class="addEorp" @click="addDep">新增</span>
                <span>/</span>
                <span @click="editDep">编辑</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'审核('+SHCount+')'" name="second">
            <div v-if="activeName=='second'">
              <div class="flex just-between r_body">
                <div class="flex">
                  <span style="padding-left:30px">已添加员工：{{use_count}}</span>
                  <el-dropdown @command="handleCommand">
                    <span class="canClick el-dropdown-link">添加员工</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item disabled>请选择添加方式</el-dropdown-item>
                      <el-dropdown-item command="scan">扫码添加</el-dropdown-item>
                      <el-dropdown-item command="personalLink">专属链接</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span style="padding-left:30px">剩余可添加账号：{{total_count}}</span>
                  <span class="canClick" @click="toBuyCount">增加账号</span>
                </div>
                <div style="width:308px">
                  <el-input
                    placeholder="请输入员工姓名"
                    @keyup.enter.native="searchCont"
                    v-model="search"
                    @change="searchCont"
                  >
                    <i class="el-icon-search el-input__icon" slot="suffix" @click="_clickForSearch"></i>
                  </el-input>
                </div>
              </div>
              <div>
                <!-- 审核表格 -->
                <el-table
                  ref="multipleTable1"
                  tooltip-effect="dark"
                  :data="logData"
                  style="width: 100%"
                  v-loading="SHLoading"
                  border
                >
                  <el-table-column type="selection" min-width="55"></el-table-column>
                  <el-table-column prop="dateline_str" label="申请时间" min-width="250"></el-table-column>
                  <el-table-column prop="dep_name" label="部门" min-width="250"></el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="250"></el-table-column>
                  <el-table-column prop="mobile" label="手机号码" min-width="250"></el-table-column>
                  <el-table-column prop="status" label="状态" min-width="250"></el-table-column>
                  <el-table-column fixed="right" label="操作" min-width="250">
                    <template slot-scope="scope" v-if="scope.row.options">
                      <el-button @click="passApprove(scope.row)" type="text" size="small">通过</el-button>
                      <el-button @click="rejectApprove(scope.row)" type="text" size="small">拒绝</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="right_content" v-if="activeName=='first'">
          <div class="right_head flex column">
            <div class="flex just-between r_body">
              <div class="flex">
                <span class="canClick" @click="deleteSuff" v-if="hasSelectAll">批量移除</span>
                <span class="canClick" @click="shiftdevelment" v-if="hasSelectAll">转移部门</span>
                <span style="padding-left:30px">已添加员工：{{use_count}}</span>
                <el-dropdown @command="handleCommand">
                  <span class="canClick el-dropdown-link">添加员工</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>请选择添加方式</el-dropdown-item>
                    <el-dropdown-item command="scan">扫码添加</el-dropdown-item>
                    <el-dropdown-item command="personalLink">专属链接</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <span style="padding-left:30px">剩余可添加账号：{{total_count}}</span>
                <span class="canClick" @click="toBuyCount">增加账号</span>
              </div>
              <div style="width:308px">
                <el-input
                  placeholder="请输入员工姓名"
                  v-model="search"
                  @keyup.enter.native="searchCont"
                  @change="searchCont"
                >
                  <i class="el-icon-search el-input__icon" slot="suffix" @click="_clickForSearch"></i>
                </el-input>
              </div>
            </div>
            <!-- 所有员工表 -->
            <el-table
              ref="multipleTable"
              tooltip-effect="dark"
              :data="allsaffData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              border
              v-loading="allLoading"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="姓名" width="250"></el-table-column>
              <el-table-column prop="dep_name" label="部门" width="250"></el-table-column>
              <el-table-column prop="mobile" label="手机号码" width="250"></el-table-column>
              <el-table-column prop="studentid" label="学号" width="250"></el-table-column>
              <el-table-column fixed="right" label="操作" min-width="250">
                <template slot-scope="scope">
                  <el-button @click="editSuff(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteSuff(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 转移人员 -->
      <el-dialog title="批量转移部门" :visible.sync="shift">
        <el-form :model="form">
          <el-form-item label="转移至" :label-width="formLabelWidth">
            <el-select v-model="shiftStaff" placeholder="请选择要转移的部门" @change="changeDep">
              <el-option
                v-for="(value, key) in specialArr"
                :key="key"
                :label="value.dep_name"
                :value="key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveShiftStaff">保存</el-button>
        </div>
      </el-dialog>

      <!-- 编辑部门 -->
      <el-dialog title="编辑部门" :visible.sync="EditDepent">
        <el-form :model="formdep">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="formdep.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EditDepent = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditDep">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 新增部门 -->
      <el-dialog title="新增部门" :visible.sync="addDepent">
        <el-form :model="form1">
          <el-form-item label="部门名称" :label-width="formLabelWidth">
            <el-input v-model="form1.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDepent = false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑人员 -->
      <el-dialog title="编辑人员" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="部门" :label-width="formLabelWidth">
            <el-select v-model="selectGroup" placeholder="请选择编辑部门" @change="changeDep">
              <el-option
                v-for="(value, key) in specialArr"
                :key="key"
                :label="value.dep_name"
                :value="key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 扫码添加 -->
      <el-dialog title="添加员工" :visible.sync="scanAdd" width="30%">
        <div class="title_delage">
          <div>
            <span>扫码添加</span>
            <span class="canClick" @click="moreWay">更多方式></span>
          </div>
          <div>
            <span>剩余可添加人数:{{total_count}}</span>
            <span class="canClick" @click="toBuyCount">增加账号</span>
          </div>
        </div>
        <div class="flex_center">
          <p class="p_option">操作指引</p>
          <div style="width: 100%;padding-bottom:5px">
            <p>1.保存二维码图片,转发并引导员工微信扫码完成个人信息填写:</p>
          </div>
          <div>
            <p>2.员工提交后,待您通过审批即可完成操作.成功添加后,系统将自动向员工下发登录账号及密码</p>
          </div>
          <img :src="addStaffIMG" alt style="width:300px;height:300px">
          <el-button type="primary" @click="saveImage">保存图片</el-button>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <!-- 链接添加 -->
      <el-dialog title="添加员工" :visible.sync="personLink" width="30%">
        <div class="title_delage">
          <div>
            <span>链接添加</span>
            <span class="canClick" @click="moreWay">更多方式></span>
          </div>
          <div>
            <span>剩余可添加人数:{{total_count}}</span>
            <span class="canClick" @click="toBuyCount">增加账号</span>
          </div>
        </div>
        <div class="flex_center">
          <p class="p_option">操作指引</p>
          <div style="width: 100%;padding-bottom:5px">
            <p>1.右键复制以下您的企业专属链接,转发并引导员工访问链接完成个人信息填写:</p>
          </div>
          <div>
            <p>2.员工提交后,待您通过审批即可完成操作.成功添加后,系统将自动向员工下发登录账号及密码</p>
          </div>
          <div class="d_link">
            <p>{{addStaffUrl}}</p>
          </div>
          <el-button
            v-clipboard:copy="addStaffUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="primary"
          >复制链接</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="block">
      <el-pagination
        v-if="activeName == 'first'"
        background
        layout="prev, pager, next"
        @current-change="currPage"
        :total="pageTotal"
      ></el-pagination>
      <el-pagination
        v-if="activeName == 'second'"
        background
        layout="prev, pager, next"
        @current-change="currPageSH"
        :total="pageTotalSH"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { log } from "util";
import { watch } from "fs";
export default {
  data() {
    return {
      activeName: "first",
      isAllSaff: true,
      data: [
        {
          id: 1,
          dep_name: "全部",
          children: []
        }
      ],
      allLoading: true,
      SHLoading: true,
      defaultProps: {
        children: "children",
        label: "dep_name"
      },
      gourpArr: [],
      selectGroup: "",
      search: "", //搜素课程
      dialogFormVisible: false,
      scanAdd: false,
      shift: false,
      personLink: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      form1: {
        name: ""
      },
      formdep: {
        name: "" //编辑部门表格数据
      },
      pageTotal: null, //总页数
      allsaffData: [], //所有员工数据
      use_count: null, //已添加员工数
      total_count: null, //可配额员工总量
      logData: [], //审核员工的数据
      addStaffUrl: "", //添加员工URL
      addStaffIMG: "", //添加员工图片
      dep_count: 0, //部门全部员工数
      idList: [], //删除员工的数组
      formLabelWidth: "120px",
      dep_id: null, //部门选中的id
      staffId: null, //员工id
      shiftStaff: [], //员工转移
      addDepent: false, //新增部门弹窗
      EditDepent: false, //编辑部门
      hasSelectAll: false, //全部表格中是否勾选了员工
      SHCount: null, //审核员工总数
      pageTotalSH: null, //审核员工分页器总数
      EditDepId: null, //部门id
      isClickTree: false, //是否点击部门树
      addWay: false,
      args: {
        currentPage: 1, //全部员工分页器的分页，默认第一页
        name: ""
      },
      argsSH: {
        currentPage: 1, //审核员工分页器的分页，默认第一页
        name: ""
      },
      selectno: false,
      specialArr: []
    };
  },
  methods: {
    onCopy: function(e) {
      // alert("You just copied: " + e.text);
      this.$message.success("复制成功");
    },
    onError: function(e) {
      this.$message.error("复制失败");
    },

    //搜索部门树的数据
    clickTreePane(data) {
      var that = this;
      if (data.dep_id) {
        that.isClickTree = true;
        that.EditDepId = data.dep_id;
        this.formdep.name = data.dep_name.substring(
          0,
          data.dep_name.length - 5
        );

        var parms = {
          dep_id: data.dep_id
        };
        this.allLoading = true;
        this.getAllList(parms);
      }
    },
    //节点发生变化
    // currentchange(v,a,){

    // },

    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },

    // 保存图片
    saveImage() {
      this.downloadIamge(this.addStaffIMG, "QRcode");
    },
    //审核表格数据
    staff_list_log(argsSH) {
      var parms = {
        page: argsSH.currentPage,
        name: argsSH.name
      };

      this.$api.companyInfo
        .staff_list_log(parms)
        .then(res => {
          this.pageTotalSH = res.data.data.pages_num * 10;
          this.SHCount = res.data.data.data.count;
          // this.logData = res.data.data.data.data;
          res.data.data.data.data.forEach((element, index) => {
            switch (element.status) {
              case "1":
                element.status = "待审核";
                element.options = true;
                break;
              case "2":
                element.status = "通过";
                element.options = false;
                break;
              case "3":
                element.status = "拒绝";
                element.options = false;
                break;
              default:
                break;
            }
          });
          this.logData = res.data.data.data.data;
          this.SHLoading = false;
        })
        .catch(err => Error(err));
    },
    //更多方式
    moreWay() {
      // this.addWay = !this.addWay
      // if(this.addWay){
      //   this.scanAdd = false
      //   this.personLink = true
      // }
      if (this.scanAdd) {
        this.scanAdd = false;
        this.personLink = true;
      } else {
        this.scanAdd = true;
        this.personLink = false;
      }
    },
    //获取全部员工列表
    getAllList(args) {
      //筛选部门id
      if (args.dep_id) {
        var parms = {
          page: this.args.currentPage,
          dep_id: args.dep_id
        };
      } else {
        //分页
        var parms = {
          page: args.currentPage,
          name: args.name
        };
      }

      this.$api.companyInfo
        .getStaffListByName(parms)
        .then(res => {
          this.allLoading = false;
          this.pageTotal = res.data.data.pages_num * 10;
          this.allsaffData = res.data.data.data.data;
        })
        .catch(err => Error(err));
    },
    //搜索员工姓名
    _clickForSearch() {
      this.args.name = this.search;
      this.allLoading = true;
      this.getAllList(this.args);
    },
    //全部员工分页
    currPage(e) {
      this.allLoading = true;
      this.args.currentPage = e;
      this.getAllList(this.args);
    },
    //审核分页
    currPageSH(e) {
      this.argsSH.currentPage = e;

      this.staff_list_log(this.argsSH);
    },
    // 更改部门
    changeDep(val) {
      this.gourpArr.forEach((ele, idx) => {
        if (val == idx) {
          this.dep_id = ele.dep_id;
        }
      });
    },

    //编辑员工信息
    editSuff(val) {
      this.allsaffData.forEach((ele, idx) => {
        if (ele.id == val.id) {
          this.staffId = val.id;
          this.form.name = ele.name;
          this.selectGroup = ele.dep_name;
          this.dep_id = ele.dep_id;
        }
      });

      this.dialogFormVisible = true;
    },
    //审批通过
    passApprove(val) {
      var parms = {
        status: 2,
        idlist: val.id
      };
      this.$api.companyInfo
        .staff_access(parms)
        .then(res => {
          if (res.data.result == 0) {
            this.getdepInfo();
            this.$message.success("通过成功");
            var parms = {
              currentPage: 1,
              name: ""
            };
            this.staff_list_log(parms);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => Error(err));
    },
    //审批拒绝
    rejectApprove(val) {
      var parms = {
        status: 3,
        idlist: val.id
      };
      this.$api.companyInfo
        .staff_access(parms)
        .then(res => {
          this.$message.error("已拒绝");
          var parms = {
            currentPage: 1,
            name: ""
          };
          this.staff_list_log(parms);
        })
        .catch(err => Error(err));
    },
    //确认编辑人员
    confirmEdit() {
      var parms = {
        dep_id: this.dep_id,
        id: this.staffId,
        name: this.form.name
      };
      this.$api.companyInfo
        .staff_update(parms)
        .then(res => {
          if (res.data.result == 0) {
            this.$message({
              type: "success",
              message: "编辑成功!"
            });
            var parms = {
              currentPage: 1,
              name: ""
            };
            this.staff_list_log(parms);
          } else {
            this.$message.error(res.data.msg);
          }

          this.dialogFormVisible = false;
          this.allLoading = true;
          this.getAllList(this.args);
        })
        .catch(err => Error(err));
    },
    //新增部门
    addDep() {
      this.addDepent = true;
      this.form1.name = "";
    },
    //确认新增部门
    confirmAdd() {
      this.addDepent = false;
      var parm = {
        name: this.form1.name
      };
      this.$api.companyInfo
        .dep_add(parm)
        .then(res => {
          this.getdepInfo();
        })
        .catch(err => {
          Error(err);
        });
    },
    //删除员工
    deleteSuff(row) {
      if (row.id) {
        //单独删除
        this.$confirm("确认要移除该员工吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(res => {
            var parms = {
              idlist: row.id
            };
            this.$api.companyInfo
              .deleteStaff(parms)
              .then(res => {
                if (res.data.result == 0) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getdepInfo();
                  var parms = {
                    currentPage: 1,
                    name: ""
                  };
                  this.staff_list_log(parms);
                } else {
                  this.$message.error(res.data.msg);
                }
                this.allLoading = true;
                this.getAllList(this.args);
              })
              .catch(err => Error(err));
          })
          .catch(err => Error(err));
      } else {
        this.deleteStaff();
      }
    },

    //添加员工方式
    handleCommand(command) {
      //获取添加员工方式

      if (command == "scan") {
        this.$api.companyInfo
          .addStaff()
          .then(res => {
            if (res.data.result == 3) {
              this.$confirm(res.data.msg, "温馨提示", {
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
              return;
            }
            this.scanAdd = true;
            this.addStaffIMG = res.data.data.img;
            this.addStaffUrl = res.data.data.url;
          })
          .catch(err => Error(err));
      } else {
        this.$api.companyInfo
          .addStaff()
          .then(res => {
            if (res.data.result == 3) {
              this.$confirm(res.data.msg, "温馨提示", {
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
              return;
            }
            this.personLink = true;
            this.addStaffUrl = res.data.data.url;
            this.addStaffIMG = res.data.data.img;
          })
          .catch(err => Error(err));
      }
    },

    //切换tabs
    handleClick(tab) {
      this.activeName = tab.name;
      if (this.activeName == "first") {
        this.allLoading = true;
        this.getAllList(this.args);
      } else {
        this.SHLoading = true;
        this.staff_list_log(this.argsSH);
      }
    },

    //所有员工表的多选
    handleSelectionChange(val) {
      if (val.length != 0) {
        this.hasSelectAll = true;
        val.forEach((ele, idx) => {
          this.idList.push(Number(ele.id));
        });
      } else {
        this.hasSelectAll = false;
        this.idList = [];
      }
    },
    //审核员工的多选
    // handleSelectionChangeSH(val) {

    //   if (val.length != 0) {

    //     this.hasSelectAll = true;
    //     val.forEach((ele, idx) => {
    //       this.idList.push(Number(ele.id));
    //     });
    //   } else {
    //     this.hasSelectAll = false;
    //     this.idList = [];
    //   }
    // },

    //搜索课程
    searchCont(e) {
      this.argsSH.name = this.search;
      if (this.activeName == "first") {
        this.allLoading = true;
        this.getAllList(this.argsSH);
      } else {
        this.staff_list_log(this.argsSH);
      }
    },
    //确认转移
    saveShiftStaff() {
      this.shift = false;

      var set = this.uniq(this.idList);
      set = set.join(",");
      var parms = {
        idlist: set,
        dep_id: this.dep_id
      };
      this.$api.companyInfo
        .staff_change(parms)
        .then(res => {
          if (res.data.result == 0) {
            this.$message.success("转移成功");
          } else {
            this.$message.error(res.data.msg);
          }
          this.allLoading = true;
          this.getAllList(this.args);
        })
        .catch(err => Error(err));
    },
    //转移部门（批量）
    shiftdevelment() {
      //弹窗
      if (this.idList.length == 0) {
        this.$message.error("请至少选中一名员工");
        return;
      }
      this.shift = true;
    },
    //跳转添加账号页面
    toBuyCount() {
      this.$storage.set("historyPath", this.$route.fullPath);
      this.$router.push({
        path: "./buyLesson",
        query: {
          count: 1,
          onlyBuyCount: true
        }
      });
    },
    //编辑部门
    editDep() {
      if (!this.isClickTree) {
        this.$message.error("请选择一个部门");
        return;
      }
      this.EditDepent = true;
      this.isClickTree = false;
    },
    //确认编辑部门
    confirmEditDep() {
      var that = this;

      var parms = {
        dep_id: that.EditDepId,
        name: that.formdep.name
      };
      this.$api.companyInfo
        .dep_opt(parms)
        .then(res => {
          if (res.data.result == 0) {
            this.$message.success("编辑成功");
          } else {
            this.$message.error(res.data.msg);
          }
          this.EditDepent = false;
          this.getdepInfo();
          this.EditDepId = null;
        })
        .catch(err => Error(error));
    },
    // 获取部门信息
    getdepInfo() {
      this.$api.companyInfo
        .company()
        .then(res => {
          this.use_count = res.data.data.use_count;
          this.total_count = res.data.data.total_count;
          this.gourpArr = res.data.data.dep_groupby;
          this.specialArr = this._.cloneDeep(this.gourpArr)
          this.gourpArr.forEach((ele, idx) => {
            ele.dep_name = ele.dep_name + "  (" + ele.total + ")";
          });
          this.data[0].children = this.gourpArr;
        })
        .catch(err => Error(err));
    },
    deepClone(obj) {
      let objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === "object") {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            //判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === "object") {
              objClone[key] = deepClone(obj[key]);
            } else {
              //如果不是，简单复制
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    },
    //删除员工（批量）
    deleteStaff() {
      if (this.idList.length == 0) {
        this.$message.error("请至少选中一名员工");
        return;
      }
      this.$confirm("确认要移除该员工吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(res => {
          this.idList = this.uniq(this.idList);
          this.idList = this.idList.join(",");
          var parms = {
            idlist: this.idList
          };
          this.$api.companyInfo
            .deleteStaff(parms)
            .then(res => {
              if (res.data.result == 0) {
                this.getdepInfo();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message.error(res.data.msg);
              }
              this.allLoading = true;
              this.getAllList(this.args);
            })
            .catch(err => Error(err));
        })
        .catch(err => {
          Error(err);
        });
    },
    uniq(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    }
  },
  mounted() {
    if (this.$route.query.params == "SH") this.activeName = "second";
    this.getAllList(this.args);
    this.getdepInfo();
    // this.addStaff();
    this.staff_list_log(this.argsSH);
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.el-card {
  position: relative;
}
.box-card {
  // width: 100%;
  // height: 100%;
  // display: flex;
  // flex-direction: column;
  padding: 0px 30px;
  background: rgb(255, 255, 255);
  height: auto;
}
.wrap_card {
  // height: 100%;
  height: 100%;
  background: #fff;
  margin: 0 35px 70px 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.el-tabs {
  /deep/ .el-tabs__content {
    width: 100%;
  }
}
.el-tabs {
  width: 100% !important;
}
.el-tree {
  width: 180px;
}
.addOrEdit {
  position: absolute;
  top: 3px;
  color: rgba(62, 142, 253, 1);
  right: 0;
  span {
    cursor: pointer;
  }
}
.pos_edit {
  position: absolute;
  left: 180px;
  top: 4px;
  span {
    cursor: pointer;
    color: rgba(59, 140, 255, 1);
    font-size: 14px;
  }
}
.right_content {
  width: 83%;
  height: 100%;
  border-left: 1px solid #f1f1f1;
  margin-top: 55px;
  border-top: 2px solid #f1f1f1;
}
.add {
  cursor: pointer;
  color: rgba(59, 140, 255, 1);
  margin-left: 5px;
}
.pageination {
  margin: 0 auto;
  position: absolute;
  bottom: 40px;
  left: 50%;
}
.r_body {
  height: 60px;
  align-items: center;
  padding: 0 20px;
}
.canClick {
  color: rgba(64, 158, 255, 1);
  padding-left: 20px;
  cursor: pointer;
}
.el-pagination {
  // justify-content: center;
  // display: flex;
  // bottom: 45px;
  // padding: 20px 0;
  // position: absolute;
  // left: 50%;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-select {
  width: 100%;
}
.title_delage {
  display: flex;
  justify-content: space-between;
}
.flex_center {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 74px;
  margin-top: 20px;
}
.p_option {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
}
.d_link {
  margin: 40px 0;
  width: 100%;
  height: 60px;
  background-color: rgba(243, 243, 243, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
.block {
  margin-bottom: 50px;
  background-color: #fff;
  padding: 30px 0;
  display: flex;
  justify-content: center;
}
</style>