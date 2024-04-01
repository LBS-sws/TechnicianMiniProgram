<template>
	<view class="s-add-list">
		<view class="s-add-list-items" :style="{
				height: size[0],
				width: size[1]
			}" v-for="(item, index) in imageList" :key="index">
			<image :src="item[filedImage]" :url="item.url" @click="showImgs(index)" class="s-add-list-img"
				:mode="imgMode"></image>
			<view class="s-add-list-remove s-icons icon-close" @tap.stop="removeImg" :id="'s-items-img-' + index">
				<icon type="clear" :color="closeColor"></icon>
			</view>
			<view class="upload-progress" :style="{ width: size[1] }">
				<progress :percent="item.progress" :stroke-width="progressSize" :activeColor="progressColor"
					:backgroundColor="progressBgColor" />
			</view>
			<view class="s-add-list-reup" @tap.stop="retry" :data-index="index" v-if="item.error">
				<text class="s-add-list-reup-icon s-icons icon-retry"></text>
				<text class="s-add-list-reup-text">{{ item.errorInfo }}</text>
			</view>
			<view class="s-add-list-reup-su" @tap.stop="retry" :data-index="index" v-if="item.usuccess">
				<text class="s-add-list-reup-icon-su s-icons icon-retry"></text>
				<text class="s-add-list-reup-text-su">{{ item.successInfo }}</text>
			</view>
		</view>
		<view class="s-add-list-items s-add-list-btn" :style="{
				height: size[0],
				width: size[1],
				backgroundColor: backgroundColor
			}" :class="disabled ? 's-disabled' : ''" @tap="addImg" v-if="imageList.length < number">
			<slot name="icon"></slot>
			<view class="s-add-list-btn-text">{{ title }}</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			// 图片字段
			filedImage: {
				type: String,
				default: 'url'
			},
			// 背景颜色
			backgroundColor: {
				type: String,
				default: '#f7f7f7'
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 上传数量
			number: {
				type: Number,
				default: 9
			},
			// 按钮名称
			title: {
				type: String,
				default: '添加工作照片'
			},
			// 上传文字颜色
			titleColor: {
				type: String,
				default: "#666"
			},
			// 图片大小
			size: {
				type: Array,
				default: () => ['222rpx', '222rpx']
			},
			// 上传前钩子
			beforeUpload: {
				type: Function
			},
			// 关闭按钮颜色
			closeColor: {
				type: String,
				default: "#666"
			},
			// 服务器地址
			url: {
				type: String,
				default: ''
			},

			// 进度条进度
			progressSize: {
				type: Number,
				default: 5
			},
			// 进度条颜色
			progressColor: {
				type: String,
				default: "#00aa7f"
			},
			// 进度条背景颜色
			progressBgColor: {
				type: String,
				default: "#666"
			},
			// 上传文件名称
			fileName: {
				type: String,
				default: 'file'
			},
			// 携带的form数据
			formData: {
				type: Object,
				default: () => {
					return {};
				}
			},
			// 图片模式
			imgMode: {
				type: String,
				default: 'widthFix'
			},
			// 携带的请求头
			header: {
				type: Object,
				default: () => {
					return {};
				}
			}
		},
		data() {
			return {
				imageList: [],
				upDate: false,
				successInfo:'ok'
			};
		},
		watch: {
			imageList(newVal, oldVal) {
				if (!this.upDate) {
					this.$emit('change', newVal);
				}
			}
		},
		methods: {
			clearAllImgs() {
				this.imageList = [];
			},
			/* addImg() {
				if (this.disabled) return;
				let num = this.number - this.imageList.length;
				if (num < 1) {
					return false;
				}
				uni.chooseImage({
					count: num,
					sizeType: ['compressed'],
					success: async res => {
						let file = res.tempFiles;
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							if (this.beforeUpload) {
								const valid = await this.beforeUpload(file[i], i);
								if (valid === false) {
									return false;
								}
							}
							// this.imageList.push({ url: res.tempFilePaths[i], progress: 0, error: false });
							let quality = 80;
							// this.imageList.push({ url: res.tempFilePaths[i], progress: 0, error: false });
							console.log("设置压缩质量",quality);
							uni.compressImage({
							    src: res.tempFilePaths[i],
							    quality: quality, // 设置压缩质量
							    success: compressRes => {
							        this.imageList.push({ url: compressRes.tempFilePath, progress: 0, error: false });
							    }
							});
						}
					}
				});
			},*/
			/**
			 *在上传文件时，需要压缩图片
			 *还需动态的根据 图片越大压缩比率越高，图片越小压缩比率越小【还需测试】
			 **/

			addImg() {
				if (this.disabled) return;
				let num = this.number - this.imageList.length;
				if (num < 1) {
					return false;
				}
				uni.chooseImage({
					count: num,
					sizeType: ['compressed'],
					success: async res => {
						let file = res.tempFiles;
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							if (this.beforeUpload) {
								const valid = await this.beforeUpload(file[i], i);
								if (valid === false) {
									return false;
								}
							}
							if (file[i].size > 70 * 1024) { // 判断图片大小是否超过70KB
								uni.getImageInfo({
									src: res.tempFilePaths[i],
									success: imageInfo => {
										let width = imageInfo.width;
										let height = imageInfo.height;
										let maxSize = Math.max(width, height);
										let quality = 80;
										if (maxSize > 1024) {
											let ratio = maxSize / 1024;
											quality = Math.floor(80 / ratio);
										}
										console.log("设置压缩质量", quality);
										uni.compressImage({
											src: res.tempFilePaths[i],
											quality: quality, // 设置压缩质量
											success: compressRes => {
												this.imageList.push({
													url: compressRes
														.tempFilePath,
													progress: 0,
													error: false,
													usuccess:false
												});
											}
										});
									}
								});
							} else {
								this.imageList.push({
									url: res.tempFilePaths[i],
									progress: 0,
									error: false,
									usuccess:false
								}); // 不压缩，直接添加到imageList中
							}
						}
					}
				});
			},
			removeImg(e) {
				let index = e.currentTarget.id.replace('s-items-img-', '');
				let removeImg = this.imageList.splice(index, 1);
				this.$emit('remove', removeImg[0]);
			},
			showImgs(e) {
				let imgs = [];
				for (let i = 0; i < this.imageList.length; i++) {
					imgs.push(this.imageList[i][this.filedImage]);
				}
				uni.previewImage({
					urls: imgs,
					current: e
				});
			},
			upload(index) {
				if (this.upDate) {
					return;
				}
				this.upDate = true;
				if (!index) {
					index = 0;
				}
				uni.showLoading({
					title: '图片上传中···'
				});
				this.uploadBase(index);
			},
			retry(e) {
				let index = e.currentTarget.dataset.index;
				this.upload(index);
			},
			uploadBase(index) {
				// 全部上传完成
				if (index > this.imageList.length - 1) {
					uni.hideLoading();
					this.upDate = false;
					this.$emit('upload', this.imageList);
					return;
				}
				// 验证后端
				if (this.url == '') {
					uni.showToast({
						title: '没有配置api',
						icon: 'none'
					});
					return;
				}
				// 检查是否是默认值
				if (this.imageList[index].progress >= 1) {
					this.uploadBase(index + 1);
					return;
				}
				this.imageList[index].error = false;
				// 创建上传对象
				const upTask = uni.uploadFile({
					url: this.url,
					filePath: this.imageList[index].url,
					name: 'file' || this.fileName,
					formData: this.formData,
					header: this.header,
					success: res => {
						// console.log(res)
						var uploadRes = JSON.parse(res.data);
						console.log(uploadRes)
						if(uploadRes.code == 200)
						{
							this.imageList[index].progress = 100;
							this.imageList[index].url = `${this.$baseUrl_imgs}` + uploadRes.data.detault_url;
							this.imageList[index].result = uploadRes.data.detault_url;
							this.uploadBase(index + 1);
							this.usuccess(index);
							this.imageList[index].successInfo = '上传成功';
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
							title: '上传失败，请点击图片重试',
							icon: 'none'
						});
						this.error(index);
						this.imageList[index].errorInfo = '失败，请重试！';
					}
				});
				upTask.onProgressUpdate(res => {
					if (res.progress > 0) {
						this.imageList[index].progress = res.progress;
						this.imageList.splice(index, 1, this.imageList[index]);
					}
				});

			},
			// 上传错误
			error(index) {
				this.upDate = false;
				this.imageList[index].error = true;
				this.uploadBase(index + 1);
				this.$emit('uploaderror');
			},
			// 上传成功
			usuccess(index) {
				this.upDate = false;
				this.imageList[index].usuccess = true;
				this.uploadBase(index + 1);
			},
			// 设置默认值
			setItems(items) {
				if (items.length) {
					this.imageList = [];
					for (let i = 0; i < items.length; i++) {
						if (items[i] !== 'undefined' || items[i] !== undefined) {
							this.imageList.push({
								url: `${this.$baseUrl_imgs}` + items[i],
								result: items[i],
								progress: 100
							});
						}
					}
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	.s-disabled {
		cursor: not-allowed;
	}

	.s-add-list {
		display: flex;
		flex-wrap: wrap;
	}

	.s-add-list-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.s-add-list-btn-text {
		font-size: 26rpx;
		line-height: 36rpx;
		text-align: center;
		color: #999;
		width: 100%;
	}

	.s-add-list-items {
		width: 222rpx;
		height: 222rpx;
		overflow: hidden;
		margin-bottom: 10rpx;
		margin-right: 11rpx;
		/* background: #f6f7f8; */
		font-size: 0;
		position: relative;
		border-radius: 10rpx;
	}

	.s-add-list-image {
		width: 222rpx;
	}

	.s-add-list-remove {
		position: absolute;
		z-index: 15;
		right: 10rpx;
		top: 0;
		color: #d3d3d3;
	}

	.upload-progress {
		position: absolute;
		z-index: 99;
		left: 0;
		bottom: 10rpx;
		// width: 180rpx;
		padding: 0 2rpx;
	}

	.s-add-list-reup {
		position: absolute;
		z-index: 3;
		left: 0;
		top: 0rpx;
		width: 222rpx;
		height: 222rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.3);
		flex-direction: column;
	}

	.s-add-list-reup-icon {
		text-align: center;
		width: 100%;
		color: #ffffff;
		display: block;
		font-size: 80rpx;
		line-height: 100rpx;
	}

	.s-add-list-reup-text {
		text-align: center;
		width: 100%;
		color: #ec0b0b;
		display: block;
		font-weight: bold;
		font-size: 30rpx;
	}
	
	
	.s-add-list-reup-su {
		position: absolute;
		z-index: 3;
		left: 0;
		top: 0rpx;
		width: 222rpx;
		height: 222rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(154, 154, 154, 0.3);
		flex-direction: column;
	}
	
	.s-add-list-reup-icon-su {
		text-align: center;
		width: 100%;
		color: #ffffff;
		display: block;
		font-size: 80rpx;
		line-height: 100rpx;
	}
	
	.s-add-list-reup-text-su {
		text-align: center;
		width: 100%;
		color: #00aa7f;
		display: block;
		font-weight: bold;
		font-size: 25rpx;
	}
	
	.s-add-list-img {
		width: 100%;
		height: 100%;
	}
</style>