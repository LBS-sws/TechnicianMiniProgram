<template>
	<view v-if="isShowContent" class="content">
		<view class="demo">
			<cl-message ref="message"></cl-message>
		</view>
		<view class="avatorWrapper">
			<view class="avator">
				<image class="img" src="/static/images/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="title">
			技术员服务系统
		</view>
		<view class="form">
			<!-- 账号输入框 -->
			<view class="inputWrapper">
				<text class="cl-icon-my input-icon"></text>
				<input v-model="userPhone" class="input" type="text" placeholder="请输入账号" />
			</view>
			
			<!-- 密码输入框 -->
			<view class="inputWrapper">
				<text class="cl-icon-set input-icon"></text>
				<input v-if="!showPassword" v-model="userPwd" class="input" type="password" placeholder="请输入密码" />
				<input v-else v-model="userPwd" class="input" type="text" placeholder="请输入密码" />
				<text class="pwd-toggle" :class="showPassword ? 'cl-icon-eye-open' : 'cl-icon-eye-close'" @tap="showPassword = !showPassword"></text>
			</view>
			
			<!-- 登录按钮 -->
			<view class="loginBtn" @tap="submit">
				<text class="btnValue">登&nbsp;&nbsp;录</text>
			</view>
			
			<!-- 微信登录按钮 -->
			<view class="wechatBtn" @tap="wechatLogin">
				<image src="/static/icon/icon/wechat.png" class="wechatIcon" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	
	export default {
		data() {
			return {
				userPhone: '',
				userPwd: '',
				showPassword: false,
				isShowContent: true,
				//验证规则
				rules: {
					userPhone: {
						rule: /\S/,
						msg: "账号不能为空"
						// rule: /^1[3456789]\d{9}$/,
						// msg: "手机号格式错误"
					},
					userPwd: {
						rule: /\S/,
						msg: "密码不能为空"
					},
				},
			}
		},
		onLoad() {
			// 兼容性处理：如果 $api 未初始化，使用导入的 api
		if (!this.$api) {
			this.$api = api
		}
			let token = uni.getStorageSync('token')
			
			if(token) {
				uni.switchTab({
					url: "/pages/home/home"
				})
				return
			}
			
			// 延迟加载保存的账号和密码
			this.$nextTick(() => {
				const lastPhone = uni.getStorageSync('lastPhone')
				const lastPassword = uni.getStorageSync('lastPassword')
				if (lastPhone) {
					this.userPhone = lastPhone
				}
				if (lastPassword) {
					this.userPwd = lastPassword
				}
			})
		},
		methods: {
			//账号密码点击登录
			submit() {
				if (!this.validate('userPhone')) return;
				if (!this.validate("userPwd")) return;
				uni.showLoading({
					title: "登录中..."
				})
				
				//向服务器发送登陆请求
				let params = {
					staff_code:this.userPhone,
					password: this.userPwd
				}
				
				this.$api.passwordLogin(params).then(res=>{
					
					if(res.code == 200)
					{
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('staffname', res.data.name);
						uni.setStorageSync('user_id', res.data.user_id);
						uni.setStorageSync('city', res.data.city);
						uni.setStorageSync('officetel', res.data.officetel);
						uni.setStorageSync('setting_office_id', res.data.setting_office_id);
						uni.setStorageSync('agency_name', res.data.agency_name);
						uni.setStorageSync('staff_code', this.userPhone);
										
						// 登录成功，保存账号和密码
						uni.setStorageSync('lastPhone', this.userPhone);
						uni.setStorageSync('lastPassword', this.userPwd);
										
						uni.hideLoading();
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/home/home"
							});
						}, 2000)
					}
					if(res.code == 400)
					{
						uni.$utils.toast(res.msg)
						uni.hideLoading()
					}
				}).catch(err=>{
					console.log(err)
					uni.hideLoading()
				})
			},
			//判断验证是否符合要求，合法性校验
			validate(key) {
				let bool = true;
				if (!this.rules[key].rule.test(this[key])) {
					//提示信息
					uni.showToast({
						title: this.rules[key].msg,
						icon: 'none',
						duration: 2000,
					})
					//取反
					bool = false;
					return false;
				}
				return bool;
			},
			//微信登录
			wechatLogin() {
				uni.showLoading({
					title: "登录中..."
				})
				
				// 调用微信登录
				uni.login({
					provider: 'weixin',
					success: (res) => {
						console.log('WeChat Login Success:', res)
						// code 是微信授权码
						let params = {
							code: res.code
						}
						console.log('即将发送的参数:', params)
						// 向服务器发送微信登录请求
						this.$api.wechatLogin(params).then(loginRes => {
							uni.hideLoading();
							
							if (loginRes.code == 200) {
								// 检查是否需要绑定账户
								if (loginRes.data.need_bind) {
									// 保存微信openid，跳转到绑定页面
									uni.setStorageSync('wechat_openid', loginRes.data.openid);
									uni.showToast({
										title: '请绑定员工账户',
										icon: 'none'
									})
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/bind-account'
										});
									}, 1500)
								} else {
									// 直接登录成功
									uni.setStorageSync('token', loginRes.data.token);
									uni.setStorageSync('staffname', loginRes.data.name);
									uni.setStorageSync('user_id', loginRes.data.user_id);
									uni.setStorageSync('officetel', loginRes.data.officetel);
									uni.setStorageSync('setting_office_id', loginRes.data.setting_office_id);
									uni.setStorageSync('agency_name', loginRes.data.agency_name);
									uni.setStorageSync('staff_code', loginRes.data.code);
									uni.setStorageSync('lastPhone', loginRes.data.code);
									
									// 保存微信绑定信息
									if (loginRes.data.openid) {
										uni.setStorageSync('wechatInfo', {
											open_id: loginRes.data.openid,
											nickname: loginRes.data.name
										});
									}
									
									uni.showToast({
										title: '登录成功',
										icon: 'success'
									})
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/home/home"
										});
									}, 2000)
								}
							} else {
								uni.showToast({
									title: loginRes.msg || '登录失败',
									icon: 'none'
								})
							}
						}).catch(err => {
							console.log(err)
							uni.hideLoading()
							uni.showToast({
								title: '登录失败',
								icon: 'none'
							})
						})
					},
					fail: (err) => {
						console.log('WeChat Login Failed:', err)
						uni.hideLoading()
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		background: linear-gradient(180deg, #f5f7ff 0%, #ffffff 100%);
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
	}

	.title {
		text-align: center;
		margin-top: 15upx;
		font-size: 20px;
		color: #1a1a1a;
		font-weight: 400;
	}

	.avatorWrapper {
		height: 30vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.avator {
		width: 54%;
		height: 65px;
		overflow: hidden;
	}

	.avator .img {
		width: 100%
	}

	.form {
		padding: 0 30px;
		margin-top: 30px;
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
		position: relative;
	}

	.input-icon {
		font-size: 20px;
		color: #1051a5;
		flex-shrink: 0;
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
		text-align: left;
		font-size: 15px;
		border-radius: 0;
		border: none;
		flex: 1;
		min-width: 0;
		background: transparent;
		line-height: 80upx;
		padding-right: 40upx;
	}

	.pwd-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
		position: absolute;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 20px;
		color: #1051a5;
	}

	.form-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 15px;
		font-size: 13px;
	}

	.remember {
		color: #999;
	}

	.register {
		color: #1051a5;
	}


	.loginBtn {
		width: 100%;
		height: 80upx;
		background: transparent;
		border: 2px solid #1051a5;
		border-radius: 8upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loginBtn .btnValue {
		color: #1051a5;
		font-size: 18px;
		font-weight: 500;
	}

	.divider {
		text-align: center;
		margin: 20px 0;
		font-size: 14px;
		color: #999;
	}

	.wechatBtn {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30px auto 0;
	}

	.wechatBtn .wechatIcon {
		width: 50upx;
		height: 50upx;
	}

	.forgotBtn {
		display: none;
	}
</style>
