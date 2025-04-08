<template>
	<view>
		<view class="order_title">
			<view class="title">发现该客户有其他工单</view>
			<view class="text">1.可选择一个工单继续做，会将选择的工单自动签到</view>
		</view>
		<view  class="popup-container">
			<view class="datecontent" v-for="(item,index) in jobs" :key="index">
				<view class="new_card">
					<view class="new_card_content order-item">
						<view>
							<cl-row v-if="item.order_type !=3 ">
								<cl-col span="8">
									<view class="service_name"><text selectable="true">{{item.service_name}}</text></view>
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
						<view class="checked-ui" @click.stop="checkboxHandle(index)">
							<view class="ck-icon" v-if="item.has"><image src="/static/order-checked.png" mode="widthFix"></image></view>
							<view class="ck-icon" v-else><image src="/static/order-check.png" mode="widthFix"></image></view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
		<view class="comsub">
			<view class="other_customer" @click="signOut">先做其他客户</view>
			<view class="sub_btn"  @tap="$noMultipleClicks(nextOrder)">确认</view>
			<!-- @click="nextOrder" -->
		</view>
	</view>
</template>

<script>

export default{
	props:{
		jobs:{
			type:[Array],
			default:[]
		},
		jobId:{
			type:[Number],
			default:0
		},
		jobType:{
			type:[Number],
			default:0
		},
	},
	data(){
		return{
			noClick: true,
		}
	},
	created() {

	},
	methods:{
		// 先做其他客户
		signOut(){
			// console.log(this.jobId)
			// console.log(this.jobType)
			this.$emit('signOut');
		},
		// 确定按钮 - 去做其他单
		nextOrder(){
			//console.log(this.jobs)
			let arr = []
			this.jobs.forEach((item,i)=>{
				if(item.has==true){
					arr.push(item)
				}
			})
			
			if(arr.length == 0){
				uni.showToast({
					title:'请选择工单',
					icon:'none'
				})
				return false
			}
			console.log('next')
			// uni.showToast({
			// 	title:'none',
			// 	icon:'loading'
			// })
			uni.showLoading({
				title: '加载中...',
				mask: true,
				showContent: false
			});
			
			// return false
			let params = {
				job_id:this.jobId,
				job_type:this.jobType,
				id:arr[0].job_id,
				type:arr[0].job_type,
			}
			// console.log(params)
			this.$api.autoNextOrder(params).then(res=>{
				console.log(res)
				if(res.code==200){
					uni.hideLoading();
					uni.navigateTo({
						url: "/pages/service/start?jobid=" + arr[0].job_id + "&jobtype=" + arr[0].job_type
					})
				}
			}).catch(err=>{
				
			})
		},
		// 点击选中效果
		checkboxHandle(index){
			this.jobs.forEach((item,i)=>{
				if(i == index){
					this.jobs[index].has = !this.jobs[index].has
				}else{
					item.has = false
				}
			})
			this.$emit('updateJobList',this.jobs)
		}
		// end
	}
}
</script>

<style lang="scss">
.popup-container{
	height: 600rpx;
	overflow-y: auto;
}
.order_title{
	text-align: center;
	.title{
		font-size: 36rpx;
		color: #333;
		font-weight: 700;
		padding: 30rpx 0;
	}
	.text{
		font-size: 26rpx;
		color: #333;
		font-weight: 400;
	}
}
.datecontent {
	margin: 10px 5px;
	.new_card {
		background-color: #FFFFFF;
		border-radius: 10px;
		.order-item{
			border: 1rpx solid #999;
			padding: 20rpx 20rpx;
			border-radius: 15rpx;
			position: relative;
			.checked-ui{
				position: absolute;
				top: 50%;
				right: 10rpx;
				.ck-icon{
					width: 30rpx;
					height: 30rpx;
					image{
						height: auto;
						width: 100%;
					}
				}
			}
		}
		.new_card_content {
			font-size: 16px;
			view {
				margin-bottom: 5px;
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
			}
		}
	}
}
.comsub{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10rpx 30rpx;
	.other_customer{
		width: calc(50% - 40rpx);
		height: 80rpx;
		border: 1rpx solid #999;
		border-radius: 6rpx;
		line-height: 80rpx;
		font-size: 26rpx;
		text-align: center;
		color: #333;
	}
	.sub_btn{
		width: calc(50% - 40rpx);
		height: 80rpx;
		border: 1rpx solid #1e98d7;
		border-radius: 6rpx;
		line-height: 80rpx;
		font-size: 26rpx;
		text-align: center;
		background: #1e98d7;
		color: #fff;
	}
}
</style>