<template>
	<view class="content" style="padding-top: 80rpx; padding-bottom: 120rpx;">
		<!-- 添加 -->
		<view class="add" @tap="add()">
			<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<!-- <view class="scan" @tap="scanCode()">
			<cl-icon name="cl-icon-scan" color="#007AFF" :size="80"></cl-icon>
		</view>
		<cl-confirm ref="add_confirm" style="z-index: 99999;">
			<cl-input v-model="add_numbercode" placeholder="设备编号"></cl-input>
		</cl-confirm> -->
		<cl-confirm ref="add_confirm" style="z-index: 99999;">
			<cl-scroller>
				<view class="all xzadd">
					<cl-checkbox-group v-model="add_eq" border>
						<cl-checkbox v-for="(item,index) in add_all" :key="index" v-bind:label="item.id">
							{{item.name}}
						</cl-checkbox>
					</cl-checkbox-group>
				</view>
			</cl-scroller>
			增加数量：<cl-input-number v-model="add_number" style="margin-left: 10px;"></cl-input-number>
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
		<view class="all jjBtn">
			<cl-checkbox-group v-model="xz_all" border >
				
				<!-- <cl-checkbox v-for="(item,index) in all" :key="index" v-bind:label="item.value" :class="'content_' + item.value" > -->
				<cl-checkbox v-for="(item,index) in all" :key="index" v-bind:label="item.id" :class="'content_' + item.value" >
					<!-- <view v-if="item.check_datas!=null" class="eq_isnull_color" > -->
					<view v-if="item.choose > 0" class="eq_isnull_color" >
						<span v-if="ct>0">
							{{item.eq_number}}
						</span>
						<span v-if="item.number<9">
							0{{item.number}}
						</span>
						<span v-else>
							{{item.number}}
						</span>
						&nbsp;{{item.label}}
					</view>
					<view v-else>
						<span v-if="ct>0">
							{{item.eq_number}}
						</span>
						
						<span v-if="item.number<9">
							0{{item.number}}
						</span>
						<span v-else>
							{{item.number}}
						</span>
						&nbsp;{{item.label}}
					</view>
					<!-- <view class="eq_isnull_color" >
						<span>{{item.label}}</span>
					</view> -->
				</cl-checkbox>
			</cl-checkbox-group>
		</view>
		<view style="display: block; text-align: center;" v-if="loading">
			<cl-loading></cl-loading>
		</view>
		<view v-else class="loadingText">没有数据啦!</view>
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
	export default {
		data() {
			return {
				name:'设备情况',
				equipment_area_lists: [],
				equipment_area: "",
				equipment: "",
				equipment_lists: [],
				xz_all: "",
				all: [],
				tablename: "equipments",
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				add_all: '',
				add_eq: '',
				add_number: 1,
				scan_code:'',
				add_numbercode:'',
				ct:0,
				content_scole:1360343,
				page: 1,		// 当前页 m
				limit: 21,		// 每页多少条 m
				total:'',		// 总条数
				loading:false,
				isLoadMore:true,
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
			
			this.optionEq()		// 筛选1
			this.data_select()  // 列表
			this.optionEqAdd()	// 添加设备选项
		},
		onReady(){
			this.but()
		},
		//	上拉触底函数
		onReachBottom(){
			console.log('触发')
			
		     if(this.isLoadMore){  //此处判断，上锁，防止重复请求
				if(this.total< this.limit * this.page){
					this.loading = false
				}else{
					this.loading = true
					this.isLoadMore = true
					this.page+=1
					this.data_select()
				}
		        
		     }
		},
		methods: {
			optionEqAdd(){
				let param = {}
				uni.request({
					url: `${this.$baseUrl}/Equipment.Equipment/optionEqAdd?job_type=` + this.jobtype + "&job_id=" + this.jobid,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: param,
					success: (res) => {
						// console.log(res.data.data)
						if (res.data.code == 200) {
							this.add_all = res.data.data
						}
						// 其它状态
						this.checkCode(res.data.code,res.data.msg)
					},
					fail: (err) => {
						// console.log(res);
					}
				})
			},
			// 筛选 所有区域 所有设备
			optionEq(){
				let param = {}
				
				uni.request({
					url: `${this.$baseUrl}/Equipment.Equipment/optionEq?job_type=` + this.jobtype + "&job_id=" + this.jobid,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: param,
					success: (res) => {
						// console.log(res.data.data)
						if (res.data.code == 200) {
							// 区域
							if (res.data.data.optionArea.length>0) {
								let Area = res.data.data.optionArea
								let AreaList = []
								Area.forEach((item,i)=>{
									AreaList.push({label:item.equipment_area,value:item.equipment_area})
								})
								AreaList.unshift({ label: '全部区域', value: '' })
								this.equipment_area_lists = AreaList
							}
							if(res.data.data.optionEq.length>0){
								// 设备
								let eq = res.data.data.optionEq
								let EqList = []
								eq.forEach((item,i)=>{
									EqList.push({label:item.equipment_name,value:item.equipment_type_id})
								})
								EqList.unshift({ label: '全部设备', value: '' })
								this.equipment_lists = EqList
							}
						}
						// 其它状态
						this.checkCode(res.data.code,res.data.msg)
					},
					fail: (err) => {
						// console.log(res);
					}
				})
			},
			but(){
				var sbStr = uni.getStorageSync('last_id_' + this.jobid)
				if(sbStr != false){
					console.log(11111111)
					var jd = sbStr.split(',')
					console.log(sbStr)
					// console.log(jd[jd.length-1])
					var md = '.content_' + jd[jd.length-1] //this.content_scole
					console.log(222222222)
					 setTimeout(()=>{
						 var view = uni.createSelectorQuery().select(md);
						 view.boundingClientRect(data => {
							 console.log(3333333)
							 console.log(data)
						 uni.pageScrollTo({
						 duration: 300,//过渡时间
						 scrollTop:data.top,//到达距离顶部的top值
							})
						 }).exec();
					 },500)
				}else{
					console.log('未找到上次锚点')
				}
			},
			// 设备列表
			data_select() {
				
				let param = {
					job_type:this.jobtype,
					job_id:this.jobid,
					equipment_area:this.equipment_area,
					equipment_type_id:this.equipment,
					page:this.page,
					limit:this.limit
				}
				uni.request({
					url: `${this.$baseUrl}/Equipment.Equipment/list`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: param,
					success: (res) => {
						console.log(res.data.data)
						if (res.data.code == 200) {
							if (res.data.data) {
							
								// let all = res.data.data.data
								// all.forEach((item,i)=>{
								// 	item.label = item.equipment_name
								// 	item.value = item.equipment_number
								// 	item.eq_number = item.equipment_number
								// })
								// this.all = all
								
								this.total = res.data.data.data.total	// 总数
								
								let all = res.data.data.data
								all.forEach((item,i)=>{
									item.label = item.equipment_name
									item.value = item.equipment_number
									item.eq_number = item.equipment_number
								})
								this.all = this.all.concat(all)
								if(all.length==0 && this.all.length>0)
								{
									// uni.$utils.toast('没有更多数据啦','none',1500)
								}
								
								this.isLoadMore=false				
								setTimeout(()=>{
									this.isLoadMore = true
									this.loading = false
								},1000)
							
							}
							// this.beforupload();
						}
						
					},
					fail: (err) => {
						// console.log(res);
					}
				})
			},
			beforupload(){
				
						let all = this.all.filter((item,index)=>{
							return item.check_datas==null
						})
						
						// console.log('all.length',all.length)
						if(all.length>0){
							var ms = all.length+'台设备无数据，确认返回？'
							// console.log('all.length',all)
							wx.enableAlertBeforeUnload({
								message:ms,
								success:(e) =>{
									// console.log(e);
								},
								fail:(e)=>{
									// console.log(e)
								}
							})
						}else{
							wx.disableAlertBeforeUnload();
						}
						
					},
			hzyl() {
				uni.navigateTo({
					// url: "/pages/service/equipment_hz?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
					// 	'&shortcut_type=' + this.shortcut_type + '&service_type=' + this.service_type
					url: "/pages/service/equipment_hz?jobid=" + this.jobid + '&jobtype=' + this.jobtype
				})
			},
			// 查看详情
			ckxq() {
				if (this.xz_all == '') { // 撤销单选  || this.xz_all.length > 1
					uni.showToast({
						icon: 'none',
						title: '请选择一台设备'
					});
					return;
				} else {
					let ids = this.xz_all.join(",")
					// console.log(ids)
					// return false
					let url = `${this.$baseUrl}/Equipment.Equipment/getEqInfo?job_type=` + this.jobtype + "&job_id=" + this.jobid + "&ids=" + ids;
					let param = {}
					uni.request({
						url:url,
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'token': uni.getStorageSync('token')
						},
						method: 'GET',
						data: param,
						success: (res) => {
							if (res.data.code == 400) {
								uni.showToast({
									icon: 'none',
									title: res.data.msg
								})
								return ;
							}
							if(res.data.code == 200){
								// uni.redirectTo({
								// 	url: "/pages/service/scan_equipment?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
								// 		'&shortcut_type=' + this.shortcut_type + '&service_type=' + this.service_type +
								// 		'&id=' + this.xz_all +'&ct=' + this.ct
								// })
								uni.redirectTo({
									url: "/pages/service/scan_equipment?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
										'&id=' + ids
								})
							}
						},
						fail: (err) => {
							// console.log(err);
						}
					})
				}
			},
			scanCode() {
				uni.scanCode({
					success: async (res) => {
						if(res.result!=''){
							this.scan_code = res.result
							this.add_xq(res.result);
						}else{
							uni.showToast({
								icon: 'none',
								title: '扫码错误！'
							});
						}
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
			add_xq(numcode){
				let param = {
					staffid: uni.getStorageSync('staffid'),
					city: uni.getStorageSync('city'),
					scan_code: numcode,
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
							uni.redirectTo({
								url: "/pages/service/scan_equipment?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
									'&shortcut_type=' + this.shortcut_type + '&service_type=' + this.service_type +
									'&id=' + res.data.data
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
				
					},
					fail: (err) => {
						// console.log(res);
					}
				})
			},
			// 新增设备
			add() {
				
				this.$refs["add_confirm"]
					.open({
						title: "增加服务设备",
						width: "95%",
					})
					.then(() => {
						
						let param = {
							ids: this.add_eq,
							number: this.add_number,
							job_id: this.jobid,
							job_type: this.jobtype,
						}
						uni.request({
							url: `${this.$baseUrl}/Equipment.Equipment/addEq`,
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								'token': uni.getStorageSync('token')
							},
							method: 'POST',
							data: param,
							success: (res) => {
								if (res.data.code == 200) {
									this.add_number = 1;
									this.optionEq()
									this.optionEqAdd()
									this.data_select()
									
									uni.showToast({
										icon: 'none',
										title: '增加成功'
									});
								}
								// 其它状态
								this.checkCode(res.data.code,res.data.msg)
							},
							fail: (err) => {
								// console.log(res);
							}
						})
					})
					.catch(() => {

					});
			},
			// 删除设备
			del() {
				// console.log(this.xz_all)
				this.$refs["del_confirm"].open({
					title: "提示",
					message: "确认删除？",
					callback: ({
						action
					}) => {
						if (action == 'confirm') {
							if (this.xz_all == '') {
								uni.showToast({
									icon: 'none',
									title: '请选择设备'
								});
								return;
							} else {
								let ids = this.xz_all.join(",")
								// console.log(ids)
								
								let param = {}
								uni.request({
									url: `${this.$baseUrl}/Equipment.Equipment/delEq?ids=` + ids,
									header: {
										'content-type': 'application/x-www-form-urlencoded',
										'token': uni.getStorageSync('token')
									},
									method: 'DELETE',
									data: param,
									success: (res) => {
										if (res.data.code == 200) {
											this.xz_all = ''
											this.data_select()
											uni.showToast({
												icon: 'none',
												title: '删除成功'
											});
										}
										
									},
									fail: (err) => {
										// console.log(res);
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
			// 筛选区域
			change_equipment(e) {
				console.log(e)
				this.equipment = e;
				this.data_select()
			},
			// 筛选设备
			change_area(e) {
				console.log(e)
				this.equipment_area = e;
				this.data_select()
			},
			beforupload(){
				let all = this.all.filter((item,index)=>{
					return item.check_datas==null
				})
				// console.log('all.length',all.length)
				if(all.length>0){
					var ms = all.length+'台设备无数据，确认返回？'
					// console.log('all.length',all)
					wx.enableAlertBeforeUnload({
						message:ms,
						success:(e) =>{
							// console.log(e);
						},
						fail:(e)=>{
							// console.log(e)
						}
					})
				}else{
					wx.disableAlertBeforeUnload();
				}
				
			}
		}
	}
</script>

<style>
	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
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
		padding: 10px;
		height: 100%;
		overflow: hidden;
	}

	.xzadd .cl-checkbox--border {
		border-radius: 10rpx;
		padding: 14rpx 20rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		width: 97px;
		height: 50px;
		text-align: center;
		padding-top: 15px;
		margin-top: 5px;
	}
	.cl-checkbox-group{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.cl-checkbox-group .content_{
		
	}
/* 	cl-checkbox {
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
		padding-top: 27px;
		margin-top: 10px;
	}
*/
	.cl-checkbox-group .content_ {
	    margin: 0 8rpx 12rpx 8rpx;
	}
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
		padding-top: 27px;
		margin-top: 10px;
	}

	.cl-checkbox {
		display: inline-block;
		line-height: 40rpx;
		font-size: 28rpx;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	.xzadd .cl-checkbox--border {
		border-radius: 10rpx;
		padding: 14rpx 0rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		width: 97px;
		height: 50px;
		text-align: center;
		padding-top: 15px;
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
		padding-top: 27px;
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
</style>
