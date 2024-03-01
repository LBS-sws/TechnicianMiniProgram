<template>
	<view class="content">
		<view class="add" @tap="add(0)">
			<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<view class="list" v-for="(item,index) in photos" :key="index" @tap="add(item.id)">
			<view class="block">
				<cl-image size="150rpx" v-for="(site_photo, index_p) in item.site_photos" :key="index_p"
					:src="site_photo" :preview-list="[site_photo]">
				</cl-image>
			</view>
			<view class="sign_time" v-if="item.remarks">
				{{item.remarks}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'现场工作照',
				photos: [],
				tablename: "photos",
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				custInfo: {}
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
			// this.shortcut_type = index.shortcut_type
			// this.service_type = index.service_type
			this.getList()
		},
		// 同start 回调  暂不使用
		onReady() {
			uni.$on('custInfo', (data) => {
				//我把传过来的数据存到了 data 中
				this.custInfo = data
				console.log('接收数据', data);
			})
			uni.$emit('send')
		},
		onUnload() {
			uni.$off('send')
			uni.$off('custInfo')
		},
		methods: {
			// 列表
			getList() {
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
				}
				this.$api.SiteWorkPhotosList(params).then(res=>{
					if (res.code == 200) {
						if (res.data) {
							let list = res.data.data
							list.forEach((item,i)=>{
								// console.log(item.site_photos)
								// 处理图片地址
								item.site_photos.forEach((itemx,index)=>{
									item.site_photos[index] = `${this.$baseUrl_imgs}` + itemx
								})
								item.remarks = item.remarks
							})
							this.photos = list
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
			add(id) {
				uni.redirectTo({
					url: "/pages/service/add_photo?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						'&shortcut_type=' + this.shortcut_type + '&service_type=' + this.service_type + '&id=' +
						id +
						'&customer=' + this.custInfo.customer +
						'&address=' + this.custInfo.address
				})
			}
		}
	}
</script>

<style>
	.sign_content {
		border-bottom: 1px solid #eeeeee;
		padding: 10px;
	}

	.sign_title {
		text-align: left;
		font-size: 18px;
		padding: 0px 15px 10px 15px;
		color: #504f4f;
	}

	.sign_time {
		text-align: left;
		font-size: 13px;
		/* background-color: #f7f7f7; */
		border-radius: 10px;
		padding: 10px;
		margin: 1px;
		background-color: #cbe8ff;
		color: #0876f1;
	}

	.sign_qm {
		/*flex 布局*/
		display: flex;
		/*实现垂直居中*/
		align-items: center;
		/*实现水平居中*/
		justify-content: center;
	}

	.block {
		display: flow-root;
	}

	.block cl-image {
		width: 22%;
		float: left;
		margin: 5px;
	}

	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
	}

	.cl-list {
		margin-bottom: 20rpx;
		font-size: 16px;
	}

	/* new */
	.material_name {
		background-color: #c6ecc0;
		color: #12900a;
		border-radius: 8px;
		padding: 3px;
		text-align: center;
		margin: 2px
	}

	.dosage {
		background-color: #cbe8ff;
		color: #0876f1;
		border-radius: 8px;
		padding: 3px;
		text-align: center;
		margin: 2px
	}

	.use_area {
		background-color: #f7cfcc;
		color: #ec1505;
		border-radius: 8px;
		padding: 3px;
		text-align: center;
		margin: 2px
	}
	.list {
		background-color: #FFFFFF;
		margin: 10px;
		font-size: 17px;
		color: #7b7070;
		border-radius: 10px;
		padding: 10px;
	}
	
	.list span {
		color: #000000;
	}
</style>
