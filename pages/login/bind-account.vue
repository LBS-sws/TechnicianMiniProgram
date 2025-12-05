<template>
	<view class="container">
		<view class="header">
			<view class="title">绑定员工账户</view>
			<view class="subtitle">请输入你的账号信息来完成绑定</view>
		</view>

		<view class="form">
			<!-- 账号输入框 -->
			<view class="inputWrapper">
				<text class="input-label">账号</text>
				<input v-model="userPhone" class="input" type="text" placeholder="请输入账号" />
			</view>

			<!-- 密码输入框 -->
			<view class="inputWrapper">
				<text class="input-label">密码</text>
				<input v-model="userPwd" class="input" type="password" placeholder="请输入密码" />
			</view>

			<!-- 绑定按钮 -->
			<view class="bindBtn" @tap="bindAccount">
				<text class="btnValue">绑定账户</text>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'

	export default {
		data() {
			return {
				api: null,
				userPhone: '',
				userPwd: '',
			}
		},
		created() {
			this.api = api
		},
		onLoad() {
			// 兼容性处理：如果 $api 未初始化，使用导入的 api
			if (!this.$api) {
				this.$api = api
			}
		},
		methods: {
			bindAccount() {
				if (!this.userPhone.trim()) {
					uni.showToast({
						title: '请输入账号',
						icon: 'none'
					})
					return
				}
				
				if (!this.userPwd.trim()) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '绑定中...'
				})

				// 获取保存的微信 openid
				const openid = uni.getStorageSync('wechat_openid')
				
				let params = {
					staff_code: this.userPhone,
					password: this.userPwd,
					openid: openid
				}

				// 调用绑定接口
				this.$api.bindWeixin(params).then(loginRes => {
					console.log('绑定响应:', loginRes)
					uni.hideLoading()

					if (loginRes.code == 200) {
						// 绑定成功，保存用户信息
						uni.setStorageSync('token', loginRes.data.token)
						uni.setStorageSync('staffname', loginRes.data.name)
						uni.setStorageSync('user_id', loginRes.data.user_id)
						uni.setStorageSync('officetel', loginRes.data.officetel)
						uni.setStorageSync('setting_office_id', loginRes.data.setting_office_id)
						uni.setStorageSync('agency_name', loginRes.data.agency_name)
						uni.setStorageSync('staff_code', loginRes.data.code)
						
						// 保存微信绑定信息
						if (openid) {
							uni.setStorageSync('wechatInfo', {
								open_id: openid,
								nickname: loginRes.data.name
							});
						}
						
						// 清除临时存储
						uni.removeStorageSync('wechat_openid')

						uni.showToast({
							title: '绑定成功',
							icon: 'success'
						})

						setTimeout(() => {
							uni.switchTab({
								url: '/pages/home/home'
							})
						}, 1500)
					} else {
						uni.showToast({
							title: loginRes.msg || '绑定失败',
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log('绑定错误:', err)
					uni.hideLoading()
					uni.showToast({
						title: err.msg || '绑定失败',
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style>
	.container {
		background: linear-gradient(180deg, #f5f7ff 0%, #ffffff 100%);
		width: 100vw;
		height: 100vh;
		padding: 20px 0;
		overflow-y: auto;
	}

	.header {
		padding: 40px 30px 30px;
		text-align: center;
	}

	.title {
		font-size: 24px;
		color: #1a1a1a;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.subtitle {
		font-size: 14px;
		color: #999;
	}

	.form {
		padding: 0 30px;
	}

	.inputWrapper {
		width: 100%;
		height: 80upx;
		background: #f8f8f8;
		border-radius: 8px;
		box-sizing: border-box;
		padding: 0 20px;
		margin-top: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1px solid #e8e8e8;
	}

	.input-label {
		font-size: 12px;
		color: #999;
		white-space: nowrap;
		flex-shrink: 0;
		width: 40upx;
		text-align: right;
	}

	.inputWrapper .input {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 15px;
		border-radius: 0;
		border: none;
		flex: 1;
		min-width: 0;
		background: transparent;
	}

	.bindBtn {
		width: 100%;
		height: 80upx;
		background: #5b8cff;
		border-radius: 8upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bindBtn .btnValue {
		color: white;
		font-size: 18px;
		font-weight: 500;
	}
</style>
