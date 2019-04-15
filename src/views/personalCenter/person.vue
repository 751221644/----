<template>
    <div style="padding: 0 35px;">
    	<div class="ziliao">
    		<h3>个人资料</h3>
    		<div class="wrap">
    			<div class="left">
    				<span>用户名：</span>
    				<span>学号：</span>
    				<span>手机号码：</span>
    				<!-- <span>登录密码：</span> -->
    			</div>
    			<div class="right">
    				<span>{{user}}&nbsp;&nbsp;<!-- <el-button type="text" @click="modify('username')">修改</el-button> --></span>
    				<span>{{userno}}&nbsp;&nbsp;</span>
    				<span>{{tel}}&nbsp;&nbsp;<el-button type="text" @click="modify('tel')">修改</el-button></span>
    				<!-- <span>******&nbsp;&nbsp;<el-button type="text">修改</el-button></span> -->
    			</div>
    		</div>
    	</div>
    	<div class="mycollage ziliao">
    		<h3>我加入/创建的企业大学 <el-button type="primary" style="float:right;" @click="createSchool('nosubmit')">创建我的企业大学</el-button></h3>
			<tableVue></tableVue>
    	</div>
    	
		<el-dialog title="编辑人员" :visible.sync="form.dialogFormVisible">
		  	<el-form :model="form" status-icon :rules="modifyInfoFormRules" ref="form" id="form">
		    	<el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
		      		<el-input type="text" v-model="form.name" autocomplete="off"></el-input>
		    	</el-form-item>
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="text" @click="cancel" style="color:#666666">取消</el-button>
		    	<el-button type="primary" @click="sure('form')" style="padding-top:9px;padding-bottom:9px;">确定</el-button>
		  	</div>
		</el-dialog>
		
		<el-dialog title="修改手机号" :visible.sync="form2.dialogFormVisible" >
		  	<el-form :model="form2" id="form2" :rules="modifyInfoFormRules2" ref="form2">
		    	<el-form-item label="原手机号：" :label-width="formLabelWidth">
		      		<span>{{form2.previousTel}}</span>
		      		<a class="yzm" href="javascript:;" @click="getYZM" v-if="form2.a">获取验证码</a>
		      		<a class="yzm" href="javascript:;" v-if="form2.b">{{form2.count}}s</a>
		    	</el-form-item>
		    	<el-form-item label="短信验证码：" :label-width="formLabelWidth" prop="yzm">
		      		<el-input v-model="form2.yzm" autocomplete="off"></el-input>
		    	</el-form-item>
		    	<el-form-item label="新手机号码：" :label-width="formLabelWidth" prop="newTel" id="newTel">
		      		<el-input v-model="form2.newTel" autocomplete="off" style="width:152px;"></el-input>
		      		<el-button type="info" plain class="newyzm" v-if="form2.c" @click="getYZM2">获取验证码</el-button>
		      		<el-button type="info" plain class="newyzm" v-if="form2.d">{{form2.count2}}s</el-button>
		    	</el-form-item>
		    	<el-form-item label="短信验证码：" :label-width="formLabelWidth" prop="yzm2">
		      		<el-input v-model="form2.yzm2" autocomplete="off"></el-input>
		    	</el-form-item>
		    	<el-form-item id="button2">
		    		<el-button class="cancel2" type="text" @click="cancel2" >取消</el-button>
		    		<el-button class="sure2" type="primary" @click="sure2('form2')" >确定</el-button>
		    	</el-form-item>
		  	</el-form>
		  	<!-- <el-form :model="form2" status-icon :rules="modifyInfoFormRules2" ref="form2">
		    	
		  	</el-form>
		  	<el-form :model="form2" status-icon :rules="modifyInfoFormRules2" ref="form2" id="newTel">
		    	
		  	</el-form>
		  	<el-form :model="form2" status-icon :rules="modifyInfoFormRules2" ref="form2">
		    	
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	
		  	</div> -->
		</el-dialog>

		<el-dialog
	      center
	      :visible.sync="hasSchool"
	      :modal-append-to-body="false"
	      width="30%"
	      :show-close="true"
	      :close-on-click-modal="true"
	    >
	      <el-form :model="form3" style="text-align:center;">
	        <span class="title_d">给您的企业大学起个名字吧</span>
	        <el-form-item >
	          <el-input v-model="form3.name" autocomplete="off" placeholder="例：三茅大学" style="height:45px;"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-button type="primary" @click="createSchool('submit')" style="width:400px;">确认创建</el-button>
	        </el-form-item>
	        <div class="foot_dialog">
	          <!-- <el-checkbox v-model="form3.checked" style="color:rgba(178, 178, 178, 1)">《用户协议及保密承诺》</el-checkbox> -->
	          <el-button type="text" style="color:rgba(178, 178, 178, 1)" @click="outCreate">退出创建</el-button>
	        </div>
	      </el-form>
	    </el-dialog>
    </div>
</template>
<script>
import tableVue from "../../components/personTable/table";	
export default{
	data(){
		return{
			msgno:'',
			userno:'',
			tel:'',
			user:'',
	        form: {
	        	dialogFormVisible: false,
	          	name: '',
	          	info:''
	        },
	        formLabelWidth: '',
	        form2: {
	        	dialogFormVisible: false,
	          	name: '',
	          	previousTel:'326434****347548',
	          	yzm:'',
	          	newTel:'',
	          	yzm2:'',
	          	a:true,
	          	b:false,
	          	count:120,
	          	timer1:null,
	          	c:true,
	          	d:false,
	          	timer2:null,
	          	count2:120
	        },
	        modifyInfoFormRules:{
	        	name:[
		          	{ required: true, message: "请输入姓名", trigger: "blur" }
		        ]
	        },
	        modifyInfoFormRules2:{
	        	yzm:[
	        		{required: true, message: "请输入验证码", trigger: "blur"}
	        	],
	        	newTel:[
	        		{required: true, message: "请输入新手机号", trigger: "blur"}
	        	],
	        	yzm2:[
	        		{required: true, message: "请输入新手机号的验证码", trigger: "blur"}
	        	]
	        },
	        hasSchool: false,
	        form3:{
	        	name:'',
	        	checked: true,
	        }
		}
	},
	components:{tableVue},
	computed:{
		
	},
	methods:{
		modify(str){//两个dialog修改
			if(str == 'username'){
				this.form.dialogFormVisible = true;
			}
			if(str == 'tel'){
				this.form2.dialogFormVisible = true;
			}
		},
		sure(form){//第一个dialog确定按钮事件
			this.$refs[form].validate((valid) => {
				if(valid){
					var params = {
						new_name:this.form.name
					};
					this.$api.person.updateUsername(params).then(res => {
						console.log(res);
						if(res.data.result == 0){
							this.user = this.form.name;
							this.form.dialogFormVisible = false;
							location.reload();
						}else{
							this.$message.error(res.data.msg);
						}
						
					});
				}else{

				}
			})
		},
		sure2(form2){
			this.$refs[form2].validate((valid) => {
				if(valid){
					var param = {
						mobile:this.tel,
						mobile_new:this.form2.newTel,
						verifycode:this.form2.yzm,
						verifycode_new:this.form2.yzm2
					};
					this.$api.global.modifyMobile(param).then(res => {
						console.log(res);
						if(res.data.result == 0){
							this.$message('绑定成功');
							this.form2.dialogFormVisible = false;
							this.form2.yzm = '';
							this.form2.newTel = '';
							this.form2.yzm2 = '';
						}else{
							this.$message.error(res.data.msg);
						}
					});
				}else{

				}
			})
			
		},
		cancel(){
			this.form.dialogFormVisible = false;
		},
		cancel2(){
			this.form2.dialogFormVisible = false;
		},
		getPersonMessage(){
			const self = this;
      		self.$tools.startLoding()
			const param = {

			};
			this.$api.person.schoolInfo(param).then(res => {
				if(res.data.result===0&&res.data.data){
					let {
						staff_user,
						userinfo
					} = res.data.data
					this.user = staff_user ? staff_user.name :'';
					this.userno = userinfo.studentid;
					this.tel = userinfo.mobile;
					var part1 = this.tel.substring(0,3);
					var part2 = this.tel.substring(7);
					this.form2.previousTel = part1+'****'+part2;
				}else{
					this.$message.error(res.data.msg);
				}
				
				self.$tools.closeLoading()
			});
		},
		getYZM(){
			var _this = this;
			var captcha1 = new TencentCaptcha(_this.$config.TencentCaptcha_appid, function(r) {
		        if (r.ret === 0) {
			          console.log('r2',_this);
		        	let args = {
			            "mobile": _this.tel,
			            "ticket": r.ticket,
			            "randstr": r.randstr
			          }
		        	 _this.$api.global
			            .getMsg(args)
			            .then(res => {
			              console.log(res);
			              let result = res.data;
			              if (result.result == 0) {//倒计时
			              	_this.form2.a = false;
			              	_this.form2.b = true;
			              	_this.form2.timer1 = setInterval(function(){
								if(_this.form2.count<=0){
									_this.form2.a = true;
									_this.form2.b = false;
									clearInterval(_this.form2.timer1);
								}else{
									_this.form2.count--;
								}
							},1000);
			              } else {
			                _this.$message.error(result.msg);
			              }
			            })
			            .catch(err => {});

		        }
		    });
      		captcha1.show(); // 显示验证码
		},
		getYZM2(){
			var _this = this;
			var captcha1 = new TencentCaptcha(_this.$config.TencentCaptcha_appid, function(r) {
		        if (r.ret === 0) {
			          console.log('r2',_this);
		        	let args = {
			            "mobile": _this.form2.newTel,
			            "ticket": r.ticket,
			            "randstr": r.randstr
			          }
		        	 _this.$api.global
			            .getMsg(args)
			            .then(res => {
			              console.log(res);
			              let result = res.data;
			              if (result.result == 0) {//倒计时
			              	_this.form2.c = false;
			              	_this.form2.d = true;
			              	_this.form2.timer2 = setInterval(function(){
								if(_this.form2.count2<=0){
									_this.form2.c = true;
									_this.form2.d = false;
									clearInterval(_this.form2.timer2);
								}else{
									_this.form2.count2--;
								}
							},1000);
			              } else {
			                _this.$message.error(result.msg);
			              }
			            })
			            .catch(err => {});

		        }
		    });
      		captcha1.show(); // 显示验证码
		},
		createSchool(str){
			let schoolNum = this.$store.state.schoolNum;
			if(str == 'nosubmit'){
				this.hasSchool = true;
				return
			}
			if(!schoolNum||schoolNum < 10){

			}else{
				this.$message('最多只能创建10所大学');
				return;
			}
			this.hasSchool = true;
			var parms = {
		        school_name: this.form3.name
	      	};
		    this.$api.school
		        .create_school(parms)
		        .then(res => {
		          console.log("res.data.data.school_id", res.data.data.school_id);
		          this.$api.toLogin
		                .getUserRole(parms)
		                .then(res => {
		                  console.log(res);
		                  // console.log('this.Sfewqfewqgeqw',this.$store.state);
		                  var _res = res;
              this.$storage.set("isChange","isChange");
		                  this.$storage.set("changeRole", res.data.data.user_role);

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
		        })
		        .catch(err => {
		          Error(err);
		        });
		},
		outCreate() {
	      	// Cookies.remove("token");
	      	// location.reload();
	      	this.hasSchool = false;
	    }

	},
	mounted(){
		this.getPersonMessage({});
	}

}
</script>

<style scoped lang="less">
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";
	.ziliao{
		background:#ffffff;
		padding:30px;
		color:#333333;
		h3{
			background:url('/assets/person1.png') no-repeat;
			font-size:20px;
			font-weight:normal;
			position:relative;
			padding-left:9px;
			&::before{
				display:inline-block;
				content:'';
				width:3px;
				height:18px;
				background:#3b8cff;
				position:absolute;
				top:6px;
				left:0;
			}
		}
		.wrap{
			display:flex;
			margin-left:59px;
			margin-top:22px;
			.left{
				span{
					display:block;
					text-align:right;
					line-height:52px;
					font-size:14px;
				}
			}
			.right{
				margin-left:20px;
				span{
					display:block;
					text-align:left;
					line-height:52px;
					font-size:14px;
				}
			}
		}
	}
	.yzm{
		// color:@gColor;
		margin-left:19px;
		color:#3b8cff;
	}
	.cancel{
		padding-right:0;
	}
	.el-button--text{
		color:#409EFF;
	}
	.el-pagination{
		text-align:center;
		margin-top:30px;
	}
	/deep/#form .el-form-item__label{
		width:150px;
	}
	/deep/#form2 .el-form-item__label{
		width:150px;
	}
	/deep/#newTel .el-form-item__label{
		width:150px;
	}
	/deep/#form .el-input{
		width:250px;
		height:32px;
	}
	/deep/#form .el-input .el-input__inner{
		width:250px;
		height:32px;
	}
	/deep/#form2 .el-input{
		width:250px;
		height:32px;
	}
	/deep/#newTel .el-input__inner{
		width:158px;
		height:32px;
	}
	/deep/#newTel .newyzm{
		width:88px;
		height:32px;
		font-size:14px;
		padding:0;
		margin-left:5px;
	}
	/deep/#button2{
		text-align:right;
	}
	/deep/#button2 .sure2{
		width:58px;
		height:32px;
		font-size:14px;
		padding:0;
	}
	/deep/#button2 .sure2 span{
		display:block;
		width:58px;
		height:32px;
		font-size:14px;
		line-height:32px;
	}

.title_d {
  font-size: 24px;
  padding-bottom: 45px;
}
.foot_dialog {
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-dialog__wrapper {
  /deep/.el-dialog {
    border-radius: 15px !important;
  }
}

.el-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-form-item {
	width: 100%;
	display: flex;
	justify-content: center
}
.el-input {
  /deep/ input {
    height: 32px;
  }
}
.el-form {
  /deep/.el-form-item__content {
    width: 400px;
    // margin-left: 60px !important;
  }
}
.el-dialog__title {
  font-size: 24px;
}
/deep/.el-dialog__headerbtn{
	top:11px;
}

</style>

