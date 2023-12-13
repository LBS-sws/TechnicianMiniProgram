<template>
	<view>
		<view class="service">
			<view class="service_title">现场照片<span class="jh">*</span><span class="dcts">(最多4张)</span></view>
			<view class="service_content">
				<view label="限制上传图片格式/大小">
					<uni-upload :url="upPicUrl" :header="headerUpload" :fileName="file" ref="upload3" title="添加工作照片"
						@upload="handleLoaded3" @change="handleChange3" :number="4" :type="type">
						<template v-slot:icon>
							<text class="s-add-list-btn-icon">+</text>
						</template>
					</uni-upload>
				</view>
			</view>
			<!-- upload -->
			
		</view>
	</view>
</template>
 
<script>
import uniUpload from '@/components/uni-upload/uni-upload.vue';
	export default {
		components: {
			uniUpload,
		},
		data() {
			return {
				headerUpload: {
					// 'content-type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('token')
				},
				upPicUrl: `${this.$baseUrl}/Upload.Upload/image`,
			}
		},
		onLoad() {
			// uni.$utils.toast("消息")
			// this.login()
		},
		methods: {
			handleChange3() {
				this.$refs.upload3.upload();
			},
			
			// 获取上传或者预览后的图片
			handleLoaded3(arr) {
				console.log("获取上传或者预览后的图片：")
				console.log(arr)
				var imageStr = "";
				for (var i = 0; i < arr.length; i++) {
					imageStr += arr[i].result + ",";
				}
				//去掉最后一个逗号
				if (imageStr.length > 0) {
					imageStr = imageStr.substr(0, imageStr.length - 1);
				}
				// console.log(imageStr);
				this.upload_site_photos = imageStr
			},
			// login(){
			// 	let params = {
			// 		staff_code:'403063',
			// 		password:'123456'
			// 	}
			// 	this.$api.passwordLogin(params).then(res=>{
			// 		console.log(res)
			// 	}).catch(err=>{
			// 		console.log(err)
			// 	})
			// },
		}
	}
</script>
 
<style lang="scss">

</style>
