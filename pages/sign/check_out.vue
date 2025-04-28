<template>

	<div class="signin">
		<cl-message ref="message"></cl-message>
		<van-loading v-if="location.loading" size="26rpx">
			定位中...
		</van-loading>
		<view class="location">
			<!-- 客户名称 -->
			<view class="customerInfo">
				<view class="title">{{customerInfo.name_zh}}</view>
				<view class="addr">{{customerInfo.addr}}</view>
				<!-- <view class="time">已服务时间:{{formatTime}}</view> -->
			</view>
			<view class="addrNow" v-if="addressName">
				<view>当前位置：{{addressName}} 
				</view>
				<view>
					距离门店
					：{{distance}}
									<text v-if="DistanceType == 1 || DistanceType == 2">米</text>
									<text v-else>千米</text>
				</view>
			</view>
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
				@click="handleSignin" :color="bgcolor">
				<view class="label">{{signin.text}}</view>
				<view class="time">{{ signin.time }}</view>
			</van-button>
			<van-button v-else class="signin-btn" type="primary" round :disabled="signin.isSignin">
				<view class="label">请在一公里内签离</view>
			</van-button>
			<view class="signin-result" style="font-size: 16px;">
				<van-icon v-if="signin.count" name="checked" size="30rpx" color="#4cd964" style="margin-right:10rpx" />
				<text v-if="signin.count">签离成功</text>
				<text v-else><!-- 您还未签离 --></text>
			</view>
		</view>
		
		<view class="container-sign">
			<view class="sign_info success" v-if="signType==1">
				<view class="icon_ui">i</view>
				<view class="text">已进入签到范围，可正常签到</view>
			</view>
			<view class="sign_info danger" v-else-if="signType==2">
				<view class="icon_ui">i</view>
				<view class="text">检测到你暂未进入可签到区，请距离客户门店<text class="red">300米内</text>,若继续签到将会记录<text class="red">异常签到</text></view>
			</view>
			<view class="sign_info error">
				
			</view>
		</view>
		<view class="reset_location"><view class="location_button" @click="resetLocation">重新定位</view></view>
		
		<!-- 异常签离弹出 -->
		<u-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
			<view class="abnormal">
				<view class="title">异常签到/签离</view>
				<view class="item" v-for="(item,i) in abnormalList"  @click="exceptionHandle(i)">{{item.name}}</view>
			</view>
		</u-popup>
		
	</div>
</template>

<script>
import {formatDate, getUrlParamsStr} from '@/utils'
//引入高德地图sdk
import amap  from '@/utils/amap-wx.130.js';
	export default {
		data() {
			return {
				noClick: true,
				signin: {
					time: '', // 签到时间
					count: 0, // 签到时间
					isSignin: false ,//是否签到
					text:''
				},
				location: {
					loading: true,
					error: false,
					errorInfo: '定位失败',
					curLocation: null // 当前位置信息
				},
				jobid: '',
				jobtype: '',
				sign_whether: 1,
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
				staffSign: 0,
				
				customerInfo:{},
				bgcolor:'',
				signType:1,
				point1:{	// 当前定位
					longitude:'',
					latitude:''
				},
				point2:{
					longitude:'',
					latitude:''
				},
				exceptionStatus:'',
				amapPlugin: null, 
				addressName: '',  
				weather: {  
					hasData: false,
					data: []
				},
				distance:'', // 距离
				DistanceType:1,		// 距离类型1米，2千米
				val:1,
				show: false,
				abnormalList:[
					{id:1, name:'忘记打卡'},
					{id:2, name:'系统定位不准'},
				],
				flip: '../../static/flip.png', // 反转
				icon: '../../static/icon.png', // 相机
				cameraContext: {},
				windowHeight: '',
				cameraHeight: '',
				idcardFrontSide: true,
				devicePosition: 'back', // 摄像头默认后置
				flashStyle: 'off',
				imgUrl:'',
				pageType:1,
				exceptionStatus:'',	// 异常：1忘记打卡 2定位不准
				
				// 地图
				marker: {
				    id: 1,
				    height: 50,
				    width: 40
				},
				mapType: 'amap',
				mapShow: false,
				disable: false,
				title: '',
				address: '',
				qlType:1,
				date:'',
				
				isTiming: false,
				time: 0,
				timer: null,
				longitude:'',
				latitude:'',
			}
		},
		computed: {
			// ...mapGetters(['selectedSearch'])
			formatTime() {
					   
			 var hours = Math.floor(this.time / 3600); // 获取小时数
			 var minutes = Math.floor((this.time % 3600) / 60); // 获取分钟数
			 var seconds = this.time % 60; // 获取秒数
			 
			 return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
			}
		},
		onLoad(index) {
			var loginRes = this.checkLogin();
			if (!loginRes) {
				uni.showToast({title: "请先登录",icon: 'none',});

				setTimeout(() => {
					return false
				}, 2000);
			}

			this.jobid = index.jobid
			this.jobtype = index.jobtype
			
			this.staffSign = index.staffSign
			this.qlType = index.qlType
			this.date = index.date

			// if (index.staffSign == 0) {
			// 	this.$refs["message"].open({type: "warn",duration: 5000,top: "200rpx",message: "技术员未签名"});
			// 	return;
			// }
			
			// if (index.autograph == 0) {
			// 	this.$refs["message"].open({
			// 		type: "warn",
			// 		duration: 5000,
			// 		top: "200rpx",
			// 		message: "客户未签名",
			// 	});
			// }
			
			this.getTime()
			if (this.timerInterval) {
				clearInterval(this.timerInterval)
			} else {
				this.timerInterval = setInterval(this.getTime, 1000)
			}
			this.checkLocationAuth();
		},
		onShow() {
			
			this.amapPlugin = new amap.AMapWX({
				key: `${this.$amapApiKey}`
			});
			console.log('高德地图key:',`${this.$amapApiKey}`)
			
			if (uni.createCameraContext) {
				this.cameraContext = uni.createCameraContext()
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
			
			this.detail()
			
			this.getRegeo();
			
			const systemInfo = uni.getSystemInfoSync()
			this.windowHeight = systemInfo.windowHeight
			this.cameraHeight = systemInfo.windowHeight - 80
			console.log('cameraHeight:',this.cameraHeight)
		},
		methods: {
			//单独提取一个判断用户是否授权定位的函数，在需要的地方直接调用，避免了重复触发getLocation获取定位弹窗
			checkLocationAuth() {
				wx.getSetting({
					success: (res) => {
						let authSetting = res.authSetting
						if (authSetting['scope.userLocation']) {
							// 已授权
							this.getRegeo()
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
									this.getRegeo()
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
			startTimer() {
				this.isTiming = true
				this.timer = setInterval(() => {
					this.time++
				}, 1000)
			},
			stopTimer() {
				this.isTiming = false
				clearInterval(this.timer)
			},
			// 异常签离选择事件
			exceptionHandle(e){
				console.log(e)
				
				this.exceptionStatus = this.abnormalList[e].id
				this.handleSignin()
			},
			// 异常签离 弹窗
			open(){
				
			},
			// 异常签离 弹窗关闭
			close(){
				this.show = false
			},
			// 重新定位
			resetLocation(){
				this.getRegeo()
			},
			// 高德获取位置
			getRegeo() {
				let that = this
				uni.showLoading({
					title: '获取信息中'
				});
				that.amapPlugin.getRegeo({  
					success: (data) => {  
			   //          console.log(data)  
			
						//  this.detail()
						console.log(data)
						this.addressName = data[0].name; 
						
						this.point2.latitude = data[0].latitude
						this.point2.longitude = data[0].longitude
						
						this.longitude = this.point2.longitude
						this.latitude = this.point2.latitude
						
						this.distance = this.getDistance(this.point2, this.point1);
						uni.hideLoading(); 

						this.detail()
				}  
				});  
			},
			// 详情
			detail(){
				let params = {
					id: this.jobid,
					job_type: this.jobtype
				}
				this.$api.getOrderInfo(params).then(res=>{
					
					// console.log(res)
					this.customerInfo = res.data.customer
					
					
					// 坐标转换
					const paramsObj = {
						key: `${this.$amapWebApiKey}`,
						locations: [`${res.data.customer.lng},${res.data.customer.lat}`],
						coordsys:'baidu',
						output: 'json'
					}
					const paramsStr = getUrlParamsStr(paramsObj)
					uni.request({
						url: 'https://restapi.amap.com/v3/assistant/coordinate/convert?' + paramsStr,
						method: "get",
						dataType: "json",
						header: {
							'Content-Type': 'application/json'
						},
						success: (resx) => {
							// console.log('resx:',resx.data.locations)
							if(resx.data.status==1){
								let arr = resx.data.locations.split(",");
								console.log(arr)
								
								this.point1.longitude = parseFloat(arr[0])
								this.point1.latitude = parseFloat(arr[1])
								console.log('公司经度：',this.point1.longitude,'公司维度：',this.point1.latitude)
								
								console.log('高德经度：',this.point2.longitude,'高德维度：',this.point2.latitude)
								
								this.longitude = this.point2.longitude
								this.latitude = this.point2.latitude
								
								this.distance = this.getDistance(this.point2, this.point1);
								
								console.log('距离：',this.distance);
							}else{
								uni.showToast({
									title:'经纬度转换失败',
									icon:'none'
								})
							}
							
						},
						fail: (res) => {
							reject('经纬度解析地址失败')
						}
					});
					
					this.time = res.data.service_time	// 服务时间
					this.startTimer();
					
				}).catch(err=>{
					uni.hideLoading();
					console.log(err)
				})
			},
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
				// if (this.staffSign == 0) {
				// 	uni.showToast({title: '技术员未签名',icon: 'none'})
				// 	return;
				// }

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
				console.log(this.DistanceType)
				// 异常签离
				if(this.DistanceType == 2 && !this.exceptionStatus)
				{
					this.show = true
					return false
				}
				if(this.DistanceType == 3 && this.exceptionStatus=='')
				{
					this.show = true
					return false
				}
				// console.log('继续')
				// return false
				// if (!this.location.curLocation) {
				
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
			rad(d) {
				return d * Math.PI / 180.0;
			},
			sign_success(signdate, starttime) {
				let that = this
				let pics = this.upload_site_photos
				let str = '';
				let is_invoice = this.invoice
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					pics: this.upload_site_photos,
					is_invoice:is_invoice,
					ql_type:this.qlType,
					date:this.date,
					type:this.DistanceType,
					status:this.exceptionStatus,
					lng:this.point2.longitude,
					lat:this.point2.latitude,
					// title:this.title,
					addr:this.address,
					signdate:'',
					starttime:'',
					status:this.exceptionStatus
				}
				
				this.show = false	// 异常签离 弹窗关闭
				// return false
				this.$api.orderSignOut(params).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						that.signin.isSignin = true
						that.signin.count++
						clearInterval(this.timerInterval)
						
						uni.showToast({
							title: '签离成功',
							icon: 'success'
						})
						
						if(this.qlType==2){
							uni.navigateTo({
								url: "/pages/service/detail?jobtype=" + this.jobtype + "&jobid=" + this.jobid
							});
						}else{
							uni.navigateBack();
						}

						//更新工单报表
						// setTimeout(()=>{
						// 	that.makePdf();
						// },2000)
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
			},
			makePdf(){
				let that = this

				//更新工单报告
				let formData = {
						'data':JSON.stringify([{'job_id':that.jobid,'job_type':that.jobtype}]),
						'send':1,
						'sync':1
					}
				uni.request({
					url: `${that.$baseUrl}/Order.Order/makePdf`,
					header: {
						'token': uni.getStorageSync('token'),
						'Content-type':'application/x-www-form-urlencoded'
					},
					method:'POST',
					data: formData,
					success: (res) => {
						// console.log(res.data);
						console.log('更新工单成功')
					}
				});
			},
						//根据金纬度计算距离
			getDistance(point1, point2) {
				let R = 6371000; // 地球平均半径，单位：米
				let lat1 = point1.latitude * Math.PI / 180;
				let lat2 = point2.latitude * Math.PI / 180;
				let lon1 = point1.longitude * Math.PI / 180;
				let lon2 = point2.longitude * Math.PI / 180;
				let a = Math.sin((lat2 - lat1) / 2) * Math.sin((lat2 - lat1) / 2) +
						Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) * Math.sin((lon2 - lon1) / 2);
				let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				let d = R * c; // 初始计算得到的距离，单位：米
				console.log('d',d)
				if (d >= 1000) {
					// 如果距离大于等于1000米（即1千米），则换算为千米并保留两位小数
					this.DistanceType = 3;
					this.signType = 3
					this.bgcolor = '#ff2f2f'
					
					// 红色 系统定位不准
					let oldArray = this.abnormalList
			// 		const index = oldArray.findIndex(item => item.id === 2);
			// 		if (index !== -1) {
			// 		  oldArray.splice(index, 1);
			// 		}
			
			// 		this.abnormalList  = oldArray
					this.signin.text = '异常签离'
					return (d / 1000).toFixed(2);
				} else {
					if(d > 300 && d<1000){
						this.DistanceType = 2;
						this.signType = 2
						this.bgcolor = '#f59a23';
						
						this.abnormalList = [
							{id:1, name:'忘记打卡'},
							{id:2, name:'系统定位不准'}
						]
						this.signin.text = '异常签离'
					}else{
						this.DistanceType = 1;
						this.signType = 1
						this.bgcolor = '#007AFF'
						this.signin.text = '签离'
					}
					
					return d.toFixed(0);
				}
			},
		},
		watch: {
	
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
		::v-deep .field-cell {
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

			::v-deep .signin-btn {
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
// 二次开发 YM
.customerInfo{
	padding:  48rpx 36rpx 0 36rpx;
	.title{
		font-size: 28rpx;
		font-weight: 400;
		color: #333;
		margin-bottom: 2rpx;
	}
	.addr{
		font-size: 24rpx;
		color: #7F7F7F;
		margin-bottom: 2rpx;
	}
	.time{
		font-size: 28rpx;
		font-weight: 400;
		color: #333;
		
	}
}
.container-sign{
	padding: 120rpx 34rpx 0 34rpx;
	.sign_info{
		border-radius: 4px;
		width: 100%;
	}
	.sign_info.success{
		border: 1rpx solid #00b578;
		background: rgba(0, 181, 120, 0.2);
		
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 26rpx;
		color: #333;
		padding: 14rpx 24rpx;
		box-sizing: border-box;
		.icon_ui{
			background: #00b578;
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			font-size: 24rpx;
			font-weight: 700;
			color: #fff;
			text-align: center;
			margin-right: 20rpx;
		}
	}
	.sign_info.danger{
		border: 1rpx solid #f59a23;
		background: rgba(245, 154, 35, 0.2);
		
		display: flex;
		justify-content: flex-start;
		font-size: 26rpx;
		color: #333;
		padding: 18rpx 24rpx;
		box-sizing: border-box;
		.icon_ui{
			background: #f59a23;
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			font-size: 24rpx;
			font-weight: 700;
			color: #fff;
			text-align: center;
			margin-right: 20rpx;
		}
		.text{
			width: calc(100% - 50rpx);
			line-height: 38rpx;
		}
		.red{
			color: red;
		}
	}
}
.reset_location{
	position: absolute;
	bottom:40rpx;
	left:0;
	right: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	.location_button{
		font-size: 26rpx;
		color: #007AFF;
	}
}
.abnormal{
	padding: 0 64rpx;
	.title{
		font-size: 36rpx;
		font-weight: 700;
		color: #333;
		padding: 54rpx 0;
		text-align: center;
	}
	.item{
		margin-bottom: 36rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #333;
		height: 80rpx;
		border:  1rpx solid rgba(215, 215, 215, 1);
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
	}
}
.controls {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.controls1-bgcolor {
	list-style: none;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 14%;
	background-color: rgba(248, 248, 248, 0.6);
}
.controls2-bgcolor {
	list-style: none;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 110%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	.customerTitle{
		position: absolute;
		top: 50%;
		right: 0;
		text-align: center;
		transform: rotate(90deg);
		color: #fff;
		font-weight: bold;
	}
}
.controls2-bgcolor1 {
	width: 7%;
	height: 150%;
	background-color: rgba(248, 248, 248, 0.6);
}
.controls3-bgcolor {
	list-style: none;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 14%;
	background-color: rgba(248, 248, 248, 0.6);
}
.bottom {
	width: 100%;
	background-color: #000;
	.wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80px;
		padding: 0 73rpx;
	}
	.wrap2{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80px;
		padding: 0 73rpx;
	}
}
.w131-h131 {
	width: 131rpx;
	height: 131rpx;
}
.font-36-fff {
	font-size: 36rpx;
	color: #fff;
}
.imgbox{
	display: flex;
	justify-content: center;
	align-items: center;
	image{
		width: 100%;
		max-height: 325px;
	}
}
.addrNow{
	font-size: 24rpx;
	color: #2196F3;
	padding:  40rpx 36rpx 0;
}
</style>
