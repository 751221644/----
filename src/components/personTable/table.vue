<template>
	<div>
		<table cellspacing="0">
			<tr class="title">
				<td width="10%">企业ID</td>
				<td width="80%">名称</td>
				<td width="10%">操作</td>
			</tr>
			<tr class="content" v-for="(item,index) in tableData" :key="item.id">
				<td>{{item.school_id}}</td>
				<td>{{item.school_name}}</td>
				<td @click="enterCom(item.school_id)"><a href="javascript:;" v-bind:class="[curSchoolId == item.school_id ? 'activeClass' : '']">{{curSchoolId == item.school_id ?'当前企业':'进入企业'}}</a></td>
			</tr>
		</table>
		<div class="block" style="margin-top:30px;visibility: hidden;">
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
</template>
<style scoped lang="less">
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
		a{
			color:#666666;
			&.activeClass{
				color:#3b8cff;
			}
		}
	}
	.el-pagination{
		text-align:center;
	}
</style>
<script>
export default{
	data(){
		return {
			tableData: [],
	        curSchoolId:this.$store.state.schoolId,
	        totalPage:null,
			page:1,
			allSchoolArr:[],
      		school_name:''
		}
	},
	watch:{
		curSchoolId:function(a,b){
			console.log(1111);
			return this.$store.state.schoolId;
		}
	},
	mounted() {
		this.mySchool();
              console.log(this.$store.state);
		// this.curSchoolId = localStorage.getItem("currentSchoolId");

	},
	methods:{
		enterCom(school_id){
			// console.log(this.$store.state,school_id);
			if(school_id == this.curSchoolId){
				if(this.$store.state.getInfo == 'admin'){
            		this.$router.push({path:'companyManage',query: { school_id: school_id }});
            	}else{
            		this.$router.push({path:'studyCenter',query: { school_id: school_id }});
            	}
			}else{
				//切换大学
				var params = {
		        	school_id:school_id
			    }
			    this.$api.school.changeSchool(params).then(res=>{
			    	var parms = {
		                school_id: res.data.data.school_id
		              };
			    	this.$api.toLogin
		                .getUserRole(parms)
		                .then(res => {
		                  console.log(res);
		                  // console.log('this.Sfewqfewqgeqw',this.$store.state);
		                  var _res = res;
		                  // this.$storage.set("changeRole", res.data.data.user_role);
                  		 this.$storage.set("role", res.data.data.user_role);

		                  this.$store.dispatch("getRole", res.data.data.user_role).then(res=>{
		                    if(_res.data.data.user_role == 'admin'){
	                    		this.$router.push({path:'companyManage',query: { changeSchool:'1'}});
			            		
			            	}else{
			            		console.log('studyCenter');
		            			this.$router.push({path:'studyCenter',query: { changeSchool:'1'}});
			            		location.reload();
			            	}
		                  }).catch(Error(err))
		                })
		                .catch(err => {
		                  Error(err);
		                });
	            	
		      	}).catch(err=>Error(err))
			}
			
		},
		mySchool(){
			var params = {};
			this.$api.person.mySchool(params).then(res => {
				console.log(res);
				if(res.data.result == 0){
					if(res.data.data){
						this.tableData = res.data.data.data.data;
						this.totalPage = res.data.data.pages_num;
						this.$store.dispatch('schoolId',res.data.data.school_id);
						this.curSchoolId = this.$store.state.schoolId;
						this.$store.dispatch('schoolNum',this.tableData.length);
					}
					
				}else{
					this.$message.error(res.data.msg);
				}
			});
		},
		handleCurrentChange(num){
			this.page = num;
            this.mySchool({page:this.page});
		}
	}

}
</script>