<script>
	export default {
		onLaunch: function() {
			this.globalData.overShare();
			console.log("App Launch");
				
			let params = {
					staffid: uni.getStorageSync('staffid'),
					token: uni.getStorageSync('token')
			}
			if(!params){
				return;
			}
			uni.setStorageSync('homeTabCurrent',0)
			uni.setStorageSync('scrollTop',0)
		},
		onShow: function() {
			console.log("App Show");
			const updateManager = uni.getUpdateManager();

			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate);
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});

			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				console.log('download error')
				uni.showModal({
					title: '提示',
					content: '新版小程序下载失败\n请自行退出程序，手动卸载本程序，再运行',
					confirmText: "知道了"
				});
			});
			uni.setStorageSync('pdfOpen',1)
		},
		onHide: function() {
			console.log("App Hide");
		},
		globalData: {
		            overShare: () => {
		                //监听路由切换, 间接实现全局设置分享内容
		                uni.onAppRoute(res => {
		                    console.log("间接实现全局设置分享内容");
		                    //获取加载的页面
		                    const pages = getCurrentPages(),
		                        //获取当前页面的对象
		                        view = pages[pages.length - 1];
		                    if (view) {
		                        //全局触发 显示出分享具栏
		                        wx.showShareMenu({
		                            withShareTicket: true,
		                            //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
		                            menus: ["shareAppMessage", "shareTimeline"]
		                        })
		
		                        view.onShareAppMessage = () => {
		                            //分享配置
		                            return {
		                            title: '史伟莎服务报告',
		                            path: '/pages/home/home',
		                               imageUrl: '/static/images/lbs_logo.png',
									   success(res) {                                    
										   uni.showToast({                                        
											title: '分享成功',
										   })                                
									   },                                
									   fail(res) {
									   uni.showToast({                                        
										   title: '分享失败',
										   icon: 'none',
										   })
									   }
		                            };
		                        };
		                    }
		                })
		            },
		           
		        }
	};
</script>

<style lang="scss">
	@import "./static/css/index.scss";
	@import "./cl-uni/index.scss";
	@import "uview-ui/index.scss";

	//@import '/wxcomponents/vant/common/index.wxss';
	page {
		background-color: #f7f7f7;
	}

	.uni-tabbar__label {
		//1
		font-size: 20px !important;
	}
</style>
