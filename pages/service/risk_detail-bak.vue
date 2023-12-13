<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="del" @tap="del()" v-if="id>0">
			<cl-icon name="cl-icon-minus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="del_confirm"> </cl-confirm>
		<view class="service">
			<view class="service_title">靶标<span class="jh">*</span><span class="dcts">(可多选)</span></view>
			<view class="service_content">
				<cl-checkbox-group v-model="risk_targets" border>
					<cl-checkbox v-for="(item,index) in targets" :key="index" v-bind:label="item.value">{{item.label}}
					</cl-checkbox>
				</cl-checkbox-group>
			</view>
		</view>
		<view class="service">
			<view class="service_title">风险类别<span class="jh">*</span><span class="dcts">(可多选)</span></view>
			<view class="service_content">
				<cl-checkbox-group v-model="risk_types" border>
					<cl-checkbox v-for="(item,index) in types" :key="index" v-bind:label="item.value">
						{{item.label}}
					</cl-checkbox>
				</cl-checkbox-group>
			</view>
		</view>
		<view class="service">
			<view class="service_title">风险等级<span class="jh">*</span></view>
			<view class="service_content">
				<cl-radio-group v-model="risk_rank" border>
					<cl-radio v-for="(item,index) in ranks" :key="index" v-bind:label="item.value">{{item.label}}
					</cl-radio>
				</cl-radio-group>
			</view>
		</view>
		<view class="service">
			<view class="service_title">风险标签<span class="jh">*</span></view>
			<view class="service_content">
				<cl-checkbox-group v-model="risk_label" border>
					<cl-checkbox v-for="(item,index) in labels" :key="index" v-bind:label="item.value">{{item.label}}
					</cl-checkbox>
				</cl-checkbox-group>
			</view>
		</view>
		<view class="service">
			<view class="service_title">现场照片<span class="jh">*</span><span class="dcts">(最多4张)</span></view>
			<view class="service_content">
				<fjj-images title="图片上传" v-model="site_photos" :pageImgList="site_photos" :imgCount="4"
					@addImg="editParkImg" @deleteImg="deleteImg" @getimgList="getimgList"></fjj-images>
			</view>
		</view>
		<view class="service">
			<view class="service_title">风险描述<span class="jh">*</span></view>
			<view class="service_content">
				<ld-select :multiple="true" :list="service_content_lists" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="risk_description" @change="selectChange"></ld-select>
				
				<cl-textarea rows="13" cols="40" placeholder="请输入" v-model="risk_description" count></cl-textarea>
			</view>
		</view>
		<view class="service">
			<view class="service_title">整改建议</view>
			<view class="service_content">
				<ld-select :multiple="true" :list="service_content_lists" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="risk_proposal" @change="selectChange1"></ld-select>
				
				<cl-textarea rows="13" cols="40" placeholder="整改建议" v-model="risk_proposal" count></cl-textarea>
			</view>
		</view>
		<view class="service">
			<view class="service_title">采取措施</view>
			<view class="service_content">
				<ld-select :multiple="true" :list="service_content_lists" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="take_steps" @change="selectChange2"></ld-select>
				
				<cl-textarea rows="13" cols="40" placeholder="采取措施" v-model="take_steps" count></cl-textarea>
			</view>
		</view>
		<view class="bu" @tap="$noMultipleClicks(save)">
			保存
		</view>
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
				target: "",
				targets: [],
				type: "",
				types: [],
				rank: "",
				ranks: [],
				label: "",
				labels: [],
				service_content_lists: [],
				id: 0,
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				risk_targets: '',
				risk_types: '',
				risk_rank: '',
				risk_label: '',
				site_photos: [],
				start_site_photos: [],
				end_site_photos: [],
				upload_site_photos: [],
				risk_description: [],
				risk_proposal: [],
				take_steps: [],
				status: '',
				search_key: '',
				timer: null,
				len: false	
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
			console.log("index:")
			console.log(index)
			this.id = index.id
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			this.data_select()
			this.data_shortcuts()
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
						this.data_shortcuts();
					}, 500)
				} else {
					if (this.len) {
						console.log(this.search_key)
						this.data_shortcuts();
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
			selectChange(val) {
				this.risk_description = val
			},
			selectChange1(val) {
				this.risk_proposal = val
			},
			selectChange2(val) {
				this.take_steps = val
			},
			data_select() {
				//查询是否存在
				let param = {
					staffid: uni.getStorageSync('staffid'),
					city: uni.getStorageSync('city'),
					id: this.id,
					job_id: this.jobid,
					job_type: this.jobtype,
					service_type: this.service_type,
				}
				uni.request({
					url: `${this.$baseUrl}/Getriskbyid`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {
						if (res.data.code == 1) {
							if (res.data.data) {
								this.targets = res.data.data.targets
								this.types = res.data.data.types
								this.ranks = res.data.data.ranks
								this.labels = res.data.data.labels
								if (res.data.data.risk) {
									this.id = res.data.data.risk.id
									this.risk_targets = res.data.data.risk.risk_targets.split(',')
									this.risk_types = res.data.data.risk.risk_types.split(',')
									this.risk_rank = res.data.data.risk.risk_rank
									this.risk_label = res.data.data.risk.risk_label.split(',')
									this.risk_description = res.data.data.risk.risk_description
									this.risk_proposal = res.data.data.risk.risk_proposal
									this.take_steps = res.data.data.risk.take_steps
									this.site_photos = res.data.data.risk.site_photos.split(',')
									for (let i = 0; i < this.site_photos.length; i++) {
										var site_po = this.site_photos[i].replace(/\"/g, "");
										this.site_photos[i] = `${this.$baseUrl_imgs}` + site_po;
									}
									this.start_site_photos = this.site_photos;
									this.end_site_photos = res.data.data.risk.site_photos.split(',')
								}

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
			data_shortcuts() {
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
							this.service_content_lists = res.data.data
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
			async save() {
				var imgs = JSON.parse(JSON.stringify(this.site_photos))
				if (this.site_photos == '') {
					uni.showToast({
						title: '信息填写不全',
						icon: 'none',
					});
					return;
				} else if (imgs.length > 4) {
					uni.showToast({
						title: '图片最多四张',
						icon: 'none',
					});
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
						risk_targets: this.risk_targets,
						risk_types: this.risk_types,
						risk_rank: this.risk_rank,
						risk_label: this.risk_label,
						site_photos: this.upload_site_photos,
						risk_description: this.risk_description,
						risk_proposal: this.risk_proposal,
						take_steps: this.take_steps,
					}
					uni.request({
						url: `${this.$baseUrl}/Saverisk`,
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'token': uni.getStorageSync('token')
						},
						method: 'POST',
						data: param,
						success: (res) => {
							if (res.data.code == 1) {
								if (res.data.data) {
									this.id = res.data.data
									this.data_select()
									this.del_index = []

									uni.hideLoading();
									uni.showToast({
										title: '保存成功',
										icon: 'none',
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
							} else {
								uni.showToast({
									title: res.msg
								});
							}
						},
						fail: (err) => {
							console.log(res);
						}
					})
				}
			},
			//图片上传
			upload_imgs(imgs) {
				let uploadImgLength = imgs.length;
				if (uploadImgLength > 0) {
					var upload_url = `${this.$baseUrl}/upload/imgswx?version=${this.$version}`;
					var uploadImages = '';
					var findex = 0;
					//压缩图片需要使用Promise异步转同步处理
					return new Promise(function(resolve, reject) {
						imgs.map((value, index) => {
							uni.compressImage({
								src: value,
								quality: 20,
								success: (res) => {
									uni.uploadFile({
										url: upload_url, // 后端api接口
										filePath: res
										.tempFilePath, // uni.chooseImage函数调用后获取的本地文件路劲
										name: 'file', //后端通过'file'获取上传的文件对象
										header: {
											'content-type': 'multipart/form-data',
											'token': uni.getStorageSync('token')
										},
										success: (result) => {
											var res = JSON.parse(result.data)
											if(res.code === 0){
												var images_data = res.data.file_name;
												console.log("上传图片后的返回值：")
												console.log(result)
												var photo = images_data.replace(/\"/g, "").replace(/[\\]/g,'');
												if(uploadImages==''){
													uploadImages = photo;
												}else{
													uploadImages = uploadImages+","+photo
												}
												if (findex == uploadImgLength - 1) {
													resolve(uploadImages);
												}
												findex++;
												uni.hideLoading();
											}else{
												uni.showToast({
													title: res.msg,
													icon: 'none',
												});
											}
											
											/* var photo = result.data.replace(/\"/g,
												"").replace(/[\\]/g, '');
											if (uploadImages == '') {
												uploadImages = photo;
											} else {
												uploadImages = uploadImages + "," +
													photo
											}
											if (findex == uploadImgLength - 1) {
												resolve(uploadImages);
											}
											findex++; */
										},
										fail: (err) => {
											console.log('uploadImage fail', err);
											uni.showModal({
												content: err.errMsg,
												showCancel: false
											});
										}
									});
								},
								fail: (err) => {
									reject(err)
								}
							})
						})
					})
				}
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
		},
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
		font-size: 15px;
		float: right;
		position: relative;
		top: 1px;
	}

	.new_card_content {
		margin: 10px;
		font-size: 16px;
		color: #7b7070;
		padding-bottom: 42px;
	}

	.new_card_content1 view {
		margin-bottom: 10px;
	}

	.tj_bu {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0px;
		line-height: 50px;
		background-color: #007AFF;
		color: #FFFFFF;
	}

	.jh {
		color: red;
		margin-left: 5px;
	}

	.text-left {
		float: left;
	}

	.text-right {
		float: right;
	}

	.cl-input.is-border {
		border: 0rpx solid #dcdfe6;
	}

	.dcts {
		color: #9c9c9c;
		font-size: 14px;
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

	.cl-select {
		position: relative;
		width: 100%;
		padding-left: 20rpx;
		padding-right: 60rpx;
		font-size: 32rpx;
		box-sizing: border-box;
		overflow: hidden;
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

	.cl-checkbox {
		display: inline-block;
		line-height: 40rpx;
		font-size: 31rpx;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	.cl-radio {
		display: inline-block;
		line-height: 40rpx;
		font-size: 31rpx;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
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
	
	.new_card_content {
		margin: 8px 0px;
		font-size: 17px;
	}
</style>
