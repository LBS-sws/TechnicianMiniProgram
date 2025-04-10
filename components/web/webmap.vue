<template>
	<view>
		<web-view :src="webUrl" bindmessage="handleMessage" style="width: 100%; height: 100%;"></web-view>22222222
		{{webUrl}}
	</view>
</template>

<script>
export default{
	props:{
		webUrl:{
			type:[String],
			default:''
		}
	},
	data(){
		// webUrl:'https://uat.teach.lbsapps.cn/map.html'
		return{
			
		}
	}
}
</script>

<style>
</style>