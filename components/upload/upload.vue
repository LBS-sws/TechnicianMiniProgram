<template>
	<view>
		<view class="service" style="width: 100%;">
			<view class="">照片<span class="dcts">(最多4张)</span>
			</view>
			<view class="service_content">
				<view label="限制上传图片格式/大小">
					<m-upload :url="upPicUrl" :header="headerUpload" :fileName="file" ref="upload3" title="添加现场照片"
						@upload="handleLoaded3" @change="handleChange3" :number="4" :formData="formData">
						<template v-slot:icon>
							<text class="s-add-list-btn-icon">+</text>
						</template>
					</m-upload>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 上传图片
export default{
	props:{
		photos:{
			type:[Object,Array],
			default:{}
		},
		current:{
			type:[Number],
			default:''
		}
	},
	data(){
		return{
			upload_site_photos: [],
				
			upPicUrl: `${this.$baseUrl}/Upload.Upload/image`,
			init_photos: [],
			headerUpload: {
				'token': uni.getStorageSync('token')
			},
		}
	},
	methods:{
		handleChange3() {
			this.$refs.upload3.upload();
		},
		
		// 获取上传或者预览后的图片
		handleLoaded3(arr) {
			console.log('arrarrarrarr',arr)
			var imageStr = "";
			var imgArray = []
			for (var i = 0; i < arr.length; i++) {
				imageStr += arr[i].result + ",";
				imgArray.push(arr[i].result)
			}
			//去掉最后一个逗号
			if (imageStr.length > 0) {
				imageStr = imageStr.substr(0, imageStr.length - 1);
			}
			// console.log(imageStr);
			console.log('imageStrimageStrimageStr',imageStr)
			this.upload_site_photos = imageStr
			
			let obj = {
				index: this.current,
				imgArr: imgArray
			}
			this.$emit('imageEdit', obj);
			
		},
	}
}
</script>

<style>
</style>