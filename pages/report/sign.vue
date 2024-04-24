<template>
	<view class="container">
		<view class="sigh-btns" :class="[disabled?'yes':'no']">
			<button class="btn cancel-btn" @tap="handleCancel">取 消</button>
			<button class="btn reset-btn" @tap="handleReset">重 写</button>
			<button class="btn save-btn" @tap="handleConfirm" >确 认</button>
		</view>
		<view class="handCenter">
			<canvas class="handWriting" disable-scroll="true" :style="{width:width +'px',height:height +'px'}"
				canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
			<canvas canvas-id="camCacnvs" disable-scroll="true" :style="{width:parseInt(height/2)+'px',height:parseInt(width/2)+'px'}"
				class="canvsborder"></canvas>
		</view>
	</view>
</template>
<script>
	var x = 20;
	var y = 20;
	var tempPoint = []; //用来存放当前画纸上的轨迹点
	var id = 0;
	var type = '';
	let that;
	let canvasw;
	let canvash;
	let base64String;
	let signTemp;
	export default {
		data() {
			return {
				userInfo: null,
				serverUrl: null,
				ctx: '', //绘图图像
				points: [], //路径点集合,
				width: 0,
				height: 0,
				jobid:'',
				jobtype:'',
				is_main:0,
				status:'',
				disabled:true,
			}
		},
		onLoad(option) {
			that = this;
			console.log(option);
			this.jobid = option.jobid
			this.jobtype = option.jobtype
			this.is_main = option.is_main
			this.status = option.status
			this.ctx = uni.createCanvasContext('mycanvas', this); //创建绘图对象
			//设置画笔样式
			this.ctx.lineWidth = 3;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			uni.getSystemInfo({
				success: function(res) {
					that.width = res.windowWidth * 0.8;
					// that.height = res.windowHeight * 0.95;
					that.height = res.windowHeight * 1;
				}
			});
		},
		created() {
			console.log(this.status)
			
		},
		methods: {
			//触摸开始，获取到起点
			touchstart: function(e) {
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {
					X: startX,
					Y: startY
				};
				/* *******由于uni对canvas的实现有所不同，这里需要把起点存起来**********/
				this.points.push(startPoint);
				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},
			//触摸移动，获取到路径点
			touchmove: function(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {
					X: moveX,
					Y: moveY
				};
				this.points.push(movePoint); //存点
				let len = this.points.length;
				if (len >= 2) {
					this.draw(); //绘制路径
				}
				tempPoint.push(movePoint);
			},
			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend: function() {
				this.points = [];
			},

			/* ***********************************************
			#   绘制笔迹
			#   1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#   2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#   3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw: function() {
				let point1 = this.points[0];
				let point2 = this.points[1];
				this.points.shift();
				this.ctx.moveTo(point1.X, point1.Y);
				this.ctx.lineTo(point2.X, point2.Y);
				this.ctx.stroke();
				this.ctx.draw(true);
			},
			handleCancel() {
				uni.navigateBack({
					delta: 1
				});
			},
			//清空画布
			handleReset: function() {
				that.ctx.clearRect(0, 0, that.width, that.height);
				that.ctx.draw(true);
				tempPoint = [];
			},
			//将签名笔迹上传到服务器，并将返回来的地址存到本地
			handleConfirm: function() {
				if (tempPoint.length == 0) {
					uni.showToast({
						title: '请先签名',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				console.log('保存')
				if(!this.disabled){
					return false
				}
				uni.showLoading({
					title: '保存中...'
				})
				this.disabled = false
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						let tempPath = res.tempFilePath;
						// 将图片保存成横向图片
						const ctx = uni.createCanvasContext('camCacnvs', that);
						// 由于缩小到一半，所以都需要 /2
						ctx.translate(0, that.width / 2); // 修改原点坐标（这里是已左上角为坐标原点）
						ctx.rotate((-90 * Math.PI) / 180); // 逆时针旋转90度
						ctx.drawImage(tempPath, 0, 0, that.width / 2, that.height / 2);
						ctx.draw();
						setTimeout(() => {
							//保存签名图片到本地
							uni.canvasToTempFilePath({
								canvasId: 'camCacnvs',
								success: function(res) {
									//这是签名图片文件的本地临时地址
									let path = res.tempFilePath;
									
									const formData = {
										job_id: that.jobid,
										job_type: that.jobtype,
										is_main: that.is_main,
										file: path
									}
									setTimeout(()=>{
										uni.uploadFile({
											url: `${that.$baseUrl}/Sign.Sign/uploadSign`,
											name: 'file',
											header: {
												'token': uni.getStorageSync('token'),
											},
											formData: formData,
											filePath: path,
											success: (res) => {
												let data = JSON.parse(res.data)
												if(that.is_main == '1'){
													uni.$emit('startSign_s', {is_main:that.is_main,img_url:data.data.customer_signature_url})
												}else{
													uni.$emit('startSign_s', {is_main:that.is_main,img_url:data.data.customer_signature_url_add})
												}
												
												uni.hideLoading()
												console.log(res, '上传结果')
												if (data.code == 200) {
													// 上传成功
													console.log('上传成功')
													
													if(that.status==3){
														
														
														let formData = {
															'data':JSON.stringify([{'job_id':that.jobid,'job_type':that.jobtype}]),
															'send':1,
															'sync':1
														}
														setTimeout(()=>{
															uni.request({
																url: `${that.$baseUrl}/Order.Order/makePdf`,
																header: {
																	'token': uni.getStorageSync('token'),
																	'Content-type':'application/x-www-form-urlencoded'
																},
																method:'POST',
																data: formData,
																success: (res) => {
																	console.log(res.data);
																	console.log('更新')
																}
															});
														},500)
													}
													setTimeout(()=>{
														that.disabled = true
													},8000)
												} else {
													// 上传失败
													uni.showToast({
														title: data
															.msg,
														icon: 'error',
														duration: 2000
													})
												}
												// Pass data back to the previous page
												const pages =
											getCurrentPages();
												const prevPage = pages[pages
													.length - 1];
												prevPage.setData({
													data: data,
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
									},1500)
								},
								fail: (err) => {
									uni.showToast({
										title: err.errMsg,
										icon: 'error',
										duration: 2000
									});
								}
							});
						}, 1500);
					},
					fail: (err) => {
						uni.showToast({
							title: err.errMsg,
							icon: 'error',
							duration: 2000
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.handWriting {
		background: #fff;
		width: 100%;
		height: 95vh;
	}

	.handRight {
		display: inline-flex;
		align-items: center;
	}


	.container {
		display: flex;
		flex-direction: row;
	}

	.sigh-btns {
		height: 100%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
	}
	.sigh-btns.no::after{
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		button:0;
		height: 100%;
		background: rgba(255, 255, 255, 0);
	}

	.btn {
		width: 70px;
		margin: 30px 0rpx;
		padding: 1rpx;
		transform: rotate(90deg);
		border: grey 1rpx solid;
	}

	.cancel-btn {
		color: #fff;
		border: #be1e2b 1rpx solid;
		background-color: #d04d4d;
	}

	.reset-btn {
		color: #fff;
		border: #605e5e 1rpx solid;
		background-color: #605e5e;
	}

	.save-btn {
		color: #fff;
		border: #15f16b 1rpx solid;
		background-color: #00a854;
	}
</style>
