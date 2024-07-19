<template>
	<view>
		<view class="service" style="width: 100%;">
			<view class="">照片<span class="dcts">(最多4张)</span>
			</view>
			<view class="service_content">
				<view label="限制上传图片格式/大小">
					<mx-upload :url="upPicUrl" :header="headerUpload" :fileName="file" ref="upload3" title="添加现场照片"
						@upload="handleLoaded3" @change="handleChange3" :number="4" :formData="formData"
						
						:photos="photos">
						<template v-slot:icon>
							<text class="s-add-list-btn-icon">+</text>
						</template>
					</mx-upload>
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
			type:[Array],
			default:[]
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
	created() {
		// console.log('组件：',this.photos)
	},
	methods:{
		handleChange3() {
			this.$refs.upload3.upload();
		},
		
		// 获取上传或者预览后的图片
		handleLoaded3(arr) {
			// console.log('图片上传:',arr) 
			// [{ error: false , progress: 100, result: "/storage/uat_img/20240719/240719111925246531926.jpg" ,successInfo: "上传成功", 
			// url: "https://files.lbsapps.cn/storage/uat_img/20240719/240719111925246531926.jpg", usuccess: true}]
			
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
			// console.log(imageStr); // /storage/uat_img/20240719/240719111925246531926.jpg,/storage/uat_img/20240719/240719111925618430187.jpg
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