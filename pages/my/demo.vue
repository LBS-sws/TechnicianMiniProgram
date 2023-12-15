<template>
	<view class="container">
		
	</view>
</template>

<script>
	export default {

		data() {
			return {
				
			}
		},
		onLoad() {
			// uni.$utils.toast('成功','success',1500)
			// uni.$utils.toast('失败','error',1500)
			// uni.$utils.toast('加载中','loading',1500)
			// uni.$utils.toast('消息','none',1500)
			uni.$utils.toast('消息')
		},
		onShow() {
			
			// if(res.data.code == 400)
			// {
			// 	uni.$utils.toast(res.data.msg)
			// 	return false
			// }
			
			// this.$api.passwordLogin(params).then(res=>{
			// 		console.log(res)
			// 	}).catch(err=>{
			// 		console.log(err)
			// 	})
		},
		methods: {
			
			//...
		}
	}
</script>

<style lang="scss">
.container{ background: #fff; }
</style>
