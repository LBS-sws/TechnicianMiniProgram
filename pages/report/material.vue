<template>
	<view>
		<view v-for="(item,index) in papersData" :key="index" class="item">
			<view class="title">证明名称：{{item.papersname}}</view>
			<view class="date">生效日期：{{item.startDate}}</view>
			<view class="date">截止日期：{{item.endDate}}</view>
			<view class="thumb"><image :src="item.img" mode="widthFix"></image></view>
		</view>
	</view>
</template>
<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import Signature from '@/components/sin-signature/sin-signature.vue';
	import luPopupWrapper from "@/components/lu-popup-wrapper/lu-popup-wrapper.vue";
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd,
			Signature,
			luPopupWrapper,
		},
		data() {
			return {
				id:'',
				item:'',
				papersData:[]
			}
		},
		onLoad(options) {
			console.log(options)
			if(options.id){
				this.id = options.id
			}
		},
		onShow: function () {
			
			var that = this;
			this.getItem()
		 },
		methods: {

			getItem(){
				
				let param = {					
					id:this.id,
					city:uni.getStorageSync('city')
				}
				uni.request({
					url: `${this.$baseUrl}/MaterialItem`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {
						uni.hideLoading();
						if (res.data.code == 1) {
							
							this.item = res.data.data
		
							let imgArr = res.data.data.img_arr
							
							this.papersData = JSON.parse(imgArr)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
						}
				
					},
					fail: (err) => {
						// console.log(res);
					}
				})
			},
			
		}
	}
</script>

<style>
.item{ margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
.item .thumb{}
.item .thumb image{ width: 100%;}
.item .date{ font-size: 14px; padding: 0 10px; }
.item .title{ font-size: 18px; padding: 0 10px; }
</style>
