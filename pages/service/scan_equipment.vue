<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="service">
			<view class="service_content">
				<!-- <cl-row>
					<view class="text-left">设备二维码</view>
					<view class="text-right">
						<cl-icon name="cl-icon-scan" color="#007AFF" :size="60" class="scan" @tap="scanCode()"></cl-icon>
					</view>
				</cl-row> -->
				<cl-row>
					<view class="text-left" >设备编号</view>
					<view class="text-right" style="width: 70%;">
						<view v-if="one_eq == 1">
							<cl-col span="12" style="text-align: right;">
								{{eq_mark}}
							</cl-col>
							<cl-col span="12">
								<cl-input  v-model="eq_mark_num" placeholder="自定义"  />
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
			selectList:[]
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
		
		this.id = index.id
		// this.ct = uni.getStorageSync('ct')
		this.data_select()
		
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
					if (res.code == 200) {
						if (res.data) {
							// 1.设备名称
							this.equipment_name = res.data.eq_name	
							
							// 2.设备编号
							var equipmentNumber = '';
							// 单个
							if(res.data.list.length == 1)
							{
								this.eq_mark = res.data.list[0]['equipment_number']	// 设备标识
								this.eq_mark_num = res.data.list[0]['number']			// 设备编号
								this.equipment_number = res.data.list[0]['number']
							}
							// 多个
							
							if(res.data.list.length>1){
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
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			scanCode() {
				uni.scanCode({
					success: async (res) => {
						if(res.result!=''){
							let param = {
								staffid: uni.getStorageSync('staffid'),
								city: uni.getStorageSync('city'),
								scan_code: res.result,
								job_id: this.jobid,
								job_type: this.jobtype,
							}
							uni.request({
								url: `${this.$baseUrl}/addequipmentbyscan`,
								header: {
									'content-type': 'application/x-www-form-urlencoded',
									'token': uni.getStorageSync('token')
								},
								method: 'POST',
								data: param,
								success: (res) => {
									if (res.data.code == 1 && res.data.data!=null) {
										this.id = res.data.data
										this.data_select();
									} else {
										uni.showToast({
											icon: 'none',
											title: res.data.msg
										});
									}
							
								},
								fail: (err) => {
									console.log(res);
								}
							})
						}else{
							uni.showToast({
								icon: 'none',
								title: '扫码错误！'
							});
						}
						
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
			// 保存	单个 多个
			save(){
				
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
					check_handle = this.check_handle.join(',')
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
					ids:ids
				}
				this.$api.editEq(params).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					if(res.code == 200){
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
			savex() {
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
							check_datas: this.check_datas,
							check_handle: this.check_handle,
							site_photos: this.upload_site_photos,
							more_info: this.more_info,
							eq_mark_num:this.eq_mark_num
						}
						uni.setStorageSync('last_id_' + this.jobid,this.id)
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
											.service_type + '&ct=' + this
											.ct
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
.more{
	color: #007AFF;
}
</style>
