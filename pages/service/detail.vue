<template>
	<view class="content" v-if="showContent">
		<cl-confirm ref="confirm2" style="margin-bottom: -10px;">
			<cl-textarea  v-model="TechRemarks" placeholder="请输入" style="text-align: left;"> </cl-textarea>
		</cl-confirm>
		<cl-toast ref="toast"></cl-toast>
		<view>
			<view class="history" @tap="history">
				<cl-icon name="cl-icon-eye-open" color="#007AFF" :size="80"></cl-icon>
			</view>
		</view>
		<view class="my_card" >
			<view class="cust_name">
				{{service.customer.name_zh}}
				<view class="new_card_title_right" :style="{ color: service.service_status.color }">{{service.service_status.status}}</view>
			</view>
			<view class="service_title">
				<cl-row v-if="service.order_type != 3">
					<cl-col span="8">
						<view class="service_name">{{service.service_type_info.service_name}}</view>
					</cl-col>
					<cl-col span="8">
						<view class="first_job" >{{service.first_job}}</view>
					</cl-col>
					<cl-col span="8" v-if="service.customer.customer_type_text">
						<view class="customer_type">{{service.customer.customer_type_text}}</view>
					</cl-col>
				</cl-row>
				
				<cl-row v-if="service.order_type == 3">
					<cl-col span="8">
						<view class="customer_type kc">勘察服务</view>
					</cl-col>
				</cl-row>
				
				<view>
				</view>
			</view>
			<view>
				<cl-icon name="cl-icon-my" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.contact_name}}</text></span>
			</view>
			<view @tap="makePhone()">
				<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.mobile}}</text></span>
			</view>
			<view @tap="makePhoneb()">
				<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.tel}}</text></span>
			</view>
			<view>
				<cl-icon name="cl-icon-map" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.addr}}</text></span>
			</view>
			<!-- 任务信息 -->
			<view class="service_msg">服务信息</view>
			<view class="v_magin" v-if="is_show_project">
				项目：<span style="color: black;"><text selectable="true">{{service.project}}</text></span>
			</view>
			<view class="v_magin">
				时间：<text selectable="true">
				{{service.job_date}} {{service.job_start_time}}-<block v-if="service.job_end_time !=null ">{{service.job_end_time}}</block>
				</text>
			</view>
			<view class="v_magin">
				人员：<span style="color: black;"><text selectable="true">{{service.staff.main}}</text></span>
			</view>
			<view class="v_magin">
				协作：<span style="color: black;"><text selectable="true">{{service.staff.other}}</text></span>
			</view>
			<span v-if="service.order_type==1">
				<view>
					设备：<span style="color: black;"><text selectable="true">{{service.equipments}}</text></span>
				</view>
			</span>
			<view class="v_magin">
				要求：<span style="color: black;"><span><text selectable="true">{{service.remarks}}</text></span></span>
			</view>
			<span v-if="is_show_bz">
				<view @tap="update_remarks" class="v_magin">
					技术员备注：<span style="color: black;" v-if="service.tech_remarks!=null">{{service.tech_remarks}}</span>&nbsp;
				</view>
			</span>
			<!-- 设备布防图 -->
			<view class="service_msg" style="color: #12900a;" v-if="is_show_fbt">设备布防图</view>
			<view class="block" v-if="is_show_fbt">
				<cl-row>
					<view>
						<view v-if="service.tech_attachment && item.type!=1" v-for="(item, index) in photosArr" :key="index" class="item-img">
							<image :src="item"  @click="previewImage(index)"  ></image>
						</view>
					</view>
				</cl-row>
			</view>
			
		</view>
		
		<button class="tj_bu" @tap="start()"> 
			<view>
				<span>{{service_button}}</span>
			</view>
		</button>
		
	<!-- <cl-dialog title="客户要求提醒" :visible="show" :closeOnClickModal="false" :beforeClose="confirm" :showCloseBtn="true">
		<text class="max-content">{{teach_remark}}</text>
	</cl-dialog> -->
		<Pup class="prop" ref="popup" :ServiceTypeData="ServiceTypeData" :TypeData="TypeData" :title="title" :staffData="staffData" 
		:jobId="jobid"
		:jobType="jobtype"
		 @propUpdateJobDate="updateJobDate"
		></Pup>
		
		<popup class="popup" ref="openPopUp" :ServiceTypeData="ServiceTypeData" :TypeData="TypeData" :staffData="staffData" 
		:jobId="jobid"
		:jobType="jobtype"
		@propUpdateJobDate="updateJobDate"
		></popup>
		
	<view class="navbar-toggle">
		<view class="menu-container">
			<view class="menu" @click="menuHandle">
				<view class="icon-bar icon-bar-1"></view>
				<view class="icon-bar icon-bar-2"></view>
				<view class="icon-bar icon-bar-3"></view>
			</view>
			<view class="menu-list" v-show="menuShow">
				<view class="list" v-for="(item,index) in menuData" :key="index" @click="feedback(index)">{{item.label}}</view>
			</view>
		</view>
		
	</view>

	</view>
</template>
<script>
import Pup from '@/components/feedback/prop.vue';
import popup from '@/components/feedback/popup.vue';
	export default {
		components:{
			Pup,popup
		},
		data() {
			return {
				name:'服务详情',
				showContent: false,
				service: {},
				jobid: '',
				jobtype: '',
				Staff01: '',
				TechRemarks: '',
				Remarks: '',
				acknowledged: false,
				fileUrl:'',
				staffOther:'',
				service_button:'',
				tech_attachment:[],
				
				is_show_project:true,
				is_show_bz:true,
				is_show_fbt:true,
				
				photosArr:[],
				show: false,
				teach_remark: '',
				confirm_flag: false,
				
				title:'服务反馈', // 申请调整工单日期
				ServiceTypeData:[{label:'门店异常反馈', value:1}, {label:'申请更换日期', value:2}],
				TypeData:[{label:'是', value:1}, {label:'否', value:0}],
				staffData:[],
				
				menuShow:false,
				
				menuData:[{label:'门店异常反馈', value:1}, {label:'申请更换日期', value:2}],
				user_id:''
			}
		},
		onLoad(index) {
			this.fileUrl = this.$baseUrl_imgs
			this.jobid = index.jobid
			this.jobtype = index.jobtype
		},
		onShow(index) {
			this.staffOther = uni.getStorageSync('staffname')
			this.service.Status = 0;
			this.data_select()
			
			// 获取当前用户user_id和name
			if(uni.getStorageSync('user_id') && uni.getStorageSync('staffname'))
			{
				let user_id = uni.getStorageSync('user_id');
				let user_name = uni.getStorageSync('staffname');
				this.staffData = [{label:user_name, value:user_id}]
				this.user_id = user_id
				// console.log(user_id,user_name)
			}
		},
		methods: {
			updateJobDate(params){
				console.log('callback:',params)
				
				 this.$api.editOrderDate(params).then(res=>{
					
					console.log(res)
				 	if(res.code==200)
					{
						setTimeout(()=>{
							if(params.service_type==1)
							{
								this.$refs.openPopUp.close()
								this.$refs.openPopUp.abnormal_type = ''
								this.$refs.openPopUp.content = ''
							}
							if(params.service_type==2)
							{
								this.$refs.popup.close()
								this.$refs.popup.abnormal_type = ''
								this.$refs.popup.content = ''
							}
						},2500)
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				 	uni.hideLoading();
				 }).catch(err=>{
				 	uni.hideLoading();
				 	console.log(err)
				 })
				 
			},
			// 展开菜单
			menuHandle(){
				
				this.menuShow = !this.menuShow
			},
			// 弹出服务反馈
			feedback(index){
				if(this.menuData[index].value == 2)
				{
					this.title = '申请调整工单日期'
					console.log(this.menuData[index].value)
					this.$refs.popup.problem_type =  this.menuData[index].value
					this.$refs.popup.userVal = this.user_id
					
					this.$refs.popup.show(); // 打开弹出层
					
					this.$forceUpdate()
				}
				
				if(this.menuData[index].value == 1)
				{
					
					this.$refs.openPopUp.problem_type =  this.menuData[index].value
					this.$refs.openPopUp.userVal = this.user_id
					this.$refs.openPopUp.show();
					
				}
				this.menuShow = false	// 关闭下拉菜单
			},
			// showModal() {
			// 			this.show = true;
			// 		},
			confirm() {
				if(!this.confirm_flag){
					this.show = false;
					this.confirm_flag = true
				}
				
			},
			//预览轮播图
			previewImage:function(index){
				uni.previewImage({
					current:index, 
					urls:this.photosArr
				})
			},
			showConfirmationDialog(title, content, onConfirm, onCancel) {
				uni.showModal({
				  title: title,
				  content: content,
				  showCancel: false,
				  confirmText: '我已知晓',
				  confirmColor: '#007AFF',
				  success: (res) => {
					if (res.confirm) {
					  if (typeof onConfirm === 'function') {
						onConfirm();
					  }
					} else if (res.cancel) {
					  if (typeof onCancel === 'function') {
						onCancel();
					  }
					}
				  }
				});
			},
			// 详情
			data_select() {
				let params = {
					id: this.jobid,
					job_type: this.jobtype
				}
				this.$api.getOrderInfo(params).then(res=>{
					this.service = res.data;
					this.showContent = true;
					if(res.data.order_type !=3){
						if (this.service.remarks && !this.acknowledged && this.service.status != 3) { // 判断 acknowledged 的值
							if(!this.confirm_flag){
								this.showConfirmationDialog('客户要求提示', this.service.remarks, () => {
															  this.acknowledged = true; // 用户已知晓
															}, () => {
															  uni.navigateBack();
															});
							}
						}
					}
					
					// 布防图处理 去除pdf
					let photosArr = []
					if(this.service.tech_attachment){
						this.service.tech_attachment.forEach((item,i)=>{
							if(item.file_path.slice(item.file_path.lastIndexOf(".") + 1)=='pdf'){
								
							}else{
								photosArr.push(this.fileUrl + '/' + item.file_path)
							}
						})
						
						this.photosArr = photosArr
					}
					
					if(res.data.staff.main == uni.getStorageSync('staffname')){
						if(res.data.status == -1 && res.data.start_time == null){
							this.service_button = '服务未完成';
						}else{
							this.service_button = '继续服务';
						}
						if(res.data.status == 2 && res.data.start_time == null){
							this.service_button = '服务签到';
						}
						if(res.data.status == 2 && res.data.start_time != null){
							this.service_button = '继续服务';
						}
						if(res.data.status == 3){
							this.service_button = '服务已完成';
						}
					}else{
						if(res.data.status == -1 && res.data.start_time == null){
							this.service_button = '等待服务人员完成';
						}else{
							this.service_button = '查看服务报告';
						}
						if(res.data.status == 2 && res.data.start_time == null){
							this.service_button = '等待服务人员签到';
						}
						if(res.data.status == 2 && res.data.start_time != null){
							this.service_button = '查看服务报告';
						}
						if(res.data.status == 3){
							this.service_button = '查看服务报告';
						}
					}
					
					if(res.data.order_type == 3)
					{
						this.is_show_project = false
						this.is_show_bz = false
						this.is_show_fbt = false
					}
					uni.hideLoading();
				}).catch(err=>{
					uni.hideLoading();
					console.log(err)
				})
			},
			start() {
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.CheckData(params).then(res=>{
					if (res.code == -1) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						return ;
					} else {
						if(this.service.start_time != null){
							uni.navigateTo({
								url: "/pages/service/start?jobid=" + this.jobid + "&jobtype=" + this.jobtype
							})
						}else{
							if (this.service.staff.main == uni.getStorageSync('staffname')) {
								uni.navigateTo({
									url: "/pages/sign/sign?jobid=" + this.jobid + "&jobtype=" + this.jobtype + "&lat=" + this
										.service.lat + "&lng=" + this.service.lng + "&addr=" + this.service.customer.addr
								})
							}else{
								uni.showToast({
									icon: 'none',
									title: '等待服务人员签到！'
								});
							}
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 点击拨打电话
			makePhone() {
				uni.makePhoneCall({
					phoneNumber: this.service.mobile
				});
			},
			// 点击拨打电话
			makePhoneb() {
				uni.makePhoneCall({
					phoneNumber: this.service.tel
				});
			},
			//历史记录
			history() {
				uni.redirectTo({
					url: "/pages/history/list?job_type=" + this.jobtype + "&job_date=" + this.service.job_date + "&service_type=" + this.service.service_type
					+ "&job_id=" + this.jobid + "&customer_id=" + this.service.customer.customer_id
				})
			},
			//修改技术员备注
			update_remarks() {
				this.TechRemarks = this.service.tech_remarks;
				this.$refs.confirm2.open({title: "技术员备注修改"}).then(() => {
					uni.showLoading({
						title: "保存中..."
					});
					let params = {
						tech_remarks: this.TechRemarks,
						job_id: this.jobid,
						job_type: this.jobtype
					}
					this.$api.updateTeachRemarks(params).then(res=>{
						if(res.code == 200){
							uni.hideLoading();
							// this.TechRemarks = this.TechRemarks;
							this.service.tech_remarks  = this.TechRemarks;
						}
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						// this.$refs.toast.open(
						// 	this.TechRemarks ? `修改成功！` : "填写为空！"
						// );
					}).catch(err=>{
						console.log(err)
					})
				}).catch(() => {
					this.$refs.toast.open("关闭成功");
				});
			}
		}
	}
</script>
<style lang="scss">
    .navbar-toggle {
		
        display: block;
        margin: 14px 0 0;
        -webkit-transition: all .3s ease-out 0s;
        -o-transition: all .3s ease-out 0s;
        transition: all .3s ease-out 0s;
		position: absolute;
		top: 0;
		right: 32rpx;
		z-index: 99;
		
		// background: #000000;
		.icon-bar {
		    display: block;
		    width: 22px;
		    height: 2px;
		    border-radius: 1px;
		}
		.icon-bar {
		    margin-left: auto;
		    margin-right: auto;
		    display: block;
		    width: 20px;
		    height: 2px;
		    margin-bottom: 6px;
		    position: relative;
		    background: #f9f6f6;
		    border-radius: 30px;
		    z-index: 1;
		    -webkit-transform-origin: 20px;
		    transform-origin: 20px;
		    -webkit-transition: background 0.5s cubic-bezier(0.77,0.2,0.05,1), opacity 0.55s ease, -webkit-transform 0.5s cubic-bezier(0.77,0.2,0.05,1);
		    transition: background 0.5s cubic-bezier(0.77,0.2,0.05,1), opacity 0.55s ease, -webkit-transform 0.5s cubic-bezier(0.77,0.2,0.05,1);
		    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1), background 0.5s cubic-bezier(0.77,0.2,0.05,1), opacity 0.55s ease;
		    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1), background 0.5s cubic-bezier(0.77,0.2,0.05,1), opacity 0.55s ease, -webkit-transform 0.5s cubic-bezier(0.77,0.2,0.05,1);
		}
		
		.menu-container{
			position: relative;
			.menu{
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 0;
				right: 0;
			}
			.menu-list{
				width: 220rpx;
				position: absolute;
				top: 0;
				right: 44rpx;
				background: #fff;
				.list{
					font-size: 28rpx;
					padding: 20rpx 0;
					text-align: center;
					border-bottom: 2rpx solid #eee;
				}
				
			}
		}
    }
	
	.new_card {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
		margin: 10px 0px 60px 0px;

	}

	.new_card_title {
		border-bottom: 1px solid #e0dcdc;
		font-size: 19px;
		font-weight: bold;
		padding: 10px;
		height: 30px;
		color: #38393a;
		/* padding-bottom: 30px */
	}

	.xh {
		color: #007AFF;
		font-weight: bold;
		font-size: 25px;
		margin: 3px;
	}

	.new_card_title_left {
		float: left;
	}

	.new_card_title_right {
		font-size: 17px;
		float: right;
		position: absolute;
		right: 20px;
		top: 70px;
	}

	.new_card_content {
		margin: 10px;
		font-size: 17px;
		color: #7b7070;
	}

	.new_card_content view {
		margin-bottom: 10px;
	}

	.tj_bu {
		margin: 20px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
		background-color: #007AFF;
		color: #FFFFFF;
		border-radius: 15px;
		z-index: 9999;
		font-weight: bold;
		font-size: 18px;
	}

	.history {
		z-index: 9999;
		position: fixed;
		bottom: 13%;
		right: 20px;
	}

	/* new */
	.content {
		/* background-image: url(../../static/images/my.png); */
		padding: 50px 10px;
		height: 5%;
		background-color: #0e8cf1;
		color: #6b6464;
	}

	.my_card {
		background-color: #fff;
		border-radius: 10px;
		margin: 10px 0px;
		padding: 10px 10px 100px 10px;
		position: relative;
	}

	.cust_name {
		font-size: 20px;
		font-weight: bold;
	}

	.service_title {
		margin: 10px 0px;
	}

	.service_name {
		background-color: #c6ecc0;
		color: #12900a;
		border-radius: 8px;
		padding: 3px 0px;
		text-align: center;
		margin-right: 5px;
	}

	.first_job {
		background-color: #cbe8ff;
		color: #0876f1;
		border-radius: 8px;
		padding: 3px 0px;
		text-align: center;
		margin-right: 5px;
	}
	.customer_type {
		background-color: #f6a6a6;
		color: #e01313;
		border-radius: 8px;
		padding: 3px 0px;
		text-align: center;
		margin-right: 5px;
	}
	.service_msg {
		font-size: 16px;
		font-weight: bold;
		color: #2196F3;
		padding: 15px 0px 5px 0px;
	}

	.v_magin {
		margin: 2px 0px;
		line-height: 55rpx;
	}

  .uni-modal {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
  }

  .uni-modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #007AFF;
    margin-bottom: 10px;
  }

  .uni-modal-content {
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }

  .uni-modal-buttons {
    display: flex;
    justify-content: flex-end;
  }

  .uni-modal-button {
    margin-left: 10px;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }

  .uni-modal-button-confirm {
    background-color: #007AFF;
    color: #fff;
  }

  .uni-modal-button-cancel {
    background-color: #EE0A24;
    color: #fff;
  }
.item-img{
	width:200rpx;
	height: 200rpx;
	overflow: hidden;
}
.item-img image{
	width: 100%;
}

.customer_type.kc{
	
    border-radius: 8px;
    padding: 3px 0px;
    text-align: center;
    margin-right: 5px;
	
	background: #ea8e4c;
	color: #000000;
}
.max-content{
	max-height: 300px;
	overflow-y: auto;
}

</style>
