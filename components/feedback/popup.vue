<template>
	<view>
		<uni-popup ref="popup">
			<view class="popup-model" >
				<view class="propcom">
					<view class="tophead">
						门店异常反馈
						<view class="close" @click="close"><image src="../../static/images/close_icon.png" mode="widthFix" class="close-img"></image></view>
					</view>
					<view class="prop-content" style="padding: 10px 10px;">
						<view class="item-list">
							<view class="service_title">问题类型<span class="jh">*</span>：</view>
							<view>
								<cl-select v-model="problem_type" :options="ServiceTypeData" disabled></cl-select>
							</view>
						</view>
						<view class="item-list">
							<view class="service_title">是否异常反馈<span class="jh">*</span>：</view>
							<view>
								<cl-select v-model="abnormal_type" :options="TypeData"></cl-select>
							</view>
						</view>
						
						<view class="service">
							<view class="service_title">反馈内容<span class="jh">*</span></view>
							<view class="lz"></view>
							<cl-textarea rows="13" cols="40" maxlength="500" placeholder="请输入" v-model="content" count></cl-textarea>
						</view>
						
						<view class="item-list">
							<view class="service_title">申请人<span class="jh">*</span>：</view>
							<view>
								<cl-select v-model="userVal" :options="staffData"></cl-select>
								
							</view>
						</view>
						<view class="sub-btn">
							<u-button type="primary" @click="submitForm">提交</u-button>
						</view>
					</view>
					
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker.vue'; // 根据实际路径引入
export default{
	props:{
		
		ServiceTypeData:{
			type:[String,Array],
			default:''
		},
		TypeData:{
			type:[String,Array],
			default:''
		},
		staffData:{
			type:[String,Array],
			default:''
		},
		jobId:{
			type:[Number],
			default:''
		},
		jobType:{
			type:[Number],
			default:''
		},
		
	},
	components: {
	    DateTimePicker
	},
	data(){
		const now = new Date();
		return{
			problem_type:1,
			abnormal_type:'',
			userData:[],
			userVal:'',
			content:'',
			
		}
	},
	created() {
		 
	},
	methods:{
		 submitForm() {
		  if(this.content=='' || this.content ==null){
		  			  uni.showToast({
		  			  	title: '请输入反馈内容',
		  			  	icon: 'none'
		  			  })
		  			  return false
		  }
		  // return false
		  // 提交逻辑
		  let params = {
		  	job_id: this.jobId,
		  	job_type: this.jobType,
			service_type:this.problem_type,
			is_abnormal:this.abnormal_type,
		
			content:this.content,
			user_id:this.userVal
		  }
		  
		  this.$emit('propUpdateJobDate',params);
			
		},
		show(){
			this.$refs.popup.open('center')
		},
		close(){
			this.$refs.popup.close()
		},
		//
		
	}
}
</script>

<style lang="scss">

.popup-model{
	position: relative;
	top: -30px;
	width: 700upx;
	
	background: #fff;
	border-radius: 20upx;
	z-index: 10;
	padding-bottom: 60upx;
}
.item-list{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.jh{
	color: #ed6942;
}
.propcom{
	position: relative;
	height: 100%;
	.tophead{
		position: relative;
		font-size: 34rpx;
		text-align: center;
		padding: 50rpx 0 18rpx 0;
		.close{
			position: absolute;
			top: 26rpx;
			right:32rpx;
			.close-img{
				width: 36rpx;
				height: 36rpx;
			}
		}
		
	}
	.content{
		padding: 0 44rpx 30rpx 44rpx;
		font-size: 32rpx;
		color: #666;
		
	}
}
.service_title{
	font-size: 30rpx;
	font-weight: 600;
}
.sub-btn{
	padding-top: 10rpx;
}
</style>