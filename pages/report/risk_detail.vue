<template>
	<view>
		<swiper-item>
			<cl-scroller>
				<view style="background-color: #FFFFFF;">
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="跟进时间：">
							<text>{{risk.creat_time}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险类别：">
							<text>{{risk.risk_types}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险虫害：">
							<text>{{risk.risk_targets}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险等级：">
							<text>{{risk.risk_rank}}</text>
						</cl-list-item>
					</view>
					<view style="border-bottom: 1px solid #eeeeee;">
						<cl-list-item label="风险标签：">
							<text>{{risk.risk_label}}</text>
						</cl-list-item>
					</view>
				</view>
				<view class="card_u">
					<view class="title">现场照片:</view>
					<view class="block">
						<cl-row>
							<cl-col span="6" v-for="(item,index) in photos" :key="index">
							<cl-image size="150rpx" :src="item" :preview-list="[item]">
							</cl-image>
							</cl-col>
						</cl-row>
					</view>
				</view>
				<view class="card_u">
					<view class="title">风险描述:</view>
					<view class="block">
						{{risk.risk_description}}
					</view>
				</view>
				<view class="card_u">
					<view class="title">整改建议:</view>
					<view class="block">
						{{risk.risk_proposal}}
					</view>
				</view>
				<view class="card_u">
					<view class="title">采取措施:</view>
					<view class="block">
						{{risk.take_steps}}
					</view>
				</view>
			</cl-scroller>
		</swiper-item>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'风险跟进',
				id: 0,
				risk: [],
				photos:[]
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
			this.data_select()
		},
		methods: {
			data_select() {
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype,
					id: this.id,
				}
				uni.request({
					url: `${this.$baseUrl}/Risks.Risks/getRiskInfo`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: params,
					success: (res) => {
						// if (res.data.code == 1) {
							this.risk = res.data.data.risk
							let arr = this.risk['site_photos'].split(",");
							console.log(arr)
							
							let photos = []
							arr.forEach((item,i)=>{
								
								let img = `${this.$baseUrl_imgs}/` + item
								photos.push(img)
							})
							console.log(photos)
							this.photos = photos
							// for (let i = 0; i < this.risk['site_photos'].length; i++) {
							// 	var site_po = this.risk['site_photos'][i].replace(/\"/g, "").replace(/[\\]/g,'');
							// 	this.risk['site_photos'][i] = `${this.$baseUrl_imgs}` + site_po;
							// }
							
						// } else {
						// 	uni.showToast({
						// 		title: res.data.msg,
						// 		icon: 'none',
						// 	});
						// 	setTimeout(() => {
						// 		uni.redirectTo({
						// 			url: "/pages/login/login"
						// 		});
						// 	}, 2000)
						// }

					},
					fail: (err) => {
						console.log(res);
					}
				});
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
	}
	.cl-list-item__label {
	    padding: 0 20rpx 0 0;
	    font-size: 34rpx;
	}
	cl-list-item text{
		font-size: 16px;
	}
</style>
