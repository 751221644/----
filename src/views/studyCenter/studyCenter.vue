<template>
  <section  class="section_study" ref="viewBox">
    <div class="wrap_cStudy" >
      <ul>
        <li v-for="(item,index) in studyData" class="box">
          <div class="left">
            <img :src="item.thumb" alt>
          </div>
          <div class="right">
            <h3 class="title">{{item.package_name}}</h3>
            <p class="desc">{{item.desc}}</p>
            <p class="tishi">
              <span
                class="span1"
              >本课程共 {{item.course_count}} 节，管理员{{item.admin}} 于 {{item.assign_time}} 分配</span>
              <span class="span2">
                <strong>学习进度：</strong>
                <em>
                  <i v-bind:style="{width:item.rate+'px'}"></i>
                </em>
                &nbsp;&nbsp;&nbsp;{{item.rate}}%
              </span>
            </p>
            <p class="attention">{{item.message}}</p>
            <el-button type="primary" class="study" @click="studynow(item.package_id)" style="padding-top:10px;padding-bottom:10px;">立即学习</el-button>
          </div>
        </li>
      </ul>
      <div class="nodata" v-if="nodata" style="text-align:center;line-height:400px;">暂无课程，请联系管理员为您分配</div>
     
    </div>
     <div class="block" v-if="isShow">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="5"
          layout="prev, pager, next, jumper"
          :page-count="totalPage"
          :background="true"
        ></el-pagination>
      </div>
  </section>
</template> 
<script>
import homeHeader from "../../components/header";
import Cookies from "js-cookie";
import router from "../../router/index.js";
export default {
  data() {
    return {
      studyData: [],
      page: 1,
      totalPage: null,
      isShow: false,
      nodata: false
    };
  },
  methods: {
    getStudyCenterData() {
    	const self = this;
        self.$tools.startLoding()
      const params = {
        page: this.page
      };
      this.$api.person.getStudyCenter(params).then(res => {
        if(res.data.result === 0){
          if (res.data.data.data) {
            //请求成功
            var data = res.data.data.data;
            this.isShow = true;
            if (data.length == 0) {
              //没有课程
            } else {
              //有课程
              for (var i = 0; i < data.length; i++) {
                data[i].rate = data[i].rate.substring(0, data[i].rate.length - 1);
              }
              this.studyData = data;
              this.totalPage = res.data.data.pages;
            }
          } else {
            this.isShow = false;
            this.nodata = true;
          }
        }else{
          this.$message.error(res.data.msg);
        }
        
        self.$tools.closeLoading()
      });
    },
    toPlayVideo(){
    	this.$router.push({ path: 'studyVideo'});
    },
    handleCurrentChange(num) {
      this.page = num;
      this.getStudyCenterData({ page: this.page });
    },
    studynow(package_id){
    	this.$router.push({ path: 'studyDetail', query: { package_id: package_id }});
    },
    // beforeRouteEnter(to,from,next) {
    //   if((to.path == '/companyManage'&&to.query.changeSchool&&from.path == '/person')||(to.path == '/studyCenter'&&to.query.changeSchool&&from.path == '/person')){
    //     next(()=>{
    //       window.location.reload();
    //     });
    //   }else{
    //     next(() =>{
    //       window.location.reload();
    //     });
    //   }
    // }
  },
  mounted() {
    // 获取学习中心数据
    // this.box = this.$refs.viewBox;
    this.getStudyCenterData({ page: this.page });
  }
};
</script>
<style scoped lang="less">
.section_study{
    height: 100%;
    margin-bottom: 70px;
    background: #fff;
     margin: 0 35px 50px 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.wrap_cStudy{
  padding: 0px  30px;
    background: rgb(255, 255, 255);
    height: auto;
}
ul,
li {
  width: 100%;
}
.box{
	zoom:1;
}
.box:after{
	content:'';
	display:block;
	overflow:hidden;
	clear:both;
}
li {
  // display: flex;
  padding-top: 30px;
  padding-bottom: 31px;
  border-bottom: 1px solid #eeeeee;
  .left {
  	float:left;
    width: 260px;
    height: 164px;
    background: green;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
  	float:left;
    margin-left: 30px;
    .title {
      padding-top: 9px;
      font-size: 22px;
      line-height: 22px;
      color: #333333;
    }
    .desc {
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
      // .span1 {
      // }
      .span2 {
        display: flex;
        margin-left: 28px;
        width: 271px;
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
    	max-width:700px;
	    height: auto;
	    padding: 12px 16px;
	    font-size: 12px;
	    line-height: 18px;
	    color: #8f835b;
	    background: #fffeec;
	    border: solid 1px #e9e8ce;
    }
    .study {
      margin-top: 20px;
    }
  }
}
.block{
      margin-bottom: 50px;
    background-color: #fff;
    padding: 30px 0;
}
.el-pagination {
  text-align: center;
}
</style>
