<template>
	<view v-if="isShowContent" class="content">
		<view class="demo">
			<cl-message ref="message"></cl-message>
			<!-- <cl-button @tap="onTap">提示</cl-button> -->
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
			<view class="inputWrapper">
				<input v-model="userPhone" class="input" type="phone" value="" placeholder="请输入用户名" required />
			</view>
			<view class="inputWrapper">
				<input v-model="userPwd" class="input" type="password" value="" placeholder="请输入密码" required />
			</view>
			<view class="loginBtn" @tap="submit">
				<text class="btnValue">登录</text>
			</view>
			<!-- <view class="forgotBtn">
				<text>找回密码?</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userPhone: '',
				userPwd: '',
				isShowContent: true,
				//验证规则
				rules: {
					userPhone: {
						rule: /\S/,
						msg: "用户名不能为空"
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
			let token = uni.getStorageSync('token')
			
			if(token)
			{
				uni.switchTab({
					url: "/pages/home/home"
				})
			}
		},
		onShow() {
			
		},
		methods: {
			//账号密码点击登录
			submit() {
				let that = this;

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
						uni.hideLoading();
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})

						//没有openid 则获取
						if(res.data.openid==null||!res.data.openid){
							wx.login({
								success: function (wxres) {
									// console.log('wx.login:',wxres.code)
									that.$api.getOpenid({code:wxres.code,user_id:res.data.user_id}).then(res=>{
										if(res.code == 200){
											uni.setStorageSync('openid', res.data);
										}
									}).catch(err=>{
										console.log(err)
									})
								}
							})
						}else{
							uni.setStorageSync('openid', res.data.openid);
						}

						setTimeout(() => {
							uni.switchTab({
								url: "/pages/home/home"
							});
						}, 2000)
					}
					if(res.code == 400)
					{
						uni.$utils.toast(res.msg)
					}
				}).catch(err=>{
					console.log(err)
				})
				
				//隐藏登录状态
				uni.navigateBack({
					delta: 1
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
		}
	}
</script>

<style>
	.content {
		background: #FFFFFF;
		width: 100vw;
		height: 100vh;
	}

	.title {
		text-align: center;
		margin-top: 2%;
		font-size: 18px;
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
		padding: 0 100upx;
		margin-top: 70px;
	}

	.inputWrapper {
		width: 100%;
		height: 80upx;
		background: white;
		border-radius: 20px;
		box-sizing: border-box;
		padding: 0 20px;
		margin-top: 25px;
	}

	.inputWrapper .input {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 16px;
		border-radius: 60px;
		border: 1px solid #007aff;
	}

	.radioitems {
		margin: 20px;

	}

	.loginBtn {
		width: 100%;
		height: 80upx;
		background: #308cf1;
		border-radius: 50upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.loginBtn .btnValue {
		color: white;
		font-size: 18px;
	}

	.forgotBtn {
		text-align: center;
		color: #808080;
		font-size: 12px;
		margin-top: 20px;
	}
</style>
