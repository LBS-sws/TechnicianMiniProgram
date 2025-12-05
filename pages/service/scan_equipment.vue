<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="service">
			<view class="service_content">
				<cl-row v-show="can_save">
					<view class="text-left">设备二维码</view>
					<view class="text-right">
						<cl-icon v-if="!hasScanCode" name="cl-icon-scan" color="#007AFF" :size="60" class="scan" @tap="scanCode()"></cl-icon>
						<view v-else class="scanCode" @tap="scanCode()">更换二维码</view>
					</view>
				</cl-row>
				<cl-row>
					<view class="text-left" >设备编号</view>
					<view class="text-right" style="width: 70%;">
						<view v-if="one_eq == 1">
							<cl-col span="12" style="text-align: right;">
								{{eq_mark}}
							</cl-col>
							<cl-col span="12" style="height:40rpx">
								<cl-input  v-model="eq_mark_num" placeholder="自定义" style="height:40rpx;line-height: 40rpx;"/>
							</cl-col>
						</view>
						<view v-if="one_eq == 0">
							{{equipment_number}}
							<span v-if="showmore" @click="showAllEq" class="more">
								更多
							</span>
						</view>
						
					</view>
				</cl-row>
				<cl-row>
					<view class="text-left">设备名称</view>
					<view class="text-right">{{equipment_name}}</view>
				</cl-row>
				<cl-row >
					<view class="text-left" style="margin-top: 15px;">设备区域</view>
					<view class="text-right" style="width: 70%;" v-if="areaclick">
						<cl-col span="12">
						<cl-input  :disabled="disabled"   v-model="equipment_area" placeholder="自定义"   />
						</cl-col>
						<cl-col span="12">
						<cl-select  :disabled="disabled" v-model="equipment_area" :options="use_areas"></cl-select>
						</cl-col>
					</view>
					<view class="text-right" style="width: 70%;" v-else>
						<cl-col span="12">
						<cl-input  :disabled="!disabled"  v-model="equipment_area" placeholder="自定义"   />
						</cl-col>
						<cl-col span="12">
						<cl-select  :disabled="!disabled"  v-model="equipment_area" :options="use_areas"></cl-select>
						</cl-col>
					</view>
				</cl-row>


				<cl-row >
					<view class="text-left" style="margin-top: 15px;">区域类型</view>
					<view class="text-right" style="width: 70%;">
						<cl-col span="12">
						<cl-select v-model="equipment_area_type" :options="deviceOption"></cl-select>
						</cl-col>
					</view>
				</cl-row>


			</view>
		</view>
		<view class="service">
			<view class="service_title">检查数据</view>
			<!-- v-if="typeid==1" -->
			<!-- 1数量输入 2数据输入 -->
			<template v-if="typeid==1">
				<view class="new_card_content">
					<view>
						<view v-for="(check, index_cd) in check_datas" :key="index_cd">
						  <view class="num_c">
							{{check.label}}
							<cl-input-number :input=true :max=1000000 v-model="check.value" style="margin-left: 10px;"></cl-input-number>
						  </view>
						</view>
					</view>
		
	</view>
</template>
			<template v-else>
				<view class="new_card_content">
					<cl-row>
						<cl-col v-for="(check, index) in check_datas" :key="index">
						  <view class="num_c">
							<view style="float: left;margin: 7px;">{{check.label}}</view>
							<view style="float: right;">
							  <cl-select v-model="check.value" :options="check.select"></cl-select>
							</view>
						  </view>
						</cl-col>
					</cl-row>
				</view>
			</template>
			
			<!-- 图片同步开关 - 只有智能识别后且setting_office_id有值才显示 -->
			<view v-if="hasRecognized && setting_office_id" class="sync-switch-container">
				<view class="sync-switch-label">保存时同步图片到现场工作照</view>
				<switch :checked="syncToWorkPhoto" @change="onSyncSwitchChange" color="#007AFF"></switch>
			</view>
		</view>
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
		<view class="service" v-if="imageUrl && setting_office_id">
			<view class="service_title">检查照片</view>
			<view class="image-display">
				<image :src="imageUrl" mode="aspectFill" class="uploaded-image" @tap="previewImage"></image>
				<view class="image-actions">
					<view class="delete-btn" @tap="deleteImage">
						<text class="delete-icon">×</text>
					</view>
				</view>
			</view>
		</view>
		<view class="claer">
			
		</view>
		
		
		<!-- <view v-if="can_save" class="save_button">
			<cl-row style="color: #000000;width: 60%;margin: 0 auto;" class="more-item">
				<view style="width: 36%;text-align: left;" @tap="save()">保存</view>
				<view  @tap="save()">保存</view>
				<view  @tap="save()">保存</view>
			</cl-row>
		</view> -->
		
		
		<view v-if="can_save" class="bu">
			<cl-row>
				<cl-col span="8" @tap="eq_previous()" v-show="is_single">
					<view >上一个</view>
				</cl-col>
				
				
				<cl-col v-if="is_single" span="8" @tap="save()" >
					<view class="previous">保存</view>
				</cl-col>
				
				<cl-col v-else="!is_single"  @tap="save()" >
					<view >保存</view>
				</cl-col>
				
				
				<cl-col span="8" @tap="eq_next()" v-show="is_single">
					<view>下一个</view>
				</cl-col>
			</cl-row>
		</view>
		
		<view v-if="!can_save" class="bu" @tap="back()">返回</view>
		
		<!-- 悬浮AI识别按钮 - 只在灭蝇灯设备且setting_office_id有值时显示 -->
		<view 
			v-if="setting_office_id"
			class="floating-ai-btn" 
			:class="{dragging: isDragging}"
			:style="{
				left: btnLeft + 'px',
				top: btnTop + 'px'
			}"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			@tap="startAIRecognition"
		>
			<cl-icon name="scan" :size="28" color="#FFFFFF" style="margin-bottom: 6px;"></cl-icon>
			<text class="ai-btn-text">{{ hasRecognized ? '重新识别' : 'AI识别' }}</text>
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
import ldSelect from '@/components/ld-select/ld-select.vue';
export default {
	components: {
			ldSelect
	},
	data() {
		return {
			name:'设备详情',
			use_areas: [],
			shortcuts: [],
			shortcutsOld:[],
			jobid: '',
			jobtype: '',
			shortcut_type: '',
			service_type: '',
			scan_code: '',
			id: '',
			areaclick:0,
			typeid: 0,
			showmore:0,
			equipment_name: '',
			equipment_area: '',
			equipment_area_type:'',
			equipment_number: '',
			all_equipment_number: '',
			number: '',
			site_photos: '',
			check_datas: [],
			check_handle: [],//'',
			check_handles: '',
			more_info: '',
			end_site_photos: '',
			start_site_photos: '',
			upload_site_photos: '',
			search_key: '',
			timer: null,
			len: false,
			ct:0,
			disabled:true,	// 单个设备true 多个设备false	
			one_eq:1,		// 1为单个设备，0为多个设备
			eq_mark:'',		// 设备标识
			eq_mark_num:'', // 设备编号
			list:[]			,// 储存list
			selectList:[],
			hasScanCode: false,
			scan_id:0,
			can_save: true,
			eqIdListStr:'',
			is_single:true,
			previous_next: 0, 	// 0 默认   1 上一个   2 下一个 
			deviceOption:[],
			imageUrl: '',
			showUpload: false,
			// 拖拽相关状态
			isDragging: false,
			startX: 0,
			startY: 0,
			btnLeft: 0,
			btnTop: 0,
			lastMoveTime: 0,
			screenInfo: null, // 缓存屏幕信息
			hasRecognized: false, // 是否已经识别过
			syncToWorkPhoto: false, // 是否同步图片到现场工作照
			setting_office_id: '', // 办公室ID
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
		this.scan_id = index.jobtype
		this.can_save = true
		this.id = index.id
		this.eqIdListStr = index.id_list
		this.previous_next = 0
		// this.ct = uni.getStorageSync('ct')
		
		// 初始化悬浮按钮位置
		this.initButtonPosition()
		
		var arr = index.id.split(",");
		console.log('arr.length',arr.length)
		if(arr.length > 1){
			this.is_single = false
		}
		this.data_select()
		this.deviceSelect()	// 添加设备选项
	},
	methods: {
			
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
			showAllEq(){
				uni.showModal({
					title: '全部设备编号',
					content: this.all_equipment_number,
				});
			},
			selectChange(val) {
				this.more_info = val
			},
			areaChange(val) {
				this.equipment_area = val
			},
			// 详情
			data_select() {
				let params = {
					job_type: this.jobtype,
					job_id: this.jobid,
					ids: this.id,
				}
				this.$api.getEqInfo(params).then(res=>{
					if(res.code != 200){
						uni.showToast({icon: 'none',title: res.msg});
						this.can_save = false
					}else if (res.data) {
						// 1.设备名称
						this.equipment_name = res.data.eq_name	
						
						// 2.设备编号
						var equipmentNumber = '';
						
						if(res.data.list.length == 1){// 单个
							this.eq_mark = res.data.list[0]['equipment_number']	// 设备标识
							this.eq_mark_num = res.data.list[0]['number']			// 设备编号
							this.equipment_number = res.data.list[0]['number']
							//二维码
							if(res.data.list[0]['qrcode_id'] != null){
								this.scan_id = res.data.list[0]['qrcode_id'] || ''
								this.hasScanCode = true
							}
						}else if(res.data.list.length>1){// 多个
							for(let i=0;i<res.data.list.length;i++){
								if(equipmentNumber == ''){
									equipmentNumber = res.data.list[i]['equipment_number'] + res.data.list[i]['number']
								}else{
									equipmentNumber = equipmentNumber + ',' +res.data.list[i]['equipment_number'] + res.data.list[i]['number']
								}
							}
							this.eq_mark_num = equipmentNumber
							this.equipment_number = equipmentNumber
							this.one_eq = 0
						}
						// console.log(equipmentNumber)
						
						
						// 3.设备区域
						let use_area = res.data.use_area	//  数组
						use_area.forEach((item,i)=>{
							item.label = item.use_area
							item.value = item.use_area
						})
						this.use_areas = use_area
						
						if(res.data.list.length == 1){		// 选中
							
							if(!res.data.list[0].equipment_area)
							{
								this.equipment_area = ''
							}else{
								this.equipment_area = res.data.list[0].equipment_area
							}

							if(!res.data.list[0].equipment_area_type)
							{
								this.equipment_area_type = ''
							}else{
								this.equipment_area_type = res.data.list[0].equipment_area_type
							}

						}
						// 多个设备时，禁止选区域，以及设备区域都为空
						if(res.data.list.length > 1){
							this.disabled = false
							this.equipment_area = ''
						}
						
						// 4.检查数据
						// typeid == 1 input == 2 select
						this.typeid = res.data.list[0].equipment_type
						let selectArr = []
						if(res.data.list[0].equipment_type ==2)
						{
							
							// let selectList = res.data.data.check_option
							let selectList = Object.entries(res.data.check_option)		//  对象转数组
							console.log(selectList)
							
							selectList.forEach((itemx,index)=>{
								let arr_arr = []
								itemx[1].forEach((item,i)=>{
									arr_arr.push({label:item,value:item})
								})
								selectArr.push(arr_arr)
							})
							
							this.selectList = selectArr
						}
						// 单个设备
						if(res.data.list.length == 1){
							// 检查数据没有值时
							if(res.data.list[0].check_datas == null)
							{
								let check_targt_arr = res.data.check_handle.check_targt	
								let check_targt_array = []
								check_targt_arr.forEach((item,i)=>{
									if(res.data.list[0].equipment_type==1){
										check_targt_array.push({label:item,value:0})
									}else{
										check_targt_array.push({label:item,value:'',select:selectArr[i]})
									}
								})
								this.check_datas = check_targt_array
							}else{
								this.check_datas = res.data.list[0].check_datas
							}
						}
						
						if(res.data.list.length > 1){
							// 多个设备 - 检查数据 默认数量都设置为1
							let check_datas_arr = res.data.check_handle.check_targt
							let check_datas_array = []
							check_datas_arr.forEach((item,i)=>{
								
								if(res.data.list[0].equipment_type==1){
									
									check_datas_array.push({label:item,value:0})
								}else{
									
									check_datas_array.push({label:item,value:'',select:selectArr[i]})
								}
								
							})
							this.check_datas = check_datas_array
						}
						
						
						// 5.检查与处理
						let check_handles = res.data.check_handle.check_handles	// 数组
						let check_handles_arr = []
						check_handles.forEach((item,i)=>{
							check_handles_arr.push({label:item,value:item})
						})
						this.check_handles = check_handles_arr
						
						if(res.data.list.length == 1){
							this.check_handle = res.data.list[0].check_handle			// 选中
						}
						
						
						// 6.补充说明
						if(res.data.list.length == 1){
							this.more_info = res.data.list[0].more_info
							if(res.data.list[0].more_info == "null"){
								this.more_info = ''
							}else{
								if(res.data.list[0].more_info){
									this.more_info = res.data.list[0].more_info.split(",")
								}
								
							}
						}
						
						this.list = res.data.list		// 数组
						
						if(res.data.list.length>5)
						{
							this.showmore = 1
							this.all_equipment_number = equipmentNumber
						}
				
						// 快捷语数组
						let shortcuts = res.data.shortcutContents 	
						let shortcutsArr = []
						shortcuts.forEach((item,i)=>{
							shortcutsArr.push({label:item,value:item})
						})
						this.shortcuts = shortcutsArr
						this.shortcutsOld = shortcutsArr
										
						// 从响应数据中获取setting_office_id
						console.log('完整响应数据:', res.data)
						console.log('res.data.setting_office_id:', res.data.setting_office_id)
						console.log('res.data.list:', res.data.list)
						
						// 优先从响应数据获取，如果没有则从localStorage获取
						if (res.data.setting_office_id) {
							this.setting_office_id = res.data.setting_office_id
							console.log('✓ 从 res.data 获取 setting_office_id:', this.setting_office_id)
						} else if (res.data.list && res.data.list.length > 0 && res.data.list[0].setting_office_id) {
							this.setting_office_id = res.data.list[0].setting_office_id
							console.log('✓ 从 res.data.list[0] 获取 setting_office_id:', this.setting_office_id)
						} else {
							// 从localStorage中获取
							this.setting_office_id = uni.getStorageSync('setting_office_id')
							console.log('✓ 从 localStorage 获取 setting_office_id:', this.setting_office_id)
						}
						
						console.log('最终 this.setting_office_id:', this.setting_office_id)
						
						// 获取AI按钮城市配置
						if (this.setting_office_id) {
							console.log('✓ setting_office_id 有值，开始请求 getAIButtonConfig')
							this.getAIButtonConfig()
						} else {
							console.log('✗ setting_office_id 为空，跳过请求 getAIButtonConfig')
						}
					}else{
						uni.showToast({icon: 'none',title: '出现错误,请重试'});
					}
				}).catch(err=>{
					uni.showToast({icon: 'none',title: err.msg});
					console.log(err)
				})
			},
			scanCode() {
				let that = this

				uni.scanCode({
					success: async (res) => {
						if(res.result==''){
							uni.showToast({icon: 'none',title: '扫码错误！'});
							return false;
						}
						
						let queryString = res.result.split('?')[1];
						if (!queryString) {
							uni.showToast({
								icon: 'none',
								title: 'URL格式错误！'
							});
							return false;
						}

						let queryParams = new URLSearchParams(queryString);
						if(!queryParams.get('id') || !queryParams.get('city') || !queryParams.get('office_id')){
							uni.showToast({icon: 'none',title: '无效二维码！'});
							return false;
						}
						// else if(queryParams.get('city') != uni.getStorageSync('city')){
						// 	uni.showToast({icon: 'none',title: '非本地区二维码！'});
						// 	return false;
						// }

						let params = {
							scan_id: queryParams.get('id'),
							city: queryParams.get('city'),
							office_id: queryParams.get('office_id'),
							scan_code: res.result,
							id: that.id,
							job_id: that.jobid,
							job_type: that.jobtype,
						}

						that.$api.bindQr(params).then(res=>{
							uni.hideLoading();
							if(res.code!==200){
								uni.showToast({icon: 'none',title: res.msg});
								return false
							}

							that.hasScanCode = true
							that.scan_id = params.scan_id

							uni.showToast({title: res.msg,icon: 'none'});
						}).catch(err=>{
							console.log(err)
							uni.showToast({icon: 'none',title: err.msg});
						})

					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '无效二维码！'
						});
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
			save(){
				this.previous_next = 0
				this.editEq()
			},
			// 保存	单个 多个
			editEq(){
				let ids = this.list.map((item) => {
				    return item.id
				}).join(',')
				
				//验证是否是中文
			
				var pattern = new RegExp("[\u4E00-\u9FA5]+");
				
				if(pattern.test(this.eq_mark_num)){
					// console.log('该字符串是中文');
					uni.$utils.toast("设备编号不能为中文")
					return false
				}
				let check_handle = ''
				
				if(!!this.check_handle)
				{
					check_handle = this.check_handle
				}
				
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					equipment_name: this.equipment_name,
					equipment_area: this.equipment_area,
					check_datas: this.check_datas,
					check_handle: check_handle,
					more_info: this.more_info,
					eq_number: this.eq_mark_num,
					equipment_area_type: this.equipment_area_type,
					ids:ids,
					imageUrl: this.imageUrl
				}
				uni.setStorageSync('last_id_' + this.jobid,this.id)
				this.$api.editEq(params).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					if(res.code == 200){
						
						// 如果有AI识别的图片且开启了同步开关，保存成功后同步到现场工作照
						if (this.hasRecognized && this.syncToWorkPhoto && this.imageUrl) {
							// 从本地图片URL转换为网络URL进行同步
							this.syncImageToWorkPhotoAfterSave()
						}
						
						if(this.previous_next == 1){
							var arr = this.eqIdListStr.split(",");
							let index = arr.indexOf(this.id);  
							if (index !== -1) {  
							    let prevJobId = index > 0 ? arr[index - 1] : null;
								if(prevJobId != null){
									uni.redirectTo({
										url: "/pages/service/scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+prevJobId +'&id_list='+this.eqIdListStr
									})
								}else{
									this.back()
									uni.showToast({
										title: '上一个设备不存在！！',
										icon: 'none'
									})
								}
							} else { 
								uni.showToast({
									title: '上一个设备不存在！！',
									icon: 'none'
								})
							}
						}else if(this.previous_next == 2){
							var arr = this.eqIdListStr.split(",");
							let index = arr.indexOf(this.id);   
							if (index !== -1) {  
							    let nextJobId = index < arr.length - 1 ? arr[index + 1] : null; 
								if(nextJobId != null){
									uni.redirectTo({
										url: "/pages/service/scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+nextJobId +'&id_list='+this.eqIdListStr
									})
								}else{
									this.back()
									uni.showToast({
										title: '下一个设备不存在！！',
										icon: 'none'
									})
								}
								
							} else {  
								uni.showToast({
									title: '下一个设备不存在！！',
									icon: 'none'
								})
							}
						}else{
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/service/equipment?jobid=" +
										this
										.jobid + '&jobtype=' + this
										.jobtype +
										'&shortcut_type=' +
										this.shortcut_type +
										'&service_type=' + this
										.service_type + '&ct=' + this
										.ct
								})
							}, 1000)
						}
						
						
						
						
					}
					if(res.code == 400){
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return false
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			//返回
			back(){
				uni.redirectTo({
					url: "/pages/service/equipment?jobid=" +this.jobid + '&jobtype=' + this.jobtype +'&shortcut_type=' +this.shortcut_type +'&service_type=' + this.service_type + '&ct=' + this.ct
				})
			},
			eq_previous(){
				this.previous_next = 1
				this.editEq()
				
				
				
			},
			eq_next(){
				this.previous_next = 2
				this.editEq()
			},
			deviceSelect(){
				this.$api.deviceSelect({}).then(res=>{
					this.deviceOption = res.data
					console.log(res.data)
				}).catch(err=>{
					console.log(err)
				})
			},
			
			// 开关事件处理
			onSyncSwitchChange(e) {
				this.syncToWorkPhoto = e.detail.value
				console.log('图片同步开关状态:', this.syncToWorkPhoto)
			},
			
			// 保存成功后同步图片到现场工作照
			async syncImageToWorkPhotoAfterSave() {
				try {
					console.log('保存成功后开始同步图片到现场工作照')
					
					// 检查是否有图片URL
					if (!this.imageUrl) {
						console.log('没有图片URL，跳过同步')
						return
					}
					
					// AI识别后的图片已经是网络URL，直接使用
					console.log('使用识别图片URL进行同步:', this.imageUrl)
					
					// 调用同步方法
					await this.syncImageToWorkPhoto(this.imageUrl)
					
				} catch (error) {
					console.error('保存后同步图片失败:', error)
					uni.showToast({
						title: '图片同步失败',
						icon: 'none'
					})
				}
			},
			
			// 同步图片到现场工作照
			async syncImageToWorkPhoto(imageUrl) {
				try {
					console.log('开始同步图片到现场工作照:', imageUrl)
					console.log('当前job_id:', this.jobid, 'job_type:', this.jobtype)
					
					uni.showLoading({
					title: '正在同步识别图片...'
				})
					
					// 从网络URL中提取相对路径
					const relativePath = imageUrl.replace(this.$baseUrl_imgs, '')
					console.log('提取的相对路径:', relativePath)
					
					// 先查询是否已有现场工作照记录
					const getParams = {
						job_id: this.jobid,
						job_type: this.jobtype,
						limit: 100,
						page: 1
					}
					console.log('查询现场工作照参数:', getParams)
					
					const existingPhotos = await this.$api.getSiteWorkPhotosInfo(getParams)
					console.log('现有现场工作照记录:', existingPhotos)
					
					let response
					if (existingPhotos.code === 200 && existingPhotos.data && existingPhotos.data.data && existingPhotos.data.data.length > 0) {
						// 找到现有记录，将图片添加到第一条记录中
						const firstRecord = existingPhotos.data.data[0]
						const existingSitePhotos = firstRecord.site_photos || []
						console.log('现有图片:', existingSitePhotos)
						
						// 检查是否已经包含该图片
						if (!existingSitePhotos.includes(relativePath)) {
							// 将新图片添加到现有图片数组中
							const updatedPhotos = [...existingSitePhotos, relativePath]
							console.log('更新后的图片数组:', updatedPhotos)
							
							// 检查图片数量是否超过4张
							if (updatedPhotos.length > 4) {
								uni.hideLoading()
								uni.showToast({
									title: '现场工作照最多只能有4张图片',
									icon: 'none'
								})
								return
							}
							
							// 使用 addSiteWorkPhotos 接口更新记录
							const updateParam = {
								job_id: this.jobid,
								job_type: this.jobtype,
								site_photos: updatedPhotos.join(','),
								remarks: (firstRecord.remarks || '') + '\n[AI识别自动同步]'
							}
							console.log('更新参数:', updateParam)
							
							// 先删除原记录
							await this.$api.delSiteWorkPhotos({id: firstRecord.id})
							// 再添加新记录
							response = await this.$api.addSiteWorkPhotos(updateParam)
							console.log('更新响应:', response)
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '该图片已存在于现场工作照中',
								icon: 'none'
							})
							return
						}
					} else {
						// 没有现有记录，创建新记录
						const addParam = {
							job_id: this.jobid,
							job_type: this.jobtype,
							site_photos: relativePath,
							remarks: '灭蝇灯检查'
						}
						console.log('添加参数:', addParam)
						
						response = await this.$api.addSiteWorkPhotos(addParam)
						console.log('添加响应:', response)
					}
					
					uni.hideLoading()
					
					if (response && response.code === 200) {
						uni.showToast({
							title: '识别图片已同步到现场工作照',
							icon: 'success'
						})
					} else {
						console.error('同步失败，响应:', response)
						uni.showToast({
							title: (response && response.msg) || '同步失败',
							icon: 'none'
						})
					}
				} catch (error) {
					uni.hideLoading()
					console.error('同步图片到现场工作照失败:', error)
					uni.showToast({
						title: '同步失败，请重试',
						icon: 'none'
					})
				}
			},


			
			// 开始AI识别
			startAIRecognition() {
				// 如果正在拖拽，不触发点击事件
				if (this.isDragging) {
					return
				}
				
				// 直接选择图片并上传识别
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera', 'album'],
					success: (res) => {
						this.handleImageUploadAndRecognize(res.tempFilePaths[0])
					},
					fail: (err) => {
						console.log('❌ chooseImage fail:', err)
						// 权限不足时给予提示，便于用户授权
						if (err.errMsg.indexOf('authorize') !== -1 || err.errMsg.indexOf('auth') !== -1 || (err.errMsg && err.errMsg.includes('scope is not declared'))) {
							uni.showModal({
								title: '权限提示',
								content: '上传图片需要您的相册或相机权限，请前往设置开启',
								confirmText: '去设置',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							})
						} else {
							uni.showToast({
								title: '选择图片失败，请重试',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},
			
			// 处理图片上传和识别
			async handleImageUploadAndRecognize(filePath) {
				try {
					// 显示加载提示
					uni.showLoading({
						title: '正在上传图片...'
					})
					
					// 设置本地图片URL用于预览
					this.imageUrl = filePath
					this.showUpload = true
					
					// 先上传图片到服务器获取网络URL
					const networkImageUrl = await this.uploadImageToServer(filePath)
					
					// 更新加载提示
					uni.showLoading({
						title: 'AI识别中...'
					})
					
					// 使用网络图片URL调用AI识别接口
					const aiResult = await this.callAIRecognition(networkImageUrl)
					
					uni.hideLoading()
					
					if (aiResult.confidence > 0) {
			uni.showToast({
				title: `识别成功`,
				icon: 'success'
			})
			
			// AI识别成功后，将imageUrl更新为网络URL
			this.imageUrl = networkImageUrl
			
			// 设置已识别状态
			this.hasRecognized = true
			
			// 自动填充识别结果到检查数据
			this.fillRecognitionResult(aiResult)
			
			// AI识别成功后提示用户可以开启同步开关
			setTimeout(() => {
				uni.showToast({
					title: '可开启下方同步开关，保存时自动同步到现场工作照',
					icon: 'none',
					duration: 4000
				})
			}, 1500)
					} else {
					// 即使识别失败也设置已识别状态，允许重新识别
					this.hasRecognized = true
					uni.showToast({
						title: '未识别到害虫',
						icon: 'none'
					})
				}
					
				} catch (error) {
				uni.hideLoading()
				// 错误情况下也设置已识别状态，允许重新识别
				this.hasRecognized = true
				console.error('处理失败:', error)
				uni.showToast({
					title: error.message || '处理失败，请重试',
					icon: 'none'
				})
			}
			},
			
			// 上传图片到服务器获取网络URL
			async uploadImageToServer(filePath) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.$baseUrl + '/Upload.Upload/image', // 根据实际接口地址修改
						filePath: filePath,
						name: 'file',
						header: {
							'token': uni.getStorageSync('token') || ''
						},
						formData: {
							type: 'ai_recognition'
						},
						success: (res) => {
							try {
								const data = JSON.parse(res.data)
								console.log('图片上传响应:', data)
								if (data.code === 200 && data.data && data.data.detault_url) {
									// 拼接完整的图片URL
									const fullImageUrl = this.$baseUrl_imgs + data.data.detault_url
									console.log('完整图片URL:', fullImageUrl)
									resolve(fullImageUrl)
								} else {
									reject(new Error(data.msg || '图片上传失败'))
								}
							} catch (error) {
								console.error('上传响应解析失败:', error)
								reject(new Error('上传响应解析失败'))
							}
						},
						fail: (error) => {
							console.error('图片上传失败:', error)
							reject(new Error('图片上传失败：' + (error.errMsg || '网络错误')))
						}
					})
				})
			},
			
			// 调用AI识别接口
			async callAIRecognition(imageUrl) {
				try {
					console.log('开始调用AI识别接口，图片URL:', imageUrl)
					console.log('equipment_type:', this.list[0]['equipment_type_id'])
					
					// 调用真实的AI识别接口，传递网络图片URL和设备类型
					const response = await this.$api.getMosquitoIdentifier({
						image_url: imageUrl, // 使用网络图片URL
						equipment_type: this.list[0]['equipment_type_id']// 传递设备类型给后端
					})
					
					console.log('AI识别接口响应:', response)
					
					// 检查多种可能的成功状态码
					if ((response.code === 200 || response.code === 0) && response.data) {
						const data = response.data
						console.log('AI识别成功，数据:', data)
						
						// 如果返回的数据包含check_datas和original，直接映射到前端
						if (data.check_datas && data.original) {
							this.mapBackendDataToCheckDatas(data)
						}
						
						return {
							description: data.description || `检测到${data.pestCount || 0}只${data.pestName || '害虫'}`,
							confidence: data.confidence || 0.8,
							pestCount: data.pestCount || 0,
							pestName: data.pestName || '害虫',
							severity: data.severity || '轻微'
						}
					} else {
						// API调用失败，返回默认结果
						console.log('AI识别失败，响应码:', response.code, '消息:', response.msg)
						return {
							description: response.msg || '识别失败，请重试',
							confidence: 0,
							pestCount: 0,
							pestName: '未知',
							severity: '轻微'
						}
					}
				} catch (error) {
					console.error('AI识别接口调用失败:', error)
					// 接口调用异常，返回默认结果
					return {
						description: '网络异常，识别失败',
						confidence: 0,
						pestCount: 0,
						pestName: '未知',
						severity: '轻微'
					}
				}
			},
			
			// 将后端返回的数据映射到前端检查数据
			mapBackendDataToCheckDatas(backendData) {
				// 直接使用后端返回的check_datas
				if (backendData && backendData.check_datas) {
					this.check_datas = backendData.check_datas
				}
			},
			

			
			// 填充识别结果到检查数据
			fillRecognitionResult(aiResult) {
				// 如果有害虫数量，自动填充到检查数据中
				if (aiResult.pestCount > 0 && this.check_datas.length > 0) {
					// 假设第一个检查项是害虫数量
					if (this.typeid === 1) { // 数量输入类型
						this.check_datas[0].value = aiResult.pestCount
					}
				}
			
				// 在补充说明中添加识别结果
			let recognitionInfo
			// 优先根据check_datas生成详细结果，如果没有检测到害虫则使用AI接口返回的description
			// 根据check_datas生成详细的识别结果
			const detectedPests = []
			let totalCount = 0
			
			this.check_datas.forEach(item => {
				if (item.value > 0) {
					detectedPests.push(`${item.label}${item.value}只`)
					totalCount += item.value
				}
			})
			
			if (detectedPests.length > 0) {
				recognitionInfo = `检查结果：检测到${detectedPests.join('、')}`
			} else if (aiResult.description && aiResult.description.trim()) {
				recognitionInfo = `检查结果：${aiResult.description}`
			} else {
				recognitionInfo = `检查结果：未检测到害虫`
			}
			
			if (this.more_info) {
				if (Array.isArray(this.more_info)) {
					this.more_info.push(recognitionInfo)
				} else {
					this.more_info = this.more_info + '，' + recognitionInfo
				}
			} else {
				this.more_info = recognitionInfo
			}
			},
			
			// 预览图片
			previewImage() {
				if (this.imageUrl) {
					uni.previewImage({
						urls: [this.imageUrl],
						current: 0
					})
				}
			},
			
			// 删除图片
			deleteImage() {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: (res) => {
						if (res.confirm) {
							this.imageUrl = ''
							this.showUpload = false
						}
					}
				})
			},
			
			// 拖拽开始
			onTouchStart(e) {
				this.isDragging = false
				this.startX = e.touches[0].clientX
				this.startY = e.touches[0].clientY
				this.lastMoveTime = Date.now()
				
				// 缓存屏幕信息，避免在移动时重复获取
				if (!this.screenInfo) {
					this.screenInfo = uni.getSystemInfoSync()
				}
			},
			
			// 拖拽移动
			onTouchMove(e) {
				// 节流处理，减少频繁更新
				const now = Date.now()
				if (now - this.lastMoveTime < 16) { // 约60fps
					return
				}
				this.lastMoveTime = now
				
				// 计算移动距离，超过阈值才开始拖拽
				const deltaX = e.touches[0].clientX - this.startX
				const deltaY = e.touches[0].clientY - this.startY
				
				// 使用简单的距离判断
				if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
					this.isDragging = true
				}
				
				if (this.isDragging) {
					const screenWidth = this.screenInfo.screenWidth
					const screenHeight = this.screenInfo.screenHeight
					
					// 直接使用相对坐标计算（避免中心对齐的额外计算）
					let newLeft = this.btnLeft + deltaX
					let newTop = this.btnTop + deltaY
					
					// 边界限制
					const btnSize = 70
					const margin = 10
					newLeft = Math.max(margin, Math.min(screenWidth - btnSize - margin, newLeft))
					newTop = Math.max(margin, Math.min(screenHeight - btnSize - margin, newTop))
					
					this.btnLeft = newLeft
					this.btnTop = newTop
					
					// 更新起始点以支持持续拖拽
					this.startX = e.touches[0].clientX
					this.startY = e.touches[0].clientY
				}
			},
			
			// 拖拽结束
			onTouchEnd(e) {
				if (!this.isDragging) {
					return
				}
				
				// 自动吸附到屏幕边缘
				const screenWidth = this.screenInfo.screenWidth
				const centerX = screenWidth / 2
				
				if (this.btnLeft < centerX) {
					this.btnLeft = 10
				} else {
					this.btnLeft = screenWidth - 80
				}
				
				// 立即重置拖拽状态，防止触发点击
				this.isDragging = false
			},
			
			// 获取AI按钮城市配置
			getAIButtonConfig() {
				const settingOfficeId = this.setting_office_id
				if (!settingOfficeId) {
					console.log('getAIButtonConfig: setting_office_id为空，跳过请求')
					return
				}
				
				console.log('发起getAIButtonConfig请求，setting_office_id:', settingOfficeId)
				
				let params = {
					setting_office_id: settingOfficeId
				}
				this.$api.getAIButtonConfig(params).then(res => {
					console.log('🎉 getAIButtonConfig成功响应:', res)
					console.log('响应数据:', res.data)
					console.log('is_enabled值:', res.data?.is_enabled)
					
					if (res.code === 200 && res.data) {
						// 如果is_enabled为false，隐藏AI按钮
						if (res.data.is_enabled === false) {
							console.log('❌ AI配置为disabled，隐藏按钮')
							this.setting_office_id = ''
						} else {
							console.log('✅ AI配置为enabled，保留按钮显示')
							console.log('当前setting_office_id保留为:', this.setting_office_id)
						}
					} else {
						console.log('⚠️ 响应不是200，code:', res.code)
					}
				}).catch(err => {
					console.error('❌ getAIButtonConfig请求失败:', err)
					console.error('错误信息:', err.message)
				})
			},
			
			// 初始化按钮位置
			initButtonPosition() {
				// 缓存屏幕信息
				this.screenInfo = uni.getSystemInfoSync()
				const screenWidth = this.screenInfo.screenWidth
				const screenHeight = this.screenInfo.screenHeight
				
				// 设置初始位置：右边中央（转换为px单位）
				this.btnLeft = screenWidth - 70 - 10 // 距离右边10px，按钮宽度70px
				this.btnTop = (screenHeight / 2) - 35 // 垂直居中，按钮高度70px的一半
			}
		}
	}
</script>

<style lang="scss">
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
.previous{
	background-color: #FFFFFF;
	color: #007AFF;
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
	z-index: 9999;
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
.more{
	color: #007AFF;
}
.scanCode{
	width: 200rpx;
	height: 40rpx;
	color: #FFF;
	background-color: #007AFF;
	font-size: 26rpx;
	text-align: center;
}
.claer{
	width: 100%;
	height: 80rpx;
}

/* 悬浮AI识别按钮 */
.floating-ai-btn {
	position: fixed;
	width: 70px;
	height: 70px;
	background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	border-radius: 35px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1);
	z-index: 999;
	cursor: move;
	border: none;
	backdrop-filter: blur(10px);
	will-change: left, top;
	backface-visibility: hidden;
	-webkit-transform: translateZ(0);
	transform: translateZ(0);
}

.floating-ai-btn.dragging {
	transition: none !important;
}

.floating-ai-btn:not(.dragging) {
	transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-ai-btn:active {
	transform: scale(0.92);
}

.floating-ai-btn:hover {
	transform: translateY(-2px);
}

.ai-btn-icon {
	font-size: 28rpx;
	margin-bottom: 2rpx;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	transform: scale(1.1);
}

.ai-btn-text {
	color: #FFFFFF;
	font-size: 22rpx;
	font-weight: 600;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	letter-spacing: 0.5rpx;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 图片同步开关样式 */
.sync-switch-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	margin-top: 20rpx;
	border-top: 1px solid #f0f0f0;
	background-color: #fafafa;
}

.sync-switch-label {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.ai-btn-icon {
	font-size: 32rpx;
	margin-bottom: 4rpx;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
	transform: scale(1.2);
	animation: pulse 2s infinite;
}

.ai-btn-text {
	color: #FFFFFF;
	font-size: 20rpx;
	font-weight: 700;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	letter-spacing: 1rpx;
	text-transform: uppercase;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1.2);
	}
	50% {
		transform: scale(1.3);
	}
}

/* 图片显示区域 */
.image-display {
	position: relative;
	margin: 20rpx 0;
	
	.uploaded-image {
		width: 100%;
		height: 400rpx;
		border-radius: 12rpx;
		border: 2rpx solid #e0e0e0;
	}
	
	.image-actions {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		
		.delete-btn {
			width: 50rpx;
			height: 50rpx;
			background: rgba(255, 59, 48, 0.8);
			color: #fff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.delete-icon {
				font-size: 30rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
