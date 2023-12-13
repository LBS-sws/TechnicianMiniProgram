<template>
	<view class="content">
		<view class="del" @tap="del()" v-if="id>0">
			<cl-icon name="cl-icon-minus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="del_confirm"> </cl-confirm>
		<!-- <progress :percent="percent" stroke-width="10"></progress> -->
		<span v-if="imageNum>=0">第{{imageNum}}张：
			<progress
				:percent="percent" 
				show-info 
				active="true"  
				active-mode="forwards"
				:stroke-width="10"
				backgroundColor="#F5F5F5"
			  />
		</span>
		<view class="service">
			<view class="service_title">现场照片<span class="jh">*</span><span class="dcts">(最多4张)</span></view>
			<view class="service_content">
				<fjj-images title="图片上传" v-model="site_photos" :pageImgList="site_photos" :imgCount="4"
					@addImg="editParkImg" @deleteImg="deleteImg" @getimgList="getimgList"></fjj-images>
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
		<button class="bu" :disabled="buttonStatus" @tap="$noMultipleClicks(save)">
			保存
		</button>
	</view>
</template>

<script>
	import fjjImages from '@/components/fjj-images/fjj-images.vue';
	import ldSelect from '@/components/ld-select/ld-select.vue';
	export default {
		components: {
			fjjImages,
			ldSelect
		},
		data() {
			return {
				noClick: true,
				start_site_photos: [],
				upload_site_photos: [],
				site_photos: [],
				end_site_photos: [],
				remarks: [],
				tablename: "photos",
				id: '',
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				shortcuts: [],
				custInfo: {},
				search_key: '',
				timer: null,
				len: false,
				percent: 0,
				// showProgress:false,
				imageNum: -1,
				buttonStatus: ''
			};
		},
		onLoad(index) {
			console.log("add_")
			console.log(index)
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
			console.log('index.id')
			console.log(index.id)
			this.id = index.id
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			this.custInfo = {
				customer: index.customer,
				address: index.address
			}

			console.log("upload_imgs::")
			console.log(this.custInfo.address)
			if (this.custInfo.address === 'undefined' || this.custInfo.customer === 'undefined') {

				let cust = this.getCache("custInfoForImages");
				console.log(cust)
				this.custInfo = cust
			}
			console.log(this.custInfo);

			if (this.id > 0) {
				this.data_select()
			}
			this.getshortcuts()
		},
		methods: {
			/**
			 *搜索开始
			 * *
			 */
			inputFun(data) {
				console.log(data)
				this.search_key = data.value;
				this.clearTimer()
				if (this.search_key && this.search_key.length > 0) {
					this.len = true
					this.timer = setTimeout(() => {
						console.log(this.search_key)
						this.getshortcuts();
					}, 2000)
				} else {
					if (this.len) {
						console.log(this.search_key)
						this.getshortcuts();
					}
					if (this.search_key === '') {
						this.len = false
						return
					}
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
			data_select() {
				//查询是否存在
				let param = {
					staffid: uni.getStorageSync('staffid'),
					id: this.id,
					job_id: this.jobid,
					job_type: this.jobtype,
				}
				uni.request({
					url: `${this.$baseUrl}/Getphotobyid`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {
						if (res.data.code == 1) {
							if (res.data.data) {
								this.site_photos = res.data.data.site_photos.split(",")
								for (let i = 0; i < this.site_photos.length; i++) {
									var site_po = this.site_photos[i].replace(/\"/g, "").replace(/[\\]/g, '');
									this.site_photos[i] = `${this.$baseUrl_imgs}` + site_po;
								}
								console.log("this.site_photos：")
								console.log(this.site_photos)
								this.end_site_photos = res.data.data.site_photos.split(',')
								this.start_site_photos = this.site_photos;
								this.remarks = res.data.data.remarks
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/login/login"
								});
							}, 2000)
						}
					},
					fail: (err) => {
						console.log(res);
					}
				})
			},
			getshortcuts() {
				//查询快捷语
				let params = {
					staffid: uni.getStorageSync('staffid'),
					city: uni.getStorageSync('city'),
					shortcut_type: this.shortcut_type,
					service_type: this.service_type,
					search_key: this.search_key
				}
				uni.request({
					url: `${this.$baseUrl}/getshortcuts`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: params,
					success: (res) => {
						if (res.data.code == 1) {
							this.shortcuts = res.data.data
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
			editParkImg(currentTempFilePath) {},
			deleteImg(index) {
				//删除数据库剩余部分
				var del = JSON.parse(JSON.stringify(this.end_site_photos));
				for (var i = 0; i < del.length; i++) {
					var site_po = del[i].replace(/\"/g, "").replace(/[\\]/g, '');
					del[i] = `${this.$baseUrl_imgs}` + site_po;
					if (this.site_photos[index] == del[i])
						this.end_site_photos.splice(i, 1)
				}
			},
			getimgList(index) {
				this.site_photos = index
			},
			del() {
				this.$refs["del_confirm"].open({
					title: "提示",
					message: "确认删除？",
					callback: ({
						action
					}) => {
						if (action == 'confirm') {
							let param = {
								staffid: uni.getStorageSync('staffid'),
								del_id: this.id,
								job_id: this.jobid,
								job_type: this.jobtype,
							}
							uni.request({
								url: `${this.$baseUrl}/delphoto`,
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
												url: "/pages/service/photo?jobid=" +
													this
													.jobid + '&jobtype=' + this
													.jobtype +
													'&shortcut_type=' +
													this.shortcut_type +
													'&service_type=' + this
													.service_type
											})
										}, 100)

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
				});
			},
			async save() {
				this.buttonStatus = 'disabled'
				var imgs = JSON.parse(JSON.stringify(this.site_photos))
				// console.log("imgs:")
				// console.log(imgs)
				if (this.site_photos == '') {
					this.buttonStatus = ''
					uni.showToast({
						title: '信息填写不全',
						icon: 'none',
					});
					this.buttonStatus = ''
					return;
				} else if (imgs.length > 4) {
					uni.showToast({
						title: '图片最多四张',
						icon: 'none',
					});
					this.buttonStatus = ''
					return;
				} else {
					uni.showLoading({
						title: "保存中..."
					});
					//图片上传
					if (this.id > 0) {
						//上传部分
						for (let i = 0; i < imgs.length; i++) {
							for (let j = 0; j < this.start_site_photos.length; j++) {
								if (imgs[i] == this.start_site_photos[j]) { //如果是id相同的，那么a[ j ].id == b[ i ].id
									imgs.splice(imgs[i], 1);
								}
							}
						}
					}
					//剩余部分
					if (this.end_site_photos.length > 0) {
						this.upload_site_photos = this.end_site_photos
					}
					if (imgs.length > 0) {
						var upload_imgs = await this.upload_imgs(imgs)
						if (this.upload_site_photos == '') {
							this.upload_site_photos = upload_imgs;
						} else {
							this.upload_site_photos = this.upload_site_photos +
								',' + upload_imgs;
						}

					}
					//保存信息
					let param = {
						staffid: uni.getStorageSync('staffid'),
						id: this.id,
						job_id: this.jobid,
						job_type: this.jobtype,
						site_photos: this.upload_site_photos,
						del_index: this.del_index,
						remarks: this.remarks,
					}
					uni.request({
						url: `${this.$baseUrl}/Savephoto`,
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'token': uni.getStorageSync('token')
						},
						method: 'POST',
						data: param,
						success: (res) => {
							this.buttonStatus = ''
							if (res.data.code == 1) {
								if (res.data.data) {
									this.id = res.data.data
									console.log('this.id：：')
									console.log(this.id)
									// this.data_select()
									this.del_index = []
									uni.hideLoading();
									uni.showToast({
										title: '上传成功',
									})
									setTimeout(() => {
										uni.redirectTo({
											url: "/pages/service/photo?jobid=" +
												this
												.jobid + '&jobtype=' + this
												.jobtype +
												'&shortcut_type=' +
												this.shortcut_type +
												'&service_type=' + this
												.service_type
										})
									}, 100)
								}
							} else {
								this.buttonStatus = ''
								uni.showToast({
									title: res.msg
								});
							}
						},
						fail: (err) => {
							this.buttonStatus = ''
							console.log(res);
						},

					})
				}
			},
			//图片上传
			async upload_imgs(imgs) {
				var _self = this;

				let uploadImgLength = imgs.length;
				console.log('uploadImgLength:')
				console.log(uploadImgLength)
				// _self.showProgress = true;
				if (uploadImgLength > 0) {
					var upload_url =
						`${_self.$baseUrl}/upload/imgswx?is_mark=1&version=${this.$version}&customer=${_self.custInfo.customer}`;
					console.log(upload_url)
					var uploadImages = '';
					var findex = 0;
					//压缩图片需要使用Promise异步转同步处理
					return new Promise(function(resolve, reject) {
						setTimeout(() => {
							imgs.map((value, index) => {
								uni.compressImage({
									src: value,
									quality: 100,
									success: (res) => {
										console.log('压缩图片需要使用Promise返回值：')
										console.log(res)
										const uploadTask = uni.uploadFile({
											url: upload_url, // 后端api接口
											filePath: res
											.tempFilePath, // uni.chooseImage函数调用后获取的本地文件路劲
											name: 'file', //后端通过'file'获取上传的文件对象
											header: {
												// 'content-type': 'multipart/form-data',
												// "content-type": "application/x-www-form-urlencoded",
												'token': uni
													.getStorageSync(
														'token')
											},
											success: (result) => {
												var res = JSON.parse(
													result.data)
												console.log(res)
												if (res.code === 0) {
													var images_data =
														res.data
														.file_name;
													// console.log("上传图片后的返回值：")
													// console.log(result)
													var photo =
														images_data
														.replace(/\"/g,
															"")
														.replace(
															/[\\]/g, ''
															);
													if (uploadImages ==
														'') {
														uploadImages =
															photo;
													} else {
														uploadImages =
															uploadImages +
															"," + photo
													}
													if (findex ==
														uploadImgLength -
														1) {
														resolve(
															uploadImages);
													}
													findex++;
													_self.imageNum =
														findex
													uni.hideLoading();
												} else {
													uni.showToast({
														title: res
															.msg,
														icon: 'none',
													});
													_self.imageNum = -1
												}


											},
											fail: (err) => {
												console.log(
													'uploadImage fail',
													err);
												uni.showModal({
													// content: err.errMsg,
													content: '亲爱的师傅您好，上传图片时遇到一个问题，请重新上传图片！',
													showCancel: false
												});
												this.buttonStatus = ''
												uni.hideLoading();

											}
										});
										uploadTask.onProgressUpdate((res) => {
											_self.percent = res.progress;
										})

									},
									fail: (err) => {
										this.buttonStatus = ''
										reject(err)
										uni.hideLoading();

									}
								})

							})
							// solve();

						}, 100)
					})
				}
			},


			// -------------------------- 图片上传调整 -----------------------------------
			async upload_imgs(imgs) {
				var _self = this;

				let uploadImgLength = imgs.length;
				console.log('uploadImgLength:')
				console.log(uploadImgLength)
				// _self.showProgress = true;
				if (uploadImgLength > 0) {
					var upload_url =
						`${_self.$baseUrl}/upload/imgswx?is_mark=1&version=${this.$version}&customer=${_self.custInfo.customer}`;
					console.log(upload_url)
					var uploadImages = '';
					var findex = 0;
					//压缩图片需要使用Promise异步转同步处理
					return new Promise(function(resolve, reject) {
						setTimeout(() => {
							imgs.map((value, index) => {
								uni.compressImage({
									src: value,
									quality: 100,
									success: (res) => {
										console.log('压缩图片需要使用Promise返回值：')
										console.log(res)
										const uploadTask = uni.uploadFile({
											url: upload_url, // 后端api接口
											filePath: res
											.tempFilePath, // uni.chooseImage函数调用后获取的本地文件路劲
											name: 'file', //后端通过'file'获取上传的文件对象
											header: {
												// 'content-type': 'multipart/form-data',
												// "content-type": "application/x-www-form-urlencoded",
												'token': uni
													.getStorageSync(
														'token')
											},
											success: (result) => {
												var res = JSON.parse(
													result.data)
												console.log(res)
												if (res.code === 0) {
													var photo = res
														.data
														.file_name;
													console.log(
														"上传图片后的返回值："
														)
													console.log(result)
													// var photo = images_data.replace(/\"/g, "").replace(/[\\]/g,'');
													if (uploadImages ==
														'') {
														uploadImages =
															photo;
													} else {
														uploadImages =
															uploadImages +
															"," + photo
													}
													if (findex ==
														uploadImgLength -
														1) {
														resolve(
															uploadImages);
													}
													console.log(
														uploadImages
														)
													findex++;
													_self.imageNum =
														findex
													uni.hideLoading();
												} else {
													uni.showToast({
														title: res
															.msg,
														icon: 'none',
													});
													_self.imageNum = -1
												}


											},
											fail: (err) => {
												console.log(
													'uploadImage fail',
													err);
												uni.showModal({
													content: err
														.errMsg,
													showCancel: false
												});
												uni.hideLoading();
											}
										});
										uploadTask.onProgressUpdate((res) => {
											console.log('上传进度' + res
												.progress);
											console.log('已经上传的数据长度' + res
												.totalBytesSent);
											console.log('预期需要上传的数据总长度' +
												res
												.totalBytesExpectedToSend
												);

											// 测试条件，取消上传任务。
											// if (res.progress > 5) {
											// 	uploadTask.abort();
											// }
											_self.percent = res.progress;
											// if(_self.imageNum >=0){
											// 	if(res.progress == 100){  
											// 		setTimeout(function () {
											// 			uni.showToast({
											// 				title: '第'+findex+'张上传成功',
											// 				icon: 'none',
											// 			});
											// 		}, 100)
											// 	}
											// }

											// _self.showProgress = false;
										})

									},
									fail: (err) => {
										reject(err)
										uni.hideLoading();
									}
								})

							})
							// solve();

						}, 100)
					})
				}
			}

		},
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

<style>
	.content {
		/* padding: 0 21rpx; */
		margin-top: 21rpx;
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
		font-size: 32rpx;
		width: 100%;
		box-sizing: border-box;
		font-size: 32rpx;
	}

	.cl-select picker {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 17px;
	}

	.cl-textarea {
		border: 1rpx solid #dcdfe6;
		border-radius: 8rpx;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		position: relative;
		padding: 10rpx 10rpx 10rpx 16rpx;
		line-height: 36rpx;
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
</style>
