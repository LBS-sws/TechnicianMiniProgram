<template>
	<view class="content">
		<view class="add" @tap="risk_detail(0)">
			<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<view class="service">
			<view class="service_content">
				<view class="noservice" v-if="risks.length==0">
					没有数据哦~~
				</view>
				<view v-else class="service_content">
					<view class="risk" v-for="(item,index) in risks" :key="index" @tap="risk_detail(item.id)" v-if="risks.length>0">
					
						<view class="item">
							<view class="thumb">
								<img :src="item.img" />
							</view>
							<view class="info">
								<view class="item-x"><text class="span">风险区域：</text>{{item.risk_area}}</view>
								<view class="item-x"><text class="span">风险程度：</text>{{item.risk_types}}</view>
								<view class="item-x"><text class="span">跟进时间：</text>{{item.creat_time}}</view>
							</view>
						</view>
						
					</view>
					<view style="display: block; text-align: center;" v-if="loading">
						<cl-loading></cl-loading>
					</view>
					<view v-else class="loadingText">没有数据啦!</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
// 勘察单 - 风险情况
export default {
	data() {
		return {
			name:'风险情况',
			risks: [],
			jobid: '',
			jobtype: '',
			shortcut_type: '',
			service_type: '',
			showAlert: false,
			dotNum: 0,
			risk_total: 0,
			ct:0,
			dotConfirmNum: 0,
			page: 1,		// 当前页 m
			limit: 10,		// 每页多少条 m
			total:'',		// 总条数
			loading:false,
			isLoadMore:true,
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
		this.jobtype = index.jobtype
		
		this.list()
		
	},
	//	上拉触底函数
	onReachBottom(){
		console.log('触发')
		
	     if(this.isLoadMore){  //此处判断，上锁，防止重复请求
			if(this.total< this.limit * this.page){
				this.loading = false
			}else{
				this.loading = true
				this.isLoadMore = true
				this.page+=1
				this.list()
			}
	        
	     }
	},
	methods: {
		
		list() {
			let params = {
				page:this.page,
				limit:this.limit,
				id: this.jobid,
				
			}
			this.$api.getRiskSituationList(params).then(res=>{
				console.log(res)
				if (res.code == 200) {
					// this.total = res.data.data.total	// 总数
					// let list = res.data.data.data		// 分页
					// list.forEach((item,i)=>{
					// 	let photoArr = []
					// 	if(item.site_photos != null){
					// 		photoArr = item.site_photos.split(",")
					// 	}
					// 	item.img = `${this.$baseUrl_imgs}` + photoArr[0]
					// 	console.log(item.img)
					// })
					
					
					// this.risks = this.risks.concat(list)
					// this.risk_total	 = res.data.assess_count	// 风险评估数
					// this.isLoadMore=false				
					// setTimeout(()=>{
					// 	this.isLoadMore = true
					// 	this.loading = false
					// },1000)
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		
		//风险详情页
		risk_detail(id) {
			uni.redirectTo({
				url: "/pages/service/risk_item?jobid=" + this.jobid + '&jobtype=' + this.jobtype +'&id=' + id 
			})
				
		},
		//...
	}
}
</script>

<style lang="scss">
	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
	}

	.new_card {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
		margin: 10px 0px;

	}

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


	.new_card_title_right span {
		font-size: 15px;
		margin-right: 10px;
	}

	.new_card_content {
		margin: 10px;
		font-size: 16px;
	}

	.new_card_content view {
		margin-bottom: 10px;
	}

	.new_card_content span {
		color: #5e6165;
	}

	.risk {
		background-color: #FFFFFF;
		font-size: 15px;
		/* height: 120px; */
		padding: 10px 0px 0px 0px;
		border-bottom: 1px solid #eeeeee;
		.item{
			display: flex;
			justify-content: flex-start;
			.info{
				margin-left: 20rpx;
				.item-x{
					margin-bottom: 30rpx;
				}
			}
		}
	}

	.risk cl-list {
		line-height: 16px;
	}

	.risk img {
		height: 100px;
		width: 130px;
		border-radius: 10px;
	}

	.risk .span {
		font-weight: bold;
		color: #b91306;
	}

	.fx {
		margin-bottom: 5px;
		width: 103px;
		height: 22px;
		font-size: 14px;
		border-radius: 5px;
		text-align: center;
		background-color: #EEEEEE;
	}

	.gj {
		margin-bottom: 5px;
		width: 90px;
		height: 22px;
		font-size: 14px;
		border-radius: 5px;
		text-align: center;
		background-color: #EEEEEE;
	}

	.noservice {
		text-align: center;
		margin-top: 20%;
		color: #a5a6a7;
		font-size: 17px;
	}


	.grid-dot {
		position: relative;
		top: -25px;

	}

	.alarm {
		position: absolute;
		right: 35%;
		color: white;
		font-size: 17px;
		background-color: red;
		min-height: 24px;
		min-width: 25px;
		line-height: 24px;
		text-align: center;
		border-radius: 24px;
	}

	/* new */
	.content {
		padding: 10px 10px 0 10px;
	}
	.service {
		/* padding-bottom: 15px; */
	}
  /* Rest of the styles */
	.text-green.data-v-2ee6bce8 {
		color: #12900a;
	}

	page {
		background-color: #FFFFFF;
	}

	.service_content {
		margin: 8px 0px;
	}

	.service_content view {
		margin: 3px 0px;
	}
.loadingText{
	text-align: center;
	font-size: 24rpx;
	color: #666;
	padding: 10rpx 0;
}
</style>
