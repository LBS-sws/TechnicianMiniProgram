<template>
	<view class="content">
		<view class="service">
			<view class="service_title">风险问题描述<span class="jh">*</span></view>
			<!-- <view class="lz">
				<cl-row>
					<ld-select :multiple="true" :list="contentData" @inputFun="inputFun" label-key="label"
						value-key="value" placeholder="示例" clearable v-model="service_content"
						@change="selectChange"></ld-select>
				</cl-row>
			</view> -->
			<cl-textarea rows="13" cols="40" maxlength="500" placeholder="请输入" v-model="risk_desc" count></cl-textarea>
		</view>
		<view class="service">
			<view class="service_title">门店建议措施<span class="jh">*</span></view>
			<view class="lz">
				<cl-row>
					<ld-select :multiple="true" :list="proposalData" @inputFun="inputFunx" label-key="label"
						value-key="value" placeholder="示例" clearable v-model="service_proposal"
						@change="selectChange1"></ld-select>
				</cl-row>
			</view>
			<cl-textarea rows="13" cols="40" maxlength="500" placeholder="请输入" v-model="store_coordinate" count>
			</cl-textarea>
		</view>
		<view class="service">
			<view class="service_title">本次行动方案<span class="jh">*</span></view>
			<view class="lz">
				<cl-row>
					<ld-select :multiple="true" :list="contentData" @inputFun="inputFun" label-key="label"
						value-key="value" placeholder="示例" clearable v-model="service_content"
						@change="selectChange"></ld-select>
				</cl-row>
			</view>
			<cl-textarea rows="13" cols="40" maxlength="500" placeholder="请输入" v-model="ms_action" count></cl-textarea>
		</view>
		<view style="width: 100%; height: 200rpx;"></view>
		<view class="bu" @tap="save()">
			保存
		</view>
	</view>
</template>
<script>
import ldSelect from '@/components/ld-select/ld-select.vue'
export default {
	components: {
			ldSelect
	},
	data() {
		return {
			name:'勘察总结',
			jobid: '',
			risk_desc:'',
			store_coordinate: '',
			ms_action: ''
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
		this.data_select()
	},
	methods: {
			
		// 勘查总结信息
		data_select() {
			let params = {
					id:this.jobid,
			}
			this.$api.getSummaryInfo(params).then(res=>{
				// console.log(res)
				if(res.code==200){
					this.ms_action = res.data.ms_action
					this.risk_desc = res.data.risk_desc
					this.store_coordinate = res.data.store_coordinate
				}
			}).catch(err=>{
				console.log(err)
			})
		},
		// 添加/编辑勘查总结
		save() {
			if (this.service_content == '') {
				uni.showToast({
						title: '信息填写不全',
						icon: 'none',
				});
				return;
			} else {
				uni.showLoading({
					title: "保存中..."
				});
					
				let params = {
					id: this.jobid,
					risk_desc: this.risk_desc,
					store_coordinate: this.store_coordinate,
					ms_action: this.ms_action
				}
				this.$api.editSummary(params).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					setTimeout(()=>{
						uni.navigateBack({
						  delta: 1,
						  animationType: 'pop-out',
						  animationDuration: 200
						})
					},1500)
				}).catch(err=>{
					console.log(err)
				})
			}
		},
	},
}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	.textarea {
		margin: 20px 10px;
		position: relative;
	}

	.cl-textarea textarea {
		font-size: 32rpx;
		width: 100%;
		box-sizing: border-box;
		font-size: 32rpx;
	}

	.more {
		position: absolute;
		right: 10rpx;
		bottom: 4rpx;
	}

	.lz {
		margin: 10px 0px;
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
	/* new */
	.content{
		padding: 10px;
	}
	.service{
		padding-bottom: 15px;
	}
	.jh {
		color: red;
		margin-left: 5px;
	}
	.service_title{
		    /* color: #03A9F4; */
		    font-size: 16px;
		    font-weight: bold;
	}
	.text-green.data-v-2ee6bce8 {
	    color: #12900a;
	}
</style>
