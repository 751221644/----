<template>
  <div class="wrap_card">
    <el-card class="box-card" body-style=" height: 100%;">
      <div slot="header" class="clearfix">
        <img class="img_tump" :src="packageInfo.thumb" alt>
        <div class="right_info">
          <div>
            <h1>{{packageInfo.name}}</h1>
          </div>
          <div class="lineHeight">
            <p class="desc">{{packageInfo.desc}}</p>
          </div>
          <div class="lineHeight">
            <span class="desc">适合人群：</span>
            <span>{{packageInfo.usercat}}</span>
          </div>
          <div class="lineHeight">
            <span class="desc">课程目标：</span>
            <span>{{packageInfo.learning_goals}}</span>
          </div>
          <div class="lineHeight flex" v-if="buttonMsg=='立即购买'">
            <div>
              <span class="desc">课程价格：</span>
              <span style="font-size:14px">￥{{packageInfo.favprice}}/年</span>
              <img
                style="width:50px;height:15px; margin-left:2px"
                src="https://static.hrloo.com/hrloo56/elp/icon_01.png"
                alt
              >
            </div>
            <div style="margin-left:20px; position:relative">
              <span class="desc">市场价:</span>
              <span class="desc">￥{{packageInfo.oriprice}}/年</span>
              <div class="line"></div>
            </div>
          </div>

          <div class="lineHeight" v-if="buttonMsg=='立即购买'">
            <span class="desc">课程分配：</span>
            <span>您当前可分配给</span>
            <span style="color:#fd4948">{{packageInfo.limit}}</span>
            <span>名员工学习</span>
            <span style="margin-left:20px;">增加账号</span>
            <el-input-number
              size="small"
              v-model="User_num"
              @change="handleChange"
              :min="0"
              label="描述文字"
            ></el-input-number>
            <span class="desc" style="margin-left:10px">账号价格：￥：{{childCountP}}/个/年</span>
          </div>
          <div class="bto_ye" v-if="buttonMsg=='立即购买'">
            <span class="desc">金额总计：</span>
            <div style="    padding-bottom: 9px;">
              <span class="small_Y">￥</span>
              <span class="coutPrice">{{countPrice}}</span>
            </div>
            <el-button class="btn_buy" @click.stop.prevent="buyLesson">{{buttonMsg}}</el-button>
            <span class="desc" style="margin-left:20px">温馨提示：本课程可提供开具发票</span>
          </div>

          <div class="bto_allot" v-if="buttonMsg=='立即分配'">
            <el-button class="btn_allot" @click.stop.prevent="allotLesson">{{buttonMsg}}</el-button>
            <span class="color_p">有效期至:{{end_time}}</span>
            <span class="color_p" style=" margin-left:20px">您当前可分配</span>
            <span>{{packageInfo.limit}}</span>
            <span class="color_p">名员工学习</span>
            <span class="canClick" @click="toBuyCount">增加账号</span>
          </div>
          <div class="bto_allot" v-if="buttonMsg=='已经下架'">
            <span style="font-size:16px">该商品已下架</span>
          </div>

          <div class="bto_allot" v-if="buttonMsg=='重新购买'">
            <el-button class="btn_allot" @click.stop.prevent="allotLesson">{{buttonMsg}}</el-button>
            <span>该商品已过期,请重新购买</span>
          </div>

          <div class="bto_allot" v-if="buttonMsg=='立即领取'">
            <el-button class="btn_allot" @click.stop.prevent="receiveLesson">{{buttonMsg}}</el-button>
            <span>该商品免费</span>
          </div>
        </div>
      </div>
      <div class="text item l_r_wrap">
        <div class="left">
          <div class="flex align-c" style="padding-bottom:20px">
            <div class="title_blue"></div>
            <span style="margin-left:10px;font-size: 16px;">课程介绍</span>
          </div>
          <el-dialog title="申请课程试看" :visible.sync="dialogFormVisible">
            <span class="warn">完善信息，免费获取专属顾问服务，为您的企业提供专业的配客方案</span>

            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="企业名称" prop="c_name">
                <el-input v-model="ruleForm.c_name" placeholder="请输入企业名称"></el-input>
              </el-form-item>
              <el-form-item label="企业规模" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域" style="width:100%">
                  <el-option
                    v-for="(value, key) of enp_people"
                    :key="key"
                    :label="value"
                    :value="key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="您的姓名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入您的姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="phone">
                <el-input verify phone v-model="ruleForm.phone" placeholder="请输入您的联系电话"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm',ruleForm)">确 定</el-button>
            </div>
          </el-dialog>
          <allotCourse ref="allotCourseFn"></allotCourse>

          <div v-if="packageInfo.course_id!=0">
            <div class="player-container">
              <video-player
                ref="videoPlayer"
                style="	width: 644px;height: 362px;"
                class="vjs-custom-skin"
                :options="playerOptions"
              ></video-player>
              <div class="mc" v-if="isApply"></div>
              <el-button class="try_view" v-if="isApply" @click.stop.prevent="applyView">申请试看</el-button>

              <div></div>
              <el-select
                v-model="value"
                @change="changeQuelity"
                :disabled="isApply"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div v-html="intro" style="margin-top:40px"></div>
        </div>
        <div class="right">
          <div class="flex align-c" style="padding-bottom:20px">
            <div class="title_blue"></div>
            <span style="margin-left:10px;font-size: 16px;">课程列表</span>
          </div>
          <div v-for="(item,index) in lessonList" class="lessonList">
            <div>
              <span>{{index<9?'0'+Number(index+1):Number(index+1)}}-</span>
              <span>{{item.name}}</span>
            </div>
            <span style="color:#999999">{{item.courseCount}}节</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import allotCourse from "../../components/company/allotCourse";
import { Message } from "element-ui";
//引入hls.js
export default {
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        controls: true, //控制条
        preload: "auto", //视频预加载
        muted: false, //默认情况下将会消除任何音频。
        loop: false, //导致视频一结束就重新开始。
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        status: null,
        sources: [
          {
            type: "application/x-mpegURL",
            src: this.videoUrl
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
      ruleForm: {
        c_name: "",
        region: "",
        name: "",
        phone: ""
      },
      rules: {
        c_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }]
      },
      dialogFormVisible: false,
      User_num: 0,
      packageInfo: {},
      userId_price: 365.0,
      videoUrl: "",
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
      isApply: true,
      value: 0,
      package_id: null,
      enp_people: {},
      buttonMsg: "",
      intro: "",
      end_time: ""
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    countPrice() {
      const user_price = this.User_num * this.childCountP;
      return Number(this.packageInfo.favprice) + user_price;
    }
  },
  components: {
    allotCourse
  },
  mounted() {},
  created() {
    this.getLessonInfo(this.$route.query.package_id);
  },

  methods: {
    //去购买子账号
    toBuyCount() {
      // console.log("this.package", this.$route.query.package_id);
      console.log("this.$route.fullPath", this.$route.fullPath);

      this.$storage.set("historyPath", this.$route.fullPath);

      this.$router.push({
        path: "./buyLesson",
        query: {
          count: 1,
          onlyBuyCount: true
        }
      });
    },
    //提交试看申请
    submitForm(formName, ruleForm) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var parms = {
            enter_name: ruleForm.c_name,
            people: ruleForm.region,
            name: ruleForm.name,
            telephone: ruleForm.phone
          };
          this.$api.lessonCenter
            .getApplyView(parms)
            .then(res => {
              this.isApply = false;
              this.dialogFormVisible = false;
            })
            .catch(err => {
              Error(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 跳转至分配课程
    allotLesson() {
      console.log("pack", this.$route.query.package_id);

      let prams = {
        packageID: this.$route.query.package_id
      };
      this.$refs.allotCourseFn.init(prams);
    },

    //跳转到购买页面
    buyLesson() {
      console.log("this.$route.fullPath", this.$route.fullPath);
      this.$storage.set("historyPath", this.$route.fullPath);
      this.$router.push({
        path: "./buyLesson",
        query: {
          package_id: this.$route.query.package_id,
          count: this.User_num
        }
      });
    },
    receiveLesson() {
      var parms = {
        package_id: this.$route.query.package_id
      };
      this.$api.lessonCenter
        .receiveVideo(parms)
        .then(res => {
          if (res.data.result == 0) {
            this.$message.success("领取成功");
            this.getLessonInfo(this.$route.query.package_id);
            // location.reload();
          } else {
            this.$message.error("不能领取重复的课程包");
          }
        })
        .catch(err => Error(err));
    },
    onPlayerPlay(player) {
      console.log("player play!", player);
    },
    getLessonInfo(package_id) {
      const that = this;
      var parms = {
        package_id: package_id
      };
      that.$api.lessonCenter
        .getCurrentLesson(parms)
        .then(res => {
          that.end_time = res.data.data.end_time;

          switch (res.data.data.status) {
            case 0:
              if (res.data.data.package.is_free == 1) {
                that.buttonMsg = "立即领取";
              } else {
                that.buttonMsg = "立即购买";
                this.isApply = true;
              }
              break;
            case 1:
              that.buttonMsg = "已经下架";
              break;
            case 2:
              that.buttonMsg = "立即分配";
              this.isApply = false;
              break;
            case 3:
              if (res.data.data.package.is_free == 1) {
                that.buttonMsg = "立即领取";
              } else {
                that.buttonMsg = "重新购买";
              }
              break;
            default:
              break;
          }

          that.packageInfo = res.data.data.package;
          that.intro = that.packageInfo.intro;
          console.log("intro", that.intro);

          that.lessonList = res.data.data.cates;
          that.childCountP = res.data.data.tody_total;
          that.enp_people = res.data.data.enp_people;
          if (res.data.data.package.play_url[0]) {
            that.player.src(res.data.data.package.play_url[0]);
          }
          console.log("endTime", res.data);

          that.status = res.data.data.status;
        })
        .catch(err => {
          Error(err);
        });
    },
    applyView() {
      this.dialogFormVisible = true;
    },
    handleChange(value) {
      console.log(value);
    },
    changeQuelity(e) {
      let _time = this.$refs.videoPlayer.player.currentTime();
      const that = this;
      that.$route.query.lessArr.forEach((ele, idx) => {
        if (e == idx) {
          that.player.src(ele);
          that.player.load();
          that.player.currentTime(_time);
        }
      });
      this.player.play();
    }
  }
};
</script>
<style  scoped>
@import url("../../theme/flex.less");

.text {
  font-size: 14px;
  flex: 1;
  display: flex;
}
/* .vjs-big-play-button{
  display: none!important
} */
.mc {
  width: 644px;
  height: 362px;
  background-color: #000000;
  opacity: 0.6;
  position: absolute;
  top: 0;
  z-index: 2;
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
.bto_allot {
  width: 780px;
  height: 56px;
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.btn_allot {
  background-color: rgba(59, 140, 255, 1);
  color: #eee;
  width: 110px;
  height: 36px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
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
  margin: 0 35px 60px;
}
.left {
  border-right: 1px solid #ebeef5;
  flex: 0.7;
  padding: 30px;
}
.right {
  flex: 0.3;
  padding: 30px;
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
  width: 250px;
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
  left: 230px;
  top: 165px;
  color: white;
  width: 110px;
  height: 36px;
  border-radius: 5px;
  border: none;
  margin-left: 40px;
}
.canClick {
  color: rgba(64, 158, 255, 1);
  padding-left: 20px;
  cursor: pointer;
}
.player-container {
  position: relative;
}
.color_p {
  color: #999;
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
/* .el-select {
} */
</style>
