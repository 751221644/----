<template>
    <section style="padding: 0 35px;">
        <div style="padding:30px;background:#ffffff">
            <div class="block" >
                <span class="demonstration">时间：</span>
                <el-date-picker class="time"
                  v-model="valueTime"
                  type="datetimerange"
                  start-placeholder=""
                  end-placeholder=""
                  :default-time="['12:00:00']"
                  format="yyyy-MM-dd">
                </el-date-picker>
                <!-- <span class="depart">部门：</span>
                <el-select v-model="valueDepart" placeholder="请选择" style="float:left;width:120px;">
                    <el-option
                      v-for="item in optionsDepart"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <span class="depart">姓名：</span>
                <el-input class="name" v-model="valueName" placeholder="请输入内容"></el-input> -->
                <span class="depart">课程包：</span>
                <el-input v-model="valueCourseParket" @keyup.enter.native="query('')" placeholder="请输入内容" style="float:left;width:120px;"></el-input>
                <span class="depart">课程：</span>
                <el-input v-model="valueCourse" @keyup.enter.native="query('')" placeholder="请输入内容" style="float:left;width:120px;"></el-input>
                <el-button type="text" class="query" @click="query">查询</el-button>
            </div>
            <table cellspacing="0">
                <tr class="title">
                    <td width="9%">学习时间</td>
                    <td width="18%">学习地址</td>
                    <td width="12%">课程包</td>
                    <td width="14%">学习课程</td>
                    <td width="28%">学习时常</td>
                </tr>
                <tr class="content" v-for="(item,index) in tableData" :key="item.id">
                    <td>{{item.dateline}}</td>
                    <td>{{item.address}}</td>
                    <td>{{item.package_name}}</td>
                    <td><a href="javascript:;" @click="enter(item.package_id,item.course_id)">{{item.course_name}}</a></td>
                    <td>{{item.view_length}}</td>

                </tr>
            </table>
            <div class="nodata" v-if="nodata" style="text-align:center;line-height:400px;">暂无学习记录</div>
            <div class="block" style="margin-top:30px;" v-if="isShow">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="page"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :page-count="totalPage"
                  :background="true">
                </el-pagination>
            </div>
        </div>
        
    </section>
</template>
<style scoped lang="less">
    @import (reference) "../../style/mixins/_var.less";
    div{
        color:#333333;
    }
    .demonstration{
        float:left;
        height:32px;
        line-height:32px;
        font-size:14px;
        color:#333333;
    }
    .depart{
        float:left;
        margin-left:15px;
        height:32px;
        line-height:32px;
        font-size:14px;
        color:#333333;
    }
    .time{
        float:left;
        width:200px;
        height:32px;
        border:1px solid #ddd;
    }
    .name{
        float:left;
    }
    .query{
        color:@gColor;
        margin-left:14px;
        height:32px;
        line-height:32px;
        padding:0;
    }
    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
        width:268px;
        // height:32px;
        // line-height:32px;
    }
    .el-input{
        width:120px;
    }
    .el-pagination{
        text-align:center;
    }
    table{
        width:100%;
        height:auto;
        margin-top:30px;
        .title{
            background:rgba(59,140,255,0.1);
            td{
                font-size:12px;
                height:35px;
                font-weight:bold;
                color:#333333;
            }
        }
        
        td{
            border:none;
            border-collapse:collapse;
            text-align:center;
        }
        .content{
            td{
                height:65px;
                font-size:12px;
                color:#666666;
            }
        }
    }


</style>
<script>
export default {
    data() {
        return {
            valueTime: '',
            valueTime0:'',
            valueTime1:'',
            valueDepart:'',
            valueName:'',
            valueCourseParket:'',
            valueCourse:'',
            optionsDepart:[],
            optionsCourseParket:[],
            optionsCourse:[],
            tableData:[],
            page:1,
            totalPage:null,
            isShow:true,
            nodata:false
        };
    },
    methods:{
        query(str){
            console.log(this.valueTime);
            const self = this;
            self.$tools.startLoding()
            if(this.valueTime){
                this.valueTime0 = this.valueTime[0];
                this.valueTime1 = this.valueTime[1];
            }else{
                this.valueTime0 = '';
                this.valueTime1 = '';
            }
            if(str == 'pagechange'){

            }else{
                this.page = 1;
            }
            var param = {
                starttime:this.formatter(String(this.valueTime0)),
                endtime:this.formatter(String(this.valueTime1)),
                package_name:this.valueCourseParket,
                course_name:this.valueCourse,
                page:this.page
            };
            this.$api.person.studyLog(param).then(res => {
                console.log(res);
                if(res.data.result == 0){
                    console.log(res.data.data);
                    if(res.data.data.data){
                        this.tableData = res.data.data.data;
                        console.log(res.data.data.data);
                        this.isShow = true;
                        this.nodata = false;
                        this.totalPage = res.data.data.pages;
                    }else{
                        console.log(1111);
                        this.tableData = [];
                        this.isShow = false;
                        this.nodata = true;
                    }
                }
                self.$tools.closeLoading()
            });
        },
        handleCurrentChange(num){
            this.page = num;
            this.query('pagechange');
        },
        enter(package_id,course_id){
            // this.$router.push({ path: 'lessonInfo',query: { package_id: package_id }});
            this.juageLesson(package_id,course_id);
        },
        //判断课程是否为光华的
        juageLesson(package_id,course_id) {
          var parms = {
            package_id: package_id,
            course_id: course_id
          };
          this.$api.lessonCenter
            .playVideo(parms)
            .then(res => {
                if(res.data.data){
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
                }else{
                    this.$message.error(res.data.msg);
                }
              
            })
            .catch(err => {
              Error(err);
            });
        },
        formatter(str){
            if(!str){
                return '';
            }
            var iYear = str.substring(11,15);
            var iMonth = str.substring(4,7);
            var iDate = str.substring(8,10);
            switch(iMonth){
                case 'Jan':
                    iMonth = '01';break;
                case 'Feb':
                    iMonth = '02';break;
                case 'Mar':
                    iMonth = '03';break;
                case 'Apr':
                    iMonth = '04';break;
                case 'May':
                    iMonth = '05';break;
                case 'Jun':
                    iMonth = '06';break;
                case 'Jul':
                    iMonth = '07';break;
                case 'Aug':
                    iMonth = '08';break;
                case 'Sept':
                    iMonth = '09';break;
                case 'Oct':
                    iMonth = '10';break;
                case 'Nov':
                    iMonth = '11';break;
                case 'Dec':
                    iMonth = '12';break;
            }
            return iYear+'-'+iMonth+'-'+iDate;

        }
    },
    mounted(){
        this.query('');
    }
};
</script>