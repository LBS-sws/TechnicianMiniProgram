<template>
	<view>
		<!-- login view html start -->
		<view>
			<view>
				<view class="header"><image src="/static/img/public/login-wx.png"></image></view>
				<view class="content">
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>
				<button class="bottom" type="primary" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">授权登录</button>
			</view>
		</view>
		<!-- login view html end -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			appid: '*************',
			secret: '*************************',
			code: '',
			sessionKey: '',
			openId: '',
			userInfo: {
				avatarUrl: '',
				city: '',
				country: '',
				gender: 1,
				language: '',
				nickName: ''
			},
			pageOption: {}
		};
	},
	methods: {
		// 第一授权获取用户信息 ===》按钮触发
		wxGetUserInfo() {
			let _self = this;
			// 1.获取用户的信息
			uni.getUserInfo({
				provider: 'weixin',
				success: ( infoRes ) => {
					console.log( infoRes )
					_self.userInfo = infoRes.userInfo
					// 2.提交数据到后台、写入数据库
					uni.request({
						url: _self.apiServer + 'appletsUserInfo',
						data: {
							openid: _self.openId,
							avatarUrl: _self.userInfo.avatarUrl,
							city: _self.userInfo.city,
							country: _self.userInfo.country,
							gender: _self.userInfo.gender,
							language: _self.userInfo.language,
							nickName: _self.userInfo.nickName
						},
						method: 'POST',
						success: res => {
							if( res.data.code != 0 )
							{
								uni.showToast({ title: res.data.msg, icon: 'none' });
								return false;
							}
							// 用户信息写入缓存
							uni.showToast({title: '登录成功'})
							uni.setStorageSync( 'user_id', res.data.res.u_id );
							uni.setStorageSync( 'user_nm', res.data.res.u_nickName );
							uni.setStorageSync( 'user_fa', res.data.res.u_avatarUrl );
							uni.setStorageSync( 'user_nu', res.data.res.u_regtime );
							// 然后跳回原页面
							if( _self.pageOption.backtype == 1 )
							{
								uni.redirectTo({ url: _self.pageOption.backpage })
							}else{
								uni.switchTab({ url: _self.pageOption.backpage })
							}
						},
						fail: () => {
							uni.showToast({ title: '用户信息操作失败', icon: 'none' });
						}
					});
				},
				fail: () => {
					uni.showToast({ title: '获取用户信息失败', icon: 'none' });
				}
			});
			return false
		},
		// 登录
		login() {
			let _self = this;

			// 0. 显示加载的效果
			uni.showLoading({
				title: '登录中...'
			});

			// 1. wx 获取登录用户 code
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					console.log(loginRes);
					_self.code = loginRes.code;
					// 2. 将用户登录code传递到后台置换用户SessionKey、OpenId等信息
					uni.request({
						url:
							'https://api.weixin.qq.com/sns/jscode2session?appid=' +
							_self.appid +
							'&secret=' +
							_self.secret +
							'&js_code=' +
							_self.code +
							'&grant_type=authorization_code',
						success: codeRes => {
							console.log(codeRes);
							_self.openId = codeRes.data.openid;
							_self.sessionKey = codeRes.data.session_key;
							// 3.通过 openId 判断用户是否授权
							uni.request({
								url: _self.apiServer + 'loginApplets',
								data: {
									openid: _self.openId
								},
								method: 'POST',
								success: openIdRes => {
									console.log(openIdRes);
									// 隐藏loading
									uni.hideLoading();
									// 还没授权登录、请先授权然后登录
									if (openIdRes.data.code == 1) {
										// 提示消息、让用户授权
										uni.showToast({ title: openIdRes.data.msg, icon: 'none' });
									}
									// 已经授权了、查询到用户的数据了
									if (openIdRes.data.code == 0) {
										// 用户信息写入缓存
										uni.showToast({title: '登录成功'})
										uni.setStorageSync( 'user_id', openIdRes.data.res.u_id );
										uni.setStorageSync( 'user_nm', openIdRes.data.res.u_nickName );
										uni.setStorageSync( 'user_fa', openIdRes.data.res.u_avatarUrl );
										uni.setStorageSync( 'user_nu', openIdRes.data.res.u_regtime );
										// 然后跳回原页面
										if( _self.pageOption.backtype == 1 )
										{
											uni.redirectTo({ url: _self.pageOption.backpage })
										}else{
											uni.switchTab({ url: _self.pageOption.backpage })
										}
									}
								},
								fail: () => {
									uni.showToast({ title: '获取授权信息失败', icon: 'none' });
									return false;
								}
							});
						},
						fail: () => {
							uni.showToast({ title: '获取 SesssionKey OpenId 失败', icon: 'none' });
							return false;
						}
					});
				},
				fail: () => {
					uni.showToast({ title: '获取 code 失败', icon: 'none' });
					return false;
				}
			});
			return false;
		}
	},
	onLoad( options ) {
		// 接收跳转的参数
		this.pageOption = options
		//默认加载
		this.login();
	}
};
</script>

<style>
.header {
	margin: 90rpx 0 90rpx 50rpx;
	border-bottom: 1px solid #ccc;
	text-align: center;
	width: 650rpx;
	height: 300rpx;
	line-height: 450rpx;
}

.header image {
	width: 200rpx;
	height: 200rpx;
}

.content {
	margin-left: 50rpx;
	margin-bottom: 90rpx;
}

.content text {
	display: block;
	color: #9d9d9d;
	margin-top: 40rpx;
}

.bottom {
	border-radius: 80rpx;
	margin: 70rpx 50rpx;
	font-size: 35rpx;
}
</style>