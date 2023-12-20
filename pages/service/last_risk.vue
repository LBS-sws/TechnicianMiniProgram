<template>
	<view class="content">
		<!-- <view class="noservice" v-if="lastrisks_n.length==0 && lastrisks_y.length==0 ">
			没有数据哦~~
		</view> -->
		<view>
			<view class="service">
				<view class="service_title">未解决问题列表({{lastrisks_n.length}})
				</view>
				<view class="service_content">
					<view class="risk" v-for="(item,index) in lastrisks_n" :key="index"
						@tap="last_risk_detail(item.id)">
						<cl-row>
							<cl-col span="9">
								<img :src="item.site_photos" />
							</cl-col>
							<cl-col span="15" style="text-align: left;line-height: 22px;">
								<cl-list><span>标靶：</span>{{item.risk_targets}}</cl-list>
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
				</view>
			</view>
			<view class="service">
				<view class="service_title">跟进中问题列表({{lastrisks_f.length}})
				</view>
				<view class="service_content">
					<view class="risk" v-for="(item,index) in lastrisks_f" :key="index"
						@tap="last_risk_detail(item.id)">
						<cl-row>
							<cl-col span="9">
								<img :src="item.site_photos" />
							</cl-col>
							<cl-col span="15" style="text-align: left;line-height: 22px;">
								<cl-list><span>标靶：</span>{{item.risk_targets}}</cl-list>
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
				</view>
			</view>
<!--待确认列表-->
			<view class="service">
				<view class="service_title">待确认问题列表({{lastrisks_g.length}})
				</view>
				<view class="service_content">
					<view class="risk" v-for="(item,index) in lastrisks_g" :key="index"
						@tap="last_risk_detail(item.id)">
						<cl-row>
							<cl-col span="9">
								<img :src="item.site_photos" />
							</cl-col>
							<cl-col span="15" style="text-align: left;line-height: 22px;">
								<cl-list><span>标靶：</span>{{item.risk_targets}}</cl-list>
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
				</view>
			</view>

      <view class="service">
        <view class="service_title">已解决问题列表({{lastrisks_y.length}})
        </view>
        <view class="service_content">
          <view class="risk" v-for="(item,index) in lastrisks_y" :key="index"
                @tap="last_risk_detail(item.id)">
            <cl-row>
              <cl-col span="9">
                <img :src="item.site_photos" />
              </cl-col>
              <cl-col span="15" style="text-align: left;line-height: 22px;">
                <cl-list><span>标靶：</span>{{item.risk_targets}}</cl-list>
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
        </view>
      </view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'风险历史',
				lastrisks_n: [],
				lastrisks_f: [],
				lastrisks_y: [],
				lastrisks_g: [],
				tablename: "briefings",
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
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
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			
			this.getQ1()
			this.getQ2()
			this.getQ3()
			this.getQ4()
		},
		methods: {
			// 未解决
			getQ1(){
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					type:3
				}
				this.$api.stayQuestion(params).then(res=>{
					
					let list = res.data.data
					list.forEach((item,i)=>{
						
						let arr = item.site_photos.split(",")
						let site_po = arr[0].replace(/\"/g, "").replace(/[\\]/g, '');
						item.site_photos = `${this.$baseUrl_imgs}/` + site_po
					})
					
					this.lastrisks_n = list
				}).catch(err=>{
					console.log(err)
				})
			},
			// 跟进问题
			getQ2()
			{
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					type:2
				}
				this.$api.followQuestion(params).then(res=>{
					// console.log(res.data.data)
					this.lastrisks_f = res.data.data || []
					let list = res.data.data
					list.forEach((item,i)=>{
						if(item.site_photos)
						{
							let arr = item.site_photos.split(",")
							let site_po = arr[0].replace(/\"/g, "").replace(/[\\]/g, '');
							item.site_photos = `${this.$baseUrl_imgs}/` + site_po
						}
					})
					// console.log(list)
					this.lastrisks_f = list
				}).catch(err=>{
					// console.log(err)
				})
			},
			// 已解决问题
			getQ3(){
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					type:1
				}
				this.$api.resolvedQuestion(params).then(res=>{
					// console.log(res)
					// this.lastrisks_y = res.data.data || []
					let list = res.data.data
					list.forEach((item,i)=>{
						
						let arr = item.site_photos.split(",")
						let site_po = arr[0].replace(/\"/g, "").replace(/[\\]/g, '');
						item.site_photos = `${this.$baseUrl_imgs}/` + site_po
					})
					this.lastrisks_y = list
				}).catch(err=>{
					console.log(err)
				})
			},
			// 确认
			getQ4(){
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					type:4
				}
				this.$api.verifyQuestion(params).then(res=>{
					let list = res.data.data
					list.forEach((item,i)=>{
						
						let arr = item.site_photos.split(",")
						let site_po = arr[0].replace(/\"/g, "").replace(/[\\]/g, '');
						item.site_photos = `${this.$baseUrl_imgs}/` + site_po
					})
					this.lastrisks_g = list
				}).catch(err=>{
					console.log(err)
				})
			},
			//风险详情页
			last_risk_detail(index) {
				uni.redirectTo({
					url: "/pages/service/last_risk_detail?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						'&service_type=' + this.service_type + '&shortcut_type=' + this.shortcut_type + '&id=' +
						index
				})
			},
		}
	}
</script>

<style>
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
		width: 90px;
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

	.new_card_content {
		margin: 10px;
		font-size: 15px;
	}

	.new_card_content view {
		margin-bottom: 10px;
	}

	.new_card_content span {
		color: #5e6165;
	}

	/* new */
	.content {
		padding: 10px;
	}

	.service {
		padding-bottom: 15px;
	}

	.service_title {
		/* color: #03A9F4; */
		font-size: 18px;
		font-weight: bold;
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
</style>
