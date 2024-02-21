<template>
	<view class="content">
		<view class="my_card">
			<view class="cust_name">
				{{service.customer.name_zh}}
				
				<span v-if="service.status == 2">
					<span v-if="service.StartTime == '00:00:00'">
						<view class="new_card_title_right" style="color: #007AFF;">待服务</view>
					</span>
					<span v-else>
						<view class="new_card_title_right" style="color: #007AFF;">服务中</view>
					</span>
				</span>
				<span v-if="service.Status == 3">
					<view class="new_card_title_right" style="color: #07C160;">已完成</view>
				</span>
				<span v-if="service.Status == -1">
					<span v-if="service.StartTime == '00:00:00'">
						<view class="new_card_title_right" style="color: #EE0A24;">未完成</view>
					</span>
					<span v-else>
						<view class="new_card_title_right" style="color: #007AFF;">服务中</view>
					</span>
				</span>
			</view>
			<view class="service_title">
				<cl-row>
					<cl-col span="8">
						<view class="service_name">{{service.service_type_info.service_name}}</view>
					</cl-col>
				  <cl-col span="8">
					<view v-if="jobtype == 1" class="first_job">
					  <!-- {{ service.FirstJob == 1 ? '首次服务' : '常规服务' }} -->
					  {{service.first_job}}
					</view>
					<view v-else-if="jobtype != 1" class="first_job">跟进服务</view>
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
				<span style="color: #9c9595;">{{service.contact.contact_name}}</span>
			</view>
			<view @tap="makePhone()">
				<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;">{{service.contact.mobile}}</span>
			</view>
			<view @tap="makePhoneb()">
				<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;">{{service.contact.tel}}</span>
			</view>
			<view>
				<cl-icon name="cl-icon-map" style="margin-right: 6px;color: #007AFF;"></cl-icon>
				<span style="color: #9c9595;">{{service.customer.addr}}</span>
			</view>
			<!-- 任务信息 -->
			<view class="service_msg">服务信息</view>
			<view>
				项目：<span style="color: black;">{{service.service_projects}}</span>
			</view>
			<view>
				时间：<span style="color: black;">{{service.job_date}} &nbsp;
					{{service.job_start_time}}-{{service.job_end_time}}</span>
			</view>
			<view>
				人员：<span style="color: black;">{{service.staff.main}}</span>
			</view>
			<view>
				协作：<span style="color: black;">{{service.staff.other}}</span>
			</view>
			<span v-if="service.type==1">
				<view>
					设备：<span style="color: black;">{{service.Watchdog}}</span>
				</view>
			</span>
			<view>
				要求：<span style="color: black;">{{service.remarks}}</span>
			</view>
			<span v-if="service.type==1">
				<view @tap="update_remarks">
					技术员备注：<span style="color: black;">{{service.TechRemarks}}</span>&nbsp;
				</view>
			</span>

			<!-- 设备布防图 -->
			<view class="service_msg" style="color: #12900a;">设备布防图</view>
			<view class="block">
				<cl-row>
					<cl-col span="8" v-for="(item,index) in service.set_img" :key="index">
						<cl-image size="200rpx" :src="item" :preview-list="service.set_img">
						</cl-image>
					</cl-col>
				</cl-row>
			</view>
		</view>

		<!-- <view class="new_card">
			<view class="new_card_title">
				<view class="new_card_title_left">
					<span class="xh">|</span>
					客户信息
				</view>
			</view>

			<view class="new_card_content">
				<view>
					<cl-icon name="cl-icon-my" style="margin-right: 6px;color: #007AFF;"></cl-icon>
					<span style="color: black;">{{service.ContactName}}</span>
				</view>
				<view @tap="makePhone()">
					<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
					<span style="color: black;">{{service.Mobile}}</span>
				</view>
				<view>
					<cl-icon name="cl-icon-keyboard-9" style="margin-right: 6px;color: #007AFF;"></cl-icon>
					<span style="color: black;">其他联系方式：{{service.Tel}}</span>
				</view>
				<view>
					<cl-icon name="cl-icon-map" style="margin-right: 6px;color: #007AFF;"></cl-icon>
					<span style="color: black;">{{service.Addr}}</span>
				</view>
			</view>
		</view> -->

		<!-- 	<view class="new_card">
			<view class="new_card_title">
				<view class="new_card_title_left">
					<span class="xh">|</span>
					设备布置图
				</view>
			</view>
			<view class="new_card_content">
				<cl-image size="200rpx" :src="service.set_img" :preview-list="[service.set_img]">
				</cl-image>
			</view>
		</view> -->

		<button class="tj_bu" @tap="report_detail()">
			查看服务报告
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'历史任务',
				service: {},
				jobid: '',
				jobtype: '',
				service_type: '',
			}
		},
		onLoad(index) {
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
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			
			this.getItem()
		},
		methods: {
			// 详情
			getItem() {
				let params = {
					job_type:this.jobtype,
					id:this.jobid
				}
				this.$api.getOrderInfo(params).then(res=>{
					this.service = res.data
				}).catch(err=>{
					console.log(err)
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
			// 点击拨打电话
			makePhone() {
				uni.makePhoneCall({
					phoneNumber: this.service.Mobile
				});
			},
			//历史记录
			report_detail() {
				uni.navigateTo({
					url: "/pages/history/report_detail?jobid=" + this.jobid + "&jobtype=" + this.service.order_type
				})
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
		width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		padding-bottom: 10px;
		margin: 10px 0px;
		padding: 10px;
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
</style>
