<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="del" @tap="del()" v-if="id>0">
			<cl-icon name="cl-icon-minus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="del_confirm"> </cl-confirm>
		<!-- 物料 -->
		<view class="service">
			<view class="service_title">物料<span class="jh">*</span>
				<view class="new_card_title_right">
					<cl-select v-model="material" :options="material_lists" @change="change_material()"></cl-select>
				</view>
			</view>
			<view class="service_content">
				<cl-row>
					<view class="text-left">农药登记证号</view>
					<view class="text-right">{{registration_no}}</view>
				</cl-row>
				<cl-row>
					<view class="text-left">有效成分</view>
					<view class="text-right">{{active_ingredient}}</view>
				</cl-row>
				<cl-row style="color: #000000;">
					<view class="text-left">药物配比</view>
					<view class="text-right" style="height: 0px;">
						<cl-input v-model="ratio" placeholder="例:1:10" style="text-align: right;">{{ratio}}</cl-input>
					</view>
				</cl-row>
			</view>
		</view>
		<!-- 靶标 -->
		<view class="service">
			<view class="service_title">靶标<span class="jh">*</span><span class="dcts">(可多选)</span>
			</view>
			<view class="service_content">
				<view style="margin: 10px 0px;">
					<cl-checkbox-group v-model="target" border>
						<cl-checkbox v-for="(item,index) in targets" :key="index" v-bind:label="item">
							{{item}}
						</cl-checkbox>
					</cl-checkbox-group>
				</view>

				<cl-row style="color: #000000;">
					<view>使用方式<span class="jh">*</span></view>
					<view>
						<cl-checkbox-group v-model="usemode" border>
							<cl-checkbox v-for="(item,index) in usemodes" :key="index" v-bind:label="item">
								{{item}}
							</cl-checkbox>
						</cl-checkbox-group>
					</view>
				</cl-row>
			</view>
		</view>
		<!-- 使用区域 -->
		<view class="service">
			<view class="service_title">使用区域<span class="dcts">(可多选)</span>
			</view>
			<view class="service_content">
				<cl-row style="color: #000000;">
					<view>
						<cl-checkbox-group v-model="usearea" border>
							<cl-checkbox v-for="(item,index) in useareas" :key="index" v-bind:label="item">
								{{item}}
							</cl-checkbox>
						</cl-checkbox-group>
					</view>
					<view>
						<cl-textarea placeholder="请输入" v-model="usearea" count></cl-textarea>
					</view>
				</cl-row>
				<cl-row style="color: #000000;">
					<view class="text-left">处理空间/面积</view>
					<view class="text-right" style="height: 0px;">
						<cl-input v-model="processing_space" placeholder="例:50平" style="text-align: right;"></cl-input>
					</view>
				</cl-row>
				<cl-row style="color: #000000;">
					<view class="text-left">药物用量</view>
					<view class="text-right" style="height: 10px;">
						<cl-input v-model="dosage" placeholder="请输入" style="text-align: right;"><text slot="append"
								style="margin-top: 10px;font-size: 16px;">{{unit}}</text></cl-input>

					</view>
				</cl-row>
			</view>
		</view>
		<!-- 注意事项 -->
		<view class="service">
			<view class="service_title">注意事项</view>
			<view class="lz">
				<ld-select :multiple="true" :list="shortcuts" @inputFun="inputFun" label-key="label" value-key="value"
					placeholder="示例" clearable v-model="matters_needing_attention" @change="selectChange"></ld-select>
			</view>
			<cl-textarea v-model="matters_needing_attention" placeholder="请输入" count></cl-textarea>
		</view>
		<view style="width: 100%; height: 100rpx;">
			
		</view>
		<view class="bu" @tap="save()">
			保存
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
	import ldSelect from '@/components/ld-select/ld-select.vue'
	export default {
		components: {
			ldSelect
		},
		data() {
			return {
				name:'新增物料使用',
				shortcuts: [],
				shortcutsOld:[],	// 快捷语原值 用于恢复
				material: "",
				material_lists: [],
				registration_no: "",
				active_ingredient: "",
				ratio: "",
				targets: [],
				target: "",
				usemodes: [],
				usemode: "",
				dosage: "",
				processing_space: "",
				usearea: "",
				useareas: [],
				matters_needing_attention: [],
				tablename: "materials",
				id: '',
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				unit: '',
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
			this.id = index.id
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			
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
			selectChange(val) {
				this.matters_needing_attention = val
			},
			data_select() {
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					id: this.id,
				}
				this.$api.getMaterialsInfo(params).then(res=>{
					if (res.data) {
						let material_lists = res.data.materialLists	// 地区使用的物料清单
						material_lists.forEach((item,i)=>{
							item.label = item.name
							item.value = item.name
						})
						this.material_lists = material_lists
						this.targets = res.data.materialTargets	     // 靶标
						this.usemodes = res.data.materialUsemodes       // 使用方式
						this.useareas = res.data.materialUseareas		 // 使用区域
						// 快捷语内容
						let shortcuts = []			
						if(res.data.shortcutContents.length>0){
							res.data.shortcutContents.forEach((item,i)=>{
								shortcuts.push({label:item,value:item})
							})
						}
						this.shortcuts = shortcuts
						this.shortcutsOld = shortcuts
						if (this.id>0){
							this.material = res.data.material.material_name
							this.registration_no = res.data.material.material_registration_no
							this.active_ingredient = res.data.material.material_active_ingredient
							this.ratio = res.data.material.material_ratio
							this.unit = res.data.material.unit
							this.target = res.data.material.targets.split(',')
							this.usemode = res.data.material.use_mode.split(',')
							this.usearea = JSON.parse(res.data.material.use_area.split(','))
							this.processing_space = res.data.material.processing_space	// 处理空间
							this.dosage = res.data.material.dosage						// 药物用量
							this.matters_needing_attention = JSON.parse(res.data.material.matters_needing_attention)	// 注意事项
						}
					}
					if(res.code == 400){
						uni.$utils.toast("消息")
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			change_material(e) {
				for (let i = 0; i < this.material_lists.length; i++) {
					if (this.material_lists[i].label == e) {
						this.registration_no = this.material_lists[i].registration_no;
						this.active_ingredient = this.material_lists[i].active_ingredient;
						this.ratio = this.material_lists[i].ratio;
						this.unit = this.material_lists[i].unit;
					}
				}
			},
			// 保存
			save() {
				if (!this.material){
					uni.showToast({
						title: '信息填写不全',
						icon: 'none',
					});
					return;
				} else {
					uni.showLoading({
						title: "保存中..."
					});
					console.log(this.matters_needing_attention)
					
					let matters_needing_attention = ''
					if(this.matters_needing_attention.length>0){
						matters_needing_attention = JSON.stringify(this.matters_needing_attention)
					}
					
					let params = {
						id: this.id,
						job_id: this.jobid,
						job_type: this.jobtype,
						material_name: this.material,
						material_registration_no: this.registration_no,
						material_active_ingredient: this.active_ingredient ? this.active_ingredient:'',
						material_ratio: this.ratio,
						targets: this.target,
						use_mode: this.usemode,
						use_area: JSON.stringify(this.usearea),
						dosage: this.dosage,
						processing_space: this.processing_space,
						matters_needing_attention: matters_needing_attention,	// 注意事项
						unit: this.unit,
					}
					
					if(this.id == 0){
						this.$api.addMaterials(params).then(res=>{
							uni.hideLoading();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
							if(res.code == 200){
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/service/material?jobid=" +this.jobid + '&jobtype=' + this.jobtype
									})
								}, 2000)
							}
						}).catch(err=>{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						})
					}
					if(this.id != 0){
						this.$api.editMaterials(params).then(res=>{
							uni.hideLoading();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
							if(res.code == 200){
								setTimeout(() => {
									uni.redirectTo({
										url: "/pages/service/material?jobid=" +this.jobid + '&jobtype=' + this.jobtype
									})
								}, 2000)
							}
						}).catch(err=>{
							console.log(err)
						})
					}
					
				}
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
							if (this.id == '' || this.id == 0) {
								uni.showToast({
									icon: 'none',
									title: '请选择删除物料'
								});
								return;
							} else {
								let params = {
									id: this.id
								}
								this.$api.delMaterials(params).then(res=>{
									uni.showToast({
										icon: 'none',
										title: res.msg
									});
									if (res.code == 200) {
										setTimeout(() => {
											uni.redirectTo({
												url: "/pages/service/material?jobid=" +
													this
													.jobid + '&jobtype=' + this
													.jobtype
											})
										}, 2000)
									}
								}).catch(err=>{
									console.log(err)
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
		margin-bottom: 50px;
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
		font-size: 20px;
		float: right;
		position: relative;
		top: -6px;
	}

	.new_card_content {
		margin: 10px;
		font-size: 17px;
		color: #7b7070;
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
		font-size: 20px;
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

	.cl-input__inner {
		height: 100%;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		font-size: 32rpx;
		border: 0;
		padding: 0;
		outline: none;
		background-color: transparent;
	}

	.cl-checkbox {
		display: inline-block;
		line-height: 40rpx;
		font-size: 30rpx;
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
</style>
