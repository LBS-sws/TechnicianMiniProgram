<template>
	<view class="content" v-if="showContent">
		<view class="my_card">
			<view class="cust_name">
				<text selectable="true">{{service.customer.name_zh}}</text>
			</view>
			<view class="v_magin">
				服务次数：<span style="color: black;">{{service.count}}次</span>
			</view>
			<view class="v_magin">
				服务人员：<span style="color: black;"><text selectable="true">{{service.main_staff}}</text></span>
			</view>
			<view class="v_magin">
				联系人员：<span style="color: black;"><text selectable="true">{{service.contact_name}}</text></span>
			</view>
			<view class="v_magin">
				联系电话：<span style="color: black;"><text selectable="true">{{service.tel}}</text></span>
			</view>
			<view class="v_magin">
				联系地址：<span style="color: black;"><text selectable="true">{{service.addr}}</text></span>
			</view>
			<view class="v_magin">
				服务时长要求：<span style="color: black;"><text selectable="true" v-if="serviceContractTime">{{serviceContractTime}}分钟</text></span>
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
		<view class="tj_bu_y" v-if="service.main_staff == loginStaff">
			<cl-row gutter="20">
				<cl-col span="12" @tap="report()">
					<view class="jc">检查报告</view>
				</cl-col>
				<cl-col v-if="service.status == 3" span="12" >
					<view class="qc create_bg" v-if="customer_qm" @click="createPdf" :class="service.report.id?'in':''">生成报告<text>生成报告后不能更改</text></view>
					<view class="qc" v-else>已签离店</view>
					
				</cl-col>
				<cl-col v-else span="12" >
					<view v-if="service.service_ql==1" >
						
						<view class="qc" v-if="customer_qm" @click="createPdf">生成报告</view>
						<view class="qc" v-else>已签离店</view>
					</view>
					<view v-else class="qc ql_box" @tap="check_out(0)">
						<view>签出离店</view>
						<text class="ql_time">已服务:{{formatTime}}</text>
					</view>
				</cl-col>
			</cl-row>
		</view>
		<view class="tj_bu" v-else @tap="report()">检查报告</view>
		
		<u-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
			<view v-if="noFillInData.length>0" class="no_box">
				<view class="title" v-for="(item,i) in noFillInData" :key="i">{{i+1}}.{{item.title}}</view>
				<!-- <view class="title">2.报告未完整填写</view> -->
			</view>
			<view class="signout_ui">
				<view class="item" @click="close">返回</view>
				<view class="item" @click="check_out(1)">直接签离</view>
				<view class="item" @click="serviceHandle">服务暂停、安排下次时间</view>
			</view>
		</u-popup>
		
		<DatePicker :showLabel="true" :show="showDate" :value="defaultDate" @confirm="dateChange" @cancel="showDate=false" />
	</view>
</template>

<script>
import color from 'uview-ui/libs/config/color';
import DatePicker from '@/components/dragon-datePicker/dragon-datePicker.vue';
	export default {
		components: {DatePicker},
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
					},
					{
						content: "勘察总结",
						icon: "cl-icon-history-fill",
						color: "#409EFF",
						url: "/pages/service/summarize",
						shortcut_type: "summarize",
						classType: "info"
					
					},
					{
						content: "风险评估",
						icon: "cl-icon-clock-fill",
						color: "#409EFF",
						url: "/pages/service/risk_assessment",
						shortcut_type: "material",
						classType: "info"
					},
					{
						content: "风险情况",
						icon: "cl-icon-map-fill",
						color: "#007AFF",
						url: "/pages/service/risk_list",
						shortcut_type: "equipment",
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
				autograph:'',//客户签名数量
				staffSign:'',//技术员签名数量
				loginStaff:'',
				bk:'',
				
				show:false,
				
				defaultDate: '',
				date:'',
				showDate: false,
				
				qlType:'',
				
				isTiming: false,
				time: 0,
				timer: null,
				customer_qm:false,
				
				serviceContractTime:0,	// 合约服务时长
				noFillInData:[]
			}
		},
		  computed: {
		    formatTime() {
		   
			 var hours = Math.floor(this.time / 3600); // 获取小时数
		     var minutes = Math.floor((this.time % 3600) / 60); // 获取分钟数
		     var seconds = this.time % 60; // 获取秒数
		     
			 return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
		    }
		  },
		onLoad(index) {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				showContent: false
			});
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			this.ct = uni.getStorageSync('ct')
			this.loginStaff = uni.getStorageSync('staffname')
		},
		onShow(index) {
			this.service = [];
			showContent: false;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.data_select();
			this.autoInheritEq();
			
			this.qianming()
			
			// setTimeout(()=>{
			// 	this.show = true
			// },2000)
		},
		methods: {
			// 生成PDF
			createPdf(){
				if(this.customer_qm==false)
				{
					uni.showToast({
						title:'客户未签名不能生成报告',
						icon:'none'
					})
					return false
				}
				let that = this
				
				let param = JSON.stringify([{
				    'job_id':this.jobid,
				    'job_type':this.jobtype
				}])
				uni.showToast({
					icon:'loading',
					title:'生成中'
				})
				that.$api.makePdf(param).then(res=>{
					uni.showToast({
						title:'生成成功',
						icon:'none'
					})
				}).catch(err=>{
					// console.log(err)
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
			// 服务暂停、安排下次时间
			serviceHandle(){
				console.log('下次服务时间')
				this.show = false
				this.showDate = true
				
				
			},
			// 下次服务选择日期
			dateChange(v) {
			    this.showDate = false
			    this.date = v
				this.qlType = 2
				this.check_out(2)
				
			},
			open(){
				
			},
			close(){
				this.show = false
			},
			// 客户签名
			qianming(){
				let that = this
				
				let params6 = {
					job_id:that.jobid,
					job_type:that.jobtype,
				}
				that.$api.getSignature(params6).then(res=>{
					console.log('客户签名:',res.data)
					this.noFillInData = []
					if(res.data.cust.customer_signature_url){
					// 	that.autograph_customer_signature = `${that.$baseUrl_imgs}` + res.data.cust.customer_signature_url + '?t=' + new Date().getTime()
						this.customer_qm = true
					}
					var arr = []
					// 客户未签字
					if(res.data.cust.customer_signature_url=='' || res.data.cust.customer_signature_url ==null){
						
						this.noFillInData.push({title:'客户未签字'})
						
					}
					if(res.data.staff_sign_urls.length==0){
						this.noFillInData.push({title:'报告未完整填写'})
					}
					
					
				}).catch(err=>{
					// console.log(err)
				})
			},
			data_select() {
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.showContent = false;
				this.$api.orderStart(params).then(res=>{
					// console.log(res.data.data.service_time)
					this.time = res.data.data.service_time	// 服务时间
					this.startTimer();
					
					this.serviceContractTime = res.data.data.contract_service_time	// 合约服务时长
					this.autograph = res.data.autograph
					this.staffSign = res.data.staffSign
					this.service = res.data.data
					this.custInfo = {
						address: res.data.data.customer.addr,
						customer: res.data.data.customer.name_zh
					}
					if (res.data.plateArr) {
						var list_add = [];
						let  arr = res.data.plateArr
						arr.forEach((item,i)=>{
							this.list.forEach((itemx,index)=>{
								if(item.name == itemx.content){
									if(item.choice==1){
										itemx.classType = 'success'
									}
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
						
						// 传值板块
						let bk = arr.map((item) =>{
						　　　return item.key
						　});
						// console.log(bk)
						this.bk = bk.join("_");
						
						this.list = list_add;
					}
					//隐藏加载框
					setTimeout(() => {
						uni.hideLoading();
					}, 100)
					this.showContent = true;
				}).catch(err=>{
					this.showContent = true;
					uni.hideLoading();
				})
			},
			lc(url, shortcut_type) {
				if (this.service.length == 0) {
					uni.showToast({
						title: '数据加载中',
						icon: 'none',
					});
				} else if (this.service.report) {//} else if (this.service.status == '3') {
					uni.showToast({
						title: '生成报告后不能修改', // 已完成不能再修改
						icon: 'none',
					});
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
					// console.log(new_url)
					// return false
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
							'&service_type=' + this.service.service_type + '&bk=' + this.bk
					})
				}
			},
			// 签离出店按钮 第一步
			check_out(e) {
				
				// 1.验证服务时长是否达到
				let minutes = Math.floor(this.time / 60); // 把已服务时间秒转成分钟
				// 判断是否已到达合约服务时长
				if(minutes<this.serviceContractTime){
					uni.showToast({
						title:'未达服务时长,不进入后续流程',
						icon:'none'
					})
					return false
				}
			
				this.stopTimer()
				if(e<=0){
					this.show = true
					return false
				}
				if(e==1){
					this.qlType = 1
					this.date = ''
				}
				this.show = false
				uni.navigateTo({
					url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						"&lat=" + this.service.lat + "&lng=" + this.service.lng + "&addr=" + this.service
						.Addr + "&autograph=" + this.autograph + "&staffSign="+this.staffSign +"&qlType="+this.qlType + '&date=' + this.date
				})
			},
			//继承设备
			autoInheritEq(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.inheritEq(params).then(res=>{
					//隐藏加载框
					setTimeout(() => {
						uni.hideLoading();
					}, 100)
					this.showContent = true;
				}).catch(err=>{
					this.showContent = true;
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss">
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
	.qc.in{
			background-color: #12900a;
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
.signout_ui{
	padding: 50rpx 40rpx 40rpx;
	.item{
		border: 1rpx solid #eee;
		height: 72rpx;
		border-radius: 6rpx;
		width: 100%;
		margin-bottom: 24rpx;
		font-size: 32rpx;
		color: #0e8cf1;
		text-align: center;
		line-height: 72rpx;
	}
}
.ql_box{
	position: relative;
	.ql_time{
		position: absolute;
		bottom: -38rpx;
		font-size: 24rpx;
		font-weight: 400;
		width: 100%;
		left: 0;
	}
}
.no_box{
	padding-top: 20rpx;
	.title{
		font-size: 26rpx;
		color: red;
		text-align: center;
		margin-bottom: 10rpx;
	}
}
.create_bg{
	position: relative;
	text{
		position: absolute;
		top: -30rpx;
		left: 0;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		width: 100%;
		
	}
}
</style>
