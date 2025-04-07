<template>
	<view class="signin" :style="{ height: windowHeight + 'px' }">
		
		<view v-if="pageType == 1">
			<!-- 提示 -->
			<u-notify ref="notify" />
			<!-- 客户名称 -->
			<view class="customerInfo">
				<view class="title">{{customerInfo.name_zh}}</view>
				<view class="addr">{{customerInfo.addr}}</view>
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
			<!-- 签到窗 -->
			<view class="signin-area">
				
				<van-button v-if="sign_whether==1" class="signin-btn" type="primary" round :disabled="signin.isSignin"
					@click="handleSignin"
					:color="bgcolor">
					<view class="label">{{signin.text}}</view>
					<view class="time">{{ signin.time }}</view>
				</van-button>
				<van-button v-else class="signin-btn" type="primary" round :disabled="signin.isSignin">
					<view class="label">请在一公里内签到</view>
				</van-button>
			
				<view class="signin-result" style="font-size: 16px;">
					<van-icon v-if="signin.count" name="checked" size="30rpx" color="#4cd964" style="margin-right:10rpx" />
					<text v-if="signin.count">签到成功</text>
					<text v-else>
						<!-- 您还未签到 -->
					</text>
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
			
			<!---->
			<!-- <u-button @click="subSignIn">签到</u-button> -->
			<!---->
			
			<view class="reset_location"><view class="location_button" @click="resetLocation">重新定位</view></view>
			
			<u-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
				<view class="abnormal">
					<view class="title">异常签到/签离</view>
					
					<view class="item" v-for="(item,i) in abnormalList"  @click="exceptionHandle(i)">{{item.name}}</view>
					
				</view>
			</u-popup>
		</view>
		<view v-else-if="pageType == 2">
			<camera mode="normal" :device-position="devicePosition" :flash="flashStyle"
				:style="{ height: cameraHeight + 'px' }" @error="errorCamera">
				<cover-view class="controls" style="width: 100%;height: 100%;">
					<cover-view class="controls1-bgcolor"></cover-view>
					<cover-view class="controls2-bgcolor">
						<cover-view class="customerTitle">客户门店招牌</cover-view>
					</cover-view>
					<cover-view class="controls3-bgcolor"></cover-view>
				</cover-view>
			</camera>
			<view class="bottom font-36-fff">
				<view class="wrap">
					<view @click="takeCancel">
						取消
					</view>
					<view @click="takePhoto">
						<image class="w131-h131" :src="icon">
						</image>
					</view>
					
					<view class="back" @click="switchBtn">
						<image :src="flip" mode="" style="width: 60rpx; height: 60rpx;"></image>
					</view>
				</view>
			</view>
		</view>
		<view v-if="pageType == 3">
			<preview :Height="cameraHeight" :imgUrl="imgUrl" @retake="retake" @confirm="confirm"></preview>
		</view>
		
		<atl-map :disable="disable" v-if="mapShow" :longitude="longitude" :latitude="latitude" :marker="marker" :mapKey="key" :mapType="mapType" @confirm="confirmAmap">
		    <template v-slot:content>
		        <view style="position: absolute; bottom: 0; width: 100%; height: 24px; background-color: white">
		            <view style="display: flex; align-items: center; justify-content: center">
		                <text></text>
		            </view>
		        </view>
		    </template>
		</atl-map>
	
	</view>
</template>

<script>
import { formatDate, getUrlParamsStr } from '@/utils';
//引入高德地图sdk
import amap  from '@/utils/amap-wx.130.js';
import preview from '@/components/camera/preview.vue';
export default {
	components:{
		preview, 
	},
	data() {
		return {
			signin: {
				time: '', // 签到时间
				count: 0, // 签到时间
				isSignin: false ,//是否签到
				text:'拍照签到'
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
			
			customerInfo:{},
			bgcolor:'',
			signType:1,
			
			amapPlugin: null,
			addressName: '',  
			weather: {  
			    hasData: false,  
			    data: []  
			},
			// 当前定位
			point1:{
				longitude:'',
				latitude:''
			},
			point2:{
				longitude:'',
				latitude:''
			},
			distance:'', // 距离
			DistanceType:1,		// 距离类型1米，2千米
			val:1,
			show: false,
			abnormalList:[
				{id:1, name:'忘记打卡'},
				{id:2, name:'系统定位不准'},
				{id:3, name:'门店地址错误'},
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
			exceptionStatus:'',	// 异常：1忘记打卡 2定位不准 3地址错误
			key:'c6631b0a7212536acc8aa68df419f9b3',
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
			
			longitude:'',
			latitude:'',
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

		this.getTime()
		if (this.timerInterval) {
			clearInterval(this.timerInterval)
		} else {
			this.timerInterval = setInterval(this.getTime, 1000)
		}
		
		this.amapPlugin = new amap.AMapWX({
		    key: `${this.$amapApiKey}`
		}); 
		
		if (uni.createCameraContext) {
			this.cameraContext = uni.createCameraContext()
		} else {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			uni.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	},
	computed: {},
	onShow() {
		// 显示头部消息弹窗
		// this.$refs.notify.show({
		// 	type: 'warning',
		// 	message: '请找负责人沟通,了解门店情况!',
		// 	duration: 5000,
		// 	fontSize: 15,
		// 	icon: 'chat-fill'
		// })
		
		// 二次开发
		this.detail();
		this.getRegeo();
		
		const systemInfo = uni.getSystemInfoSync()
		this.windowHeight = systemInfo.windowHeight
		this.cameraHeight = systemInfo.windowHeight - 80

	},
	methods: {
		// 没有摄像头签到
		subSignIn(){
			let lng = this.longitude
			let lat = this.latitude
			
			let params = {
				job_id: this.jobid,
				job_type: this.jobtype,
				img_url:'/123123.png',
				type:this.DistanceType,
				status:1,	//1忘记打卡
				lng:lng,
				lat:lat,
				title:this.title,
				address:this.address
			}
			// console.log(params)
			// return false
			this.$api.orderSignIn(params).then(res=>{
				this.signin.isSignin = true
				uni.showToast({
					title: '操作成功',
					icon: 'success'
				})
				setTimeout(()=>{
					uni.redirectTo({
						url: "/pages/service/start?jobid=" + this.jobid + "&jobtype=" + this.jobtype
					})
				},1500)
			}).catch(err=>{
				uni.showToast({
					title: res.data.msg,
					icon: 'fail'
				})
			})
		},
		// 异常处理 - 弹框点击
		exceptionHandle(e){
			// console.log(e)
			
			// 1 忘记打开
			if(this.abnormalList[e].id == 1){
				this.exceptionStatus = 1
				this.pageType = 2
				this.paizhao()
			}
			// 2 系统定位不准
			if(this.abnormalList[e].id == 2){
				this.exceptionStatus = 2
				this.pageType = 2
				this.paizhao()
			}
			// 3 门店地址错误，打开地图选择
			if(this.abnormalList[e].id == 3){
				this.show = false
				this.mapShow = true;
			}
		},
		// 地图选择位置后回调
		confirmAmap(e){
			console.log('高德选择位置回调',e)

			this.mapShow = false
			
			this.longitude = e.longitude;
			this.latitude = e.latitude;
			this.title = e.title;
			this.address = e.address;
			
			this.exceptionStatus = 3
			this.pageType = 2
			this.paizhao()
		},
		// 使用此照片回调
		confirm(e){
			console.log(e.detault_url)
			this.imgUrl = `${this.$baseUrl_imgs}` + e.detault_url
			// return false
			clearInterval(this.timerInterval)
			this.signin.count++
			this.getTime(new Date())
			
			let lng = this.longitude
			let lat = this.latitude
			
			let params = {
				job_id: this.jobid,
				job_type: this.jobtype,
				img_url:e.detault_url,
				type:this.DistanceType,
				status:this.exceptionStatus,
				lng:lng,
				lat:lat,
				title:this.title,
				address:this.address
			}
			this.$api.orderSignIn(params).then(res=>{
				this.signin.isSignin = true
				uni.showToast({
					title: '操作成功',
					icon: 'success'
				})
				setTimeout(()=>{
					uni.redirectTo({
						url: "/pages/service/start?jobid=" + this.jobid + "&jobtype=" + this.jobtype
					})
				},1500)
			}).catch(err=>{
				uni.showToast({
					title: res.data.msg,
					icon: 'fail'
				})
			})
		},
		// 重拍回调
		retake(){
			this.pageType = 2
		},
		errorCamera(e){
			const that = this;
			uni.getSetting({
				success(res) {
					if (!res.authSetting["scope.camera"]) {
							uni.showModal({
								title: '提示',
								content: '请开启摄像头权限，否则无法拍照',
								confirmText: '去开启',
								success(res) {
									if (res.confirm) {
										uni.openSetting({
											success(res) {
												if (res.authSetting["scope.camera"]) {
													uni.navigateBack({
														delta: 1
													})
												} else {
													uni.navigateBack({
														delta: 1
													})
												}
											}
										})
									} else if (res.cancel) {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
					}
				}
			})
		},
		// 拍照
		takePhoto() {
			uni.showLoading({
				title: '拍摄中'
			})
			let that = this
			this.cameraContext.takePhoto({
				quality: 'normal',
				success: (res) => {
					console.log('拍摄照片', res)
					let idPhoto = res.tempImagePath;
					
					that.pageType = 3
					that.imgUrl = idPhoto
					
					uni.showToast({
						title: '拍照成功',
						icon: 'none',
						duration: 1200
					})
				},
				fail: (err) => {
					uni.showToast({
						title: '拍照失败，请检查系统是否授权',
						icon: 'none',
						duration: 1200
					})
				}
			})
		},
		//反转
		switchBtn() {
			if (this.devicePosition == 'front') {
				this.devicePosition = 'back'
			} else {
				this.devicePosition = 'front'
			}
		},
		// 拍照取消
		takeCancel(){
			this.pageType = 1
			this.imgUrl = ''
		},
		// 异常签到弹窗 关闭
		close(){
			this.show = false
		},
		// 异常签到弹窗
		open(){
			
		},
		// 重新定位
		resetLocation(){
			this.getRegeo()
		},
		// 高德获取位置
		getRegeo() {
		    uni.showLoading({  
		        title: '获取信息中'  
		    });  
		    this.amapPlugin.getRegeo({  
		        success: (data) => {  
		            console.log(data)  
		            this.addressName = data[0].name; 
					this.title = data[0].desc
					this.address = data[0].name
					
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
			let that = this
			let params = {
				id: this.jobid,
				job_type: this.jobtype
			}
			this.$api.getOrderInfo(params).then(res=>{
				
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
			}).catch(err=>{
				uni.hideLoading();
				console.log(err)
			})
		},
		// 签到按钮
		handleSignin() {
			
			if(this.DistanceType == 1){
				this.pageType = 2
				this.paizhao()
			}
			// 异常处理
			if(this.DistanceType == 2 || this.DistanceType == 3){
				console.log(this.abnormalList)
				this.show = true
			}
			return false
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
		// 拍照
		paizhao(){
			// if (uni.createCameraContext) {
			// 	this.cameraContext = uni.createCameraContext()
			// } else {
			// 	// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			// 	})
			// }
			this.devicePosition = 'back';
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
			 
				if (d >= 1000) {
					// 如果距离大于等于1000米（即1千米），则换算为千米并保留两位小数
					this.DistanceType = 3;
					this.signType = 3
					this.bgcolor = '#ff2f2f'
					
					// 红色 系统定位不准
					let oldArray = this.abnormalList
					const index = oldArray.findIndex(item => item.id === 2);
					if (index !== -1) {
					  oldArray.splice(index, 1);
					}

					this.abnormalList  = oldArray
					this.signin.text = '异常签到'
					return (d / 1000).toFixed(2);	// return (d / 1000).toFixed(2) + "千米";
				} else {
					if(d > 300 && d<1000){
						this.DistanceType = 2;
						this.signType = 2
						this.bgcolor = '#f59a23';
						
						this.abnormalList = [
							{id:1, name:'忘记打卡'},
							{id:2, name:'系统定位不准'},
							{id:3, name:'门店地址错误'}
						]
						this.signin.text = '异常签到'
					}else{
						this.DistanceType = 1;
						this.signType = 1
						this.bgcolor = '#007AFF'
						this.signin.text = '拍照签到'
					}
					
					return d.toFixed(0); // return d + "米";
				}
			},
			// end
	},
}

</script>

<style lang="scss" scoped>
.signin {
	position: relative;
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
			padding-top: 60rpx;
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
	}
}
.addrNow{
	font-size: 24rpx;
	color: #2196F3;
	padding:  40rpx 36rpx 0;
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
.custom-style {
		color: #ff0000;
		width: 400rpx;
	}
</style>
