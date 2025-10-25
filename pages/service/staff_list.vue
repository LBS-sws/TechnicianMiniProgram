<template>
	<view class="container">
		<u-search placeholder="请输入客户编号或名称" v-model.trim="key"
		:clearabled="true"
		:showAction="false" actionText="" :animation="true"
		@input="inputFun"
		></u-search>
		<view class="order-list">
			<view class="item" v-for="(item,index) in data" :key="index"
			@click="goDetail(index)">
				<view class="h2">{{item.customer.name_zh}}</view>
				<view class="service_list">
					<view class="service_item service_type">{{item.service_name}}</view>
					<view class="service_item first_job">{{item.first_job}}</view>
				</view>
				<view class="other_info">
					<view class="other_item">
						时间：<text>{{item.job_date}} </text>
						<!-- {{item.job_start_time}} - {{item.job_end_time}} -->
					</view>
					<view class="other_item">
						地址：<text>{{item.addr}}</text>
					</view>
				</view>
				<view class="" :class="[item.type == 1 ? 'date_up' :'staff_up']">
					<view v-if="item.type==1">
						<text>日期变更</text>
						{{item.job_date}} 变更后 {{item.new_job_date}}
					</view>
					<view v-else>
						<text>人员变更</text>
						{{item.staff.name}}({{item.staff.code}})变更后 {{item.nstaff.name}}({{item.nstaff.code}})
					</view>
					
				</view>
				<view class="sh_box">
					<view class="sh_zt">状态：</view>
					<view class="sh_text"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			key:"",
			timer: null, 
			data:[]
		}
	},
	onShow() {
		this.list()
	},
	methods:{
		// 详情
		goDetail(index){
			// console.log(index)
			let id = this.data[index].id
			uni.navigateTo({
				url:'/pages/service/staff_change?id='+ id
			})
		},
		// 搜索
		inputFun(e){
			console.log(e)
			this.clearTimer()
			if (e) {
				this.key = e
				this.timer = setTimeout(() => {
					
					this.list()
				}, 500)
				
			}else{
				this.list()
				
			}
		},
		clearTimer() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
		},
		// 列表
		list(){
			let params = {
				page:1,
				limit:20,
				key: this.key
			}
			this.$api.staffRecord(params).then(res=>{
				// console.log(res.data)
				this.data = res.data
			})
		}
		//...
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
image{
	height: auto;
}
.container{
	padding: 20rpx 20rpx;
}
.order-list{
	padding-top: 20rpx;
	.item{
		background-color: #FFFFFF;
		border-radius: 10px;
		border-bottom: 1rpx solid #eee;
		padding: 20rpx 0;
		.h2 {
		    font-size: 36rpx;
		    font-weight: bold;
		    position: relative;
		    margin-bottom: 20rpx;
		}
		.service_list{
			display: flex;
		    justify-content: flex-start;
		    align-content: center;
		    margin-bottom: 10rpx;
			.service_item{
				min-width: 180rpx;
				height: 44rpx;
				font-size: 30rpx;
			}
			.service_item  {
			    background-color: #c6ecc0;
			    color: #12900a;
			    border-radius: 16rpx;
			    text-align: center;
			    margin-right: 10rpx;
			    line-height: 44rpx;
			}
			.first_job {
			    background-color: #cbe8ff;
			    color: #0876f1;
			    border-radius: 16rpx;
			    text-align: center;
			    margin-right: 10rpx;
			    line-height: 44rpx;
			}
		}
		.other_info{
			.other_item{
				font-size: 28rpx;
				margin-bottom: 10rpx;
				text{
					
				}
			}
			
		}
		.date_up{
			text{
				background: #63bd1e;
				color: #fff;
				padding: 5rpx 10rpx;
				border-radius: 10rpx;
				font-size: 26rpx;
				margin-right: 20rpx;
			}
		}
		.staff_up{
			text{
				background:#d4a41e;
				color: #fff;
				padding: 5rpx 10rpx;
				border-radius: 10rpx;
				font-size: 26rpx;
				margin-right: 20rpx;
			}
		}
		.sh_box{
			padding-top: 10rpx;
			font-size: 28rpx;
			display: flex;
			justify-content: flex-start;
		}
	}
}
</style>
