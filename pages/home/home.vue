<template>
	<view v-if="isShowContent" class="content">
		<view class="datec">
			<zzx-calendar @selected-change="datechange"  @change-month="monthchange" :dotList="dotLists" :cilck_time="cilck_time"></zzx-calendar>
		</view>
		<!-- <view class="dateshow">
			<span style="margin-right: 10px;">{{Data}}</span>
			<span>{{Week}}</span>
		</view> -->
		<!-- 未完成工作单列表 -->
		<cl-dialog title="未完成工单" :visible="show_dislog" :closeOnClickModal="false" :showCloseBtn="true">
			<view v-for="item in UnFinshLists" :key="item" @click="gotoday(item)">
				<text class="unfinsh">{{item.job_date}}</text>
			</view>
		</cl-dialog><!--  -->
		<!-- 工单状态 -->
		<view class="orderStatusBox" >
			<u-tabs
			        :list="list"
					:current="current"
			        lineWidth="30"
			        lineColor="#0e8cf1"
			        :activeStyle="{
			            color: '#303133',
			            fontWeight: 'bold',
			            transform: 'scale(1.05)'
			        }"
			        :inactiveStyle="{
			            color: '#606266',
			            transform: 'scale(1)'
			        }"
			        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
					
					@click="clickHandle"
			    >
			    </u-tabs>
		</view>
		<!-- 搜索框 -->
		<view class="seachBox">
			<view class="text-left" style="flex:1;overflow: hidden;">
				<cl-select  :disabled="disabled" v-model="query.type" :options="typeList" placeholder="服务类型"></cl-select>
			</view>
			<view class="text-left" style="flex:1;">
				<cl-input :disabled="disabled" v-model="query.value" placeholder="搜索 公司名/地址"/>
			</view>
			<view class="text-right" style="flex:1;">
				<button class="seach-button" @tap="seach()">搜索</button>
			</view>
		</view>
		<!-- 内容 -->
		<view class="noservice" v-if="jobs.length==0">
			没有任务哦~~
		</view>
		<view class="order-list">
			<view class="item" v-for="(item,index) in jobs" :key="index" @click="job_detail(index)">
				<view class="top_box">
					<view class="title">{{item.customer.name_zh}}</view>
					<view class="labs">
						<view class="lab-item">{{item.service_type_info.service_name}}</view>
						<view class="lab-item">{{item.first_job}}</view>
						<view class="lab-item" v-if="item.customer.customer_type_text">{{item.customer.customer_type_text}}</view>
						<view class="lab-item" v-if="item.stop_status==1">已暂停</view>
						<view class="lab-item" v-if="item.customer.upload_source.name">{{item.customer.upload_source.name}}</view>
					</view>
				</view>
				<view class="info-box">
					<view class="date_time">{{item.job_start_time}}-{{item.job_end_time}}</view>
					<view class="addr">{{item.addr}}</view>
					<view class="setup">
						<view class="setup-list">
							<view class="item" :class="item.sign_info.sign_in ?'cur':' ' ">
								<view class="icon"><u-icon name='checkmark' size="14" color="#ffffff" v-if="item.sign_info.sign_in"></u-icon></view>
								<view class="text">签到</view>
							</view>
							<view class="item" :class="item.report_autograph ? 'cur':''">
								<view class="icon"><u-icon name='checkmark' size="14" color="#ffffff" v-if="item.report_autograph"></u-icon></view>
								<view class="text">客户签字</view>
							</view>
							<view class="item" :class="item.sign_info.sign_out ? 'cur':''">
								<view class="icon"><u-icon name='checkmark' size="14" color="#ffffff" v-if="item.sign_info.sign_out"></u-icon></view>
								<view class="text">签离</view>
							</view>
							<view class="item" :class="item.order_report ? 'cur':''">
								<view class="icon"><u-icon name='checkmark' size="14" color="#ffffff" v-if="item.order_report"></u-icon></view>
								<view class="text">生成报告</view>
							</view>
							<view class="item" :class="item.status == 3 ? 'cur':''">
								<view class="icon"><u-icon name='checkmark' size="14" color="#ffffff" v-if="item.status == 3"></u-icon></view>
								<view class="text">完成</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- end -->
		<u-modal :show="show" @confirm="confirm" @cancel="cancel" ref="uModal" :asyncClose="true" :closeOnClickOverlay="true" title="提示" confirmText="去签离" cancelText="取消"
		showConfirmButton="true" showCancelButton="true" v-if="noSignOrder">
			<view class="slot-content">
				<rich-text :nodes="noSignOrder.content" v-if="noSignOrder.content"></rich-text>
			</view>
		</u-modal>
		
		<u-popup :show="reportShow" :round="4" mode="center" @close="close" @open="open">
			<view class="report_container">
				<view class="report_header">
					<view class="title">待生成报告</view>
				</view>
				<view class="report_content">
					<view class="item" v-for="(item,i) in pdfData" :key="i">
						<view class="order-info">
							<view class="date">{{item.job_date}}</view>
							<view class="company">{{item.customer.name_zh}}</view>
							<view class="lab">
								<view class="lab-item">{{item.service_type_info.service_name}}</view>
							</view>
						</view>
						<view class="handle-ck">
							<view class="h-item" @click="goDetail(item)">去完善</view>
							<view class="h-item" @click="createPdf(i)">生成报告</view>
						</view>
					</view>
				</view>
				<view class="report_footer">
					<view class="item first" @click="createPdfAll">一键生成报告</view>
					<view class="item" @click="close(1)">关闭弹窗</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
import zzxCalendar from "@/components/zzx-calendar/zzx-calendar.vue"
export default {
	components: {
		zzxCalendar
	},
	data() {
		return {
			name:'首页',
			Data: new Date().toISOString().slice(0, 10),
			Week: this.getWek(new Date().toISOString().slice(0, 10)),
			jobs: [],
			dotLists: [],
			isShowContent: false,
			UnFinshLists: [],
			cilck_time: '',
			isFirstShow: false,
			show_dislog: false,
			query: {type:'', value:''},
			typeList: [],
			
			show: false,
			noSignOrder:{},
			
			current:0,
			list: [
				{
                    name: '待开始(0)'
                },
				{
                    name: '进行中(0)',
                }, 
				{
                    name: '已完成(0)',
                }],
			startData:[],
			conductData:[],
			successData:[],
			reportShow: false,
			pdfData:[],
			openPdf:0,
		};
	},
	onLoad() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要加1  
		const date = String(now.getDate()).padStart(2, '0');  
		let todayISOString = `${year}-${month}-${date}`;   
		this.Data = todayISOString
		
		this.openPdf = uni.getStorageSync('pdfOpen')
	},
	onShow(index) {
		
		this.getInitInfo()
		this.getjobs();
		this.getJobTotal();
		if(!this.isFirstShow){
			this.getUnFinshJobs();
		}
		
		this.getNoSignOrder()
		
		this.getOrderList()
		
		this.openPdf = uni.getStorageSync('pdfOpen')
		setTimeout(()=>{
			if(this.openPdf ==1 && this.pdfData.length>0){
				this.reportShow = true
			}
		},400)
	},
	methods: {
		createPdfAll(){
			if(this.pdfData.length==0){
				uni.showToast({
					title:'暂无报告可以生成！',
					icon:'none'
				})
				return false
			}
			
			let arr = [];
			this.pdfData.forEach((item,i)=>{
				arr.push({job_id:item.job_id, job_type:item.job_type})
			})
			console.log(arr)
			let param = JSON.stringify(arr)
			console.log(param)
			uni.showToast({
				icon:'loading',
				title:'生成中'
			})
			setTimeout(()=>{
				uni.showToast({
					icon:'loading',
					title:'请等一会查看！'
				})
				
			},1500)
			setTimeout(()=>{
				this.reportShow = false
			},2500)
			uni.setStorageSync('pdfOpen',0)
			this.$api.makePdf(param).then(res=>{
				console.log(res)
				// uni.showToast({
				// 	title:res.msg,
				// 	icon:'none'
				// })
				this.pdfData = []
				
			}).catch(err=>{
				console.log(err)
			})	
		},
		createPdf(index){
			let param = JSON.stringify([{
			    'job_id':this.pdfData[index].job_id,
			    'job_type':this.pdfData[index].job_type
			}])
			uni.showToast({
				icon:'loading',
				title:'生成中'
			})
			console.log(param)
			this.$api.makePdf(param).then(res=>{
				console.log(res)
				uni.showToast({
					title:res.msg,
					icon:'none'
				})
				this.pdfData.splice(index, 1)
			}).catch(err=>{
				console.log(err)
			})	
		},
		getOrderList(){
			let param = {}
			this.$api.OrderMakePdf(param).then(res=>{
				this.pdfData = res.data
			}).catch(err=>{
				console.log(err)
			})
		},
		open() {
			// console.log('open');
		},
		close(e) {
			console.log(e)
			if(e==1){
				uni.setStorageSync('pdfOpen',0)
			}
			this.reportShow = false
		},
		clickHandle(e){
			// console.log(e)
			this.jobs = []
			if(e.index==0){
				this.current = 0
				this.jobs = this.startData
			}
			if(e.index==1){
				this.current = 1
				this.jobs = this.conductData
			}
			if(e.index==2){
				this.current = 2
				this.jobs = this.successData
			}
		},
		// 未签离工单
		getNoSignOrder(){
			let params = {}
			this.$api.noOrderSign(params).then(res=>{
				if(res.code == 200) {
					// console.log('未签离和暂停工单:',res.data)
					
					if(res.data.data && res.data.data.length>0){
						console.log(res.data.data[0])
						this.noSignOrder = res.data.data[0]
					}else{
						this.noSignOrder = {}
					}
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		cancel(){
			this.show = false
		},
		confirm() {
			this.show = false;
			uni.navigateTo({
				url: "/pages/service/start?jobtype=" + this.noSignOrder.job_type + "&jobid=" + this.noSignOrder.job_id
			});
		},
		// 滑动月份触发事件
		monthchange(e){
			this.getJobTotal(e);
		},
		// 点击日 - 事件
		datechange(e) {
			// console.log('点击日 - 事件',e)
			this.Data = e.fullDate;
			this.Week = this.getWek(e.fullDate);
			this.getjobs();
			
			this.getNoSignOrder()
		},
		getWek(day) {
			var dateObject = new Date(day);
			var wekdate = dateObject.getDay();
			var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			return weekday[wekdate];
		},
		goDetail(item){
			uni.navigateTo({
				url: "/pages/service/start?jobtype=" + item.job_type + "&jobid=" + item.job_id + '&hos=0'
			})
		},
		// 工作单详情
		job_detail(index) {
			// console.log(this.noSignOrder.job_id)
			// console.log(this.jobs[index].id)
			// 未完成工单提示
			if(this.noSignOrder.job_id && this.jobs[index].status == 2 && this.noSignOrder.job_id != this.jobs[index].id){
				this.show = true
				return false
			}
			
			let jobid = this.jobs[index].id
			let type  = this.jobs[index].order_type
			
			// console.log(this.jobs[index].customer.customer_type_text)
			if(this.jobs[index].customer.customer_type_text){
				uni.setStorageSync('ct', 1);
			}else{
				uni.setStorageSync('ct', 0);
			}
			uni.navigateTo({
				url: "/pages/service/detail?jobtype=" + type + "&jobid=" + jobid
			});
		},
		// 列表
		getjobs() {
			
			this.list = []
			let params = {
				jobdate: this.Data //todayISOString
			}
			this.$api.dayOrderList(params).then(res=>{
				this.current = '0'
				if(res.code == 200) {
					// console.log(res)
					
					if(res.data.data){
						this.jobs = res.data.data.start_data
						
						this.startData = res.data.data.start_data
						this.conductData = res.data.data.conduct_data
						this.successData = res.data.data.success_data
						
						this.list = res.data.list
					}else{
						this.jobs = []
						this.startData = []
						this.conductData = []
						this.successData = []
						this.list = [{ name: '待开始(0)' }, { name: '进行中(0)'}, { name: '已完成(0)'}]
					}
					
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		// 统计
		getJobTotal(ym = '') {
			if(ym==''){
				var currentYear = new Date().getFullYear() 
				var currentMonth = new Date().getMonth() + 1 
				var ym = currentYear + '-' + currentMonth
			}
			let params = {month:ym}
			this.$api.dayCount(params).then(res=>{
				if(res.code == 200) {
					this.dotLists = res.data
					this.isShowContent = true
					uni.hideLoading()
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		//获取未完成的工单列表
		getUnFinshJobs(){
			var that = this
			var date = new Date()
			var year = date.getFullYear()
			var month = (date.getMonth()+1).toString().padStart(2,'0')
			var day = date.getDate().toString().padStart(2,'0')
			var time = year+'-'+month+'-'+day

			this.$api.unFinshJobs({month: time}).then(res=>{
				if(res.code == 200) {
					that.UnFinshLists = res.data
					that.isFirstShow = true
					if(res.data.length !== 0){
						that.show_dislog = true
					}
					uni.hideLoading()
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		//跳转至对应日期
		gotoday(row){
			// 显示当天工单
			this.Data = row.job_date;
			this.Week = this.getWek(row.job_date);
			this.getjobs();

			//跳转到当天日期
			//处理时间为[Wed Oct 09 2024 00:00:00 GMT+0800 (GMT+08:00)]这种格式
			const dateParts = row.job_date.split("-");
			const year = parseInt(dateParts[0], 10);
			const month = parseInt(dateParts[1], 10) - 1; // 月份从 0 开始计数
			const day = parseInt(dateParts[2], 10);
			this.cilck_time = {
				cur : new Date(year, month, day).toString(),
				fullDate : row.job_date
			}

			this.show_dislog = false
		},
		//获取基础信息
		getInitInfo(){
			var that = this

			this.$api.InitInfo().then(res=>{
				if(res.code == 200) {
					console.log('res.data',res.data)
					var type = [{label:'服务类型',value:''}];
					for(var i in res.data.typeList){
						type.push({label:res.data.typeList[i],value:i})
					}
					that.typeList = type
					uni.hideLoading()
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		//搜索
		seach(){
			if(this.query.type=='' && this.query.value ==''){
				uni.showToast({
					title:'请选择服务类型和输入搜索关键词',
					icon:'none'
				})
				return false
			}
			let params = {
				jobdate: this.Data, //todayISOString
				service: this.query.type,
				value: this.query.value
			}
			this.$api.dayOrderList(params).then(res=>{
				if(res.code == 200) {
					// this.jobs = res.data
					if(res.data.data){
						this.jobs = res.data.data.start_data
						
						this.startData = res.data.data.start_data
						this.conductData = res.data.data.conduct_data
						this.successData = res.data.data.success_data
						
						this.list = res.data.list
					}else{
						this.jobs = []
						this.startData = []
						this.conductData = []
						this.successData = []
						this.list = [{ name: '待开始(0)' }, { name: '进行中(0)'}, { name: '已完成(0)'}]
					}
				}
			}).catch(err=>{
				console.log(err)
			})
		}
	}
}
</script>
<style lang="scss">
.report_container{
	width: 680rpx;
	.report_header{
		padding-left: 36rpx;
		border-bottom: 1rpx solid #e0dcdc;
		.title{
			font-size: 28rpx;
			color: #333;
			padding: 34rpx 0;
		}
	}
	.report_content{
		padding: 20rpx 0;
		height: 600rpx;
		overflow-y: auto;
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 36rpx;
			.order-info{
				.date{
					font-size: 26rpx;
					color: #333;
					margin-bottom: 20rpx;
					position: relative;
					padding-left: 20rpx;
				}
				.date::after{
					content:'';
					width: 12rpx;
					height: 12rpx;
					background: #0374e8;
					border-radius: 50%;
					position: absolute;
					top: 12rpx;
					left: 0;
				}
				.company{
					font-size: 25rpx;
					color: #000000;
					font-weight: 600;
					margin-bottom: 10rpx;
				}
				.lab{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-bottom: 10rpx;
					.lab-item{
						font-size: 26rpx;
						font-weight: 400;
						color: #555555;
						border: 1rpx solid #d7d7d7;
						border-radius: 8rpx;
						padding: 6rpx 6rpx;
						min-width: 110rpx;
						text-align: center;
						background: #f2f2f2;
						margin-right: 16rpx;
					}
				}
			}
			.handle-ck{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.h-item{
					font-size: 26rpx;
					color: #0374e8;
					margin-left: 36rpx;
				}
			}
		}
	}
	.report_footer{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-top: 1rpx solid #eee;
		height: 110rpx;
		.item{
			width: calc(50% - 1rpx);
			height: 110rpx;
			line-height: 110rpx;
			font-size: 26rpx;
			color: #0374e8;
			text-align: center;
			border-left: 1rpx solid #e0dcdc;
		}
		.item.first{ border-left: none;}
	}
}
.setup-list{
	display: flex;
	justify-content: space-between;
	align-items: center;
	.item{
		display: block;
		text-align: center;
		.icon{
			width: 36rpx;
			height: 36rpx;
			background: #f2f3f5;
			border-radius: 50%;
			margin: 0 auto;
			position: relative;
			
			display: flex;
			    align-items: center;
			    justify-content: center;
			text{
				display: block;
				margin: 0 auto;
				color: #0bc267;
			}
		}
		.icon::after{
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			color: #12900a;
		}
		.icon::before{
			content: '';
			position: absolute;
			top: 50%;
			right: -80rpx;
			width: 80rpx;
			height: 1rpx;
			background: #f2f3f5;
		}
		.text{
			font-size: 24rpx;
			color: rgba(134, 144, 156,1);
			padding: 10rpx 0;
		}
	}
	.item.cur{
		.icon{
			background: #0bc267;
		}
		.text{
			font-size: 24rpx;
			color: #333;
			padding: 10rpx 0;
		}
		.icon::before{
			background: #12900a;
		}
	}
	.item:nth-child(5){
		.icon::before{
			display: none;
		}
	}
}
.order-list{
	.item{
		background-color: #FFFFFF;
		border-radius: 10px;
		
		margin-bottom: 10px;
		padding:30rpx 30rpx ;
		.top_box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom: 1rpx solid #a5a6a7;
			padding-bottom: 16rpx;
			.title{
				font-size: 28rpx;
				color: #333333;
				font-weight: 700;
			}
			.labs{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 506rpx;
				overflow-x: auto;
				.lab-item{
					font-size: 26rpx;
					font-weight: 400;
					color: #555555;
					border: 1rpx solid rgba(215,215,215,1);
					border-radius: 8rpx;
					padding: 6rpx 6rpx;
					min-width: 110rpx;
					text-align: center;
					background: #f2f2f2;
					margin-left: 16rpx;
				}
			}
		}
		.info-box{
			padding: 10rpx 0 0;
			.date_time{
				font-size: 32rpx;
				font-weight: 700;
				margin-bottom: 16rpx;
			}
			.addr{
				font-size: 24rpx;
				color: #333333;
				margin-bottom: 20rpx;
			}
		}
	}
}
.slot-icon{
    width: 21px;
    height: 21px;
    background-color: #f9ae3d;
    border-radius: 100px;
    font-size: 12px;
    color: #fff;
    line-height: 21px;
    text-align: center;
}

.datec {
	background-color: #FFFFFF;
	border-radius: 15px;
}
.datecontent {
	margin: 10px 5px;
}
.dateshow {
	font-size: 18px;
	margin: 10px;
}
.new_card {
	background-color: #FFFFFF;
	border-radius: 10px;
	padding-bottom: 10px;
	margin-bottom: 10px;
}
.new_card_title {
	border-bottom: 1px solid #e0dcdc;
	font-size: 18px;
	font-weight: bold;
	padding: 10px 5px;
	height: 25px;
}
.new_card_title_left {
	float: left;
	width: 80%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.new_card_title_right {
	font-size: 17px;
	float: right;
}
.new_card_content {
	margin: 10px 5px;
	font-size: 16px;
}
.new_card_content view {
	margin-bottom: 5px;
}
.noservice {
	text-align: center;
	margin-top: 20%;
	color: #a5a6a7;
	font-size: 17px;
}
.content_t {
	color: #6b6464;
	margin: 10px;
}
.service_name {
	background-color: #c6ecc0;
	color: #12900a;
	border-radius: 8px;
	padding: 3px 0px;
	text-align: center;
	margin-right: 5px;
}
.first_job {
	background-color: #cbe8ff;
	color: #0876f1;
	border-radius: 8px;
	padding: 3px 0px;
	text-align: center;
	margin-right: 5px;
}
.stop_status{
	color: red;
}
.customer_type {
	background-color: #f6a6a6;
	color: #e01313;
	border-radius: 8px;
	padding: 3px 0px;
	text-align: center;
	margin-right: 5px;
}
.content {
	padding: 50px 5px;
	height: 5%;
	background-color: #0e8cf1;
	color: #6b6464;
}
.customer_type.kc{
	
    border-radius: 8px;
    padding: 3px 0px;
    text-align: center;
    margin-right: 5px;
	
	background: #ea8e4c;
	color: #000000;
}
.unfinsh{
	color:blue;
	line-height: 26px;
}
.seachBox{
	padding-top: 5%;
  display: flex;
}
.text-left {
	float: left;
	padding: 0 5px;
}
.text-right {
	float: right;
	padding: 0 5px;
}
.seach-button{
	background: #0e8cf1;
	color: #FFFFFF;
	font-size: 13px;
}
.label-date{
	position: relative;
	padding-top: 10rpx;
	.label-status{
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		font-size: 26rpx;
	}
}
</style>