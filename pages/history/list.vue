<template>
	<view class="content">
		<cl-card label="按时间条件查询">
			<cl-row>
				<!-- <cl-col span="6">
					<veiw>
						<cl-select v-model="val" :options="list"></cl-select>
					</veiw>
				</cl-col> -->
				<cl-col span="19">
					<!-- 日期 -->
					<view style="margin-top: 5px;"><cl-text :margin="[0, 0, 0, 20]" :value="daterange.join('~')" @tap="open"></cl-text></view>

					<cl-calendar ref="calendar" type="daterange" v-model="daterange" />
				</cl-col>
				<cl-col span="5">
					<cl-button type="primary" icon="cl-icon-search" @tap="search()">查询</cl-button>
				</cl-col>
			</cl-row>
		</cl-card>
		<!-- 内容 -->
		
		<!-- 工作单 -->
		<view class="datecontent" v-for="(item,index) in jobs" v-if="jobs.length>0">
			<view class="new_card" @click="job_detail(item)">
				<view class="new_card_title">
					<view class="new_card_title_left">
						{{item.name_zh}}
					</view>
					<span v-if="item.status">
						<span >
							<view class="new_card_title_right" style="color: #07C160;">{{item.status}}</view>
						</span>
						
					</span>
				</view>
				<view class="new_card_content">
					<view>
						<cl-row>
							<cl-col span="8">
								<view class="service_name">{{item.service_name}}</view>
							</cl-col>
							<cl-col span="8">
								<view class="first_job">{{item.first_job_flag}}</view>
							</cl-col>
						</cl-row>
						<view></view>
					</view>
					<view>
						<span class="content_t">日期:</span>
						{{item.job_date}}
					</view>
					<view>
						<span class="content_t">时间:</span>
						{{item.job_start_time}}-{{item.job_end_time}}
					</view>
					<view>
						<span class="content_t">地址:</span>
						<span v-if="item.addr">{{item.addr}}</span>
					</view>
					<view style="display: flex;height: 20px;" v-if="item.customer_grade!=null">
						<span style="margin-left:10px;">客户点评:</span>
						<view style="margin-left:10px;">
							<u-rate :count="3" v-model="item.customer_grade" active-color="#ffc800" inactive-color="#dadada" gutter="3" readonly touchable="false"></u-rate>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="display: block; text-align: center;" v-if="loading">
			<cl-loading></cl-loading>
		</view>
		<view v-else class="loadingText">没有数据啦!</view>
		<!-- end -->
	</view>
</template>
<script>

import dayjs from 'dayjs';
	export default {
		data() {
			return {
				name:'历史任务',
				daterange: ["2023-01-02", "2023-12-31"],
				jobs:[],
				jobid:"",
				jobtype:"",
				servicetype:"",
				list:[
					{
						label: "服务单",
						value: 1
					},
					{
						label: "跟进单",
						value: 2
					}
				],
				val:1,
				page: 1,		// 当前页 m
				limit: 10,		// 每页多少条 m
				total:'',		// 总条数
				loading:false,
				isLoadMore:true,
				beginDate:"",
				endDate:"",
				customer_id:""
			};
		},
		onLoad(index) {
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
			this.getCurrentMonthFirst();
			this.jobid = index.job_id
			this.jobtype = index.job_type
			this.servicetype = index.service_type
			this.customer_id = index.customer_id
			this.getList()
			
			
		},
		created(){

		},
		//	上拉触底函数
		onReachBottom(){
		     if(this.isLoadMore){  //此处判断，上锁，防止重复请求
				if(this.total< this.limit * this.page){
					this.loading = false
				}else{
					this.loading = true
					this.isLoadMore = true
					this.page+=1
					this.getList()
				}
		        
		     }
		},
		methods: {
			
			getCurrentMonthFirst(){
				var date = new Date();
			    date.setDate(1);
				
				const today = dayjs()
				this.endDate = dayjs().format("YYYY-MM-DD") // 结束日期
				this.beginDate = today.subtract(90,'day').format('YYYY-MM-DD')  // 开始日期
				this.daterange = [this.beginDate,this.endDate]
			},                
			// 列表
			getList() {	
				let params = {
					startDate:this.beginDate,
					endDate:this.endDate,
					job_id:this.jobid,
					job_type:this.jobtype,
					service_type:this.servicetype,
					customer_id:this.customer_id,
					page:this.page,
					limit:this.limit
				}
				this.$api.searchOrder(params).then(res=>{
					// console.log(res.data)
					
					if (res.data.order_list.length == 0 && res.data.follow_list.length == 0){
					   console.log("数组为空")
					   this.loading = false
					   return false
					}
					// 工作单
					let job_order = []
					if(res.data.order_list.data){
						if(res.data.order_list.data.length>0){
							job_order = res.data.order_list.data
						}
					}
					
					// 跟进单
					let follow_order = []
					if(res.data.follow_list.data){
						if(res.data.follow_list.data.length>0){
							follow_order = res.data.follow_list.data
						}
					}
					
					const arrList = job_order.concat(follow_order);
					arrList.sort(function(a, b) {
						return b.job_date < a.job_date ? -1 : 1
					})
					
					// console.log(arrList);
					this.total = res.data.order_list.total
					this.jobs = this.jobs.concat(arrList)
					
				}).catch(err=>{
					console.log(err)
				})
			},
			open() {
				this.$refs.calendar.open();
			},
			// 搜索 this.daterange 为选中的开始日期和结束日期
			search() {
				this.loading = false
				let params = {
					startDate:this.daterange[0],
					endDate:this.daterange[1],
					job_id:this.jobid,
					job_type:this.val,
					service_type:this.servicetype,
					customer_id:this.customer_id,
					page:this.page,
					limit:this.limit
				}
				this.$api.searchOrder(params).then(res=>{
					console.log(res)
					
					// 没有数据
					if (res.data.order_list.length == 0 && res.data.follow_list.length == 0){
					   
					   this.loading = false
					   return false
					}
					// 工作单
					let job_order = []
					if(res.data.order_list.data){
						if(res.data.order_list.data.length>0){
							job_order = res.data.order_list.data
						}
					}
					
					// 跟进单
					let follow_order = []
					if(res.data.follow_list.data){
						if(res.data.follow_list.data.length>0){
							follow_order = res.data.follow_list.data
						}
					}
					
					// const arrList = job_order.concat(follow_order);
					
					const arrList = job_order.concat(follow_order);
					arrList.sort(function(a, b) {
						return b.job_date < a.job_date ? -1 : 1
					})
					
					this.total = res.data.order_list.total
					this.jobs = []
					this.jobs = arrList
				}).catch(err=>{
					console.log(err)
				})
			},
			job_detail(e) {
				// uni.navigateTo({
				// 	url: "/pages/history/job_detail?jobid=" + e.id +"&jobtype="+ e.type
				// })
				uni.navigateTo({
					url: "/pages/service/detail?jobtype=" + e.type + "&jobid=" + e.id + "&hos=1"
				});
			},
			//...
		}
	};
</script>


<style>
	.content {
		/* width: 98%;
		margin: 0px 1%; */
	}

	.chaxun {
		margin-top: 10rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		border: 1px solid #d8d3d3;
	}

	.add_data {
		border-right: 1px solid rgb(216, 211, 211);
		height: 35px;
	}

	.ys_data {
		text-align: center;
		margin: 7px 10px;
		font-size: 14px;
	}


	.cl-select__value {
	    display: inline-block;
	    height: 70rpx;
	    width: 100%;
	    overflow: hidden;
	}
	.datec {
		background-color: #FFFFFF;
	}

	.datecontent {
		margin: 10px;
	}

	.dateshow {
		font-size: 16px;
		margin: 10px;
	}
	.new_card {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
		margin-bottom: 10px;

	}
	.new_card_title {
	    border-bottom: 1px solid #e0dcdc;
	    font-size: 18px;
	    font-weight: bold;
	    padding: 10px;
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
		margin: 10px;
		font-size: 16px;
		color: #7b7070;
	}

	.new_card_content view {
		margin-bottom: 5px;
	}

	.noservice {
		text-align: center;
		margin-top: 20%;
		color: #a5a6a7;
		font-size: 17px
	}
	/* new */
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
	/* new */
	.content {
		/* background-image: url(../../static/images/my.png); */
		padding: 50px 5px;
		height: 5%;
		background-color: #0e8cf1;
		color: #6b6464;
	}
	
.cl-card__container{ padding:  20rpx 0;}
.cl-button{ padding: 0 20rpx;}

.loadingText{
	text-align: center;
	font-size: 24rpx;
	color: #666;
	padding: 10rpx 0;
}
</style>
