<template>
	<view class="content">
		<view class="header">
			<text class="title">微信登录设置</text>
		</view>
		
		<view class="setting-section">
			<view class="section-title">当前微信账户</view>
			<view class="wechat-info" v-if="wechatInfo">
				<view class="info-item">
					<text class="label">昵称：</text>
					<text class="value">{{wechatInfo.nickname}}</text>
				</view>
				<view class="info-item">
					<text class="label">绑定状态：</text>
					<text class="value" style="color: #34C759;">已绑定</text>
				</view>
				<view class="button-group">
					<view class="btn unbind-btn" @tap="unbindWeChat">
						<text>解绑微信</text>
					</view>
				</view>
			</view>
			<view class="no-wechat" v-else>
				<text>还未绑定微信账户</text>
				<view class="button-group">
					<view class="btn bind-btn" @tap="bindWeChat">
						<text>绑定微信</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="setting-section">
			<view class="section-title">说明</view>
			<view class="description">
				<text>绑定微信后，可在登录页面使用微信一键登录，提升登录效率。</text>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/common/api.js'

export default {
	data() {
		return {
			wechatInfo: null
		}
	},
	onLoad() {
		// 兼容性处理：如果 $api 未初始化，使用导入的 api
		if (!this.$api) {
			this.$api = api
		}
		this.loadWechatInfo();
	},
	methods: {
		// 加载微信绑定信息
		loadWechatInfo() {
			const wechatData = uni.getStorageSync('wechatInfo');
			if (wechatData) {
				this.wechatInfo = wechatData;
			}
		},
		// 绑定微信
		bindWeChat() {
			// 获取当前登录用户的信息
			const staffCode = uni.getStorageSync('staff_code');
			const token = uni.getStorageSync('token');
			
			// 检查是否已登录（有 token）
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			// 如果没有 staff_code，使用 lastPhone 作为备用
			const accountInfo = staffCode || uni.getStorageSync('lastPhone');
			if (!accountInfo) {
				uni.showToast({
					title: '获取账户信息失败，请重新登录',
					icon: 'none'
				});
				return;
			}
			
			uni.showLoading({
				title: "绑定中..."
			})
			
			const self = this;
			
			uni.login({
				provider: 'weixin',
				success: (res) => {
					console.log('WeChat Login Success:', res);
					const code = res.code;
					
					let params = {
						code: code,
						staff_code: accountInfo
					}
					
					console.log('即将发送的参数:', params);
					
					// 调用绑定接口，后端会从 code 中获取 openid
					self.$api.bindWeixin(params).then(result => {
						console.log('绑定响应:', result);
						uni.hideLoading();
						if (result.code == 200) {
							// 保存微信信息
							uni.setStorageSync('wechatInfo', result.data);
							self.wechatInfo = result.data;
							uni.showToast({
								title: '绑定成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: result.msg || '绑定失败',
								icon: 'none'
							});
						}
					}).catch(err => {
						console.log('绑定错误:', err);
						uni.hideLoading();
						uni.showToast({
							title: '绑定失败',
							icon: 'none'
						});
					});
				},
				fail: (err) => {
					uni.hideLoading();
					console.log('微信授权失败:', err);
					uni.showToast({
						title: '微信授权失败',
						icon: 'none'
					});
				}
			});
		},
		// 解绑微信
		unbindWeChat() {
			uni.showModal({
				title: '确认解绑',
				content: '解绑后将无法使用微信一键登录',
				confirmText: '确认',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: "解绑中..."
						})
						
						let params = {};
						if (this.wechatInfo && this.wechatInfo.open_id) {
							params.openid = this.wechatInfo.open_id;
						}
						
						this.$api.unbindWeixin(params).then(result => {
							uni.hideLoading();
							if (result.code == 200) {
								uni.removeStorageSync('wechatInfo');
								this.wechatInfo = null;
								uni.showToast({
									title: '解绑成功',
									icon: 'success'
								});
							} else {
								uni.showToast({
									title: result.msg || '解绑失败',
									icon: 'none'
								});
							}
						}).catch(err => {
							uni.hideLoading();
							uni.showToast({
								title: '解绑失败',
								icon: 'none'
							});
						});
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.content {
	background: #f5f5f5;
	min-height: 100vh;
	padding: 10px;
}

.header {
	background: white;
	padding: 15px;
	margin-bottom: 10px;
	border-radius: 8px;
}

.title {
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
}

.setting-section {
	background: white;
	margin-bottom: 10px;
	border-radius: 8px;
	overflow: hidden;
}

.section-title {
	padding: 15px;
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
	border-bottom: 1px solid #f0f0f0;
}

.wechat-info {
	padding: 15px;
}

.info-item {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	font-size: 13px;
}

.label {
	color: #999;
	min-width: 70px;
}

.value {
	color: #333;
	flex: 1;
}

.no-wechat {
	padding: 30px 15px;
	text-align: center;
	color: #999;
	font-size: 13px;
}

.button-group {
	display: flex;
	gap: 10px;
	margin-top: 20px;
}

.btn {
	flex: 1;
	padding: 12px;
	border-radius: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	color: white;
}

.bind-btn {
	background: #09b83e;
}

.unbind-btn {
	background: #E91E63;
}

.description {
	padding: 15px;
	font-size: 12px;
	color: #666;
	line-height: 1.6;
}
</style>
