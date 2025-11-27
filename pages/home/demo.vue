<template>
	<view class="content">
		<view>{{name}}</view>
		<view>{{code}}</view>
	</view>
</template>

<script>
import {BASE_URL} from '@/common/config'
export default {
	data() {
		return {
			user_id:'',
			name:'',
			code:'',
			domain:'',
			
		}
	},
	onLoad(index) {
		console.log(index)
		if(index.code){
			this.code = index.code
		}
	},
	onShow() {
		
		this.domain = BASE_URL.replace(/api/g, '');
		
		this.list()
	},
	methods: {
		list(){
			uni.request({
			    url: this.domain + 'Demo/login', //仅为示例，并非真实接口地址。
				method:'POST',
			    data: {
			        user: 'admini',
					pass: 'lbsgroup123',
					code: this.code
			    },
			    header: {
			        'custom-header': 'hello' //自定义请求头信息
			    },
			    success: (res) => {
			        
					// console.log(res.data.data);
			        uni.setStorageSync('token', res.data.data.token);
			        uni.setStorageSync('staffname', res.data.data.name);
			        uni.setStorageSync('user_id', res.data.data.user_id);
			        uni.setStorageSync('city', res.data.data.city);
			        uni.setStorageSync('officetel', res.data.data.officetel);
			        
					this.name = res.data.data.name
					
			        uni.showToast({
			        	title: '登录成功',
			        	icon: 'success'
			        })
					
			    }
			});
		}	
	}
}
</script>

<style lang="scss">

</style>
