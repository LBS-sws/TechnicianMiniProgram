// todo 制作 扫码跳转到对应设备详情页的功能
<template>
	<view class="content" style="padding-top: 80rpx; padding-bottom: 120rpx;">
		<!-- 添加 -->
		<view class="add" @tap="add()">
			<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<!-- 扫码 -->
		<view class="scan" @tap="scanCode()">
			<cl-icon name="cl-icon-scan" color="#007AFF" :size="80"></cl-icon>
		</view>
		<!--<cl-confirm ref="add_confirm" style="z-index: 99999;">
			<cl-input v-model="add_numbercode" placeholder="设备编号"></cl-input>
		</cl-confirm> -->
		<cl-confirm ref="add_confirm" style="z-index: 99999;">
			<view class="confirm_magin">
				<cl-scroller style="overflow-y: auto;">
					<view class="allo xzadd">
						<cl-checkbox-group v-model="add_eq" border>
							<cl-checkbox v-for="(item,index) in add_all" :key="index" v-bind:label="item.id">
								{{item.name}}
							</cl-checkbox>
						</cl-checkbox-group>
						<view style="width: 100%; height: 140rpx; background: none;"></view>
					</view>
				</cl-scroller>
			</view>
			<view class="confirm_magin">
				<cl-row style="color: #000000;width: 73%;margin: -5px auto 5px auto;" class="more-item">
					<view style="width: 48%;text-align: left;">编号</view>
					<view>
						<cl-input v-model="add_equipment_letter" placeholder="编号前缀"  style="text-align: left;">
							<text slot="append" style="margin-top: 3px;font-size: 16px;"></text>
						</cl-input>
					</view>
					<view>
						<cl-input v-model="add_equipment_number" placeholder="数字" style="text-align: left;">
							<text slot="append" style="margin-top: 3px;font-size: 16px;"></text>
						</cl-input>
					</view>
				</cl-row>
				<cl-row style="color: #000000;width: 73%;margin:  0 auto 10px auto;" class="more-item">
					<view style="width: 24%;text-align: left;">区域</view>
					<view>
						<cl-input v-model="add_equipment_area" style="text-align: left;">
							<text slot="append" style="margin-top: 3px;font-size: 16px;"></text>
						</cl-input>
					</view>
					<view></view>
				</cl-row>
				<cl-row style="color: #000000;width: 73%;margin:  0 auto 10px auto;" class="more-item">
					<view style="width: 50%;text-align: left;">区域类型</view>
					<view>
						<cl-select placeholder="所有区域类型" v-model="equipment_area_type" :options="deviceOption" >
						</cl-select>
					</view>
					<view></view>
				</cl-row>
			</view>
			<view class="confirm_magin">
				增加数量：
				<cl-input-number v-if="!scan_code" v-model="add_number"  :max="100000" :min="1" input="true" style="margin-left: 10px;"
				@change="numChange"></cl-input-number>
				<cl-input-number v-else v-model="add_number" :max="1" :min="1" input="true" readonly="true" disabled></cl-input-number>
			</view>
		</cl-confirm>
		<!-- 删除 -->
		<view class="del" @tap="del()">
			<cl-icon name="cl-icon-minus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="del_confirm"> </cl-confirm>

		<view class="lz">
			<cl-row>
				<cl-col span="12">
					<cl-select placeholder="所有区域" v-model="equipment_area" value-key="value"
						:options="equipment_area_lists" @change="change_area()">
					</cl-select>
				</cl-col>
				<cl-col span="12">
					<cl-select placeholder="所有设备" v-model="equipment" :options="equipment_lists"
						@change="change_equipment()">
					</cl-select>
				</cl-col>
			</cl-row>
		</view>
		<view class="all jjBtn" >
			<cl-checkbox-group v-model="xz_all" border >
				<cl-checkbox v-for="(item,index) in all" :key="index" v-bind:label="item.id" :class="'content_' + item.id">
					<view v-if="item.choose > 0" class="eq_isnull_color">
						<view style="width:80%;height:80px;float: left;display: grid;place-items: center;">
							{{item.number}}&nbsp;{{item.label}} <view class="device_area">{{item.device_area}}</view>
						</view>
						<view style="width:20%;height:80px;float: right;">
							<view class="top" v-if="item.up_or_down == 1"></view>
							<view class="down" v-if="item.up_or_down == 2"></view>
						</view>
						
					</view>
					<view v-else>
						<view style="width:80%;height:80px;float: left;display: grid;place-items: center;">
							{{item.number}}&nbsp;{{item.label}} <view class="device_area">{{item.device_area}}</view>
						</view>
						<view style="width:20%;height:80px;float: right;">
							<view class="top" v-if="item.up_or_down == 1"></view>
							<view class="down" v-if="item.up_or_down == 2"></view>
						</view>
					</view>
				</cl-checkbox>
			</cl-checkbox-group>
			<view v-show="is_load_bottom" style="text-align: center;">{{bottom_load_msg}}</view>
		</view>
		<view style="display: block; text-align: center;" v-if="loading">
			<cl-loading></cl-loading>
		</view>
		<view v-else class="loadingText">{{loadingText}}</view>
		<view class="bu">
			<cl-row>
				<cl-col span="12" class="hzyl" @tap="hzyl()"><span style=" margin: 0 auto;">汇总预览</span></cl-col>
				<cl-col span="12" @tap="ckxq()">
					<view class="ckxq">查看详细</view>
				</cl-col>
			</cl-row>
		</view>
	</view>
</template>

<script>
import Base64 from 'base-64';

	export default {
		data() {
			return {
				name:'设备情况',
				equipment_area_lists: [],
				equipment_area: "",
				equipment: "",
				equipment_lists: [],
				equipment_total: 0,
				xz_all: "",
				all: [],
				tablename: "equipments",
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				add_all: '',
				add_eq: '',
				add_equipment_letter:'',
				add_equipment_number: '',
				add_equipment_area: '',
				equipment_area_type:'',
				add_number: 1,
				scan_code:'',
				add_numbercode:'',
				ct:0,
				content_scole:1360343,
				page: 1,		// 当前页 m
				limit: 1000,	// 每页多少条 m
				total:'',		// 总条数
				loading:false,
				isLoadMore:true,
				loadingText:"",
				total_page:1,
				is_load_bottom:false,
				bottom_load_msg:'',
				deviceOption:[],
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
			// this.ct = index.ct
			this.ct = uni.getStorageSync('ct')
			// console.log(this.ct)
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			
			this.equipment_area = uni.getStorageSync('equipment_area_' + this.jobid)
			this.equipment = uni.getStorageSync('equipment_' + this.jobid)
						
			this.optionEq()		// 筛选1
			this.data_select()  // 列表
			this.optionEqAdd()	// 添加设备选项
			this.deviceSelect()	// 添加设备选项
		},
		onReady(){
			this.but()
		},
		onPullDownRefresh(){
			console.log('下拉刷新触发')
			this.page = 1
			this.data_select()  // 列表
		},
		//	上拉触底函数
		onReachBottom(){
			if(this.page <= this.total_page){
				this.data_select()  // 列表
				this.bottom_load_msg = '上滑显示更多！！'
			}else{
				this.bottom_load_msg = '已经到底了！！'
			}
		},
		methods: {
			numChange(e){
				console.log(e)
			},
			optionEqAdd(){
				let params = {
					job_type: this.jobtype,
					job_id: this.jobid,
				}
				this.$api.optionEqAdd(params).then(res=>{
					if (res.code == 200) {
						this.add_all = res.data
					}
					if(res.code == 400){
						uni.$utils.toast(res.msg)
					}
				}).catch(err=>{
					console.log(err)
				})
				
			},
			// 筛选 所有区域 所有设备
			optionEq(){
				let params = {
					job_type: this.jobtype,
					job_id: this.jobid,
				}
				this.$api.optionEq(params).then(res=>{
					if (res.code == 200) {
						if (res.data.optionArea.length>0) {
							let Area = res.data.optionArea
							let AreaList = []
							Area.forEach((item,i)=>{
								AreaList.push({label:item.equipment_area,value:item.equipment_area})
							})
							AreaList.unshift({ label: '全部区域', value: '' })
							this.equipment_area_lists = AreaList
						}
						if(res.data.optionEq.length>0){
							let eq = res.data.optionEq
							let EqList = []
							eq.forEach((item,i)=>{
								EqList.push({label:item.equipment_name,value:item.equipment_type_id})
							})
							EqList.unshift({ label: '全部设备', value: '' })
							this.equipment_lists = EqList
						}
					}
					if(res.code == 400){
						uni.$utils.toast(res.msg)
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			but(){
				var sbStr = uni.getStorageSync('last_id_' + this.jobid)
				if(sbStr != false){
					
					var jd = sbStr.split(',')
					console.log(sbStr)
					// console.log(jd[jd.length-1])
					var md = '.content_' + jd[jd.length-1] //this.content_scole
					
					setTimeout(()=>{
						var view = uni.createSelectorQuery().select(md);
						view.boundingClientRect(data => {
							
							// console.log(data)
							if(data){
								uni.pageScrollTo({
									duration: 300,//过渡时间
									scrollTop:data.top,//到达距离顶部的top值
								})
							}else
								return false
						}).exec();
					},500)
				}else{
					console.log('未找到上次锚点')
				}
			},
			// 设备列表
			data_select() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});

				let params = {
					job_type:this.jobtype,
					job_id:this.jobid,
					equipment_area:this.equipment_area,
					equipment_type_id:this.equipment,
					page:this.page,
					limit:this.limit
				}
				this.$api.equipmentList(params).then(res=>{
					if (res.code == 200) {
						console.log('res.data',res.data)
						if (res.data) {
							let all = res.data.data
							this.equipment_total = res.data.total//记录总条数
							if(all != undefined){
								all.forEach((item,i)=>{
									item.label = item.equipment_name
									item.value = item.equipment_number
									item.eq_number = item.equipment_number
								})
								if(this.page == 1){
									this.all = all
								}else{
									this.all = [...this.all, ...all];
								}
								if(this.page == res.data.current_page){
									this.is_load_bottom = true
								}else{
									this.is_load_bottom = false
								}
								
								if(this.page == res.data.last_page){
									this.bottom_load_msg = '已经到底了！！'			  
								}else{
									this.bottom_load_msg = '上滑显示更多！！'
								}
								
								this.total_page = res.data.last_page
								this.page = res.data.current_page + 1
							}else{
								this.all = []
								this.is_load_bottom = false
							}
						}
					}
					if(res.code == 400){
						uni.$utils.toast(res.msg)
						this.is_load_bottom = true
						this.bottom_load_msg = res.msg
					}
					uni.hideLoading();
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
				})
			},
			hzyl() {
				uni.navigateTo({
					url: "/pages/service/equipment_hz?jobid=" + this.jobid + '&jobtype=' + this.jobtype
				})
			},
			// 查看详情
			ckxq() {
				// console.log('add_all',this.all)
				if (this.xz_all == '') { // 撤销单选  || this.xz_all.length > 1
					uni.showToast({
						icon: 'none',
						title: '请选择一台设备'
					});
					return;
				} else {
					let ids = this.xz_all.join(",")
					
					let id_list = this.all.map((item) => {
					    return item.id
					}).join(',')

					var is_existence_smart = 0
					this.xz_all.forEach(idToCheck => {
						let found = this.all.some(item => item.id === idToCheck && item.equipment_type_id === 327);
						if (found) {
							is_existence_smart = 1
						} 
					});
					var smartList = [];
					this.all.forEach((item,i)=>{
						if(item.equipment_type_id === 327){
							smartList.push(item.id)
						}
					})
					if(is_existence_smart){
						uni.redirectTo({
							url: "/pages/service/smart_scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+ids +'&id_list='+smartList
						})
					}else{
						uni.redirectTo({
							url: "/pages/service/scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+ids +'&id_list='+id_list
						})
					}
				}
			},
			scanCode() {
				let that = this
				that.scan_code = ''

				uni.scanCode({
					success: async (res) => {
						if(res.result=='') {
							uni.showToast({icon: 'none', title: '无效二维码'});
							return false;
						}
						
						let queryString = res.result.split('?')[1];
						if (!queryString) {
							uni.showToast({icon: 'none', title: '无效二维码!'});
							return false;
						}

						let queryParams = new URLSearchParams(queryString);
						if(!queryParams.get('id') || !queryParams.get('city') || !queryParams.get('office_id')) {
							uni.showToast({icon: 'none', title: '无效的二维码！'});
							return false;
						}

						let scan_id = Base64.decode(queryParams.get('id')) // base64 decode
						
						that.xz_all = [] // 清空选中项
						let is_add_eq = false // 是否添加设备

						// 遍历当前设备
						that.all.forEach(item => {
							if(item.qrcode_id != null && item.qrcode_id == scan_id) {
								that.xz_all = [item.id]
							}
						});

						// 如果列表中已找到设备，直接跳转
						if(that.xz_all.length > 0) {
							let ids = that.xz_all.join(",")
							uni.redirectTo({
									url: "/pages/service/scan_equipment?jobid="+that.jobid + '&jobtype='+that.jobtype +'&id='+ids
							})
							return;
						}

						// 列表中没找到设备
						if(that.equipment_total == that.all.length) { // 设备列表已加载完
							// 直接添加设备
							that.scan_code = res.result
							that.add_by_scan(queryParams.get('id'), res.result);
						} else { // 设备列表未加载完，需要请求后台
							let params = {
								job_type: this.jobtype,
								job_id: this.jobid,
								scan_id: scan_id
							}
							
							try {
								let checkRes = await that.$api.checkQrEquipment(params)
								if (checkRes.code == 200) {
										if (checkRes.data.qrStatus == 0 && checkRes.data.equipmentId == 0) {
											// 没绑定设备，添加设备
											that.scan_code = res.result
												that.add_by_scan(queryParams.get('id'), res.result);
										} else if(checkRes.data.qrStatus == 1) {
											// 已绑定设备，查看设备
											that.xz_all.push(checkRes.data.equipmentId)
											let ids = that.xz_all.join(",")
											uni.redirectTo({
												url: "/pages/service/scan_equipment?jobid="+that.jobid + '&jobtype='+that.jobtype +'&id='+ids
											})
										}
								} else {
									uni.$utils.toast(checkRes.msg || '请求失败')
								}
							} catch(err) {
								uni.$utils.toast(err.msg || '请求失败')
							}
						}
					},
					fail(err) {
							uni.showToast({icon: 'none', title: '无效二维码'});
					}
				});
			},
			add_bynumbercode() {
				this.$refs["add_confirm"]
					.open({
						title: "增加服务设备",
						width: "70%",
					})
					.then(() => {
						if(this.add_numbercode==''){
							uni.showToast({
								icon: 'none',
								title: '请输入设备编号！'
							});
						}else{
							this.add_xq(this.add_numbercode);
							this.add_numbercode = '';
						}
					})
					.catch(() => {
						uni.showToast({
							icon: 'none',
							title: '取消成功！'
						});
					});				
			},
			// 扫码新增设备
			add_by_scan(scanId,scanCode) {
				let that = this

				that.$refs["add_confirm"].open({
					title: "增加服务设备",
					width: "95%",
				}).then(() => {
					let params = {
						ids: that.add_eq,
						number: that.add_number,
						job_id: that.jobid,
						job_type: that.jobtype,
						scan_id: scanId,
						scan_code: scanCode,
					}
					that.$api.addEq(params).then(res=>{
						if(res.code != 200){
							uni.$utils.toast(res.msg)
							return false
						}

						uni.$utils.toast('增加成功')
						that.add_number = 1;
						this.page = 1
						
						that.optionEq()
						that.optionEqAdd()
						that.data_select()

						that.xz_all = [res.data.id]
						that.scan_code = ''
						that.ckxq()
					}).catch(err=>{
						uni.$utils.toast(err.msg)
						console.log(err)
					})
				}).catch(() => {});
			},
			// 新增设备
			add() {
				if(uni.getStorageSync('staffname') != uni.getStorageSync('main_staff'))
				{
					uni.showToast({
						title:'协助人员不能编辑',
						icon:'none'
					})
					return false
				}
				
				this.scan_code = ''
				this.$refs["add_confirm"]
					.open({
						title: "增加服务设备",
						width: "95%",
						position: "relative",
    					top: "1%",
					}).then(() => {
						let params = {
							ids: this.add_eq,
							number: this.add_number,
							job_id: this.jobid,
							job_type: this.jobtype,
							add_equipment_letter: this.add_equipment_letter,
							add_equipment_number: this.add_equipment_number,
							add_equipment_area: this.add_equipment_area,
							equipment_area_type: this.equipment_area_type,
						}
						
						this.$api.addEq(params).then(res=>{
							if (res.code == 200) {
								this.add_number = 1;
								this.page = 1
								this.optionEq()
								this.optionEqAdd()
								this.data_select()
								uni.$utils.toast('增加成功')
							}else{
								let content = res.msg.replace(/<br>/g,"\n")
								uni.showModal({  
								    title: '提示',  
								    content: content,  
								    showCancel: false  
								});
							}
						}).catch(err=>{
							console.log(err)
						})
					})
					.catch(() => {

					});
			},
			// 删除设备
			del() {
				
				if (this.xz_all == '') {
					uni.showToast({icon: 'none',title: '请选择设备'});
					return;
				}

				this.$refs["del_confirm"].open({
					title: "提示",
					message: "确认删除？",
					callback: ({
						action
					}) => {
						if (action == 'confirm') {
							let ids = this.xz_all.join(",")
							let params = {
								ids:ids
							}

							this.$api.delEq(params).then(res=>{
								if (res.code == 200) {
									this.xz_all = ''
									this.page = 1
									this.data_select()
									this.optionEq()
									uni.showToast({
										icon: 'none',
										title: '删除成功'
									});
								}
							}).catch(err=>{
								console.log(err)
							})
						}
					}
				});
			},
			// 筛选区域
			change_equipment(e) {
				this.page = 1
				this.total_page = 1
				this.equipment = e;
				uni.setStorageSync('equipment_' + this.jobid,e)
				this.data_select()
			},
			// 筛选设备
			change_area(e) {
				this.page = 1
				this.total_page = 1
				this.equipment_area = e;
				uni.setStorageSync('equipment_area_' + this.jobid,e)
				this.data_select()
			},
			deviceSelect(){
				this.$api.deviceSelect({}).then(res=>{
					this.deviceOption = res.data
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.cl-popup{
		    position: relative;
    top: 1%;
	}
	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px;
	}
	.device_area{
		color: #565252;
		font-size: 12px;
	}
	.scan {
		z-index: 9999;
		position: fixed;
		bottom: 20%;
		right: 15px
	}

	.del {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		left: 15px
	}

	.new_card {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
		margin: 10px 0px 0px 0px;

	}

	.new_card_title {
		border-bottom: 1px solid #e0dcdc;
		font-size: 18px;
		font-weight: bold;
		padding: 10px;
		height: 30px;
	}

	.xh {
		color: #007AFF;
		font-weight: bold;
		font-size: 20px;
		margin-right: 5px;
	}

	page {
		background-color: #FFFFFF;
	}

	.textarea {
		margin: 20px 10px;
		position: relative;
	}

	.more {
		position: absolute;
		right: 10rpx;
		bottom: 4rpx;
	}

	.lz {
		padding: 10px;
		border: 1px solid #eeeeee;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background: #fff;
		box-sizing: border-box;
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

	.bu {
		background-color: #fff;
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
		z-index: 99999;
	}

	.hzyl {
		background-color: #FFFFFF;
		color: #007AFF;
	}

	.ckxq {
		background-color: #007AFF;
		color: #FFFFFF;
		height: 50px;
	}

	.all {
		
		height: 100%;
		overflow: hidden;
	}
	.allo{
		padding: 10px;
		height: calc(45vh - 40rpx);
		/* overflow-y: auto; */
	}
	.xzadd .cl-checkbox--border {
		border-radius: 10rpx;
		padding: 14rpx 20rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		width: 97px;
		height: 50px;
		text-align: center;
		/* padding-top: 15px; */
		margin-top: 5px;
	}
	.cl-checkbox-group{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding-left: 6rpx;
	}
	.cl-checkbox-group .content_{
		
	}
	cl-checkbox {
		padding: 4px;
		margin-bottom: 20rpx;
	}

	.cl-checkbox--border {
		border-radius: 10rpx;
		padding: 14rpx 20rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		width: 110px;
		height: 80px;
		text-align: center;
		/* padding-top: 27px; */
		margin-top: 10px;
	}

	/* .cl-checkbox-group .content_ {
	    margin: 0 8rpx 12rpx 8rpx;
	} */
	.cl-checkbox+.cl-checkbox,
	cl-checkbox+cl-checkbox {
		margin-left: 0rpx;
	} 

	.cl-confirm {
		position: relative;
		z-index: 99999;
	}

	.cl-dialog__wrapper .cl-dialog__container {
		position: relative;
		padding: 20rpx 20rpx 30rpx 20rpx;
	}

	.cl-checkbox--border {
		border-radius: 10rpx;
		padding: 1rpx 9rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		width: 110px;
		height: 80px;
		text-align: center;
		/* padding-top: 27px; */
		margin-top: 10px;
	}

	.cl-checkbox {
		display: inline-block;
		line-height: 40rpx;
		font-size: 28rpx;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
		display: grid;
		place-items: center;
	}

	.xzadd .cl-checkbox--border {
		border-radius: 10rpx;
		padding: 14rpx 0rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		width: 97px;
		height: 50px;
		text-align: center;
		/* padding-top: 15px; */
		margin-top: 5px;
	}

	.cl-dialog__wrapper .cl-dialog__message {
		text-align: center;
		font-size: 32rpx;
		color: #606266;
		line-height: 40rpx;
	}

	.cl-dialog__wrapper .cl-dialog__title {
		font-size: 34rpx;
		font-weight: 500;
	}

	.cl-confirm__footer .cl-confirm__button {
		border: 0;
		border-radius: 0;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		position: relative;
		padding: 6rpx 0;
		font-size: 32rpx;
	}

	.eq_isnull_color {
		color: #12900a;
		font-weight: bold;
	}

	.cl-checkbox--border-is {
		border-radius: 10rpx;
		padding: 14rpx 20rpx;
		border: 1rpx solid #4CAF50;
		box-sizing: border-box;
		width: 110px;
		height: 80px;
		text-align: center;
		/* padding-top: 27px; */
		margin-top: 10px;
		color: #4CAF50;
	}
	.last_edit{
		margin-top: 20px;
		margin-left: 20px;
	}
	.loadingText{
		text-align: center;
		font-size: 24rpx;
		color: #666;
		padding: 10rpx 0;
	}
.allo cl-checkbox{
	padding: 4rpx 3rpx;
}
.cl-scroller__wrap{
	overflow-y: auto !important;
}
.more-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	
}
.more-item .cl-row{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
.more-item .item-l{
		width: 50%;
	}
.confirm_magin{
	margin: 3px;
}	
</style>



<style lang="scss">

.top{
            width:10px;
            height:10px;
            position: relative;
			left: 10px;
    		top: 9px;
        }
		.top::before{
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 10px;
			height: 10px;
			background: red;
			clip-path: polygon(0 0, 0 100%, 100% 100%);
			transform:rotate(135deg);
		}
		.top::after{
			content:'';
			position: absolute;
			top: 0;
			left: 50%;
			width: 2px;
			height: 18px;
			margin-left: -1px;
			background: red;
			background: red;
			// transform:rotate(45deg);
			z-index: 99;
		}
.down{
            width:10px;
            height:10px;
            position: relative;
			left: 10px;
    		top: 9px;
        }
		.down::before{
			content: '';
			position: absolute;
			top: 9px;
			left: 0;
			width: 10px;
			height: 10px;
			background: green;
			clip-path: polygon(0 0, 0 100%, 100% 100%);
			transform:rotate(316deg);
		}
		.down::after{
			content:'';
			position: absolute;
			top: 0;
			left: 50%;
			width:2px;
			height:18px;
			margin-left: -1px;
			background: green;
			// transform:rotate(45deg);
			z-index: 99;
		}
		
</style>