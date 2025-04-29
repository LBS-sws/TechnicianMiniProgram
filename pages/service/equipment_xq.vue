<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="service">
			<view class="service_content">
				<cl-row>
					<view class="text-left">设备名称</view>
					<view class="text-right">{{equipment_name}}</view>
				</cl-row>
				<cl-row>
					<view class="text-left">设备区域</view>
					<view class="text-right">
						<cl-select v-model="equipment_area" :options="use_areas"></cl-select>
					</view>
				</cl-row>
			</view>
		</view>
		<view class="service">
			<view class="service_title">检查数据</view>
			<view class="new_card_content">
				<view>
					<view span="12" v-for="(check, index_cd) in check_datas" :key="index_cd">
						<view class="num_c" v-if="typeid==1">
							{{check.label}}
							<cl-input-number v-model="check.value" style="margin-left: 10px;"  ></cl-input-number>
						</view>
						<view class="num_c" v-else-if="typeid==2">
							<view style="float: left;margin: 7px;">{{check.label}}</view>
							<view style="float: right;">
								<cl-select v-model="check.value" :options="check.selects"></cl-select>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="new_card">
			<view class="new_card_title">
				<view class="new_card_title_left">
					<span class="xh">|</span>
					现场照片<span class="dcts">(最多4张)</span>
				</view>
			</view>
			<view class="new_card_content">

				<fjj-images title="图片上传" v-model="site_photos" :pageImgList="site_photos" :imgCount="4"
					@addImg="editParkImg" @deleteImg="deleteImg" @getimgList="getimgList"></fjj-images>
			</view>
		</view> -->

		<view class="service">
			<view class="service_title">检查与处理<span class="dcts">(可多选)</span></view>
			<view class="service_content">
				<cl-checkbox-group v-model="check_handle" border>
					<cl-checkbox v-for="(checkup,index_c) in check_handles" :key="index_c" v-bind:label="checkup.value">
						{{checkup.label}}
					</cl-checkbox>
				</cl-checkbox-group>
			</view>
		</view>
		<view class="service">
			<view class="service_title">补充说明</view>
			<view class="lz">
				<ld-select :multiple="true" :list="shortcuts" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="more_info" @change="selectChange"></ld-select>
			</view>
			<cl-textarea rows="13" cols="40" placeholder="请输入" v-model="more_info" count></cl-textarea>
		</view>
		<view class="bu" @tap="save()">
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
				use_areas: [],
				shortcuts: [],
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				id: '',
				typeid: '',
				equipment_name: '',
				equipment_area: '',
				site_photos: '',
				check_datas: '',
				check_handle: '',
				check_handles: '',
				more_info: [],
				end_site_photos: '',
				start_site_photos: '',
				upload_site_photos: '',
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
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			this.id = index.eq_id
			this.data_select()
			this.getshortcuts()
		},
		methods: {
			inputFun(data) {
				console.log(data)
				this.search_key = data.value;
				this.clearTimer()
				if (this.search_key && this.search_key.length > 0) {
					this.len = true
					this.timer = setTimeout(() => {
						console.log(this.search_key)
						this.getshortcuts();
					}, 500)
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

			selectChange(val) {
				this.more_info = val
			},
			data_select() {
				let param = {
					staffid: uni.getStorageSync('staffid'),
					city: uni.getStorageSync('city'),
					id: this.id,
					job_id: this.jobid,
					job_type: this.jobtype,
				}
				uni.request({
					url: `${this.$baseUrl}/getequipmentsbyid`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {
						if (res.data.code == 1) {
							if (res.data.data) {
								this.use_areas = res.data.data.use_areas
								this.typeid = res.data.data.eq.type
								this.equipment_name = res.data.data.eq.equipment_name
								this.equipment_area = res.data.data.eq.equipment_area
								this.check_datas = res.data.data.eq.check_datas
								this.check_handles = res.data.data.eq.check_handles
								if (res.data.data.eq.check_handle != "") {
									this.check_handle = res.data.data.eq.check_handle.split(',')
								} else {
									this.check_handle = []
								}

								// this.check_handle = ?null: res.data.data.eq.check_handle.split(',')
								this.more_info = res.data.data.eq.more_info
								this.end_site_photos = res.data.data.eq.site_photos.split(',')
								if (res.data.data.eq.site_photos) {
									this.site_photos = res.data.data.eq.site_photos.split(',')
									for (let j = 0; j < this.site_photos.length; j++) {
										var site_po = this.site_photos[j].replace(/\"/g, "")
											.replace(/[\\]/g,
												'');
										this.site_photos[j] = `${this.$baseUrl_imgs}` +
											site_po;

									}
									this.start_site_photos = this.site_photos
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
			getshortcuts() {
				//查询快捷语
				// if(s_key){
				// 	 this.search_key = s_key
				// }  
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
					var site_po = del[i].replace(/\"/g, "")
						.replace(/[\\]/g, '');
					del[i] = `${this.$baseUrl_imgs}` + site_po;
					if (this.site_photos[index] == del[i])
						this.end_site_photos.splice(i, 1)
				}
			},
			getimgList(index) {
				this.site_photos = index
			},
			save() {
				
				var imgs = JSON.parse(JSON.stringify(this.site_photos))
				if (this.equipment_area == '' || this.check_datas == '') {
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
					for (var i = 0; i < imgs.length; i++) {
						uni.uploadFile({
							url: `${this.$baseUrl}/upload/imgswx?version=${this.$version}`, // 后端api接口
							filePath: imgs[i], // uni.chooseImage函数调用后获取的本地文件路劲
							name: 'file', //后端通过'file'获取上传的文件对象
							header: {
								'content-type': 'multipart/form-data',
								'token': uni.getStorageSync('token')
							},
							success: (res) => {
								var res = JSON.parse(result.data)
								if (res.code === 0) {
									var images_data = res.data.file_name;
									if (this.upload_site_photos == '') {
										this.upload_site_photos = images_data;
									} else {
										this.upload_site_photos = this.upload_site_photos + ',' + images_data;
									}
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none',
									});
								}


							},
							fail: (err) => {
								console.log('uploadImage fail', err);
								uni.showModal({
									content: err.errMsg,
									showCancel: false
								});
							}
						});

					}
					setTimeout(() => {
						//保存信息
						let params = {
							staffid: uni.getStorageSync('staffid'),
							id: this.id,
							job_id: this.jobid,
							job_type: this.jobtype,
							equipment_name: this.equipment_name,
							equipment_area: this.equipment_area,
							check_datas: JSON.stringify(this.check_datas),
							check_handle: this.check_handle,
							site_photos: this.upload_site_photos,
							more_info: this.more_info,
						}
						uni.request({
							url: `${this.$baseUrl}/Saveequipment`,
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								'token': uni.getStorageSync('token')
							},
							method: 'POST',
							data: params,
							success: (res) => {
								uni.hideLoading();
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/service/equipment?jobid=" +
											this
											.jobid + '&jobtype=' + this
											.jobtype +
											'&shortcut_type=' +
											this.shortcut_type +
											'&service_type=' + this
											.service_type
									})
								}, 1000)
							},
							fail: (err) => {
								console.log(res);
							}
						});
					}, 1000)
				}
			}
		}
	}
</script>

<style>
	.new_card {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
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
		font-size: 21px;
		color: #d0cece;
		float: right;

	}

	.new_card_content {
		margin: 10px;
		font-size: 17px;
	}

	.new_card_content span {
		color: #5e6165;
	}

	.tj_bu {
		position: relative;
		bottom: 0px;
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 20px;
	}

	.lcx {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
		margin: 10px 0px;
		padding-top: 10px;
	}

	.text-left {
		float: left;
	}

	.text-right {
		float: right;
	}

	.top_text {
		background-color: #FFFFFF;
		padding: 10px;
		font-size: 16px;
	}

	.cl-select__inner {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 16px;
	}

	.text {
		border-bottom: 1px solid #e0dcdc;
		margin: 10px 0px;
		padding-bottom: 10px;
	}

	.num_c {
		margin-bottom: 10px;
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

	.cl-checkbox {
		display: inline-block;
		line-height: 40rpx;
		font-size: 31rpx;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	.cl-textarea textarea {
		font-size: 32rpx;
		width: 100%;
		box-sizing: border-box;
		font-size: 32rpx;
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
