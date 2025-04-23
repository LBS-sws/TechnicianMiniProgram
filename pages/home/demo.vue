<template>
	<view class="content">
		<!-- <camera device-position="back" flash="auto" style="width: 100%; height: 300px;"></camera> -->
		<!-- <hycamera v-if="show"  @runMethod="getCarmera"></hycamera> -->
		<!-- <button type="default" @click="runCarmera">打开摄像机</button> -->
		
		<button @click="handleUploadVideo">上传视频</button>
	</view>
</template>

<script>
	import hycamera from "@/components/shusheng-hycamera/shusheng-hycamera.vue"
	export default {
		components: {
			hycamera
		},
		data() {
			return {
				show:true// false
			}
		},
		onLoad() {
			
		},
		methods: {
			// 点击上传视频 + 压缩视频
			handleUploadVideo () {
				console.log('上传视频')
				
			    const self = this;
			    uni.chooseVideo({
			        sourceType: ['camera', 'album'],
			        success: function(res) {
			            
					
			            // 调用上传视频的方法
			            self.uploadVideo(res.tempFilePath);
			        }
			    });
			},
			// 上传视频方法
			uploadVideo(tempFilePath) {
			    // 先清空之前可能存在的视频地址，避免干扰
			    this.videoUrl = '';
			    uni.uploadFile({
			        url: `${this.$baseUrl}/Upload.Upload/video`,
			        filePath: tempFilePath,
			        name: 'file',
			        formData: {
			            // 'user': 'test'
						'token': uni.getStorageSync('token')
			        },
			        success: (uploadFileRes) => {
						console.log(uploadFileRes)
			            
			        },
			        fail: (err) => {
			            console.log(err, '文件上传失败');
			            uni.showToast({
			                title: '视频上传失败，请检查网络或文件格式是否正确',
			                icon: 'none'
			            });
			        }
			    });
			},
			runCarmera(){
				this.show = true
			},
			getCarmera(type,res){
				console.log(type,res)
				
				uni.showToast({
				    title: '成功'+type,
				    duration: 2000
				});
			}
		}
	}
</script>

<style>
	.content {}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
