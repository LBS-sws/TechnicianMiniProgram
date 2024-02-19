<template>
	<view class="content">
		<view class="user">
			<text class="user_phone">用户：{{user}}</text>
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
			officetel:'',
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
		this.user= uni.getStorageSync('staffname')
		this.officetel = uni.getStorageSync('officetel');
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
							// 请求接口
							uni.request({
								url: `${this.$baseUrl}/Staff.Login/logout`,
								header: {
									'content-type': 'application/x-www-form-urlencoded',
									'token': uni.getStorageSync('token')
								},
								method: 'GET',
								data: {},
								success: (res) => {
									// console.log(res)
									// if (res.data.code == 200) {
										
									// 	uni.showToast({
									// 		title: "成功退出",
									// 		icon: 'none',
									// 	});
									// 	setTimeout(() => {
									// 		uni.reLaunch({
									// 				url:"/pages/login/login"
									// 		})
									// 	}, 2000);
									// }else{
										console.log(res.data.code)
										uni.showToast({
											title: res.data.msg,
											icon: 'none',
										});
										if (res.data.code == 200) {
											uni.clearStorageSync()
											uni.reLaunch({
												url:"/pages/login/login"
											})
										}
										
									// }
								},
								fail: (err) => {
									// console.log('error' + res);
									uni.showToast({
										title: res.data.msg,
										icon: 'none',
									});
								}
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
	height: 120px;
	background-image: url(../../static/images/my.png);
	border-radius: 10px;
	text-align: center;
	display: flex;
	/*实现垂直居中*/
	align-items: center;
	/*实现水平居中*/
	justify-content: center;
	font-size: 17px;
}
.user_phone {
	display: table-cell;
	vertical-align: middle;
	margin: auto;
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
