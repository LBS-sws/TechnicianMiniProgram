<template>
	<view>
		<view class="service">
			<view class="service_title">现场照片<span class="jh" v-if="ct==0">*</span><span class="dcts">(最多4张)</span>
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
	export default {

		data() {
			return {
				upload_site_photos: [],
				upPicUrl: `${this.$baseUrl}/Upload.Upload/image`,
				headerUpload: {
					// 'content-type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('token')
				},
				ct: 0,
				formData: {
					// file:item,
					type:1
				},
			}
		},
		onLoad() {

		},
		onShow() {
			// if(res.data.code == 400)
			// {
			// 	uni.$utils.toast(res.data.msg)
			// 	return false
			// }
		},
		methods: {
			onBeforeUpload(file, index) {
				// 受支持的图片格式
				// const fileType = ['image/png', 'image/jpeg'];
				// 受支持的图片大小
				// if (file.size / 1000 > 51.2) {
				//     uni.showToast({icon:'none',title:`图片大小不能大于50K`});
				//     return false;
				// }
				// if (fileType.indexOf(fileType) === -1) {
				//     uni.showToast({icon:'none',title:`仅支持${fileType.join('、').replace(/image\//g, '')}图片格式`});
				//     return false;
				// }
			},

			handleChange3() {
				this.$refs.upload3.upload();
			},

			// 获取上传或者预览后的图片
			handleLoaded3(arr) {
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
			del() {
				this.$refs["del_confirm"].open({
					title: "提示",
					message: "确认删除？",
					callback: ({
						action
					}) => {
						if (action == 'confirm') {
							if (this.id == '' || this.id == 0) {
								uni.showToast({
									icon: 'none',
									title: '请选择删除物料'
								});
								return;
							} else {
								let param = {
									staffid: uni.getStorageSync('staffid'),
									del_id: this.id,
									job_id: this.jobid,
									job_type: this.jobtype,
								}
								uni.request({
									url: `${this.$baseUrl}/delrisk`,
									header: {
										'content-type': 'application/x-www-form-urlencoded',
										'token': uni.getStorageSync('token')
									},
									method: 'POST',
									data: param,
									success: (res) => {
										if (res.data.code == 1) {
											uni.showToast({
												icon: 'none',
												title: '删除成功'
											});
											setTimeout(() => {
												uni.redirectTo({
													url: "/pages/service/risk?jobid=" +
														this
														.jobid + '&jobtype=' + this
														.jobtype +
														'&shortcut_type=' +
														this.shortcut_type +
														'&service_type=' + this
														.service_type
												})
											}, 2000)

										}
									},
									fail: (err) => {
										console.log(res);
									}
								})
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: '取消成功'
							});
						}
					}
				});
			},
			//...
		}
	}
</script>

<style lang="scss">

</style>