<template>
	<view class="content">
		<view class="add" @tap="risk_detail(0)">
			<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<view class="service">
			<view class="service_title">
			  <view class="title-item">
				<!--          <cl-badge :value="222">-->
				<cl-tag type="info">风 险 评 估({{ risk_total }})</cl-tag>
				<!--          </cl-badge>-->
			  </view>
			  <view class="title-item title-item-left"  @tap="last_risk()">

				<cl-badge :value="dotConfirmNum" type="success" >
				  <cl-tag type="primary">待 确 认  </cl-tag>
				</cl-badge>

			  </view>
			  <view class="title-item title-item-right" @tap="last_risk()">
				<cl-badge :value="dotNum" type="error" >
				  <cl-tag size="small" type="warning">历史风险记录</cl-tag>
				</cl-badge>
			  </view>
			</view>

			<view class="service_content">
				<view class="noservice" v-if="risks.length==0">
					没有数据哦~~
				</view>
				<view v-else class="service_content">
					<view class="risk" v-for="(item,index) in risks" :key="index" @tap="risk_detail(item.id)" v-if="risks.length>0">
						<cl-row>
							<cl-col span="9">
								<img :src="item.img" />
							</cl-col>
							<cl-col span="15" style="text-align: left;line-height: 22px;">
								<cl-list><span>靶标：</span>{{item.risk_targets}}</cl-list>
								<cl-list v-if="ct==1"><span>风险区域：</span>{{item.risk_area}}</cl-list>
								<cl-list><span>风险类别：</span>{{item.risk_types}}</cl-list>
								<cl-list><span>跟进时间：</span>{{item.follow_date}}</cl-list>
								<cl-row>
									<cl-col span="12">
										<view class="fx">风险等级：{{item.risk_rank}}</view>
									</cl-col>
									<cl-col span="12">
										<view class="gj">跟进次数：{{item.follow_times}}</view>
									</cl-col>
								</cl-row>
							</cl-col>

						</cl-row>
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
export default {
	data() {
		return {
			name:'风险跟进',
			risks: [],
			tablename: "briefings",
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
		
		this.data_select()
		this.getItems()
		// this.dotAlert()
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
				this.data_select()
			}
	        
	     }
	},
	methods: {
		// 历史风险记录
		getItems(){
			// 未解决
			let params = {
				job_id: this.jobid,
				job_type: this.jobtype,
				type:0
			}
			this.$api.stayQuestion(params).then(res=>{
				// console.log(res)
				this.dotNum = res.data.total
				// this.lastrisks_n = res.data.data || []
			}).catch(err=>{
				// console.log(err)
			})
		},
		data_select() {
			let params = {
				page:this.page,
				limit:this.limit,
				job_id: this.jobid,
				job_type: this.jobtype,
			}
			this.$api.risksList(params).then(res=>{
				console.log(res)
				if (res.code == 200) {
					this.total = res.data.data.total	// 总数
					let list = res.data.data.data		// 分页
					list.forEach((item,i)=>{
						let photoArr = []
						if(item.site_photos != null){
							photoArr = item.site_photos.split(",")
						}
						item.img = `${this.$baseUrl_imgs}` + photoArr[0]
						console.log(item.img)
					})
					
					
					this.risks = this.risks.concat(list)
					this.risk_total	 = res.data.assess_count	// 风险评估数
					this.isLoadMore=false				
					setTimeout(()=>{
						this.isLoadMore = true
						this.loading = false
					},1000)
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		dotAlert() {

				let params = {
					staffid: uni.getStorageSync('staffid'),
					job_id: this.jobid,
					job_type: this.jobtype
				}
				uni.request({
					url: `${this.$baseUrl}/GetrisksTotals`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: params,
					success: (res) => {
						let result = res.data.data
							console.log(result)
							if (res.data.code == 1) {
								if (Object.keys(result).length !== 0) {
									this.dotNum = result.n;
									this.dotConfirmNum = result.g;

									console.log(this.dotNum)
									console.log(this.dotConfirmNum)
								}

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none',
								});
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/login/login"
									});
								}, 2000)
							}

					},
					fail: (err) => {
							console.log(res);
					}
				});
		},
		//风险
		last_risk() {
			uni.navigateTo({
				url: "/pages/service/last_risk?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
					'&service_type=' + this.service_type + '&shortcut_type=' + this.shortcut_type
			})
		},
		//风险详情页
		risk_detail(id) {
			uni.redirectTo({
				url: "/pages/service/risk_detail?jobid=" + this.jobid + '&jobtype=' + this.jobtype +'&id=' + id 
			})
				
		},
		//...
	}
}
</script>

<style>
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
	}

	.risk cl-list {
		line-height: 16px;
	}

	.risk img {
		height: 100px;
		width: 130px;
		border-radius: 10px;
	}

	.risk span {
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
  .service_title {
    display: flex;
    align-items: center;
  }
  .title-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .title-item-right {
    float: right;
    position: absolute;
    right: 3%;

  }

  .title-item-left {
    /*font-size: 21px;*/
    float: right;
    position: absolute;
    padding-left: 35%;

  }
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
