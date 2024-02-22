<template>
	<view>
		<swiper-item>
			<cl-scroller>
				<view style="background-color: #FFFFFF;">
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="跟进时间：">
							<text>{{lastrisk.follow_date}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险类别：">
							<text>{{lastrisk.risk_types}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险虫害：">
							<text>{{lastrisk.risk_targets}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险等级：">
							<text>{{lastrisk.risk_rank}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险标签：">
							<text>{{lastrisk.risk_label}}</text>
						</cl-list-item>
					</view>
				</view>
				<view class="card_u">
					<view class="title">现场照片:</view>
					<view class="block">
						<cl-image size="150rpx" v-for="(site_photo, index_p) in lastrisk.site_photos" :key="key" :src="site_photo" :preview-list="[site_photo]">
						</cl-image>
					</view>
				</view>
				<view class="card_u">
					<view class="title">风险描述:</view>
					<view class="block">
						{{lastrisk.risk_description}}
					</view>
				</view>
				<view class="card_u">
					<view class="title">整改建议:</view>
					<view class="block">
						{{lastrisk.risk_proposal}}
					</view>
				</view>
				<view class="card_u">
					<view class="title">采取措施:</view>
					<view class="block">
						{{lastrisk.take_steps}}
					</view>
				</view>
				<view class="claer" style="width: 100%; height: 202rpx;"></view>
				
			</cl-scroller>
			
		</swiper-item>
		
		<!-- 按钮 -->
		<view class="bu">
			<cl-row v-if="lastrisk.status==0 || lastrisk.confirm_status == 1">
				<cl-col span="12">
					<view  class="jc" @tap="save(1)">已解决</view>
				</cl-col>
				<cl-col span="12">
					<view class="qc" @tap="save(2)">未解决</view>
				</cl-col>
			</cl-row>
			<cl-row v-else-if="lastrisk.status==1">
				<view class="qc">已解决</view>
			</cl-row>
			<cl-row v-else-if="lastrisk.status==2 || lastrisk.confirm_status == 1">
				<view class="qc">跟进中</view>
			</cl-row>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lastrisk: [],
				id: 0,
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
			this.id = index.id
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			this.data_select()
		},
		methods: {
			data_select() {
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype,
					id: this.id,
				}
				this.$api.getRiskInfo(params).then(res=>{
					// console.log(res)
					if (res.code == 200) {
						
						if(res.data.risk){
							this.lastrisk = res.data.risk
							// this.lastrisk['site_photos'] = this.lastrisk['site_photos'].split(",")
							for (let i = 0; i < this.lastrisk['site_photos'].length; i++) {
								var site_po = this.lastrisk['site_photos'][i].replace(/\"/g, "").replace(/[\\]/g,'');
								this.lastrisk['site_photos'][i] = `${this.$baseUrl_imgs}/`+site_po;
							}
						}
						
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			save(status) {
				let params = {
					id: this.id,
					confirm_status:status
				}
				this.$api.editRiskByTeach(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: "/pages/service/last_risk?jobid=" +
								this
								.jobid + '&jobtype=' + this
								.jobtype +
								'&shortcut_type=' +
								this.shortcut_type +
								'&service_type=' + this
								.service_type
						})
					}, 2000)
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.card_u {
		background-color: #FFFFFF;
		margin-top: 14px;
	}

	.title {
		border-bottom: 1px solid #e0dcdc;
		font-size: 17px;
		padding: 10px;
		height: 25px;
	}

	.block {
		padding: 10px;
		font-size: 16px;
		display: flex;
	}
	.block cl-image {
		width: 22%;
		float: left;
		margin: 5px;
	}
	.cl-list-item__label {
	    padding: 0 20rpx 0 0;
	    font-size: 34rpx;
	}
	cl-list-item text{
		font-size: 16px;
	}
	.bu {
		background-color: #fff;
		height: 50px;
		text-align: center;
		border-top: 1px solid #f5f2f2;
		font-size: 18px;
		font-weight: bold;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
	}

	.jc {
		background-color: #FFFFFF;
		color: #007AFF;
	}

	.qc {
		background-color: #007AFF;
		color: #FFFFFF;
		height: 50px;
	}
</style>
