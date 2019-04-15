<template>
  <div class="container">
    <div class="header">
      <span>按职能：</span>
      <span
        class="mar-l"
        :class="item.isActive?'changeColor':'defaultColor'"
        v-for="(item,index) in classifyArr"
        @click.stop.prevent="tabCut(index,item)"
      >{{item.name}}</span>
    </div>
    <div class="filter">
      <div class="flex just-between head">
        <div>
          <el-button plain :autofocus="isFocus" @click.stop.prevent="updataTime">
            更新时间
            <i class="el-icon-d-caret el-icon--right"></i>
          </el-button>
          <el-button plain @click.stop.prevent="buyCount">
            购买量
            <i class="el-icon-d-caret el-icon--right"></i>
          </el-button>
        </div>
        <div style="width:308px">
          <el-input
            placeholder="请输入课程包名称进行搜索"
            v-model="search"
            @change="searchCont"
            suffix-icon="el-icon-search"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="lesson_wrap" v-for="(item,index) in lessonArr">
        <div
          @click.stop.prevent="toLessonDetail(itm.id)"
          class="lessonCenter flex column align-c align-between"
          v-for="(itm,idx) in lessonArr[index]"
        >
          <div
            class="item-lesson"
            :style="{backgroundImage:'url(' + itm.thumb + ')', backgroundRepeat:'no-repeat'}"
          ></div>
          <div class="lesson-info">
            <p class="lesson-count">共{{itm.course_count}}节课</p>
            <p v-if="itm.is_free!=1" class="lesson-price">￥{{itm.favprice}}</p>
            <p v-else class="lesson-price">免费</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bot_pagination">
      <el-pagination
        @current-change="currPage"
        background
        layout="prev, pager, next"
        :total="totalPages"
        style="padding:5vh 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  data() {
    return {
      sholeId: null,
      isFocus: true, //第一个默认聚焦
      classifyArr: [], //课程类型数组
      cates: 0, //分类id
      timeorder: 1, //创建时间排序 1降 2升
      buyorder: 1, //按购买量排序   1降 2升
      // currentPage: 1, //当前页数
      totalPages: null, //总页数
      lesson: {}, //所有课程
      search: "", //搜素课程
      padBottom: 0,
      sort: [
        { updataTime: true, sortStatus: true, state: 1 },
        {
          buyCount: false,
          sortStatus: true,
          state: 3
        }
      ], //排序
      // buyCount:false
      args: {
        currentPage: 1
      },
      lessonArr: [],
      all: {
        id: "0",
        name: "全部"
      },
      isBuyMsg: ""
    };
  },
  methods: {
    //切换课程类型
    tabCut(index, itm) {
      this.classifyArr.forEach((item, idx) => {
        item.index == index ? (item.isActive = true) : (item.isActive = false);
      });
      this.cates = itm.id;
      var parms = {
        cate_id: itm.id,
        timeorder: this.sort[0].state,
        buyorder: this.sort[1].state
      };
      this.getLessonData(parms);
    },
    //搜索课程
    searchCont(e) {
      var parms = {
        search_name: e
      };
      this.getLessonData(parms);
    },
    //分页
    currPage(e) {
      this.args.currentPage = e;
      this.getLessonData(this.args);
    },
    //分割数组
    sliceArray(array, size) {
      var result = [];
      for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
      }
      return result;
    },
    //获取课程信息
    getLessonData(args) {
      const parms = {
        timeorder: args.timeorder,
        buyorder: args.buyorder,
        page: args.currentPage,
        cate_id: args.cate_id,
        search_name: args.search_name
      };
      this.$api.lessonCenter
        .lesson(parms)
        .then(res => {
          this.lesson = res.data.data.data;
          if (res.data.data.data.count == "0") {
            this.lessonArr = [];
            this.totalPages = 10;
          } else {
            this.totalPages = res.data.data.data.pages * 10;
            this.lessonArr = this.sliceArray(this.lesson.data, 4);
          }
          //初始化分类列表，判断为了避免再次调用被覆盖
          if (!args.cate_id) {
            res.data.data.cates.unshift(this.all);
            res.data.data.cates.forEach((item, idx) => {
              item.index = idx;
              item.index == 0
                ? (item.isActive = true)
                : (item.isActive = false);
            });
            this.classifyArr = res.data.data.cates;
          }
        })
        .catch(err => {});
    },
    //判断是否购买该课程包
    // judgeLessonBuy(id) {
    //   var parms = {
    //     package_id: id
    //   };
    //   this.$api.lessonCenter
    //     .judgeLessonBuy(parms)
    //     .then(res => {
    //       console.log("data", res.data);
    //       this.isBuyMsg = res.data.msg;
    //       this.$api.lessonCenter
    //         .getCurrentLesson(parms)
    //         .then(res => {
    //           var lessArr = [];
    //           lessArr = res.data.data.package.play_url;
    //           //去播放内页
    //           // this.$router.push({
    //           //   path: "./studyVideo",
    //           //   query: {
    //           //     package_id: id,
    //           //     isBuyLesson: res.data.data,
    //           //     lessArr: lessArr,
    //           //     msg: this.isBuyMsg
    //           //   }
    //           // });

    //         })
    //         .catch(err => {
    //           Error(err);
    //         });
    //     })
    //     .catch(err => {
    //       Error(err);
    //     });
    // },

    //跳转到课程详情
    toLessonDetail(id) {
      this.$router.push({
        path: "./lessonInfo",
        query: {
          package_id: id
        }
      });
    },
    //按更新时间
    updataTime() {
      this.sort[0].updataTime = true;
      this.sort[0].buyCount = false;
      if (!this.sort[0].updataTime) {
        this.sort[0].state = 3;
      } else {
        this.sort[0].sortStatus = !this.sort[0].sortStatus;
        this.sort[0].sortStatus
          ? (this.sort[0].state = 1)
          : (this.sort[0].state = 2);
      }
      var parms = {
        timeorder: this.sort[0].state,
        buyorder: 3,
        cate_id: this.cates,
        currentPage: 1
      };
      this.getLessonData(parms);
    },
    // 按购买量
    buyCount() {
      this.sort[1].updataTime = false;
      this.sort[1].buyCount = true;
      if (!this.sort[1].buyCount) {
        this.sort[1].state = 3;
      } else {
        this.sort[1].sortStatus = !this.sort[1].sortStatus;
        this.sort[1].sortStatus
          ? (this.sort[1].state = 1)
          : (this.sort[1].state = 2);
      }
      var parms = {
        timeorder: 3,
        buyorder: this.sort[1].state,
        cate_id: this.cates,
        currentPage: 1
      };
      this.getLessonData(parms);
    },
    //获取登录角色
    getrole(){

    }
  },
  mounted() {
    // console.log('this.', this.$route.query);
    var parm = {
      currentPage: 1,
      timeorder: 1,
      buyorder: 3,
      cate_id: 0,
      search_name: ""
    };
    this.getrole();
    this.getLessonData(parm); //获取课程中心数据
  }
};
</script>
 <style lang="less" scoped>
@import url("../../theme/flex.less");
.wrap {
  width: 1160px;
  margin: 0 auto;
}
.container {
  width: auto;
  min-width: 990px;
  height: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f1f1f1;
}
.changeColor {
  color: #3b8cff;
}
.head {
  .mar-t(25px);
}
.filter {
  width: auto;
  min-width: 1160px;
}
.header {
  width: auto;
  min-width: 1160px;
  // height: 44px;
  padding: 11px 0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  span {
    // margin-left: 25px;
    .mar-l(25px);
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
  }
}
.lesson_wrap {
  // width: 95%;
  display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  .mar-t(20px);
}

.lessonCenter {
  cursor: pointer;
  .mar-r(30px);
}

.item-lesson {
  width: 267px;
  height: 164px;
  background-color: #6d81a8;
}
.lesson-info {
  width: 267px;
  justify-content: space-between;
  display: flex;
  height: 40px;
  font-size: 14px;
  background-color: #ffffff;
  .lesson-count {
    .mar-l(8px);
    display: flex;
    align-items: center;
  }
  .lesson-price {
    .mar-r(8px);
    display: flex;
    align-items: center;
  }
}
</style>
