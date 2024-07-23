<template>
	<view class="container">
		<view class="list">
			<view class="item" v-for="(item,i) in data" :key="i" @click="goDetail(item.id)">
				{{item.category_title}} ({{item.count}})
			</view>
			
		</view>
		
	</view>
</template>

<script>
export default{
	data(){
		return{
			name:'风险评估问题列表',
			job_id:'',
			data:[]
		}
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
		this.jobid = index.jobid
		this.list()
	},
	methods:{
		// 勘查总结信息
		list() {
			let params = {
				id:this.jobid,
			}
			this.$api.getRiskCategoryList(params).then(res=>{
				console.log(res)
				if(res.code==200){
					this.data = res.data
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		//  详细
		goDetail(id){
			
			uni.navigateTo({
				url:'/pages/service/risk_show?id=' + id +'&jobid=' + this.jobid +'&jobtype=' + this.jobtype
			})
			
		}
	}
}
</script>

<style lang="scss">
.container{
	padding: 20rpx 16rpx;
	height: 95vh;
	.list{
		background: #fff;
		border-radius: 10rpx;
		padding: 36rpx 40rpx;
		// .item{
		// 	font-size: 32rpx;
		// 	color: #333;
		// 	font-weight: 500;
		// 	text-align: center;
		// 	background: #eee;
		// 	border: 1rpx solid #999;
		// 	height: 88rpx;
		// 	line-height: 88rpx;
		// 	margin-bottom: 40rpx;
		// }
		.item{
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			color: #323233;
			background-color: #fff;
			border-color: #ebedf0;
			border-width: 1px;
			border-style: solid;
			border-radius: 10rpx;
			text-align: center;
			margin-bottom: 40rpx;
			overflow: hidden;
		}
	}
}
</style>