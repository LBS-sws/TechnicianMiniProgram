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
		<view class="my_card" v-if="service.order_type!=3">
			<view class="cust_name">
				{{service.customer.name_zh}}
				<view class="new_card_title_right" :style="{ color: service.service_status.color }">{{service.service_status.status}}</view>
			</view>
			<view class="service_title">
				<cl-row>
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
			<view class="v_magin">
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
			<span>
				<view @tap="update_remarks" class="v_magin">
					技术员备注：<span style="color: black;" v-if="service.tech_remarks!=null">{{service.tech_remarks}}</span>&nbsp;
				</view>
			</span>
			<!-- 设备布防图 -->
			<view class="service_msg" style="color: #12900a;">设备布防图</view>
			<view class="block">
				<cl-row>
					
					<!-- <cl-col span="8" v-if="service.tech_attachment" v-for="(item, index) in service.tech_attachment" :key="index">
					    <cl-image size="200rpx" :src="fileUrl + '/' + item.file_path" :preview-list="service.tech_attachment.map(att => fileUrl + '/' + att.file_path)">
					    </cl-image>
					</cl-col> -->
					<view>
						<view v-if="service.tech_attachment" v-for="(item, index) in service.tech_attachment" :key="index" class="item-img">
							<image :src="fileUrl + '/' + item.file_path"  @click="previewImage(index)"></image>
						</view>
					</view>
				</cl-row>
			</view>
		</view>
		
		<view class="my_card" v-if="service.order_type==3">
			<view class="cust_name">
				{{service.customer.name_zh}}
				<view class="new_card_title_right" :style="{ color: service.service_status.color }">{{service.service_status.status}}</view>
			</view>
			<view class="service_title">
				<cl-row>
					
					<cl-col span="8">
						<view class="customer_type">勘察服务</view>
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
			
			
		</view>
		
		<button class="tj_bu" @tap="start()"> 
			<view>
				<span>{{service_button}}</span>
			</view>
		</button>
	</view>
	</view>
	</view>
</template>
<script>
	export default {
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
				tech_attachment:[]
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
			
			setTimeout(()=>{
				if(this.service ==''){
					this.service = {
						addr: "四川省成都市青羊区北大街19号正成财富领地",
						contact_name: "刘",
						contract_id: 51826,
						contract_number: "2014-253",
						customer: {
							addr: "四川省成都市青羊区北大街19号正成财富领地",
							customer_id: 7336,
							customer_type: 249,
							customer_type_text: "工厂服务",
							name_zh: "东湖海鲜111",
						},
						customer_id: 7336,
						equipments: [],
						finish_date: null,
						finish_time: null,
						first_job: "常规服务",
						first_job_flag: 0,
						job_date: "2024-07-15",
						job_end_time: "18:30:00",
						job_id: 3367223,
						job_start_time: "09:00:00",
						mobile: "1542155223",
						order_type: 3,
						project: "老鼠,蟑螂,果蝇",
						remarks: "服務單及發票需經部長以上人員簽名及蓋章↵每月4次，MOP1300/月",
						service_status: {status: "待服务", color: "#007AFF"},
						service_type: 2,
						service_type_info: {service_id: 2, service_name: "灭虫"},
						staff: {main: "黄丽帆", other: ""},
						start_date: null,
						start_time: null,
						status: 2,
						tech_attachment: [
							{
								file_path: "/lbs/contract/51826-Tech/DF64CE1C-B3A8-4662-B4A0-324CC3204F94.jpeg",
								from_id: "51826",
								from_type: 3,
							},
						],
						tech_remarks: "客户需要增加服务项目",
						tel: "150028888515",
						
					}
				}
				
			},1000)
		},
		methods: {
			//预览轮播图
			previewImage:function(index){
				
				var i = this.service.tech_attachment
				
				var ix = []
				i.forEach((item,i)=>{
					item.src = this.fileUrl + item.file_path
					ix.push(this.fileUrl + item.file_path)
				})
				
				uni.previewImage({
					current:index, 
					urls:ix
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
					if (this.service.remarks && !this.acknowledged && this.service.status != 3) { // 判断 acknowledged 的值
						this.showConfirmationDialog('客户要求提示', this.service.remarks, () => {
						  this.acknowledged = true; // 用户已知晓
						}, () => {
						  uni.navigateBack();
						});
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
<style>
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
</style>
