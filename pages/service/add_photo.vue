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
			
			</view>
		</view>
		<view class="service">
			<view class="service_title">备注说明</view>
			<view class="lz">
				<ld-select :multiple="true" :list="shortcuts" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="remarks" @change="selectChange"></ld-select>
			</view>
			<cl-textarea rows="13" cols="40" :maxlength="maxLength" placeholder="请输入" v-model="remarks" count></cl-textarea>
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
					'token': uni.getStorageSync('token')
				},
				type:0,
				formData: {
					type:0
				},
				maxLength:100000,
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
		},
		methods: {
			
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
				let params = {
					id: this.id,
				}
				this.$api.getSiteWorkPhotosInfo(params).then(res=>{
					if (res.code == 200) {
						if (res.data) {
							var strArr = res.data.site_photos ?? [];	
							if (strArr.length > 0) {
								strArr.forEach((item,i)=>{
								let imgurl = item
									imgurl.replace(/\"/g, "").replace(/[\\]/g, '')
									this.init_photos[i] = imgurl
								})
								this.$refs.upload3.setItems(this.init_photos);
							}
							this.remarks = res.data.remarks.split(",")
						}
					}else{
						if(res.code == 400){
							uni.$utils.toast(res.msg)
							return false
						}
					}
				}).catch(err=>{
					console.log(err)
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
				// console.log("获取上传或者预览后的图片：")
				// console.log(arr)
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
				this.$api.getShortcutContents(params).then(res=>{
					if (res.code == 200) {
						let shortcuts = res.data
						let shortcutsArr = []
						shortcuts.forEach((item, i) => {
							shortcutsArr.push({
								label: item.content,
								value: item.content
							})
						})
						this.shortcuts = shortcutsArr
						this.shortcutsOld = shortcutsArr
					} else {
						uni.showToast({
							title: res.msg
						});
					}
				}).catch(err=>{
					console.log(err)
				})
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
							let params = {
								id: this.id
							}
							this.$api.delSiteWorkPhotos(params).then(res=>{
								if (res.code == 200) {
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
							}).catch(err=>{
								uni.showToast({
									icon: 'none',
									title: '取消成功'
								});
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
			
				// 验证图片中是否有上传失败的图片
				let photoArr = this.upload_site_photos.split(',')
				photoArr.forEach((item,i)=>{
					let no = i+1
					if(item=='' || item==undefined || item=='undefined'){
						uni.showToast({icon: 'none', title: `第`+no+`张图有问题，请删除后重新上传哈`});
						return false
					}
				})
				this.upload_site_photos = this.upload_site_photos.split(',').filter(item => item !== 'undefined').join(',');
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
				this.$api.addSiteWorkPhotos(param).then(res=>{
					if (res.code == 200) {
						if (res.data) {
							log.info('保存现场工作照-成功')
							log.info('param', param)
							this.id = res.data
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
						uni.$utils.toast(res.msg)
						return false
					}
				}).catch(err=>{
					uni.showToast({
						icon: 'error',
						title: err.errMsg
					});
					setTimeout(function() {
						uni.hideLoading();
					}, 2000);
				})

			},
			// 保存
			save() {
				
				//console.log("保存图片信息：")
				if (this.upload_site_photos == '' || this.upload_site_photos == undefined || this.upload_site_photos.length == 0) {
					uni.showToast({icon: 'none', title: `没选择工作照(⊙_⊙)?`});
					return false;
				}
				
				// 验证图片中是否有上传失败的图片
				let photoArr = this.upload_site_photos.split(',')
				photoArr.forEach((item,i)=>{
					let no = i+1
					if(item=='' || item==undefined || item=='undefined'){
						uni.showToast({icon: 'none', title: `第`+no+`张图有问题，请删除后重新上传哈`});
						return false
					}
				})
				
				this.upload_site_photos = this.upload_site_photos.split(',').filter(item => item !== 'undefined').join(',');
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
				
				this.$api.editSiteWorkPhotos(param).then(res=>{
					if (res.code == 200) {
						if (res.data) {
							log.info('保存现场工作照-成功')
							log.info('param', param)
							this.id = res.data
					
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
						uni.$utils.toast(res.msg)
						return false
					}
				}).catch(err=>{
					uni.showToast({
						icon: 'error',
						title: err.errMsg
					});
					setTimeout(function() {
						uni.hideLoading();
					}, 2000);
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

</style>
