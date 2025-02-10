<template>
	<view class="content" style="margin-bottom: 40px;">
		<view class="service">
			<view class="service_content">
				<cl-row>
					<view class="text-left" style="width:40%;">设备编号</view>
					<view class="text-right" style="width:50%;">{{equipment_number}}</view>
				</cl-row>
				<cl-row>
					<view class="text-left" style="width:40%;">设备名称</view>
					<view class="text-right" style="width:50%;">{{equipment_name}}</view>
				</cl-row>
				<cl-row >
					<view class="text-left" style="width:40%;">设备区域</view>
					<view class="text-right" style="width:50%;">{{equipment_area}}</view>
				</cl-row>
				<cl-row >
					<view class="text-left" style="width:40%;line-height: 43px;">区域类型</view>
					<view class="text-right" style="width: 50%;">
						<cl-select v-model="equipment_area_type" :disabled="disabled" :options="deviceOption"></cl-select>
					</view>
				</cl-row>
				<cl-row v-if="disabled == false ">
					<view class="text-left" style="width:40%;">服务历史</view>
					<view class="text-right" style="width:50%;">
						{{serviceContentHistory}} 
						<span class="more" v-if="serviceContentHistory != ''" @click="toggle('bottom')">更多</span> 
					</view>
				</cl-row>
					<uni-popup ref="popup" background-color="#fff" >
						<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
							<view v-for="(item,index) in history_list" :key="index">
								<view class="father" style="margin:0;">
									<view class="time" style="margin:0;">
										<view class="circle"></view>
									</view>
									<view class="son1" style="margin:0;"></view>
									<view style="margin-left: 11px;">
										<view class="h_info">{{item.creat_time}}</view>
										<view class="h_info">{{item.name}}({{item.code}})</view>
										<view class="son2">{{item.service_content}}</view>
									</view>
								</view>
								<view class="jianxi" style="margin:0;"></view>
							</view>
						</view>
					</uni-popup>
				<cl-row >
					<view class="text-left" style="width:40%;">设备触发</view>
					<view>
						<scroll-view class="uni-swiper-tab" scroll-x scroll-y style="max-height:180px">
							<view class="new_card_content" >
								<view class="div-table">
									<view class="tr">
										<view class="td"></view>
										<view class="td"></view>
										<view class="td">过去14日至8天</view>
										<view class="td">过去7 日</view>
										<view class="td"></view>
									</view>
									<view class="tr">
										<view class="td noPadding" style="border-top:none;">
											<view class="rowspan">
												<view class="tr"><view class="td">设备名称</view></view>
											</view>
										</view>
										<view class="td noPadding" style="border-top:none;">
											<view class="rowspan">
												<view class="tr"><view class="td">设备区域</view></view>
											</view>
										</view>
										<view class="td noPadding">
											<view class="celspan">
												<view class="td">{{work_time}} 触发次数</view>
												<view class="td">{{no_work_time}} 触发次数</view>
											</view>
										</view>
										<view class="td noPadding">
											<view class="celspan">
												<view class="td">{{work_time}} 触发次数</view>
												<view class="td">{{no_work_time}} 触发次数</view>
											</view>
										</view>
											<view class="td noPadding" style="border-top:none;">
												<view class="rowspan">
													<view class="tr"><view class="td">上升与下降百分比</view></view>
												</view>
											</view>
									</view>
									<view class="tr" v-for="(item, index) in SmarttechData" :key="index">
										<view class="td">{{item.Device_Name}}</view>
										<view class="td">{{item.area}}</view>
										<view class="td noPadding">
											<view class="celspan">
												<view class="td" style="width: 49%;">{{item.past14DaysMorning}}</view>
												<view class="td" style="width: 49%;">{{item.past14DaysEvening}}</view>
											</view>
										</view>
										<view class="td noPadding">
											<view class="celspan">
												<view class="td" style="width: 49%;">{{item.past7DaysMorning}}</view>
												<view class="td" style="width: 49%;">{{item.past7DaysEvening}}</view>
											</view>
										</view>
										<view class="td">{{item.ratio}} %</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</cl-row>
			</view>
		</view>
		<view class="service" style="margin-top:30px;">
			<view class="service_title">服务内容</view>
			<view style="margin-top:20px;">
				<cl-row >
				<view class="text-left" style="width:40%;">本次服务内容</view>
				<view class="text-right" style="width:50%;">
					<cl-select v-model="service_content" :options="shortcuts"></cl-select>
				</view>
			</cl-row>
			</view>
		</view>

		<uni-popup ref="batchedittip" background-color="#fff" >
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view style="text-align: center;">
					<view style="font-size: 20px;font-weight: bold;">本次服务内容</view>
					<view style="padding: 12px;">共有 <span style="color: #02A7F0;">{{editEqCount}}</span> 个设备将被批量编辑，请谨慎操作！</view>
					<view style="border-bottom:2px solid #f2f2f2;margin: 10px;"></view>
					<view style="border:1px solid rgb(245, 154, 35);background-color: rgba(245, 154, 35, 0.196);border-radius: 4px;">
						<view style="width:90%;text_align:left;">以下 <span>{{editEqCount}}</span> 设备已填写内容是否替换服务内容</view>
					</view>

					<view style="width:90%;margin:10px auto;" v-for="(item,index) in list" :key="index">
						<view style="width:80%;float:left;height:70px;text-align:left;line-height: 30px;">
							<view>{{item.equipment_name}} <span style="margin-left: 47px;"> {{item.equipment_area_type}}</span> </view>
							<view>{{item.smart_equipment_area}}</view>
						</view>
						<view style="width:20%;float:right;height:70px;">
							<radio-group @change="radioChange($event,item.id)">
								<label class="radio-label" v-for="(item, index) in yes_or_no_items" :key="index" :style="{ position: 'relative', top: index === 1 ? '10px' : '0px' }">
									<radio :value="item.value" :checked="item.checked" />{{ item.name }}
								</label>
							</radio-group>
						</view>
						<view style="width:100%;height:50p;text-align:left;">
							是否将 <span style="color: #0079FE;">“{{item.service_content}}”</span> 替换为 <span style="color: #0079FE;">“{{service_content}}”</span>
						</view>
					</view>
					
					<view style="display: flex;">
						<view style="width: 50%;" @click="closeupp">取消</view>
						<view style="width: 50%;color: #0079FE;" @click="save_smart">确定</view>
					</view>

				</view>
			</view>
		</uni-popup>

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
		<view style="margin-bottom:50%"></view>
	</view>
</template>
<script>
import ldSelect from '@/components/ld-select/ld-select.vue';
import tTable from '@/components/t-table/t-table.vue';
import tTh from '@/components/t-table/t-th.vue';
import tTr from '@/components/t-table/t-tr.vue';
import tTd from '@/components/t-table/t-td.vue';
export default {
	components: {
			ldSelect,
			tTable,
			tTh,
			tTr,
			tTd,
	},
	data() {
		return {
			name:'设备详情',
			shortcuts: [],
			// shortcutsOld:[],
			jobid: '',
			jobtype: '',
			scrollH:500,
			type: 'center',
			// shortcut_type: '',
			// service_type: '',
			// scan_code: '',
			// id: '',
			// areaclick:0,
			// typeid: 0,
			// showmore:0,
			equipment_name: '',
			equipment_area:'',
			equipment_area_type:'',
			equipment_number: '',
			service_content:'',
			serviceContentHistory:'',
			// all_equipment_number: '',
			// number: '',
			// site_photos: '',
			// check_datas: [],
			// check_handle: [],//'',
			// check_handles: '',
			// more_info: '',
			// end_site_photos: '',
			// start_site_photos: '',
			// upload_site_photos: '',
			// search_key: '',
			// timer: null,
			// len: false,
			// ct:0,
			disabled:true,	// 单个设备true 多个设备false	
			// one_eq:1,		// 1为单个设备，0为多个设备
			// eq_mark:'',		// 设备标识
			// eq_mark_num:'', // 设备编号
			list:[]			,// 储存list
			// selectList:[],
			// hasScanCode: false,
			// scan_id:0,
			can_save: true,
			eqIdListStr:'',
			is_single:true,
			previous_next: 0, 	// 0 默认   1 上一个   2 下一个 
			deviceOption:[],
			SmarttechData:[],
			work_time:'',
			no_work_time:'',
			history_list:[],
			yes_or_no_items: [
				{ name: '是', value: 1, checked: false },
				{ name: '否', value: 0, checked: false },
			],
			editIds:'',
			editEqCount:'',
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
		// this.scan_id = index.jobtype
		this.can_save = true
		this.id = index.id
		this.eqIdListStr = index.id_list
		this.previous_next = 0
		// this.ct = uni.getStorageSync('ct')
		var arr = index.id.split(",");
		console.log('arr.length',arr.length)
		if(arr.length > 1){
			this.is_single = false
		}
		this.data_select() //设备详情
		this.deviceSelect()	// 设备区域类型
	},
	methods: {
			// 详情
			data_select() {
				let params = {
					job_type: this.jobtype,
					job_id: this.jobid,
					ids: this.id,
				}
				this.$api.getSmartEqInfo(params).then(res=>{
					if(res.code != 200){
						uni.showToast({icon: 'none',title: res.msg});
						this.can_save = false
					}else if (res.data) {
						this.equipment_number = res.data.equipmentNumber	
						this.equipment_name = res.data.equipmentName	
						this.equipment_area = res.data.equipmentArea
						this.serviceContentHistory = res.data.serviceContentHistory
						this.list = res.data.list
						this.editEqCount = res.data.list.length
						if(res.data.list.length == 1){
							// 单个
							this.service_content = res.data.serviceContent	
							this.disabled = false
							this.equipment_area_type = res.data.equipmentAreaType	
						}else if(res.data.list.length > 1){
							// 多个
							this.disabled = true
							this.equipment_area_type = ''
						}
						// 快捷语数组
						let shortcuts = res.data.shortcutContents 	
						let shortcutsArr = []
						shortcuts.forEach((item,i)=>{
							shortcutsArr.push({label:item,value:item})
						})
						this.shortcuts = shortcutsArr
						//智能设备表格
						this.SmarttechData = res.data.SmarttechData.list	
						this.work_time = res.data.SmarttechData.work_time
						this.no_work_time = res.data.SmarttechData.no_work_time
					}else{
						uni.showToast({icon: 'none',title: '出现错误,请重试'});
					}
				}).catch(err=>{
					uni.showToast({icon: 'none',title: err.msg});
					console.log(err)
				})
			},
			closeupp(){
				this.$refs.batchedittip.close()
				uni.showToast({
					title: '取消成功！',
					icon: 'none'
				})
			},
			save_smart(){
				this.editEq()
			},
			save(){
				this.type = 'bottom'
				this.$refs.batchedittip.open('bottom')
				this.previous_next = 0
				// this.editEq()
			},
			// 保存	单个 多个
			editEq(){
				// if(this.editIds == ''){
				// 	uni.showToast({
				// 		title: '没有需要操作的设备！',
				// 		icon: 'none'
				// 	})
				// 	return false
				// }
				let ids = this.list.map((item) => {
				    return item.id
				}).join(',')

// 				console.log('idsidsidsids',ids)
// 				console.log('this.editIds',this.editIds)
// return false

				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					equipment_name: this.equipment_name,
					equipment_area: this.equipment_area,
					check_handle: null,
					more_info: null,
					eq_number: this.equipment_number,
					equipment_area_type: this.equipment_area_type,
					ids:ids,
					content_ids:this.editIds,
					service_content:this.service_content
				}

				// console.log('this.editIds',this.editIds)
				// return false

				uni.setStorageSync('last_smart_id_' + this.jobid,this.id)
				this.$api.editSmartEq(params).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					if(res.code == 200){
						if(this.previous_next == 1){
							var arr = this.eqIdListStr.split(",");
							let index = arr.indexOf(this.id);  
							if (index !== -1) {  
							    let prevJobId = index > 0 ? arr[index - 1] : null;
								if(prevJobId != null){
									uni.redirectTo({
										url: "/pages/service/smart_scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+prevJobId +'&id_list='+this.eqIdListStr
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
										url: "/pages/service/smart_scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+nextJobId +'&id_list='+this.eqIdListStr
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
				this.type = 'bottom'
				this.$refs.batchedittip.open('bottom')
				this.previous_next = 1
				// this.editEq()
				this.editIds = ''
				
			},
			eq_next(){
				this.type = 'bottom'
				this.$refs.batchedittip.open('bottom')
				this.previous_next = 2
				// this.editEq()
				this.editIds = ''
			},
			deviceSelect(){
				this.$api.deviceSelect({}).then(res=>{
					this.deviceOption = res.data
				}).catch(err=>{
				})
			},
			toggle(type) {
				this.check_history(type)
				
			},
			check_history(type){
				let ids = this.list.map((item) => {
				    return item.id
				}).join(',')
				let params = {
					job_id: this.jobid,
					job_type: this.jobtype,
					ids:ids,
				}
				this.$api.getSmartEqServiceHistory(params).then(res=>{
					this.history_list = res.data
					if(this.history_list.length > 0){
						this.type = type
						this.$refs.popup.open(type)
					}else{
						uni.showToast({
							title: "无历史服务记录",
							icon: 'none',
						});
					}
				}).catch(err=>{
				})
			},
			radioChange(event, id) {
				const { value } = event.detail;
				let editIdsArray = this.editIds.split(',').filter(item => item); 
				const idStr = id.toString();
				if (value == 1) {
					if (!editIdsArray.includes(idStr)) {
						editIdsArray.push(idStr);
					}
				} else if (value == 0) {
					editIdsArray = editIdsArray.filter(item => item !== idStr);
				}
				this.editIds = editIdsArray.join(',');
				return false;
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
	margin:10px;
	font-size:15px;
	width: 1100rpx;
}
.new_card_content span {
	color:#5e6165;
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
	z-index: 9;
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
	margin: 4px 0px;
}
.lz {
	margin: 10px 0px;
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
.father {
        display: flex;
        flex-direction: row;
        align-items: stretch;
      }
      .son1 {
        background-color: #f2f2f2;
        width: 2px;
        padding: 60px 0; /* 通过padding 让线条变长，使上下模块产生距离 */
        margin: 0 10px;
      }
      .son2 {
        background-color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
		padding:10px;
      }
      .circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #f2f2f2;
        position: relative;
        left: 7px;
    	top: -41px;
      }
 
      .time {
        width: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .jianxi{
        background-color: #f2f2f2;
        width: 2px;
        height: 20px;
        position: relative;
        left: 10px;
      }
	  .h_info{
		padding: 4px 0px 4px 10px;
	  }
</style>


<style lang="scss">
.h1 {
	text-align: left;
	font-size: 30upx;
	font-weight: bold;
	padding: 10upx 0;
}
.wrap {
	margin: 20upx;
}
$div-table-border-color: #666;
$div-table-border-width: 1upx;

.div-table {
	display: table;
	width: 100%;
	height: 100%;
	border: $div-table-border-width solid $div-table-border-color;
	box-sizing: border-box;
	table-layout: fixed;
	position: relative;
	.celspan {
		display: table;
		width: 100%;
		height: 100%;
		.td {
			display: table-cell;
			border: none !important;
		}
		.td + .td {
			border-left: $div-table-border-width solid $div-table-border-color !important;
		}
	}
	.rowspan {
		display: table;
		width: 100%;
		height: 100%;
		.tr {
			display: table-row;
			border: none !important;
		}
	}

	&.fixed-thead {
		.tbody,
		.thead,
		.tr,
		.th,
		.td {
			display: block;
		}
		.tr,
		.th {
			&:after {
				content: '';
				display: block;
				visibility: hidden;
				clear: both;
				height: 0;
			}
		}
		.td {
			float: left;
			width: 33.33%;
		}
		.tbody {
			height: 400upx;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}

	.tr,
	.th {
		display: table-row;
		& + .tr,
		& + .th {
			.td,
			.th {
				border-top: $div-table-border-width solid $div-table-border-color;
				word-break: break-word;
			}
		}
	}
	.rowspan {
		.tr,
		.th {
			display: table-row;
			.td,
			.th {
				border: none;
			}
			& + .tr,
			& + .th {
				.td,
				.th {
					border-top: $div-table-border-width solid $div-table-border-color;
				}
			}
		}
	}
	.td {
		display: table-cell;
		vertical-align: middle;
		text-align: center;
		box-sizing: border-box;
		padding: 10upx;
		&.noPadding {
			padding: 0;
		}
		& + .td {
			border-left: $div-table-border-width solid $div-table-border-color;
		}
	}
	.th .td {
		font-weight: bold;
	}
	.tbody {
		display: table-row-group;
	}
	.thead {
		display: table-header-group;
		.tr,
		.th {
			.td,
			.th {
				border-bottom: $div-table-border-width solid $div-table-border-color;
			}
		}
	}
	.tfoot {
		display: table-footer-group;
		.tr,
		.th {
			.td,
			.th {
				border-top: $div-table-border-width solid $div-table-border-color;
			}
		}
	}
	.colgroup {
		display: table-column-group;
	}
	.col {
		display: table-column;
	}
	.caption {
		display: table-caption;
	}
}
</style>
<style lang="scss">
	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}
	.box {
		@include flex;
	}
	.popup-content {
		align-items: center;
		justify-content: center;
		padding: 15px;
		background-color: #fff;
		max-height: 500px;
		overflow-y: auto;
	}
	.popup-height {
		@include height;
		width: 200px;
	}

	.text {
		font-size: 12px;
		color: #333;
	}
</style>

