<template>
	<view class="content" style="margin-bottom: 40px;">
		<cl-confirm ref="del_confirm"> </cl-confirm>
		<block v-for="(item,i) in data" :key="i">
			<view class="service">
				<view class="service_title">风险评估项目<span class="jh">*</span></view>
				<view class="service_content">
					{{i+1}}、{{item.title}}
				</view>
			</view>
			<view class="service">
				<view style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
					<view class="service_title">是否符合要求<span class="jh" >*</span></view>
					<view>
						<cl-select v-model="data[i].is_conform" :options="columns" placeholder="请选择"></cl-select>
					</view>
				</view>
			</view>
			<view class="service">
				<view class="service_title">备注说明</view>
				<view class="service_content">
					<cl-textarea rows="13" cols="40" placeholder="请输入" v-model="data[i].remarks" count></cl-textarea>
				</view>
			</view>
			<view>
				<upload :photos="data[i].photos" :current="i" @imageEdit="imageEdit"></upload>
			</view>
		</block>
		<view style="width: 100%; height: 100rpx;"></view>
		<view class="bu" @tap="submit()">
			保存
		</view>
	</view>
</template>

<script>
import newUpload from '@/components/new-upload/new-upload.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
import upload from '@/components/upload/upload.vue';
export default {
	components: {
		newUpload,
		ldSelect,
		upload
	},
	data() {
		return {
			name:'风险评估 - 问题列表',
			
			jobid:'',
			jobtype:'',
			data:[],
			show: false,
            columns: [
                {
                    label: '是',
                    value:1
                }, {
                    label: '否',
                    value:0
                }
            ],
			index:'',
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
		this.c_id = index.id
		this.list()
	},
		methods: {
			imageEdit(val){
				// console.log('return:',val)
				this.data[val.index].photos = val.imgArr
			},
			// 回调参数为包含columnIndex、value、values
			confirm(e) {
                console.log('confirm', e)
                this.show = false
			},
			list() {
				let params = {
					id:this.jobid,
					c_id:this.c_id
				}
				this.$api.getRiskProblemList(params).then(res=>{
					// console.log(res)
					if(res.code==200){
						this.data = res.data
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 新增
			submit() {
				let data = []
				this.data.forEach((item,i)=>{
					data.push({id: item.id, is_conform: item.is_conform, remarks: item.remarks, photos: item.photos})
				})
				
				let params = {
					data:this.data
				}
				this.$api.editRiskAssessment(params).then(res=>{
					if (res.code == 200) {
						if (res.data) {
							uni.hideLoading();
							uni.$utils.toast("保存成功")

							setTimeout(() => {
								this.list()
								uni.navigateTo({
									url:'/pages/service/risk_assessment?jobid='+this.jobid+'&jobtype=' + this.jobtype
								})
							}, 2000)
						}
					}
					if(res.code == 400){
						uni.$utils.toast(res.msg)
						return false
					}
				}).catch(err=>{
					uni.showToast({
						icon: 'error',
						title: err.errMsg
					});
					setTimeout(function() {
						uni.hideLoading();
					}, 2000);
				})

			},
			//...
		},
}
</script>

<style lang="scss">
.item-ui{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 30rpx;
	.label{
		min-width: 284rpx;
		height: 42rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 32rpx;
		.rq{
			position: relative;
		}
		.rq::after{
			content:'*';
			width: 10rpx;
			height: 10rpx;
			position: absolute;
			top: 50%;
			right: -20rpx;
			color: red;
			margin-top: -15rpx;
		}
	}
	.input-ui{
		border: 1rpx solid #eee; width: 200rpx; margin-left: 20rpx;
		height: 70rpx;
		line-height: 70rpx;
		width: 320rpx;
		padding-left: 20rpx;
	}
}
	.content {
		/* padding: 0 21rpx; */
		margin-top: 21rpx;
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
		font-size: 15px;
		float: right;
		position: relative;
		top: 1px;
	}

	.new_card_content {
		margin: 10px;
		font-size: 16px;
		color: #7b7070;
		padding-bottom: 42px;
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

	.cl-select picker {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 17px;
	}

	.cl-checkbox {
		display: inline-block;
		line-height: 40rpx;
		font-size: 31rpx;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	.cl-radio {
		display: inline-block;
		line-height: 40rpx;
		font-size: 31rpx;
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

	.new_card_content {
		margin: 8px 0px;
		font-size: 17px;
	}

	// 自定义上传样式
	

.cl-input.is-border {
	border: 1rpx solid #dcdfe6;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
</style>