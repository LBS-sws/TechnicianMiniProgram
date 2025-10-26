<template>
	<view>
		<view class="container">
			<view class="uni-title">申请类型</view>
			<view class="uni-list">
				<radio-group @change="radioChange" style="display: flex;">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value" style="display: flex; margin-right: 20rpx;">
						<view>
							<radio :value="item.value" :checked="index === current"
							 :disabled="dis"/>
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<view class="h2">{{service.customer.name_zh}}</view>
			<view class="service_list">
				<view class="service_item service_type">{{service.service_type_info.service_name}}</view>
				<view class="service_item first_job">{{service.first_job}}</view>
			</view>
			<view class="other_info">
				<view class="item">
					时间：<text>{{service.job_date}} {{service.job_start_time}} - {{service.job_end_time}}</text>
				</view>
				<view class="item">
					地址：<text>{{service.addr}}</text>
				</view>
			</view>
			<view class="old_staff">
				当前技术员：<text class="staff_text">{{user_name}}</text>
			</view>
			
			<view v-if="type==1">
				<view style="font-size: 32rpx;">变更后日期：</view>
				<picker mode="date" :value="date" :start="startDate" :end="endDate" fields="day" @change="bindDateChange">
					<view class="uni-input-date">{{date}}</view>
				</picker>
			</view>
			
			<view class="new_staff"  v-if="type==2">
				<view style="font-size: 32rpx;">变更后技术：</view>
				<view class="uni-input-date" @click="show = true">
					
					<text v-if="staff_name">{{staff_name}}</text>
					<text v-else>请选择</text>
				</view>
			</view>

			<view class="content">
				<view class="title">原因：</view>
				<u-textarea v-model="content" :disabled="disabled">
				</u-textarea>
			</view>
			
			<view class="sub_rp">
				<view v-if="!item.id">
					<u-button type="primary" text="保存" :disabled="disabled" @click="submit"></u-button>
					
				</view>
				<view v-else>
					<u-button type="primary" text="保存" :disabled="disabled" @click="saveSubmit"></u-button>
				</view>
				
				<u-button type="info" text="发送审核" @click="pushSubmit"></u-button>
			</view>
			
			<!-- 搜索 -->
			<u-popup :show="show" @close="close" @open="open">
				<view class="staff_list" style="height: 400rpx; overflow-y: auto;">
					<input class="search_input" v-model.trim="key"
						placeholder="请输入关键词" 
						@input="inputFun"
						/>
				   <view class="staff_item" v-for="(item,i) in options" :class="item.id == staff_id ? 'cur':''"
				   @click="staffHandle(i)">
					   <view >{{item.name}}</view>
					   <view></view>
				   </view>
				</view>
			</u-popup>
			<!-- 搜索 -->
			
		</view>
		
		<!-- <web-view :src="webUrl" v-else></web-view> -->
	</view>
</template>

<script>
export const fuzzyQuery = (list, keyWord, attribute = 'name') => {
  const reg = new RegExp(keyWord)
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i])
    }
  }
  return arr
}
export default{
	data(){
		const now = new Date();
		const currentDate = this.getDate({
		    format: true
		})
		return{
			jobid:"",
			jobtype:"",
			hos:"",
			service:{},
			user_id:'',
			user_name:"",
			staff:'',
			content:"",
			disabled:false,
			options:[],
			webUrl:"https://v1.lbsapps.cn/order_staff.html",
			item:"",
			type:1,
			items: [
				{
                    value: 1,
                    name: '变更日期',
                    checked: 'true'
                },
                {
                    value: 2,
                    name: '变更人员'
                }
            ],
            current: 0,
			date: currentDate,
			demo:2,
			show: false,
			staff_id:'',
			staff_name:'',
			timer: null, // m自定义
			key: '',
			popList:[],
			dis:false
		}
	},
	onLoad(index) {
		if(index.jobid){
			this.jobid = index.jobid
			this.jobtype = index.jobtype
		}
		if(index.hos){
			this.hos = index.hos
		}
		if(index.id){
			this.item = { id:index.id}
		}
		console.log(index)
	},
	onShow() {
		
		//this.webUrl = this.webUrl + '?job_id='+ this.jobid + '&job_type=' + this.jobtype + '&token=' + token
		
		this.staffList()
		
		if(!this.item.id){
			this.detail()
		}else{
			this.staffInfo()
		}
	},
	watch: {
	    type: {
	        handler(newVal, oldVal) {
	            // console.log('myObject changed', newVal, oldVal);
				if(newVal != oldVal){
					// this.content = '';
					// this.staff = '';
				}
	        },
	         immediate: true,
				deep: true
	    }
	},
	computed:{
	    startDate() {
	        return this.getDate('start');
	    },
	    endDate() {
	        return this.getDate('end');
	    }
	},
	methods:{
		// 编辑
		saveSubmit(){
			console.log('编辑')
			let params = {
				id:this.item.id,
				type:this.type,
				new_job_date:this.date,
				new_staff_id:this.staff_id,
				content:this.content,
			}
			this.$api.staffEdit(params).then(res=>{
				console.log(res)
				if(res.code==200){
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}
			})
		},
		// 发送审核
		pushSubmit(){
			let params = {
				id:this.item.id
			}
			this.$api.staffAudit(params).then(res=>{
				
			})
		},
		onSearch() {
			if (this.key) {
				let result = fuzzyQuery(this.options, this.key, 'name')
				this.options = result
			}else {
				this.options = this.popList
			}
		},
		inputFun(e){
			this.clearTimer()
			if (e.detail.value) {
				
				this.timer = setTimeout(() => {
					this.onSearch()
				}, 500)
			}else{
				this.onSearch()
			}
		},
		clearTimer() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
		},
		// 选择技术员
		staffHandle(index){
			this.staff_id = this.options[index].id
			this.staff_name = this.options[index].name
			this.show = false
		},
		open() {},
        close() {
          this.show = false
        },
		//选择日期
		bindDateChange: function(e) { 
		    this.date = e.detail.value
		    console.log('date', this.date)
		},
		//年月日
		getDate(type) { 
		            const date = new Date();
		            // const date = new Date();
		            let year = date.getFullYear();
		            let month = date.getMonth() + 1;
		            let day = date.getDate();
		
		            if (type === 'start') {
		                year = year - 60;
		            } else if (type === 'end') {
		                year = year + 2;
		            }
		            month = month > 9 ? month : '0' + month;
		            day = day > 9 ? day : '0' + day;
		            return `${year}-${month}-${day}`;
		},
		radioChange: function(evt) {
			console.log(evt.detail.value)
			this.type = evt.detail.value
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].value === evt.detail.value) {
                    this.current = i;
                    break;
                }
            }
        },
		// 信息
		staffInfo(){
			let that= this
			
			let params = {
				id:this.item.id
			}
			this.$api.staffInfo(params).then(res=>{
				// console.log(res)
				if(res.data.id){
					
					this.type = res.data.type
					this.service = res.data
					
					this.user_name = res.data.staff.name
					
					this.content = res.data.content
					this.dis = true
					if(res.data.type == 1){
						// 日期
						this.current = 0
						this.date = res.data.new_job_date
					}else{
						// 技术员
						this.current = 1
						
						this.staff_name = res.data.staff_name
						console.log(res.data.content)
					}
				}
			})
		},
		submit(){
			if(this.type ==2 && !this.staff_id){
				uni.showToast({
					title:'请选择技术员',
					icon:'none'
				})
				return false
			}
			uni.showLoading({
				title:'提交中',
				icon:'none'
			})
			
			if(this.disabled == true){
				console.log('操作频繁')
				return false
			}
			
			let params = {
				type:this.type,
				job_id: this.jobid,
				job_type: this.jobtype,
				customer_id: this.service.customer_id,
				contract_id: this.service.contract_id,
				staff_id: uni.getStorageSync('user_id'),
				new_staff:  this.staff_id,
				job_date: this.service.job_date,
				new_job_date: this.date,
				content: this.content
			}
			// console.log(params)
			this.$api.staffAdd(params).then(res=>{
				this.disabled = true
				
				uni.showToast({
					title:res.msg,
					icon:'none'
				})
				if(res.data.id){
					this.item = res.data
					if(this.item.id){
						this.job_id = this.job_type = '';
						this.dis = true
					}
					this.staffInfo()
					
				}
				setTimeout(()=>{
					this.disabled = false
					
					uni.hideLoading()
				},1600)
				
			})
		},
		// 详情
		detail(){
			
			this.user_name = uni.getStorageSync('staffname');
			
			let params = {
				id: this.jobid,
				job_type: this.jobtype
			}
			this.$api.getOrderInfo(params).then(res=>{
				this.service = res.data
			})
		},
		// 技术员列表
		staffList(){
			let params = {}
			this.$api.staffList(params).then(res=>{
				this.options = res.data
				
				this.popList = JSON.parse(JSON.stringify(res.data))
			})
		}
		// ...
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
.container{
	padding: 50rpx 20rpx;
}
.h2 {
    font-size: 40rpx;
    font-weight: bold;
    position: relative;
    margin-bottom: 40rpx;
}
.service_list{
	display: flex;
    justify-content: flex-start;
    align-content: center;
    margin-bottom: 40rpx;
	.service_item{
		min-width: 220rpx;
		height: 54rpx;
	}
	.service_item  {
	    background-color: #c6ecc0;
	    color: #12900a;
	    border-radius: 16rpx;
	    text-align: center;
	    margin-right: 10rpx;
	    line-height: 54rpx;
	}
	.first_job {
	    background-color: #cbe8ff;
	    color: #0876f1;
	    border-radius: 16rpx;
	    text-align: center;
	    margin-right: 10rpx;
	    line-height: 54rpx;
	}
}
.other_info{
	.item{
		font-size: 30rpx;
		margin-bottom: 10rpx;
		text{
			
		}
	}
}
.old_staff {
    background: #fff;
    font-size: 16px;
    color: #777;
    margin-bottom: 10px;
}
.sub_rp{
	position: absolute;
	bottom: 30rpx;
	left: 0;
	width: 100%;
	padding: 10rpx 10rpx;
	box-sizing: border-box;
}
.content{
	.title{
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
		padding-top: 10rpx;
		font-weight: 600;
	}
}
.uni-title{
	font-size: 36rpx;
	font-weight: 600;
	margin-bottom: 20rpx;
}
.uni-list{
	margin-bottom: 20rpx;
}
.uni-input-date{
	border: 1rpx solid #e6dede;
    width: auto;
    padding: 5rpx 10rpx;
    border-radius: 10rpx;
	margin: 10rpx 0;
}
.staff_list{
	padding: 10rpx 10rpx;
	.staff_item{
		margin-bottom: 10rpx;
		padding: 10rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
		color: #333;
	}
	.staff_item.cur{
		font-weight: 600;
		color: #12900a;
	}
}
.search_input{
	border: 1rpx solid #eee;
	border-radius: 12rpx;
	height: 60rpx;
	line-height: 60rpx;
	padding-left: 20rpx;
	font-size: 28rpx;
}
</style>
