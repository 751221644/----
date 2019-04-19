<template>
  <div class="wrap_card">
    <el-card class="box-card" body-style=" height: 100%;">
      <div class="text item l_r_wrap">
        <div class="left">
          <div class="title_video">
            <span style="color:white">{{course_name}}</span>
          </div>
          <div >
            <div class="player-container">
              <video-player
                ref="videoPlayer"
                class="vjs-custom-skin"
                :options="playerOptions"
              ></video-player>

              <el-select v-model="value" @change="changeQuelity" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="right">
          <div >
            <el-row class="tac">
              <el-col :span="12">
                <el-menu
                  :default-openeds="[courseId+'']"
                  :default-active="currentId+''"
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose"
                  background-color="#000"
                  text-color="#fff"
                  unique-opened
                  active-text-color="#ffd04b"
                >
                  <template v-for="(item,idx) in cateArr">
                    <el-submenu :index="idx+''">
                      <template slot="title">
                        <span>{{item.name}}</span>
                      </template>
                      <el-menu-item
                        @click="handleChange(ix)"
                        v-for="(child,ix) in item.course_list"
                        :key="ix+''"
                        :index="ix+''"
                      >{{child.name}}</el-menu-item>
                    </el-submenu>
                  </template>
                </el-menu>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import { log } from 'util';

//引入hls.js
export default {
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        controls: true, //控制条
        preload: "auto", //视频预加载
        muted: false, //默认情况下将会消除任何音频。
        loop: false, //导致视频一结束就重新开始。
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "application/x-mpegURL",
            src: "https://1251763412.vod2.myqcloud.com/4f5c9e67vodtransgzp1251763412/cc849ebf5285890784419639486/v.f220.m3u8?t=5cb9a729&exper=0&us=CN7YI8XCPwb4&sign=2baaf6bffd1ba2827552fc2dcdddd477"
          }
        ],
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      dialogFormVisible: false,
      User_num: 0,
      packageInfo: {},
      userId_price: 365.0,
      currentTime: null,
      lessonList: [], //课程列表
      formLabelWidth: "",
      options: [
        {
          value: 0,
          label: "标清 "
        },
        {
          value: 1,
          label: "高清"
        },
        {
          value: 2,
          label: "超清"
        }
      ],
      course_List: [],
      cateArr:[],
      isApply: true,
      value: 0,
      package_id: 2,
      enp_people: {},
      VideoArr: [],
      childArr: [],
      courseId: null,
      currentId: null,
      course_name: "",
      outId: null,
      inId: null
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  mounted() {
    this.playVideo()

  },
  methods: {
    playVideo(args){
   
    var parms = {
      package_id: this.$route.query.package_id,
      course_id: this.$route.query.course_id
    };
     if(args) parms = args
    this.$api.lessonCenter
      .playVideo(parms)
      .then(res => {
        this.course_list = res.data.data.cates;
        this.cateArr = res.data.data.cates
        
        this.course_list.forEach((ele, idx) => {
          if (ele.id == res.data.data.course.catid) {
            this.courseId = idx; //外层菜单展开的index
            ele.course_list.forEach((el, ix) => {
              if (el.course_id == parms.course_id) {
                this.currentId = ix; //子菜单的当前激活index
                this.course_name = el.name;
              }
            });
          }
        });
        //视频的清晰度数组
             this.VideoArr = res.data.data.course.play_urls;
        //默认视频src是标清
             this.playerOptions.sources[0].src = this.VideoArr[0]
            //  this.player.src(this.VideoArr[0]);
            
            //  this.player.play();
      })
      .catch(err => {
        Error(err);
      });
    },
    handleOpen(key, keyPath) {
      this.outId = key;
    },
    handleClose(key, keyPath) {
    },
    applyView() {
      this.dialogFormVisible = true;
    },
    //切换课程
    handleChange(value) {
      const currentLesson = this.course_list[0].course_list[value]
      this.course_name = currentLesson.course_name
      var args = {
        package_id :currentLesson.package_id,
        course_id  :currentLesson.course_id
      }
      this.playVideo(args)
    },
    changeQuelity(e) {
      let _time = this.$refs.videoPlayer.player.currentTime();
      const that = this;
      that.VideoArr.forEach((ele, idx) => {
        if (e == idx) {
          that.player.src(ele);
          that.player.load();
          that.player.currentTime(_time);
        }
      });
        that.player.load();
        that.player.play();
    },
  }
};
</script>
<style  lang="less" scoped>
@import url("../../theme/flex.less");
.element::-webkit-scrollbar { width: 0 !important }
.text {
  font-size: 14px;
  flex: 1;
  display: flex;
}

.title_blue {
  width: 3px;
  height: 14px;
  background-color: #3b8cff;
}
.item {
  margin-bottom: 18px;
}
.right_info {
  padding-left: 30px;
}
.desc {
  font-family: "MicrosoftYaHei";
  font-size: 12px;
  color: #999;
}
.clearfix {
  padding: 30px;
  display: flex;
  flex: 0.6;
}
.lineHeight {
  line-height: 30px;
}
.value {
  font-family: "MicrosoftYaHei";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  color: #333;
}
.bto_ye {
  width: 780px;
  height: 56px;
  background-color: #fffaf1;
  border: solid 1px #fff1da;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
}
.box-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bodyStyle {
  height: 800px;
}
.wrap_card {
  height: 100%;
  margin: 0 60px 60px 60px;
}
.left {
  width: 883px;
  padding: 30px;
  padding-right: 0;
}
.right {
  margin-top: 30px;
  overflow-y: auto;
  height: 535px;
  overflow-x:hidden;
}
h1 {
  font-size: 22px;
  color: #333333;
}
.small_Y {
  font-family: "PingFang-SC-Bold";
  font-size: 14px;
  color: #fd4948;
}
.img_tump {
  width: 300px;
  height: 158px;
}
.coutPrice {
  font-family: "PingFang-SC-Bold";
  font-size: 28px;
  color: #fd4948;
}
.btn_buy {
  background-color: #ff9900;
  color: white;
  width: 110px;
  height: 36px;
  border-radius: 5px;
  border: none;
  margin-left: 40px;
}
.line {
  width: 100%;
  height: 1px;
  background-color: #999;
  position: absolute;
  bottom: 50%;
}
.l_r_wrap {
  width: 100%;
  height: 100%;
      display: flex;
    justify-content: space-between;
}
.lessonList {
  font-family: "PingFang-SC-Regular";
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
}
.try_view {
  position: absolute;
  z-index: 3;
  background-color: #ff9900;
  left: 50%;
  top: 50%;
  color: white;
  width: 110px;
  height: 36px;
  border-radius: 5px;
  border: none;
  margin-left: 40px;
  left: 29%;
  top: 42%;
}
.player-container {
  position: relative;
}
.warn {
  color: rgba(255, 192, 118, 1);
}
/* .el-dialog__wrapper{
  /deep/ .el-dialog__body{

  }
} */
.el-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-form-item {
  display: flex !important;
}
.el-form {
  padding-top: 30px;
}
.el-select {
}
.el-menu {
  /deep/.el-menu-item {
    // color:#fff!important
  }
}
.el-menu-vertical-demo {
  width: 600px !important;
}
.wrap_card {
  /deep/ .el-card__body {
    background-color: rgba(94, 94, 94, 1);
  }
}
.el-menu {
  border-right: none !important;
}
.title_video {
  background-color: rgba(35, 35, 35, 1);
  height: 40px;
  align-items: center;
  display: flex;
  padding-left: 20px;
}
</style>
