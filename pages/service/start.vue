<template>
	<view class="content" v-if="showContent">
		<view class="my_card">
			<view class="cust_name">
				{{service.customer.name_zh}}
			</view>
			<view class="v_magin">
				服务次数：<span style="color: black;">{{service.count}}次</span>
			</view>
			<view class="v_magin">
				服务人员：<span style="color: black;">{{service.customer.name_zh}}</span>
			</view>
			<view class="v_magin">
				联系人员：<span style="color: black;">{{service.contact_name}}</span>
			</view>
			<view class="v_magin">
				联系电话：<span style="color: black;">{{service.tel}}</span>
			</view>
			<view class="v_magin">
				联系地址：<span style="color: black;">{{service.customer.addr}}</span>
			</view>
			<!-- 流程 -->
			<cl-divider>
				<text class="cl-icon-favor"></text>
				<text style="color: #007AFF;font-size: 14px;">服务流程</text>
			</cl-divider>
			<cl-timeline>
				<cl-timeline-item v-for="(item, index) in list" :key="index" :timestamp="item.timestamp"
					:show-line="item.showLine" :content="item.content" :icon="item.icon" :color="item.color"
					:classType="item.classType" @tap="lc(item.url,item.shortcut_type)">
				</cl-timeline-item>
			</cl-timeline>
		</view>
		<view class="tj_bu_y" v-if="service.main_staff">
			<cl-row gutter="20">
				<cl-col span="12" @tap="report()">
					<view class="jc">检查报告</view>
				</cl-col>
				<cl-col v-if="service.status==2" span="12" @tap="check_out()">
					<view class="qc">签出离店</view>
				</cl-col>
				<cl-col v-else span="12">
					<view class="qc">已签离店</view>
				</cl-col>
			</cl-row>
		</view>
		<view class="tj_bu" v-else @tap="report()">检查报告</view>
	</view>
</template>

<script>
import color from 'uview-ui/libs/config/color';
	export default {
		data() {
			return {
				name:'开始服务',
				list: [{
						content: "服务简报",
						icon: "cl-icon-history-fill",
						color: "#409EFF",
						url: "/pages/service/briefing",
						shortcut_type: "briefing",
						classType: "info"

					},
					{
						content: "物料使用",
						icon: "cl-icon-clock-fill",
						color: "#409EFF",
						url: "/pages/service/material",
						shortcut_type: "material",
						classType: "info"
					},
					{
						content: "设备情况",
						icon: "cl-icon-map-fill",
						color: "#007AFF",
						url: "/pages/service/equipment",
						shortcut_type: "equipment",
						classType: "info"
					},
					{
						content: "风险跟进",
						icon: "cl-icon-success-fill",
						color: "#007AFF",
						url: "/pages/service/risk",
						shortcut_type: "risk",
						classType: "info"
					},
					{
						content: "现场工作照",
						icon: "cl-icon-smile-fill",
						showLine: true,
						color: "#007AFF",
						url: "/pages/service/photo",
						shortcut_type: "photo",
						classType: "info"
					}
				],
				showContent: false,
				service: [],
				jobid: '',
				jobtype: '',
				Staff01: '',
				custInfo: {},
				ct:0,
				autograph:'',
			}
		},
		onLoad(index) {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				showContent: false
			});
			// var loginRes = this.checkLogin();
			// if (!loginRes) {
			// 	uni.showToast({
			// 		title: "请先登录",
			// 		icon: 'none',
			// 	});
			// 	setTimeout(() => {
			// 		return false
			// 	}, 2000);
			// }
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			
			this.ct = uni.getStorageSync('ct')
			
		},
		onShow(index) {
			// this.showContent: false;
			this.service = [];
		
			showContent: false;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.data_select();
		},
		// onReady() {
		// 	showContent: false
		// 	uni.showLoading({
		// 		title: '加载中...',
		// 		mask: true,
		// 	});
		// },

		methods: {
			data_select() {
				
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				
				this.showContent = false;
				uni.request({
					url: `${this.$baseUrl}/Order.Order/orderStart`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: params,
					success: (res) => {
						if (res.data.code == 200) {
							// console.log(res.data.data.data)
							
							// 客户签名
							this.autograph = res.data.data.autograph
							
							this.service = res.data.data.data
							this.custInfo = {
								address: res.data.data.data.customer.addr,
								customer: res.data.data.data.customer.name_zh
							}
							
							if (res.data.data.plateArr) {
								var list_add = [];
								
								let  arr = res.data.data.plateArr
								arr.forEach((item,i)=>{
									
									// console.log(item)
									this.list.forEach((itemx,index)=>{
										if(item.name == itemx.content)
										{
											
											if(item.choice==1)
											{
												itemx.classType = 'success'
											}
											// console.log(itemx)
											list_add.push({
												classType:itemx.classType, 
												color:itemx.color, 
												content:itemx.content,
												icon:itemx.icon,
												shortcut_type:item.shortcut_type,
												url:itemx.url,
											})
										}
									})
								})
								
								this.list = list_add;
							// } else {
							// 	for (var i = 0; i < res.data.data.table_sections.length; i++)
							// 		if (res.data.data.table_sections[i] > 0) {
							// 			// this.list[i].content += "  √";
							// 			// this.list[i].color += "#00a015";
							// 			this.list[i].classType = "success";
							// 			// htmls = '<uni-tag text="标签" type="primary" />';
							// 		}
							}
						}
						
						
						//隐藏加载框
						setTimeout(() => {
							uni.hideLoading();
						}, 100)
						this.showContent = true;
					},
					fail: (err) => {
						//隐藏加载框
						this.showContent = true;
						uni.hideLoading();
					}
				})
			},
			lc(url, shortcut_type) {
				
				if (this.service.length == 0) {
					uni.showToast({
						title: '数据加载中',
						icon: 'none',
					});
				} else if (this.service.status == '3') {
					uni.showToast({
						title: '已完成不能再修改',
						icon: 'none',
					});
				// } else if (this.service.Staff01 != this.Staff01) {
				// 	uni.showToast({
				// 		title: '协作人员不能修改',
				// 		icon: 'none',
				// 	});
				} else {
					console.log("客户信息：")
					console.log(this.custInfo)
					
					let new_url = url;
					if (url === "/pages/service/photo") {
						uni.removeStorage({
							key: 'custInfoForImages', //key String 本地缓存中的指定的 key
							success: function(res) { //success Function 接口调用的回调函数
								console.log('删除 custInfoForImages 缓存 success');
							}
						});
						//先存一波 没得就算了
						uni.setStorage({
							key: 'custInfoForImages', //key String 本地缓存中的指定key
							data: this.custInfo, //data Any 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
							success: function() { //success Function	接口调用成功的回调函数
								console.log(' custInfoForImages 存储 success');
							}
						});
						// 回调式  $on 与 $emit 进行页面通讯

						uni.$on('send', () => {
							uni.$emit("custInfo", this.custInfo)
							// 传参 或 传递一个对象 uni.$emit("cardMsg", {})
							console.log('发送数据');
							console.log('start:')
						})
						
						new_url = url +'?jobid=' + this.jobid +'&jobtype=' + this.jobtype
					} else {
						new_url = url +
							'?jobid=' + this.jobid +
							'&jobtype=' + this.jobtype +
							'&ct=' + this.ct +
							'&shortcut_type=' + shortcut_type +
							'&service_type=' + this.service.service_type;

					}
					
					uni.navigateTo({
						url: new_url
					})
				}
			},
			report() {
				if (this.service.length == 0) {
					uni.showToast({
						title: '数据加载中',
						icon: 'none',
					});
				} else {
					uni.navigateTo({
						url: "/pages/report/detail?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
							'&service_type=' + this.service.service_type
					})
				}
			},
			check_out() {
				uni.navigateTo({
					url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						"&lat=" + this.service.lat + "&lng=" + this.service.lng + "&addr=" + this.service
						.Addr + "&autograph=" + this.autograph
				})
			}
		}
	}
</script>

<style>
	.new_card_title {
		border-bottom: 1px solid #e0dcdc;
		font-size: 19px;
		font-weight: bold;
		padding: 10px;
		height: 30px;
	}

	.xh {
		color: #007AFF;
		font-weight: bold;
		font-size: 21px;
		margin-right: 5px;
	}

	.new_card_title_left {
		float: left;
	}

	.new_card_title_right {
		font-size: 20px;
		color: #d0cece;
		float: right;

	}

	.new_card_content {
		margin: 10px;
		font-size: 17px;
	}

	.new_card_content view {
		margin-bottom: 10px;
	}

	.new_card_content span {
		color: #5e6165;
	}

	.tj_bu {
		margin: 0px 20px 20px 20px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 20px;
		border-radius: 15px;
		text-align: center;
	}

	.lcx {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
		margin: 10px 0px;
		padding-top: 10px;
	}

	.bu {
		background-color: #fff;
		height: 50px;
		text-align: center;
		border-top: 1px solid #f5f2f2;
		font-size: 19px;
		font-weight: bold;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
		margin: 20px;
	}

	.jc {
		background-color: #e1e4df;
		color: #060606;
		border-radius: 15px;
	}

	.qc {
		background-color: #007AFF;
		color: #FFFFFF;
		border-radius: 15px;
	}

	.cl-timeline-item__node::after {
		content: "";
		display: block;
		height: calc(100% - 32rpx);
		width: 2px;
		background-color: #f2f2f2;
		-webkit-transform: scaleX(1);
		transform: scaleX(1);
		position: absolute;
		top: 48rpx;
		border-radius: 10rpx;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.cl-timeline-item__content {
		font-size: 38rpx;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		margin: 0 20rpx;
		position: relative;
		padding-bottom: 60rpx;
	}

	/* new */
	.content {
		padding: 50px 10px;
		height: 5%;
		background-color: #0e8cf1;
		color: #6b6464;
	}

	.my_card {
		background-color: #FFFFFF;
		border-radius: 10px;
		margin: 10px 0px;
		padding: 10px;
		padding-bottom: 100px;
	}

	.cust_name {
		font-size: 20px;
		font-weight: bold;
	}

	.cl-tag--success.is-plain {
		color: #12900a;
		border-collapse: #12900a;
		background-color: #fff;
	}

	.tj_bu_y {
		margin: 20px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
		z-index: 9999;
		text-align: center;
		font-weight: bold;
		font-size: 18px;
	}

	.v_magin {
		margin: 2px 0px;
		line-height: 55rpx;
	}
</style>
