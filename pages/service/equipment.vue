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
			<!-- <view class="confirm_magin">
				<cl-row style="color: #000000;width: 60%;margin: 0 auto;" class="more-item">
					<view style="width: 36%;text-align: left;">编号</view>
					<view>
						<cl-input v-model="add_equipment_number" style="text-align: left;">
							<text slot="append" style="margin-top: 3px;font-size: 16px;"></text>
						</cl-input>
					</view>
				</cl-row>
				<cl-row style="color: #000000;width: 60%;margin: 0 auto;" class="more-item">
					<view style="width: 36%;text-align: left;">区域</view>
					<view>
						<cl-input v-model="add_equipment_area" style="text-align: left;">
							<text slot="append" style="margin-top: 3px;font-size: 16px;"></text>
						</cl-input>
					</view>
				</cl-row>
			</view> -->
			<view class="confirm_magin">
				增加数量：
				<cl-input-number v-if="!scan_code" v-model="add_number"  :max="100000" :min="1" input="true" style="margin-left: 10px;"
				@change="numChange"></cl-input-number>
				<cl-input-number v-else v-model="add_number":max="1" :min="1" input="true" readonly="true" disabled></cl-input-number>
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
		<view class="all jjBtn">
			<cl-checkbox-group v-model="xz_all" border >
				<cl-checkbox v-for="(item,index) in all" :key="index" v-bind:label="item.id" :class="'content_' + item.id" >
					<view v-if="item.choose > 0" class="eq_isnull_color" >
						{{item.number}}&nbsp;{{item.label}}
					</view>
					<view v-else>
						{{item.number}}&nbsp;{{item.label}}
					</view>
				</cl-checkbox>
			</cl-checkbox-group>
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
				xz_all: "",
				all: [],
				tablename: "equipments",
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				add_all: '',
				add_eq: '',
				// add_equipment_number: '',
				// add_equipment_area: '',
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
				loadingText:""
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
		},
		onReady(){
			this.but()
		},
		//	上拉触底函数
		onReachBottom(){
			console.log('触发')
			
		  //    if(this.isLoadMore){  //此处判断，上锁，防止重复请求
				// if(this.total< this.limit * this.page){
				// 	this.loading = false
				// }else{
				// 	this.loading = true
				// 	this.isLoadMore = true
				// 	this.page+=1
				// 	this.data_select()
				// }
		        
		  //    }
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
						if (res.data) {
							let all = res.data
							all.forEach((item,i)=>{
								item.label = item.equipment_name
								item.value = item.equipment_number
								item.eq_number = item.equipment_number
							})
							this.all = all
						}
					}
					if(res.code == 400){
						uni.$utils.toast(res.msg)
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			hzyl() {
				uni.navigateTo({
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
					
					uni.redirectTo({
						url: "/pages/service/scan_equipment?jobid="+this.jobid + '&jobtype='+this.jobtype +'&id='+ids
					})
				}
			},
			scanCode() {
				let that = this
				that.scan_code = ''

				uni.scanCode({
					success: async (res) => {
						if(res.result==''){
							uni.showToast({icon: 'none',title: '无效二维码'});
							return false;
						}
						let queryString = res.result.split('?')[1];
						if (!queryString) {
							uni.showToast({icon: 'none',title: '无效二维码!'});
							return false;
						}

						let queryParams = new URLSearchParams(queryString);
						if(!queryParams.get('id') || !queryParams.get('city') || !queryParams.get('office_id')){
							uni.showToast({icon: 'none',title: '无效的二维码！'});
							return false;
						}
						// else if(queryParams.get('city') != uni.getStorageSync('city')){
						// 	uni.showToast({icon: 'none',title: '非本地区二维码！'});
						// 	return false;
						// }

						let scan_id = Base64.decode(queryParams.get('id'))//base64 decode
						
						that.xz_all = [] // 清空选中项
						//遍历当前设备
						that.all.forEach(item=>{
							if(item.qrcode_id!=null && item.qrcode_id == scan_id){
								that.xz_all = [item.id]
							}
						})

						//跳转
						if(that.xz_all.length <= 0){//没有设备，添加
							that.scan_code = res.result
							that.add_by_scan(queryParams.get('id'),res.result);
						}else{//查看对应设备详情
							let ids = that.xz_all.join(",")

							uni.redirectTo({
								url: "/pages/service/scan_equipment?jobid="+that.jobid + '&jobtype='+that.jobtype +'&id='+ids
							})
						}
					},fail(err){
						uni.showToast({icon: 'none',title: '无效二维码'});
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
				this.scan_code = ''
				this.$refs["add_confirm"]
					.open({
						title: "增加服务设备",
						width: "95%",
					})
					.then(() => {
						let params = {
							ids: this.add_eq,
							number: this.add_number,
							job_id: this.jobid,
							job_type: this.jobtype,
							// add_equipment_number: this.add_equipment_number,
							// add_equipment_area: this.add_equipment_area,
						}
						this.$api.addEq(params).then(res=>{
							if (res.code == 200) {
								this.add_number = 1;
								this.optionEq()
								this.optionEqAdd()
								this.data_select()
								uni.$utils.toast('增加成功')
							}else{
								uni.showToast({
									icon: 'none',
									title: res.msg
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
				console.log(e)
				this.equipment = e;
				uni.setStorageSync('equipment_' + this.jobid,e)
				this.data_select()
			},
			// 筛选设备
			change_area(e) {
				console.log(e)
				this.equipment_area = e;
				uni.setStorageSync('equipment_area_' + this.jobid,e)
				this.data_select()
			},
			//...
		}
	}
</script>

<style>
	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px;
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
		padding-top: 15px;
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
		padding-top: 27px;
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
.allo cl-checkbox{
	padding: 4rpx 3rpx;
}
.cl-scroller__wrap{
	overflow-y: auto !important;
}
/* .more-item{
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
}	 */
</style>
