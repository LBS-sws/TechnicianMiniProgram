<template>
	<view class="content">
		<view class="service">
			<view class="service_title">服务内容<span class="jh">*</span></view>
			<view class="lz">
				<cl-row>
					<ld-select :multiple="true" :list="contentData" @inputFun="inputFun" label-key="label"
						value-key="value" placeholder="示例" clearable v-model="service_content"
						@change="selectChange"></ld-select>
				</cl-row>
			</view>
			<cl-textarea rows="13" cols="40" maxlength="500" placeholder="请输入" v-model="service_content" count></cl-textarea>
		</view>
		<view class="service">
			<view class="service_title">跟进建议</view>
			<view class="lz">
				<cl-row>
					<ld-select :multiple="true" :list="proposalData" @inputFun="inputFunx" label-key="label"
						value-key="value" placeholder="示例" clearable v-model="service_proposal"
						@change="selectChange1"></ld-select>

				</cl-row>
			</view>
			<cl-textarea rows="13" cols="40" maxlength="500" placeholder="请输入" v-model="service_proposal" count>
			</cl-textarea>
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
import ldSelect from '@/components/ld-select/ld-select.vue'
export default {
		components: {
			ldSelect
		},
		data() {
			return {
				name:'服务简报',
				service_content: [],
				service_proposal: [],
				tablename: "briefings",
				jobid: '',
				jobtype: '',
				search_key: '',
				timer: null,
				len: false,
				contentData:[],			// 服务内容
				proposalData:[],		// 跟进建议
				contentDataOld:[],		// 服务内容 - 旧
				proposalDataOld:[]		// 跟进建议 - 旧
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
			
			this.data_select()
		},
		methods: {
			inputFun(data) {
				this.search_key = data.value;
				this.clearTimer()
				if (this.search_key && this.search_key.length > 0) {
					
					this.timer = setTimeout(() => {
						let result = fuzzyQuery(this.contentData, this.search_key, 'value') // 数组、搜索值、字段
						this.contentData = result
					}, 500)
					
				} else {
					// 恢复原来值
					this.contentData = this.contentDataOld
				}
			},
			inputFunx(data) {
				// console.log(data.value)
				this.search_key = data.value;
				this.clearTimer()
				if (this.search_key && this.search_key.length > 0) {
					
					this.timer = setTimeout(() => {
						let result = fuzzyQuery(this.proposalData, this.search_key, 'value') // 数组、搜索值、字段
						this.proposalData= result
					}, 500)
					
				} else {
					// 恢复原来值
					this.proposalData = this.proposalDataOld
				}
			},
			clearTimer() {
				if (this.timer) {
					clearTimeout(this.timer)
				}
			},
			/**
			 *搜索结束
			 * *
			 */
			selectChange(val) {
				this.service_content = val
			},
			selectChange1(val) {
				this.service_proposal = val
			},
			// 获取 服务内容、跟进建议 以及填写的内容
			data_select() {
				let params = {
					job_type:this.jobtype,
					job_id:this.jobid,
				}
				this.$api.getBriefingsInfo(params).then(res=>{
					let listContent = []
					let listProposal = []
					if(res.data.shortcutContents.length>0)
					{
						res.data.shortcutContents.forEach((item,i)=>{
							if(item.type == 0)
							{
								listContent.push({value: item.content, label: item.content})
							}
							if(item.type==1){
								listProposal.push({value: item.content, label: item.content})
							}
						})
					}
					
					this.contentData = listContent
					this.proposalData = listProposal
					this.contentDataOld = listContent
					this.proposalDataOld = listProposal
					this.service_content = res.data.data.content.split(",")
					this.service_proposal = res.data.data.proposal.split(",")
				}).catch(err=>{
					console.log(err)
				})
			},
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
						job_id: this.jobid,
						job_type: this.jobtype,
						content: this.service_content,
						proposal: this.service_proposal
					}
					this.$api.editBriefings(params).then(res=>{
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
							});
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
