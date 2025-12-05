<template>
	<view class="content">
		<view class="user">
			<view class="user-info">
				<view class="info-item">
					<text class="info-label">账号</text>
					<text class="info-value">{{userPhone}}</text>
				</view>
				<view class="info-item">
					<text class="info-label">姓名</text>
					<text class="info-value">{{user}}</text>
				</view>
				<view class="info-item">
					<text class="info-label">办公室</text>
					<text class="info-value">{{agency_name}}</text>
				</view>
			</view>
		</view>
		<!-- <cl-list-item label="意见反馈" class="top">
			<text slot="append" class="cl-icon-arrow-right"></text>
		</cl-list-item> -->
		<cl-list-item label="关于我们" class="bot" @tap="aboutus()">
			<text slot="append" class="cl-icon-arrow-right"></text>
		</cl-list-item>
		<cl-list-item label="联系我们" class="bot" @tap="makePhone()">
			<text slot="append" class="cl-icon-arrow-right"></text>
		</cl-list-item>
		<cl-list-item label="登录设置" class="bot" @tap="goSetting()">
			<text slot="append" class="cl-icon-arrow-right"></text>
		</cl-list-item>
		<cl-list-item label="退出登录" @tap="loginout()">
			<text slot="append" class="cl-icon-arrow-right"></text>
		</cl-list-item>
		<cl-toast ref="cl-toast"></cl-toast>
		<cl-action-sheet ref="cl-action-sheet"></cl-action-sheet>
		<cl-confirm ref="cl-confirm"></cl-confirm>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user:'',
			userPhone: '',
			agency_name: '',
			officetel:'',
			setting_office_id: ''
		}
	},
	onLoad() {
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
		this.user = uni.getStorageSync('staffname')
		this.userPhone = uni.getStorageSync('staff_code')
		this.agency_name = uni.getStorageSync('agency_name');
		this.officetel = uni.getStorageSync('officetel');
		this.setting_office_id = uni.getStorageSync('setting_office_id');
	},
	methods: {
		//关于我们
		aboutus(){
			uni.navigateTo({
				url: "/pages/my/aboutus"
			});
		},
		// 点击拨打电话
		makePhone() {
			uni.makePhoneCall({
				phoneNumber: this.officetel //仅为示例
			});
		},
		// 设置页面
		goSetting() {
			uni.navigateTo({
				url: "/pages/my/wechat-setting"
			});
		},
		loginout() {
			this.$refs["cl-action-sheet"].open({
				list: [{
						label: "退出登录会清除你的登录信息，确认退出吗？",
						disabled: true,
						size: "26rpx"
					},
					{
						label: "退出登录",
						color: "red",
						click: done => {
							let params = {}
							this.$api.logout(params).then(res=>{
								setTimeout(()=>{
									// 保留上次登录的账号和密码
									const lastPhone = uni.getStorageSync('lastPhone')
									const lastPassword = uni.getStorageSync('lastPassword')
									uni.clearStorageSync()
									if (lastPhone && lastPassword) {
										uni.setStorageSync('lastPhone', lastPhone)
										uni.setStorageSync('lastPassword', lastPassword)
									}
									uni.reLaunch({
										url:"/pages/login/login"
									})
								},1500)
								uni.showToast({
									title: res.msg,
									icon: 'none',
								});
							}).catch(err=>{
								uni.showToast({
									title: '退出失败',
									icon: 'none',
								});
							})
						}
					}
				],
				callback: ({
					action
				}) => {
					uni.showToast({
						title: "取消成功",
						icon: 'none',
					});
				}
			});
		},
	}
}
</script>

<style>
.content {
	margin: 10px;
}
.user {
	color: #FFFFFF;
	background: linear-gradient(135deg, #0e8cf1, #1ca2df 100%);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18px 20px;
	margin-bottom: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.user-info {
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
}
.info-item {
	display: flex;
	align-items: center;
	gap: 8px;
}
.info-label {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.75);
	min-width: 48px;
	font-weight: 400;
}
.info-value {
	font-size: 14px;
	color: #FFFFFF;
	font-weight: 500;
}
.top {
	margin-top: 10px;
	border-bottom: 1px solid #f9f9f9;
}
.bot {
	border-bottom: 1px solid #f9f9f9;
}
.cl-list-item__label {
	padding: 0 20rpx 0 0;
	font-size: 30rpx;
}
</style>
