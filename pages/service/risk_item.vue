<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="del" @tap="del()" v-if="id>0">
			<cl-icon name="cl-icon-minus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="del_confirm"> </cl-confirm>
		
		<view class="service">
			<view class="service_title">检查区域<span class="jh" >*</span></view>
			<view class="service_content">
				<cl-col span="24">
					<cl-input v-model="model.check_area" placeholder=" " />
				</cl-col>
			</view>
		</view>
		<view class="service">
			<view class="service_title">问题说明<span class="jh">*</span></view>
			<view class="service_content">
				<ld-select :multiple="true" :list="service_content_lists" @inputFun="inputFun" label-key="label"
					value-key="value" placeholder="示例" clearable v-model="risk_proposal" @change="selectChange1">
				</ld-select>
		
				<cl-textarea rows="13" cols="40" placeholder=" " v-model="model.problem_desc" count></cl-textarea>
			</view>
		</view>
		<view class="service">
			<view class="service_title">风险程度<span class="jh">*</span></view>
			<view class="service_content">
				<cl-radio-group v-model="model.risk" border>
					<cl-radio v-for="(item,index) in ranks" :key="index" v-bind:label="item.value">{{item.rank}}
					</cl-radio>
				</cl-radio-group>
			</view>
		</view>
		
		

		<view class="service">
			<view class="service_title">照片<span class="jh" v-if="ct==0">*</span><span class="dcts">(最多4张)</span>
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
		
		<view class="service">
			<view class="service_title">整改建议<span class="jh">*</span></view>
			<view class="service_content">
				<ld-select :multiple="true" :list="service_content_lists" @inputFun="inputFun" label-key="label"
					value-key="value" placeholder="示例" clearable v-model="risk_proposal" @change="selectChange1">
				</ld-select>

				<cl-textarea rows="13" cols="40" placeholder="整改建议" v-model="model.improve" count></cl-textarea>
			</view>
		</view>
		<view class="service">
			<view class="service_title">采取措施<span class="jh">*</span></view>
			<view class="service_content">
				<ld-select :multiple="true" :list="service_content_lists" @inputFun="inputFun" label-key="label"
					value-key="value" placeholder="示例" clearable v-model="take_steps" @change="selectChange2">
				</ld-select>

				<cl-textarea rows="13" cols="40" placeholder="采取措施" v-model="model.take_steps" count></cl-textarea>
			</view>
		</view>
		<view style="width: 100%; height: 100rpx;"></view>
		
		<view class="bu" v-if="model.id>0" @tap="$noMultipleClicks(save)">
			保存
		</view>
		
		<view class="bu" v-else @tap="$noMultipleClicks(submit)">
			新增
		</view>

	</view>
</template>

<script>
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
	import newUpload from '@/components/new-upload/new-upload.vue';
	import ldSelect from '@/components/ld-select/ld-select.vue';
	export default {
		components: {
			newUpload,
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
				ranks: [
					{rank:'高',value:1},
					{rank:'中',value:2},
					{rank:'低',value:3}
				],
				label: "",
				labels: [],
				service_content_lists: [],
				service_content_listsOld: [],
				id: 0,
				jobid: '',
				jobtype: '',
				
				site_photos: [],
				// start_site_photos: [],
				// end_site_photos: [],
				upload_site_photos: [],
				risk_description: [],
				risk_proposal: [],
				take_steps: [],
				status: '',
				search_key: '',
				timer: null,
				len: false,
				upPicUrl: `${this.$baseUrl}/Upload.Upload/image`,
				init_photos: [],
				headerUpload: {
					'token': uni.getStorageSync('token')
				},
				formData: {
					type:1
				},
				model:{
					id:'',
					risk_area:'',
					risk:'',
					photos:[],
					problem_desc:'',
					improve:'',
					take_steps:''
				},
				photosArray:[]
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

			this.id = index.id
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			
			this.ct = uni.getStorageSync('ct')
			this.data_select()
			
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
						let result = fuzzyQuery(this.service_content_lists, this.search_key, 'value') // 数组、搜索值、字段
						this.service_content_lists = result
					}, 500)

				} else {
					// 恢复原来值
					this.service_content_lists = this.service_content_listsOld
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
				let params = {
					id: this.id,
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.getRiskSituationInfo(params).then(res=>{
					if (res.code == 200) {
						console.log(res.data)
						if (res.data) {
							
							this.model = res.data
						
							this.$refs.upload3.setItems(res.data.photos)
						
						}
					}
				}).catch(err=>{
					console.log(err)
				})
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
			// 新增
			submit() {
				
				let params = {
					survey_id: this.jobid,
					check_area: this.model.check_area,
					risk: this.model.risk,
					photos: this.photosArray,
					problem_desc: this.model.problem_desc,
					improve: this.model.improve,
					take_steps: this.model.take_steps
				}
				
				this.$api.addRiskSituation(params).then(res=>{
					if (res.code == 200) {
						if (res.data) {
			
							uni.hideLoading();
							uni.$utils.toast("保存成功")
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/service/risk_list?jobid=" + this.jobid + '&jobtype=' + this.jobtype
								})
							}, 2000)
						}
					}
					if(res.code == 400){
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
			// 编辑
			save() {
				
				let params = {
					id: this.model.id,
					check_area: this.model.check_area,
					risk: this.model.risk,
					photos: this.photosArray,
					problem_desc: this.model.problem_desc,
					improve: this.model.improve,
					take_steps: this.model.take_steps
				}
				
				this.$api.editRiskSituation(params).then(res=>{
					if (res.code == 200) {
						if (res.data) {
			
							uni.hideLoading();
							uni.$utils.toast("保存成功")
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/service/risk_list?jobid=" + this.jobid + '&jobtype=' + this.jobtype
								})
							}, 2000)
						}
					}
					if(res.code == 400){
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
				console.log('arrarrarrarr',arr)
				var imageStr = "";
				let imgArr = []
				for (var i = 0; i < arr.length; i++) {
					imageStr += arr[i].result + ",";
					imgArr.push(arr[i].result )
				}
				//去掉最后一个逗号
				if (imageStr.length > 0) {
					imageStr = imageStr.substr(0, imageStr.length - 1);
				}
				// console.log(imageStr);
				console.log('imageStrimageStrimageStr',imageStr)
				this.upload_site_photos = imageStr
				this.photosArray = imgArr
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
								id: this.model.id,
							}
							// console.log(params)
							// return false
							
							this.$api.delRiskSituation(params).then(res=>{
								if (res.code == 200) {
									uni.showToast({
										icon: 'none',
										title: '删除成功'
									});
									setTimeout(() => {
										uni.redirectTo({
											url: "/pages/service/risk_list?jobid=" + this.jobid
										})
									}, 2000)
								}
							}).catch(err=>{
								console.log(err)
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
			//...
		},
	}
</script>

<style lang="scss">
.item-ui{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 30rpx;
	.label{
		min-width: 284rpx;
		height: 42rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 32rpx;
		.rq{
			position: relative;
		}
		.rq::after{
			content:'*';
			width: 10rpx;
			height: 10rpx;
			position: absolute;
			top: 50%;
			right: -20rpx;
			color: red;
			margin-top: -15rpx;
		}
	}
	.input-ui{
		border: 1rpx solid #eee; width: 200rpx; margin-left: 20rpx;
		height: 70rpx;
		line-height: 70rpx;
		width: 320rpx;
		padding-left: 20rpx;
	}
}
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
		z-index: 9;
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

	// 自定义上传样式
	

.cl-input.is-border {
	border: 1rpx solid #dcdfe6;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
</style>