<template>
	<view class="content" v-if="showContent">
		<cl-confirm ref="confirm2" style="margin-bottom: -10px;">
			<cl-input v-model="TechRemarks" placeholder="请输入"></cl-input>
		</cl-confirm>
		<cl-toast ref="toast"></cl-toast>
		<!-- 历史记录 -->
		<view>
			<view class="history" @tap="history">
				<cl-icon name="cl-icon-eye-open" color="#007AFF" :size="80"></cl-icon>
			</view>
		</view>
		<view class="my_card">
			<view class="cust_name">
				{{service.customer.name_zh}}
				<span v-if="service.status == 2">
					<span v-if="service.job_start_time == '00:00:00'">
						<view class="new_card_title_right" style="color: #007AFF;">{{service.service_status}}</view>
					</span>
					<span v-else>
						<view class="new_card_title_right" style="color: #007AFF;">{{service.service_status}}</view>
					</span>
				</span>
				<span v-if="service.status == 3">
					<view class="new_card_title_right" style="color: #07C160;">{{service.service_status}}</view>
				</span>
				<span v-if="service.status == -1">
					<span v-if="service.job_start_time == '00:00:00'">
						<view class="new_card_title_right" style="color: #EE0A24;">{{service.service_status}}</view>
					</span>
					<span v-else>
						<view class="new_card_title_right" style="color: #007AFF;">{{service.service_status}}</view>
					</span>
				</span>
			</view>
			<view class="service_title">
				<cl-row>
					<cl-col span="8">
						<view class="service_name">{{service.service_type_info.service_name}}</view>
					</cl-col>
					<cl-col span="8">
						<view class="first_job" >{{service.first_job}}</view>
					</cl-col>
					<cl-col span="8" v-if="service.customer.customer_type==203 || service.customer.customer_type==250">
						<view class="customer_type">工厂服务</view>
					</cl-col>
				</cl-row>
				<view>
				</view>
			</view>
			<view>
				<cl-icon name="cl-icon-my" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.contact.contact_name}}</text></span>
			</view>
			<view @tap="makePhone()">
				<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.contact.mobile}}</text></span>
			</view>
			<view @tap="makePhoneb()">
				<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.contact.tel}}</text></span>
			</view>
			<view>
				<cl-icon name="cl-icon-map" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;"><text selectable="true">{{service.customer.addr}}</text></span>
			</view>
			<!-- 任务信息 -->
			<view class="service_msg">服务信息</view>
			<view class="v_magin">
				项目：<span style="color: black;"><text selectable="true">{{service.project}}</text></span>
			</view>
			<view class="v_magin">
				时间：<text selectable="true">{{service.job_date}} {{service.job_start_time}}-{{service.job_end_time}}</text>
			</view>
			<view class="v_magin">
				人员：<span style="color: black;"><text selectable="true">{{service.staff.main}}</text></span>
			</view class="v_magin">
			<view class="v_magin">
				协作：<span style="color: black;"><text selectable="true">{{service.staff.other}}</text></span>
			</view class="v_magin">
			<span v-if="service.type==1">
				<view>
					设备：<span style="color: black;"><text selectable="true">{{service.Watchdog}}</text></span>
				</view>
			</span>
			<view class="v_magin">
				要求：<span style="color: black;"><span><text selectable="true">{{service.remarks}}</text></span></span>
			</view>
			<span>
				<view @tap="update_remarks" class="v_magin">
					技术员备注：<span style="color: black;">{{service.tech_remarks}}</span>&nbsp;
				</view>
			</span>
			<!-- 设备布防图 -->
			<view class="service_msg" style="color: #12900a;">设备布防图</view>
			<view class="block">
				<cl-row>
					<cl-col span="8" v-for="(item, index) in service.tech_attachment" :key="index">					    <cl-image size="200rpx" :src="fileUrl + '/' + item.file_path" :preview-list="service.tech_attachment.map(att => fileUrl + '/' + att.file_path)">					    </cl-image>					</cl-col>
				</cl-row>
			</view>
		</view>
		<!-- 按钮 -->
		<button class="tj_bu" v-if="service.status == 0">
			<span>加载中</span>
		</button>
		<button class="tj_bu" v-else @tap="start()"> 
			<view v-if="service.staff">
				<span v-if="service.status == 2">
					<span v-if="service.start_time == null || service.start_time == '00:00:00'">
						<span v-if="staffOther == service.staff.main">服务签到</span>
					</span>
					<span v-else>
						继续服务
					</span>
				</span>
				<span v-if="service.status == -1">
					<span v-if="service.start_time == null">服务未完成</span>
					<span v-else>继续服务</span>
				</span>
				<span v-if="service.status == 3">服务已完成</span>
			</view>
			<view v-else>
				<view v-if="service.status == 2">
					<span v-if="service.start_time == null">等待服务人员签到</span>
					<span v-else>
						查看服务报告
					</span>
				</view>
				<span v-if="service.status == -1">
					<span v-if="service.start_time == null">等待服务人员完成</span>
					<span v-else>查看服务报告</span>
				</span>
				<span v-if="service.status == 3">查看服务报告</span>
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
				staffOther:''
			}
		},
		onLoad(index) {
			//显示加载框
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			var loginRes = this.checkLogin();
			if (!loginRes) {
				uni.showToast({
					title: "请先登录",
					icon: 'none',
				});
				setTimeout(() => {
					return false
				}, 2000);
			}
			this.fileUrl = this.$baseUrl_imgs
			this.jobid = index.jobid
			this.jobtype = index.jobtype
		},
		onShow(index) {
			
			this.staffOther = uni.getStorageSync('staffname')
			this.service.Status = 0;
			this.data_select()
		},
		methods: {
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
				uni.request({
					url: `${this.$baseUrl}/Order.Order/getOrderInfo`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: params,
					success: (res) => {
						
						if (res.data.code == 200) {
							this.service = res.data.data;
							//隐藏加载框
							this.showContent = true;
							if (this.service.remarks && !this.acknowledged && this.service.status != 3) { // 判断 acknowledged 的值
								this.showConfirmationDialog('客户要求提示', this.service.remarks, () => {
								  this.acknowledged = true; // 用户已知晓
								}, () => {
								  uni.navigateBack();
								});
							}
							uni.hideLoading();
						}
						// 其它状态
						this.checkCode(res.data.code,res.data.msg)
					},
					fail: (err) => {
						//隐藏加载框
						uni.hideLoading();
						console.log(res);
					}
				})
			},
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			start() {
				// 签到
				console.log('签到时间:',this.service.start_date,this.service.start_time)
				// if(this.service.status == 3 || this.service.status == -1)
				// {
				// 	uni.navigateTo({
				// 		url: "/pages/service/start?jobid=" + this.jobid + "&jobtype=" + this.jobtype
				// 	})
				// }
				// if(this.service.status == 2)
				// {
					if(this.service.start_time && this.service.start_time !='00:00:00')
					{
						uni.navigateTo({
							url: "/pages/service/start?jobid=" + this.jobid + "&jobtype=" + this.jobtype
						})
					}
					if(!this.service.start_time || this.service.start_time == '00:00:00')
					{
						uni.navigateTo({
							url: "/pages/sign/sign?jobid=" + this.jobid + "&jobtype=" + this.jobtype + "&lat=" + this
								.service.lat + "&lng=" + this.service.lng + "&addr=" + this.service.customer.addr
						})
					}
				// }
			},
			// 点击拨打电话
			makePhone() {
				uni.makePhoneCall({
					phoneNumber: this.service.contact.mobile
				});
			},
			// 点击拨打电话
			makePhoneb() {
				uni.makePhoneCall({
					phoneNumber: this.service.contact.tel
				});
			},
			//历史记录
			history() {
				uni.redirectTo({
					url: "/pages/history/list?job_type=" + this.jobtype + "&job_date=" + this.service.job_date + "&service_type=" + this.service.service_type
					+ "&job_id=" + this.jobid
				})
			},
			//修改技术员备注
			update_remarks() {
				this.TechRemarks = this.service.TechRemarks;
				this.$refs.confirm2.open({title: "技术员备注修改"}).then(() => {
						uni.showLoading({
							title: "保存中..."
						});
						let params = {
							tech_remarks: this.TechRemarks,
							job_id: this.jobid,
							job_type: this.jobtype
						}
						uni.request({
							url: `${this.$baseUrl}/Order.Order/updateTeachRemarks`,
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								'token': uni.getStorageSync('token')
							},
							method: 'POST',
							data: params,
							success: (res) => {
								console.log('resresresres',res);
								uni.hideLoading();
								if (res.data.code == 200) {
									this.service.TechRemarks = this.TechRemarks;
									this.service.tech_remarks  = this.TechRemarks;
									this.$refs.toast.open(
										this.TechRemarks ? `修改成功！` : "填写为空！"
									);
								} else {
									this.$refs.toast.open("修改失败！");
								}
							},
							fail: (err) => {
								console.log(res);
							}
						})

					})
					.catch(() => {
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
</style>
