<template>
	<view class="content">
		<!-- <camera device-position="back" flash="auto" style="width: 100%; height: 300px;"></camera> -->
		<hycamera v-if="show"  @runMethod="getCarmera"></hycamera>
		<button type="default" @click="runCarmera">打开摄像机</button>
	</view>
</template>

<script>
	import hycamera from "@/components/shusheng-hycamera/shusheng-hycamera.vue"
	export default {
		components: {
			hycamera
		},
		data() {
			return {
				show:true// false
			}
		},
		onLoad() {
			
		},
		methods: {
			runCarmera(){
				this.show = true
			},
			getCarmera(type,res){
				console.log(type,res)
				
				uni.showToast({
				    title: '成功'+type,
				    duration: 2000
				});
			}
		}
	}
</script>

<style>
	.content {}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
