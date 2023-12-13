<template>
	<view class="content">
		<!-- <img class="abimg" src="http://lbsgroup.com.cn/images/banner/aboutUs_sc.jpg"></img>
		<view class="introduce">
		史伟莎集团于1998年在香港成立，引进专业的洗手间卫生管理概念及技术，提升客户的卫生环境。凭着多年的努力不懈，集团的业务版图已伸延至两岸四地及东南亚30多个城市。我们细心聆听、观察及思考客户所需，不断创新，并引入多样化的产品、服务以至概念，从而发展至「全面卫生解决方案」(Total Hygiene Solution)，务求满足不同的客户。
		</view>
		<view class="introduce" style="margin-top: 10px;">
			正因如此，我们透过旗下的各个品牌，提供至贴心产品及服务 :
		</view>
		
		<view class="sevice">
			<cl-row>
				<cl-col span="8">
					<img class="fwimg" src="https://www.lbshygiene.com.my/images/service/img_1_163_464.jpg?2112942711"></img>
				</cl-col>
				<cl-col span="16">
					<view class="servicetitle">
						全面灭虫管理
					</view>
					<view class="servicecontent">我们透过先进的技术及设备、经验丰富及有规模的服务团队和完善的售后服务，为客户提供优质的商业及家居灭虫服务。</view>
				</cl-col>
			</cl-row>
			<cl-row>
				<cl-col span="8">
					<img class="fwimg" src="https://www.lbshygiene.com.my/images/service/img_1_155_464.jpg?53391692"></img>
				</cl-col>
				<cl-col span="16">
					<view class="servicetitle">
						洗手间卫生服务
					</view>
					<view class="servicecontent">
					我们拥有独特的技术及专门的服务程序，使客户的洗手间卫生质素，达到一个无可比拟的水平:每星期的服务，确保洗手间的卫生质素，避免病菌污染及难闻气味。
					</view>
					</cl-col>
			</cl-row>
			<cl-row>
				<cl-col span="8">
					<img class="fwimg" src="https://www.lbshygiene.com.my/images/service/img_1_157_464.jpg?1195072373"></img>
				</cl-col>
				<cl-col span="16">
					<view class="servicetitle">
						雾化消毒
					</view>
					<view class="servicecontent">利用雾化机将消毒剂雾化，深入地为所有空间及实体表面进行消毒对墙壁、间隔、枱面、天花板、门柄、电灯开关等地方进行消毒您将拥有一个干净及宜人的卫生空间。
					</view>
					</cl-col>
			</cl-row>
		</view> -->
		
		<!-- 关于我们 -->
		<view v-if="content">
			{{content}}
		</view>
		
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
