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
		</cl-dialog>
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
		<!-- 工作单 -->
		<view class="datecontent" v-for="(item,index) in jobs" :key="index">
			<view class="new_card" @click="job_detail(index)">
				<view class="new_card_title">
					<view class="new_card_title_left">
						<text selectable="true">{{item.customer.name_zh}}</text>
					</view>
					<span>
						<view class="new_card_title_right" :style="{ color: item.service_status.color }">{{item.service_status.status}}</view>
					</span>
				</view>
				<view class="new_card_content">
					<view>
						<cl-row v-if="item.order_type !=3 ">
							<cl-col span="8">
								<view class="service_name"><text selectable="true">{{item.service_type_info.service_name}}</text></view>
							</cl-col>
							<cl-col span="8">
								<view class="first_job" v-if="item.first_job_flag==1">{{item.first_job}}</view>
								<view v-else class="first_job">{{item.first_job}}</view>
							</cl-col>
							<!-- 工厂 -->
							<cl-col span="8"  v-if="item.customer.customer_type_text">
								<view class="customer_type">{{item.customer.customer_type_text}}</view>
							</cl-col>
						</cl-row>
						<cl-row v-else>
							<cl-col span="8" >
								<view class="customer_type kc">勘察服务</view>
							</cl-col>
						</cl-row>
						
						<view>
						</view>
					</view>
					<view>
						<span class="content_t">日期:</span>
						<text selectable="true">{{item.job_date}}</text>
						
					</view>
					<view>
						<span class="content_t">时间:</span>
						<text selectable="true">{{item.job_start_time}}-{{item.job_end_time}}</text>
					</view>
					<view>
						<span class="content_t">地址:</span>
						<text selectable="true">{{item.addr}}</text>
					</view>
					<view style="display: flex;height: 20px;" v-if="item.customer_grade.score!=''">
						<span style="margin-left:10px;">客户点评:</span>
						<view style="margin-left:10px;">
							<u-rate :count="3" v-model="item.customer_grade.score" active-color="#ffc800" inactive-color="#dadada" gutter="3" readonly touchable="false"></u-rate>
						</view>
					</view>
					
					<view class="label-date" v-if="item.job_order_date && item.job_order_date.id">
						<span class="content_t">是否异常:</span>
						<text selectable="true">
							
							{{item.job_order_date.abnormal_text}}
							
						</text>
					</view>
					
					<view class="label-date" v-if="item.job_order_date && item.job_order_date.id">
						<span class="content_t" style="color: #178bde;">调整日期:</span>
						<text selectable="true" style="color: #178bde;">{{item.job_order_date.job_date}}</text>
						<view class="label-status">
							<span v-if="item.job_order_date.status==1" style="color: red;">审核中</span>
							<span v-if="item.job_order_date.status==2" style="color: #12900a;">审核通过</span>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<!-- end -->
		<u-modal :show="show" @confirm="confirm" @cancel="cancel" ref="uModal" :asyncClose="true" :closeOnClickOverlay="true" title="提示" confirmText="去签离" cancelText="取消"
		showConfirmButton="true" showCancelButton="true">
			<view class="slot-content">
				<rich-text :nodes="noSignOrder.content"></rich-text>
			</view>
		</u-modal>
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
			noSignOrder:{}
		};
	},
	onLoad() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要加1  
		const date = String(now.getDate()).padStart(2, '0');  
		let todayISOString = `${year}-${month}-${date}`;   
		this.Data = todayISOString
	},
	onShow(index) {
		this.getInitInfo()
		this.getjobs();
		this.getJobTotal();
		if(!this.isFirstShow){
			this.getUnFinshJobs();
		}
		
		this.getNoSignOrder()
	},
	methods: {
		// 未签离工单
		getNoSignOrder(){
			let params = {}
			this.$api.noOrderSign(params).then(res=>{
				if(res.code == 200) {
			
					this.noSignOrder = res.data
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
				url: "/pages/service/detail?jobtype=" + this.noSignOrder.type + "&jobid=" + this.noSignOrder.id
			});
		},
		// 滑动月份触发事件
		monthchange(e){
			this.getJobTotal(e);
		},
		// 点击日 - 事件
		datechange(e) {
			console.log('点击日 - 事件',e)
			this.Data = e.fullDate;
			this.Week = this.getWek(e.fullDate);
			this.getjobs();
		},
		getWek(day) {
			var dateObject = new Date(day);
			var wekdate = dateObject.getDay();
			var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			return weekday[wekdate];
		},
		// 工作单详情
		job_detail(index) {
			// 未完成工单提示
			if(this.jobs[index].status == 2 && this.noSignOrder.name_zh && this.noSignOrder.id != this.jobs[index].id){
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
			
			let params = {
				jobdate: this.Data //todayISOString
			}
			this.$api.dayOrderList(params).then(res=>{
				if(res.code == 200) {
					
					this.jobs = res.data
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
			let params = {
				jobdate: this.Data, //todayISOString
				service: this.query.type,
				value: this.query.value
			}
			this.$api.dayOrderList(params).then(res=>{
				if(res.code == 200) {
					this.jobs = res.data
				}
			}).catch(err=>{
				console.log(err)
			})
		}
	}
}
</script>
<style lang="scss">
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

