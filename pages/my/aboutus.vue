<template>
	<view class="content">
		<!-- 关于我们 -->
		<!-- <view v-if="content">
			{{content}}
			
		</view> -->
		<view v-html="content" v-if="content"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			content:""
		}
	},
	onLoad() {
		
	},
	onShow() {
		this.companyInfo()
	},
	methods: {
		companyInfo(){
			let params = {}
			uni.request({
				url: `${this.$baseUrl}/Content.Content/about`,
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('token')
				},
				method: 'GET',
				data: params,
				success: (res) => {
					if (res.data.code == 200) {
						console.log(res)
						this.content = res.data.data.content
					}
					if(res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						});
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/login/login"
							});
						}, 2000)
					}
			
				},
				fail: (err) => {
					console.log(err.errMsg);
				}
			})
		}
	}
}
</script>

<style>
.content{
	margin: 10px;
}
.abimg{
	width: 100%;
	height: 96px;
}
.introduce{
	text-indent:2em;
	font-size: 14px;
}
.sevice{
	font-size: 12px;	
}
.sevice cl-row{
	margin: 5px;
}
.fwimg{
	width: 110px;
	height: 75px;
	border: #C0C0C0 1px solid;
}
.servicetitle{
	font-size: 14px;
	color: #065bb3;
	font-weight: bolder;
}
.servicecontent{
	/* text-indent:2em; */
}
</style>
