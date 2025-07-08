<template>
	<view class="progressBox">
		<view class="dots" :style="pColor"></view>
		<canvas :canvas-id="'progress'+id" :style="{width: sizeNum + 'px', height: sizeNum + 'px'}"></canvas>
		<view class="centerTxt">
			<view class="num" :style="tFontSize">
				{{cTime}}
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "countDownTime",
		props: {
			id: {
				type: String,
			},
			progressColor: { //进度颜色
				type: String,
				default: '#409EFF'
			},
			bgColor: { //轨道颜色
				type: String,
				default: '#F9FAFB'
			},
			size: { //整体大小
				type: Number,
				default: 100
			},
			strokeWidth: { //轨道宽度
				type: Number,
				default: 15
			},
			percent: { //进度百分比
				type: Number,
				default: 0
			},
			textFontSize:{ //倒计时数字大小
				type:Number,
				default:18
			},
		},
		data() {
			return {
				sizeNum: this.size, //最终的整体尺寸
				strokeWidthNum: this.strokeWidth, //最终的轨道宽度数值
				pColor: '',
				cTime: this.percent,
				timer: null,
				tFontSize:'',
			};
		},
		created() {
			this.pColor = '--clr:' + this.progressColor + ';'
			this.tFontSize = '--fos:' + this.textFontSize + 'px;'
			this.timePercentStart()
		},
		methods: {
			timePercentStart() {
				clearInterval(this.timer)
				this.timePercent()
			},
			timePercent() {
				if (!this.timer) {
					if (this.percent <= 100) {
						let percentA = 0
						let percentB = 100 / this.percent
						let num = 0
						let cTime = this.percent
						this.timer = setInterval(() => {
							if (percentA < 100) {
								this.drawProgress(percentA,cTime)
								percentA = percentA + percentB
								cTime--
							}
							num++
							if (num == this.percent) {
								this.drawProgress(100,0)
								clearInterval(this.timer)
							}
						}, 1000)
					}
				}
			},
			drawProgress(percent, cTime) {
				//尺寸与轨道宽度自适应处理	
				const screenWidth = uni.getSystemInfoSync().screenWidth;
				this.sizeNum = (this.size / 750) * screenWidth
				this.strokeWidthNum = (this.strokeWidth / 750) * screenWidth


				const ctx = uni.createCanvasContext(`progress${this.id}`, this)
				const centerX = this.sizeNum / 2
				const centerY = this.sizeNum / 2
				const radius = (this.sizeNum - this.strokeWidthNum) / 2
				const startAngle = Math.PI * 1.5
				const endAngle = startAngle + (percent / 100) * 2 * Math.PI

				// 绘制背景圆
				ctx.beginPath()
				ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
				ctx.setFillStyle('#fff')
				ctx.fill()
				// 绘制轨道圆环
				ctx.beginPath()
				ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
				ctx.setLineWidth(8)
				ctx.setStrokeStyle(this.bgColor)
				ctx.setLineCap('round')
				ctx.stroke()
				// 绘制进度圆环
				ctx.beginPath()
				ctx.arc(centerX, centerY, radius, startAngle, endAngle)
				ctx.setLineWidth(this.strokeWidthNum)
				ctx.setStrokeStyle(this.progressColor)
				ctx.setLineCap('round')
				ctx.stroke()
				ctx.draw(true)
				this.cTime = cTime
				console.log(this.cTime)
			}
		},
		watch: {
			percent() {
				this.drawProgress()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dots {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		z-index: 1000;
	}

	/* 	.dots::before {
		content: '';
		position: absolute;
		top: -3upx;
		width: 26upx;
		height: 26upx;
		background: var(--clr);
		border-radius: 50%;
		box-shadow: 0 0 20upx var(--clr),
			0 0 60upx var(--clr);
	} */

	.progressBox {
		position: relative;
		width: 200upx;
		height: 200upx;
		margin: 0 auto;
		margin-top: 33upx;
		text-align: center;
	}
	canvas{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.centerTxt {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.num {
			font-size: var(--fos);
			font-family: Arial;
			font-weight: bold;
			color: #38393A;
		}
	}
	
	
	/*默认*/
	@media (min-width: 768px){
		.progressBox {
			position: relative;
			width: 400upx;
			height: 400upx;
			margin: 0 auto;
			margin-top: 33upx;
			text-align: center;
		}
	}
</style>