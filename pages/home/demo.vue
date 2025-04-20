<template>
    <view class="" style="padding: 100px 0;">
		
		<u-popup :show="popupShow" @close="popupClose" @open="popupOpen" :round="10">
            <view>
               <SignatureList :jobs="jobs" @updateJobList="updateJobList"></SignatureList>
            </view>
		</u-popup>
		<u-button @click="popupShow = true">打开</u-button>
		
        
    </view>
</template>
<script>
import SignatureList from '@/components/order/SignatureList.vue';
export default {
	components:{
		SignatureList
	},
    data() {
        return {
			jobid:4334813,
			jobtype:1,
			
			popupShow: true,
			jobs:[],
			
        }

    },
	onShow() {
		this.getSignOrder()
	},
    methods: {
		// 该客户有其他工单回调
		updateJobList(e){
			console.log('回调',e)
			this.jobs = e
		},
		// 当天同一客户单子
		getSignOrder(){
			let that = this
			let params = {
				job_id:that.jobid,
				job_type:that.jobtype,
			}
			that.$api.getDayCustomerSignOrder(params).then(res=>{
				console.log(res)
				this.jobs = res.data
			}).catch(err=>{
				// console.log(err)
			})
		},
		popupOpen() {
          // console.log('open');
        },
        popupClose() {
          this.popupShow = false
          // console.log('close');
        }
    }
}
</script>
