<template>
	<view class="img-preview">
		<view :style="{ height: Height + 'px' }" class="imgbox">
			<image :src="imgUrl" mode="widthFix"></image>
		</view>
		<view class="po">
			<view class="wrap">
				<view class="back" @click="retake">
					重拍
				</view>
				<view class="back" @click="confirm">
					使用照片
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
export default{
	props:{
		Height:{
			type:[Number,String],
			default:''
		},
		imgUrl:{
			type:[String],
			default:''
		}
	},
	data(){
		return{
			uploadUrl: `${this.$baseUrl}/Upload.Upload/image`,
			headerUpload: {
				'token': uni.getStorageSync('token')
			},
			formData: {
				type:0
			},
		}
	},
	created() {
		
	},
	methods:{
		retake(){
			console.log('重拍')
			this.$emit('retake')
		},
		confirm(){
			console.log('使用')
			
			uni.showToast({
				icon:'loading',
				title:'正在上传'
			})
			// return false
			let that = this
			const upTask = uni.uploadFile({
				url: this.uploadUrl,
				filePath: this.imgUrl,
				name: 'file',
				formData: this.formData,
				header: this.headerUpload,
				success: res => {
					// console.log(res)
					var uploadRes = JSON.parse(res.data);
					console.log(uploadRes)
					if(uploadRes.code == 200)
					{
						that.$emit('confirm',uploadRes.data)
					}
					if(uploadRes.code == 0)
					{
						uni.showToast({
							title: '上传失败 : ' + uploadRes.msg,
							icon: 'none'
						})
					}
				},
				fail: e => {
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					});
				}
			});
		}
	}
}
</script>

<style lang="scss">
.img-preview{
	background: #000;
	width: 100%;
	height: 100vh;
	.imgbox{
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 100%;
			max-height: 325px;
		}
	}
	.po {
		width: 100%;
		background-color: #000;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 140rpx;
		.wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100%;
			padding: 0 73rpx;
			.back{
				font-size: 32rpx;
				color: #fff;
			}
		}
	}
}
</style>