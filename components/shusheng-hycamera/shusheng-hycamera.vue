<template>
	<view class="hycamera">

		<camera   class="hycamera-camera" device-position="back" flash="auto"></camera>
		<!-- <view :class="buttonClass" @touchstart="buttonStart" @touchend="buttonEnd">
			{{buttonNumber}}
		</view> -->
		
		<view class="video">
			<video v-if="srcUrl" id="myVideo" :src="srcUrl" controls></video>
		</view>
		
		<view class="hycamera-button1" @touchstart="buttonStart">{{buttonNumber}}</view>
		<view class="hycamera-button2" @touchend="buttonEnd">222</view>
	</view>
</template>

<script>
	 
	export default {
		data() {
			return {
				buttonClass: "hycamera-button",
				isLX: false,
				buttonNumber:"",
				
				srcUrl:''
			}
		},
		created() {
			uni.authorize({
			    scope: 'scope.record',
			    success() {
			      
			    }
			})
			
			this.cameraCTX = uni.createCameraContext();
	
		},
		methods: {
		
			buttonStart() {
				console.log('开始')
				let self = this
				this.buttonNumber = 0;
				this.buttonMethod = setInterval(function() {
					self.buttonNumber++
					if(self.buttonNumber<2){
						self.cameraCTX.startRecord({
							success: (res) => {},
							fail(res) {
								console.log(self.buttonNumber)
								console.log("========= 调用开始录像失败 ===========",res)
							}
						})
					}
					
					
				},1000)
				false;
				// let self = this
				// this.buttonNumber = 0;
				// this.buttonMethod = setInterval(function() {
				// 	self.buttonNumber++
					
				// 	if (self.buttonNumber > 0) {
				// 		self.buttonClass = "hycamera-button-lx"
				// 		if (self.isLX == false) {
				// 			self.isLX = true
						
				// 			self.cameraCTX.startRecord({
				// 				success: (res) => {},
				// 				fail(res) {
				// 					console.log("========= 调用开始录像失败 ===========",res)
				// 				}
				// 			})
				// 		}
				// 	}
				// }, 1000)
			},
			buttonEnd() {
				let self = this
				clearInterval(this.buttonMethod)
				this.buttonClass = "hycamera-button"
				this.isLX = false
				
				if (this.buttonNumber > 0) {
			
					this.cameraCTX.stopRecord({
						success: (res) => {
							this.$emit("runMethod","vedio",res)
							console.log(res.tempVideoPath)
							this.srcUrl = res.tempVideoPath
							
							uni.uploadFile({
							    // url:  `http://localhost:9526/Index/upload`,
								url:  `https://yyl.miyil.com/index/upload`,
							    filePath: res.tempVideoPath,
							    name: 'file',
							    formData: {
							        // 'user': 'test'
									'token': uni.getStorageSync('token')
							    },
							    success: (uploadFileRes) => {
									console.log(uploadFileRes)
							        // const responseData = JSON.parse(uploadFileRes.data);
							        // if (responseData.code === 1) {
							        //     // 提取视频地址并赋值给 videoUrl 变量，根据实际返回数据结构调整
							        //     this.videoUrl = responseData.data.fullurl;
							        //     this.showText = false;
							        //     uni.showToast({
							        //         title: '视频上传成功',
							        //         icon: 'success'
							        //     });
							        // } else {
							        //     uni.showToast({
							        //         title: '视频上传成功，但返回数据格式不符预期',
							        //         icon: 'none'
							        //     });
							        // }
							    },
							    fail: (err) => {
							        console.log(err, '文件上传失败');
							        uni.showToast({
							            title: '视频上传失败，请检查网络或文件格式是否正确',
							            icon: 'none'
							        });
							    }
							});
							
							self.buttonNumber = ""
						},
						fail() {}
					})
				} else {
		
					this.cameraCTX.takePhoto({
						quality: 'high',
						success: (res) => {
							this.$emit("runMethod","photo",res)
							self.buttonNumber = ""

						}
					})
				}
				
				
			}
		}
	}
</script>

<style>
	.hycamera {
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 10000000;
	}

	.hycamera-camera {
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 1;
	}

	.hycamera-button {
		height: 100px;
		width: 100px;
		position: absolute;
		z-index: 2;
		background-color: #3F536E;
		bottom: 50px;
		left: 50%;
		margin-left: -50px;
		border: 2px solid #ffffff;
		border-radius: 50px;
		transition: all 0.2s linear;
		text-align: center;
		line-height: 100px;
		color:#ffffff;
		font-size: 30px;
	}

	.hycamera-button:active {
		background-color: #1c2632;
	}

	.hycamera-button-lx {
		height: 100px;
		width: 100px;
		position: absolute;
		z-index: 2;
		background-color: #ca0000;
		bottom: 50px;
		left: 50%;
		margin-left: -50px;
		border: 2px solid #ffffff;
		border-radius: 50px;
		text-align: center;
		line-height: 100px;
		color:#ffffff;
		font-size: 30px;
	}
	.hycamera-qh{
		height: 40px;
		width: 40px;
		position: absolute;
		z-index: 2;
		bottom: 80px;
		left: 20px;
	}
	
.hycamera-button1 {
		height: 100px;
		width: 100px;
		position: absolute;
		z-index: 2;
		background-color: #3F536E;
		bottom: 50px;
		left: 30%;
		margin-left: -50px;
		border: 2px solid #ffffff;
		border-radius: 50px;
		transition: all 0.2s linear;
		text-align: center;
		line-height: 100px;
		color:#ffffff;
		font-size: 30px;
	}
	.hycamera-button2 {
		height: 100px;
		width: 100px;
		position: absolute;
		z-index: 2;
		background-color: #999;
		bottom: 50px;
		left: 60%;
		margin-left: -50px;
		border: 2px solid #ffffff;
		border-radius: 50px;
		transition: all 0.2s linear;
		text-align: center;
		line-height: 100px;
		color:#ffffff;
		font-size: 30px;
	}
.video{
	height: 300px;
	width: 100%;
	position: absolute;
	z-index: 2;
	background-color: #999;
	top: 0;
	left: 60%;
	margin-left: -50px;

}
</style>
