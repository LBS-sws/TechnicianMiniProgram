<!-- sign bate 2 -->
<template>
    <view class='contents'>
		<view class='mesg'>
			请横屏签名
		</view>
        <canvas class='firstCanvas' canvas-id="firstCanvas" @touchmove='move' @touchstart='start($event)' @touchend='end'
         @touchcancel='cancel' @longtap='tap' disable-scroll='true' @error='error'>
        </canvas>
        <view class="caozuo">
            <view class="chongqian" @tap='clearClick'>
                重签
            </view>
            <view class="over" @tap="overSign">
                完成签名
            </view>
        </view>
    </view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/js_sdk/mmmm-image-tools/index.js'
    var content = null;
    var touchs = [];
    var canvasw = 0;
    var canvash = 0;
    var _that;
    //获取系统信息
    uni.getSystemInfo({
        success: function(res) {
            canvasw = res.windowWidth;
            canvash = res.windowHeight;
        },
    })
    export default {
        data() {
            return {
                signImage: '',
                isEnd: false ,// 是否签名
            }
        },
        methods: {
            overSign: function() {
                if (this.isEnd) {
                   uni.canvasToTempFilePath({
                             x: 0, // 起点坐标
                             y: 0,
                            // 宽高位置信息根据项目实际情况调整
                             width: 430, // canvas 宽  - 343 original
                             height: 900, // canvas 高 - 600 original
                             canvasId: 'firstCanvas', // canvas id
                             success(res) {
								 pathToBase64(res.tempFilePath)
								 	.then(base64 => {
								 		var pages = getCurrentPages();
								 		var prevPage = pages[pages.length - 2]; //上一个页面
								 		 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
								 		// 上一个页面最后设置userdata
								 		prevPage.setData({
								 		     customer_signature: base64
								 		})
								 		uni.navigateBack({//返回
								 		   delta: 1
								 		})
								 	})
								 	.catch(error => {
								 	console.error(error)
								 	})
                             }
                           },this)
                } else {
                    uni.showToast({
                        title: '请先完成签名',
                        icon: "none",
                        duration: 1500,
                        mask: true
                    })
                }

            },
			
            // 画布的触摸移动开始手势响应
            start: function(event) {
                // console.log(event)
                console.log("触摸开始" + event.changedTouches[0].x)
                console.log("触摸开始" + event.changedTouches[0].y)
                //获取触摸开始的 x,y
                let point = {
                    x: event.changedTouches[0].x,
                    y: event.changedTouches[0].y
                }
                // console.log(point)
                touchs.push(point);

            },
            // 画布的触摸移动手势响应
            move: function(e) {
                let point = {
                    x: e.touches[0].x,
                    y: e.touches[0].y
                }
                // console.log(point)
                touchs.push(point)
                if (touchs.length >= 2) {
                    this.draw(touchs)
                }
            },

            // 画布的触摸移动结束手势响应
            end: function(e) {
                console.log("触摸结束" + e)
                // 设置为已经签名
                this.isEnd = true
                // 清空轨迹数组
                for (let i = 0; i < touchs.length; i++) {
                    touchs.pop()
                }

            },

            // 画布的触摸取消响应
            cancel: function(e) {
                console.log("触摸取消" + e)
            },

            // 画布的长按手势响应
            tap: function(e) {
                console.log("长按手势" + e)
            },

            error: function(e) {
                console.log("画布触摸错误" + e)
            },

            //绘制
            draw: function(touchs) {
                console.log(touchs[0],touchs[1])
                let point1 = touchs[0]
                let point2 = touchs[1]
                touchs.shift()
                content.moveTo(point1.x, point1.y)
                content.lineTo(point2.x, point2.y)
                content.stroke()
                content.draw(true)
            },
            //清除操作
            clearClick: function() {
                // 设置为未签名
                this.isEnd = false
                //清除画布
                content.clearRect(0, 0, canvasw, canvash)
                content.draw(true)
            },
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(index) {
            _that = this
            //获得Canvas的上下文
            content = wx.createCanvasContext('firstCanvas')
            //设置线的颜色
            content.setStrokeStyle("#000")
            //设置线的宽度
            content.setLineWidth(5)
            //设置线两端端点样式更加圆润
            content.setLineCap('round')
            //设置两条线连接处更加圆润
            content.setLineJoin('round')
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
        },



    }
</script>

<style>
    .ts {
        color: #FF485D;
        font-size: 30upx;
        height: 100upx;
        line-height: 100upx;
        padding-left: 20upx;
    }

    canvas {
        background-color: #DDDDDD;
        width: 700upx;
        margin: 0 25upx;
        height: calc(100vh - 140upx - 60upx);
    }

    .contents {
        padding-top: 20upx;
        padding-bottom: 100upx;
        box-sizing: border-box;
    }

    #signatureImg {
        background-color: #FFFFFF;
    }

    .caozuo {
        display: flex;
        height: 100upx;
        width: 750upx;
        position: fixed;
        left: 0;
        bottom: 0;
    }

    .caozuo view {
        width: 375upx;
        text-align: center;
        height: 100upx;
        line-height: 100upx;
        color: #FFFFFF;
    }

    .caozuo view:active {
        background-color: #FFFFFF;
        /* color: #333333; */
    }

    .chongqian {
        background-color: #FF8F58;
    }

    .over {
        background-color: #0599D7;
    }
	
	.mesg {
		text-align: center;
		height: 60upx;
        font-size: 35upx;
		font-weight: bold;
	}
</style>