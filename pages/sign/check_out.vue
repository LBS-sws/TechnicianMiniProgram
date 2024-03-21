<template>

	<div class="signin">
		<cl-message ref="message"></cl-message>
		<view class="location">
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

			<van-cell class="field-cell" required title-width="70px" title="发票签收：">
				<view class="location">
					<cl-radio v-model="invoice" :label="1">是</cl-radio>
					<cl-radio v-model="invoice" :label="0">否</cl-radio>
				</view>
			</van-cell>
			<!-- upload -->
			<view class="bg-white" v-if="invoice=='1'">
				<!-- file -->
				<view class="service_content">
					<view label="限制上传图片格式/大小">
						<m-upload :url="upPicUrl" :header="headerUpload" :fileName="file" ref="upload3" title="添加照片"
							@upload="handleLoaded3" @change="handleChange3" :number="4" :formData="formData">
							<template v-slot:icon>
								<text class="s-add-list-btn-icon">+</text>
							</template>
						</m-upload>
					</view>
				</view>
			</view>
		</view>
		<view class="signin-area">
			<van-button v-if="sign_whether==1" class="signin-btn" type="primary" round :disabled="signin.isSignin"
				@click="handleSignin">
				<view class="label">签离</view>
				<view class="time">{{ signin.time }}</view>
			</van-button>
			<van-button v-else class="signin-btn" type="primary" round :disabled="signin.isSignin">
				<view class="label">请在一公里内签离</view>
			</van-button>
			<view class="signin-result" style="font-size: 16px;">
				<van-icon v-if="signin.count" name="checked" size="30rpx" color="#4cd964" style="margin-right:10rpx" />
				<text v-if="signin.count">签离成功</text>
				<text v-else>您还未签离</text>
			</view>
		</view>
	</div>
</template>

<script>
	import {
		formatDate,
	} from '@/utils'
	export default {
		data() {
			return {
				noClick: true,
				signin: {
					time: '', // 签到时间
					count: 0, // 签到时间
					isSignin: false //是否签到
				},
				// formData: {
				// 	signAddress: '', // 签到地址
				// 	longitude: '', // 经度
				// 	latitude: '' // 维度
				// },
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
				invoice: -1, // 0
				pictures: [],
				picturesx:[],		// 带http
				upload_site_photos: [],
				upPicUrl: `${this.$baseUrl}/Upload.Upload/image`,
				init_photos: [],
				headerUpload: {
					'token': uni.getStorageSync('token')
				},
				formData: {
					type:2
				},
			}
		},
		computed: {
			// ...mapGetters(['selectedLocation', 'selectedSearch'])
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

			if (index.autograph == 0) {
				this.$refs["message"].open({
					type: "warn",
					duration: 5000,
					top: "200rpx",
					message: "客户未签名",
				});
			}
			// this.getLocation()
			this.getTime()
			if (this.timerInterval) {
				clearInterval(this.timerInterval)
			} else {
				this.timerInterval = setInterval(this.getTime, 1000)
			}
			// this.checkLocationAuth();
		},
		methods: {
			handleChange3() {
				this.$refs.upload3.upload();
			},
			
			// 获取上传或者预览后的图片
			handleLoaded3(arr) {
				var imageStr = "";
				for (var i = 0; i < arr.length; i++) {
					imageStr += arr[i].result + ",";
				}
				//去掉最后一个逗号
				if (imageStr.length > 0) {
					imageStr = imageStr.substr(0, imageStr.length - 1);
				}
				// console.log(imageStr);
				this.upload_site_photos = imageStr
			},
			// 删除
			del() {
				return false
				this.$refs["del_confirm"].open({
					title: "提示",
					message: "确认删除？",
					callback: ({
						action
					}) => {
						if (action == 'confirm') {
							if (this.id == '' || this.id == 0) {
								uni.showToast({
									icon: 'none',
									title: '请选择'
								});
								return;
							} else {
								let params = {
									id: this.id,
								}
								this.$api.delRisk(params).then(res=>{
									if (res.code == 200) {
										uni.showToast({
											icon: 'none',
											title: '删除成功'
										});
										setTimeout(() => {
											uni.redirectTo({
												url: "/pages/service/risk?jobid=" +
													this.jobid + '&jobtype=' +
													this.jobtype
											})
										}, 2000)
									}
								}).catch(err=>{
									console.log(err)
								})
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: '取消成功'
							});
						}
					}
				});
			},
			// 预览轮播图
			previewImage: function(index) {
				var i = this.pictures;

				uni.previewImage({
					current: index, // 坐标
					urls: i // 数组
				})
			},
			// 删除
			delFile(index) {

				const pictures = this.pictures
				pictures.splice(index, 1)
				this.pictures = pictures
				
				const picturesx = this.picturesx
				picturesx.splice(index, 1)
				this.picturesx = picturesx
			},
			// ...mapMutations(['SET_SELECTED_SEARCH']),
			//开始服务签离
			handleSignin() {
				if (this.invoice == -1) {
					uni.showToast({
						title: '请选择是否有发票',
						icon: 'none'
					})
					return false
				}
				if (this.invoice == '1') {

					if (!this.upload_site_photos) {
						uni.showToast({
							title: '请上传发票图片！',
							icon: 'none'
						})

						return false;
					}
				}
				// if (!this.location.curLocation) {
				// 	this.getLocation()
				// } else {
					uni.showLoading({
						title: "签离中..."
					});
					this.getTime(new Date())
					// this.signin.count++
					console.log('签离数据：', this.formData)
					//签离成功调用接口
					this.sign_success(this.getDate(), this.signin.time)
				// }
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
							const address = '本次定位失败，可继续签离。'
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
									const address = '本次定位失败，可继续签离。'
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
			},

			rad(d) {
				return d * Math.PI / 180.0;
			},
			sign_success(signdate, starttime) {
				let pics = this.upload_site_photos
				let str = '';
				let is_invoice = this.invoice
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					pics: this.upload_site_photos,
					is_invoice:is_invoice,
				}
				this.$api.orderSignOut(params).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						this.signin.isSignin = true
						this.signin.count++
						clearInterval(this.timerInterval)
						
						uni.showToast({
							title: '签离成功',
							icon: 'success'
						})
						uni.navigateBack();
					} else {
					this.$refs["message"].open({
						type: "warn",
						duration: 2000,
						top: "200rpx",
						message: res.msg,
					});
					}
				}).catch(err=>{
					uni.showToast({
						title: err,
						icon: 'fail'
					})
				})
			}
		},
		watch: {
			selectedLocation(newData) {
				if (newData) {
					const {
						title,
						location
					} = newData
					this.formData.signAddress = title
					this.formData.longitude = location.lng
					this.formData.latitude = location.lat
					this.location.curLocation = newData
				}
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
		/deep/ .field-cell {
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
			padding-top: 100rpx;
			text-align: center;

			/deep/ .signin-btn {
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

	// 自定义上传样式
	.uni-file-picker__container {
		display: flex;
		box-sizing: border-box;
		flex-wrap: wrap;
		margin: -5px;

		.file-picker__box {
			position: relative;
			width: 33.3%;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;

			.file-picker__box-content {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				margin: 5px;
				border: 1px #eee solid;
				border-radius: 5px;
				overflow: hidden;
			}

			.file-picker__box-content {
				border-width: 1px;
				border-style: solid;
				border-color: #eee;
				border-radius: 3px;
			}

			.is-add {
				display: flex;
				align-items: center;
				justify-content: center;

				.icon-add {
					width: 50px;
					height: 5px;
					background-color: #f1f1f1;
					border-radius: 2px;
				}

				.rotate {
					position: absolute;
					-webkit-transform: rotate(90deg);
					transform: rotate(90deg);
				}
			}

		}
	}

	// 图片
	.file-image {
		width: 100%;
		height: 100%;
	}

	// 删除图标
	.icon-del-box {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 3px;
		right: 3px;
		height: 26px;
		width: 26px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 2;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);

		.icon-del {
			width: 15px;
			height: 2px;
			background-color: #fff;
			border-radius: 2px;
		}

		.rotate {
			position: absolute;
			-webkit-transform: rotate(90deg);
			transform: rotate(90deg);
		}
	}

	.bg-white {
		background: #fff;
	}
</style>
