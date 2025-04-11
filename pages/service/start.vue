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
					<view v-else class="qc ql_box" @tap="check_out" :style="{background:stop ?'':'#999999'}">
						<view>签出离店</view>
						<text class="ql_time">已服务:{{formatTime}}</text>
					</view>
				</cl-col>
			</cl-row>
		</view>
		<!-- 协助人员 -->
		<view class="tj_bu_y" v-else>
			<cl-row gutter="20">
				<cl-col span="12" @tap="report()">
					<view class="jc">检查报告</view>
				</cl-col>
				<cl-col span="12">
					
					<view class="qc ql_box" @tap="check_out_tow"  v-if="service.staff_other.end_date ==null " >
						<view>签出离店</view>
						<text class="ql_time">已服务:{{formatTime}}</text>
					</view>
					<view class="qc" v-else>已签离店</view>
				</cl-col>
			</cl-row>
		</view>
		
		<!-- 返回、直接签离、下次服务 -->
		<u-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
			<view v-if="noFillInData.length>0" class="no_box">
				<view class="title" v-for="(item,i) in noFillInData" :key="i">{{i+1}}.{{item.title}}</view>
			</view>
			<view class="signout_ui">
				<view class="item" @click="close">返回</view>
				<view class="item" @click="now_check_out">直接签离</view>
				<view class="item" @click="serviceHandle">服务暂停、安排下次时间</view>
			</view>
		</u-popup>
		<!-- 日期 -->
		<my-datetime ref="dateTimePop" @ok="timeOk" :shownum="3"></my-datetime>
		<!--其他工单-->
		<u-popup :show="orderShow" :round="10" mode="bottom" @close="orderClose" @open="orderOpen">
			<orderList :jobs="jobs" :jobId="jobid" :jobType="jobtype" @updateJobList="updateJobList" @signOut="signOut" ></orderList>
		</u-popup>
		<!-- 暂停/继续 按钮-->
		<block >
			<van-button class="stop-btn" type="primary" round @tap="$noMultipleClicks(stopHandle)" v-if="service.service_ql==0 && service.status!=3"
			
			>
				<view>{{stopText}}</view>
			</van-button>
		</block>
		
	</view>
</template>

<script>
//引入高德地图sdk
import amap  from '@/utils/amap-wx.130.js';
import color from 'uview-ui/libs/config/color';
import myDatetime from '@/components/my-datetime/my-datetime';
import orderList from '@/components/order/item.vue';
	export default {
		components: {
			'my-datetime': myDatetime,
			orderList
		},
		data() {
			return {
				noClick: true,
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
				
				date:'',
				qlType:'',
				
				isTiming: false,
				time: 0,
				timer: null,
				customer_qm:false,
			
				serviceContractTime:0,	// 合约服务时长
				noFillInData:[],
				
				hopeBeginTime: '',
                dateKey: '',
				orderShow: false, // 其他工单
				jobs:[],
				stop:false,
				stopText:'暂停服务先做其他客户',
				axiosTime:false,	// 2秒后才能请求
			}
		},
		  computed: {
		    formatTime() {
			
			 const hours = Math.floor(this.time / 3600); // 获取小时数
		     const minutes = Math.floor((this.time % 3600) / 60); // 获取分钟数
		     const seconds = this.time % 60; // 获取秒数
		     
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
			
			this.amapPlugin = new amap.AMapWX({
			    key: `${this.$amapApiKey}`
			}); 
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
			
			this.getOrderStopInfo();
			setTimeout(()=>{
				this.CustomerOrder()	// 2秒后再加载
			},1500)
			setTimeout(()=>{
				this.axiosTime = true
			},2000)
		},
		methods: {
			// 获取已服务时间，减去暂停时间
			getOrderStopInfo(){
				let that = this
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.OrderStopInfo(params).then(res=>{
				
					if(res.data.stop && res.data.stop == 1){
						console.log('返回暂停还是继续',res.data.stop)
						that.stopText = '继续服务'
						this.stop = false
						this.stopTimer()
					}else{
						that.stopText = '暂停服务先做其他客户'
						this.startTimer()
						this.stop = true
					}
					if(res.data.service_time){
						
						that.time = res.data.service_time
						
					}
				}).catch(err=>{
					
					console.log(err)
				})
			},
			// 暂停|继续
			stopHandle(){
				if(!this.axiosTime){
					uni.showToast({
						icon:'none',
						title:'加载中，请稍等...'
					})
					return false
				}
				if(this.service.service_ql == '1' || this.service.service_ql=='2'){
					uni.showToast({
						title:'签离后不能暂停',
						icon:'none'
					})
					return false
				}
				console.log(this.stop)
				
				let stop = this.stop;
				if(stop){
					
					stop = 0
				}else{
					
					stop = 1
				}
				
				uni.showLoading({
					title: '请稍等'  
				});  
				this.amapPlugin.getRegeo({  
					    success: (data) => {  
					        console.log(data)  
					        
							let addr = data[0].name
							let lat = data[0].latitude
							let lng = data[0].longitude

							let params = {
								stop : stop,
								lat:lat,
								lng:lng,
								addr:addr,
								job_id:this.jobid,
								job_type:this.jobtype
							}
							
							this.$api.OrderStop(params).then(res=>{
								// console.log(stop)
								
								this.stop = !this.stop
								// this.stopText = this.stop ? '暂停服务先做其他客户' : '继续服务'
								console.log(res)
								this.getOrderStopInfo()
							}).catch(err=>{
								
								console.log(err)
							})
							
					        uni.hideLoading(); 
					    }  
				});
			},
			// 该客户有其他工单回调
			updateJobList(e){
				console.log('回调',e)
				this.jobs = e
			},
			orderOpen(){
				
			},
			orderClose(){
				this.orderShow = false
			},
			getDate(){
				var date = new Date()
						
				let y = new Date(date).getFullYear();
				let m = new Date(date).getMonth()+1;
				let d = new Date(date).getDate();
							
				if(m<10){
				    m = '0' + m
				}
				if(d<10){
				    d = '0' + d
				}
				let datetime = `${y}-${m}-${d}`;
				return datetime
			},
			// 开启弹窗
			dateOpen (key, date) {
				this.dateKey = key
				this.$refs.dateTimePop.open(date || '');
			},
			// 主负责人 - 下次服务时间关闭弹窗
			timeOk (str, obj) {
				console.log(str, obj)
				
				this.date = str
				this.qlType = 2
			
				this.stopTimer()
				this.show = false
				uni.navigateTo({
					url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						 "&autograph=" + this.autograph + "&staffSign="+this.staffSign +"&qlType="+this.qlType + '&date=' + this.date
				})
			},
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
			// 计时开始
			startTimer() {
			  this.isTiming = true
			  this.timer = setInterval(() => {
				this.time++
			  }, 1000)
			},
			// 暂停计时
			stopTimer() {
			  this.isTiming = false
			  clearInterval(this.timer)
			},
			// 服务暂停、安排下次时间
			serviceHandle(){
				
				this.show = false
				
				let date = this.getDate()
				this.$refs.dateTimePop.open(date || '');
			},
			// 弹框 - 直接签离或下次
			open(){},
			// 关闭 - 直接签离或下次
			close(){
				this.show = false
			},
			// 客户签名
			qianming(){
				let that = this
				
				let params = {
					job_id:that.jobid,
					job_type:that.jobtype,
				}
				that.$api.getSignature(params).then(res=>{
					console.log('客户签名:',res.data)
					this.noFillInData = []
					if(res.data.cust.customer_signature_url){
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
			// 客户其他工单
			CustomerOrder(){
				
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.getCustomerOrder(params).then(res=>{
					console.log('当前客户其他工单:',res)
						
					if(res.code==200){
						this.jobs = res.data	
					}
				}).catch(err=>{
					
				})
			},
			//
			data_select() {
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.showContent = false;
				this.$api.orderStart(params).then(res=>{
					// console.log(res.data.data.service_time)
					this.time = res.data.data.service_time	// 服务时间
					
					this.autograph = res.data.autograph
					this.staffSign = res.data.staffSign
					this.service = res.data.data
					uni.setStorageSync('main_staff',res.data.data.main_staff) // 把工单负责人存到缓存里
					
					this.serviceContractTime = res.data.data.contract_service_time	// 合约服务时长
					
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
			//
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
					
					this.stopTimer()
					
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
			//
			report() {
				if (this.service.length == 0) {
					uni.showToast({
						title: '数据加载中',
						icon: 'none',
					});
				} else {
					this.stopTimer()
					
					uni.navigateTo({
						url: "/pages/report/detail?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
							'&service_type=' + this.service.service_type + '&bk=' + this.bk
					})
				}
			},
			// 签离出店按钮 第一步
			check_out() {
				console.log('sign-01')
				if(!this.axiosTime){
					uni.showToast({
						icon:'none',
						title:'加载中，请稍等...'
					})
					return false
				}
				console.log('stop状态:',this.stop)
				if(this.stop == false){
					uni.showToast({
						icon:'none',
						title:'继续服务后才能签离'
					})
					return false
				}
				
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

				// 2.直接签离、安排下次时间 - 弹窗 选择日期
				if(this.qlType=='' && !this.qlType){
					this.show = true
					return false
				}
				
				// 3.直接签离 - 判断当前客户是否有其他工单
				if(this.jobs.length>0){
					this.show = false
					this.orderShow = true
					return false
				}
				
				this.stopTimer()
				this.show = false
				uni.navigateTo({
					url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						 "&autograph=" + this.autograph + "&staffSign="+this.staffSign +"&qlType="+this.qlType + '&date=' + this.date
				})
			},
			// 协助人员签离
			check_out_tow(){
				console.log('sign-02')
				if(!this.axiosTime){
					uni.showToast({
						icon:'none',
						title:'加载中，请稍等...'
					})
					return false
				}
				if(this.stop==false){
					uni.showToast({
						icon:'none',
						title:'继续服务后才能签离'
					})
					return false
				}
				// 判断当前客户是否有其他工单
				if(this.jobs.length>0){
					this.show = false
					this.orderShow = true
					return false
				}else{
					this.stopTimer()
					this.show = false
					uni.navigateTo({
						url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
							 "&autograph=" + this.autograph + "&staffSign="+this.staffSign +"&qlType="+this.qlType + '&date=' + this.date
					})
				}
			},
			// 直接签离
			now_check_out(){
				console.log('sign-03')
				if(!this.axiosTime){
					uni.showToast({
						icon:'none',
						title:'加载中，请稍等...'
					})
					return false
				}
				if(this.stop==false){
					uni.showToast({
						icon:'none',
						title:'继续服务后才能签离'
					})
					return false
				}
				if(this.jobs.length>0){
					this.show = false
					this.orderShow = true
					return false
				}
				this.qlType = 1
				this.date = ''
				this.stopTimer()
				this.show = false
				
				uni.navigateTo({
					url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						 "&autograph=" + this.autograph + "&staffSign="+this.staffSign +"&qlType="+this.qlType + '&date=' + this.date
				})
			},
			
			// 直接签离 - 先做其他客户
			signOut(){
				
				this.stopTimer()
				this.show = false
				this.orderShow = false
				uni.navigateTo({
					url: "/pages/sign/check_out?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						"&autograph=" + this.autograph + "&staffSign="+this.staffSign +"&qlType="+this.qlType + '&date=' + this.date
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
		z-index: 9;
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
::v-deep .stop-btn {
	position: fixed;
	top: 70%;
	right: 20rpx;
	.van-button {
		// width: 260rpx;
		// height: 260rpx;
		width: 164rpx;
    height: 164rpx;
    font-size: 24rpx;
	
		box-shadow: 0px 12rpx 30rpx 0px rgba(25, 137, 250, 0.34);
		background-color: #007AFF;
	}
}
</style>
