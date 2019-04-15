<template>
  <section style="padding:30px 35px;">
    <div style="padding:30px;background:#ffffff;">
      <ul class="ul1">
        <li class="box">
          <div class="left">
            <img :src="thumb" alt>
          </div>
          <div class="right">
            <h3 class="title">{{name}}</h3>
            <p class="desc">{{desc}}</p>
            <!-- <p class="tishi">
	                        <span class="span1">本课程共 {{course_count}} 节，管理员{{admin}}  于 {{assign_time}} 分配</span>
	                        <span class="span2"><strong>学习进度：</strong><em><i ></i></em> &nbsp;&nbsp;&nbsp;{{rate}}%</span>
            </p>-->
            <p class="attention">
              <span>适合人群：</span>
              {{usercat}}
            </p>
            <p class="attention">
              <span>课程目标：</span>
              {{learning_goals}}
            </p>
            <!-- <el-button style="margin-top:20px;" type="primary" @click="_allocationCourse" v-if="admin">分配课程</el-button> -->
          </div>
        </li>
      </ul>
    </div>
    <div class="course-list">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="课程列表" name="first">课程列表</el-tab-pane>
          <el-tab-pane label="课程介绍" name="second">课程介绍</el-tab-pane>
        </el-tabs>
      </template>
      <div class="tab1" v-if="isTabShow">
        <div class="left-wrap">
          <ul class="left">
            <li
              v-for="(item,index) in columnList"
              :key="item.id"
              @click="getCourse(item.id,index)"
              v-bind:class="[item.active ? 'activeClass' : '']"
            >
              <a href="javascript:;">
                <i class="el-icon-arrow-right"></i>
                <span>{{item.name}}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="demo-input-suffix">
            <el-input placeholder="请输入内容" v-model="searchValue" @keyup.enter.native="search">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
          </div>
          <div class="ul-wrap">
            <ul>
              <li
                v-for="(item,index) in courseList"
                :key="item.id"
                v-on:mouseover="colorHover($event,item.is_study_re)"
                v-on:mouseout="remove($event,item.is_study_re)"
                v-bind:class="item.licolor"
              >
                <span class="course-name">{{item.name}}</span>
                <div style="float:left;margin-left:100px;width:84px;height:100%;color:#3b8cff">
                  <span v-if="item.isSeen">您之前学到这儿</span>
                </div>
                <span class="teacher">讲师：{{item.teacher}}</span>
                <span class="time">时长：{{item.length}}</span>
                <span
                  class="startStudy"
                  v-bind:class="item.color"
                  @click="startvideo(item.course_id)"
                >{{item.is_study_re}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="editor" v-show="!isTabShow" style="width:100%;min-height:200px;" v-html="editor"></div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      thumb: "",
      usercat: "",
      learning_goals: "",
      activeName: "first",
      query: [],
      searchValue: "",
      columnList: [],
      package_id: "",
      thumb: "",
      name: "",
      desc: "",
      message: "",
      mubiao: "",
      courseList: [],
      catId: "", //当前的章节catId
      curCat: "", //当前的章节
      course_id: "",
      admin: true,
      isTabShow: true,
      editor: ""
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.name == "first") {
        this.isTabShow = true;
      } else if (tab.name == "second") {
        this.isTabShow = false;
      }
    },
    studyDeatil() {
      var params = {
        package_id: this.package_id
      };
      this.$api.person.studyDeatil(params).then(res => {
        console.log(res);
        if(res.data.result == 0){
          if (res.data.data) {
            this.thumb = res.data.data.package.thumb;
            this.name = res.data.data.package.name;
            this.desc = res.data.data.package.desc;
            this.learning_goals = res.data.data.package.learning_goals;
            this.usercat = res.data.data.package.usercat;
            this.columnList = res.data.data.cates;
            this.catId = res.data.data.catid;
            this.course_id = res.data.data.course_id;
            this.editor = res.data.data.package.intro;
            console.log('1111111111111111111111111111111111111111111intro',this.intro);
            this.getCourse(this.catId);
          }
        }else{
          this.$message.error(res.data.msg);
        }
        
      });
    },
    getCourse(id) {
      //id是章节id
      const self = this;
      self.$tools.startLoding();
      //点击的当前章节高亮
      for (let i = 0; i < this.columnList.length; i++) {
        if (this.columnList[i].id == id) {
          this.columnList[i].active = true;
        } else {
          delete this.columnList[i].active;
        }
      }
      this.searchValue = ""; //选择章节id时清空搜索框
      var params = {
        package_id: this.package_id,
        catid: id,
        name: this.searchValue
      };
      this.$api.person.studyDeatilList(params).then(res => {
        console.log(res);
        if(res.data.result == 0){
          if (res.data.data) {
            this.courseList = res.data.data;
            console.log(this.courseList);
            for (let i = 0; i < this.courseList.length; i++) {
              if (this.courseList[i].is_study == 0) {
                this.courseList[i].is_study_re = "开始学习";
                this.courseList[i].color = "color2"; //开始学习字体颜色
              } else if (this.courseList[i].is_study == 1) {
                this.courseList[i].is_study_re = "重新学习";
                this.courseList[i].color = "color1"; //重新学习字体颜色
              }
              if (this.course_id == this.courseList[i].course_id) {
                this.courseList[i].isSeen = true;
                this.courseList[i].is_study_re = "继续学习";
                this.courseList[i].color = "color3";
              }
            }
          } else {
            this.courseList = [];
            this.$message("改分类下没有数据，请联系运营修改次分类");
          }
        }else{
          this.$message.error(res.data.msg);
        }
        
        self.$tools.closeLoading();
      });
    },
    search() {
      if (this.searchValue == "") {
        this.$message("请输入搜索关键词");
        return;
      }
      var params = {
        package_id: this.package_id,
        catid: "",
        name: this.searchValue
      };
      this.$api.person.studyDeatilList(params).then(res => {
        if(res.data.result == 0){
          if (res.data.data) {
            this.courseList = res.data.data; //搜索到的课程
            for (let i = 0; i < this.columnList.length; i++) {
              for (var attr in this.columnList[i]) {
                if (attr == "active") {
                  delete this.columnList[i].active;
                }
              }
            }
            for (var i = 0; i < this.courseList.length; i++) {
              for (var j = 0; j < this.columnList.length; j++) {
                if (this.courseList[i].catid == this.columnList[j].id) {
                  this.columnList[j].active = true;
                  continue;
                } else if (j == this.columnList.length - 1) {
                  if (this.courseList[i].catid == this.columnList[j].id) {
                    this.columnList[j].active = true;
                  } else {
                    delete this.columnList[j].active;
                  }
                }
              }
            }
            for (let i = 0; i < this.courseList.length; i++) {
              if (this.courseList[i].is_study == 0) {
                this.courseList[i].is_study_re = "开始学习";
                this.courseList[i].color = "color2"; //开始学习字体颜色
              } else if (this.courseList[i].is_study == 1) {
                this.courseList[i].is_study_re = "重新学习";
                this.courseList[i].color = "color1"; //重新学习字体颜色
              }
              if (this.course_id == this.courseList[i].course_id) {
                this.courseList[i].isSeen = true;
                this.courseList[i].is_study_re = "继续学习";
                this.courseList[i].color = "color3";
              }
            }
          }else{
            this.courseList = [];
          }
        }else{
          this.$message.error(res.data.msg);
        }
        
      });
    },
    colorHover($event, is_study_re) {
      if (is_study_re == "开始学习") {
        $event.currentTarget.className = "licolor2";
      } else {
        $event.currentTarget.className = "licolor1";
      }
    },
    remove($event, is_study_re) {
      if (is_study_re == "开始学习") {
        $event.currentTarget.className = "";
      } else {
        $event.currentTarget.className = "";
      }
    },
    startvideo(course_id) {
      console.log("course_id111111", course_id);
      this.juageLesson(course_id);
    },
    //判断课程是否为光华的
    juageLesson(course_id) {
      var parms = {
        package_id: this.package_id,
        course_id: course_id
      };
      this.$api.lessonCenter
        .playVideo(parms)
        .then(res => {
          if (res.data.data.type == 2) {
            console.log(res.data.data.redirect_url);
			     var href = res.data.data.redirect_url;
			     window.open(href)
          } else if (res.data.data.type == 1) {
            this.$router.push({
              path: "studyVideo",
              query: { package_id: this.package_id, course_id: course_id }
            });
          }
        })
        .catch(err => {
          Error(err);
        });
    }
  },
  mounted() {
    this.package_id = this.$route.query.package_id;
    this.studyDeatil();
    //判断是否是管理员
    if (this.$store.state.info.role == "admin") {
      this.admin = true;
    } else {
      this.admin = false;
    }
    this.selectAdmin = false;
  }
};
</script>
<style scoped lang="less">
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";
.box {
  zoom: 1;
}
.box:after {
  content: "";
  display: block;
  overflow: hidden;
  clear: both;
}
ul,
li {
  width: 100%;
}
.ul1 li {
  padding-top: 30px;
  padding-bottom: 31px;
  .left {
    float: left;
    width: 260px;
    height: 164px;
    background: green;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    float: left;
    margin-left: 30px;
    max-width: 500px;
    .title {
      padding-top: 9px;
      font-size: 22px;
      line-height: 22px;
      color: #333333;
    }
    .desc {
      width: 780px;
      margin-top: 18px;
      font-size: 12px;
      line-height: 18px;
      color: #999999;
      white-space: normal;
    }
    .tishi {
      display: flex;
      font-size: 12px;
      line-height: 28px;
      color: #333333;
      .span1 {
      }
      .span2 {
        display: flex;
        margin-left: 28px;
        width: 300px;
        strong {
          font-weight: normal;
        }
        em {
          display: inline-block;
          width: 100px;
          height: 4px;
          border-radius: 2px;
          background: #f0f0f0;
          margin-left: 10px;
          margin-top: 12px;
          i {
            display: block;
            width: 80px;
            height: 100%;
            border-radius: 2px;
            background: #53c14b;
          }
        }
      }
    }
    .attention {
      margin-top: 10px;
      height: auto;
      font-size: 12px;
      line-height: 18px;
      color: #333333;
      span {
        color: #999999;
      }
    }
    .study {
      margin-top: 20px;
    }
  }
}
.course-list {
  height: auto;
  margin-top: 10px;
  background: #ffffff;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 94px;
  .tab1 {
    overflow: hidden;
    .left-wrap {
      float: left;
      width: 202px;
      padding-right: 6px;
      border-right: 1px solid #eeeeee;
    }
    .left {
      padding-top: 20px;
      height: 372px;
      overflow-y: scroll;
      li {
        width: 132px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 30px;
        font-size: 12px;
        color: #666666;
        span {
          margin-left: 12px;
        }
        a {
          color: #666666;
        }
        &.activeClass {
          a {
            color: #3b8cff;
          }
        }
      }
    }
    .right {
      float: left;
      .demo-input-suffix {
        width: 250px;
        margin-left: 30px;
        margin-top: 30px;
      }
      .ul-wrap {
        margin-top: 18px;
        height: 400px;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      ul {
        // overflow-y:scroll;

        width: 1000px;
        li {
          width: 1000px;
          height: 36px;
          line-height: 36px;
          padding-left: 30px;
          padding-right: 60px;
          color: #666666;
          cursor: pointer;
          &:nth-child(2n + 1) {
            background: #f9f9f9;
          }
          .course-name {
            float: left;
            width: 236px;
            height: 100%;
            line-height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .prosess {
            float: left;
            width: 84px;
            margin-left: 170px;
            font-size: 12px;
            color: #3b8cff;
          }
          .teacher {
            float: left;
            width: 132px;
            margin-left: 30px;
            color: #b2b2b2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .time {
            float: left;
            width: 84px;
            margin-left: 30px;
            color: #b2b2b2;
          }
          .startStudy {
            float: left;
            height: 26px;
            width: 74px;
            margin-top: 5px;
            line-height: 26px;
            color: #2a5da6;
            text-align: center;
            border-radius: 3px;
            margin-left: 46px;
          }
          &.licolor1 {
            background-color: #ebf3ff;
            .startStudy {
              float: left;
              height: 26px;
              width: 74px;
              margin-top: 5px;
              line-height: 26px;
              color: #2a5da6;
              text-align: center;
              border-radius: 3px;
              margin-left: 46px;
              background: rgba(59, 140, 255, 0.9);
              color: #ffffff;
            }
          }
          &.licolor2 {
            background-color: #fff5e5;
            .startStudy {
              float: left;
              height: 26px;
              width: 74px;
              margin-top: 5px;
              line-height: 26px;
              color: #2a5da6;
              text-align: center;
              border-radius: 3px;
              margin-left: 46px;
              background: rgba(255, 153, 0, 0.9);
              color: #ffffff;
            }
          }
          .color1 {
            color: #2a5da6;
          }
          .color2 {
            color: #ee8101;
          }
          .color3 {
            color: #ffffff;
            background: rgba(59, 140, 255, 0.9);
          }
          .color4 {
            color: #ffffff;
            background: rgba(255, 153, 0, 0.9);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1580px) {
  .course-list {
    .tab1 {
      .left-wrap {
        width: 150px;
      }
      .left {
        li {
          width: 144px;
        }
      }
      .right {
        ul {
          width: 780px;
          li {
            width: 720px;
            padding-left: 10px;
            padding-right: 20px;
            .course-name {
              width: 100px;
            }
            .prosess {
              margin-left: 10px;
            }
            .teacher {
              float: left;
              width: 132px;
              margin-left: 10px;
              color: #b2b2b2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .time {
              float: left;
              width: 84px;
              margin-left: 30px;
              color: #b2b2b2;
            }
            .startStudy {
              float: left;
              height: 26px;
              width: 74px;
              margin-top: 5px;
              line-height: 26px;
              color: #2a5da6;
              text-align: center;
              border-radius: 3px;
              margin-left: 26px;
            }
            &.licolor1 {
              background-color: #ebf3ff;
              .startStudy {
                float: left;
                height: 26px;
                width: 74px;
                margin-top: 5px;
                line-height: 26px;
                color: #2a5da6;
                text-align: center;
                border-radius: 3px;
                margin-left: 26px;
                background: rgba(59, 140, 255, 0.9);
                color: #ffffff;
              }
            }
            &.licolor2 {
              background-color: #fff5e5;
              .startStudy {
                float: left;
                height: 26px;
                width: 74px;
                margin-top: 5px;
                line-height: 26px;
                color: #2a5da6;
                text-align: center;
                border-radius: 3px;
                margin-left: 26px;
                background: rgba(255, 153, 0, 0.9);
                color: #ffffff;
              }
            }
            .color1 {
              color: #2a5da6;
            }
            .color2 {
              color: #ee8101;
            }
            .color3 {
              color: #ffffff;
              background: rgba(59, 140, 255, 0.9);
            }
            .color4 {
              color: #ffffff;
              background: rgba(255, 153, 0, 0.9);
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1300px) and (max-width: 1580px) {
  .course-list {
    .tab1 {
      .left-wrap {
        width: 120px;
      }
      .left {
        li {
          width: 114px;
        }
      }
      .right {
        ul {
          width: 825px;
          li {
            width: 820px;
            padding-left: 15px;
            padding-right: 30px;
            .course-name {
              width: 200px;
            }
            .prosess {
              margin-left: 15px;
            }
            .teacher {
              float: left;
              width: 130px;
              margin-left: 10px;
              color: #b2b2b2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .time {
              float: left;
              width: 90px;
              margin-left: 20px;
              color: #b2b2b2;
            }
            .startStudy {
              float: left;
              height: 26px;
              width: 74px;
              margin-top: 5px;
              line-height: 26px;
              color: #2a5da6;
              text-align: center;
              border-radius: 3px;
              margin-left: 36px;
            }
            &.licolor1 {
              background-color: #ebf3ff;
              .startStudy {
                float: left;
                height: 26px;
                width: 74px;
                margin-top: 5px;
                line-height: 26px;
                color: #2a5da6;
                text-align: center;
                border-radius: 3px;
                margin-left: 36px;
                background: rgba(59, 140, 255, 0.9);
                color: #ffffff;
              }
            }
            &.licolor2 {
              background-color: #fff5e5;
              .startStudy {
                float: left;
                height: 26px;
                width: 74px;
                margin-top: 5px;
                line-height: 26px;
                color: #2a5da6;
                text-align: center;
                border-radius: 3px;
                margin-left: 36px;
                background: rgba(255, 153, 0, 0.9);
                color: #ffffff;
              }
            }
            .color1 {
              color: #2a5da6;
            }
            .color2 {
              color: #ee8101;
            }
            .color3 {
              color: #ffffff;
              background: rgba(59, 140, 255, 0.9);
            }
            .color4 {
              color: #ffffff;
              background: rgba(255, 153, 0, 0.9);
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1200px) and (max-width: 1300px) {
  .course-list {
    .tab1 {
      .left-wrap {
        width: 120px;
      }
      .left {
        li {
          width: 114px;
        }
      }
      .right {
        ul {
          width: 700px;
          li {
            width: 700px;
            padding-left: 20px;
            padding-right: 30px;
            .course-name {
              width: 120px;
            }
            .prosess {
              margin-left: 5px;
            }
            .teacher {
              float: left;
              width: 100px;
              margin-left: 10px;
              color: #b2b2b2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .time {
              float: left;
              width: 84px;
              margin-left: 20px;
              color: #b2b2b2;
            }
            .startStudy {
              float: left;
              height: 26px;
              width: 74px;
              margin-top: 5px;
              line-height: 26px;
              color: #2a5da6;
              text-align: center;
              border-radius: 3px;
              margin-left: 46px;
            }
            &.licolor1 {
              background-color: #ebf3ff;
              .startStudy {
                float: left;
                height: 26px;
                width: 74px;
                margin-top: 5px;
                line-height: 26px;
                color: #2a5da6;
                text-align: center;
                border-radius: 3px;
                margin-left: 46px;
                background: rgba(59, 140, 255, 0.9);
                color: #ffffff;
              }
            }
            &.licolor2 {
              background-color: #fff5e5;
              .startStudy {
                float: left;
                height: 26px;
                width: 74px;
                margin-top: 5px;
                line-height: 26px;
                color: #2a5da6;
                text-align: center;
                border-radius: 3px;
                margin-left: 46px;
                background: rgba(255, 153, 0, 0.9);
                color: #ffffff;
              }
            }
            .color1 {
              color: #2a5da6;
            }
            .color2 {
              color: #ee8101;
            }
            .color3 {
              color: #ffffff;
              background: rgba(59, 140, 255, 0.9);
            }
            .color4 {
              color: #ffffff;
              background: rgba(255, 153, 0, 0.9);
            }
          }
        }
      }
    }
  }
}
::-webkit-scrollbar {
  background: none;
  width: 3px;
}
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #eeeeee;
}
::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 2px;
  background: none;
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
  }
}
.el-tab-pane {
  display: none;
}
</style>

