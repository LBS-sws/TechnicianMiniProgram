<template>
	<view>
		<view class="wrapper">
			<view class="handBtn">
				<image @click="selectColorEvent('black','#1A1A1A')"
					:src="selectColor === 'black' ? '/static/other/color_black_selected.png' : '/static/other/color_black.png'"
					:class="[selectColor === 'black' ? 'color_select' : '', 'black-select']"></image>
				<image @click="selectColorEvent('red','#ca262a')"
					:src="selectColor === 'red' ? '/static/other/color_red_selected.png' : '/static/other/color_red.png'"
					:class="[selectColor === 'red' ? 'color_select' : '', 'black-select']"></image>
				<button @click="retDraw" class="delBtn">重写</button>
				<!-- <button @click="saveCanvasAsImg" class="saveBtn">保存</button> --><!--class_name previewBtn/saveBtn-->
				<button @click="previewCanvasImg" class="saveBtn">预览</button>
				<button @click="$noMultipleClicks(subCanvas)" class="subBtn">完成</button>
			</view>
			<view class="handCenter">
				<canvas class="handWriting" :disable-scroll="true" @touchstart="uploadScaleStart"
					@touchmove="uploadScaleMove" canvas-id="handWriting"></canvas>
			</view>
			<view class="handRight">
				<view class="handTitle">请签名</view>
			</view>
		</view>
	</view> 
</template>

<script>
	export default {
		data() {
			return {
				name:'签名',
				canvasName: 'handWriting',
				ctx: '',
				startX: null,
				startY: null,
				canvasWidth: 0,
				canvasHeight: 0,
				selectColor: 'black',
				lineColor: '#1A1A1A', // 颜色
				lineSize: 5, // 笔记倍数
				content:'',
				isTouch:false,
				jobid:'',
				jobtype:'',
				autograph_employee01_signature:null,
				autograph_employee02_signature:null,
				autograph_employee03_signature:null,
				noClick:true,
				is_main:''
			};
		},
		onLoad(index) {
			this.ctx = uni.createCanvasContext("handWriting");
			this.$nextTick(() => {
				uni.createSelectorQuery().select('.handCenter').boundingClientRect(rect => {
						this.canvasWidth = rect.width;
						this.canvasHeight = rect.height+10;
						/* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
						this.setCanvasBg('#fff');
					})
					.exec();
			});
			
			//登录检查
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
			this.is_main = index.is_main
			this.getStaffAutograph()
		},
		methods: {
			getStaffAutograph() {
				uni.showLoading({
					title: "数据加载中...",
					icon: 'none',
					mask: true
				})
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype                                                                                                                                                                                                                                                              
				}
				console.log(params)
			
				uni.request({
					url: `${this.$baseUrl}/Saveautograph/getStaffAutograph`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: params,
					success: (res) => {
						uni.hideLoading()
						if(res.data.code == 0){
							let result = res.data.data
							this.autograph_employee01_signature = result.autograph.employee01_signature?result.autograph.employee01_signature:null
							this.autograph_employee02_signature = result.autograph.employee02_signature?result.autograph.employee02_signature:null
							this.autograph_employee03_signature = result.autograph.employee03_signature?result.autograph.employee03_signature:null
						}else{
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
						}
					},
					fail: (err) => {
						uni.hideLoading()
						console.log('error' + res);
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						});
					}
				})
			},
			
			// 笔迹开始
			uploadScaleStart(e) {
				this.startX = e.changedTouches[0].x
				this.startY = e.changedTouches[0].y
				//设置画笔参数
				//画笔颜色
				this.ctx.setStrokeStyle(this.lineColor)
				//设置线条粗细
				this.ctx.setLineWidth(this.lineSize)
				//设置线条的结束端点样式
				this.ctx.setLineCap("round") //'butt'、'round'、'square'
				//开始画笔
				this.ctx.beginPath()
			},
			goBack() {
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 1]??'';
				// #ifdef H5
				prevPage.$vm.testdata = this.content;
				// #endif
				// #ifdef MP-WEIXIN
				 prevPage.setData(this.content);
				 console.log("this.content")
				 console.log(this.content)
				// #endif
				uni.navigateBack({//返回
					delta: 1
				})
			},
			
			// 笔迹移动
			uploadScaleMove(e) {
				//取点
				let temX = e.changedTouches[0].x
				let temY = e.changedTouches[0].y
				//画线条
				this.ctx.moveTo(this.startX, this.startY)
				this.ctx.lineTo(temX, temY)
				this.ctx.stroke()
				this.startX = temX
				this.startY = temY
				this.ctx.draw(true)
				this.isTouch = true
			},
			/**
			 * 重写
			 */
			retDraw() {
				this.ctx.clearRect(0, 0, 700, 730);
				this.ctx.draw();
				//设置canvas背景
				this.setCanvasBg('#fff');
			},
			/**
			 * @param {Object} str
			 * @param {Object} color
			 * 选择颜色
			 */
			selectColorEvent(str, color) {
				this.selectColor = str;
				this.lineColor = color;
			},
			//完成
			subCanvas() {
				var that = this;
				if(that.isTouch){
					uni.canvasToTempFilePath({
						canvasId: 'handWriting',
						fileType: 'png',
						quality: 1, //图片质量
						success(res) {
							uni.showLoading({
								title: "保存中..."
							});
							console.log(res.tempFilePath, 'canvas生成图片地址');
							// return false
							// let data = that.pngToBase64(res.tempFilePath,'png');
							// data.then(result=> {
								var pages = getCurrentPages();
								var prevPage = pages[pages.length - 2]; //上一个页面
								 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
								// 上一个页面最后设置userdata
								
								let formData = {
									// staffid: uni.getStorageSync('staffid'),
									job_id: that.jobid,
									job_type: that.jobtype,
									is_main: that.is_main,
									// file:res.tempFilePath
									// employee01_signature:that.autograph_employee01_signature,
									// employee02_signature:that.autograph_employee02_signature,
									// employee03_signature:that.autograph_employee03_signature,
									// customer_signature:result,
									
								}
								uni.uploadFile({
                      url: `${that.$baseUrl}/Sign.Sign/uploadSign`,
                      name: 'file',
						header: {
						  'Content-Type': 'multipart/form-data',
						  'token': uni.getStorageSync('token')
						},
                      formData: formData,
                      filePath: res.tempFilePath,
                      success: (res) => {
                        let data = JSON.parse(res.data)
                        uni.$emit('startSign_s', data.code)

                        uni.hideLoading()
                        console.log(res, '上传结果')
                        if (data.code == 200) {
                          // 上传成功
                          console.log('上传成功')
                        } else {
                          // 上传失败
                          uni.showToast({
                            title: data.msg,
                            icon: 'error',
                            duration: 2000
                          })
                        }
                        // Pass data back to the previous page
                        const pages = getCurrentPages();
                        const prevPage = pages[pages.length - 2];
                        prevPage.setData({
                          customer_signature_url: data.data.customer_signature_url,
                          is_new: 1
                        });
                        uni.navigateBack({
                          delta: 1
                        });
                      },
                      fail: (err) => {
                        uni.showToast({
                          title: err.errMsg,
                          icon: 'error',
                          duration: 2000
                        });
                      }
                    });
								// uni.request({
								// 	url: `${that.$baseUrl}/Sign.Sign/uploadSign`,
								// 	header: {
								// 		// 'content-type': 'application/x-www-form-urlencoded',
								// 		 'Content-Type': 'multipart/form-data',
								// 		'token': uni.getStorageSync('token')
								// 	},
								// 	name:"file",
								// 	method: 'POST',
								// 	 formData: formData,
								// 	 filePath: res.tempFilePath,
								// 	// data: param,
								// 	success: (res) => {
								// 		uni.hideLoading();
								// 		console.log(res)
								// 		// uni.$emit('startSign_s', res.data.code)
								// 		// if (res.data.code == 1) {
								// 		// 	uni.showToast({
								// 		// 		title: res.data.msg,
								// 		// 		icon: 'none',
								// 		// 	});
								// 		// } else {
								// 		// 	uni.showToast({
								// 		// 		title: res.data.msg,
								// 		// 		icon: 'none',
								// 		// 	});
								// 		// }
								// 	},
								// 	fail: (err) => {
								// 		console.log(res);
								// 	}
								// })
								prevPage.setData({
									customer_signature: result,
									is_base64: 1
								})
								
								uni.navigateBack({//返回
									delta: 1
								})
								
							// })
						}
					});
				}else{
					uni.showToast({
						title: "请签名",
						icon: 'none',
					});
				}
				
				// this.goBack();
			},
			pngToBase64(url, type) {
				console.log(url)
				return new Promise((resolve, reject) => {
					if (!!uni.getFileSystemManager()) {
						uni.getFileSystemManager().readFile({
							filePath: url, //选择图片返回的相对路径
							encoding: "base64", //编码格式
							success: (res) => {
								resolve(
									"data:image/" + type.toLocaleLowerCase() + ";base64," + res.data
								);
							},
							fail: (res) => reject(res.errMsg),
						});
					} else {
						uni.request({
							url: url,
							method: "GET",
							responseType: "arraybuffer",
							success: (ress) => {
								let base64 = wx.arrayBufferToBase64(ress.data); //把arraybuffer转成base64
								base64 = "data:image/jpeg;base64," + base64; //不加上这串字符，在页面无法显示的哦
								resolve(base64);
							},
							fail: (res) => reject(res.errMsg),
						});
					}
				});
			},
			//保存到相册
			saveCanvasAsImg() {
				uni.canvasToTempFilePath({
					canvasId: 'handWriting',
					fileType: 'png',
					quality: 1, //图片质量
					success(res) {
						console.log(res.tempFilePath, 'canvas生成图片地址');
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res) {
								uni.showToast({
									title: '已保存到相册',
									duration: 2000
								});
							}
						});
					}
				});
			},
			//预览
			previewCanvasImg() {
				uni.canvasToTempFilePath({
					canvasId: 'handWriting',
					fileType: 'jpg',
					quality: 1, //图片质量
					success(res) {
						uni.previewImage({
							urls: [res.tempFilePath] //预览图片 数组
						});
					}
				});
			},
			//设置canvas背景色  不设置  导出的canvas的背景为透明
			//@params：字符串  color
			setCanvasBg(color) {

				/* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
				//rect() 参数说明  矩形路径左上角的横坐标，左上角的纵坐标, 矩形路径的宽度, 矩形路径的高度
				//这里是 canvasHeight - 4 是因为下边盖住边框了，所以手动减了写
				this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight - 4);
				// ctx.setFillStyle('red')
				this.ctx.setFillStyle(color);
				this.ctx.fill(); //设置填充
				this.ctx.draw(); //开画
			},
			 //旋转图片，生成新canvas实例
		}
	};
</script>

<style>
	page {
		background: #fbfbfb;
		height: auto;
		overflow: hidden;
	}

	.wrapper {
		width: 100%;
		height: 95vh;
		margin: 30rpx 0;
		overflow: hidden;
		display: flex;
		align-content: center;
		flex-direction: row;
		justify-content: center;
		font-size: 28rpx;
	}

	.handWriting {
		background: #fff;
		width: 100%;
		height: 95vh;
	}

	.handRight {
		display: inline-flex;
		align-items: center;
	}

	.handCenter {
		border: 4rpx dashed #e9e9e9;
		flex: 5;
		overflow: hidden;
		box-sizing: border-box;
	}

	.handTitle {
		transform: rotate(90deg);
		flex: 1;
		color: #666;
	}

	.handBtn button {
		font-size: 28rpx;
	}

	.handBtn {
		height: 95vh;
		display: inline-flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-between;
		flex: 1;
	}

	.delBtn {
		position: absolute;
		top: 250rpx;
		left: 0rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.delBtn image {
		position: absolute;
		top: 13rpx;
		left: 25rpx;
	}

	.subBtn {
		position: absolute;
		bottom: 52rpx;
		left: -3rpx;
		display: inline-flex;
		transform: rotate(90deg);
		background: #008ef6;
		color: #fff;
		margin-bottom: 30rpx;
		text-align: center;
		justify-content: center;
	}

	/*Peach - 新增 - 保存*/

	.saveBtn {
		position: absolute;
		top: 375rpx;
		left: 0rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.previewBtn {
		position: absolute;
		top: 500rpx;
		left: 0rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.uploadBtn {
		position: absolute;
		top: 625rpx;
		left: 0rpx;
		transform: rotate(90deg);
		color: #666;
	}

	/*Peach - 新增 - 保存*/

	.black-select {
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		top: 30rpx;
		left: 25rpx;
	}

	.black-select.color_select {
		width: 90rpx;
		height: 90rpx;
		top: 100rpx;
		left: 10rpx;
	}

	.red-select {
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		top: 140rpx;
		left: 25rpx;
	}

	.red-select.color_select {
		width: 90rpx;
		height: 90rpx;
		top: 120rpx;
		left: 10rpx;
	}
</style>
