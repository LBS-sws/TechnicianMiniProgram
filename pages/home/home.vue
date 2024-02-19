<template>
	<view v-if="isShowContent" class="content">
		<view class="datec">
			<zzx-calendar @selected-change="datechange"  @change-month="monthchange" :dotList="dotLists"></zzx-calendar>
		</view>
		<view class="dateshow">
			<!-- <span style="margin-right: 10px;">{{Data}}</span>
			<span>{{Week}}</span> -->
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
					<span v-if="item.status == 2">
						<span v-if="item.job_start_time == '00:00:00'">
							<view class="new_card_title_right" style="color: #007AFF;">{{item.service_status}}</view>
						</span>
						<span v-else>
							<view class="new_card_title_right" style="color: #007AFF;">{{item.service_status}}</view>
						</span>
					</span>
					<span v-if="item.status == 3">
						<view class="new_card_title_right" style="color: #07C160;">{{item.service_status}}</view>
					</span>
					<span v-if="item.status == -1">
						<span v-if="item.job_start_time == '00:00:00'">
							<view class="new_card_title_right" style="color: #EE0A24;">{{item.service_status}}</view>
						</span>
						<span v-else>
							<view class="new_card_title_right" style="color: #007AFF;">{{item.service_status}}</view>
						</span>
					</span>
				</view>
				<view class="new_card_content">
					<view>
						<cl-row>
							<cl-col span="8">
								<view class="service_name"><text selectable="true">{{item.service_type_info.service_name}}</text></view>
							</cl-col>
							<cl-col span="8">
								<view class="first_job" v-if="item.first_job_flag==1">{{item.first_job}}</view>
								<view v-else class="first_job">{{item.first_job}}</view>
							</cl-col>
							<cl-col span="8" v-if="item.customer.customer_type==203 || item.customer.customer_type==250">
								<view class="customer_type">工厂服务</view>
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
						<text selectable="true">{{item.customer.addr}}</text>
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
		<!-- end -->
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
		};
	},
	onLoad() {
		uni.showLoading({
			title: "加载中...",
			icon: 'none',
			mask: true
		})
		
		var token = uni.getStorageSync('token')
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
	},
	onShow(index) {
		this.getjobs();
		this.getJobTotal();
	},
	methods: {
		// 滑动月份触发事件
		monthchange(e){
			console.log(e)
			this.getJobTotal();
		},
		// 点击日 - 事件
		datechange(e) {
			this.Data = e.fullDate;
			this.Week = this.getWek(e.fullDate);
			this.getjobs();
			// this.getJobTotal();
		},
		getWek(day) {
			var dateObject = new Date(day);
			var wekdate = dateObject.getDay();
			var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			return weekday[wekdate];
		},
		// 工作单详情
		job_detail(index) {
			
			let jobid = this.jobs[index].id
			let type  = this.jobs[index].order_type
			if(this.jobs[index].customer.customer_type == 203 || this.jobs[index].customer.customer_type == 250){
				uni.setStorageSync('ct', 1);
				var ct = 1 ;
			}else{
				uni.setStorageSync('ct', 0);
				var ct = 0 ;
			}
			
			uni.navigateTo({
				url: "/pages/service/detail?jobtype=" + type + "&jobid=" + jobid
			});
		},
		// 列表
		getjobs() {
			let params = {
				jobdate: this.Data
			}
			
			this.$api.dayOrderList(params).then(res=>{
				// console.log(res)
				this.checkCode(res.code,res.msg)	// 400、401处理
				
				if(res.code == 200) {
					this.jobs = res.data
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		// 统计
		getJobTotal() {
			let params = {}

			this.$api.dayCount(params).then(res=>{
				this.checkCode(res.code,res.msg)	// 400、401处理
				if(res.code == 200) {
					this.dotLists = res.data
					this.isShowContent = true
					uni.hideLoading()
				}
			}).catch(err=>{
				console.log(err)
			})
		}
		//...
	}
}
</script>

<style>
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
		/* color: #7b7070; */
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

	/* 字体 */

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

	.customer_type {
		background-color: #f6a6a6;
		color: #e01313;
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
</style>

