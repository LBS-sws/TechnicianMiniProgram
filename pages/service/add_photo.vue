<template>
	<view class="content">
		<view class="del" @tap="del()" v-if="id>0">
			<cl-icon name="cl-icon-minus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="del_confirm"></cl-confirm>
		<view class="service">
			<view class="service_title">现场照片<span class="jh">*</span><span class="dcts">(最多4张)</span></view>
			<view class="service_content">
				<view label="限制上传图片格式/大小">
					<m-upload :url="upPicUrl" :header="headerUpload" :fileName="file" ref="upload3" title="添加工作照片"
						@upload="handleLoaded3" @change="handleChange3" :number="4"  :formData="formData">
						<template v-slot:icon>
							<text class="s-add-list-btn-icon">+</text>
						</template>
					</m-upload>
				</view>
			<!-- upload -->
			
			<!-- <view class="bg-white">
				
				<view class="uni-file-picker__container">
					<view class="file-picker__box" v-for="(item,index) in picturesx" :key="index">
						<view class="file-picker__box-content">
							<image :src="item" class="file-image" mode="aspectFill" @click="previewImage(index)">
							</image>
							<view class="icon-del-box" @click="delFile(index)">
								<view class="icon-del"></view>
								<view class="icon-del rotate"></view>
							</view>
						</view>
					</view>
					
					<view class="file-picker__box" @click="upload" v-if="picturesx.length!=4">
						<view class="file-picker__box-content is-add">
							<view class="is-add">
								<view class="icon-add"></view>
								<view class="icon-add rotate"></view>
							</view>
						</view>
					</view>
				</view>
			</view> -->
				
			</view>
		</view>
		<view class="service">
			<view class="service_title">备注说明</view>
			<view class="lz">
				<ld-select :multiple="true" :list="shortcuts" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="remarks" @change="selectChange"></ld-select>
			</view>
			<cl-textarea rows="13" cols="40" placeholder="请输入" v-model="remarks" count></cl-textarea>
		</view>
		<button v-if="id>0" class="bu" @tap="$noMultipleClicks(save)">
			保存
		</button>
		<button v-else class="bu" @tap="$noMultipleClicks(add)">
			保存
		</button>
	</view>
</template>

<script>
	import ldSelect from '@/components/ld-select/ld-select.vue';
	import newUpload from '@/components/new-upload/new-upload.vue';

	export default {
		components: {
			ldSelect,
			newUpload,
		},
		data() {
			return {
				name: '新增工作照',
				noClick: true,
				upload_site_photos: [],
				site_photos: '',
				remarks: [],
				tablename: "photos",
				id: '',
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				shortcuts: [],
				shortcutsOld: [],
				custInfo: {},
				search_key: '',
				timer: null,
				len: false,
				percent: 0,
				// showProgress:false,
				imageNum: -1,
				upPicUrl: `${this.$baseUrl}/Upload.Upload/image`,
				init_photos: [],
				headerUpload: {
					// 'content-type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('token')
				},
				type:0,
				pictures:[],
				picturesx:[],		// 带http
				formData: {
					type:1
				},
			};
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

			if (this.id > 0) {
				this.getItem()
			}
			// 设置预览图片
			// this.$nextTick(() => {
			// 	this.$refs.upload3.setItems(this.init_photos);
			// })

			// 获取快捷语
			this.getshortcuts()
			
			console.log(`${this.$baseUrl}`)
		},
		methods: {
			upload() {
				console.log(this.upload_site_photos)
				
				let that = this
				let picture = {}
				let pictures = this.pictures
				let picturesx = this.picturesx
				
				// let photos = this.upload_site_photos
				uni.chooseImage({
					sourceType: ['camera', 'album'], //拍照或是打开系统相册选择照片
					count: 1, //最多三张
					success(res) {
						if (Array.isArray(res.tempFilePaths)) {
							//最多选择三张，如果多选删掉前面选择的
							if (res.tempFilePaths.length === 4) {
								pictures.length = 0
							} else if (res.tempFilePaths.length == 3 && pictures.length == 3) {
								pictures.splice(0, 1)
							}
							//把照片的路径放到数组里面
							res.tempFilePaths.forEach(item => {
								console.log(item)
								uni.showLoading({
									title: '上传中...'
								});
								uni.uploadFile({

									url: `${that.$baseUrl}/Upload.Upload/image`,
									header: {
										// 'content-type': 'application/x-www-form-urlencoded',
										'token': uni.getStorageSync('token')
									},
									filePath: item,
									name: 'file',
									formData: {
										file:item,
										type:0
									},
									success: (uploadFileRes) => {
										console.log(uploadFileRes.data);

										const res = JSON.parse(uploadFileRes.data)
										console.log(res)
										
										if(res.code==200){
											// cdn_url	直接预览
											// detault_url	数据库存字段
											// time  时间
										}
										
										
										// let url = `${that.$baseUrl_imgs}/` + res.data.detault_url
										let url = res.data.detault_url
										pictures.push(url)
										that.pictures = pictures
										
										let urlx = `${that.$baseUrl_imgs}/` + res.data.detault_url
										picturesx.push(urlx)
										that.picturesx = picturesx
										
										// 现场照
										// console.log(res.data.detault_url)
										// let photos = that.upload_site_photos
										// photos.push(res.data.detault_url)
										// that.upload_site_photos = photos
										

										setTimeout(function() {
											uni.hideLoading();
										}, 500)
									}
								});

							})

						}
					}
				})
			},
			// 预览轮播图
			previewImage: function(index) {
				var i = this.pictures;

				uni.previewImage({
					current: index, // 坐标
					urls: i // 数组
				})
			},
			// 删除
			delFile(index) {

				const pictures = this.pictures
				pictures.splice(index, 1)
				this.pictures = pictures
				
				const picturesx = this.picturesx
				picturesx.splice(index, 1)
				this.picturesx = picturesx
				
				let upload_site_photos = this.upload_site_photos
				upload_site_photos.splice(index, 1)
				this.upload_site_photos = upload_site_photos
			},
			/**
			 *搜索开始
			 * *
			 */
			inputFun(data) {

				this.search_key = data.value;
				this.clearTimer()
				if (this.search_key && this.search_key.length > 0) {

					this.timer = setTimeout(() => {
						let result = fuzzyQuery(this.shortcuts, this.search_key, 'value') // 数组、搜索值、字段
						this.shortcuts = result
					}, 500)

				} else {
					// 恢复原来值
					this.shortcuts = this.shortcutsOld
				}
			},
			clearTimer() {
				if (this.timer) {
					clearTimeout(this.timer)
				}
			},
			/**
			 *搜索结束
			 * *
			 */
			getCache(name) { //获取缓存数据
				var data = uni.getStorageSync(name);
				if (data) {
					if (isJsonString(data)) { //json字符串转对象
						return JSON.parse(data);
					}
					return data;
				}
				return null;
			},
			selectChange(val) {
				this.remarks = val
			},
			// 详情
			getItem() {
				let that = this
				let param = {
					id: this.id,
				}
				uni.request({
					url: `${this.$baseUrl}/SiteWorkPhotos.SiteWorkPhotos/getSiteWorkPhotosInfo`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: param,
					success: (res) => {
						if (res.data.code == 200) {
							if (res.data.data) {
								// console.log(res.data.data)
	
								var strArr = res.data.data.site_photos ?? [];	
								if (strArr.length > 0) {
										
									strArr.forEach((item,i)=>{
										
									let imgurl = '/' + item
										imgurl.replace(/\"/g, "").replace(/[\\]/g, '')
										this.init_photos[i] = imgurl
									})
							
									this.$refs.upload3.setItems(this.init_photos);
								}
								
								that.remarks = res.data.data.remarks
							}
						}else{
							if(res.data.code == 400)
							{
								uni.$utils.toast(res.data.msg)
								return false
							}
						}

					},
					fail: (err) => {
						console.log(res);
					}
				})
			},
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
			//查询快捷语
			getshortcuts() {

				let params = {
					job_type: this.jobtype,
					job_id: this.jobid
				}
				uni.request({
					url: `${this.$baseUrl}/SiteWorkPhotos.SiteWorkPhotos/getShortcutContents`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: params,
					success: (res) => {
						if (res.data.code == 200) {
							// console.log(res.data.data)

							let shortcuts = res.data.data
							let shortcutsArr = []
							shortcuts.forEach((item, i) => {
								shortcutsArr.push({
									label: item.content,
									value: item.content
								})
							})
							// console.log(shortcutsArr)

							this.shortcuts = shortcutsArr
							this.shortcutsOld = shortcutsArr

						} else {
							uni.showToast({
								title: res.msg
							});
						}
					},
					fail: (err) => {
						console.log(res);
					}
				});
			},
			// 删除
			del() {

				this.$refs["del_confirm"].open({
					title: "提示",
					message: "确认删除？",
					callback: ({
						action
					}) => {
						if (action == 'confirm') {
							let param = {
								id: this.id
							}
							uni.request({
								url: `${this.$baseUrl}/SiteWorkPhotos.SiteWorkPhotos/delSiteWorkPhotos`,
								header: {
									'content-type': 'application/x-www-form-urlencoded',
									'token': uni.getStorageSync('token')
								},
								method: 'DELETE',
								data: param,
								success: (res) => {
									if (res.data.code == 200) {
										uni.showToast({
											icon: 'none',
											title: '删除成功'
										});
										setTimeout(() => {
											uni.redirectTo({
												url: "/pages/service/photo?jobid=" +
													this.jobid + '&jobtype=' + this
													.jobtype
											})
										}, 1000)
									}
								},
								fail: (err) => {
									console.log(res);
								}
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '取消成功'
							});
						}
					}
				})
			},
			// 添加
			add() {
				
				if (this.upload_site_photos == '' || this.upload_site_photos == undefined || this.upload_site_photos.length == 0) {
					uni.showToast({icon: 'none', title: `没选择工作照(⊙_⊙)?`});
				    return false;
				}
				let param = {
					job_id: this.jobid,
					job_type: this.jobtype,
					site_photos: this.upload_site_photos,
					remarks: this.remarks,
				}
				uni.showLoading({
					title: '正在保存'
				});
				var log = require('log.js')
				log.info('点击了保存现场工作照。。。')
				log.info('param', param)
				uni.request({
					url: `${this.$baseUrl}/SiteWorkPhotos.SiteWorkPhotos/addSiteWorkPhotos`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {

						if (res.data.code == 200) {
							if (res.data.data) {
								log.info('保存现场工作照-成功')
								log.info('param', param)
								this.id = res.data.data
								this.del_index = []
								uni.hideLoading();
								uni.showToast({
									title: '保存成功',
								})
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/service/photo?jobid=" + this.jobid +
											'&jobtype=' + this.jobtype
									})
								}, 100)
							}
						}else{
							uni.$utils.toast(res.data.msg)
							return false
						}
					},
					fail: (err) => {

						uni.showToast({
							icon: 'error',
							title: err.errMsg
						});
						setTimeout(function() {
							uni.hideLoading();
						}, 2000);
					},

				})

			},
			// 保存
			save() {
				//保存信息
				console.log("保存图片信息：")
				if (this.upload_site_photos == '' || this.upload_site_photos == undefined || this.upload_site_photos.length == 0) {
					uni.showToast({icon: 'none', title: `没选择工作照(⊙_⊙)?`});
					return false;
				}
				
				// this.upload_site_photos = this.upload_site_photos.split(',').filter(item => item !== 'undefined').join(',');
				let param = {
					id: this.id,
					site_photos:this.upload_site_photos,
					remarks: this.remarks,
				}
				uni.showLoading({
					title: '正在保存'
				});
				var log = require('log.js')
				log.info('点击了保存现场工作照。。。')
				log.info('param', param)
				uni.request({
					url: `${this.$baseUrl}/SiteWorkPhotos.SiteWorkPhotos/editSiteWorkPhotos`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'PUT',
					data: param,
					success: (res) => {

						if (res.data.code == 200) {
							if (res.data.data) {
								log.info('保存现场工作照-成功')
								log.info('param', param)
								this.id = res.data.data

								this.del_index = []
								uni.hideLoading();
								uni.showToast({
									title: '保存成功',
								})
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/service/photo?jobid=" + this.jobid +'&jobtype=' + this.jobtype
									})
								}, 1000)
							}
						}else{
							uni.$utils.toast(res.data.msg)
							return false
						}

					},
					fail: (err) => {
						uni.showToast({
							icon: 'error',
							title: err.errMsg
						});
						setTimeout(function() {
							uni.hideLoading();
						}, 2000);
					},
				})
			}
		}
	}
	// 快捷语搜索
	export const fuzzyQuery = (list, keyWord, attribute = 'value') => {
		const reg = new RegExp(keyWord)
		const arr = []
		for (let i = 0; i < list.length; i++) {
			if (reg.test(list[i][attribute])) {
				arr.push(list[i])
			}
		}
		return arr
	}
	const isJsonString = str => { // 判断字符串是否是json字符串
		try {
			const toObj = JSON.parse(str);
			if (toObj && typeof toObj === 'object') {
				return true
			}
		} catch {}
		return false
	}
</script>

<style lang="scss">
	.content {
		/* padding: 0 21rpx; */
		margin-top: 21 rpx;
	}

	.del {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
	}

	.new_card {
		background-color: #FFFFFF;
		border-radius: 10px;
		padding-bottom: 1px;
		margin: 10px 0px;

	}

	.new_card_title {
		border-bottom: 1px solid #e0dcdc;
		font-size: 19px;
		font-weight: bold;
		padding: 10px;
		height: 30px;
	}

	.xh {
		color: #007AFF;
		font-weight: bold;
		font-size: 21px;
		margin-right: 5px;
	}

	.new_card_title_left {
		float: left;
	}

	.new_card_title_right {
		font-size: 18px;
		float: right;
		position: relative;
		top: 1px;
	}

	.new_card_content {
		margin: 10px;
		font-size: 17px;
		/* color: #7b7070; */
	}

	.new_card_content1 view {
		margin-bottom: 10px;
	}


	.bu {
		background-color: #007AFF;
		color: #FFFFFF;
		height: 50px;
		text-align: center;
		border-top: 1px solid #f5f2f2;
		font-size: 19px;
		font-weight: bold;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
	}

	.cl-textarea textarea {
		font-size: 32 rpx;
		width: 100%;
		box-sizing: border-box;
		font-size: 32 rpx;
	}

	.cl-select picker {
		height: 70 rpx;
		line-height: 70 rpx;
		font-size: 17px;
	}

	.cl-textarea {
		border: 1 rpx solid #dcdfe6;
		border-radius: 8 rpx;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		position: relative;
		padding: 10 rpx 10 rpx 10 rpx 16 rpx;
		line-height: 36 rpx;
		margin-top: 10px;
	}

	/* new */
	.content {
		padding: 10px;
	}

	.service {
		padding-bottom: 15px;
	}

	.jh {
		color: red;
		margin-left: 5px;
	}

	.service_title {
		/* color: #03A9F4; */
		font-size: 18px;
		font-weight: bold;
	}

	.text-green.data-v-2ee6bce8 {
		color: #12900a;
	}

	page {
		background-color: #FFFFFF;
	}

	.service_content {
		margin: 8px 0px;
	}

	.service_content view {
		margin: 3px 0px;
	}

	.lz {
		margin: 10px 0px;
	}
	// 自定义上传样式
	.uni-file-picker__container {
		display: flex;
		box-sizing: border-box;
		flex-wrap: wrap;
		margin: -5px;

		.file-picker__box {
			position: relative;
			width: 33.3%;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;

			.file-picker__box-content {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				margin: 5px;
				border: 1px #eee solid;
				border-radius: 5px;
				overflow: hidden;
			}

			.file-picker__box-content {
				border-width: 1px;
				border-style: solid;
				border-color: #eee;
				border-radius: 3px;
			}

			.is-add {
				display: flex;
				align-items: center;
				justify-content: center;

				.icon-add {
					width: 50px;
					height: 5px;
					background-color: #f1f1f1;
					border-radius: 2px;
				}

				.rotate {
					position: absolute;
					-webkit-transform: rotate(90deg);
					transform: rotate(90deg);
				}
			}

		}
	}

	// 图片
	.file-image {
		width: 100%;
		height: 100%;
	}

	// 删除图标
	.icon-del-box {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 3px;
		right: 3px;
		height: 26px;
		width: 26px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 2;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);

		.icon-del {
			width: 15px;
			height: 2px;
			background-color: #fff;
			border-radius: 2px;
		}

		.rotate {
			position: absolute;
			-webkit-transform: rotate(90deg);
			transform: rotate(90deg);
		}
	}

	.bg-white {
		background: #fff;
	}
</style>