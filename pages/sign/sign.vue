<template>
	<view class="signin">
		<!-- 定位 -->
<!--		<view class="location">-->
<!--			<van-cell class="field-cell" required title-width="70px" title="当前定位：">-->
<!--				<view v-if="formData.signAddress" class="location">-->
<!--					{{ formData.signAddress }}-->
<!--				</view>-->
<!--				<view v-if="location.error" class="error">-->
<!--					{{ location.errorInfo }}-->
<!--				</view>-->
<!--				<van-loading v-if="location.loading" size="26rpx">-->
<!--					定位中...-->
<!--				</van-loading>-->
				<!-- <van-button v-if="location.error" slot="right-icon" type="primary" size="mini" @click="getLocation">
					重试
				</van-button>
				<van-button v-if="location.curLocation" slot="right-icon" type="primary" size="mini"
					@click="handleSelect" style="background-color: #007AFF;">
					位置微调
				</van-button> -->
<!--			</van-cell>-->
<!--		</view>-->

		<!-- 提示 -->
		<u-notify ref="notify" />
		
		<!-- 签到窗 -->
		<view class="signin-area">
			<van-button v-if="sign_whether==1" class="signin-btn" type="primary" round :disabled="signin.isSignin"
				@click="handleSignin">
				<view class="label">签到</view>
				<view class="time">{{ signin.time }}</view>
			</van-button>
			<van-button v-else class="signin-btn" type="primary" round :disabled="signin.isSignin">
				<view class="label">请在一公里内签到</view>
			</van-button>

			<view class="signin-result" style="font-size: 16px;">
				<van-icon v-if="signin.count" name="checked" size="30rpx" color="#4cd964" style="margin-right:10rpx" />
				<text v-if="signin.count">签到成功</text>
				<text v-else>您还未签到</text>
			</view>
		</view>

	</view>
</template>

<script>import { formatDate } from '@/utils'
export default {
	data() {
		return {
				signin: {
					time: '', // 签到时间
					count: 0, // 签到时间
					isSignin: false //是否签到
				},
				formData: {
					signAddress: '', // 签到地址
					longitude: '', // 经度
					latitude: '' // 维度
				},
				location: {
					loading: true,
					error: false,
					errorInfo: '定位失败',
					curLocation: null // 当前位置信息
				},
				jobid: '',
				jobtype: '',
				lat: '',
				lng: '',
				sign_whether: 1,
				addr: '',
				addrlat: '',
				addrlng: '',

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
			this.lat = index.lat
			this.lng = index.lng
			this.addr = index.addr
			// this.getLocation()
			this.getTime()
			if (this.timerInterval) {
				clearInterval(this.timerInterval)
			} else {
				this.timerInterval = setInterval(this.getTime, 1000)
			}
			// this.checkLocationAuth();
		},
		computed: {
			// ...mapGetters(['selectedLocation', 'selectedSearch'])
		},
		onShow() {
			// 显示头部消息弹窗
			this.$refs.notify.show({
				type: 'warning',
				message: '请找负责人沟通,了解门店情况!',
				duration: 5000,
				fontSize: 15,
				icon: 'chat-fill'
			})
		},
	methods: {
			handleSignin() {
				clearInterval(this.timerInterval)
				this.signin.count++
				this.getTime(new Date())
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
				}
				this.$api.orderSignIn(params).then(res=>{
					this.signin.isSignin = true
					uni.showToast({
						title: '签到成功',
						icon: 'success'
					})
					uni.redirectTo({
						url: "/pages/service/start?jobid=" + this.jobid + "&jobtype=" + this.jobtype
					})
				}).catch(err=>{
					uni.showToast({
						title: res.data.msg,
						icon: 'fail'
					})
				})
			},
			// 获取当前时间时分秒
			getTime(time) {
				time = time ? new Date(time) : new Date()
				this.signin.time = formatDate(time, 'HH:mm:ss')
			},
			/**
			 * 获取当前时间
			 * 格式YYYY-MM-DD
			 */
			getDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},

			//单独提取一个判断用户是否授权定位的函数，在需要的地方直接调用，避免了重复触发getLocation获取定位弹窗
			checkLocationAuth() {
				wx.getSetting({
					success: (res) => {
						let authSetting = res.authSetting
						if (authSetting['scope.userLocation']) {
							// 已授权
							this.getLocation()
						} else if (authSetting['scope.userLocation'] === false) {
							wx.showModal({
								title: '您未开启地理位置授权',
								content: '请在系统设置中打开位置授权，以便我们为您提供更好的服务',
								success: (res) => {
									if (res.confirm) {
										wx.openSetting()
									}
								}
							})
							console.log("失败了4")
							const address = '本次定位失败，可继续签到。'
							this.formData.signAddress = address
							this.location.curLocation = address
							this.location.loading = false
							this.location.error = true
						} else {
							wx.authorize({
								scope: 'scope.userLocation',
								success: () => {
									this.getLocation()
								},
								fail: () => {
									wx.showModal({
										title: '您未开启地理位置授权',
										content: '请在系统设置中打开位置授权，以便我们为您提供更好的服务',
										success: (res) => {
											if (res.confirm) {
												wx.openSetting()
											}
										}
									})

									console.log("失败了3")
									const address = '本次定位失败，可继续签到。'
									this.formData.signAddress = address
									this.location.curLocation = address
									this.location.loading = false
									this.location.error = true
								}
							})
						}
					}
				})
			},
			// 获取当前定位
			getLocation() {
				console.log("进来了1");
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						// const {
						// 	latitude,
						// 	longitude
						// } = res;
						let ret = transformFromGCJToBaidu(res.latitude,res.longitude)
						console.log("ret")
						console.log(ret)
						uni.request({
							url: `${this.$mapApiUrl}`,
							data: {
								ak: `${this.$mapApiKey}`,
								output: 'json',
								coordtype: 'gcj02',
								location: `${ret.latitude},${ret.longitude}`
							},
							success: (lres) => {
								const address = lres.data.result.formatted_address
								this.formData.signAddress = address
								this.location.curLocation = address
								this.location.error = false
								this.location.loading = false
								console.log(lres);
							},
							error: (e) => {
								console.log("失败了1")
								const address = '本次定位失败，可继续签离。'
								this.formData.signAddress = address
								this.location.curLocation = address
								this.location.loading = false
								this.location.error = true
							}
						});
					},
					error: (e) => {
						console.log("失败了2")
						const address = '本次定位失败，可继续签离。'
						this.formData.signAddress = address
						this.location.curLocation = address
						this.location.loading = false
						this.location.error = true
					}
				});
			}
		}
}
	/**
	 *  将GCJ-02(火星坐标)转为百度坐标:
	 */
function transformFromGCJToBaidu(latitude, longitude) {
	  var pi = 3.14159265358979324 * 3000.0 / 180.0;

	  var z = Math.sqrt(longitude * longitude + latitude * latitude) + 0.00002 * Math.sin(latitude * pi);
	  var theta = Math.atan2(latitude, longitude) + 0.000003 * Math.cos(longitude * pi);
	  var a_latitude = (z * Math.sin(theta) + 0.006);
	  var a_longitude = (z * Math.cos(theta) + 0.0065);

	  return { latitude: a_latitude, longitude: a_longitude };
}
</script>

<style lang="scss" scoped>
.signin {
		:deep .field-cell {
			.cell-field {
				.van-cell {
					padding: 0;
				}
			}

			.van-cell__value {
				display: flex;
				align-items: center;

				.location {
					text-align: left;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					flex: 1;
				}
			}
		}

		.signin-area {
			padding-top: 200rpx;
			text-align: center;

			:deep .signin-btn {
				.van-button {
					width: 260rpx;
					height: 260rpx;
					box-shadow: 0px 12rpx 30rpx 0px rgba(25, 137, 250, 0.34);
					background-color: #007AFF;
				}

				.label {
					font-size: 30rpx;
					line-height: 42rpx;
					color: $uni-text-color-inverse;
				}

				.time {
					font-size: 40rpx;
					line-height: 56rpx;
				}
			}

			.signin-result {
				color: $uni-text-color-grey;
				font-size: 24rpx;
				line-height: 34rpx;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
}
</style>
